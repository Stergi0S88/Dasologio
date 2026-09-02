<?php
declare(strict_types=1);

/**
 * Hosted checkout session creator. Card data never touches this site.
 * Copy checkout.config.sample.php to checkout.config.php on Plesk and fill secrets there.
 * Do not commit checkout.config.php.
 */

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  exit('Method not allowed');
}

function fail_checkout(int $status, string $message): void {
  http_response_code($status);
  header('Content-Type: text/plain; charset=utf-8');
  exit($message);
}

function catalog_path(): string {
  $candidates = [
    dirname(__DIR__) . '/tours-catalog.json',
    dirname(__DIR__, 2) . '/tours-catalog.json',
  ];
  foreach ($candidates as $path) {
    if (is_file($path)) return $path;
  }
  fail_checkout(500, 'Tour catalog is missing.');
}

function load_config(): array {
  $file = __DIR__ . '/checkout.config.php';
  if (!is_file($file)) {
    fail_checkout(503, 'Checkout is not configured. Copy checkout.config.sample.php to checkout.config.php on the server.');
  }
  $config = require $file;
  return is_array($config) ? $config : [];
}

function find_tour(array $catalog, string $slug): ?array {
  foreach ($catalog as $tour) {
    if (($tour['slug'] ?? '') === $slug) return $tour;
  }
  return null;
}

function post_form(string $url, array $fields, array $headers = []): array {
  $body = http_build_query($fields);
  $headerLines = array_merge(['Content-Type: application/x-www-form-urlencoded'], $headers);
  $context = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => implode("\r\n", $headerLines),
      'content' => $body,
      'ignore_errors' => true,
      'timeout' => 30,
    ],
  ]);
  $raw = @file_get_contents($url, false, $context);
  $status = 0;
  if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $match)) {
    $status = (int) $match[1];
  }
  $decoded = json_decode((string) $raw, true);
  return ['status' => $status, 'json' => is_array($decoded) ? $decoded : [], 'raw' => (string) $raw];
}

$slug = preg_replace('/[^a-z0-9-]/', '', strtolower((string) ($_POST['tourSlug'] ?? '')));
$date = (string) ($_POST['date'] ?? '');
$participants = (int) ($_POST['participants'] ?? 0);
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$language = ($_POST['language'] ?? '') === 'en' ? 'en' : 'el';
$payMode = ($_POST['payMode'] ?? '') === 'deposit' ? 'deposit' : 'full';

if ($slug === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) fail_checkout(400, 'Invalid booking details.');
if ($participants < 1 || $participants > 40) fail_checkout(400, 'Invalid group size.');
if (strlen($name) < 2 || strlen($name) > 120) fail_checkout(400, 'Invalid name.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail_checkout(400, 'Invalid email.');
if ($phone !== '' && !preg_match('/^[+0-9][0-9() .\-]{6,38}$/', $phone)) fail_checkout(400, 'Invalid phone.');

$chosen = DateTimeImmutable::createFromFormat('Y-m-d', $date);
$today = new DateTimeImmutable('today');
if (!$chosen || $chosen < $today) fail_checkout(400, 'Choose a future date.');

$catalog = json_decode((string) file_get_contents(catalog_path()), true);
if (!is_array($catalog)) fail_checkout(500, 'Tour catalog is invalid.');
$tour = find_tour($catalog, $slug);
if (!$tour) fail_checkout(404, 'Unknown tour.');
$max = (int) ($tour['maxGroupSize'] ?? 0);
if ($participants > $max) fail_checkout(400, 'Group is larger than the published maximum.');
$openDates = $tour['availableDates'] ?? [];
if (is_array($openDates) && $openDates && !in_array($date, $openDates, true)) fail_checkout(400, 'Date is not available.');

$price = (float) ($tour['priceEur'] ?? 0);
$depositPercent = (int) ($tour['depositPercent'] ?? 100);
if ($price < 1) fail_checkout(500, 'Tour price is not published.');
$unit = $payMode === 'deposit' ? ($price * $depositPercent / 100) : $price;
$amountEur = round($unit * $participants, 2);
$amountCents = (int) round($amountEur * 100);
if ($amountCents < 100) fail_checkout(400, 'Amount is too small.');

$config = load_config();
$siteUrl = rtrim((string) ($config['site_url'] ?? 'https://www.dasologio.com'), '/');
$success = $siteUrl . ($language === 'en' ? '/en/booking/success/' : '/booking/success/');
$cancel = $siteUrl . ($language === 'en' ? '/en/booking/cancel/' : '/booking/cancel/');
$provider = strtolower((string) ($config['provider'] ?? 'stripe'));
$label = $language === 'en' ? ($tour['titleEn'] ?: $tour['title']) : ($tour['title'] ?? $slug);
$description = sprintf('%s · %s · %d pax · %s', $label, $date, $participants, $payMode);

if ($provider === 'stripe') {
  $secret = (string) ($config['stripe_secret_key'] ?? '');
  if ($secret === '' || !str_starts_with($secret, 'sk_')) fail_checkout(503, 'Stripe is not configured.');
  $response = post_form('https://api.stripe.com/v1/checkout/sessions', [
    'mode' => 'payment',
    'success_url' => $success,
    'cancel_url' => $cancel,
    'customer_email' => $email,
    'line_items[0][quantity]' => 1,
    'line_items[0][price_data][currency]' => 'eur',
    'line_items[0][price_data][unit_amount]' => $amountCents,
    'line_items[0][price_data][product_data][name]' => $label,
    'line_items[0][price_data][product_data][description]' => $description,
    'metadata[tourSlug]' => $slug,
    'metadata[date]' => $date,
    'metadata[participants]' => (string) $participants,
    'metadata[payMode]' => $payMode,
    'metadata[name]' => $name,
    'metadata[phone]' => $phone,
    'metadata[language]' => $language,
  ], ['Authorization: Bearer ' . $secret]);
  $url = $response['json']['url'] ?? '';
  if ($response['status'] >= 400 || $url === '') fail_checkout(502, 'Could not start Stripe Checkout.');
  header('Location: ' . $url, true, 303);
  exit;
}

if ($provider === 'viva') {
  $clientId = (string) ($config['viva_client_id'] ?? '');
  $clientSecret = (string) ($config['viva_client_secret'] ?? '');
  $sourceCode = (string) ($config['viva_source_code'] ?? '');
  $apiBase = rtrim((string) ($config['viva_api_base'] ?? 'https://demo-api.vivapayments.com'), '/');
  if ($clientId === '' || $clientSecret === '') fail_checkout(503, 'Viva Wallet is not configured.');
  $token = post_form($apiBase . '/connect/token', [
    'grant_type' => 'client_credentials',
  ], ['Authorization: Basic ' . base64_encode($clientId . ':' . $clientSecret)]);
  $access = $token['json']['access_token'] ?? '';
  if ($access === '') fail_checkout(502, 'Could not authenticate with Viva Wallet.');
  $orderBody = json_encode([
    'amount' => $amountCents,
    'customerTrns' => $description,
    'customer' => ['email' => $email, 'fullName' => $name, 'phone' => $phone, 'countryCode' => 'GR', 'requestLang' => $language === 'en' ? 'en-GB' : 'el-GR'],
    'paymentTimeout' => 1800,
    'preauth' => false,
    'sourceCode' => $sourceCode,
    'merchantTrns' => $slug . '|' . $date . '|' . $participants . '|' . $payMode,
    'tags' => [$slug, $payMode],
  ], JSON_UNESCAPED_UNICODE);
  $orderContext = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => "Authorization: Bearer {$access}\r\nContent-Type: application/json",
      'content' => $orderBody,
      'ignore_errors' => true,
      'timeout' => 30,
    ],
  ]);
  $orderRaw = @file_get_contents($apiBase . '/checkout/v2/orders', false, $orderContext);
  $order = json_decode((string) $orderRaw, true);
  $orderCode = $order['orderCode'] ?? '';
  if ($orderCode === '') fail_checkout(502, 'Could not start Viva Smart Checkout.');
  $smart = $apiBase === 'https://api.vivapayments.com'
    ? 'https://www.vivapayments.com/web/checkout?ref='
    : 'https://demo.vivapayments.com/web/checkout?ref=';
  header('Location: ' . $smart . urlencode((string) $orderCode), true, 303);
  exit;
}

fail_checkout(500, 'Unknown checkout provider.');

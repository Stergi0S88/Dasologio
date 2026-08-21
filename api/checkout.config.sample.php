<?php
/**
 * Copy this file to checkout.config.php on Plesk and fill real secrets.
 * checkout.config.php must never be committed to git.
 */
return [
  'provider' => 'stripe',
  'site_url' => 'https://www.dasologio.com',
  'stripe_secret_key' => '',
  'viva_client_id' => '',
  'viva_client_secret' => '',
  'viva_source_code' => '',
  'viva_api_base' => 'https://demo-api.vivapayments.com',
];

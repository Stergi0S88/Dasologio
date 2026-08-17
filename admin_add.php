<?php
// ======================================================
// ===  Αρχείο: admin_add.php
// ===  Περιγραφή: Σελίδα διαχείρισης για την προσθήκη νέου άρθρου.
// ======================================================

// ===== ΡΥΘΜΙΣΕΙΣ ΒΑΣΗΣ ΔΕΔΟΜΕΝΩΝ =====
$host     = "localhost";
$dbname   = "m194209ele_";
$username = "lefteris";
$password = "x6sh58E*6";

// Εμφάνιση σφαλμάτων για debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ===== ΣΥΝΔΕΣΗ ΣΤΗ ΒΑΣΗ ΔΕΔΟΜΕΝΩΝ =====
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Σφάλμα σύνδεσης: " . $conn->connect_error);
}
mysqli_set_charset($conn, 'utf8mb4');

// Έναρξη session και δημιουργία CSRF token
session_start();
if (empty($_SESSION['form_token'])) {
    $_SESSION['form_token'] = bin2hex(random_bytes(16));
}

$ok    = isset($_GET['ok']);
$error = "";

// ===== ΕΠΕΞΕΡΓΑΣΙΑ ΥΠΟΒΟΛΗΣ ΦΟΡΜΑΣ =====
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Έλεγχος του CSRF token για ασφάλεια
    if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['form_token']) {
        die('Μη έγκυρη υποβολή φόρμας (token).');
    }
    
    // Αφαίρεση περιττών κενών (trim) και λήψη των δεδομένων
    $title   = trim($_POST['title']   ?? '');
    $content = trim($_POST['content'] ?? '');
    $author  = trim($_POST['author']  ?? '');

    // Έλεγχος αν όλα τα πεδία είναι συμπληρωμένα
    if (empty($title) || empty($content) || empty($author)) {
        $error = 'Παρακαλώ συμπλήρωσε όλα τα πεδία.';
    } else {
        // Χρήση prepared statement για αποφυγή SQL Injection
        $stmt = $conn->prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $title, $content, $author);
        
        if (!$stmt->execute()) {
            $error = "Σφάλμα κατά την αποθήκευση: " . $stmt->error;
        }
        $stmt->close();
        
        // Δημιουργία νέου token και ανακατεύθυνση (redirect)
        $_SESSION['form_token'] = bin2hex(random_bytes(16));
        header("Location: /admin_add.php?ok=1");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <title>Προσθήκη Νέου Άρθρου</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1a73e8;
            text-align: center;
        }
        .message {
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
            text-align: center;
        }
        .message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        form label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        form input[type="text"],
        form textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box; /* Για να μην ξεφεύγει το πλάτος */
        }
        form button {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        form button:hover {
            background-color: #145cb7;
        }
    </style>
</head>
<body>
<div class="container">
    <?php if ($error): ?>
        <div class="message error">
            <p>❌ <?= htmlspecialchars($error) ?></p>
        </div>
    <?php elseif ($ok): ?>
        <div class="message success">
            <p>✅ Το άρθρο προστέθηκε με επιτυχία!</p>
        </div>
    <?php endif; ?>

    <h1>📝 Προσθήκη Νέου Άρθρου</h1>
    <form method="post" action="/admin_add.php" autocomplete="off">
        <input type="hidden" name="token" value="<?= htmlspecialchars($_SESSION['form_token']) ?>">
        
        <label for="title">Τίτλος:</label>
        <input type="text" id="title" name="title" required>

        <label for="content">Περιεχόμενο:</label>
        <textarea id="content" name="content" rows="10" required></textarea>

        <label for="author">Συγγραφέας:</label>
        <input type="text" id="author" name="author" required>

        <button type="submit">Καταχώρηση</button>
    </form>
</div>
</body>
</html>
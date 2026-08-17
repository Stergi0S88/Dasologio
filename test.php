<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $school = htmlspecialchars($_POST['school']);
    echo "<h1>Επιτυχία!</h1>";
    echo "<p>Ο server έλαβε το σχολείο: <strong>" . $school . "</strong></p>";
} else {
    echo "Περιμένω δεδομένα...";
}
?>
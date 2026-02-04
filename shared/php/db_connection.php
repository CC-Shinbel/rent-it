<?php
// filepath: c:\xampp\htdocs\rent-it\shared\php\db_connection.php

// ===== DYNAMIC BASE URL CONFIGURATION =====
if (!defined('BASE_URL')) {
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    // Localhost (XAMPP) = /rent-it, Production = empty or custom
    define('BASE_URL', (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false) ? '/rent-it' : '');
}

// ===== DATABASE CONNECTION =====
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "rental_system";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
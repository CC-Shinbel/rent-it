<?php
// filepath: c:\xampp\htdocs\rent-it\client\catalog\catalog.php
session_start();
include '../../shared/php/db_connection.php';

// Security: Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

$query = "SELECT * FROM item";
$result = mysqli_query($conn, $query);

// JSON API mode for React catalog (used by ClientCatalogPage.jsx)
if (isset($_GET['format']) && $_GET['format'] === 'json') {
    $items = [];
    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $items[] = $row;
        }
    }

    // Allow React dev server to call this endpoint with cookies
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
    echo json_encode(['items' => $items]);
    exit();
}
header('Location: /frontend/index.html');
exit();
?>


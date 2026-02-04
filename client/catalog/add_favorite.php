<?php
include '../../shared/php/db_connection.php';
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'User not logged in.';
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['item_id'])) {
    $item_id = $_POST['item_id'];
    $action = $_POST['action'] ?? 'add';

    if ($action === 'add') {
        $query = "INSERT IGNORE INTO favorites (user_id, item_id) VALUES (?, ?)";
    } else {
        $query = "DELETE FROM favorites WHERE user_id = ? AND item_id = ?";
    }

    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $user_id, $item_id);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = ($action === 'add') 
            ? 'Added to favorites' 
            : 'Removed from favorites';
    } else {
        $response['message'] = $stmt->error;
    }

    $stmt->close();
} else {
    $response['message'] = 'Invalid request.';
}

echo json_encode($response);
$conn->close();

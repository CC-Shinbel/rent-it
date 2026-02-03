<?php
include '../../shared/php/db_connection.php';
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

$user_id = $_SESSION['id'] ?? 1; 

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['item_id'])) {
    $item_id = $_POST['item_id'];
    $action = $_POST['action'] ?? 'add';

    if ($action === 'add') {
        $query = "INSERT IGNORE INTO favorites (id, item_id) VALUES (?, ?)";
    } else {
        $query = "DELETE FROM favorites WHERE id = ? AND item_id = ?";
    }

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ii", $user_id, $item_id);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['message'] = "Database error: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['message'] = "Prepare statement failed.";
    }
} else {
    $response['message'] = "Invalid request.";
}

echo json_encode($response);
$conn->close();
<?php
session_start();
include '../../shared/php/db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['id'] ?? 1; 
    $item_id = $_POST['item_id'] ?? null;

    if ($item_id) {
        $stmt = $conn->prepare("DELETE FROM favorites WHERE id = ? AND item_id = ?");
        $stmt->bind_param("ii", $user_id, $item_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No Item ID provided']);
    }
}
<?php
session_start();
include '../../shared/php/db_connection.php'; 

if (!isset($_SESSION['user_id'])) {
    echo "Login required";
    exit();
}

$user_id = $_SESSION['user_id'];

// Kunin ang Item ID, Start Date, at End Date
$item_id = $_REQUEST['item_id'] ?? $_GET['id'] ?? null;
$start_date = $_POST['start_date'] ?? null; // Dapat galing sa input date ng modal
$end_date = $_POST['end_date'] ?? null;     // Dapat galing sa input date ng modal

if (!$item_id) {
    echo "Invalid Request";
    exit();
}

// 1. Siguraduhin na may dates (Optional: Pwedeng lagyan ng default kung wala)
if (!$start_date || !$end_date) {
    // Halimbawa: Default ay NOW hanggang bukas kung walang pinili
    $start_date = date('Y-m-d');
    $end_date = date('Y-m-d', strtotime('+1 day'));
}

// 2. Check duplicate (Gamit ang prepared statement para sa security)
$check_query = "SELECT id FROM cart WHERE user_id=? AND item_id=?";
$stmt = $conn->prepare($check_query);
$stmt->bind_param("ii", $user_id, $item_id);
$stmt->execute();
$check_result = $stmt->get_result();

if ($check_result->num_rows == 0) {
    // 3. FIX: Isama na ang start_date at end_date sa INSERT
    $insert_query = "INSERT INTO cart (user_id, item_id, start_date, end_date) VALUES (?, ?, ?, ?)";
    $stmt_insert = $conn->prepare($insert_query);
    $stmt_insert->bind_param("iiss", $user_id, $item_id, $start_date, $end_date);
    $stmt_insert->execute();
} else {
    // Optional: I-update ang dates kung existing na ang item
    $update_query = "UPDATE cart SET start_date = ?, end_date = ? WHERE user_id = ? AND item_id = ?";
    $stmt_update = $conn->prepare($update_query);
    $stmt_update->bind_param("ssii", $start_date, $end_date, $user_id, $item_id);
    $stmt_update->execute();
}

// Redirect o Success response
if (isset($_GET['id'])) {
    header("Location: cart.php");
    exit();
}
echo "Success";
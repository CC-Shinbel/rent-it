<?php
session_start();
include('../../shared/php/db_connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cart_id'])) {
   // Burahin ang "with" sa mysqli_real_escape_string (Line 6)
$cart_id = mysqli_real_escape_string($conn, $_POST['cart_id']); 
$start_date = mysqli_real_escape_string($conn, $_POST['start_date']);
$end_date = mysqli_real_escape_string($conn, $_POST['end_date']);

// Siguraduhin na 'id' ang column name sa table mo, hindi 'cart_id'
$update_query = "UPDATE cart SET start_date = '$start_date', end_date = '$end_date' WHERE id = '$cart_id'";
    
    if (mysqli_query($conn, $update_query)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
    }
}
?>
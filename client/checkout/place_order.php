<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
include_once($_SERVER['DOCUMENT_ROOT'] . '/rent-it/shared/php/db_connection.php');

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("Session expired. Please login again.");
    }

    $user_id = $_SESSION['user_id'];
    $total_price = $_POST['grand_total'] ?? 0;
    $venue = $_POST['venue'] ?? 'Not Specified';

    $conn->begin_transaction();

    $stmt = $conn->prepare("INSERT INTO rental (user_id, rental_status, total_price, venue, start_date, end_date) VALUES (?, 'Active', ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY))");
    $stmt->bind_param("ids", $user_id, $total_price, $venue);
    
    if (!$stmt->execute()) {
        throw new Exception("Database Error (Rental): " . $conn->error);
    }
    
    $order_id = $conn->insert_id;

    $cart_query = "SELECT c.item_id, i.price_per_day FROM cart c JOIN item i ON c.item_id = i.item_id WHERE c.user_id = ?";
    $stmt_cart = $conn->prepare($cart_query);
    $stmt_cart->bind_param("i", $user_id);
    $stmt_cart->execute();
    $cart_result = $stmt_cart->get_result();

    if ($cart_result->num_rows === 0) {
        throw new Exception("Your cart is empty.");
    }

    $stmt_ri = $conn->prepare("INSERT INTO rental_item (order_id, item_id, item_price, item_status) VALUES (?, ?, ?, 'Rented')");
    
    while ($item = $cart_result->fetch_assoc()) {
        $item_id = $item['item_id'];
        $price = $item['price_per_day'];
        $stmt_ri->bind_param("iid", $order_id, $item_id, $price);
        $stmt_ri->execute();
    }

    $conn->query("DELETE FROM cart WHERE user_id = $user_id");

    $conn->commit();
    echo json_encode(['status' => 'success', 'order_id' => $order_id]);

} catch (Exception $e) {
    if (isset($conn)) $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
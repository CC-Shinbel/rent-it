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
    
    /**
     * FIX: Kunin ang number of days mula sa POST request.
     * Siguraduhin na sa Checkout JS mo, nagpapasa ka ng 'rental_days'.
     */
    $days = isset($_POST['rental_days']) ? intval($_POST['rental_days']) : 1;

    $conn->begin_transaction();

    /**
     * New orders start as Pending so admin can process/confirm before they become Active.
     */
    $query = "INSERT INTO rental (user_id, rental_status, total_price, venue, start_date, end_date) 
              VALUES (?, 'Pending', ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))";
    
    $stmt = $conn->prepare($query);
    
    // Bind parameters: i (user_id), d (total_price), s (venue), i (days)
    $stmt->bind_param("idsi", $user_id, $total_price, $venue, $days);
    
    if (!$stmt->execute()) {
        throw new Exception("Database Error (Rental): " . $conn->error);
    }
    
    $order_id = $conn->insert_id;

    // Only include cart rows that were selected for checkout (passed from frontend)
    $cart_ids_raw = $_POST['cart_ids'] ?? '';
    $cart_ids = [];
    if ($cart_ids_raw !== '') {
        $decoded = json_decode($cart_ids_raw, true);
        if (is_array($decoded)) {
            foreach ($decoded as $id) {
                $id = (int) $id;
                if ($id > 0) {
                    $cart_ids[] = $id;
                }
            }
        }
    }

    if (count($cart_ids) === 0) {
        throw new Exception("No cart items selected for checkout.");
    }

    $placeholders = implode(',', array_fill(0, count($cart_ids), '?'));
    $cart_query = "SELECT c.id, c.item_id, i.price_per_day FROM cart c JOIN item i ON c.item_id = i.item_id WHERE c.user_id = ? AND c.id IN ($placeholders)";
    $stmt_cart = $conn->prepare($cart_query);
    $types = 'i' . str_repeat('i', count($cart_ids));
    $params = array_merge([$user_id], $cart_ids);
    $refs = [];
    foreach (array_keys($params) as $i) {
        $refs[$i] = &$params[$i];
    }
    call_user_func_array([$stmt_cart, 'bind_param'], array_merge([$types], $refs));
    $stmt_cart->execute();
    $cart_result = $stmt_cart->get_result();

    if ($cart_result->num_rows === 0) {
        throw new Exception("Selected cart items not found or already checked out.");
    }

    $stmt_ri = $conn->prepare("INSERT INTO rental_item (order_id, item_id, item_price, item_status) VALUES (?, ?, ?, 'Reserved')");

    while ($item = $cart_result->fetch_assoc()) {
        $item_id = $item['item_id'];
        $price = $item['price_per_day'];
        $stmt_ri->bind_param("iid", $order_id, $item_id, $price);
        $stmt_ri->execute();
    }

    // Remove only the cart rows that were checked out
    $stmt_delete = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND id IN ($placeholders)");
    call_user_func_array([$stmt_delete, 'bind_param'], array_merge([$types], $refs));
    $stmt_delete->execute();

    $conn->commit();
    echo json_encode(['status' => 'success', 'order_id' => $order_id]);

} catch (Exception $e) {
    if (isset($conn) && $conn->connect_errno == 0) $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
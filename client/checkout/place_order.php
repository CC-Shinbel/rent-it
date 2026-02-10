<?php
session_start();
include_once($_SERVER['DOCUMENT_ROOT'] . '/rent-it/shared/php/db_connection.php');

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("Session expired. Please login again.");
    }

    $user_id = $_SESSION['user_id'];
    $total_price = $_POST['grand_total'] ?? 0;
    $venue = $_POST['venue'] ?? 'Home Delivery';
    
    // Kunin ang cart_ids mula sa JavaScript (e.g., "12,15")
    $cart_ids = $_POST['cart_ids'] ?? '';

    if (empty($cart_ids)) {
        throw new Exception("No items selected for checkout.");
    }

    $conn->begin_transaction();

    // 1. FIX: Kunin lang ang SELECTED items gamit ang IN ($cart_ids)
    // Dito natin masisiguro na hindi mag-1970 ang date dahil tama ang mahihila nating row
    $cart_query = "SELECT c.item_id, i.price_per_day, c.start_date, c.end_date 
                   FROM cart c 
                   JOIN item i ON c.item_id = i.item_id 
                   WHERE c.user_id = ? AND c.id IN ($cart_ids)";
    
    $stmt_cart = $conn->prepare($cart_query);
    $stmt_cart->bind_param("i", $user_id);
    $stmt_cart->execute();
    $cart_result = $stmt_cart->get_result();

    if ($cart_result->num_rows === 0) {
        throw new Exception("Selected items not found in your cart.");
    }

    // Kunin ang dates mula sa unang item para sa main rental table summary
    $first_item = $cart_result->fetch_assoc();
    $s_date = $first_item['start_date'];
    $e_date = $first_item['end_date'];
    
    // I-reset ang pointer para sa loop ng rental_item mamaya
    $cart_result->data_seek(0);

    // 2. Insert sa main Rental table
    $query = "INSERT INTO rental (user_id, rental_status, total_price, venue, start_date, end_date) 
              VALUES (?, 'Pending', ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("idsss", $user_id, $total_price, $venue, $s_date, $e_date);
    
    if (!$stmt->execute()) {
        throw new Exception("Database Error (Rental): " . $conn->error);
    }
    
    $order_id = $conn->insert_id;

    // 3. Insert bawat item sa rental_item table
    $stmt_ri = $conn->prepare("INSERT INTO rental_item (order_id, item_id, item_price, item_status) VALUES (?, ?, ?, 'Rented')");
    
    while ($item = $cart_result->fetch_assoc()) {
        $item_id = $item['item_id'];
        $price = $item['price_per_day'];
        $stmt_ri->bind_param("iid", $order_id, $item_id, $price);
        $stmt_ri->execute();
    }

    // 4. FIX: Burahin LANG ang mga items na binili (gamit ang IN clause)
    // Para kung may itinira siyang items sa cart, nandoon pa rin yun.
    $delete_query = "DELETE FROM cart WHERE user_id = ? AND id IN ($cart_ids)";
    $stmt_delete = $conn->prepare($delete_query);
    $stmt_delete->bind_param("i", $user_id);
    $stmt_delete->execute();

    $conn->commit();
    echo json_encode(['status' => 'success', 'order_id' => $order_id]);

} catch (Exception $e) {
    if (isset($conn)) $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
<?php
session_start();
include '../../shared/php/db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
   // ===== ACTIVE RENTALS =====
$activeQuery = "
SELECT 
    r.order_id AS rental_code, 
    i.item_name AS name,
    r.start_date,
    r.end_date,
    r.rental_status AS status,
    i.image AS image,
  DATEDIFF(r.end_date, CURDATE()) AS days_left
FROM rental r
LEFT JOIN rental_item ri ON r.order_id = ri.order_id
LEFT JOIN item i ON ri.item_id = i.item_id 
WHERE r.user_id = ? AND r.rental_status = 'Active'
";

    $stmtActive = $conn->prepare($activeQuery);
    $stmtActive->bind_param("i", $user_id);
    $stmtActive->execute();
    $resultActive = $stmtActive->get_result();
    $activeRentals = $resultActive->fetch_all(MYSQLI_ASSOC);


   // ===== BOOKING HISTORY =====
$historyQuery = "
SELECT 
    r.order_id AS rental_code,
    GROUP_CONCAT(i.item_name SEPARATOR ', ') AS name,
    r.start_date,
    r.end_date,
    r.rental_status AS status,
    r.total_price AS total_amount
FROM rental r
LEFT JOIN rental_item ri ON r.order_id = ri.order_id
LEFT JOIN item i ON ri.item_id = i.item_id
WHERE r.user_id = ?
GROUP BY r.order_id;
";

    $stmtHistory = $conn->prepare($historyQuery);
    $stmtHistory->bind_param("i", $user_id);
    $stmtHistory->execute();
    $resultHistory = $stmtHistory->get_result();
    $history = $resultHistory->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'active' => $activeRentals,
        'history' => $history
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
echo json_encode([
    'success' => true,
   
    'active' => $activeRentals,
    'history' => $history
]);
}
?>

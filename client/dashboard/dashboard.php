<?php
session_start();
include '../../shared/php/db_connection.php'; 

// Pure JSON API for client dashboard (React frontend)
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id']; 

// Optional: still handle POST actions for return/extend if needed
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    $order_id = intval($_POST['order_id']);
    $action = $_POST['action'];

    if ($action == 'return') {
        $update_query = "UPDATE RENTAL SET rental_status = 'Pending Return' WHERE order_id = $order_id AND user_id = $user_id";
    } elseif ($action == 'extend') {
        $update_query = "UPDATE RENTAL SET rental_status = 'Pending Extension' WHERE order_id = $order_id AND user_id = $user_id";
    }

    if (isset($update_query)) {
        mysqli_query($conn, $update_query);
    }
}

// User info
$user_query = mysqli_query($conn, "SELECT full_name, membership_level FROM USERS WHERE id = $user_id");
$user_data = mysqli_fetch_assoc($user_query) ?: ['full_name' => 'User', 'membership_level' => 'Bronze'];

// Totals
$res_spent   = mysqli_query($conn, "SELECT SUM(total_price) AS total FROM RENTAL WHERE user_id = $user_id");
$total_spent = ($res_spent && ($row = mysqli_fetch_assoc($res_spent))) ? (float) $row['total'] : 0;

$res_active   = mysqli_query($conn, "SELECT COUNT(*) AS active_count FROM RENTAL WHERE user_id = $user_id AND rental_status IN ('Active','Rented', 'Pending Extension')");
$active_count = ($res_active && ($row = mysqli_fetch_assoc($res_active))) ? (int) $row['active_count'] : 0;

$res_upcoming     = mysqli_query($conn, "SELECT COUNT(*) AS upcoming FROM RENTAL WHERE user_id = $user_id AND rental_status IN ('Returned')");
$upcoming_returns = ($res_upcoming && ($row = mysqli_fetch_assoc($res_upcoming))) ? (int) $row['upcoming'] : 0;

// Active rentals
$active_rentals = [];
$active_rentals_query = "
    SELECT r.*, i.item_name
    FROM RENTAL r
    LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id
    LEFT JOIN ITEM i ON ri.item_id = i.item_id
    WHERE r.user_id = $user_id
      AND r.rental_status IN ('Active','Rented', 'Pending Extension')
    GROUP BY r.order_id
";
if ($res = mysqli_query($conn, $active_rentals_query)) {
    while ($row = mysqli_fetch_assoc($res)) {
        $active_rentals[] = [
            'order_id'           => (int) $row['order_id'],
            'item_name'          => $row['item_name'],
            'end_date'           => $row['end_date'],
            'formatted_end_date' => date('M d, Y', strtotime($row['end_date'])),
            'rental_status'      => $row['rental_status'],
        ];
    }
}

// History
$history = [];
$history_query = "
    SELECT r.*, i.item_name
    FROM RENTAL r
    LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id
    LEFT JOIN ITEM i ON ri.item_id = i.item_id
    WHERE r.user_id = $user_id
      AND r.rental_status IN ('Active', 'Returned', 'Extended')
    ORDER BY r.start_date DESC
    LIMIT 5
";
if ($res = mysqli_query($conn, $history_query)) {
    while ($row = mysqli_fetch_assoc($res)) {
        $history[] = [
            'order_id'              => (int) $row['order_id'],
            'item_name'             => $row['item_name'],
            'start_date'            => $row['start_date'],
            'end_date'              => $row['end_date'],
            'formatted_period'      => date('M d', strtotime($row['start_date'])) . ' - ' . date('M d', strtotime($row['end_date'])),
            'total_price'           => (float) $row['total_price'],
            'formatted_total_price' => number_format($row['total_price'], 2),
            'rental_status'         => $row['rental_status'],
        ];
    }
}

$member_status = $user_data['membership_level'] ?? 'Bronze';

// CORS + JSON headers for React client (dev origin)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

echo json_encode([
    'user' => [
        'full_name'        => $user_data['full_name'] ?? 'User',
        'membership_level' => $member_status,
    ],
    'totals' => [
        'total_spent'      => $total_spent,
        'active_count'     => $active_count,
        'upcoming_returns' => $upcoming_returns,
    ],
    'active_rentals' => $active_rentals,
    'history'        => $history,
]);
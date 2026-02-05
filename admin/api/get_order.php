<?php
/**
 * Get Order Detail API
 * Fetches a single order's details from the database
 */
require_once __DIR__ . '/../../config.php';

header('Content-Type: application/json');

// Get order ID
$orderId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$orderId) {
    echo json_encode(['success' => false, 'message' => 'Order ID is required']);
    exit;
}

// Fetch order details
$orderQuery = "SELECT r.order_id, r.user_id, r.rental_status, r.total_price, r.late_fee,
                      r.venue, r.customer_address, r.start_date, r.end_date,
                      u.full_name as customer_name, u.email as customer_email, 
                      u.phone as customer_phone
               FROM rental r
               LEFT JOIN users u ON r.user_id = u.id
               WHERE r.order_id = ?";

$stmt = mysqli_prepare($conn, $orderQuery);
mysqli_stmt_bind_param($stmt, "i", $orderId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    echo json_encode(['success' => false, 'message' => 'Order not found']);
    exit;
}

$order = mysqli_fetch_assoc($result);

// Fetch order items
$itemsQuery = "SELECT ri.rental_item_id, ri.item_id, ri.item_price, ri.item_status,
                      i.item_name, i.description, i.category, i.image, i.price_per_day
               FROM rental_item ri
               LEFT JOIN item i ON ri.item_id = i.item_id
               WHERE ri.order_id = ?";

$stmtItems = mysqli_prepare($conn, $itemsQuery);
mysqli_stmt_bind_param($stmtItems, "i", $orderId);
mysqli_stmt_execute($stmtItems);
$itemsResult = mysqli_stmt_get_result($stmtItems);

$items = [];
$startDate = new DateTime($order['start_date']);
$endDate = new DateTime($order['end_date']);
$duration = $startDate->diff($endDate)->days + 1;

while ($item = mysqli_fetch_assoc($itemsResult)) {
    $items[] = [
        'id' => $item['item_id'],
        'name' => $item['item_name'] ?? 'Unknown Item',
        'category' => $item['category'] ?? 'Equipment',
        'image' => $item['image'],
        'description' => $item['description'],
        'quantity' => 1,
        'dailyRate' => floatval($item['price_per_day'] ?? 0),
        'subtotal' => floatval($item['item_price'] ?? 0) * $duration,
        'status' => $item['item_status']
    ];
}

// Map status
$statusMap = [
    'Pending' => 'pending',
    'Booked' => 'confirmed',
    'Confirmed' => 'confirmed',
    'In Transit' => 'out_for_delivery',
    'Active' => 'active',
    'Pending Return' => 'return_scheduled',
    'Returned' => 'returned',
    'Completed' => 'completed',
    'Cancelled' => 'cancelled'
];

// Calculate payment breakdown
$subtotal = floatval($order['total_price']);
$lateFee = floatval($order['late_fee'] ?? 0);
$deliveryFee = 50.00; // Default delivery fee
$tax = 0; // Can be calculated if needed

// Build timeline based on status
$currentStatus = $order['rental_status'];
$statusOrder = ['Pending', 'Booked', 'Confirmed', 'In Transit', 'Active', 'Pending Return', 'Returned', 'Completed'];
$statusIndex = array_search($currentStatus, $statusOrder);
if ($statusIndex === false) $statusIndex = 0;

$timelineEvents = [
    ['event' => 'Order Placed', 'date' => $order['start_date'], 'completed' => true],
    ['event' => 'Order Confirmed', 'date' => $statusIndex >= 1 ? $order['start_date'] : null, 'completed' => $statusIndex >= 1],
    ['event' => 'Out for Delivery', 'date' => $statusIndex >= 3 ? $order['start_date'] : null, 'completed' => $statusIndex >= 3],
    ['event' => 'Delivered / Active', 'date' => $statusIndex >= 4 ? $order['start_date'] : null, 'completed' => $statusIndex >= 4],
    ['event' => 'Returned', 'date' => $statusIndex >= 6 ? $order['end_date'] : null, 'completed' => $statusIndex >= 6]
];

// Mark current step
foreach ($timelineEvents as $idx => &$event) {
    if (!$event['completed'] && ($idx === 0 || $timelineEvents[$idx - 1]['completed'])) {
        $event['current'] = true;
        break;
    }
}

// Build response
$response = [
    'success' => true,
    'data' => [
        'id' => 'ORD-' . str_pad($order['order_id'], 4, '0', STR_PAD_LEFT),
        'order_id' => $order['order_id'],
        'status' => isset($statusMap[$currentStatus]) ? $statusMap[$currentStatus] : 'pending',
        'status_raw' => $currentStatus,
        'customer' => [
            'id' => $order['user_id'],
            'name' => $order['customer_name'] ?? 'Unknown',
            'email' => $order['customer_email'] ?? '',
            'phone' => $order['customer_phone'] ?? '',
            'avatar' => null,
            'address' => $order['customer_address'] ?? ''
        ],
        'items' => $items,
        'dates' => [
            'ordered' => $order['start_date'] . 'T10:00:00Z',
            'start' => $order['start_date'],
            'end' => $order['end_date'],
            'duration' => $duration
        ],
        'delivery' => [
            'method' => $order['venue'] ?? 'Delivery',
            'address' => $order['customer_address'] ?? 'Not specified',
            'scheduledDate' => $order['start_date'],
            'scheduledTime' => '10:00 AM - 12:00 PM',
            'driver' => null,
            'notes' => '',
            'status' => $order['rental_status']
        ],
        'payment' => [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'deliveryFee' => $deliveryFee,
            'deposit' => 0,
            'discount' => 0,
            'lateFee' => $lateFee,
            'total' => $subtotal + $lateFee,
            'status' => 'paid',
            'method' => 'Cash / Card'
        ],
        'timeline' => $timelineEvents,
        'notes' => [
            [
                'author' => 'System',
                'date' => $order['start_date'] . 'T10:00:00Z',
                'text' => 'Order created.'
            ]
        ]
    ]
];

echo json_encode($response);
?>

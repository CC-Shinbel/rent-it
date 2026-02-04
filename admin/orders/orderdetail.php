<?php
require_once __DIR__ . '/../../config.php';

// Get order ID from URL
$orderId = isset($_GET['id']) ? intval($_GET['id']) : 0;
$editMode = isset($_GET['edit']) && $_GET['edit'] === 'true';

// Fetch order details
$orderQuery = "SELECT r.*, u.full_name, u.email, u.phone, u.address as user_address
               FROM rental r
               LEFT JOIN users u ON r.user_id = u.id
               WHERE r.order_id = ?";
$stmt = mysqli_prepare($conn, $orderQuery);
mysqli_stmt_bind_param($stmt, "i", $orderId);
mysqli_stmt_execute($stmt);
$orderResult = mysqli_stmt_get_result($stmt);
$order = mysqli_fetch_assoc($orderResult);

// If order not found, redirect back
if (!$order) {
    header("Location: orders.html");
    exit;
}

// Fetch rental items for this order
$itemsQuery = "SELECT ri.*, i.item_name, i.description, i.category, i.image, i.price_per_day
               FROM rental_item ri
               LEFT JOIN item i ON ri.item_id = i.item_id
               WHERE ri.order_id = ?";
$stmt = mysqli_prepare($conn, $itemsQuery);
mysqli_stmt_bind_param($stmt, "i", $orderId);
mysqli_stmt_execute($stmt);
$itemsResult = mysqli_stmt_get_result($stmt);
$rentalItems = [];
while ($item = mysqli_fetch_assoc($itemsResult)) {
    $rentalItems[] = $item;
}

// Fetch dispatch information if available
$dispatchQuery = "SELECT * FROM dispatch WHERE order_id = ?";
$stmt = mysqli_prepare($conn, $dispatchQuery);
mysqli_stmt_bind_param($stmt, "i", $orderId);
mysqli_stmt_execute($stmt);
$dispatchResult = mysqli_stmt_get_result($stmt);
$dispatch = mysqli_fetch_assoc($dispatchResult);

// Calculate order duration
$startDate = new DateTime($order['start_date']);
$endDate = new DateTime($order['end_date']);
$duration = $startDate->diff($endDate)->days + 1;

// Helper functions
function getStatusClass($status) {
    $status = strtolower($status);
    switch ($status) {
        case 'active':
        case 'confirmed':
        case 'completed':
        case 'returned':
            return 'confirmed';
        case 'booked':
            return 'booked';
        case 'in transit':
            return 'in-transit';
        case 'pending':
        case 'pending return':
            return 'pending';
        case 'cancelled':
            return 'cancelled';
        default:
            return 'pending';
    }
}

function formatPHPCurrency($amount) {
    return '₱' . number_format($amount, 2);
}

// Calculate payment summary
$subtotal = 0;
foreach ($rentalItems as $item) {
    $subtotal += $item['item_price'] * $duration;
}
$tax = $subtotal * 0.12; // 12% VAT
$deliveryFee = 50.00;
$total = $order['total_price'] ?? ($subtotal + $tax + $deliveryFee);

// Generate order number format
$orderNumber = 'ORD-' . date('Y', strtotime($order['start_date'])) . '-' . str_pad($order['order_id'], 4, '0', STR_PAD_LEFT);
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <base href="/rent-it/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt Admin - Order Details">
    <title>Order #<?php echo $order['order_id']; ?> - RentIt Admin</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
    <link rel="apple-touch-icon" href="assets/images/rIT_logo_tp.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Admin Stylesheets -->
    <link rel="stylesheet" href="admin/shared/css/admin-theme.css">
    <link rel="stylesheet" href="admin/shared/css/admin-globals.css">
    <link rel="stylesheet" href="admin/shared/css/admin-components.css">
    <link rel="stylesheet" href="admin/orders/css/orders.css">
    <link rel="stylesheet" href="admin/orders/css/orderdetail.css">
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar Container -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="admin-main">
            <!-- Header Container -->
            <div id="headerContainer"></div>
            
            <!-- Content Area -->
            <div class="admin-content">
                <!-- Page Header with Back Button -->
                <div class="admin-page-header">
                    <div class="page-header-left">
                        <a href="admin/dashboard/dashboard.php" class="back-link" title="Back to dashboard">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                        </a>
                        <div>
                            <div class="order-header-top">
                                <h1 class="admin-page-title"><?php echo htmlspecialchars($orderNumber); ?></h1>
                                <span class="status-badge <?php echo getStatusClass($order['rental_status']); ?>"><?php echo htmlspecialchars($order['rental_status']); ?></span>
                            </div>
                            <p class="admin-page-subtitle">Rental period: <?php echo $startDate->format('M j, Y'); ?> - <?php echo $endDate->format('M j, Y'); ?> (<?php echo $duration; ?> day<?php echo $duration > 1 ? 's' : ''; ?>)</p>
                        </div>
                    </div>
                    <div class="admin-page-actions">
                        <?php if ($order['rental_status'] === 'Pending'): ?>
                            <button class="btn btn-secondary" onclick="cancelOrder(<?php echo $order['order_id']; ?>)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                                Cancel Order
                            </button>
                            <button class="btn btn-primary" onclick="confirmOrder(<?php echo $order['order_id']; ?>)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Confirm Order
                            </button>
                        <?php elseif ($order['rental_status'] === 'Booked' || $order['rental_status'] === 'Confirmed'): ?>
                            <button class="btn btn-primary" onclick="markInTransit(<?php echo $order['order_id']; ?>)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <rect x="1" y="3" width="15" height="13"/>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/>
                                    <circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                                Mark In Transit
                            </button>
                        <?php elseif ($order['rental_status'] === 'In Transit'): ?>
                            <button class="btn btn-primary" onclick="markDelivered(<?php echo $order['order_id']; ?>)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Mark Delivered
                            </button>
                        <?php elseif ($order['rental_status'] === 'Active'): ?>
                            <button class="btn btn-primary" onclick="scheduleReturn(<?php echo $order['order_id']; ?>)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <polyline points="1 4 1 10 7 10"/>
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                                </svg>
                                Schedule Return
                            </button>
                        <?php elseif ($order['rental_status'] === 'Pending Return'): ?>
                            <button class="btn btn-primary" onclick="markReturned(<?php echo $order['order_id']; ?>)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Mark Returned
                            </button>
                        <?php endif; ?>
                        <button class="btn btn-secondary" onclick="printOrder()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="6 9 6 2 18 2 18 9"/>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                <rect x="6" y="14" width="12" height="8"/>
                            </svg>
                            Print
                        </button>
                    </div>
                </div>

                <!-- Order Detail Grid -->
                <div class="order-detail-grid">
                    <!-- Left Column -->
                    <div class="order-detail-left">
                        <!-- Customer Information -->
                        <section class="detail-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    Customer Information
                                </h2>
                                <a href="admin/customers/customers.html" class="detail-card-link">View Profile</a>
                            </div>
                            <div class="detail-card-body">
                                <div class="customer-detail">
                                    <div class="customer-avatar-lg"><?php echo strtoupper(substr($order['full_name'] ?? 'U', 0, 1)); ?></div>
                                    <div class="customer-detail-info">
                                        <h3 class="customer-detail-name"><?php echo htmlspecialchars($order['full_name'] ?? 'Unknown Customer'); ?></h3>
                                        <p class="customer-detail-email"><?php echo htmlspecialchars($order['email'] ?? 'No email'); ?></p>
                                        <p class="customer-detail-phone"><?php echo htmlspecialchars($order['phone'] ?? 'No phone'); ?></p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Rental Items -->
                        <section class="detail-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 0 1-8 0"/>
                                    </svg>
                                    Rental Items
                                </h2>
                                <span class="item-count-badge"><?php echo count($rentalItems); ?> item<?php echo count($rentalItems) > 1 ? 's' : ''; ?></span>
                            </div>
                            <div class="detail-card-body">
                                <div class="rental-items-list">
                                    <?php if (count($rentalItems) > 0): ?>
                                        <?php foreach ($rentalItems as $item): ?>
                                            <div class="rental-item">
                                                <div class="rental-item-image">
                                                    <?php if ($item['image']): ?>
                                                        <img src="assets/images/items/<?php echo htmlspecialchars($item['image']); ?>" alt="<?php echo htmlspecialchars($item['item_name']); ?>">
                                                    <?php else: ?>
                                                        <div class="item-placeholder">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                                <polyline points="21 15 16 10 5 21"/>
                                                            </svg>
                                                        </div>
                                                    <?php endif; ?>
                                                </div>
                                                <div class="rental-item-details">
                                                    <h4 class="rental-item-name"><?php echo htmlspecialchars($item['item_name']); ?></h4>
                                                    <p class="rental-item-category"><?php echo htmlspecialchars($item['category'] ?? 'Uncategorized'); ?></p>
                                                    <p class="rental-item-status">Status: <span class="status-badge <?php echo getStatusClass($item['item_status'] ?? 'Pending'); ?>"><?php echo htmlspecialchars($item['item_status'] ?? 'Pending'); ?></span></p>
                                                </div>
                                                <div class="rental-item-pricing">
                                                    <p class="rental-item-rate"><?php echo formatPHPCurrency($item['price_per_day']); ?>/day</p>
                                                    <p class="rental-item-subtotal"><?php echo formatPHPCurrency($item['price_per_day'] * $duration); ?></p>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <p class="no-items">No items in this order</p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </section>

                        <!-- Order Timeline -->
                        <section class="detail-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    Order Timeline
                                </h2>
                            </div>
                            <div class="detail-card-body">
                                <div class="timeline">
                                    <?php
                                    $status = $order['rental_status'];
                                    $statusOrder = ['Pending', 'Booked', 'Confirmed', 'In Transit', 'Active', 'Pending Return', 'Returned', 'Completed'];
                                    $currentIndex = array_search($status, $statusOrder);
                                    if ($currentIndex === false) $currentIndex = 0;
                                    
                                    $timelineEvents = [
                                        ['event' => 'Order Placed', 'date' => $order['start_date'], 'completed' => true],
                                        ['event' => 'Order Confirmed', 'date' => null, 'completed' => $currentIndex >= 2],
                                        ['event' => 'Out for Delivery', 'date' => null, 'completed' => $currentIndex >= 3],
                                        ['event' => 'Delivered / Active', 'date' => null, 'completed' => $currentIndex >= 4],
                                        ['event' => 'Return Scheduled', 'date' => null, 'completed' => $currentIndex >= 5],
                                        ['event' => 'Returned', 'date' => $order['end_date'], 'completed' => $currentIndex >= 6]
                                    ];
                                    
                                    foreach ($timelineEvents as $index => $event):
                                        $isCompleted = $event['completed'];
                                        $isCurrent = !$isCompleted && ($index === 0 || $timelineEvents[$index - 1]['completed']);
                                    ?>
                                        <div class="timeline-item <?php echo $isCompleted ? 'completed' : ($isCurrent ? 'current' : ''); ?>">
                                            <div class="timeline-marker">
                                                <?php if ($isCompleted): ?>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                <?php endif; ?>
                                            </div>
                                            <div class="timeline-content">
                                                <p class="timeline-event"><?php echo $event['event']; ?></p>
                                                <p class="timeline-date">
                                                    <?php 
                                                    if ($event['date'] && $isCompleted) {
                                                        echo date('M j, Y', strtotime($event['date']));
                                                    } elseif ($isCurrent) {
                                                        echo 'In Progress';
                                                    } else {
                                                        echo 'Pending';
                                                    }
                                                    ?>
                                                </p>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Right Column -->
                    <div class="order-detail-right">
                        <!-- Order Status -->
                        <section class="detail-card status-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Order Status
                                </h2>
                            </div>
                            <div class="detail-card-body">
                                <div class="status-progress">
                                    <div class="status-current">
                                        <span class="status-badge <?php echo getStatusClass($order['rental_status']); ?> large"><?php echo htmlspecialchars($order['rental_status']); ?></span>
                                    </div>
                                    <p class="status-description">
                                        <?php
                                        switch ($order['rental_status']) {
                                            case 'Pending':
                                                echo 'Waiting for confirmation';
                                                break;
                                            case 'Booked':
                                            case 'Confirmed':
                                                echo 'Ready for delivery';
                                                break;
                                            case 'In Transit':
                                                echo 'Equipment is on the way';
                                                break;
                                            case 'Active':
                                                echo 'Rental is currently active';
                                                break;
                                            case 'Pending Return':
                                                echo 'Waiting for equipment return';
                                                break;
                                            case 'Returned':
                                            case 'Completed':
                                                echo 'Order completed successfully';
                                                break;
                                            case 'Cancelled':
                                                echo 'Order has been cancelled';
                                                break;
                                            default:
                                                echo 'Status: ' . $order['rental_status'];
                                        }
                                        ?>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Delivery Information -->
                        <section class="detail-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <rect x="1" y="3" width="15" height="13"/>
                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                        <circle cx="5.5" cy="18.5" r="2.5"/>
                                        <circle cx="18.5" cy="18.5" r="2.5"/>
                                    </svg>
                                    Delivery Information
                                </h2>
                            </div>
                            <div class="detail-card-body">
                                <div class="info-row">
                                    <span class="info-label">Method</span>
                                    <span class="info-value"><?php echo htmlspecialchars($order['venue'] ?? 'Delivery'); ?></span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Address</span>
                                    <span class="info-value"><?php echo htmlspecialchars($dispatch['delivery_address'] ?? $order['customer_address'] ?? $order['user_address'] ?? 'Not specified'); ?></span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Start Date</span>
                                    <span class="info-value"><?php echo $startDate->format('M j, Y'); ?></span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">End Date</span>
                                    <span class="info-value"><?php echo $endDate->format('M j, Y'); ?></span>
                                </div>
                                <?php if ($dispatch): ?>
                                <div class="info-row">
                                    <span class="info-label">Dispatch Status</span>
                                    <span class="info-value"><?php echo htmlspecialchars($dispatch['dispatch_status'] ?? 'Not assigned'); ?></span>
                                </div>
                                <?php endif; ?>
                            </div>
                        </section>

                        <!-- Payment Summary -->
                        <section class="detail-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                    Payment Summary
                                </h2>
                                <span class="payment-badge paid">Paid</span>
                            </div>
                            <div class="detail-card-body">
                                <div class="payment-rows">
                                    <div class="payment-row">
                                        <span>Subtotal (<?php echo $duration; ?> day<?php echo $duration > 1 ? 's' : ''; ?>)</span>
                                        <span><?php echo formatPHPCurrency($subtotal); ?></span>
                                    </div>
                                    <div class="payment-row">
                                        <span>Tax (12% VAT)</span>
                                        <span><?php echo formatPHPCurrency($tax); ?></span>
                                    </div>
                                    <div class="payment-row">
                                        <span>Delivery Fee</span>
                                        <span><?php echo formatPHPCurrency($deliveryFee); ?></span>
                                    </div>
                                    <?php if ($order['late_fee'] > 0): ?>
                                    <div class="payment-row warning">
                                        <span>Late Fee</span>
                                        <span><?php echo formatPHPCurrency($order['late_fee']); ?></span>
                                    </div>
                                    <?php endif; ?>
                                </div>
                                <div class="payment-total">
                                    <span>Total</span>
                                    <span><?php echo formatPHPCurrency($total); ?></span>
                                </div>
                            </div>
                        </section>

                        <!-- Notes -->
                        <section class="detail-card">
                            <div class="detail-card-header">
                                <h2 class="detail-card-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                    Order Notes
                                </h2>
                                <button class="btn btn-sm btn-ghost" onclick="addNote()">Add Note</button>
                            </div>
                            <div class="detail-card-body">
                                <div class="notes-list">
                                    <div class="note-item">
                                        <div class="note-header">
                                            <span class="note-author">System</span>
                                            <span class="note-date"><?php echo $startDate->format('M j, Y'); ?></span>
                                        </div>
                                        <p class="note-text">Order created for rental period <?php echo $startDate->format('M j'); ?> - <?php echo $endDate->format('M j, Y'); ?>.</p>
                                    </div>
                                    <?php if ($order['venue']): ?>
                                    <div class="note-item">
                                        <div class="note-header">
                                            <span class="note-author">Customer</span>
                                            <span class="note-date"><?php echo $startDate->format('M j, Y'); ?></span>
                                        </div>
                                        <p class="note-text">Venue/Event: <?php echo htmlspecialchars($order['venue']); ?></p>
                                    </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <!-- Footer Container -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Admin Scripts -->
    <script src="admin/shared/js/admin-components.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            AdminComponents.injectSidebar('sidebarContainer', 'orders');
            AdminComponents.injectHeader('headerContainer', 'Order Details');
            AdminComponents.injectFooter('footerContainer');
        });
        
        // Order action functions
        function confirmOrder(orderId) {
            if (confirm('Are you sure you want to confirm this order?')) {
                updateOrderStatus(orderId, 'Confirmed');
            }
        }
        
        function cancelOrder(orderId) {
            if (confirm('Are you sure you want to cancel this order?')) {
                updateOrderStatus(orderId, 'Cancelled');
            }
        }
        
        function markInTransit(orderId) {
            if (confirm('Mark this order as In Transit?')) {
                updateOrderStatus(orderId, 'In Transit');
            }
        }
        
        function markDelivered(orderId) {
            if (confirm('Mark this order as delivered and active?')) {
                updateOrderStatus(orderId, 'Active');
            }
        }
        
        function scheduleReturn(orderId) {
            if (confirm('Schedule return pickup for this order?')) {
                updateOrderStatus(orderId, 'Pending Return');
            }
        }
        
        function markReturned(orderId) {
            if (confirm('Mark this order as returned and completed?')) {
                updateOrderStatus(orderId, 'Returned');
            }
        }
        
        function updateOrderStatus(orderId, newStatus) {
            fetch('admin/api/update_order_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    status: newStatus
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Error updating order: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating order status');
            });
        }
        
        function printOrder() {
            window.print();
        }
        
        function addNote() {
            const note = prompt('Enter your note:');
            if (note) {
                alert('Note added: ' + note);
                // In a real implementation, this would save to the database
            }
        }
    </script>
</body>
</html>

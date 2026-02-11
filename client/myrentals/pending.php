<?php
session_start();
include '../../shared/php/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: " . BASE_URL . "/client/auth/login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

$pending_query = "SELECT 
                    r.order_id, 
                    r.total_price, 
                    r.rental_status,    
                    r.start_date, 
                    r.end_date, 
                    i.image,
                    i.item_name,
                    (DATEDIFF(r.end_date, r.start_date) + 1) AS rental_days, -- Dinagdagan ng +1
                    (SELECT COUNT(*) FROM rental_item WHERE order_id = r.order_id) as item_count 
                  FROM rental r
                  JOIN rental_item ri ON r.order_id = ri.order_id
                  JOIN item i ON ri.item_id = i.item_id
                  WHERE r.user_id = ? AND r.rental_status = 'Pending'
                  GROUP BY r.order_id 
                  ORDER BY r.start_date DESC";

$stmt = $conn->prepare($pending_query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pending Orders - RentIt</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="<?= BASE_URL ?>/shared/css/theme.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/shared/css/globals.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/client/dashboard/dashboard.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/client/myrentals/myrentals.css">
    <link rel="icon" type="image/png" href="/rent-it/assets/images/rIT_logo_tp.png">
    <script src="<?= BASE_URL ?>/shared/js/theme.js"></script>

    <style>
        .pending-card {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid var(--border-color);
            margin-bottom: 15px;
            display: flex;
            gap: 20px;
            align-items: flex-start;
            transition: all 0.2s ease;
        }
        .pending-card:hover {
            border-color: #f97316;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .status-pill {
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 700;
            background: #fffbeb;
            color: #92400e;
            border: 1px solid #fde68a;
            text-transform: uppercase;
            display: inline-block;
        }
        .no-data-container {
            text-align: center;
            padding: 60px 20px;
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 2px dashed var(--border-color);
        }
        .no-data-container p {
            color: var(--text-secondary);
        }
        .item-img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div id="sidebarContainer"></div>
        
        <main class="main-content">
            <div id="topbarContainer"></div>
            
            <div class="content-area">
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Pending Orders</h1>
                        <p class="page-subtitle">Orders waiting for shop approval</p>
                    </div>
                </div>

                <div class="rentals-tabs">
                <a href="<?= BASE_URL ?>/client/pending/pending.php" class="tab-link active">Pending Orders</a>
                    <a href="<?= BASE_URL ?>/client/myrentals/myrentals.php" class="tab-link">Active Rentals</a>
                 
                    <a href="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.php" class="tab-link">Booking History</a>
                    <a href="<?= BASE_URL ?>/client/returns/returns.php" class="tab-link">Returns & Extensions</a>
                </div>

                <section class="pending-list-section">
                    <h2 class="section-title" style="margin-bottom: 20px; color: var(--text-primary);">Pending Rentals</h2>
                    
                    <?php if ($result && $result->num_rows > 0): ?>
                        <?php while($order = $result->fetch_assoc()): ?>
                            <div class="pending-card">
                                
                                <div class="product-img-container">
                                    <img src="<?= BASE_URL ?>/assets/images/<?php echo $order['image']; ?>" 
                                         alt="Product" 
                                         class="item-img">
                                </div>

                                <div class="pending-info" style="flex-grow: 1;">
                                    <h4 style="margin-bottom: 8px; color: var(--text-primary);"><?php echo htmlspecialchars($order['item_name']); ?></h4>
                                    
                                    <div class="pending-meta" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
                                        <div>
                                            <p style="color: var(--text-secondary); margin: 2px 0;">Start Date: <span style="color: var(--text-primary); font-weight: 600;"><?php echo date('M d, Y', strtotime($order['start_date'])); ?></span></p>
                                            <p style="color: var(--text-secondary); margin: 2px 0;">End Date: <span style="color: var(--text-primary); font-weight: 600;"><?php echo date('M d, Y', strtotime($order['end_date'])); ?></span></p>
                                        </div>
                                        <div>
                                            <p style="color: var(--text-secondary); margin: 2px 0;">Duration: <span style="color: var(--text-primary); font-weight: 600;"><?php echo $order['rental_days']; ?> Day(s)</span></p>
                                            <p style="color: var(--text-secondary); margin: 2px 0;">Items: <span style="color: var(--text-primary); font-weight: 600;"><?php echo $order['item_count']; ?> item(s) found</span></p>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 12px; font-size: 1rem; color: #f97316; font-weight: 700;">
                                        Total Amount: ₱<?php echo number_format($order['total_price'], 2); ?>
                                    </div>
                                    <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 5px;">Order ID: #<?php echo $order['order_id']; ?></p>
                                </div>

                                <div style="text-align: right; min-width: 150px;">
                                    <span class="status-pill">Pending Approval</span>
                                    <p style="font-size: 0.72rem; color: #94a3b8; margin-top: 10px; line-height: 1.4;">
                                        Please wait for the shop<br>to confirm your booking.
                                    </p>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <div class="no-data-container">
                            <p>No pending rentals at the moment.</p>
                            <a href="../catalog/catalog.php" style="color: #f97316; text-decoration: none; font-weight: 600;">Rent something now →</a>
                        </div>
                    <?php endif; ?>
                </section>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <script src="<?= BASE_URL ?>/shared/js/components.js"></script>
    <script src="<?= BASE_URL ?>/client/myrentals/myrentals.js"></script>

</body>
</html>
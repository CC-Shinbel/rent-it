<?php
session_start();
include '../../shared/php/db_connection.php'; 

if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

$user_id = $_SESSION['user_id']; 


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    $order_id = intval($_POST['order_id']);
    $action = $_POST['action'];

    if ($action == 'return') {
        $update_query = "UPDATE RENTAL SET rental_status = 'Pending Return' WHERE order_id = $order_id AND user_id = $user_id";
    } elseif ($action == 'extend') {
        $update_query = "UPDATE RENTAL SET rental_status = 'Pending Extension' WHERE order_id = $order_id AND user_id = $user_id";
    }

    if (mysqli_query($conn, $update_query)) {
        header("Location: dashboard.php");
        exit();
    }
}


$user_query = mysqli_query($conn, "SELECT full_name, membership_level FROM USERS WHERE id = $user_id");
$user_data = mysqli_fetch_assoc($user_query);
$member_status = $user_data['membership_level'] ?? 'Bronze';

// --- FETCH KPI DATA ---
$res_spent = mysqli_query($conn, "SELECT SUM(total_price) AS total FROM RENTAL WHERE user_id = $user_id");
$total_spent = mysqli_fetch_assoc($res_spent)['total'] ?? 0;

$res_active = mysqli_query($conn, "SELECT COUNT(*) AS active_count FROM RENTAL WHERE user_id = $user_id AND rental_status = 'Rented'");
$active_count = mysqli_fetch_assoc($res_active)['active_count'] ?? 0;

$res_upcoming = mysqli_query($conn, "SELECT COUNT(*) AS upcoming FROM RENTAL WHERE user_id = $user_id AND rental_status = 'Rented' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
$upcoming_returns = mysqli_fetch_assoc($res_upcoming)['upcoming'] ?? 0;

// --- FETCH PENDING REQUESTS (Returns & Extensions) ---
$pending_query = "SELECT r.*, i.item_name FROM RENTAL r 
                  LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id 
                  LEFT JOIN ITEM i ON ri.item_id = i.item_id 
                  WHERE r.user_id = $user_id 
                  AND r.rental_status IN ('Pending Return', 'Pending Extension')";
$pending_result = mysqli_query($conn, $pending_query);

// --- FETCH ACTIVE RENTALS (Currently In Possession) ---
$active_rentals_query = "SELECT r.*, i.item_name FROM RENTAL r 
                         LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id 
                         LEFT JOIN ITEM i ON ri.item_id = i.item_id 
                         WHERE r.user_id = $user_id AND r.rental_status = 'Rented'";
$active_result = mysqli_query($conn, $active_rentals_query);

// --- FETCH BOOKING HISTORY ---
$history_query = "SELECT r.*, i.item_name FROM RENTAL r 
                  LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id 
                  LEFT JOIN ITEM i ON ri.item_id = i.item_id 
                  WHERE r.user_id = $user_id ORDER BY r.start_date DESC LIMIT 5";
$history_result = mysqli_query($conn, $history_query);

$current_db_status = $user_data['membership_level'] ?? 'Bronze';
$new_status = $current_db_status;

if ($total_spent >= 10000) {
    $new_status = 'Platinum';
} elseif ($total_spent >= 5000) {
    $new_status = 'Gold';
} elseif ($total_spent >= 1000) {
    $new_status = 'Silver';
}

if ($new_status != $current_db_status) {
    mysqli_query($conn, "UPDATE USERS SET membership_level = '$new_status' WHERE id = $user_id");
    $member_status = $new_status; 
} else {
    $member_status = $current_db_status;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RentIt - Dashboard</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../shared/css/theme.css">
    <link rel="stylesheet" href="../../shared/css/globals.css">
    <link rel="stylesheet" href="dashboard.css">
</head>
<body>
    <div class="app-container">
        <div id="sidebarContainer"></div>
        
        <main class="main-content">
            <div id="topbarContainer"></div>
            
            <div class="content-area">
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Welcome back, <?php echo htmlspecialchars($user_data['full_name']); ?>!</h1>
                    </div>
                    <div class="page-header-actions">
                        <a href="../catalog/catalog.php" class="btn-new">Browse Catalog</a>
                    </div>
                </div>

                <section class="kpi-panel">
                    <div class="kpi-row">
                        <article class="kpi-card">
                            <div class="kpi-content">
                                <div class="kpi-label">Active Rentals</div>
                                <div class="kpi-value"><?php echo $active_count; ?></div>
                                <div class="kpi-sub positive">In possession</div>
                            </div>
                        </article>

                        <article class="kpi-card">
                            <div class="kpi-content">
                                <div class="kpi-label">Total Spent</div>
                                <div class="kpi-value">₱<?php echo number_format($total_spent, 2); ?></div>
                                <div class="kpi-sub">Lifetime</div>
                            </div>
                        </article>

                        <article class="kpi-card">
                            <div class="kpi-content">
                                <div class="kpi-label">Upcoming Returns</div>
                                <div class="kpi-value"><?php echo $upcoming_returns; ?></div>
                                <div class="kpi-sub <?php echo ($upcoming_returns > 0) ? 'warning' : ''; ?>">Due within 3 days</div>
                            </div>
                        </article>

                        <article class="kpi-card">
                            <div class="kpi-content">
                                <div class="kpi-label">Member Status</div>
                                <div class="kpi-value"><?php echo htmlspecialchars($member_status); ?></div>
                                <div class="kpi-sub positive">Verified User</div>
                            </div>
                        </article>
                    </div>
                </section>

                <section class="requests-section">
                    <div class="section-header">
                        <h2 class="section-title">Returns & Extensions</h2>
                        <span class="status-tag">Waiting for Admin</span>
                    </div>
                    <div class="history-panel">
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Request Type</th>
                                    <th>New Date/Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (mysqli_num_rows($pending_result) > 0): ?>
                                    <?php while($row = mysqli_fetch_assoc($pending_result)): ?>
                                    <tr>
                                        <td><strong><?php echo htmlspecialchars($row['item_name']); ?></strong></td>
                                        <td><?php echo ($row['rental_status'] == 'Pending Return') ? 'Return' : 'Extension'; ?></td>
                                        <td><?php echo date('M d, g:i A', strtotime($row['end_date'])); ?></td>
                                        <td><span class="status-pill status-pending">Pending</span></td>
                                    </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr><td colspan="4" style="text-align:center; opacity: 0.6; padding: 15px;">No pending requests.</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="active-rentals-section">
                    <div class="section-header">
                        <h2 class="section-title">Currently In Possession</h2>
                        <span class="units-badge"><?php echo $active_count; ?> Units Active</span>
                    </div>
                    <div class="rental-cards-row">
                        <?php if (mysqli_num_rows($active_result) > 0): ?>
                            <?php while($row = mysqli_fetch_assoc($active_result)): ?>
                            <article class="rental-card">
                                <div class="card-top">
                                    <div class="card-info">
                                        <span class="badge status-rented">Rented</span>
                                        <h3 class="card-title"><?php echo htmlspecialchars($row['item_name']); ?></h3>
                                        <div class="card-meta">Due: <?php echo date('M d, Y', strtotime($row['end_date'])); ?></div>
                                    </div>
                                </div>
                                <div class="card-actions">
    <form method="POST" action="dashboard.php" style="display:inline;">
        <input type="hidden" name="order_id" value="<?php echo $row['order_id']; ?>">
        <button type="submit" name="action" value="extend" class="btn-extend">Extend</button>
    </form>

    <form method="POST" action="dashboard.php" style="display:inline;">
        <input type="hidden" name="order_id" value="<?php echo $row['order_id']; ?>">
        <button type="submit" name="action" value="return" class="btn-return">Return</button>
    </form>
</div>
                            </article>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <p style="grid-column: 1/-1; opacity: 0.6;">You don't have any items right now.</p>
                        <?php endif; ?>
                    </div>
                </section>

                <section class="history-section">
                    <div class="section-header">
                        <h2 class="section-title">Booking History</h2>
                        <a href="../client/bookinghistory/bookinghistory.html" class="view-all-link">View All</a>
                    </div>
                    <div class="history-panel">
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Item Details</th>
                                    <th>Rental Period</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while($row = mysqli_fetch_assoc($history_result)): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($row['item_name']); ?> <br> <small>#ORD-<?php echo $row['order_id']; ?></small></td>
                                    <td><?php echo date('M d', strtotime($row['start_date'])) . " - " . date('M d', strtotime($row['end_date'])); ?></td>
                                    <td>₱<?php echo number_format($row['total_price'], 2); ?></td>
                                    <td><span class="status-pill status-<?php echo strtolower($row['rental_status']); ?>"><?php echo $row['rental_status']; ?></span></td>
                                    <td><button class="action-btn">Receipt</button></td>
                                </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="promo-banner">
                    <div class="promo-content">
                        <div class="promo-text">
                            <h3>Plan a party next weekend?</h3>
                            <p>Get 20% off on your next rental if you book 3 days in advance.</p>
                        </div>
                        <a href="../catalog/catalog.php" class="promo-cta">Claim 20% Discount</a>
                    </div>
                </section>

            </div> 
            <div id="footerContainer"></div>
        </main>
    </div>

    <script src="../../shared/js/components.js"></script>
    <script src="dashboard.js"></script>
</body>
</html>
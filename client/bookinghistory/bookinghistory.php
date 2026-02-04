<?php
// filepath: c:\xampp\htdocs\rent-it\client\bookinghistory\bookinghistory.php
session_start();
include '../../shared/php/db_connection.php';

// Security: Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: " . BASE_URL . "/client/auth/login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch user data
$user_query = mysqli_query($conn, "SELECT full_name, membership_level FROM USERS WHERE id = $user_id");
$user_data = mysqli_fetch_assoc($user_query);

// --- FETCH KPI DATA ---
$res_lifetime = mysqli_query($conn, "SELECT COUNT(*) AS lifetime_count FROM RENTAL WHERE user_id = $user_id");
$lifetime_rentals = mysqli_fetch_assoc($res_lifetime)['lifetime_count'] ?? 0;

$res_spent = mysqli_query($conn, "SELECT SUM(total_price) AS total FROM RENTAL WHERE user_id = $user_id");
$total_spent = mysqli_fetch_assoc($res_spent)['total'] ?? 0;

$member_status = $user_data['membership_level'] ?? 'Bronze';

// --- FETCH BOOKING HISTORY (All rentals) ---
$history_query = "SELECT r.*, i.item_name, i.category, i.image 
                  FROM RENTAL r 
                  LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id 
                  LEFT JOIN ITEM i ON ri.item_id = i.item_id 
                  WHERE r.user_id = $user_id 
                  ORDER BY r.start_date DESC";
$history_result = mysqli_query($conn, $history_query);
$total_records = mysqli_num_rows($history_result);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Booking History. Track all your past videoke rentals and manage receipts.">
    <title>Booking History - RentIt</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?= BASE_URL ?>/assets/images/rIT_logo_tp.png">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="<?= BASE_URL ?>/shared/css/theme.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/shared/css/globals.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/client/dashboard/dashboard.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.css">
    
    <!-- Theme Script -->
    <script src="<?= BASE_URL ?>/shared/js/theme.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Container (Injected by JS) -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar Container (Injected by JS) -->
            <div id="topbarContainer"></div>
            
            <!-- Content Area -->
            <div class="content-area" id="contentArea">
                <!-- Page Header -->
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Booking History</h1>
                        <p class="page-subtitle">Track all your past videoke rentals and manage receipts.</p>
                    </div>
                    <div class="page-header-actions">
                        <button class="filter-btn" id="filterBtn" aria-haspopup="true" aria-expanded="false" title="Open filters">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M3 5h18M7 12h10M10 19h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Filter
                        </button>                        <a href="<?= BASE_URL ?>/client/catalog/catalog.php" class="btn-new">
                            New Rental
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div class="rentals-tabs">
                    <a href="<?= BASE_URL ?>/client/myrentals/myrentals.php" class="tab-link">Active Rentals</a>
                    <a href="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.php" class="tab-link active">Booking History</a>
                    <a href="<?= BASE_URL ?>/client/returns/returns.php" class="tab-link">Returns & Extensions</a>
                </div>

                <!-- KPI Cards -->
                <section class="kpi-panel">
                    <div class="kpi-row">
                        <article class="kpi-card">
                            <div class="kpi-icon-wrap blue">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                    <path d="M6 3h10l2 2v14l-2 2H6V3z"/>
                                    <path d="M8 8h8M8 12h6M8 16h4"/>
                                </svg>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Lifetime Rentals</div>
                                <div class="kpi-value" id="lifetimeRentals"><?php echo $lifetime_rentals; ?></div>
                            </div>
                        </article>

                        <article class="kpi-card">
                            <div class="kpi-icon-wrap orange">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                                    <path d="M7 10h0"/>
                                    <path d="M11 12c1.2 0 2 .6 2 1s-.8 1-2 1"/>
                                </svg>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Total Spent</div>
                                <div class="kpi-value" id="totalSpent">₱<?php echo number_format($total_spent, 2); ?></div>
                            </div>
                        </article>

                        <article class="kpi-card">
                            <div class="kpi-icon-wrap gold">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M12 .8l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 15.8 6.6 17.5l1-6.1L3.2 7.1l6.1-.9L12 .8z"/>
                                </svg>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Member Status</div>
                                <div class="kpi-value" id="memberStatus"><?php echo htmlspecialchars($member_status); ?></div>
                            </div>
                        </article>
                    </div>
                </section>

                <!-- Booking History Table -->
                <section class="history-section">
                    <div class="history-panel">
                        <table class="history-table" role="table" aria-label="Booking history">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Rental ID</th>
                                    <th>Period</th>
                                    <th>Total Paid</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="historyTableBody">
                                <?php if ($total_records > 0): ?>
                                    <?php while($row = mysqli_fetch_assoc($history_result)): ?>
                                    <tr>
                                        <td>
                                            <div class="item-cell">
                                                <div class="item-img" aria-hidden="true"><?php echo strtoupper(substr($row['item_name'] ?? 'I', 0, 1)); ?></div>
                                                <div class="item-info">
                                                    <div class="item-name"><?php echo htmlspecialchars($row['item_name'] ?? 'Unknown Item'); ?></div>
                                                    <div class="small-muted"><?php echo htmlspecialchars($row['category'] ?? 'Equipment'); ?></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="small-muted">#ORD-<?php echo $row['order_id']; ?></td>
                                        <td>
                                            <div class="period">
                                                <div class="date-start"><?php echo date('M d, Y', strtotime($row['start_date'])); ?></div>
                                                <div class="date-end">to <?php echo date('M d, Y', strtotime($row['end_date'])); ?></div>
                                            </div>
                                        </td>
                                        <td class="amount-cell"><strong>₱<?php echo number_format($row['total_price'], 2); ?></strong></td>
                                        <td>
                                            <?php 
                                            $status_class = 'status-' . strtolower(str_replace(' ', '-', $row['rental_status']));
                                            ?>
                                            <span class="status-pill <?php echo $status_class; ?>"><?php echo htmlspecialchars($row['rental_status']); ?></span>
                                        </td>
                                        <td>
                                            <div class="actions-cell">
                                                <a class="action-btn action-download" href="#" download aria-label="Download receipt" title="Download receipt">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M12 3v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                                        <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                                        <path d="M21 21H3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                                    </svg>
                                                </a>
                                                <?php if ($row['rental_status'] === 'Completed'): ?>
                                                <button class="action-btn action-review" aria-label="Rate & Review" title="Rate & Review" data-order-id="<?php echo $row['order_id']; ?>" data-product-name="<?php echo htmlspecialchars($row['item_name']); ?>">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </button>
                                                <?php else: ?>
                                                <span class="action-disabled" title="Reviews only available for completed rentals">—</span>
                                                <?php endif; ?>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6" style="text-align: center; padding: 40px; opacity: 0.6;">
                                            <p>No booking history found.</p>
                                            <a href="../catalog/catalog.php" class="btn-new" style="margin-top: 15px; display: inline-block;">Browse Catalog</a>
                                        </td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>

                        <!-- Pagination -->
                        <div class="pagination">
                            <div class="pagination-info">Showing <?php echo $total_records; ?> results</div>
                            <div class="pagination-buttons">
                                <button class="pagination-btn" disabled>Previous</button>
                                <button class="pagination-btn" disabled>Next</button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Promo CTA -->
                <section class="promo-banner">
                    <div class="promo-content">
                        <div class="promo-text">
                            <h3>Plan a party next weekend?</h3>
                            <p>Get 20% off on your next rental if you book 3 days in advance. Exclusive for loyal customers.</p>
                        </div>                        <a href="<?= BASE_URL ?>/client/catalog/catalog.php" class="promo-cta">Claim 20% Discount</a>
                    </div>
                </section>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>
    
    <!-- Scripts -->
    <script src="<?= BASE_URL ?>/shared/js/components.js"></script>
    <script src="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.js"></script>
</body>
</html>

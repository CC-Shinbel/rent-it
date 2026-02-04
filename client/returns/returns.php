<?php
// filepath: c:\xampp\htdocs\rent-it\client\returns\returns.php
session_start();
include '../../shared/php/db_connection.php';

// Security: Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: " . BASE_URL . "/client/auth/login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Handle POST actions (cancel return, reschedule, etc.)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    $order_id = intval($_POST['order_id']);
    $action = $_POST['action'];

    if ($action == 'cancel_return') {
        $update_query = "UPDATE RENTAL SET rental_status = 'Rented' WHERE order_id = $order_id AND user_id = $user_id AND rental_status = 'Pending Return'";
        mysqli_query($conn, $update_query);
    } elseif ($action == 'cancel_extension') {
        $update_query = "UPDATE RENTAL SET rental_status = 'Rented' WHERE order_id = $order_id AND user_id = $user_id AND rental_status = 'Pending Extension'";
        mysqli_query($conn, $update_query);
    }
    
    header("Location: returns.php");
    exit();
}

// --- FETCH KPI DATA ---
$res_pending = mysqli_query($conn, "SELECT COUNT(*) AS pending_count FROM RENTAL WHERE user_id = $user_id AND rental_status = 'Pending Return'");
$pending_returns = mysqli_fetch_assoc($res_pending)['pending_count'] ?? 0;

$res_extensions = mysqli_query($conn, "SELECT COUNT(*) AS ext_count FROM RENTAL WHERE user_id = $user_id AND rental_status IN ('Pending Extension', 'Extension Approved')");
$active_extensions = mysqli_fetch_assoc($res_extensions)['ext_count'] ?? 0;

$res_completed = mysqli_query($conn, "SELECT COUNT(*) AS comp_count FROM RENTAL WHERE user_id = $user_id AND rental_status = 'Completed' AND MONTH(end_date) = MONTH(CURDATE()) AND YEAR(end_date) = YEAR(CURDATE())");
$completed_this_month = mysqli_fetch_assoc($res_completed)['comp_count'] ?? 0;

// --- FETCH PENDING RETURNS ---
$returns_query = "SELECT r.*, i.item_name, i.image, i.category 
                  FROM RENTAL r 
                  LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id 
                  LEFT JOIN ITEM i ON ri.item_id = i.item_id 
                  WHERE r.user_id = $user_id 
                  AND r.rental_status = 'Pending Return'
                  ORDER BY r.end_date ASC";
$returns_result = mysqli_query($conn, $returns_query);
$returns_count = mysqli_num_rows($returns_result);

// --- FETCH EXTENSION REQUESTS ---
$extensions_query = "SELECT r.*, i.item_name, i.image, i.category 
                     FROM RENTAL r 
                     LEFT JOIN RENTAL_ITEM ri ON r.order_id = ri.order_id 
                     LEFT JOIN ITEM i ON ri.item_id = i.item_id 
                     WHERE r.user_id = $user_id 
                     AND r.rental_status IN ('Pending Extension', 'Extension Approved')
                     ORDER BY r.end_date ASC";
$extensions_result = mysqli_query($conn, $extensions_query);
$extensions_count = mysqli_num_rows($extensions_result);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Returns & Extensions. Manage your return requests and rental extensions.">
    <title>Returns & Extensions - RentIt</title>
    
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
    <link rel="stylesheet" href="<?= BASE_URL ?>/client/myrentals/myrentals.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/client/returns/returns.css">
    
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
                        <h1 class="page-title">Returns & Extensions</h1>
                        <p class="page-subtitle">Manage your return requests and rental extensions.</p>
                    </div>
                    <div class="page-header-actions">
                        <button class="filter-btn" id="filterBtn" aria-haspopup="true" aria-expanded="false" title="Filter requests">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M3 5h18M7 12h10M10 19h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>                <!-- Tabs Navigation -->
                <div class="rentals-tabs">
                    <a href="<?= BASE_URL ?>/client/myrentals/myrentals.php" class="tab-link">Active Rentals</a>
                    <a href="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.php" class="tab-link">Booking History</a>
                    <a href="<?= BASE_URL ?>/client/returns/returns.php" class="tab-link active">Returns & Extensions</a>
                </div>

                <!-- Stats Row -->
                <div class="stats-row">
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="pendingReturns"><?php echo $pending_returns; ?></span>
                            <span class="stat-label">Pending Returns</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon extension">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                                <path d="M12 14l2 2 4-4"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="activeExtensions"><?php echo $active_extensions; ?></span>
                            <span class="stat-label">Active Extensions</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon completed">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="completedReturns"><?php echo $completed_this_month; ?></span>
                            <span class="stat-label">Completed This Month</span>
                        </div>
                    </div>
                </div>

                <!-- Active Returns Section -->
                <section class="returns-section">
                    <div class="section-header">
                        <h2 class="section-title">Active Returns</h2>
                        <span class="units-badge" id="returnsBadge"><?php echo $returns_count; ?> Pending</span>
                    </div>

                    <div class="returns-grid" id="activeReturnsGrid">
                        <?php if ($returns_count > 0): ?>
                            <?php while($row = mysqli_fetch_assoc($returns_result)): ?>
                            <article class="return-card">
                                <div class="return-header">
                                    <div class="return-info">
                                        <span class="return-id">#RET-<?php echo $row['order_id']; ?></span>
                                        <span class="return-status status-pending">Pending Pickup</span>
                                    </div>
                                    <div class="return-date">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <?php echo date('M d, Y', strtotime($row['end_date'])); ?>
                                    </div>
                                </div>
                                <div class="return-body">
                                    <div class="return-item">
                                        <div class="return-item-image">
                                            <?php if (!empty($row['image'])): ?>
                                            <img src="../../assets/images/<?php echo htmlspecialchars($row['image']); ?>" alt="<?php echo htmlspecialchars($row['item_name']); ?>" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><rect fill=%22%231E293B%22 width=%2280%22 height=%2280%22/><text x=%2250%%22 y=%2250%%22 fill=%22%2394A3B8%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Inter%22 font-size=%2212%22><?php echo strtoupper(substr($row['item_name'], 0, 3)); ?></text></svg>'">
                                            <?php else: ?>
                                            <div class="return-item-placeholder"><?php echo strtoupper(substr($row['item_name'] ?? 'I', 0, 1)); ?></div>
                                            <?php endif; ?>
                                        </div>
                                        <div class="return-item-info">
                                            <h3 class="return-item-name"><?php echo htmlspecialchars($row['item_name'] ?? 'Unknown Item'); ?></h3>
                                            <p class="return-item-meta">Rental ID: #ORD-<?php echo $row['order_id']; ?> • <?php echo ceil((strtotime($row['end_date']) - strtotime($row['start_date'])) / 86400); ?> days rental</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="return-footer">
                                    <div class="return-pickup">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        <span>Awaiting admin confirmation</span>
                                    </div>
                                    <div class="return-actions">
                                        <form method="POST" action="returns.php" style="display:inline;">
                                            <input type="hidden" name="order_id" value="<?php echo $row['order_id']; ?>">
                                            <button type="submit" name="action" value="cancel_return" class="btn-cancel-return" title="Cancel return request" onclick="return confirm('Are you sure you want to cancel this return request?');">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </article>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <div class="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                                <h3>No Pending Returns</h3>
                                <p>You don't have any pending return requests.</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </section>

                <!-- Extension Requests Section -->
                <section class="extensions-section">
                    <div class="section-header">
                        <h2 class="section-title">Extension Requests</h2>
                        <span class="units-badge units-badge-blue" id="extensionsBadge"><?php echo $extensions_count; ?> Active</span>
                    </div>

                    <div class="extensions-grid" id="extensionsGrid">
                        <?php if ($extensions_count > 0): ?>
                            <?php 
                            mysqli_data_seek($extensions_result, 0);
                            while($row = mysqli_fetch_assoc($extensions_result)): 
                            ?>
                            <article class="extension-card">
                                <div class="extension-header">
                                    <div class="extension-info">
                                        <span class="extension-id">#EXT-<?php echo $row['order_id']; ?></span>
                                        <span class="extension-status <?php echo ($row['rental_status'] == 'Extension Approved') ? 'status-approved' : 'status-pending'; ?>">
                                            <?php echo ($row['rental_status'] == 'Extension Approved') ? 'Approved' : 'Pending'; ?>
                                        </span>
                                    </div>
                                    <div class="extension-badge">
                                        <span class="extension-days">+3 Days</span>
                                    </div>
                                </div>
                                <div class="extension-body">
                                    <div class="extension-item">
                                        <div class="extension-item-image">
                                            <?php if (!empty($row['image'])): ?>
                                            <img src="../../assets/images/<?php echo htmlspecialchars($row['image']); ?>" alt="<?php echo htmlspecialchars($row['item_name']); ?>" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><rect fill=%22%231E293B%22 width=%2280%22 height=%2280%22/><text x=%2250%%22 y=%2250%%22 fill=%22%2394A3B8%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Inter%22 font-size=%2212%22><?php echo strtoupper(substr($row['item_name'], 0, 3)); ?></text></svg>'">
                                            <?php else: ?>
                                            <div class="extension-item-placeholder"><?php echo strtoupper(substr($row['item_name'] ?? 'I', 0, 1)); ?></div>
                                            <?php endif; ?>
                                        </div>
                                        <div class="extension-item-info">
                                            <h3 class="extension-item-name"><?php echo htmlspecialchars($row['item_name'] ?? 'Unknown Item'); ?></h3>
                                            <p class="extension-item-meta">
                                                Original: <?php echo date('M d', strtotime($row['start_date'])); ?> - <?php echo date('M d', strtotime($row['end_date'])); ?>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="extension-footer">
                                    <div class="extension-cost">
                                        <span class="cost-label">Extension Cost:</span>
                                        <span class="cost-value">₱<?php echo number_format($row['total_price'] * 0.3, 2); ?></span>
                                    </div>
                                    <div class="extension-actions">
                                        <?php if ($row['rental_status'] == 'Extension Approved'): ?>
                                        <button class="btn-pay-extension" title="Pay extension fee">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                                <line x1="1" y1="10" x2="23" y2="10"/>
                                            </svg>
                                            Pay Now
                                        </button>
                                        <?php else: ?>
                                        <form method="POST" action="returns.php" style="display:inline;">
                                            <input type="hidden" name="order_id" value="<?php echo $row['order_id']; ?>">
                                            <button type="submit" name="action" value="cancel_extension" class="btn-cancel-return" title="Cancel extension request" onclick="return confirm('Are you sure you want to cancel this extension request?');">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                                Cancel
                                            </button>
                                        </form>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </article>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <div class="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <h3>No Extension Requests</h3>
                                <p>You don't have any pending extension requests.</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </section>

                <!-- Footer Container -->
                <div id="footerContainer"></div>
            </div>
        </main>
    </div>
      <!-- Scripts -->
    <script src="<?= BASE_URL ?>/shared/js/components.js"></script>
    <script src="<?= BASE_URL ?>/client/returns/returns.js"></script>
</body>
</html>

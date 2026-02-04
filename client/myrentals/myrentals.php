<?php
// filepath: c:\xampp\htdocs\rent-it\client\myrentals\myrentals.php
session_start();
include '../../shared/php/db_connection.php';

// Security: Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: " . BASE_URL . "/client/auth/login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - My Rentals. Manage your active videoke equipment and rental history.">
    <title>My Rentals - RentIt</title>
    
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
                        <h1 class="page-title">Manage your active videoke equipment and view your rental history.</h1>                 
                        </div>                    <div class="page-header-actions">
                        <a href="<?= BASE_URL ?>/client/catalog/catalog.php" class="btn-new">
                            New Rental
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </a>
                    </div>
                </div><!-- Tabs Navigation -->
                <div class="rentals-tabs">
                    <a href="<?= BASE_URL ?>/client/myrentals/myrentals.php" class="tab-link active">Active Rentals</a>
                    <a href="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.php" class="tab-link">Booking History</a>
                    <a href="<?= BASE_URL ?>/client/returns/returns.php" class="tab-link">Returns & Extensions</a>
                </div>

                <!-- Currently In Possession Section -->
                <section class="active-rentals-section">
                    <div class="section-header">
                        <h2 class="section-title">Currently In Possession</h2>
                        <span class="units-badge" id="unitsBadge">2 Units Active</span>
                    </div>

                    <div class="rental-cards-row" id="activeRentalsCards">
                        <!-- Rental Card 1 -->
                        <article class="rental-card">
                            <div class="card-top">
                                <div class="card-info">
                                    <div class="badges-row">
                                        <span class="badge status-rented">Rented</span>
                                        <span class="rental-id">#VDK-8921</span>
                                    </div>
                                    <h3 class="card-title">Karaoke Pro System X-100</h3>
                                    <div class="card-meta">Delivery: Jan 28, 2026</div>
                                </div>
                                <div class="days-badge">
                                    <div class="days-value">3</div>
                                    <div class="days-label">Days</div>
                                </div>
                            </div>
                            <div class="card-image">
                                <img src="/assets/images/ministar.jpg" alt="Karaoke Pro System" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 180%22><rect fill=%22%231E293B%22 width=%22400%22 height=%22180%22/><text x=%2250%%22 y=%2250%%22 fill=%22%2394A3B8%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Inter, sans-serif%22 font-size=%2216%22>Karaoke Pro System X-100</text></svg>'">
                            </div>
                            <div class="card-actions">
                                <button class="btn-extend">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    Extend
                                </button>
                                <button class="btn-return">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                    </svg>
                                    Return
                                </button>
                            </div>
                        </article>

                        <!-- Rental Card 2 (Expiring Soon) -->
                        <article class="rental-card card-expiring">
                            <div class="card-top">
                                <div class="card-info">
                                    <div class="badges-row">
                                        <span class="badge status-expiring">Expiring Soon</span>
                                        <span class="rental-id">#VDK-7742</span>
                                    </div>
                                    <h3 class="card-title">Party Box Master V2</h3>
                                    <div class="card-meta">Delivery: Jan 25, 2026</div>
                                </div>
                                <div class="days-badge days-danger">
                                    <div class="days-value">1</div>
                                    <div class="days-label">Day</div>
                                </div>
                            </div>
                            <div class="card-image">
                                <img src="/assets/images/partyboxx.webp" alt="Party Box Master" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 180%22><rect fill=%22%230b1220%22 width=%22400%22 height=%22180%22/><text x=%2250%%22 y=%2250%%22 fill=%22%2394A3B8%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Inter, sans-serif%22 font-size=%2216%22>Party Box Master V2</text></svg>'">
                            </div>
                            <div class="card-actions">
                                <button class="btn-extend btn-urgent">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <polyline points="23 4 23 10 17 10"/>
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                    </svg>
                                    Extend Now
                                </button>
                                <button class="btn-return">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                    </svg>
                                    Return
                                </button>
                            </div>
                        </article>
                    </div>                </section>                <!-- Booking History Section -->
                <section class="history-section">
                    <div class="section-header">
                        <h2 class="section-title">Booking History</h2>
                        <a href="<?= BASE_URL ?>/client/bookinghistory/bookinghistory.php" class="view-all-link">View All</a>
                    </div>

                    <div class="history-panel">
                        <table class="history-table" role="table" aria-label="Booking history">
                            <thead>
                                <tr>
                                    <th>Item Details</th>
                                    <th>Rental Period</th>
                                    <th>Total Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="historyTableBody">
                                <tr>
                                    <td>
                                        <div class="history-item">
                                            <div class="history-thumb">🎤</div>
                                            <div class="history-info">
                                                <div class="history-name">Karaoke Pro System X-100</div>
                                                <div class="history-id">#VDK-8921</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="period-dates">Oct 13 - Oct 16</div>
                                        <div class="period-status">Completed</div>
                                    </td>
                                    <td class="amount-cell">₱500.00</td>
                                    <td>
                                        <a href="#" class="action-btn" aria-label="Download receipt" title="Download receipt">
                                            Receipt
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M12 3v12M8 11l4 4 4-4M21 21H3"/>
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="history-item">
                                            <div class="history-thumb">🔊</div>
                                            <div class="history-info">
                                                <div class="history-name">Party Box Master V2</div>
                                                <div class="history-id">#VDK-7742</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="period-dates">Oct 9 - Oct 13</div>
                                        <div class="period-status">Completed</div>
                                    </td>
                                    <td class="amount-cell">₱120.00</td>
                                    <td>
                                        <a href="#" class="action-btn" aria-label="Download receipt" title="Download receipt">
                                            Receipt
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M12 3v12M8 11l4 4 4-4M21 21H3"/>
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="history-item">
                                            <div class="history-thumb">🎚️</div>
                                            <div class="history-info">
                                                <div class="history-name">Home Studio Setup</div>
                                                <div class="history-id">#VDK-2101</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="period-dates">Jul 02 - Jul 05</div>
                                        <div class="period-status" style="color: var(--danger);">Cancelled</div>
                                    </td>
                                    <td class="amount-cell">₱0.00</td>
                                    <td>
                                        <button class="action-btn action-muted" aria-label="Refunded" title="This rental was refunded">
                                            Refunded ø
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Promo CTA -->
                <section class="promo-banner">
                    <div class="promo-content">
                        <div class="promo-text">
                            <h3>Plan a party next weekend?</h3>
                            <p>Get 20% off on your next rental if you book 3 days in advance. Exclusive for loyal customers.</p>                        </div>
                        <a href="<?= BASE_URL ?>/client/catalog/catalog.php" class="promo-cta">Claim 20% Discount</a>
                    </div>
                </section>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>
    
    <!-- Scripts -->
    <script src="<?= BASE_URL ?>/shared/js/components.js"></script>
    <script src="<?= BASE_URL ?>/client/myrentals/myrentals.js"></script>
</body>
</html>

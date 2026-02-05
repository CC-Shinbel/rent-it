<?php

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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>     <!-- Favicon -->
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
                        <h1 class="page-title">My Rentals</h1>
                        <p class="page-subtitle">Manage your active videoke equipment and view your rental history.</p>                    </div>                    <div class="page-header-actions">
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
                        <span class="units-badge" id="unitsBadge">Loading...</span>

                    </div>

                    <div class="rental-cards-row" id="activeRentalsCards">
    <!-- Dynamic rental cards will be loaded here by myrentals.js -->
</div>
</section>

<!-- Booking History Section -->
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

           
        </main>
    </div>

    <div id="receiptModal" class="modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5);">
    <div class="modal-content" style="background:#fff; margin:10% auto; padding:20px; width:350px; border-radius:12px; position:relative;">
        <span class="close-modal" style="position:absolute; right:15px; top:10px; cursor:pointer; font-size:24px;">&times;</span>
        <div id="receiptDetails">
            </div>
        <button onclick="window.print()" style="width:100%; margin-top:15px; background:#f97316; color:white; border:none; padding:10px; border-radius:6px; cursor:pointer;">Print Receipt</button>
    </div>
</div>
    
    <!-- Scripts -->
    <script src="<?= BASE_URL ?>/shared/js/components.js"></script>
    <script src="<?= BASE_URL ?>/client/myrentals/myrentals.js"></script>
</body>
</html>

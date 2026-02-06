<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /rent-it/admin/auth/login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <base href="/rent-it/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt Admin - Item Catalog">
    <title>Items - RentIt Admin</title>
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
    <link rel="apple-touch-icon" href="assets/images/rIT_logo_tp.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin/shared/css/admin-theme.css">
    <link rel="stylesheet" href="admin/shared/css/admin-globals.css">
    <link rel="stylesheet" href="admin/shared/css/admin-components.css">
    <link rel="stylesheet" href="admin/item/css/item.css">
</head>
<body>
<div class="admin-wrapper">
    <div id="sidebarContainer"></div>
    <main class="admin-main">
        <div id="headerContainer"></div>
        <div class="admin-content">
            <div class="admin-page-header">
                <div>
                    <h1 class="admin-page-title">Items</h1>
                    <p class="admin-page-subtitle">Manage all rental items available in the catalog</p>
                </div>
                <div class="admin-page-actions">
                    <a href="admin/newitem/newitem.php" class="btn btn-primary" title="Add new item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Item
                    </a>
                </div>
            </div>

            <div class="items-toolbar">
                <div class="items-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" id="itemSearchInput" placeholder="Search items by name, category, or status..." />
                </div>
                <div class="items-filters">
                    <select id="statusFilter" class="filter-select">
                        <option value="all">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>
                    <button class="btn btn-secondary" id="refreshItemsBtn" title="Refresh items list">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            <div class="items-table-container">
                <table class="admin-table items-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item</th>
                            <th>Category</th>
                            <th>Price/Day</th>
                            <th>Status</th>
                            <th>Times Rented</th>
                        </tr>
                    </thead>
                    <tbody id="itemsTableBody">
                        <!-- Items will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
        <div id="footerContainer"></div>
    </main>
</div>

<script src="admin/shared/js/admin-components.js"></script>
<script src="admin/item/js/item.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        AdminComponents.injectSidebar('sidebarContainer', 'item');
        AdminComponents.injectHeader('headerContainer', 'Items');
        AdminComponents.injectFooter('footerContainer');
    });
</script>
</body>
</html>

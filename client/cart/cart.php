<?php
session_start();
include('../../shared/php/db_connection.php');

if (!isset($_SESSION['user_id'])) {
    if (isset($_GET['format']) && $_GET['format'] === 'json') {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Not authenticated']);
        exit();
    }

    header("Location: ../../auth/login.php");
    exit();
}

$u_id = $_SESSION['user_id'];

$cart_query = "SELECT c.id AS cart_row_id, i.item_name, i.price_per_day, i.category, i.image, 
                      c.start_date, c.end_date 
               FROM cart c 
               JOIN item i ON c.item_id = i.item_id 
               WHERE c.user_id = '$u_id'";
$result = mysqli_query($conn, $cart_query);

// JSON output mode for React
if (isset($_GET['format']) && $_GET['format'] === 'json') {
    header('Content-Type: application/json');

    $items = [];
    $subtotal = 0;

    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $price = isset($row['price_per_day']) ? (float)$row['price_per_day'] : 0;

            // Normalize dates and compute rental days
            $start_date = !empty($row['start_date']) ? $row['start_date'] : date('Y-m-d');
            $end_date = !empty($row['end_date']) ? $row['end_date'] : date('Y-m-d', strtotime('+1 day'));

            $start_ts = strtotime($start_date);
            $end_ts = strtotime($end_date);
            if ($end_ts < $start_ts) {
                $end_ts = $start_ts;
                $end_date = $start_date;
            }

            $diff_days = max(1, (int)ceil(($end_ts - $start_ts) / (60 * 60 * 24)));
            $itemSubtotal = $price * $diff_days;

            $subtotal += $itemSubtotal;

            $items[] = [
                'cart_row_id'   => (int)$row['cart_row_id'],
                'item_name'     => $row['item_name'],
                'price_per_day' => $price,
                'category'      => $row['category'],
                'image'         => $row['image'],
                'start_date'    => $start_date,
                'end_date'      => $end_date,
                'days'          => $diff_days,
                'itemSubtotal'  => $itemSubtotal,
            ];
        }
    }

    echo json_encode([
        'success'  => true,
        'items'    => $items,
        'subtotal' => $subtotal,
        'count'    => count($items),
    ]);

    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RentIt - My Cart</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../../shared/css/theme.css">
    <link rel="stylesheet" href="../../shared/css/globals.css">
    <link rel="stylesheet" href="../../client/dashboard/dashboard.css">
    <link rel="stylesheet" href="cart.css">
    <link rel="icon" type="image/png" href="/rent-it/assets/images/rIT_logo_tp.png">
</head>
<body>
    <div class="page-skeleton-overlay" aria-hidden="true">
        <div class="page-skeleton-shell">
            <aside class="page-skeleton-sidebar">
                <div class="page-skeleton-logo skeleton-shape"></div>
                <div class="page-skeleton-nav">
                    <span class="page-skeleton-pill skeleton-shape w-70"></span>
                    <span class="page-skeleton-pill skeleton-shape w-60"></span>
                    <span class="page-skeleton-pill skeleton-shape w-80"></span>
                    <span class="page-skeleton-pill skeleton-shape w-50"></span>
                    <span class="page-skeleton-pill skeleton-shape w-70"></span>
                </div>
                <div class="page-skeleton-user">
                    <span class="page-skeleton-circle skeleton-shape"></span>
                    <span class="page-skeleton-line skeleton-shape w-60" style="height: 12px;"></span>
                </div>
            </aside>
            <section class="page-skeleton-main">
                <div class="page-skeleton-topbar">
                    <span class="page-skeleton-line skeleton-shape w-30" style="height: 14px;"></span>
                    <span class="page-skeleton-circle skeleton-shape"></span>
                </div>
                <div class="page-skeleton-card">
                    <div class="page-skeleton-row" style="grid-template-columns: 1fr auto;">
                        <span class="page-skeleton-line skeleton-shape w-40" style="height: 14px;"></span>
                        <span class="page-skeleton-pill skeleton-shape w-20"></span>
                    </div>
                    <div class="page-skeleton-table">
                        <div class="page-skeleton-row">
                            <span class="page-skeleton-line skeleton-shape w-35 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-25 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-20 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-15 page-skeleton-block"></span>
                        </div>
                        <div class="page-skeleton-row">
                            <span class="page-skeleton-line skeleton-shape w-40 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-30 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-20 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-15 page-skeleton-block"></span>
                        </div>
                        <div class="page-skeleton-row">
                            <span class="page-skeleton-line skeleton-shape w-50 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-25 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-20 page-skeleton-block"></span>
                            <span class="page-skeleton-line skeleton-shape w-15 page-skeleton-block"></span>
                        </div>
                    </div>
                </div>
                <div class="page-skeleton-loader">
                    <span class="page-skeleton-spinner" aria-hidden="true"></span>
                    <span>Loading content...</span>
                </div>
            </section>
        </div>
    </div>
    <div class="app-container">
        <div id="sidebarContainer"></div>
        
        <main class="main-content">
            <div id="topbarContainer"></div>
            
            <div class="content-area fade-in-up" id="contentArea">
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Review and complete your rental booking.</h1>
                    </div>
                </div>

                <div class="cart-layout-vertical">
                    
                    <div class="cart-items-section">
                        <div class="cart-actions-bar">
                            <label class="select-all-wrapper">
                                <input type="checkbox" id="selectAll" class="cart-checkbox" onchange="toggleSelectAll()">
                                <span class="select-all-label">Select All</span>
                            </label>
                            <button class="btn-remove-selected" id="btnRemoveSelected" disabled>
                                <span>Remove Selected</span>
                            </button>
                        </div>

                        <div id="cartItemsList">
    <?php if (mysqli_num_rows($result) > 0): ?>
        <?php while ($row = mysqli_fetch_assoc($result)): 
            // 1. Calculate inclusive days (+1) logic
            $startDateVal = $row['start_date'] ?: date('Y-m-d');
            $endDateVal = $row['end_date'] ?: date('Y-m-d');

            $startDateObj = new DateTime($startDateVal);
            $endDateObj = new DateTime($endDateVal);
            
            $diff = $startDateObj->diff($endDateObj);
            $days = $diff->days + 1; // Inclusive count
            $itemSubtotal = $days * $row['price_per_day'];

            // 2. Image Path Logic
            $imagePathFromDB = !empty($row['image']) ? $row['image'] : '';
            $imageSrc = !empty($imagePathFromDB) 
                ? "../../assets/images/" . htmlspecialchars($imagePathFromDB) 
                : '../../assets/images/catalog-fallback.svg';
        ?>
            <div class="cart-item-card" id="card-<?php echo $row['cart_row_id']; ?>" 
                 data-id="<?php echo $row['cart_row_id']; ?>" 
                 data-price="<?php echo $row['price_per_day']; ?>">
                
                <label class="cart-item-select">
                    <input type="checkbox" class="cart-checkbox item-checkbox" 
                           data-id="<?php echo $row['cart_row_id']; ?>" 
                           onchange="calculateTotal()">
                </label>
                
                <div class="cart-item-image">
                    <img src="<?php echo $imageSrc; ?>" 
                         alt="<?php echo htmlspecialchars($row['item_name']); ?>"
                         class="cart-item-photo"
                         onerror="this.onerror=null;this.src='../../assets/images/catalog-fallback.svg';">
                </div>

                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <div class="cart-item-info">
                            <h3 class="cart-item-name"><?php echo htmlspecialchars($row['item_name']); ?></h3>
                            <span class="cart-item-category"><?php echo htmlspecialchars($row['category']); ?></span>
                        </div>
                        <div class="cart-item-price-wrap">
                            <span class="cart-item-price">₱<?php echo number_format($row['price_per_day']); ?><span>/day</span></span>
                        </div>
                    </div>

                    <div class="cart-item-rental-period">
                        <div class="rental-dates-row">
                            <div class="date-picker-group">
                                <label>Start Date</label>
                                <input type="date" class="cart-date-input start-date" 
                                       id="start-<?php echo $row['cart_row_id']; ?>"
                                       value="<?php echo $startDateVal; ?>" 
                                       onchange="updateItemTotal(<?php echo $row['cart_row_id']; ?>)">
                            </div>
                            <span class="date-arrow">→</span>
                            <div class="date-picker-group">
                                <label>End Date</label>
                                <input type="date" class="cart-date-input end-date" 
                                       id="end-<?php echo $row['cart_row_id']; ?>"
                                       value="<?php echo $endDateVal; ?>" 
                                       onchange="updateItemTotal(<?php echo $row['cart_row_id']; ?>)">
                            </div>
                        </div>
                        
                        <div class="rental-summary">
                            <span class="days-count" id="days-<?php echo $row['cart_row_id']; ?>">
                                <?php echo $days . ($days > 1 ? " days" : " day"); ?>
                            </span>
                            <span class="cart-item-subtotal" id="subtotal-<?php echo $row['cart_row_id']; ?>">
                                ₱<?php echo number_format($itemSubtotal); ?>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    
                            <?php else: ?>
                                <div class="empty-cart">
                                    <p>Your cart is empty.</p>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <aside class="cart-summary-bottom">
                        <h2 class="summary-title">Order Summary</h2>
                        <div class="summary-rows">
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span id="cartSubtotal">₱0</span>
                            </div>
                            <div class="summary-row">   
                                <span>Delivery Fee</span>
                                <span>₱150</span>
                            </div>
                            <div class="summary-row">
                                <span>Service Fee</span>
                                <span>₱50</span>
                            </div>
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-row summary-total">
                            <strong>Total</strong>
                            <strong id="cartTotal">₱0</strong>
                        </div>
                        <button class="btn-checkout-full" id="btnCheckout" disabled>Proceed to Checkout</button>
                    </aside>
                </div>
            </div>
            <div id="footerContainer"></div>
        </main>
    </div>

    <script src="../../shared/js/components.js"></script>
    <script src="cart.js"></script>
</body>
</html>
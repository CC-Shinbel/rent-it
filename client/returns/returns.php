<?php

session_start();
include '../../shared/php/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// --- HANDLE POST ACTIONS ---
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    $order_id = intval($_POST['order_id']);
    $action = $_POST['action'];

    if ($action == 'submit_return') {
        $reason = $_POST['return_reason'] ?? '';
        $stmt = $conn->prepare("UPDATE rental SET rental_status = 'Returned', return_reason = ? WHERE order_id = ? AND user_id = ?");
        $stmt->bind_param("sii", $reason, $order_id, $user_id);
        $stmt->execute();
    } 
    elseif ($action == 'submit_extension') {
        $days = intval($_POST['extension_days']);
        $query_rate = "SELECT SUM(i.price_per_day) as total_rate FROM rental_item ri JOIN item i ON ri.item_id = i.item_id WHERE ri.order_id = ?";
        $stmt_rate = $conn->prepare($query_rate);
        $stmt_rate->bind_param("i", $order_id);
        $stmt_rate->execute();
        $row_rate = $stmt_rate->get_result()->fetch_assoc();
        $daily_rate = $row_rate['total_rate'] ?? 0;
        $additional_charge = $daily_rate * $days;

        $stmt = $conn->prepare("UPDATE rental SET rental_status = 'Extended', extension_days = IFNULL(extension_days, 0) + ?, end_date = DATE_ADD(end_date, INTERVAL ? DAY), total_price = total_price + ? WHERE order_id = ? AND user_id = ?");
        $stmt->bind_param("iidii", $days, $days, $additional_charge, $order_id, $user_id);
        $stmt->execute();
    } 
    elseif ($action == 'cancel_request' || $action == 'cancel_extension') {
        $stmt = $conn->prepare("UPDATE rental SET rental_status = 'Rented' WHERE order_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $order_id, $user_id);
        $stmt->execute();
    }

    // AJAX/fetch from React: return JSON and do not redirect
    $is_ajax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    if ($is_ajax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Request processed']);
        exit();
    }
    header("Location: returns.php");
    exit();
}
// Kunin ang bilang ng mga items na binalik dahil may sira (Status: Returned)
$res_count = mysqli_query($conn, "SELECT COUNT(*) AS total FROM RENTAL WHERE user_id = $user_id AND rental_status = 'Returned'");
$returned_count = mysqli_fetch_assoc($res_count)['total'] ?? 0;

$res_pending = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM rental WHERE user_id = $user_id AND rental_status = 'Pending Return'");
$pending_returns_count = mysqli_fetch_assoc($res_pending)['cnt'] ?? 0;

$res_ext = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM rental WHERE user_id = $user_id AND rental_status = 'Extended'");
$active_extensions_count = mysqli_fetch_assoc($res_ext)['cnt'] ?? 0;

$res_done = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM rental WHERE user_id = $user_id AND rental_status = 'Returned' AND MONTH(end_date) = MONTH(CURRENT_DATE())");
$completed_this_month = mysqli_fetch_assoc($res_done)['cnt'] ?? 0;

function getRentalRequests($conn, $user_id, $statuses) {
    $status_str = "'" . implode("','", $statuses) . "'";
    $query = "SELECT r.*, i.item_name, i.image 
              FROM rental r 
              JOIN rental_item ri ON r.order_id = ri.order_id 
              JOIN item i ON ri.item_id = i.item_id 
              WHERE r.user_id = $user_id AND r.rental_status IN ($status_str)
              GROUP BY r.order_id ORDER BY r.end_date DESC";
    return mysqli_query($conn, $query);
}

$returns_result = getRentalRequests($conn, $user_id, ['Pending Return', 'Returned']);
$returns_count = mysqli_num_rows($returns_result);

$extensions_result = getRentalRequests($conn, $user_id, ['Pending Extension', 'Extended', 'Extension Approved']);
$extensions_count = mysqli_num_rows($extensions_result);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Returns & Extensions - RentIt</title>
    <link rel="stylesheet" href="../../shared/css/theme.css">
    <link rel="stylesheet" href="../../shared/css/globals.css">
    <link rel="stylesheet" href="../dashboard/dashboard.css">
    <link rel="stylesheet" href="../myrentals/myrentals.css">
    <link rel="stylesheet" href="returns.css">
    <style>
        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-approved { background: #dcfce7; color: #166534; }
        
        .rentals-tabs {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 20px;
}

.tab-link {
    text-decoration: none;
    color: #64748b;
    padding: 10px 5px;
    font-weight: 500;
    position: relative;
    transition: all 0.3s ease;
}

.tab-link.active {
    color: #f97316;
}

.tab-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #f97316;
    border-radius: 10px 10px 0 0;
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
                        <h1 class="page-title">Returns & Extensions</h1>
                        <p class="page-subtitle">Manage your pending return and extension requests.</p>
                    </div>
                </div>

                <div class="rentals-tabs">
    <a href="../myrentals/myrentals.php" class="tab-link">Active Rentals</a>
    <a href="../bookinghistory/bookinghistory.php" class="tab-link">Booking History</a>
    <a href="returns.php" class="tab-link active">Returns & Extensions</a>
</div>

<div class="stats-row">
    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-value"><?php echo $returned_count; ?></span>
            <span class="stat-label">Items Returned (For Repair)</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-value"><?php echo $active_extensions_count; ?></span>
            <span class="stat-label">Active Extensions</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-value"><?php echo $completed_this_month; ?></span>
            <span class="stat-label">Completed This Month</span>
        </div>
    </div>
</div>

<section class="returns-section">
    <div class="section-header">
        <h2 class="section-title">Returned</h2>
        <span class="units-badge"><?php echo $returns_count; ?> Items</span>
    </div>

    <div class="returns-grid">
        <?php if ($returns_count > 0): ?>
            <?php while($row = mysqli_fetch_assoc($returns_result)): ?>
            <article class="return-card">
                <div class="return-header">
                    <span class="return-id">#ORD-<?php echo $row['order_id']; ?></span>
                    <span class="return-status <?php echo ($row['rental_status'] == 'Returned') ? 'status-returned' : 'status-pending'; ?>">
                        <?php echo $row['rental_status']; ?>
                    </span>
                </div>
                <div class="return-body">
                    <div class="return-item">
                        <div class="return-item-image">
                            <img src="../../assets/images/<?php echo $row['image'] ?: 'default.png'; ?>" alt="Item">
                        </div>
                        <div class="return-item-info">
                            <h3 class="return-item-name"><?php echo htmlspecialchars($row['item_name']); ?></h3>
                            <p class="return-item-meta">Returned On: <?php echo date('M d, Y', strtotime($row['end_date'])); ?></p>
                            
                            <?php if (!empty($row['return_reason'])): ?>
                                <div class="reason-box">
                                    <strong>Issue reported:</strong>
                                    <p><?php echo htmlspecialchars($row['return_reason']); ?></p>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <div class="return-footer">
                    <?php if ($row['rental_status'] !== 'Returned'): ?>
                        <form method="POST">
                            <input type="hidden" name="order_id" value="<?php echo $row['order_id']; ?>">
                            <button type="submit" name="action" value="cancel_request" class="btn-cancel-return" onclick="return confirm('Cancel request?')">Cancel Request</button>
                        </form>
                    <?php else: ?>
                        <span class="processed-label">Under Inspection / Maintenance</span>
                    <?php endif; ?>
                </div>
            </article>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="no-data-card">
                <p>No return requests found.</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<section class="extensions-section" style="margin-top: 40px;">
    <div class="section-header">
        <h2 class="section-title">Extension</h2>
        <span class="units-badge units-badge-blue"><?php echo $extensions_count; ?> Items</span>
    </div>

    <div class="extensions-grid">
        <?php if ($extensions_count > 0): 
            mysqli_data_seek($extensions_result, 0); 
            while($row = mysqli_fetch_assoc($extensions_result)): ?>
            <article class="extension-card">
                <div class="extension-header">
                    <span class="extension-id">#ORD-<?php echo $row['order_id']; ?></span>
                    <span class="extension-status status-pending"><?php echo $row['rental_status']; ?></span>
                </div>
                <div class="extension-body">
                    <div class="extension-item-info">
                        <h3 class="extension-item-name"><?= htmlspecialchars($row['item_name']) ?></h3>
                        <p>New Due Date: <strong><?= date('M d, Y', strtotime($row['end_date'])) ?></strong></p>
                    </div>
                </div>
                <div class="extension-footer">
                    <form method="POST">
                        <input type="hidden" name="order_id" value="<?= $row['order_id'] ?>">
                        <button type="submit" name="action" value="cancel_extension" class="btn-cancel-return">Cancel Request</button>
                    </form>
                </div>
            </article>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="no-data-card">
                <p>No active extensions.</p>
            </div>
        <?php endif; ?>
    </div>
</section>

    <script src="../../shared/js/components.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof Components !== 'undefined') {
                Components.injectSidebar('sidebarContainer', 'returns', 'client');
                Components.injectTopbar('topbarContainer', 'Returns & Extensions');
            }
        });
    </script>
</body>
</html>
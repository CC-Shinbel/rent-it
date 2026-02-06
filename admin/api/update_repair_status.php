<?php
/**
 * Update Repair Status API
 * Updates a repair ticket's status and optionally the item's status
 */
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

require_once __DIR__ . '/../../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'));

if (!$data || !isset($data->repair_id) || !isset($data->action)) {
    echo json_encode(['success' => false, 'message' => 'Missing repair_id or action']);
    exit();
}

$repair_id = intval($data->repair_id);
$action = trim($data->action);

// Get the repair record to find item_id
$get_stmt = $conn->prepare("SELECT item_id FROM repair WHERE repair_id = ?");
$get_stmt->bind_param("i", $repair_id);
$get_stmt->execute();
$get_result = $get_stmt->get_result();
$repair = $get_result->fetch_assoc();
$get_stmt->close();

if (!$repair) {
    echo json_encode(['success' => false, 'message' => 'Repair ticket not found']);
    exit();
}

$item_id = $repair['item_id'];

switch ($action) {
    case 'complete':
        // Mark repair as completed
        $new_status = 'completed';
        $stmt = $conn->prepare("UPDATE repair SET status = ? WHERE repair_id = ?");
        $stmt->bind_param("si", $new_status, $repair_id);
        $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => true, 'message' => 'Repair marked as completed']);
        break;

    case 'available':
        // Delete repair ticket and set item back to Available
        $stmt = $conn->prepare("DELETE FROM repair WHERE repair_id = ?");
        $stmt->bind_param("i", $repair_id);
        $stmt->execute();
        $stmt->close();

        if ($item_id) {
            $item_status = 'Available';
            $item_stmt = $conn->prepare("UPDATE item SET status = ? WHERE item_id = ?");
            $item_stmt->bind_param("si", $item_status, $item_id);
            $item_stmt->execute();
            $item_stmt->close();
        }

        echo json_encode(['success' => true, 'message' => 'Item set back to Available']);
        break;

    case 'unavailable':
        // Set item as Unavailable
        $item_status = 'Unavailable';
        $item_stmt = $conn->prepare("UPDATE item SET status = ? WHERE item_id = ?");
        $item_stmt->bind_param("si", $item_status, $item_id);
        $item_stmt->execute();
        $item_stmt->close();

        // Update repair status too
        $new_status = 'unavailable';
        $stmt = $conn->prepare("UPDATE repair SET status = ? WHERE repair_id = ?");
        $stmt->bind_param("si", $new_status, $repair_id);
        $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => true, 'message' => 'Item set as Unavailable']);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

$conn->close();
?>

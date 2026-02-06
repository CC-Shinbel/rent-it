<?php
/**
 * Get Single Item API
 * Returns a single item by item_id
 */
require_once __DIR__ . '/../../config.php';

header('Content-Type: application/json');

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid item ID']);
    exit;
}

$item_id = intval($_GET['id']);

$stmt = $conn->prepare("SELECT item_id, item_name, description, category, image, price_per_day, deposit, `condition`, status, maintenance_notes, total_times_rented, rating, reviews, total_units, available_units, is_visible, is_featured, tags FROM item WHERE item_id = ?");
$stmt->bind_param("i", $item_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Item not found']);
    $stmt->close();
    exit;
}

$item = $result->fetch_assoc();
$item['price_per_day'] = $item['price_per_day'] !== null ? floatval($item['price_per_day']) : null;
$item['deposit'] = $item['deposit'] !== null ? floatval($item['deposit']) : null;
$item['rating'] = $item['rating'] !== null ? floatval($item['rating']) : null;
$item['reviews'] = $item['reviews'] !== null ? intval($item['reviews']) : null;
$item['total_times_rented'] = intval($item['total_times_rented']);
$item['total_units'] = intval($item['total_units']);
$item['available_units'] = intval($item['available_units']);
$item['is_visible'] = intval($item['is_visible']);
$item['is_featured'] = intval($item['is_featured']);

echo json_encode(['success' => true, 'data' => $item]);

$stmt->close();
$conn->close();
?>

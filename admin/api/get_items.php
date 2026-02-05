<?php
/**
 * Get Items API
 * Returns all items with basic details for admin listing
 */
require_once __DIR__ . '/../../config.php';

header('Content-Type: application/json');

$query = "SELECT item_id, item_name, description, category, image, price_per_day, deposit, `condition`, status, maintenance_notes, total_times_rented, rating, reviews
          FROM item
          ORDER BY item_id DESC";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . mysqli_error($conn)
    ]);
    exit;
}

$items = [];
while ($row = mysqli_fetch_assoc($result)) {
    $row['price_per_day'] = $row['price_per_day'] !== null ? floatval($row['price_per_day']) : null;
    $row['deposit'] = $row['deposit'] !== null ? floatval($row['deposit']) : null;
    $row['rating'] = $row['rating'] !== null ? floatval($row['rating']) : null;
    $row['reviews'] = $row['reviews'] !== null ? intval($row['reviews']) : null;
    $row['total_times_rented'] = $row['total_times_rented'] !== null ? intval($row['total_times_rented']) : 0;
    $items[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $items
]);
?>

<?php
session_start();
include '../../shared/php/db_connection.php'; 

if (!isset($_SESSION['user_id'])) {
    echo "Login required";
    exit();
}

$user_id = $_SESSION['user_id'];

// 🔹 GET request (galing sa Rent Now)
if (isset($_GET['id'])) {
    $item_id = $_GET['id'];
}

// 🔹 POST request (galing sa modal Add to Cart)
elseif (isset($_POST['item_id'])) {
    $item_id = $_POST['item_id'];
}

else {
    echo "Invalid Request";
    exit();
}


// Check duplicate
$check_query = "SELECT id FROM cart WHERE user_id='$user_id' AND item_id='$item_id'";
$check_result = mysqli_query($conn, $check_query);

if (mysqli_num_rows($check_result) == 0) {
    mysqli_query($conn, "INSERT INTO cart (user_id, item_id) VALUES ('$user_id', '$item_id')");
}


// If GET → redirect to cart
if (isset($_GET['id'])) {
    header("Location: cart.php");
    exit();
}

// If POST → just return success (for AJAX)
echo "Success";

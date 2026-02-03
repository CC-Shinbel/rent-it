<?php
session_start();
include '../../shared/php/db_connection.php'; 


if (isset($_POST['item_id']) && isset($_SESSION['user_id'])) {
    $item_id = $_POST['item_id'];
    $user_id = $_SESSION['user_id'];

    $check_query = "SELECT id FROM cart WHERE user_id = '$user_id' AND item_id = '$item_id'";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        echo "Item already in cart!";
    } else {
        $insert_query = "INSERT INTO cart (user_id, item_id) VALUES ('$user_id', '$item_id')";
        if (mysqli_query($conn, $insert_query)) {
            echo "Success";
        } else {
            echo "Error: " . mysqli_error($conn);
        }
    }
} else {
    echo "Invalid Request";
}
?>
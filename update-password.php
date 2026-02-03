<?php
include_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Kunin ang data mula sa form
    $token = mysqli_real_escape_string($conn, $_POST['token']);
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    // 1. Double check kung match (kahit may JS na tayo, safe ang server-side check)
    if ($new_password !== $confirm_password) {
        $status = "error";
        $message = "Passwords do not match!";
    } else {
        // 2. I-hash ang password para hindi mabasa ng kahit sino sa DB
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // 3. I-update ang database
        // Ine-null natin ang token at expiry para "one-time use" lang ang code
        $sql = "UPDATE users SET 
                password = '$hashed_password', 
                reset_token = NULL, 
                reset_expiry = NULL 
                WHERE reset_token = '$token'";

        if (mysqli_query($conn, $sql) && mysqli_affected_rows($conn) > 0) {
            $status = "success";
            $message = "Password updated! You can now log in with your new rhythm.";
        } else {
            $status = "error";
            $message = "Failed to update. The link might have expired.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body>
    <script>
        Swal.fire({
            icon: '<?php echo $status; ?>',
            title: '<?php echo ($status == "success" ? "Great!" : "Oops!"); ?>',
            text: '<?php echo $message; ?>',
            confirmButtonColor: '#6366f1',
            confirmButtonText: 'Go to Login'
        }).then((result) => {
            // I-redirect ang user pabalik sa login page
            window.location.href = 'client/auth/login.php'; 
        });
    </script>
</body>
</html>
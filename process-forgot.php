<?php
// Iwasan ang warnings: gamitin ang include_once sa config
include_once 'config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'libs/PHPMailer/Exception.php';
require 'libs/PHPMailer/PHPMailer.php';
require 'libs/PHPMailer/SMTP.php';

$status = "";
$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    
    $query = "SELECT id FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        $otp_code = rand(100000, 999999); 
        $expiry = date("Y-m-d H:i:s", strtotime("+10 minutes"));
        
        mysqli_query($conn, "UPDATE users SET reset_token = '$otp_code', reset_expiry = '$expiry' WHERE email = '$email'");

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'viaumali24@gmail.com';
            $mail->Password   = 'piid uptq kuss cuky'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('no-reply@certicode.com', 'CertiCode');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Your Recovery Code';
            $mail->Body    = "Your code is: <b>$otp_code</b>";

            $mail->send();
            $status = "success";
            $message = "Sent! Check your inbox for the code.";
        } catch (Exception $e) {
            $status = "error";
            $message = "Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        $status = "error";
        $message = "Email not found in our system.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background: #ffffff; }
    </style>
</head>
<body>
    <script>
        Swal.fire({
            icon: '<?php echo $status; ?>',
            title: '<?php echo ($status == "success" ? "Success" : "Oops!"); ?>',
            text: '<?php echo $message; ?>',
            confirmButtonColor: '#000000', // Black button para sa minimalist look
            confirmButtonText: 'CONTINUE'
        }).then((result) => {
            <?php if ($status == "success"): ?>
                // Kapag success, lipat sa enter code page
                window.location.href = 'verify-otp.php?email=<?php echo urlencode($email); ?>';
            <?php else: ?>
                // Kapag error, balik sa forgot password
                window.location.href = 'forgot-password.php';
            <?php endif; ?>
        });
    </script>
</body>
</html>
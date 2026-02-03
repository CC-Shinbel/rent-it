<?php include_once 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CertiCode - Verify Code</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body { background: #ffffff; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #000; }
        .otp-card { width: 100%; max-width: 380px; text-align: center; padding: 20px; }
        .brand-icon { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
        .title { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
        .subtitle { font-size: 0.9rem; color: #6b7280; margin-bottom: 35px; line-height: 1.5; }
        
        .otp-input { 
            width: 100%; 
            padding: 15px 0; 
            font-size: 2.5rem; 
            letter-spacing: 12px; 
            text-align: center; 
            border: none; 
            border-bottom: 2px solid #e5e7eb; 
            margin-bottom: 30px; 
            outline: none;
            font-weight: 700;
            background: transparent;
            transition: border-color 0.2s;
        }
        .otp-input:focus { border-bottom-color: #000; }

        .submit-btn { 
            width: 100%; padding: 14px; background: #000; color: #fff; border: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s; 
        }
        .submit-btn:hover { background: #333; }
        .back-link { display: block; margin-top: 25px; color: #9ca3af; text-decoration: none; font-size: 0.85rem; }
        .back-link:hover { color: #000; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="otp-card">
       
        <h1 class="title">Verify Code</h1>
        <p class="subtitle">Enter the 6-digit code we sent to your email to continue.</p>
        
        <form action="process-verify.php" method="POST">
            <input type="hidden" name="email" value="<?php echo htmlspecialchars($_GET['email'] ?? ''); ?>">
            <input type="text" name="otp" class="otp-input" maxlength="6" placeholder="000000" required autocomplete="off">
            <button type="submit" class="submit-btn">VERIFY ACCESS</button>
        </form>
        
        <a href="forgot-password.php" class="back-link">Resend Code</a>
    </div>
</body>
</html>
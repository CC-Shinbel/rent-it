<?php 
include_once 'config.php'; 
$token = isset($_GET['token']) ? mysqli_real_escape_string($conn, $_GET['token']) : '';
$isValid = false;

if ($token) {
    $now = date("Y-m-d H:i:s");
    $query = "SELECT id FROM users WHERE reset_token = '$token' AND reset_expiry > '$now'";
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) > 0) { $isValid = true; }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CertiCode - Reset Password</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body { background: #ffffff; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #000; }
        .reset-card { width: 100%; max-width: 380px; padding: 20px; text-align: center; }
        .brand-icon { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
        .title { font-size: 1.5rem; font-weight: 700; margin-bottom: 25px; letter-spacing: -0.5px; }
        
        .input-group { text-align: left; margin-bottom: 20px; }
        .input-group label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #374151; margin-bottom: 8px; display: block; }
        
        .custom-input { 
            width: 100%; padding: 12px 0; border: none; border-bottom: 2px solid #e5e7eb; outline: none; font-size: 1rem; background: transparent; transition: border-color 0.2s;
        }
        .custom-input:focus { border-bottom-color: #000; }

        .requirements { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .req-item { color: #9ca3af; font-size: 0.8rem; display: flex; align-items: center; margin-bottom: 6px; transition: color 0.3s; }
        .req-item.valid { color: #10b981; font-weight: 600; }
        
        .match-indicator { font-size: 0.75rem; margin-top: 8px; color: #9ca3af; }
        .match-indicator.valid { color: #10b981; font-weight: 600; }

        .submit-btn { 
            width: 100%; padding: 14px; background: #000; color: #fff; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 10px;
        }
        .expired-msg { color: #ef4444; font-weight: 600; }
    </style>
</head>
<body>
    <div class="reset-card">
       
        
        <?php if ($isValid): ?>
            <h1 class="title">Set New Password</h1>
            <form action="update-password.php" method="POST" id="resetForm">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                
                <div class="input-group">
                    <label>New Password</label>
                    <input type="password" name="new_password" id="new_password" class="custom-input" required placeholder="••••••••">
                </div>

                <div class="requirements">
                    <div id="len" class="req-item">○ At least 8 characters</div>
                    <div id="upper" class="req-item">○ One uppercase letter</div>
                    <div id="num" class="req-item">○ One number</div>
                </div>

                <div class="input-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" id="confirm_password" class="custom-input" required placeholder="••••••••">
                    <div id="match" class="match-indicator">○ Passwords must match</div>
                </div>

                <button type="submit" class="submit-btn" id="submitBtn" disabled style="opacity: 0.3; cursor: not-allowed;">UPDATE PASSWORD</button>
            </form>
        <?php else: ?>
            <h1 class="expired-msg">Session Expired</h1>
            <p style="color: #6b7280; font-size: 0.9rem;">This reset link is no longer valid.</p>
            <a href="forgot-password.php" style="color:#000; font-weight: 700; text-decoration:none; display:block; margin-top:20px;">Request New Code</a>
        <?php endif; ?>
    </div>

    <script>
        const passInput = document.getElementById('new_password');
        const confirmInput = document.getElementById('confirm_password');
        const submitBtn = document.getElementById('submitBtn');
        const reqs = {
            len: document.getElementById('len'),
            upper: document.getElementById('upper'),
            num: document.getElementById('num'),
            match: document.getElementById('match')
        };

        function validate() {
            const val = passInput.value;
            const confVal = confirmInput.value;
            const isLen = val.length >= 8;
            const isUpper = /[A-Z]/.test(val);
            const isNum = /[0-9]/.test(val);
            const isMatch = val === confVal && val !== '';

            reqs.len.classList.toggle('valid', isLen);
            reqs.len.innerHTML = isLen ? "✓ At least 8 characters" : "○ At least 8 characters";
            reqs.upper.classList.toggle('valid', isUpper);
            reqs.upper.innerHTML = isUpper ? "✓ One uppercase letter" : "○ One uppercase letter";
            reqs.num.classList.toggle('valid', isNum);
            reqs.num.innerHTML = isNum ? "✓ One number" : "○ One number";
            
            reqs.match.classList.toggle('valid', isMatch);
            reqs.match.innerHTML = isMatch ? "✓ Passwords match" : "○ Passwords must match";

            if (isLen && isUpper && isNum && isMatch) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            } else {
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.3";
                submitBtn.style.cursor = "not-allowed";
            }
        }
        passInput.addEventListener('input', validate);
        confirmInput.addEventListener('input', validate);
    </script>
</body>
</html>
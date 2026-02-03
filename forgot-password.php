<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CertiCode - Reset Access</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            background: #ffffff; /* Pure White */
            font-family: 'Inter', sans-serif;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #111827;
        }

        .forgot-card {
            background: #ffffff;
            padding: 40px;
            width: 100%;
            max-width: 380px;
            text-align: center;
        }

        .brand-icon {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #000000;
        }

        .forgot-title {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            margin-bottom: 8px;
        }

        .forgot-subtitle {
            font-size: 0.9rem;
            color: #6b7280;
            line-height: 1.5;
            margin-bottom: 32px;
        }

        .input-wrapper {
            text-align: left;
            margin-bottom: 20px;
        }

        .input-wrapper label {
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #374151;
            margin-bottom: 8px;
            display: block;
        }

        .custom-input {
            width: 100%;
            padding: 12px 0; /* Underline style */
            border: none;
            border-bottom: 2px solid #e5e7eb;
            font-size: 1rem;
            transition: border-color 0.2s;
            background: transparent;
            border-radius: 0;
            box-sizing: border-box;
        }

        .custom-input:focus {
            border-bottom-color: #000000;
            outline: none;
        }

        .submit-btn {
            width: 100%;
            padding: 14px;
            background: #000000; /* Black button */
            color: #ffffff;
            border: none;
            border-radius: 4px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 10px;
        }

        .submit-btn:hover {
            background: #374151;
        }

        .back-to-login {
            display: block;
            margin-top: 24px;
            color: #9ca3af;
            text-decoration: none;
            font-size: 0.85rem;
            transition: color 0.2s;
        }

        .back-to-login:hover {
            color: #000000;
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="forgot-card">
       
        <h1 class="forgot-title">Forgot Password</h1>
        <p class="forgot-subtitle">
            Enter your email address and we'll send you a recovery code.
        </p>

        <form action="process-forgot.php" method="POST">
            <div class="input-wrapper">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" class="custom-input" placeholder="name@domain.com" required>
            </div>

            <button type="submit" class="submit-btn">
                SEND CODE
            </button>
        </form>

        <a href="login.php" class="back-to-login">
            Return to Login
        </a>
    </div>

</body>
</html>
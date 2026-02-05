<?php
session_start();
include '../php/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../client/auth/login.php');
    exit;
}

$user_id = $_SESSION['user_id'];
// Query gamit ang iyong specific column names
$query = "SELECT full_name, email, phone, profile_picture FROM users WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile | RentIT</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    
    <style>
        :root {
            --profile-card-bg: #ffffff;
            --input-border: #e2e8f0;
            --accent-blue: #2563eb;
            --text-main: #1e293b;
            --text-muted: #64748b;
        }

        .profile-container { 
            padding: 3rem 1rem; 
            display: flex; 
            justify-content: center; 
            background-color: #f8fafc; /* Subtle gray background */
            min-height: 100vh;
        }

        .profile-card { 
            background: var(--profile-card-bg); 
            padding: 2.5rem; 
            border-radius: 20px; 
            width: 100%; 
            max-width: 450px; 
            border: 1px solid #f1f5f9;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            height: fit-content;
        }

        .avatar-section { text-align: center; margin-bottom: 2rem; }
        
        .avatar-wrapper {
            position: relative;
            width: 130px;
            height: 130px;
            margin: 0 auto;
            padding: 4px;
            border: 2px solid var(--accent-blue);
            border-radius: 50%;
            background: #fff;
        }

        .avatar-preview { 
            width: 100%; 
            height: 100%; 
            border-radius: 50%; 
            object-fit: cover; 
            background: #f1f5f9;
            display: block;
        }

        .upload-btn {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background: var(--accent-blue);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 3px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: transform 0.2s;
        }

        .upload-btn:hover { transform: scale(1.1); }

        .form-group { margin-bottom: 1.25rem; text-align: left; }
        
        .form-group label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-size: 0.75rem;
            font-weight: 700; 
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .form-group input { 
            width: 100%; 
            padding: 0.8rem 1rem; 
            border-radius: 12px; 
            border: 1px solid var(--input-border); 
            background: #fff;
            color: var(--text-main);
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--accent-blue);
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .btn-save { 
            width: 100%; 
            padding: 1rem; 
            border-radius: 12px; 
            border: none; 
            background: var(--accent-blue); 
            color: white; 
            font-size: 1rem;
            font-weight: 700; 
            cursor: pointer; 
            margin-top: 1rem;
            transition: all 0.2s;
        }

        .btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-save:disabled { background: #94a3b8; cursor: not-allowed; }
        
        h2 { color: var(--text-main); font-size: 1.6rem; text-align: center; margin: 0 0 0.5rem 0; }
    </style>
</head>
<body>
    <div id="sidebarContainer"></div>
    <main class="app-container">
        <div id="topbarContainer"></div>
        
        <div class="profile-container">
            <div class="profile-card">
                <h2>Account Settings</h2>
                <p style="text-align:center; color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem;">Manage your personal profile information</p>
                
                <form id="profileForm">
    <div class="avatar-section">
        <div class="avatar-wrapper">
            <?php 
                // FIXED: profile_picture ang column name mo sa query
                $profilePic = !empty($user['profile_picture']) 
                    ? '../assets/profile/' . $user['profile_picture'] 
                    : '../assets/images/default-avatar.png';
            ?>
            <img src="<?php echo $profilePic; ?>" id="imgPreview" class="avatar-preview">
            <label for="profile_pic" class="upload-btn" title="Change Photo">📷</label>
            <input type="file" id="profile_pic" name="profile_pic" style="display:none;" accept="image/*">
        </div>
    </div>

    <div class="form-group">
    <label>Full Name</label>
    <input type="text" name="full_name" value="<?php echo htmlspecialchars($user['full_name'] ?? ''); ?>" required>
</div>

<div class="form-group">
    <label>Email Address</label>
    <input type="email" name="email" value="<?php echo htmlspecialchars($user['email'] ?? ''); ?>" required>
</div>

<div class="form-group">
    <label>Phone Number</label>
    <input type="text" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>">
</div>

    <button type="submit" class="btn-save" id="saveBtn">Save Changes</button>
</form>
            </div>
        </div>
    </main>

  
    <script>
        // Initialize Components
        if (typeof Components !== 'undefined') {
            Components.injectSidebar('sidebarContainer', 'profile', 'client');
            Components.injectTopbar('topbarContainer', 'My Profile');
        }

        // --- IMAGE PREVIEW LOGIC (FIXED) ---
        document.getElementById('profile_pic').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Check if file is image
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file.');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Update ang src ng img tag
                    document.getElementById('imgPreview').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // AJAX Update Submission
        document.getElementById('profileForm').onsubmit = async function(e) {
            e.preventDefault();
            const saveBtn = document.getElementById('saveBtn');
            const originalText = saveBtn.innerText;
            
            saveBtn.innerText = "Updating...";
            saveBtn.disabled = true;

            const formData = new FormData(this);
            
            try {
                // Siguraduhin na tama ang path papunta sa PHP script mo
                const res = await fetch('../php/update_profile.php', { 
                    method: 'POST', 
                    body: formData 
                });
                const data = await res.json();
                
                if(data.success) {
                    // 1. Kunin ang kasalukuyang user data mula sa localStorage
                    let user = JSON.parse(localStorage.getItem('user') || '{}');

                    // 2. I-update ang values base sa input sa form
                    // Gagamitin natin ang .get() para makuha ang data mula sa formData object
                    user.full_name = formData.get('full_name');
                    user.email = formData.get('email');
                    user.phone = formData.get('phone');

                    // 3. I-update ang profile_picture kung may ibinalik na bagong filename ang PHP
                    if(data.profile_picture) {
                        user.profile_picture = data.profile_picture;
                    }

                    // 4. I-save pabalik sa localStorage (maliit na 'l')
                    localStorage.setItem('user', JSON.stringify(user));

                    alert('Success! Your profile has been updated.');
                    location.reload(); 
                }
               
                else {
                    alert('Update failed: ' + (data.message || 'Unknown error'));
                }
            } catch (err) {
                console.error('Fetch Error:', err);
                alert('Connection error. Please try again.');
            } finally {
                saveBtn.innerText = originalText;
                saveBtn.disabled = false
                
                ;
            }
        };
    </script>
</body>
</html>
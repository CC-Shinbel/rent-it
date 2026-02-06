<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /rent-it/admin/auth/login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rent-it/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - Admin | RentIt</title>
    <!-- Shared Styles -->
    <link rel="stylesheet" href="shared/css/globals.css">
    <link rel="stylesheet" href="shared/css/theme.css">
    <link rel="stylesheet" href="admin/shared/css/admin-globals.css">
    <link rel="stylesheet" href="admin/shared/css/admin-sidebar.css">
    <link rel="stylesheet" href="admin/shared/css/admin-topbar.css">
    <!-- Page Styles -->
    <link rel="stylesheet" href="admin/profile/css/profile.css">
</head>
<body>
    <!-- Sidebar Component -->
    <aside id="admin-sidebar"></aside>

    <!-- Main Content -->
    <main class="admin-main-content">
        <!-- Topbar Component -->
        <header id="admin-topbar"></header>

        <!-- Page Content -->
        <div class="admin-page-content">
            <!-- Page Header -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">My Profile</h1>
                    <p class="page-subtitle">Manage your account information and preferences</p>
                </div>
                <div class="page-header-actions">
                    <a href="admin/dashboard/dashboard.php" class="btn-secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                        Back to Dashboard
                    </a>
                </div>
            </div>

            <!-- Profile Settings Grid -->
            <div class="settings-grid">
                <!-- Profile Information Card -->
                <section class="settings-card">
                    <div class="settings-card-header">
                        <div class="settings-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="settings-card-title">Profile Information</h2>
                            <p class="settings-card-subtitle">Update your personal details</p>
                        </div>
                    </div>
                    <div class="settings-card-body">
                        <form id="profileForm">
                            <!-- Profile Picture -->
                            <div class="profile-picture-section">
                                <div class="profile-avatar-large" id="profileAvatar">A</div>
                                <div class="profile-picture-actions">
                                    <button type="button" class="btn-upload" id="uploadBtn">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                        Upload Photo
                                    </button>
                                    <input type="file" id="profilePictureInput" accept="image/*" hidden>
                                </div>
                            </div>

                            <!-- Name Fields -->
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName" class="form-label">First Name</label>
                                    <input type="text" id="firstName" name="firstName" class="form-input" placeholder="Enter first name" value="Admin">
                                </div>
                                <div class="form-group">
                                    <label for="lastName" class="form-label">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" class="form-input" placeholder="Enter last name" value="User">
                                </div>
                            </div>

                            <!-- Email and Phone -->
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email" class="form-label">
                                        Email Address
                                        <span class="readonly-badge">Read Only</span>
                                    </label>
                                    <input type="email" id="email" class="form-input readonly" value="admin@rentit.com" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="phone" class="form-label">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" class="form-input" placeholder="+63 XXX XXX XXXX" value="+63 917 123 4567">
                                </div>
                            </div>

                            <!-- Role Display -->
                            <div class="form-group">
                                <label class="form-label">
                                    Role
                                    <span class="readonly-badge">System Assigned</span>
                                </label>
                                <div class="role-display">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    Administrator
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-primary" id="saveProfileBtn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                        <polyline points="17 21 17 13 7 13 7 21"/>
                                        <polyline points="7 3 7 8 15 8"/>
                                    </svg>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <!-- Password Card -->
                <section class="settings-card">
                    <div class="settings-card-header">
                        <div class="settings-icon warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="settings-card-title">Change Password</h2>
                            <p class="settings-card-subtitle">Update your account password</p>
                        </div>
                    </div>
                    <div class="settings-card-body">
                        <form id="passwordForm">
                            <div class="form-group">
                                <label for="currentPassword" class="form-label">Current Password</label>
                                <div class="password-input-wrapper">
                                    <input type="password" id="currentPassword" name="currentPassword" class="form-input" placeholder="Enter current password">
                                    <button type="button" class="password-toggle" data-target="currentPassword">
                                        <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="display:none;">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="newPassword" class="form-label">New Password</label>
                                <div class="password-input-wrapper">
                                    <input type="password" id="newPassword" name="newPassword" class="form-input" placeholder="Enter new password">
                                    <button type="button" class="password-toggle" data-target="newPassword">
                                        <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="display:none;">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="password-strength" id="passwordStrength"></div>
                            </div>

                            <div class="form-group">
                                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                <div class="password-input-wrapper">
                                    <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" placeholder="Confirm new password">
                                    <button type="button" class="password-toggle" data-target="confirmPassword">
                                        <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="display:none;">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-warning" id="changePasswordBtn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    </main>

    <!-- Scripts -->
    <script src="admin/shared/js/admin-components.js"></script>
    <script src="admin/profile/js/profile.js"></script>
</body>
</html>




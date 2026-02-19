/**
 * Admin Profile Page JavaScript
 * Handles profile updates and password changes
 */

document.addEventListener('DOMContentLoaded', function() {
    initProfile();
});

function initProfile() {
    // Initialize admin components
    if (typeof AdminComponents !== 'undefined') {
        AdminComponents.injectSidebar();
        AdminComponents.injectTopbar();
    }
    
    // Load user data
    loadUserData();
    
    // Initialize forms
    initProfileForm();
    initPasswordForm();
    initPasswordToggles();
    initProfilePicture();
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    // Update form fields
    if (user.firstName) {
        document.getElementById('firstName').value = user.firstName;
    }
    if (user.lastName) {
        document.getElementById('lastName').value = user.lastName;
    }
    if (user.email) {
        document.getElementById('email').value = user.email;
    }
    if (user.phone) {
        document.getElementById('phone').value = user.phone;
    }
    
    // Update avatar
    updateAvatar(user.firstName, user.lastName);
}

/**
 * Update avatar initial
 */
function updateAvatar(firstName, lastName) {
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : 'A';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        avatar.textContent = firstInitial + lastInitial;
    }
}

/**
 * Initialize profile form
 */
function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', handleProfileSubmit);
        
        // Update avatar on name change
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        
        if (firstNameInput && lastNameInput) {
            firstNameInput.addEventListener('input', () => {
                updateAvatar(firstNameInput.value, lastNameInput.value);
            });
            lastNameInput.addEventListener('input', () => {
                updateAvatar(firstNameInput.value, lastNameInput.value);
            });
        }
    }
}

/**
 * Handle profile form submit
 */
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!firstName || !lastName) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Save to localStorage
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    user.firstName = firstName;
    user.lastName = lastName;
    user.name = `${firstName} ${lastName}`;
    user.phone = phone;
    localStorage.setItem('adminUser', JSON.stringify(user));
    
    showToast('Profile updated successfully!', 'success');
}

/**
 * Initialize password form
 */
function initPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (form) {
        form.addEventListener('submit', handlePasswordSubmit);
        
        // Password strength indicator
        const newPassword = document.getElementById('newPassword');
        if (newPassword) {
            newPassword.addEventListener('input', updatePasswordStrength);
        }
    }
}

/**
 * Handle password form submit
 */
function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all password fields', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Mock password update (in real app, would call API)
    showToast('Password updated successfully!', 'success');
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Clear strength indicator
    const strengthContainer = document.getElementById('passwordStrength');
    if (strengthContainer) {
        strengthContainer.innerHTML = '';
    }
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(e) {
    const password = e.target.value;
    const container = document.getElementById('passwordStrength');
    
    if (!container) return;
    
    // Calculate strength
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Generate bars
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    
    let html = '';
    for (let i = 0; i < 5; i++) {
        const active = i < strength;
        html += `<div class="strength-bar" style="background: ${active ? colors[strength - 1] : ''}"></div>`;
    }
    
    container.innerHTML = html;
}

/**
 * Initialize password toggle buttons
 */
function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize profile picture upload
 */
function initProfilePicture() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('profilePictureInput');
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('File size must be less than 2MB', 'error');
                    return;
                }
                
                // In real app, would upload to server
                showToast('Profile picture updated!', 'success');
            }
        });
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        padding: 12px 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

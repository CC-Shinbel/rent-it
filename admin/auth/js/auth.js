/**
 * Admin Authentication Module
 * Different approach from client - uses session-based auth with role verification
 * 
 * @fileoverview Admin login functionality with mock backend
 * 
 * ⚠️ SECURITY NOTE: 
 * This is a DEMO implementation with hardcoded credentials.
 * In production, credentials should be:
 * - Stored server-side in a secure database
 * - Passwords hashed with bcrypt or similar
 * - API endpoints for authentication
 * - Never exposed in client-side JavaScript
 */

// =====================================================
// DEMO ADMIN ACCOUNTS
// ⚠️ FOR DEVELOPMENT/DEMO ONLY - NOT FOR PRODUCTION
// =====================================================
const ADMIN_ACCOUNTS = [
    {
        id: 'ADM001',
        username: 'admin1',
        password: 'admin1',
        fullName: 'System Administrator',
        email: 'admin1@certicode.com',
        role: 'super_admin',
        avatar: null,
        permissions: ['all'],
        lastLogin: null,
        createdAt: '2026-01-01T00:00:00Z'
    },
    {
        id: 'ADM002',
        username: 'manager',
        password: 'manager123',
        fullName: 'Operations Manager',
        email: 'manager@certicode.com',
        role: 'manager',
        avatar: null,
        permissions: ['bookings', 'inventory', 'reports'],
        lastLogin: null,
        createdAt: '2026-01-15T00:00:00Z'
    }
];

// =====================================================
// SESSION MANAGEMENT
// =====================================================
const AdminSession = {
    STORAGE_KEY: 'certicode_admin_session',
    SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 hours

    /**
     * Create a new admin session
     */
    create(admin, remember = false) {
        const session = {
            adminId: admin.id,
            username: admin.username,
            fullName: admin.fullName,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            token: this.generateToken(),
            createdAt: Date.now(),
            expiresAt: Date.now() + this.SESSION_DURATION
        };

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(this.STORAGE_KEY, JSON.stringify(session));
        
        // Also set in the other storage to check on page load
        if (remember) {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }

        return session;
    },

    /**
     * Get current session
     */
    get() {
        const localSession = localStorage.getItem(this.STORAGE_KEY);
        const sessionSession = sessionStorage.getItem(this.STORAGE_KEY);
        
        const sessionData = localSession || sessionSession;
        if (!sessionData) return null;

        try {
            const session = JSON.parse(sessionData);
            
            // Check if session is expired
            if (Date.now() > session.expiresAt) {
                this.destroy();
                return null;
            }

            return session;
        } catch (e) {
            this.destroy();
            return null;
        }
    },

    /**
     * Destroy session (logout)
     */
    destroy() {
        localStorage.removeItem(this.STORAGE_KEY);
        sessionStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Check if admin is authenticated
     */
    isAuthenticated() {
        return this.get() !== null;
    },

    /**
     * Generate a mock token
     */
    generateToken() {
        return 'adm_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
};

// =====================================================
// AUTHENTICATION SERVICE
// =====================================================
const AdminAuth = {
    /**
     * Authenticate admin with credentials
     * @param {string} username 
     * @param {string} password 
     * @param {boolean} remember 
     * @returns {Promise<{success: boolean, message: string, admin?: object}>}
     */
    async login(username, password, remember = false) {
        // Simulate network delay
        await this.simulateNetworkDelay(800);

        // Validate inputs
        if (!username || !password) {
            return {
                success: false,
                message: 'Please enter both username and password'
            };
        }

        // Find admin account
        const admin = ADMIN_ACCOUNTS.find(
            acc => acc.username.toLowerCase() === username.toLowerCase()
        );

        if (!admin) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }

        // Verify password (in production, use bcrypt comparison)
        if (admin.password !== password) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }

        // Create session
        const session = AdminSession.create(admin, remember);

        // Update last login (in production, this would be server-side)
        admin.lastLogin = new Date().toISOString();

        return {
            success: true,
            message: 'Login successful',
            admin: {
                id: admin.id,
                username: admin.username,
                fullName: admin.fullName,
                role: admin.role
            },
            session
        };
    },

    /**
     * Logout current admin
     */
    logout() {
        AdminSession.destroy();
        window.location.href = 'admin/auth/login.php';
    },

    /**
     * Check authentication and redirect if needed
     */
    requireAuth() {
        if (!AdminSession.isAuthenticated()) {
            window.location.href = 'admin/auth/login.php';
            return false;
        }
        return true;
    },

    /**
     * Redirect if already authenticated
     */
    redirectIfAuthenticated() {
        if (AdminSession.isAuthenticated()) {
            window.location.href = 'admin/dashboard/dashboard.php';
            return true;
        }
        return false;
    },

    /**
     * Simulate network delay for realistic UX
     */
    simulateNetworkDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// =====================================================
// UI CONTROLLER
// =====================================================
const LoginUI = {
    form: null,
    usernameInput: null,
    passwordInput: null,
    rememberCheckbox: null,
    loginBtn: null,
    errorMessage: null,
    togglePasswordBtn: null,

    /**
     * Initialize UI elements and event listeners
     */
    init() {
        // Don't auto-redirect - let user manually log in each time
        // Clear any existing stale sessions when visiting login page
        // (User explicitly navigated to login, so they likely want to re-authenticate)
        
        // Get DOM elements
        this.form = document.getElementById('adminLoginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('rememberMe');
        this.loginBtn = document.getElementById('loginBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.togglePasswordBtn = document.getElementById('togglePassword');

        if (!this.form) return;

        // Bind events
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.togglePasswordBtn?.addEventListener('click', () => this.togglePassword());

        // Auto-focus username field
        this.usernameInput?.focus();

        // Clear error on input
        [this.usernameInput, this.passwordInput].forEach(input => {
            input?.addEventListener('input', () => this.hideError());
        });
    },

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const remember = this.rememberCheckbox?.checked || false;

        // Show loading state
        this.setLoading(true);
        this.hideError();

        try {
            const result = await AdminAuth.login(username, password, remember);

            if (result.success) {
                // Show success briefly before redirect
                this.loginBtn.innerHTML = '<span class="btn-text">✓ Success!</span>';
                
                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'admin/dashboard/dashboard.php';
                }, 500);
            } else {
                this.showError(result.message);
                this.setLoading(false);
            }
        } catch (error) {
            console.error('[AUTH] Login error:', error);
            this.showError('An unexpected error occurred. Please try again.');
            this.setLoading(false);
        }
    },

    /**
     * Toggle password visibility
     */
    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const eyeOpen = this.togglePasswordBtn.querySelector('.eye-open');
        const eyeClosed = this.togglePasswordBtn.querySelector('.eye-closed');
        
        if (eyeOpen && eyeClosed) {
            if (type === 'password') {
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            } else {
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            }
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.classList.add('show');
        }
    },

    /**
     * Hide error message
     */
    hideError() {
        if (this.errorMessage) {
            this.errorMessage.classList.remove('show');
        }
    },

    /**
     * Set loading state
     */
    setLoading(loading) {
        if (this.loginBtn) {
            this.loginBtn.disabled = loading;
            const btnText = this.loginBtn.querySelector('.btn-text');
            const btnLoader = this.loginBtn.querySelector('.btn-loader');
            
            if (loading) {
                if (btnText) btnText.hidden = true;
                if (btnLoader) btnLoader.hidden = false;
            } else {
                if (btnText) btnText.hidden = false;
                if (btnLoader) btnLoader.hidden = true;
            }
        }

        // Disable inputs during loading
        if (this.usernameInput) this.usernameInput.disabled = loading;
        if (this.passwordInput) this.passwordInput.disabled = loading;
    }
};

// =====================================================
// INITIALIZE ON DOM READY
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    LoginUI.init();
});

// Export for use in other modules
window.AdminAuth = AdminAuth;
window.AdminSession = AdminSession;

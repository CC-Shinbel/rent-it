/**
 * =====================================================
 * AUTH PAGE JAVASCRIPT
 * Handles Login and Registration functionality
 * =====================================================
 */

const Auth = {
    
    activeTab: 'login',
    isTransitioning: false,
    loading: false,
    
    API_BASE_URL: '/rent-it/api/auth/',
    LOGIN_URL: 'login.php',
    REGISTER_URL: 'register.php',

    /**
     * Initialize the auth page
     */
    init() {
        if (Components.isAuthenticated()) {
            window.location.href = '../dashboard.php';
            return;
        }

        this.handleUrlHash();

        // Setup event listeners
        this.setupTabListeners();
        this.setupFormListeners();
        this.setupPasswordToggles();

        // Initialize animations
        Components.initStaggerAnimation('.auth-card');

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleUrlHash());
    },

    /**
     * Handle URL hash for deep linking (#login or #register)
     */
    handleUrlHash() {
        const hash = window.location.hash;
        if (hash === '#register') {
            this.switchTab('register', false);
        } else if (hash === '#login') {
            this.switchTab('login', false);
        }
    },

    /**
     * Setup tab switching listeners
     */
    setupTabListeners() {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');

        loginTab?.addEventListener('click', () => this.switchTab('login'));
        registerTab?.addEventListener('click', () => this.switchTab('register'));
    },

    /**
     * @param {string} tab 
     * @param {boolean} updateHash 
     */
    switchTab(tab, updateHash = true) {
        if (tab === this.activeTab || this.isTransitioning) return;

        this.isTransitioning = true;
        this.activeTab = tab;

        // Update URL hash
        if (updateHash) {
            window.history.pushState(null, '', `#${tab}`);
        }

        // Update tab buttons
        document.getElementById('loginTab')?.classList.toggle('active', tab === 'login');
        document.getElementById('registerTab')?.classList.toggle('active', tab === 'register');

        // Update tab indicator
        const indicator = document.getElementById('tabIndicator');
        if (indicator) {
            indicator.classList.toggle('register', tab === 'register');
        }

        // Fade out current form
        const formWrapper = document.getElementById('formWrapper');
        if (formWrapper) {
            formWrapper.classList.remove('fade-in');
            formWrapper.classList.add('fade-out');
        }

        // After transition, switch content
        setTimeout(() => {
            document.getElementById('loginForm')?.classList.toggle('hidden', tab !== 'login');
            document.getElementById('registerForm')?.classList.toggle('hidden', tab !== 'register');

            // Fade in new form
            if (formWrapper) {
                formWrapper.classList.remove('fade-out');
                formWrapper.classList.add('fade-in');
            }

            this.isTransitioning = false;
        }, 200);
    },

    /**
     * Setup form submission listeners
     */
    setupFormListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
    
        // Iwasan ang default redirect sa login.php kapag social button ang pinindot
        loginForm?.addEventListener('submit', (e) => {
            if (e.submitter && e.submitter.classList.contains('auth-social-btn')) return;
            this.handleLogin(e);
        });
    
        registerForm?.addEventListener('submit', (e) => {
            if (e.submitter && e.submitter.classList.contains('auth-social-btn')) return;
            this.handleRegister(e);
        });
    },

    /**
     * Setup password visibility toggles
     */
    setupPasswordToggles() {
        document.querySelectorAll('.eye-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.currentTarget.parentElement.querySelector('input');
                if (input) {
                    Components.togglePasswordVisibility(input, e.currentTarget);
                }
            });
        });
    },

    /**
     * Handle login form submission
     * @param {Event} e - Form submit event
     */
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Clear previous errors
        this.hideError();

        // Validate
        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        this.setLoading(true, submitBtn, 'Signing in...');

        try {
            // Call PHP API
            const response = await fetch(this.API_BASE_URL + this.LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.session_id || 'authenticated');
            localStorage.setItem('user_role', data.user.role);
            localStorage.setItem('user_name', data.user.full_name || data.user.email.split('@')[0]);

            // Show success message
            this.showSuccess('Login successful! Redirecting...');

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = '../dashboard.php';
            }, 1500);

        } catch (error) {
            this.showError(error.message || 'Login failed. Please try again.');
        } finally {
            this.setLoading(false, submitBtn, 'Sign In  →');
        }
    },

    /**
     * Handle registration form submission
     * @param {Event} e - Form submit event
     */
    async handleRegister(e) {
        e.preventDefault();

        const fullName = document.getElementById('registerFullname')?.value.trim();
        const phone = document.getElementById('registerPhone')?.value.trim();
        const email = document.getElementById('registerEmail')?.value.trim();
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Clear previous errors
        this.hideError();

        // Validate
        if (!email || !password || !confirmPassword) {
            this.showError('Please fill in all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        // Show loading state
        this.setLoading(true, submitBtn, 'Creating account...');

        try {
            // Call PHP API
            const response = await fetch(this.API_BASE_URL + this.REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                    confirm_password: confirmPassword
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', 'authenticated');
            localStorage.setItem('user_role', data.user.role);
            localStorage.setItem('user_name', data.user.full_name || data.user.email.split('@')[0]);

            // Show success message
            this.showSuccess('Registration successful! Redirecting...');

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = '../dashboard.php';
            }, 1500);

        } catch (error) {
            this.showError(error.message || 'Registration failed. Please try again.');
        } finally {
            this.setLoading(false, submitBtn, 'Get Started  →');
        }
    },

    /**
     * Set loading state on button
     * @param {boolean} loading - Loading state
     * @param {phpButtonElement} button - Submit button
     * @param {string} text - Button text
     */
    setLoading(loading, button, text) {
        this.loading = loading;
        if (button) {
            button.disabled = loading;
            button.textContent = text;
        }
    },

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('error');
            errorEl.classList.add('success');
            errorEl.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorEl.classList.add('hidden');
            }, 5000);
        }
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('success');
            errorEl.classList.add('error');
            errorEl.classList.remove('hidden');
        }
    },

    
    hideError() {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();

    const passwordInput = document.getElementById('registerPassword');
    const reqLength = document.getElementById('reqLength');
    const reqUpper = document.getElementById('reqUpper');
    const reqNumber = document.getElementById('reqNumber');
    
    // DAPAT MAY 'IF' CHECK DITO PARA HINDI MAG-CRASH ANG SCRIPT
    if (passwordInput && reqLength && reqUpper && reqNumber) {
        passwordInput.addEventListener('input', function() {
            const value = passwordInput.value;
        
            // 1. Check Length
            if (value.length >= 8) {
                reqLength.classList.add('valid');
                reqLength.classList.remove('invalid');
            } else {
                reqLength.classList.add('invalid');
                reqLength.classList.remove('valid');
            }
        
            // 2. Check Uppercase
            if (/[A-Z]/.test(value)) {
                reqUpper.classList.add('valid');
                reqUpper.classList.remove('invalid');
            } else {
                reqUpper.classList.add('invalid');
                reqUpper.classList.remove('valid');
            }
        
            // 3. Check Numbers
            if (/[0-9]/.test(value)) {
                reqNumber.classList.add('valid');
                reqNumber.classList.remove('invalid');
            } else {
                reqNumber.classList.add('invalid');
                reqNumber.classList.remove('valid');
            }
        });
    }
});
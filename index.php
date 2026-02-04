<?php
// filepath: c:\xampp\htdocs\rent-it\index.php
session_start();

// Define base path for consistent URLs
define('BASE_URL', '/rent-it');

// Check if user is already logged in
$isLoggedIn = isset($_SESSION['user_id']);
$userName = $_SESSION['user_name'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - High-quality videoke machines with 50k+ songs and wireless mics delivered to your doorstep.">
    <title>RentIt - Premium Videoke Rentals</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?= BASE_URL ?>/assets/images/rIT_logo_tp.png">

    <!-- Stylesheets (Order: Theme → Layout) -->
    <link rel="stylesheet" href="<?= BASE_URL ?>/shared/css/theme.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/landingpage/css/index.css">
    
    <!-- Theme Script (Prevents flash of wrong theme) -->
    <script src="<?= BASE_URL ?>/shared/js/theme.js"></script>
</head>
<body>
    <!-- ============================
         SITE HEADER
         ============================ -->
    <header class="site-header">
        <div class="container header-inner">
            <!-- Hamburger (Mobile) -->
            <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">☰</button>
            
            <!-- Brand -->
            <a href="<?= BASE_URL ?>/" class="brand">
                <div class="logo-drawer">
                    <img src="<?= BASE_URL ?>/assets/images/rIT_logo_tp.png" alt="RentIt Logo">
                </div>
                <span class="brand-name">Rent<span class="accent">It</span></span>
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="main-nav">
                <a href="<?= BASE_URL ?>/" class="nav-link active">Home</a>
                <a href="#machines" class="nav-link">Rentals</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <a href="<?= BASE_URL ?>/pages/aboutus.html" class="nav-link">About</a>
                <a href="<?= BASE_URL ?>/pages/contactus.html" class="nav-link">Contact</a>
            </nav>
            
            <!-- Header Actions -->
            <div class="header-actions">
                <!-- Theme Toggle -->
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                    <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                    <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>

                <?php if ($isLoggedIn): ?>
                    <a href="<?= BASE_URL ?>/client/dashboard/dashboard.php" class="btn btn-primary">Dashboard</a>
                <?php else: ?>
                    <a href="<?= BASE_URL ?>/client/auth/login.php#login" class="btn btn-outline">Login</a>
                    <a href="<?= BASE_URL ?>/client/auth/login.php#register" class="btn btn-primary">Register</a>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Mobile Navigation -->
        <nav class="mobile-nav" id="mobileNav">
            <a href="<?= BASE_URL ?>/" class="mobile-link">Home</a>
            <a href="#machines" class="mobile-link">Rentals</a>
            <a href="#pricing" class="mobile-link">Pricing</a>
            <a href="<?= BASE_URL ?>/pages/aboutus.html" class="mobile-link">About</a>
            <a href="<?= BASE_URL ?>/pages/contactus.html" class="mobile-link">Contact</a>
            <div class="mobile-actions">
                <?php if ($isLoggedIn): ?>
                    <a href="<?= BASE_URL ?>/client/dashboard/dashboard.php" class="btn btn-primary" style="width: 100%;">Dashboard</a>
                <?php else: ?>
                    <a href="<?= BASE_URL ?>/client/auth/login.php#login" class="btn btn-primary" style="width: 100%;">Login</a>
                <?php endif; ?>
            </div>
        </nav>
    </header>

    <main>
        <!-- ============================
             HERO SECTION
             ============================ -->
        <section class="hero">
            <div class="container">
                <div class="hero-inner">
                    <span class="pill">New Arrivals: Gen 5 Systems</span>
                    <h1 class="hero-title">Bring the Party <span class="accent">Home</span></h1>
                    <p class="hero-sub">
                        High-quality videoke machines with 50k+ songs and wireless mics delivered to your doorstep. Crystal clear sound, professional setup.
                    </p>
                    <div class="hero-cta">
                        <a href="#machines" class="btn btn-primary">Browse Machines</a>
                        <a href="#pricing" class="btn btn-outline">View Packages</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================
             CHOOSE YOUR MACHINE
             ============================ -->
        <section id="machines" class="choose">
            <div class="container">
                <div class="tabs-row">
                    <div class="section-header animate-on-scroll">
                        <h2 class="section-title">Choose Your Machine</h2>
                        <p class="section-subtitle">Select from our range of high-performance videoke setups.</p>
                    </div>
                    <div class="tabs">
                        <button class="tab active">All Machines</button>
                        <button class="tab">Standard</button>
                        <button class="tab">Premium</button>
                    </div>
                </div>

                <div class="cards">
                    <!-- Card 1: Mini Star -->
                    <article class="card animate-on-scroll animate-delay-1">
                        <div class="card-media">
                            <img src="<?= BASE_URL ?>/assets/images/ministar.jpg" alt="Mini Star Videoke Machine">
                        </div>
                        <div class="card-body">
                            <div class="card-head">
                                <div>
                                    <h3 class="card-title">Mini Star</h3>
                                    <p class="card-subtitle">Budget friendly & compact</p>
                                </div>
                                <div class="card-price">
                                    <div class="price-amount">₱800</div>
                                    <div class="price-label">Starting Price</div>
                                </div>
                            </div>
                            <ul class="card-specs">
                                <li>30,000+ Classic Songs</li>
                                <li>2 Wired Microphones</li>
                                <li>Portable 8" Speaker</li>
                                <li>Connect to your own TV</li>
                            </ul>
                            <div class="card-footer">
                                <a href="<?= BASE_URL ?>/client/auth/login.php" class="btn btn-primary">Rent Mini Star</a>
                            </div>
                        </div>
                    </article>

                    <!-- Card 2: Platinum Pro -->
                    <article class="card animate-on-scroll animate-delay-2">
                        <div class="card-media">
                            <img src="<?= BASE_URL ?>/assets/images/platinumpro.webp" alt="Platinum Pro Videoke Machine">
                        </div>
                        <div class="card-body">
                            <div class="card-head">
                                <div>
                                    <h3 class="card-title">Platinum Pro</h3>
                                    <p class="card-subtitle">Crystal clear acoustics</p>
                                </div>
                                <div class="card-price">
                                    <div class="price-amount">₱1,500</div>
                                    <div class="price-label">Starting Price</div>
                                </div>
                            </div>
                            <ul class="card-specs">
                                <li>50,000+ Songs (Updated Monthly)</li>
                                <li>2 UHF Wireless Microphones</li>
                                <li>12" Active Speaker System</li>
                                <li>24" LED TV Display Included</li>
                            </ul>
                            <div class="card-footer">
                                <a href="<?= BASE_URL ?>/client/auth/login.php" class="btn btn-primary">Rent Platinum Pro</a>
                            </div>
                        </div>
                    </article>

                    <!-- Card 3: Party Box X -->
                    <article class="card animate-on-scroll animate-delay-3">
                        <div class="card-media">
                            <img src="<?= BASE_URL ?>/assets/images/partyboxx.webp" alt="Party Box X Videoke Machine">
                        </div>
                        <div class="card-body">
                            <div class="card-head">
                                <div>
                                    <h3 class="card-title">Party Box X</h3>
                                    <p class="card-subtitle">For large gatherings</p>
                                </div>
                                <div class="card-price">
                                    <div class="price-amount">₱2,500</div>
                                    <div class="price-label">Starting Price</div>
                                </div>
                            </div>
                            <ul class="card-specs">
                                <li>70,000+ Songs (Full HD Video)</li>
                                <li>4 UHF Wireless Microphones</li>
                                <li>Dual 15" Speakers + Subwoofer</li>
                                <li>43" Smart TV on Stand</li>
                            </ul>
                            <div class="card-footer">
                                <a href="<?= BASE_URL ?>/client/auth/login.php" class="btn btn-primary">Rent Party Box X</a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ============================
             DELIVERY & ESTIMATOR
             ============================ -->
        <section id="pricing" class="delivery">
            <div class="container delivery-grid">
                <!-- Left Column -->
                <div class="delivery-left animate-on-scroll">
                    <h2>Fast & Reliable Delivery</h2>
                    <p class="delivery-sub">
                        We deliver, set up, and test the equipment for you. Enter your location to get an instant estimate of delivery fees and setup times.
                    </p>

                    <div class="feature-stack">
                        <div class="feature-box">
                            <div class="feature-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                                </svg>
                            </div>
                            <div class="feature-content">
                                <div class="feature-label">Setup Time</div>
                                <div class="feature-value">15 mins</div>
                            </div>
                        </div>

                        <div class="feature-box">
                            <div class="feature-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 3h15v13H1zM16 8h4l3 4v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                </svg>
                            </div>
                            <div class="feature-content">
                                <div class="feature-label">Avg Delivery</div>
                                <div class="feature-value">45 mins</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Estimator -->
                <aside class="estimator-card animate-on-scroll animate-delay-2">
                    <h3 class="estimator-title">Delivery Estimator</h3>

                    <label class="est-label">Your Location</label>
                    <div class="input-with-icon">
                        <span class="input-icon">📍</span>
                        <input type="text" class="est-input" placeholder="Enter city or address" id="locationInput">
                    </div>

                    <div class="fee-row">
                        <div>
                            <div class="fee-label">Estimated Delivery Fee</div>
                            <div class="fee-note">Based on your current zone</div>
                        </div>
                        <div class="fee-value">₱150.00</div>
                    </div>

                    <div class="map-box">
                        <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                            <rect width="400" height="120" fill="#61A5C2"/>
                            <path d="M0 30 L400 60" stroke="#E5E7EB" stroke-width="4" opacity="0.6"/>
                            <path d="M0 80 L400 50" stroke="#E5E7EB" stroke-width="3" opacity="0.5"/>
                            <path d="M100 0 L150 120" stroke="#E5E7EB" stroke-width="3" opacity="0.4"/>
                            <path d="M280 0 L320 120" stroke="#E5E7EB" stroke-width="3" opacity="0.4"/>
                            <circle cx="200" cy="60" r="6" fill="#FB7012"/>
                            <circle cx="200" cy="60" r="12" fill="#FB7012" opacity="0.3"/>
                        </svg>
                        <span class="map-label">Manila • Mandaluyong</span>
                    </div>

                    <button class="btn btn-primary est-cta">Calculate Final Price</button>
                </aside>
            </div>
        </section>

        <!-- ============================
             STATS SECTION
             ============================ -->
        <section class="stats">
            <div class="container stats-grid">
                <div class="stat animate-on-scroll">
                    <div class="stat-num">5,000+</div>
                    <div class="stat-label">Parties Hosted</div>
                </div>
                <div class="stat animate-on-scroll animate-delay-1">
                    <div class="stat-num">4.9/5</div>
                    <div class="stat-label">Customer Rating</div>
                </div>
                <div class="stat animate-on-scroll animate-delay-2">
                    <div class="stat-num">24/7</div>
                    <div class="stat-label">Live Support</div>
                </div>
                <div class="stat animate-on-scroll animate-delay-3">
                    <div class="stat-num">100%</div>
                    <div class="stat-label">Uptime Guarantee</div>
                </div>
            </div>
        </section>

        <!-- ============================
             CTA SECTION - LOGIN/REGISTER
             ============================ -->
        <section class="cta-section">
            <div class="container">
                <div class="cta-card animate-on-scroll">
                    <div class="cta-content">
                        <?php if ($isLoggedIn): ?>
                            <h2 class="cta-title">Welcome Back, <?= htmlspecialchars($userName) ?>!</h2>
                            <p class="cta-subtitle">
                                Continue browsing our catalog and manage your bookings from your dashboard.
                            </p>
                            <div class="cta-actions">
                                <a href="<?= BASE_URL ?>/client/catalog/catalog.php" class="btn btn-primary">Browse Catalog</a>
                                <a href="<?= BASE_URL ?>/client/dashboard/dashboard.php" class="btn btn-outline">Go to Dashboard</a>
                            </div>
                        <?php else: ?>
                            <h2 class="cta-title">Ready to Book Your Next Event?</h2>
                            <p class="cta-subtitle">
                                Create an account to access our full catalog, manage bookings, and enjoy exclusive member benefits. Already have an account? Sign in to continue where you left off.
                            </p>
                            <div class="cta-actions">
                                <a href="<?= BASE_URL ?>/client/auth/login.php#register" class="btn btn-primary">Create Account</a>
                                <a href="<?= BASE_URL ?>/client/auth/login.php#login" class="btn btn-outline">Sign In</a>
                            </div>
                        <?php endif; ?>
                        <div class="cta-benefits">
                            <div class="cta-benefit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span>Priority Booking</span>
                            </div>
                            <div class="cta-benefit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span>Member Discounts</span>
                            </div>
                            <div class="cta-benefit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span>Booking History</span>
                            </div>
                        </div>
                    </div>
                    <div class="cta-visual">
                        <div class="cta-icon">🎤</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- ============================
         SITE FOOTER
         ============================ -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-inner">
                <!-- Brand Column -->
                <div class="footer-brand">
                    <div class="logo-drawer">
                        <img src="<?= BASE_URL ?>/assets/images/rIT_logo_tp.png" alt="RentIt Logo">
                    </div>
                    <div class="brand-text">
                        <h4 class="brand-title">RentIt</h4>
                        <p class="brand-sub">
                            Making celebrations louder and more memorable with premium videoke rentals since 2018.
                        </p>
                        <p class="powered-by">Powered by <a href="https://certicode.com" target="_blank" rel="noopener">CertiCode</a></p>
                        <div class="social-links">
                            <a href="<?= BASE_URL ?>/pages/wip.html" class="social" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                            <a href="<?= BASE_URL ?>/pages/wip.html" class="social" aria-label="Share">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="18" cy="5" r="3"/>
                                    <circle cx="6" cy="12" r="3"/>
                                    <circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                </svg>
                            </a>
                            <a href="mailto:hello@rentit.ph" class="social" aria-label="Email">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Company Links -->
                <div class="footer-col">
                    <h5>Company</h5>
                    <nav class="footer-nav">
                        <a href="<?= BASE_URL ?>/pages/aboutus.html" class="footer-link">About Us</a>
                        <a href="<?= BASE_URL ?>/pages/contactus.html" class="footer-link">Contact</a>
                        <a href="<?= BASE_URL ?>/pages/terms.html" class="footer-link">Terms of Service</a>
                    </nav>
                </div>

                <!-- Support Links -->
                <div class="footer-col">
                    <h5>Support</h5>
                    <nav class="footer-nav">
                        <a href="<?= BASE_URL ?>/pages/wip.html" class="footer-link">How It Works</a>
                        <a href="#pricing" class="footer-link">Pricing Packages</a>
                        <a href="<?= BASE_URL ?>/pages/wip.html" class="footer-link">Safety Guidelines</a>
                        <a href="<?= BASE_URL ?>/pages/wip.html" class="footer-link">Delivery Areas</a>
                    </nav>
                </div>
            </div>

            <div class="footer-divider"></div>

            <div class="footer-bottom">
                <p class="copyright">© 2026 RentIt Videoke Rentals • v2.4.0</p>
                <div class="policy-links">
                    <a href="<?= BASE_URL ?>/pages/privacy-policy.html" class="policy-link">Privacy Policy</a>
                    <a href="<?= BASE_URL ?>/pages/cookie-policy.html" class="policy-link">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="<?= BASE_URL ?>/landingpage/js/index.js"></script>
</body>
</html>

<?php
include '../../shared/php/db_connection.php';

$item_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($item_id > 0) {
    $query = "SELECT * FROM item WHERE item_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $item = $result->fetch_assoc();

    if (!$item) {
        die("Item not found.");
    }
} else {
    die("Invalid Item ID.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rent-it/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Product Details">
    <title>RentIt - Product Details</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="shared/css/theme.css">
    <link rel="stylesheet" href="shared/css/globals.css">
    <link rel="stylesheet" href="client/dashboard/dashboard.css">
    <link rel="stylesheet" href="client/catalog/itemdescription.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Container (Injected by JS) -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar Container (Injected by JS) -->
            <div id="topbarContainer"></div>
            
            <!-- Content Area -->
            <div class="content-area fade-in-up" id="contentArea">
                <!-- Breadcrumb -->
                <nav class="breadcrumb" aria-label="Breadcrumb">
                    <a href="client/catalog/catalog.html">Catalog</a>
                    <span class="separator">/</span>
                    <span class="current" id="breadcrumbItem">Karaoke King Pro v2</span>
                </nav>

                <!-- Product Detail Layout -->
                <div class="product-detail-layout">
                    <!-- Left Column - Images & Gallery -->
                    <div class="product-gallery">
                        <div class="main-image-wrap">
                            <a class="main-image-link" id="mainImageLink" href="assets/images/products/karaoke-king-v2.jpg" target="_blank" rel="noopener" title="Open image in new tab">
                                <img src="assets/images/products/karaoke-king-v2.jpg" alt="Karaoke King Pro v2" class="main-image" id="mainImage"
                                     onerror="this.onerror=null; this.src='/assets/images/brokenimg.svg'">
                            </a>
                            <span class="product-status available" id="productStatus">Available</span>
                        </div>
                        <div class="thumbnail-gallery" id="thumbnailGallery">
                            <button class="thumbnail active" data-img="/assets/images/products/karaoke-king-v2.jpg">
                                <img src="assets/images/products/karaoke-king-v2.jpg" alt="Main view"
                                     onerror="this.parentElement.style.display='none'">
                            </button>
                            <button class="thumbnail" data-img="/assets/images/products/karaoke-king-v2-side.jpg">
                                <img src="assets/images/products/karaoke-king-v2-side.jpg" alt="Side view"
                                     onerror="this.parentElement.style.display='none'">
                            </button>
                            <button class="thumbnail" data-img="/assets/images/products/karaoke-king-v2-back.jpg">
                                <img src="assets/images/products/karaoke-king-v2-back.jpg" alt="Back view"
                                     onerror="this.parentElement.style.display='none'">
                            </button>
                        </div>
                    </div>

                    <!-- Right Column - Product Info -->
                    <div class="product-info">
                        <div class="product-header">
                            <span class="product-category" id="productCategory">Premium</span>
                            <h1 class="product-title" id="productTitle">Karaoke King Pro v2</h1>
                            <div class="product-rating">
                                <div class="rating-stars" id="ratingStars">
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star half"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <span class="rating-score">4.5</span>
                                <span class="rating-count">(<span id="reviewCount">24</span> reviews)</span>
                            </div>
                        </div>

                        <div class="product-price-section">
                            <div class="price-display">
                                <span class="price-amount" id="priceAmount">₱120</span>
                                <span class="price-period">/ day</span>
                            </div>
                            <p class="price-note">Minimum 1 day rental. Delivery fee not included.</p>
                        </div>

                        <div class="product-description">
                            <h3>Description</h3>
                            <p id="productDescription">
                                The Karaoke King Pro v2 is our most popular premium videoke machine, featuring enhanced audio quality, 
                                a massive song library of over 20,000 tracks, and dual wireless microphones. Perfect for parties, 
                                family gatherings, and special events. Includes HDMI output for TV connection and Bluetooth connectivity.
                            </p>
                        </div>

                        <div class="product-features">
                            <h3>Features</h3>
                            <ul class="features-list" id="featuresList">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                    Dual wireless microphones
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                    20,000+ song library
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                    HDMI & Bluetooth connectivity
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                    Echo & voice effects
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                    Built-in 500W speakers
                                </li>
                            </ul>
                        </div>

                        <!-- Action Bar -->
                        <div class="action-bar">
                            <button class="btn-add-cart" id="btnAddToCart">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                </svg>
                                Add to Cart
                            </button>
                            <button class="btn-add-favorite" id="btnAddFavorite" title="Add to favorites">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                            <button class="btn-share" id="btnShare" title="Share this product">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Future Bookings Section -->
                <section class="future-bookings-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Availability Calendar
                        </h2>
                        <span class="availability-note">
                            <span class="dot available"></span> Available
                            <span class="dot booked"></span> Booked
                        </span>
                    </div>
                    
                    <div class="bookings-calendar" id="bookingsCalendar">
                        <!-- Calendar will be rendered by JS -->
                        <div class="calendar-loading">Loading availability...</div>
                    </div>

                    <div class="future-bookings-list" id="futureBookingsList">
                        <h4>Upcoming Bookings</h4>
                        <div class="booking-item">
                            <div class="booking-dates">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>Feb 14 - Feb 16, 2026</span>
                            </div>
                            <span class="booking-days">3 days</span>
                        </div>
                        <div class="booking-item">
                            <div class="booking-dates">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>Mar 1 - Mar 5, 2026</span>
                            </div>
                            <span class="booking-days">5 days</span>
                        </div>
                    </div>
                </section>

                <!-- Reviews Section -->
                <section class="reviews-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Customer Reviews
                        </h2>
                        <button class="btn-write-review" id="btnWriteReview">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Write a Review
                        </button>
                    </div>

                    <!-- Rating Summary -->
                    <div class="rating-summary">
                        <div class="rating-overview">
                            <div class="rating-big">
                                <span class="rating-number">4.5</span>
                                <div class="rating-stars-big">
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star half"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <span class="rating-total">Based on 24 reviews</span>
                            </div>
                        </div>
                        <div class="rating-bars">
                            <div class="rating-bar-row">
                                <span>5 stars</span>
                                <div class="rating-bar"><div class="rating-fill" style="width: 60%"></div></div>
                                <span>14</span>
                            </div>
                            <div class="rating-bar-row">
                                <span>4 stars</span>
                                <div class="rating-bar"><div class="rating-fill" style="width: 25%"></div></div>
                                <span>6</span>
                            </div>
                            <div class="rating-bar-row">
                                <span>3 stars</span>
                                <div class="rating-bar"><div class="rating-fill" style="width: 10%"></div></div>
                                <span>3</span>
                            </div>
                            <div class="rating-bar-row">
                                <span>2 stars</span>
                                <div class="rating-bar"><div class="rating-fill" style="width: 4%"></div></div>
                                <span>1</span>
                            </div>
                            <div class="rating-bar-row">
                                <span>1 star</span>
                                <div class="rating-bar"><div class="rating-fill" style="width: 0%"></div></div>
                                <span>0</span>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews List -->
                    <div class="reviews-list" id="reviewsList">
                        <!-- Review 1 -->
                        <article class="review-card">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-avatar">JD</div>
                                    <div class="reviewer-details">
                                        <span class="reviewer-name">Juan Dela Cruz</span>
                                        <span class="review-date">January 28, 2026</span>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                            </div>
                            <p class="review-text">
                                Amazing karaoke machine! The sound quality is incredible and our family had so much fun during our reunion. 
                                The wireless mics worked perfectly and the song selection was huge. Delivery was on time and the staff was very helpful. 
                                Will definitely rent again!
                            </p>
                            <div class="review-footer">
                                <span class="verified-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Verified Rental
                                </span>
                                <button class="btn-helpful">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                    </svg>
                                    Helpful (5)
                                </button>
                            </div>
                        </article>

                        <!-- Review 2 -->
                        <article class="review-card">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-avatar">MS</div>
                                    <div class="reviewer-details">
                                        <span class="reviewer-name">Maria Santos</span>
                                        <span class="review-date">January 20, 2026</span>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star filled"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg viewBox="0 0 24 24" class="star empty"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                            </div>
                            <p class="review-text">
                                Great machine for our birthday party! Easy to set up and the song library has all the latest hits. 
                                Only giving 4 stars because one of the mic batteries ran out quickly, but overall very satisfied.
                            </p>
                            <div class="review-footer">
                                <span class="verified-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Verified Rental
                                </span>
                                <button class="btn-helpful">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                    </svg>
                                    Helpful (2)
                                </button>
                            </div>
                        </article>
                    </div>

                    <!-- Load More Reviews -->
                    <div class="reviews-footer">
                        <button class="btn-load-more" id="btnLoadMore">Load More Reviews</button>
                    </div>
                </section>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>
    
    <!-- Scripts -->
    <script src="shared/js/components.js"></script>
    <script src="itemdescription.js"></script>
</body>
</html>






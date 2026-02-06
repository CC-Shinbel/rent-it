<?php
// filepath: c:\xampp\htdocs\rent-it\client\catalog\catalog.php
session_start();
include '../../shared/php/db_connection.php';

// Security: Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

$query = "SELECT * FROM item";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt Catalog - Browse our selection of videoke and karaoke equipment for rent.">
    <title>RentIt - Browse Catalog</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="../../shared/css/theme.css">
    <link rel="stylesheet" href="../../shared/css/globals.css">
    <link rel="stylesheet" href="../../client/dashboard/dashboard.css">
    <link rel="stylesheet" href="catalog.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/images/rIT_logo_tp.png">
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
            <div class="content-area" id="contentArea">
                <!-- Page Header -->
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Discover our videoke and karaoke equipment for rent.</h1>
                    </div>
                    <div class="page-header-actions">
                        <div class="catalog-search-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input type="text" id="catalogSearch" class="catalog-search" placeholder="Search machine models..." title="Search for karaoke machine models">
                        </div>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div class="rentals-tabs">
                    <button class="tab-link active" data-tab="all" title="View all catalog items">Catalog</button>
                    <button class="tab-link" data-tab="promos" title="View promotional items">Top Promos</button>
                </div>

                <!-- Catalog Layout -->
                <div class="catalog-container">
                    <!-- Filter Sidebar -->
                    <aside class="filter-sidebar">
                        <div class="filter-header">
                            <div class="filter-header-info">
                                <h2 class="filter-title">Filters</h2>
                                <p class="filter-subtitle">Find the perfect machine</p>
                            </div>
                            <button class="reset-filters" title="Reset all filters to default">Reset All</button>
                        </div>

                        <!-- Category Filter -->
                        <div class="filter-card">
                            <h3 class="filter-card-title">
                                <svg class="filter-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"/>
                                    <rect x="14" y="3" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/>
                                    <rect x="3" y="14" width="7" height="7"/>
                                </svg>
                                Category
                            </h3>
                            <div class="category-list">
                                <label class="category-item">
                                    <input type="checkbox" class="category-checkbox" value="portable" title="Filter by portable machines">
                                    <span class="category-color portable"></span>
                                    <span class="category-label">Portable</span>
                                </label>
                                <label class="category-item">
                                    <input type="checkbox" class="category-checkbox" value="premium" title="Filter by premium machines">
                                    <span class="category-color premium"></span>
                                    <span class="category-label">Premium</span>
                                </label>
                                <label class="category-item">
                                    <input type="checkbox" class="category-checkbox" value="professional" title="Filter by professional machines">
                                    <span class="category-color professional"></span>
                                    <span class="category-label">Professional</span>
                                </label>
                            </div>
                        </div>

                        <!-- Status Filter -->
                        <div class="filter-card">
                            <h3 class="filter-card-title">
                                <svg class="filter-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6v6l4 2"/>
                                </svg>
                                Availability Status
                            </h3>
                            <div class="status-list">
                                <label class="status-item">
                                    <input type="checkbox" class="status-checkbox" value="available" title="Show only available machines">
                                    <span class="status-label">
                                        <span class="status-indicator available"></span>
                                        Available Now
                                    </span>
                                </label>
                                <label class="status-item">
                                    <input type="checkbox" class="status-checkbox" value="booked" title="Show only booked machines">
                                    <span class="status-label">
                                        <span class="status-indicator booked"></span>
                                        Booked
                                    </span>
                                </label>
                                <label class="status-item">
                                    <input type="checkbox" class="status-checkbox" value="maintenance" title="Show machines under maintenance">
                                    <span class="status-label">
                                        <span class="status-indicator maintenance"></span>
                                        Under Maintenance
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Price Range Filter -->
                        <div class="filter-card">
                            <h3 class="filter-card-title">
                                <svg class="filter-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="1" x2="12" y2="23"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                                Price Range (₱)
                            </h3>
                            <div class="price-range-wrap">
                                <input type="range" id="priceSlider" class="price-slider" min="50" max="10000" value="10000" step="50" title="Adjust maximum price range">
                                <div class="price-labels">
                                    <span>₱50</span>
                                    <span class="price-value" id="priceValue">₱10,000</span>
                                </div>
                            </div>
                        </div>

                        <!-- Date Availability Filter -->
                        <div class="filter-card">
                            <h3 class="filter-card-title">
                                <svg class="filter-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                Date Availability
                            </h3>
                            
                            <!-- Date Input Row -->
                            <div class="date-input-row">
                                <div class="date-input-group">
                                    <label for="startDateInput" class="date-input-label">Start Date</label>
                                    <input type="text" id="startDateInput" class="date-input" placeholder="Feb 01, 2026" readonly title="Click to select start date">
                                </div>
                                <span class="date-input-separator">→</span>
                                <div class="date-input-group">
                                    <label for="endDateInput" class="date-input-label">End Date</label>
                                    <input type="text" id="endDateInput" class="date-input" placeholder="Feb 03, 2026" readonly title="Click to select end date">
                                </div>
                            </div>
                            
                            <!-- Custom Calendar -->
                            <div class="calendar-header">
                                <div class="calendar-nav">
                                    <button class="calendar-nav-btn" id="calendarPrev" title="Previous month">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="15 18 9 12 15 6"/>
                                        </svg>
                                    </button>
                                    <span class="calendar-month" id="calendarMonth">February 2026</span>
                                    <button class="calendar-nav-btn" id="calendarNext" title="Next month">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="9 18 15 12 9 6"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="calendar-grid" id="calendarGrid">
                                <span class="calendar-day-header">S</span>
                                <span class="calendar-day-header">M</span>
                                <span class="calendar-day-header">T</span>
                                <span class="calendar-day-header">W</span>
                                <span class="calendar-day-header">T</span>
                                <span class="calendar-day-header">F</span>
                                <span class="calendar-day-header">S</span>
                            </div>
                            
                            <!-- Clear Selection Button -->
                            <button class="clear-dates-btn" id="clearDatesBtn" title="Clear date selection">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                Clear Dates
                            </button>
                        </div>
                    </aside>

                    <!-- Products Section -->
                    <section class="products-section">
                        <div class="products-header">
                            <h2 class="products-title">
                                Browsing Machines
                                <span class="products-count">(6 models found)</span>
                            </h2>
                            <div class="products-sort">
                                <span class="sort-label">Sort by:</span>
                                <select class="sort-select" id="sortSelect" title="Sort products by criteria">
                                    <option value="popular">Most Popular</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>
                        </div>

                        <div class="products-grid">
                        <?php while($row = mysqli_fetch_assoc($result)) { ?>
    <article class="product-card"
        data-id="<?php echo $row['item_id']; ?>"
        data-category="<?php echo htmlspecialchars($row['category']); ?>"
        data-price="<?php echo $row['price_per_day']; ?>">
                    
        <?php 
            $sampleImages = [
                '../../assets/images/Karaoke-King.png',
                '../../assets/images/EchoStream.png',
                '../../assets/images/VStar.jpg'
            ];
            $imageFile = !empty($row['image'])
                ? '../../assets/images/' . htmlspecialchars($row['image'])
                : $sampleImages[$row['item_id'] % count($sampleImages)];
        ?>
        <div class="product-image-wrap">
              <img src="<?php echo $imageFile; ?>"
                  alt="<?php echo htmlspecialchars($row['item_name']); ?>"
                  class="product-image"
                  title="Open image in new tab"
                  onerror="this.onerror=null;this.src='../../assets/images/catalog-fallback.svg';">
            
         
        </div>

        <div class="product-content">
            <h3 class="product-name"><?php echo htmlspecialchars($row['item_name']); ?></h3>
            
            <div class="product-rating">
                <span class="rating-score">0.0</span>
                <span class="rating-count">(0 reviews)</span>
            </div>

            <div class="product-price">₱<?php echo number_format($row['price_per_day'], 2); ?> <span>/ day</span></div>
            
            <p class="product-description">
                <?php 
                    if (empty($row['description']) || $row['description'] == "NULL") {
                        echo "No description available for this item.";
                    } else {
                        echo htmlspecialchars($row['description']);
                    }
                ?>
            </p>
            
            <div class="product-actions">
                <button class="product-cta-main"
                        title="Add this item to your cart"
                        onclick="location.href='../cart/add_to_cart.php?id=<?php echo $row['item_id']; ?>'">
                    Rent Now
                </button>
            </div>
        </div>
        
    </article>
    <?php } ?>
</div>



                        <!-- Pagination -->
                        <nav class="pagination" aria-label="Catalog pagination">
                            <button class="page-btn" data-page="prev" aria-label="Previous page">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 18 9 12 15 6"/>
                                </svg>
                            </button>
                            <button class="page-btn active" data-page="1">1</button>
                            <button class="page-btn" data-page="2">2</button>
                            <button class="page-btn" data-page="3">3</button>
                            <span class="page-ellipsis">...</span>
                            <button class="page-btn" data-page="8">8</button>
                            <button class="page-btn" data-page="next" aria-label="Next page">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </button>
                        </nav>
                    </section>
                </div>
            </div>
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Product Details Modal -->
    <div class="modal-overlay" id="productModal">
        <div class="modal-container product-modal">
            <button class="modal-close" id="closeProductModal" aria-label="Close modal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>

            <div class="modal-body product-modal-body">
                <!-- Product Image Section -->
                <div class="modal-product-image-section">
                    <img src="" alt="" class="modal-product-image" id="modalProductImage" onerror="this.onerror=null;this.src='../../assets/images/catalog-fallback.svg';">
                    <span class="modal-product-badge" id="modalProductBadge">Available</span>
                </div>

                <!-- Product Info Section -->
                <div class="modal-product-info">
                    <div class="modal-product-header">
                        <h2 class="modal-product-name" id="modalProductName">Product Name</h2>
                        <div class="modal-product-price" id="modalProductPrice">₱0 <span>/ day</span></div>
                    </div>

                    <!-- Rating Summary -->
                    <div class="modal-rating-summary">
                        <div class="modal-rating-stars" id="modalRatingStars">
                            <!-- Stars injected by JS -->
                        </div>
                        <span class="modal-rating-score" id="modalRatingScore">0.0</span>
                        <span class="modal-rating-count" id="modalRatingCount" title="Total customer reviews">(0 reviews)</span>
                    </div>

                    <!-- Description -->
                    <p class="modal-product-description" id="modalProductDescription">
                        Product description goes here.
                    </p>

                    <!-- Tags -->
                    <div class="modal-product-tags" id="modalProductTags">
                        <!-- Tags injected by JS -->
                    </div>

                    <!-- Future Availability Summary -->
                    <div class="modal-availability-section" title="Upcoming bookings for this item">
                        <h4 class="modal-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Upcoming Schedule
                        </h4>
                        <div class="modal-availability-list" id="modalAvailabilityList">
                            <!-- Availability dates injected by JS -->
                            <p class="availability-empty">No upcoming bookings. Available anytime!</p>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="modal-reviews-section" id="modalReviewsSection">
                        <div class="modal-reviews-title">
                            <div class="modal-reviews-heading">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                <span>Customer Reviews</span>
                                <span class="modal-reviews-count" id="modalReviewsCount">(0)</span>
                            </div>
                            <button type="button" class="reviews-toggle" id="toggleReviewsBtn" aria-expanded="true" title="Show or hide customer reviews">Hide reviews</button>
                        </div>

                        <!-- Reviews List -->
                        <div class="modal-reviews-list" id="modalReviewsList">
                            <!-- Reviews injected by JS -->
                            <div class="review-empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                <p>No reviews yet. Be the first to share your experience!</p>
                            </div>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button class="btn-modal-favorite" id="modalFavoriteBtn" data-item-id="" title="Add or remove from your favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Add to Favorites
        </button>
        <button type="button" class="btn-modal-cart" id="modalCartBtn" title="Add this item to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Add to Cart
        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="../../shared/js/components.js"></script>
    <script src="catalog.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                Components.injectSidebar('sidebarContainer', 'catalog', 'client');
                Components.injectTopbar('topbarContainer', 'Catalog');
                Components.injectFooter('footerContainer');
                Components.initStaggerAnimation('.catalog-grid');
            });
        </script>
</body>
</html>

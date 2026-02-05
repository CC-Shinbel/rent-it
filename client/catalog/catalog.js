    document.addEventListener('DOMContentLoaded', () => {
        // Initialize sidebar, topbar, and footer
        if (typeof Components !== 'undefined') {
            Components.injectSidebar('sidebarContainer', 'catalog', 'client');
            Components.injectTopbar('topbarContainer', 'Browse Catalog');
            Components.injectFooter();
        }

    
        initCatalog();
    });
    function initCatalog() {
        initCatalogTabs();
        initCategoryFilters();
        initStatusFilters();
        initPriceSlider();
        initCalendar();
        initSearch();
        initSortSelect();
        initProductCards();
        initProductModal();
        initPagination();
        initCartFavoriteButtons();
    }


    function initCatalogTabs() {
        const tabs = document.querySelectorAll('.tab-link');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                
                const tabType = tab.dataset.tab;
                filterByTab(tabType);
            });
        });
    }

    function filterByTab(tabType) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (tabType === 'all') {
                product.style.display = '';
            } else if (tabType === 'promos') {
                const isPromo = product.dataset.promo === 'true';
                product.style.display = isPromo ? '' : 'none';
            }
        });
        
        updateProductCount();
    }


    function initCategoryFilters() {
        const checkboxes = document.querySelectorAll('.category-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                filterProducts();
            });
        });
        
        const resetBtn = document.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                checkboxes.forEach(cb => cb.checked = false);
                
                document.querySelectorAll('.status-checkbox').forEach(cb => {
                    cb.checked = false;
                });
                
                const priceSlider = document.getElementById('priceSlider');
                if (priceSlider) {
                    priceSlider.value = priceSlider.max;
                    updatePriceDisplay(priceSlider.value);
                }
                
                filterProducts();
            });
        }
    }

    function initStatusFilters() {
        const checkboxes = document.querySelectorAll('.status-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                filterProducts();
            });
        });
    }


    function initPriceSlider() {
        const slider = document.getElementById('priceSlider');
        const priceValue = document.getElementById('priceValue');
        
        if (slider) {
            slider.addEventListener('input', (e) => {
                updatePriceDisplay(e.target.value);
                filterProducts();
            });
        }
    }

    function updatePriceDisplay(value) {
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
            priceValue.textContent = `₱${parseInt(value).toLocaleString()}`;
        }
    }

    function filterProducts() {
        const products = document.querySelectorAll('.product-card');
        const activeCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
            .map(cb => cb.value);
        const activeStatuses = Array.from(document.querySelectorAll('.status-checkbox:checked'))
            .map(cb => cb.value);
        const maxPrice = parseInt(document.getElementById('priceSlider')?.value || 9999);
        const searchQuery = document.getElementById('catalogSearch')?.value.toLowerCase() || '';
        
        products.forEach(product => {
            const category = product.dataset.category;
            const price = parseInt(product.dataset.price);
            const name = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
            
        
            const badge = product.querySelector('.product-badge');
            let status = 'available';
            if (badge) {
                if (badge.classList.contains('booked') || badge.textContent.toLowerCase().includes('booked')) {
                    status = 'booked';
                } else if (badge.classList.contains('maintenance') || badge.textContent.toLowerCase().includes('maintenance')) {
                    status = 'maintenance';
                }
            }
            
            let show = true;
            

            if (activeCategories.length > 0 && !activeCategories.includes(category)) {
                show = false;
            }
            
    
            if (activeStatuses.length > 0 && !activeStatuses.includes(status)) {
                show = false;
            }
            
            // Price filter
            if (price > maxPrice) {
                show = false;
            }
            
            // Search filter
            if (searchQuery && !name.includes(searchQuery) && !description.includes(searchQuery)) {
                show = false;
            }
            
            product.style.display = show ? '' : 'none';
        });
        
        updateProductCount();
    }

    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])').length;
        const countEl = document.querySelector('.products-count');
        if (countEl) {
            countEl.textContent = `(${visibleProducts} models found)`;
        }
    }


    function initCalendar() {
        const prevBtn = document.getElementById('calendarPrev');
        const nextBtn = document.getElementById('calendarNext');
        const monthDisplay = document.getElementById('calendarMonth');
        const calendarGrid = document.getElementById('calendarGrid');
        const startDateInput = document.getElementById('startDateInput');
        const endDateInput = document.getElementById('endDateInput');
        const clearDatesBtn = document.getElementById('clearDatesBtn');
        
        if (!calendarGrid) return;
        
        let currentDate = new Date();
        let startDate = null;
        let endDate = null;
        let selectingStart = true; // Toggle between selecting start and end
        
        // Month names for formatting
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Format date for display
    function formatDate(date) {
        if (!date) return '';
        return `${shortMonthNames[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    }
    
    // Update text inputs
    function updateInputs() {
        if (startDateInput) {
            startDateInput.value = formatDate(startDate);
            startDateInput.classList.toggle('active', selectingStart && !startDate);
        }
        if (endDateInput) {
            endDateInput.value = formatDate(endDate);
            endDateInput.classList.toggle('active', !selectingStart && startDate && !endDate);
        }
    }
    
    // Check if date is in range
    function isInRange(date) {
        if (!startDate || !endDate) return false;
        return date > startDate && date < endDate;
    }
    
    // Check if date is booked (mock data)
    function getBookedDates() {
        // Mock booked dates - in real app, this would come from API
        return [
            { start: new Date(2026, 1, 10), end: new Date(2026, 1, 12) },
            { start: new Date(2026, 1, 20), end: new Date(2026, 1, 22) },
            { start: new Date(2026, 2, 5), end: new Date(2026, 2, 7) }
        ];
    }
    
    function isDateBooked(date) {
        const bookedRanges = getBookedDates();
        return bookedRanges.some(range => date >= range.start && date <= range.end);
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        if (monthDisplay) {
            monthDisplay.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear grid (keep day headers)
        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header.cloneNode(true)));
        
        // Add day headers if they don't exist
        if (calendarGrid.children.length === 0) {
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            days.forEach(day => {
                const header = document.createElement('span');
                header.className = 'calendar-day-header';
                header.textContent = day;
                calendarGrid.appendChild(header);
            });
        }
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Add empty cells for days before the first
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('span');
            empty.className = 'calendar-day disabled';
            calendarGrid.appendChild(empty);
        }
        
        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('span');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            const cellDate = new Date(year, month, day);
            cellDate.setHours(0, 0, 0, 0);
            
            // Mark today
            if (cellDate.getTime() === today.getTime()) {
                dayEl.classList.add('today');
            }
            
            // Mark past dates as disabled
            if (cellDate < today) {
                dayEl.classList.add('disabled');
            } else {
                // All future dates are selectable - filter calendar is for user date selection only
                dayEl.addEventListener('click', () => handleDateClick(cellDate));
            }
            
            // Apply range styling
            if (startDate && cellDate.getTime() === startDate.getTime()) {
                dayEl.classList.add('range-start');
            }
            if (endDate && cellDate.getTime() === endDate.getTime()) {
                dayEl.classList.add('range-end');
            }
            if (isInRange(cellDate)) {
                dayEl.classList.add('in-range');
            }
            
            calendarGrid.appendChild(dayEl);
        }
        
        updateInputs();
    }
    
    function handleDateClick(date) {
        if (selectingStart || !startDate) {
            // Selecting start date
            startDate = date;
            endDate = null;
            selectingStart = false;
        } else {
            // Selecting end date
            if (date < startDate) {
                // If end date is before start, swap them
                endDate = startDate;
                startDate = date;
            } else {
                endDate = date;
            }
            selectingStart = true;
            
            // Check for conflicts in range
            checkRangeConflicts();
        }
        
        renderCalendar();
        filterProductsByDateRange();
    }
    
    function checkRangeConflicts() {
        if (!startDate || !endDate) return;
        
        const bookedRanges = getBookedDates();
        const hasConflict = bookedRanges.some(range => {
            return (startDate <= range.end && endDate >= range.start);
        });
        
        if (hasConflict) {
            // Show warning
            const warningEl = document.createElement('div');
            warningEl.className = 'date-conflict-warning';
            warningEl.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Selected range conflicts with existing bookings
            `;
            
            // Remove existing warning
            document.querySelector('.date-conflict-warning')?.remove();
            calendarGrid.parentElement.appendChild(warningEl);
            
            setTimeout(() => warningEl.remove(), 3000);
        }
    }
    
    function filterProductsByDateRange() {
        if (!startDate || !endDate) return;
        
        // Mark products with conflicts
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.id;
            const bookings = getProductBookings(productId);
            
            const hasConflict = bookings.some(booking => {
                const bookStart = new Date(booking.start);
                const bookEnd = new Date(booking.end);
                return (startDate <= bookEnd && endDate >= bookStart);
            });
            
            card.classList.toggle('date-conflict', hasConflict);
        });
    }
    
    function clearDates() {
        startDate = null;
        endDate = null;
        selectingStart = true;
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('date-conflict');
        });
        document.querySelector('.date-conflict-warning')?.remove();
        renderCalendar();
    }
    
    // Input click handlers
    startDateInput?.addEventListener('click', () => {
        selectingStart = true;
        updateInputs();
    });
    
    endDateInput?.addEventListener('click', () => {
        if (startDate) {
            selectingStart = false;
            updateInputs();
        }
    });
    
    // Clear button
    clearDatesBtn?.addEventListener('click', clearDates);
    
    // Navigation
    prevBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Initial render
    renderCalendar();
}

/**
 * Search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('catalogSearch');
    
    if (searchInput) {
        // Debounce search
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterProducts();
            }, 300);
        });
    }
}
function initSortSelect() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts(sortSelect.value);
        });
    }
}

function sortProducts(sortBy) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    
    const products = Array.from(grid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'name':
                return a.querySelector('.product-name').textContent
                    .localeCompare(b.querySelector('.product-name').textContent);
            case 'popular':
            default:
                return parseInt(b.dataset.popularity || 0) - parseInt(a.dataset.popularity || 0);
        }
    });
    
    // Re-append in sorted order
    products.forEach(product => grid.appendChild(product));
}

function initProductCards() {
    const ctaButtons = document.querySelectorAll('.product-cta');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('.product-name')?.textContent;
            const isNotify = btn.classList.contains('notify');
            
            if (isNotify) {
                // Handle notify when ready
                alert(`You'll be notified when "${productName}" becomes available!`);
            } else {
                // Handle rent now - redirect to booking
                const productId = card.dataset.id;
                window.location.href = `/client/booking/new.html?product=${productId}`;
            }
        });
    });

    // Initialize review buttons
    initReviewButtons();
    
    // Initialize availability popovers
    initAvailabilityPopovers();
    
    // Initialize mock rental history for testing
    if (typeof Components !== 'undefined') {
        Components.initMockRentalHistory();
    }
}

function initAvailabilityPopovers() {
    const availabilityBtns = document.querySelectorAll('.btn-availability');
    
    availabilityBtns.forEach(btn => {
        // Click to toggle and stay open
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAvailabilityPopover(e.target.closest('.btn-availability'));
        });
    });
    
    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-availability') && !e.target.closest('.availability-popover')) {
            document.querySelectorAll('.availability-popover.visible').forEach(p => {
                p.classList.remove('visible');
            });
            document.querySelectorAll('.btn-availability.active').forEach(b => {
                b.classList.remove('active');
            });
        }
    });
}

function getProductBookings(productId) {
    // Mock data - in production, this would come from an API
    const mockBookings = {
        '1': [
            { start: 'Feb 10, 2026', end: 'Feb 12, 2026' },
            { start: 'Feb 25, 2026', end: 'Feb 27, 2026' }
        ],
        '2': [
            { start: 'Feb 01, 2026', end: 'Feb 03, 2026' },
            { start: 'Feb 15, 2026', end: 'Feb 18, 2026' },
            { start: 'Mar 05, 2026', end: 'Mar 07, 2026' }
        ],
        '3': [
            { start: 'Feb 20, 2026', end: 'Feb 22, 2026' }
        ],
        '4': [],
        '5': [
            { start: 'Feb 08, 2026', end: 'Feb 10, 2026' }
        ],
        '6': [
            { start: 'Feb 01, 2026', end: 'Feb 05, 2026' },
            { start: 'Feb 14, 2026', end: 'Feb 16, 2026' }
        ]
    };
    
    return mockBookings[productId] || [];
}

/**
 * Show availability popover
 */
function showAvailabilityPopover(btn) {
    const card = btn.closest('.product-card');
    const productId = card.dataset.id;
    const popover = card.querySelector('.availability-popover');
    
    if (!popover) return;
    
    const bookings = getProductBookings(productId);
    const list = popover.querySelector('.availability-list');
    const maxVisibleBookings = 8; // Show max 8 bookings before "See More"
    
    if (bookings.length === 0) {
        list.innerHTML = '<li class="availability-empty">No upcoming bookings</li>';
        // Remove any existing "See More" link
        const existingSeeMore = popover.querySelector('.availability-see-more');
        if (existingSeeMore) existingSeeMore.remove();
    } else {
        // Show only first N bookings if there are too many
        const visibleBookings = bookings.slice(0, maxVisibleBookings);
        const hasMore = bookings.length > maxVisibleBookings;
        
        list.innerHTML = visibleBookings.map(booking => `
            <li class="availability-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                ${booking.start} - ${booking.end}
            </li>
        `).join('');
        
        // Remove existing "See More" link
        const existingSeeMore = popover.querySelector('.availability-see-more');
        if (existingSeeMore) existingSeeMore.remove();
        
        // Add "See More" link if there are more bookings
        if (hasMore) {
            const seeMoreLink = document.createElement('a');
            seeMoreLink.className = 'availability-see-more';
            seeMoreLink.textContent = `See all ${bookings.length} bookings...`;
            seeMoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Close popover and open product modal
                popover.classList.remove('visible');
                btn.classList.remove('active');
                openProductModal(card);
            });
            popover.appendChild(seeMoreLink);
        }
    }
    
    popover.classList.add('visible');
}

function hideAvailabilityPopover(btn) {
    const card = btn.closest('.product-card');
    const popover = card.querySelector('.availability-popover');
    
    if (popover) {
        popover.classList.remove('visible');
    }
}

function toggleAvailabilityPopover(btn) {
    const card = btn.closest('.product-card');
    const popover = card.querySelector('.availability-popover');
    
    if (popover) {
        // Close other popovers and deactivate other buttons first
        document.querySelectorAll('.availability-popover.visible').forEach(p => {
            if (p !== popover) p.classList.remove('visible');
        });
        document.querySelectorAll('.btn-availability.active').forEach(b => {
            if (b !== btn) b.classList.remove('active');
        });
        
        if (popover.classList.contains('visible')) {
            popover.classList.remove('visible');
            btn.classList.remove('active');
        } else {
            showAvailabilityPopover(btn);
            btn.classList.add('active');
        }
    }
}

function initReviewButtons() {
    document.querySelectorAll('.btn-write-review').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = e.target.closest('.product-card');
            if (!card) return;
            
            const productId = card.dataset.id;
            const productName = card.querySelector('.product-name')?.textContent || 'Product';
            const productImage = card.querySelector('.product-image img')?.src || '';
            const productCategory = card.querySelector('.badge')?.textContent || 'Equipment';
            
            // Open review modal
            if (typeof Components !== 'undefined') {
                Components.openReviewModal({
                    id: productId,
                    name: productName,
                    image: productImage,
                    category: productCategory
                });
            }
        });
    });
}

function initPagination() {
    const pageButtons = document.querySelectorAll('.page-btn:not(:disabled)');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            
            if (page === 'prev') {
                // Go to previous page
                const currentActive = document.querySelector('.page-btn.active');
                const currentPage = parseInt(currentActive?.dataset.page || 1);
                if (currentPage > 1) {
                    goToPage(currentPage - 1);
                }
            } else if (page === 'next') {
                // Go to next page
                const currentActive = document.querySelector('.page-btn.active');
                const currentPage = parseInt(currentActive?.dataset.page || 1);
                const totalPages = document.querySelectorAll('.page-btn[data-page]:not([data-page="prev"]):not([data-page="next"])').length;
                if (currentPage < totalPages) {
                    goToPage(currentPage + 1);
                }
            } else {
                goToPage(parseInt(page));
            }
        });
    });
}

function goToPage(pageNum) {
    // Update active state
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.page) === pageNum);
    });
    
    // In a real app, this would fetch products for that page
    // For now, just scroll to top of products
    document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
}

function initProductModal() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('closeProductModal');
    const toggleReviewsBtn = document.getElementById('toggleReviewsBtn');
    const reviewsSection = document.getElementById('modalReviewsSection');
    
    if (!modal) return;
    
    // Close modal handlers
    closeBtn?.addEventListener('click', closeProductModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProductModal();
        }
    });

    if (toggleReviewsBtn && reviewsSection) {
        toggleReviewsBtn.addEventListener('click', () => {
            const collapsed = reviewsSection.classList.toggle('collapsed');
            toggleReviewsBtn.textContent = collapsed ? 'Show reviews' : 'Hide reviews';
            toggleReviewsBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        });
    }
    
    // Add click handlers to product cards (make whole card clickable)
    document.querySelectorAll('.product-card').forEach(card => {
        // Make the card clickable for viewing details
        card.style.cursor = 'pointer';
        const cardImg = card.querySelector('.product-image img');
        if (cardImg) {
            cardImg.style.cursor = 'zoom-in';
            cardImg.title = 'Open image in new tab';
            cardImg.addEventListener('click', (e) => {
                e.stopPropagation();
                if (cardImg.src) window.open(cardImg.src, '_blank');
            });
        }
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on action buttons
            if (e.target.closest('.product-actions') || e.target.closest('button')) {
                return;
            }
            openProductModal(card);
        });
    });
    
    // Modal action buttons
    const favoriteBtn = document.getElementById('modalFavoriteBtn');
    const cartBtn = document.getElementById('modalCartBtn');
    
    favoriteBtn?.addEventListener('click', () => {
        favoriteBtn.classList.toggle('active');
        const isActive = favoriteBtn.classList.contains('active');
        favoriteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="${isActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            ${isActive ? 'In Favorites' : 'Add to Favorites'}
        `;
    });
    
    cartBtn?.addEventListener('click', () => {
        cartBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Added to Cart
        `;
        setTimeout(() => {
            cartBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
            `;
        }, 2000);
    });
}


function openProductModal(card) {
    
    const modal = document.getElementById('productModal');
    if (!modal || !card) return;

    // ✅ TAMANG KUHA NG PRODUCT ID (GALING SA DATA-ID)
    const productId = card.dataset.id;
    if (!productId) {
        console.error("Missing product ID on card!");
        return;
    }

    // ✅ PRODUCT DETAILS
    const productName = card.querySelector('.product-name')?.textContent || 'Product';
    const fallbackImages = [
        '../../assets/images/catalog-set-1.svg',
        '../../assets/images/catalog-set-2.svg',
        '../../assets/images/catalog-set-3.svg'
    ];
    const productImageRaw = card.querySelector('.product-image img')?.src || '';
    const productImage = productImageRaw && !productImageRaw.includes('placeholder')
        ? productImageRaw
        : fallbackImages[productId % fallbackImages.length];
    const productPrice = card.querySelector('.product-price')?.innerHTML || '₱0';
    const productDescription = card.querySelector('.product-description')?.textContent || '';

    const modalImage = document.getElementById('modalProductImage');
    if (modalImage) {
        modalImage.src = productImage;
        modalImage.alt = productName;
        modalImage.title = 'Open image in new tab';
        modalImage.style.cursor = 'zoom-in';
        modalImage.onclick = (e) => {
            e.preventDefault();
            window.open(modalImage.src, '_blank');
        };
    }
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').innerHTML = productPrice;
    document.getElementById('modalProductDescription').textContent = productDescription;

 
    // ============================
    // ✅ ADD TO CART BUTTON (FIXED)
    // ============================
    const cartBtn = document.getElementById('modalCartBtn');
    const newCartBtn = cartBtn.cloneNode(true);
    cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);

    newCartBtn.addEventListener('click', () => {
        addToCart(productId);

        newCartBtn.innerHTML = 'Added to Cart';

        if (typeof showToast === 'function') {
            showToast(`${productName} added to cart`, 'success');
        }

        setTimeout(() => {
            newCartBtn.innerHTML = 'Add to Cart';
        }, 2000);
    });

    // ============================
    // ✅ FAVORITE BUTTON (REAL FIX)
    // ============================
    const favBtn = document.getElementById('modalFavoriteBtn');
    const newFavBtn = favBtn.cloneNode(true);
    favBtn.parentNode.replaceChild(newFavBtn, favBtn);

    newFavBtn.classList.remove('active');

    newFavBtn.addEventListener('click', () => {
        const isActive = newFavBtn.classList.toggle('active');

        fetch('../catalog/add_favorite.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `item_id=${productId}&action=${isActive ? 'add' : 'remove'}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (typeof showToast === 'function') {
                    showToast(
                        isActive
                            ? `${productName} added to favorites`
                            : `${productName} removed from favorites`,
                        'success'
                    );
                }
            } else {
                newFavBtn.classList.toggle('active');
                alert(data.message);
            }
        })
        .catch(err => console.error('Favorite error:', err));
    });

    // ============================
    // RENDER REVIEWS & STARS
    // ============================
    if (typeof renderStars === 'function') renderStars(card);
    if (typeof renderReviewsAndBookings === 'function') renderReviewsAndBookings(productId);

    // Reset reviews toggle to expanded each open
    const reviewsSection = document.getElementById('modalReviewsSection');
    const toggleReviewsBtn = document.getElementById('toggleReviewsBtn');
    if (reviewsSection && toggleReviewsBtn) {
        reviewsSection.classList.remove('collapsed');
        toggleReviewsBtn.textContent = 'Hide reviews';
        toggleReviewsBtn.setAttribute('aria-expanded', 'true');
    }

    // ============================
    // OPEN MODAL
    // ============================
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


function renderStars(card) {
    const filledStars = card.querySelectorAll('.rating-stars .filled').length;
    const starsContainer = document.getElementById('modalRatingStars');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsContainer.innerHTML += `
                <svg viewBox="0 0 24 24" class="${i <= filledStars ? 'filled' : 'empty'}">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            `;
        }
    }
}
function renderReviewsAndBookings(productId) {
    const availabilityList = document.getElementById('modalAvailabilityList');
    const reviewsList = document.getElementById('modalReviewsList');
    
    const bookings = typeof getProductBookings === 'function' ? getProductBookings(productId) : [];
    const reviews = typeof getProductReviews === 'function' ? getProductReviews(productId) : [];

    if (availabilityList) {
        availabilityList.innerHTML = bookings.length > 0 
            ? bookings.map(b => `<div class="availability-item"><span>${b.start} - ${b.end}</span> <span class="status-booked">Booked</span></div>`).join('')
            : '<p class="availability-empty">Available anytime!</p>';
    }

    if (reviewsList) {
        reviewsList.innerHTML = reviews.length > 0
            ? reviews.map(r => `<div class="review-item"><strong>${r.author}</strong>: ${r.text}</div>`).join('')
            : '<p>No reviews yet.</p>';
    }
}
    
    
    
    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductImage').alt = productName;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').innerHTML = productPrice;
    document.getElementById('modalProductDescription').textContent = productDescription;
    
    const modalBadge = document.getElementById('modalProductBadge');
    modalBadge.textContent = badgeText;
    modalBadge.className = 'modal-product-badge ' + badgeClass;
    
    document.getElementById('modalRatingScore').textContent = ratingScore;
    document.getElementById('modalRatingCount').textContent = ratingCount;
    
    const starsContainer = document.getElementById('modalRatingStars');
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= filledStars ? 'filled' : 'empty';
        starsContainer.innerHTML += `
            <svg viewBox="0 0 24 24" class="${starClass}">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }
    
    const tagsContainer = document.getElementById('modalProductTags');
    tagsContainer.innerHTML = tags.map(tag => `<span class="product-tag">${tag}</span>`).join('');
    
    const availabilityList = document.getElementById('modalAvailabilityList');
    const mockBookings = typeof getProductBookings === 'function' ? getProductBookings(productId) : [];
    
    if (mockBookings.length > 0) {
        availabilityList.innerHTML = mockBookings.map(booking => `
            <div class="availability-item">
                <span class="availability-dates">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    ${booking.start} → ${booking.end}
                </span>
                <span class="availability-status">Booked</span>
            </div>
        `).join('');
    } else {
        availabilityList.innerHTML = '<p class="availability-empty">No upcoming bookings. Available anytime!</p>';
    }
    
    const reviewsList = document.getElementById('modalReviewsList');
    const mockReviews = typeof getProductReviews === 'function' ? getProductReviews(productId) : [];
    const reviewsCount = document.getElementById('modalReviewsCount');
    if (reviewsCount) reviewsCount.textContent = `(${mockReviews.length})`;
    
    if (mockReviews.length > 0) {
        reviewsList.innerHTML = mockReviews.map(review => `
            <div class="review-item">
                <div class="review-avatar">${review.author.charAt(0).toUpperCase()}</div>
                <div class="review-content">
                    <div class="review-header">
                        <span class="review-author">${review.author}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-stars">
                        ${Array(5).fill(0).map((_, i) => 
                            `<svg viewBox="0 0 24 24" class="${i < review.rating ? 'filled' : 'empty'}">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>`
                        ).join('')}
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            </div>
        `).join('');
    } else {
        reviewsList.innerHTML = `
            <div class="review-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}


function addToCart(itemId) {
    const formData = new FormData();
    formData.append('item_id', itemId);


    
    fetch('../cart/add_to_cart.php', { // I-verify ang folder nito!
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "Success") {
            // Huwag na tayong mag-alert, toast lang sapat na
            console.log("Success adding to cart");
        } else {
            alert("Server Error: " + data);
        }
    })
    .catch(err => {
        console.error("Fetch Error:", err);
    });
}

/**
 * Get mock bookings for a product
 */
function getProductBookings(productId) {
    // Mock booking data - in real app, this would come from an API
    const bookings = {
        '1': [
            { start: 'Feb 15, 2026', end: 'Feb 17, 2026' },
            { start: 'Mar 5, 2026', end: 'Mar 7, 2026' }
        ],
        '2': [],
        '3': [
            { start: 'Feb 20, 2026', end: 'Feb 22, 2026' }
        ],
        '4': [],
        '5': [],
        '6': [
            { start: 'Feb 12, 2026', end: 'Feb 12, 2026' }
        ]
    };
    return bookings[productId] || [];
}

function getProductReviews(productId) {
    // Mock review data - in real app, this would come from an API
    const reviews = {
        '1': [
            { author: 'Maria Santos', rating: 5, date: 'Jan 28, 2026', text: 'Amazing sound quality! The dual-mic setup was perfect for our family reunion. Highly recommend!' },
            { author: 'Juan Dela Cruz', rating: 4, date: 'Jan 20, 2026', text: 'Great machine, lots of songs. Only wish it had more OPM classics.' },
            { author: 'Anna Reyes', rating: 5, date: 'Jan 15, 2026', text: 'Professional quality! Made our birthday party unforgettable.' }
        ],
        '2': [
            { author: 'Pedro Garcia', rating: 5, date: 'Jan 25, 2026', text: 'Perfect for small gatherings. Easy to carry and set up!' }
        ],
        '3': [
            { author: 'Rosa Mendoza', rating: 4, date: 'Jan 22, 2026', text: 'Good value for money. Kids loved it!' }
        ],
        '4': [],
        '5': [
            { author: 'Carlos Tan', rating: 5, date: 'Jan 18, 2026', text: 'Concert-level sound! Worth every peso.' },
            { author: 'Liza Aquino', rating: 5, date: 'Jan 10, 2026', text: 'Used for our wedding reception. Absolutely perfect!' }
        ],
        '6': [
            { author: 'Miguel Santos', rating: 4, date: 'Jan 5, 2026', text: 'Industrial quality, great for large venues.' }
        ]
    };
    return reviews[productId] || [];
}
function initCartFavoriteButtons() {
    // 1. Para sa buttons na nasa mismong Catalog Cards
    document.querySelectorAll('.product-card .btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // ... (keep your existing toast logic here)
        });
    });

    // 2. PARA SA MODAL FAVORITE BUTTON (Dito tayo focus)
    const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
    if (modalFavoriteBtn) {
        // Clone para i-reset ang listeners at iwas double-click bug
        const newBtn = modalFavoriteBtn.cloneNode(true);
        modalFavoriteBtn.parentNode.replaceChild(newBtn, modalFavoriteBtn);
        
        newBtn.addEventListener('click', () => {
            const itemId = newBtn.getAttribute('data-item-id'); 
            const isActive = newBtn.classList.toggle('active');
            const productName = document.getElementById('modalProductName')?.textContent || 'Item';
            
            if (!itemId) {
                console.error("Missing Item ID!");
                return;
            }
            fetch('/rent-it/client/catalog/add_favorite.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'item_id=' + productId
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast('Added to favorites!', 'success');
                } else {
                    showToast(data.message, 'error');
                }
            })
            .catch(err => console.error('Favorite error:', err));
            
            
            newBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="${isActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                ${isActive ? 'In Favorites' : 'Add to Favorites'}
            `;
        });
    }
 const modalCartBtn = document.getElementById('modalCartBtn');
 if (modalCartBtn) {
     const newBtn = modalCartBtn.cloneNode(true);
     modalCartBtn.parentNode.replaceChild(newBtn, modalCartBtn);
     
     newBtn.addEventListener('click', (e) => {
         e.preventDefault();
         
         if (productId) {
             addToCart(productId);

             const pName = document.getElementById('modalProductName')?.textContent || 'Item';
             
             newBtn.innerHTML = `
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                     <polyline points="20 6 9 17 4 12"/>
                 </svg>
                 Added to Cart
             `;
             
             if (typeof showToast === 'function') {
                 showToast(`${pName} added to cart`, 'success');
             }
             
             setTimeout(() => {
                 newBtn.innerHTML = `
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                         <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                         <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                     </svg>
                     Add to Cart
                 `;
             }, 2000);
         } else {
             console.error("Product ID not found!");
         }
     });
     // ================= TOAST SYSTEM =================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 14px 24px;
        background: ${type === 'success' ? '#10B981' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        opacity: 1;
        transition: opacity .3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

 }
}

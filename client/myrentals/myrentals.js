/* =====================================================
   MY RENTALS PAGE JAVASCRIPT - Full Optimized Version
   RentIt - Client Portal
   ===================================================== */

   document.addEventListener('DOMContentLoaded', function() {
    // Injects sidebar, topbar, and footer gamit ang Components helper
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'myrentals', 'client');
        Components.injectTopbar('topbarContainer', 'My Rentals');
        Components.injectFooter('footerContainer');
    }

    loadMyRentals();
});

let currentDailyRate = 0; 


async function loadMyRentals() {
    try {
        const res = await fetch('get_myrentals.php');
        const data = await res.json();

        if (!data.success) {
            console.error('Error fetching rentals:', data.message);
            const container = document.getElementById('activeRentalsCards');
            if(container) container.innerHTML = `<p class="error-msg">Failed to load rentals.</p>`;
            return;
        }

        renderActiveRentals(data.active);
        renderBookingHistory(data.history);
    } catch (err) {
        console.error('Failed to load rentals:', err);
    }
}


function renderActiveRentals(rentals) {
    const container = document.getElementById('activeRentalsCards');
    const badge = document.getElementById('unitsBadge');
    if (!container) return;

    if (rentals.length === 0) {
        container.innerHTML = `
            <div class="empty-state empty-state-card">
                <div class="empty-state-icon">🎤</div>
                <h3 class="empty-state-title">No active rentals yet</h3>
                <p class="empty-state-text">Browse the catalog to book your first videoke set.</p>
                <a href="../catalog/catalog.php" class="empty-state-link">Browse Catalog</a>
            </div>
        `;
        badge.textContent = "0 Units Active";
        return;
    }

    container.innerHTML = '';
    badge.textContent = `${rentals.length} Unit${rentals.length !== 1 ? 's' : ''} Active`;

    rentals.forEach(r => {
        const statusClass = r.days_left <= 1 ? 'status-expiring' : 'status-rented';
        const daysClass = r.days_left <= 1 ? 'days-danger' : '';
        const cardExpiring = r.days_left <= 1 ? 'card-expiring' : '';
        const imageSrc = r.image
            ? `/rent-it/assets/images/${r.image}`
            : '/rent-it/assets/images/catalog-fallback.svg';
        
        const orderId = r.order_id;
        const rate = parseFloat(r.daily_rate) || 0;

        container.innerHTML += `
        <article class="rental-card ${cardExpiring}">
            <div class="card-top">
                <div class="card-info">
                    <div class="badges-row">
                        <span class="badge ${statusClass}">
                            ${r.days_left <= 1 ? 'Expiring Soon' : 'Rented'}
                        </span>
                        <span class="rental-id">#${r.rental_code}</span>
                    </div>
                    <h3 class="card-title">${r.name}</h3>
                    <div class="card-meta">Delivery: ${formatDate(r.start_date)}</div>
                    <div style="color: #e11d48; font-weight: 600;"><i class="fas fa-calendar-check"></i> End: ${formatDate(r.end_date)}</div>
                </div>

                <div class="days-badge ${daysClass}">
                    <div class="days-value" style="color: white !important;">${r.days_left}</div>
                    <div class="days-label" style="color: white !important;">Day${r.days_left !== 1 ? 's' : ''}</div>
                </div>
            </div>
            <div class="card-image">
                <a class="card-image-link" href="${imageSrc}" target="_blank" rel="noopener" title="Open image in new tab">
                    <img src="${imageSrc}" 
                         alt="${r.name}" 
                         onerror="this.onerror=null; this.src='/rent-it/assets/images/catalog-fallback.svg';">
                </a>
            </div>
            <div class="card-actions">
                <button class="btn-extend" onclick="handleExtend('${orderId}', ${rate})">Extend</button>
                <button class="btn-return" onclick="handleReturn('${orderId}')">Return</button>
            </div>
        </article>
        `;
    });
}


function handleExtend(orderId, dailyRate) {
    currentDailyRate = parseFloat(dailyRate) || 0;
    
    const modal = document.getElementById('extensionModal');
    const inputId = document.getElementById('extension_order_id');
    const rateDisplay = document.getElementById('rate_per_day_display');
    const selectDays = document.getElementById('extension_days');

    if (modal && inputId) {
        inputId.value = orderId;
        
        if (rateDisplay) {
            rateDisplay.textContent = `₱${currentDailyRate.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }
        
        if (selectDays) selectDays.value = "1";
        updateExtensionPrice(1);
        
        modal.style.display = 'flex';
    }
}


function handleReturn(orderId) {
    const modal = document.getElementById('returnModal');
    const inputId = document.getElementById('return_order_id');
    
    if (modal && inputId) {
        inputId.value = orderId;
        modal.style.display = 'flex';
    }
}


function updateExtensionPrice(days) {
    const numDays = parseInt(days) || 1;
    const total = currentDailyRate * numDays;
    
    const priceDisplay = document.getElementById('ext_price_display');
    if (priceDisplay) {
        priceDisplay.textContent = `₱${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    }
}


function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}


window.onclick = function(event) {
    const modals = ['returnModal', 'extensionModal', 'receiptModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}


function renderBookingHistory(history) {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (history.length === 0) {
        tbody.innerHTML = `
            <tr class="history-empty">
                <td colspan="4">
                    <div class="empty-state">
                        <div class="empty-state-icon">🗂️</div>
                        <h3 class="empty-state-title">No bookings yet</h3>
                        <p class="empty-state-text">Your completed rentals will show up here.</p>
                        <a href="../catalog/catalog.php" class="empty-state-link">Browse Catalog</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    history.forEach(h => {
        const itemName = h.name ? h.name : "Multiple Items";
        const rentalData = JSON.stringify(h).replace(/'/g, "&apos;").replace(/"/g, '&quot;');
        
        tbody.innerHTML += `
        <tr>
            <td>
                <div class="history-item">
                    <div class="history-thumb">🎤</div>
                    <div class="history-info">
                        <div class="history-name">${itemName}</div>
                        <div class="history-id">#${h.rental_code}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="period-dates">${formatDate(h.start_date)} - ${formatDate(h.end_date)}</div>
                <div class="period-status ${h.rental_status === 'Active' ? 'status-active' : 'status-inactive'}">${capitalize(h.rental_status)}</div>
            </td>
            <td class="amount-cell">₱${parseFloat(h.total_amount).toFixed(2)}</td>
            <td>
                <button class="action-btn receipt-btn" 
                        onclick='showReceipt(${rentalData})'>
                    Receipt
                </button>
            </td>
        </tr>
        `;
    });
}


function showReceipt(data) {
    const modal = document.getElementById('receiptModal');
    const receiptDetails = document.getElementById('receiptDetails');
    if (!modal || !receiptDetails) return;

    receiptDetails.innerHTML = `
        <div id="receipt-canvas" style="padding: 10px; font-family: 'Inter', sans-serif;">
            <div style="text-align:center; border-bottom:2px dashed #e2e8f0; padding-bottom:15px; margin-bottom:20px;">
                <h2 style="margin:0; color:#f97316;">RentIt</h2>
                <p style="font-size:12px; color:#64748b; margin:5px 0 0 0;">OFFICIAL RENTAL RECEIPT</p>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:#64748b;">Order Ref:</span>
                <span style="font-weight:600;">#${data.rental_code}</span>
            </div>

            <div style="margin-bottom:10px;">
                <span style="color:#64748b; display:block;">Item:</span>
                <span style="font-weight:600; display:block;">${data.name || 'Rental Unit'}</span>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:#64748b;">Period:</span>
                <span style="font-size: 13px;">${formatDate(data.start_date)} - ${formatDate(data.end_date)}</span>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-top:10px; border-top:1px solid #eee;">
                <span style="font-weight:700;">Total Paid:</span>
                <span style="font-weight:800; color:#f97316;">₱${parseFloat(data.total_amount).toFixed(2)}</span>
            </div>
            
            <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:20px;">Thank you for renting with RentIt!</p>
        </div>
    `;

    modal.style.display = 'block';
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
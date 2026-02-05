/* =====================================================
   MY RENTALS PAGE JAVASCRIPT - Full Updated Version
   RentIt - Client Portal
   ===================================================== */

   document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'myrentals', 'client');
        Components.injectTopbar('topbarContainer', 'My Rentals');
        Components.injectFooter('footerContainer');
    }

 
    loadMyRentals();
});


async function loadMyRentals() {
    try {
        const res = await fetch('get_myrentals.php');
        const data = await res.json();

        if (!data.success) {
            console.error('Error fetching rentals:', data.message);
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

    container.innerHTML = '';
    badge.textContent = `${rentals.length} Unit${rentals.length !== 1 ? 's' : ''} Active`;

    rentals.forEach(r => {
        const statusClass = r.days_left <= 1 ? 'status-expiring' : 'status-rented';
        const daysClass = r.days_left <= 1 ? 'days-danger' : '';
        const cardExpiring = r.days_left <= 1 ? 'card-expiring' : '';

     
        const orderId = r.order_id || r.rental_code;

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
                <img src="../../assets/images/${r.image}" alt="${r.name}" onerror="this.src='../../assets/images/default-item.png'">
            </div>
            <div class="card-actions">
                <button class="btn-extend" onclick="handleExtend('${orderId}')">Extend</button>
                <button class="btn-return" onclick="handleReturn('${orderId}')">Return</button>
            </div>
        </article>
        `;
    });
}


function handleExtend(orderId) {
    
    window.location.href = `../returns/returns.php?id=${orderId}&action=extend`;
}

function handleReturn(orderId) {
    if (confirm(`Are you sure you want to return Order #${orderId}?`)) {
        window.location.href = `../returns/returns.php?id=${orderId}&action=return`;
    }
}

/**
 * Render booking history table
 */
function renderBookingHistory(history) {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    history.forEach(h => {
        const itemName = h.name ? h.name : "Multiple Items/Order";
        const rentalData = JSON.stringify(h).replace(/"/g, '&quot;');
        
        tbody.innerHTML += `
        <tr>
            <td>
                <div class="history-item">
                    <div class="history-thumb">ðŸŽ¤</div>
                    <div class="history-info">
                        <div class="history-name" style="color: #1e293b; font-weight: 600;">${itemName}</div>
                        <div class="history-id" style="color: #64748b; font-size: 0.85rem;">#${h.rental_code}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="period-dates" style="color: #475569;">${formatDate(h.start_date)} - ${formatDate(h.end_date)}</div>
                <div class="period-status" style="font-weight: 500; color: ${h.status === 'Active' ? '#10b981' : '#64748b'};">
                    ${capitalize(h.status)}
                </div>
            </td>
            <td class="amount-cell" style="font-weight: 700; color: #1e293b;">â‚±${parseFloat(h.total_amount).toFixed(2)}</td>
            <td>
                <button class="action-btn receipt-btn" 
                        onclick='showReceipt(${rentalData})'
                        style="background: #f97316; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    Receipt
                </button>
            </td>
        </tr>
        `;
    });
}

/**
 * Receipt Modal Function
 */
function showReceipt(data) {
    let modal = document.getElementById('receiptModal');
    if (!modal) return;

    const receiptDetails = document.getElementById('receiptDetails');
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
                <span style="font-weight:600; display:block;">${data.name}</span>
            </div>

             <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:#64748b;">Period:</span>
                <span style="font-size: 13px;">${formatDate(data.start_date)} - ${formatDate(data.end_date)}</span>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-top:10px; border-top:1px solid #eee;">
                <span style="font-weight:700;">Total Paid:</span>
                <span style="font-weight:800; color:#f97316;">â‚±${parseFloat(data.total_amount).toFixed(2)}</span>
            </div>
            
            <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:20px;">Thank you for renting with RentIt!</p>
        </div>
    `;

    modal.style.display = 'block';

    // Close logic
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
}

/**
 * Utility Functions
 */
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * =====================================================
 * DISPATCH PAGE - JavaScript Module
 * Handles dispatch management - deliveries and pickups
 * =====================================================
 */

// Store dispatches data from API
let dispatchesData = [];

/**
 * Get initial for avatar
 */
function getInitial(name) {
    return name?.charAt(0)?.toUpperCase() || '?';
}

/**
 * Get status display text
 */
function getStatusText(status) {
    const statusMap = {
        'scheduled': 'Scheduled',
        'in_transit': 'In Transit',
        'completed': 'Completed',
        'pending': 'Pending'
    };
    return statusMap[status] || status;
}

/**
 * Render dispatch card
 */
function renderDispatchCard(dispatch) {
    const customerInitial = getInitial(dispatch.customer.name);
    const driverInitial = dispatch.driver ? getInitial(dispatch.driver.name) : null;
    const itemTags = dispatch.items.map(item => `<span class="dispatch-item-tag">${item}</span>`).join('');
    
    return `
        <div class="dispatch-card" data-dispatch-id="${dispatch.id}" data-type="${dispatch.type}" onclick="viewOrder('${dispatch.orderId}')">
            <div class="dispatch-card-header">
                <div class="dispatch-type ${dispatch.type}">
                    ${dispatch.type === 'delivery' ? `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"/>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/>
                            <circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                    ` : `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                    `}
                    ${dispatch.type.charAt(0).toUpperCase() + dispatch.type.slice(1)}
                </div>
                <span class="dispatch-status ${dispatch.status}">${getStatusText(dispatch.status)}</span>
            </div>
            <div class="dispatch-card-body">
                <div class="dispatch-order-info">
                    <span class="dispatch-order-id">ORD-${dispatch.orderId}</span>
                    <span class="dispatch-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${dispatch.scheduledTime}
                    </span>
                </div>
                <div class="dispatch-customer">
                    <div class="dispatch-customer-avatar">${customerInitial}</div>
                    <div class="dispatch-customer-info">
                        <div class="dispatch-customer-name">${dispatch.customer.name}</div>
                        <div class="dispatch-customer-phone">${dispatch.customer.phone}</div>
                    </div>
                </div>
                <div class="dispatch-address">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span class="dispatch-address-text">${dispatch.address}</span>
                </div>
                <div class="dispatch-items">
                    ${itemTags}
                </div>
            </div>
            <div class="dispatch-card-footer">
                ${dispatch.driver ? `
                    <div class="dispatch-driver">
                        <div class="dispatch-driver-avatar">${driverInitial}</div>
                        <span class="dispatch-driver-name">${dispatch.driver.name}</span>
                    </div>
                ` : `
                    <div class="dispatch-driver unassigned">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>Not Assigned</span>
                    </div>
                `}
                <div class="dispatch-actions" onclick="event.stopPropagation()">
                    <button class="dispatch-action-btn" title="Call customer" onclick="callCustomer('${dispatch.customer.phone}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                    </button>
                    <button class="dispatch-action-btn" title="Get directions" onclick="getDirections('${dispatch.address}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                        </svg>
                    </button>
                    ${dispatch.status !== 'completed' ? `
                        <button class="dispatch-action-btn" title="Mark complete" onclick="markComplete('${dispatch.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render all dispatch cards
 */
function renderDispatches(dispatches) {
    const grid = document.getElementById('dispatchGrid');
    const empty = document.getElementById('dispatchEmpty');
    
    if (!grid) return;

    if (dispatches.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'flex';
        return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';
    grid.innerHTML = dispatches.map(d => renderDispatchCard(d)).join('');
}

/**
 * Update stats from API response or calculate from data
 */
function updateStats(stats) {
    document.getElementById('deliveryCount').textContent = stats.deliveries || 0;
    document.getElementById('pickupCount').textContent = stats.pickups || 0;
    document.getElementById('pendingCount').textContent = stats.pending || 0;
    document.getElementById('completedCount').textContent = stats.completed || 0;
}

/**
 * Filter dispatches
 */
function filterDispatches() {
    const activeTab = document.querySelector('.filter-tab.active');
    const filterType = activeTab?.dataset.filter || 'all';
    const searchTerm = document.getElementById('dispatchSearchInput')?.value.toLowerCase() || '';

    let filtered = dispatchesData;

    // Filter by type
    if (filterType !== 'all') {
        filtered = filtered.filter(d => d.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(d =>
            String(d.orderId).toLowerCase().includes(searchTerm) ||
            d.id.toLowerCase().includes(searchTerm) ||
            d.customer.name.toLowerCase().includes(searchTerm) ||
            d.address.toLowerCase().includes(searchTerm) ||
            d.items.some(item => item.toLowerCase().includes(searchTerm))
        );
    }

    renderDispatches(filtered);
}

/**
 * View order detail
 */
function viewOrder(orderId) {
    window.location.href = `/rent-it/admin/orders/orderdetail.php?id=${orderId}`;
}

/**
 * Call customer
 */
function callCustomer(phone) {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
}

/**
 * Get directions to address
 */
function getDirections(address) {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank');
}

/**
 * Mark dispatch as complete
 */
function markComplete(dispatchId) {
    const dispatch = dispatchesData.find(d => d.id === dispatchId);
    if (dispatch && confirm(`Mark ${dispatch.type} for ${dispatch.customer.name} as complete?`)) {
        // In production, this would make an API call to update the status
        dispatch.status = 'completed';
        filterDispatches();
        // Recalculate stats
        const stats = {
            deliveries: dispatchesData.filter(d => d.type === 'delivery' && d.status !== 'completed').length,
            pickups: dispatchesData.filter(d => d.type === 'pickup' && d.status !== 'completed').length,
            pending: dispatchesData.filter(d => d.status === 'pending').length,
            completed: dispatchesData.filter(d => d.status === 'completed').length
        };
        updateStats(stats);
        alert(`${dispatch.type.charAt(0).toUpperCase() + dispatch.type.slice(1)} marked as complete!`);
    }
}

/**
 * Fetch dispatches from API
 */
async function fetchDispatches(range = 'week') {
    const grid = document.getElementById('dispatchGrid');
    const empty = document.getElementById('dispatchEmpty');
    
    try {
        // Show loading state
        if (grid) {
            grid.innerHTML = '<div class="dispatch-loading">Loading dispatches...</div>';
            grid.style.display = 'block';
        }
        if (empty) {
            empty.style.display = 'none';
        }
        
        const response = await fetch(`/rent-it/admin/api/get_dispatches.php?range=${range}`);
        const data = await response.json();
        
        if (data.success) {
            dispatchesData = data.dispatches || [];
            updateStats(data.stats || {});
            filterDispatches();
        } else {
            console.error('API error:', data.error);
            if (grid) {
                grid.innerHTML = '<div class="dispatch-error">Failed to load dispatches. Please try again.</div>';
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
        if (grid) {
            grid.innerHTML = '<div class="dispatch-error">Error connecting to server.</div>';
        }
    }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from API
    const dateRange = document.getElementById('dateRangeSelect')?.value || 'week';
    fetchDispatches(dateRange);

    // Filter tab click handlers
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterDispatches();
        });
    });

    // Search input handler
    const searchInput = document.getElementById('dispatchSearchInput');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterDispatches, 300);
        });
    }

    // Date range handler - refetch data when changed
    document.getElementById('dateRangeSelect')?.addEventListener('change', function() {
        fetchDispatches(this.value);
    });
});

/**
 * =====================================================
 * ORDERS PAGE - JavaScript Module
 * Handles order list display, filtering, and actions
 * =====================================================
 */

// Store orders data from API
let ordersData = [];
let kpiCounts = { pending: 0, confirmed: 0, out_for_delivery: 0, active: 0 };

// Resolve absolute URLs based on the current base tag or window origin
const baseHref = document.querySelector('base')?.href || `${window.location.origin}/`;
function buildUrl(path) {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return new URL(normalizedPath, baseHref).toString();
}

/**
 * Fetch orders from API
 */
async function fetchOrders() {
    try {
        const response = await fetch(buildUrl('admin/api/get_orders.php'));
        const result = await response.json();
        
        if (result.success) {
            ordersData = result.data;
            kpiCounts = result.counts;
            renderOrders(ordersData);
            updateKPICounts();
        } else {
            console.error('Failed to fetch orders:', result.message);
            renderOrders([]);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        renderOrders([]);
    }
}

/**
 * Get status display text
 */
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'out_for_delivery': 'Out for Delivery',
        'active': 'Active',
        'return_scheduled': 'Return Scheduled',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'late': 'Late'
    };
    return statusMap[status] || status;
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Get customer initial for avatar
 */
function getInitial(name) {
    return name?.charAt(0)?.toUpperCase() || '?';
}

/**
 * Render order row
 */
function renderOrderRow(order) {
    const initial = getInitial(order.customer.name);
    const itemsText = order.items.length === 0
        ? 'No items'
        : order.items.length === 1 
            ? order.items[0].name 
            : `${order.items[0].name} +${order.items.length - 1} more`;
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return `
        <tr data-order-id="${order.order_id}">
            <td>
                <a href="admin/orders/orderdetail.php?id=${order.order_id}" class="order-id">${order.id}</a>
            </td>
            <td>
                <div class="customer-cell">
                    <div class="customer-avatar">
                        ${order.customer.avatar 
                            ? `<img src="${order.customer.avatar}" alt="${order.customer.name}" onerror="this.style.display='none';this.parentElement.textContent='${initial}'">` 
                            : initial}
                    </div>
                    <div class="customer-info">
                        <span class="customer-name">${order.customer.name}</span>
                        <span class="customer-email">${order.customer.email}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="items-cell">
                    <span class="item-name">${itemsText}</span>
                    <span class="item-count">${totalItems} item${totalItems !== 1 ? 's' : ''}</span>
                </div>
            </td>
            <td>
                <div class="dates-cell">
                    <span class="date-range">${formatDate(order.dates.start)} - ${formatDate(order.dates.end)}</span>
                    <span class="date-duration">${order.dates.duration} day${order.dates.duration !== 1 ? 's' : ''}</span>
                </div>
            </td>
            <td>
                <span class="total-amount">${formatCurrency(order.total)}</span>
            </td>
            <td>
                <span class="status-badge ${order.status}">${getStatusText(order.status)}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view" title="View order details" onclick="viewOrder(${order.order_id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="action-btn confirm" title="Confirm order" onclick="confirmOrder(${order.order_id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </button>
                        <button class="action-btn cancel" title="Cancel order" onclick="cancelOrder(${order.order_id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    ` : ''}
                    ${(function() {
                        const endDate = new Date(order.dates.end);
                        endDate.setHours(0, 0, 0, 0);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isOverdue = endDate < today;
                        const canMarkLate = isOverdue && ['active', 'return_scheduled'].includes(order.status);
                        const isLate = order.status === 'late';
                        
                        if (isLate) {
                            return `<button class="action-btn late-fee" title="View late fees" onclick="viewLateFees(${order.order_id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </button>`;
                        } else if (canMarkLate) {
                            return `<button class="action-btn late-fee" title="Mark as late" onclick="markAsLate(${order.order_id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </button>`;
                        }
                        return '';
                    })()}
                </div>
            </td>
        </tr>
    `;
}

/**
 * Render all orders
 */
function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="orders-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="9" y1="21" x2="9" y2="9"/>
                        </svg>
                        <h3 class="orders-empty-title">No orders found</h3>
                        <p class="orders-empty-text">Try adjusting your search or filter criteria</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => renderOrderRow(order)).join('');
}

/**
 * Update KPI counts
 */
function updateKPICounts() {
    document.getElementById('pendingCount').textContent = kpiCounts.pending || 0;
    document.getElementById('confirmedCount').textContent = kpiCounts.confirmed || 0;
    document.getElementById('deliveryCount').textContent = kpiCounts.out_for_delivery || 0;
    document.getElementById('activeCount').textContent = kpiCounts.active || 0;
}

/**
 * Filter orders based on search and filter selections
 */
function filterOrders() {
    const searchTerm = document.getElementById('orderSearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';

    let filtered = ordersData;

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm) ||
            order.items.some(item => item.name.toLowerCase().includes(searchTerm))
        );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.dates.start);
            
            switch (dateFilter) {
                case 'today':
                    return orderDate.toDateString() === today.toDateString();
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return orderDate >= monthAgo;
                default:
                    return true;
            }
        });
    }

    renderOrders(filtered);
}

/**
 * View order details
 */
function viewOrder(orderId) {
    window.location.href = buildUrl(`admin/orders/orderdetail.php?id=${orderId}`);
}

/**
 * View late fees for an order (already marked as late)
 */
function viewLateFees(orderId) {
    window.location.href = buildUrl(`admin/latefees/latefees.php?order_id=${orderId}`);
}

/**
 * Mark order as late — changes status to Late and navigates to late fees page
 */
async function markAsLate(orderId) {
    if (!confirm('Mark this order as LATE? This will apply late fee penalties to this order.')) return;
    
    try {
        const response = await fetch(buildUrl('admin/api/update_order_status.php'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status: 'Late' })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Order marked as late. Redirecting to late fees...');
            window.location.href = buildUrl(`admin/latefees/latefees.php?order_id=${orderId}`);
        } else {
            alert('Failed to mark order as late: ' + result.message);
        }
    } catch (error) {
        console.error('Error marking order as late:', error);
        alert('Error marking order as late');
    }
}

/**
 * Confirm order (change status to confirmed)
 */
async function confirmOrder(orderId) {
    if (!confirm('Confirm this order?')) return;
    
    try {
        const response = await fetch(buildUrl('admin/api/update_order_status.php'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status: 'Booked' })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Order confirmed successfully!');
            fetchOrders();
        } else {
            alert('Failed to confirm order: ' + result.message);
        }
    } catch (error) {
        console.error('Error confirming order:', error);
        alert('Error confirming order');
    }
}

/**
 * Cancel order
 */
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
        const response = await fetch(buildUrl('admin/api/update_order_status.php'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status: 'Cancelled' })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Order cancelled.');
            fetchOrders();
        } else {
            alert('Failed to cancel order: ' + result.message);
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error cancelling order');
    }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Fetch orders from API
    fetchOrders();

    // Search input handler
    const searchInput = document.getElementById('orderSearchInput');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterOrders, 300);
        });
    }

    // Filter change handlers
    document.getElementById('statusFilter')?.addEventListener('change', filterOrders);
    document.getElementById('dateFilter')?.addEventListener('change', filterOrders);

    // Refresh button
    document.getElementById('refreshOrdersBtn')?.addEventListener('click', () => {
        fetchOrders();
    });

    // Export button (placeholder)
    document.getElementById('exportOrdersBtn')?.addEventListener('click', () => {
        alert('Export functionality would generate a CSV/PDF of the current order list.');
    });
});

/**
 * =====================================================
 * ORDERS PAGE - JavaScript Module
 * Handles order list display, filtering, and actions
 * =====================================================
 */

// Sample order data (will be replaced with API calls)
const sampleOrders = [
    {
        id: 'ORD-2025-0142',
        customer: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            avatar: null
        },
        items: [
            { name: 'Canon EOS R5', quantity: 1 },
            { name: '50mm Lens', quantity: 2 }
        ],
        dates: {
            start: '2025-01-30',
            end: '2025-02-02',
            duration: 3
        },
        total: 711.00,
        status: 'pending'
    },
    {
        id: 'ORD-2025-0141',
        customer: {
            name: 'Maria Santos',
            email: 'maria.santos@email.com',
            avatar: null
        },
        items: [
            { name: 'Sony A7 IV', quantity: 1 }
        ],
        dates: {
            start: '2025-01-29',
            end: '2025-02-01',
            duration: 3
        },
        total: 450.00,
        status: 'confirmed'
    },
    {
        id: 'ORD-2025-0140',
        customer: {
            name: 'Carlos Garcia',
            email: 'carlos.g@email.com',
            avatar: null
        },
        items: [
            { name: 'Videoke System Pro', quantity: 1 },
            { name: 'Wireless Mic Set', quantity: 2 }
        ],
        dates: {
            start: '2025-01-28',
            end: '2025-01-30',
            duration: 2
        },
        total: 580.00,
        status: 'out_for_delivery'
    },
    {
        id: 'ORD-2025-0139',
        customer: {
            name: 'Ana Reyes',
            email: 'ana.reyes@email.com',
            avatar: null
        },
        items: [
            { name: 'DJ Equipment Set', quantity: 1 }
        ],
        dates: {
            start: '2025-01-25',
            end: '2025-01-28',
            duration: 3
        },
        total: 890.00,
        status: 'active'
    },
    {
        id: 'ORD-2025-0138',
        customer: {
            name: 'Pedro Cruz',
            email: 'pedro.cruz@email.com',
            avatar: null
        },
        items: [
            { name: 'Sound System', quantity: 1 },
            { name: 'Stage Lights', quantity: 4 }
        ],
        dates: {
            start: '2025-01-22',
            end: '2025-01-25',
            duration: 3
        },
        total: 1250.00,
        status: 'return_scheduled'
    },
    {
        id: 'ORD-2025-0137',
        customer: {
            name: 'Lisa Wong',
            email: 'lisa.wong@email.com',
            avatar: null
        },
        items: [
            { name: 'Projector HD', quantity: 1 }
        ],
        dates: {
            start: '2025-01-20',
            end: '2025-01-22',
            duration: 2
        },
        total: 320.00,
        status: 'completed'
    },
    {
        id: 'ORD-2025-0136',
        customer: {
            name: 'Mark Johnson',
            email: 'mark.j@email.com',
            avatar: null
        },
        items: [
            { name: 'Camera Drone', quantity: 1 }
        ],
        dates: {
            start: '2025-01-18',
            end: '2025-01-20',
            duration: 2
        },
        total: 450.00,
        status: 'cancelled'
    }
];

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
        'cancelled': 'Cancelled'
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
    const itemsText = order.items.length === 1 
        ? order.items[0].name 
        : `${order.items[0].name} +${order.items.length - 1} more`;
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return `
        <tr data-order-id="${order.id}">
            <td>
                <a href="admin/orders/orderdetail.php?id=${order.id}" class="order-id">${order.id}</a>
            </td>
            <td>
                <div class="customer-cell">
                    <div class="customer-avatar">
                        ${order.customer.avatar 
                            ? `<img src="${order.customer.avatar}" alt="${order.customer.name}">` 
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
                    <button class="action-btn view" title="View order details" onclick="viewOrder('${order.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="action-btn confirm" title="Confirm order" onclick="confirmOrder('${order.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </button>
                        <button class="action-btn cancel" title="Cancel order" onclick="cancelOrder('${order.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    ` : ''}
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
function updateKPICounts(orders) {
    const counts = {
        pending: 0,
        confirmed: 0,
        out_for_delivery: 0,
        active: 0
    };

    orders.forEach(order => {
        if (counts[order.status] !== undefined) {
            counts[order.status]++;
        }
    });

    document.getElementById('pendingCount').textContent = counts.pending;
    document.getElementById('confirmedCount').textContent = counts.confirmed;
    document.getElementById('deliveryCount').textContent = counts.out_for_delivery;
    document.getElementById('activeCount').textContent = counts.active;
}

/**
 * Filter orders based on search and filter selections
 */
function filterOrders() {
    const searchTerm = document.getElementById('orderSearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';

    let filtered = sampleOrders;

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

    // Apply date filter (simplified for demo)
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
    window.location.href = `/admin/orders/orderdetail.php?id=${orderId}`;
}

/**
 * Confirm order (change status to confirmed)
 */
function confirmOrder(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
        order.status = 'confirmed';
        filterOrders();
        updateKPICounts(sampleOrders);
        
        // Show notification (would use a toast system in production)
        alert(`Order ${orderId} has been confirmed!`);
    }
}

/**
 * Cancel order
 */
function cancelOrder(orderId) {
    if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        const order = sampleOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            filterOrders();
            updateKPICounts(sampleOrders);
            
            // Show notification
            alert(`Order ${orderId} has been cancelled.`);
        }
    }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderOrders(sampleOrders);
    updateKPICounts(sampleOrders);

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
        filterOrders();
        updateKPICounts(sampleOrders);
    });

    // Export button (placeholder)
    document.getElementById('exportOrdersBtn')?.addEventListener('click', () => {
        alert('Export functionality would generate a CSV/PDF of the current order list.');
    });
});

/**
 * =====================================================
 * ORDER DETAIL PAGE - JavaScript Module
 * Handles order detail display and actions
 * =====================================================
 */

// Sample order data (will be replaced with API calls)
const sampleOrderDetail = {
    id: 'ORD-2025-0142',
    status: 'pending',
    customer: {
        id: 'USR-12345',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+63 912 345 6789',
        avatar: null
    },
    items: [
        {
            id: 'EQ-001',
            name: 'Canon EOS R5',
            category: 'Cameras',
            image: null,
            quantity: 1,
            dailyRate: 150.00,
            subtotal: 450.00
        },
        {
            id: 'EQ-002',
            name: '50mm Prime Lens',
            category: 'Lenses',
            image: null,
            quantity: 2,
            dailyRate: 35.00,
            subtotal: 210.00
        }
    ],
    dates: {
        ordered: '2025-01-28T10:30:00Z',
        start: '2025-01-30',
        end: '2025-02-02',
        duration: 3
    },
    delivery: {
        method: 'Delivery',
        address: '123 Main Street, Makati City, Metro Manila 1200',
        scheduledDate: '2025-01-30',
        scheduledTime: '10:00 AM - 12:00 PM',
        driver: null,
        notes: 'Leave at front desk if not available'
    },
    payment: {
        subtotal: 660.00,
        tax: 79.20,
        deliveryFee: 50.00,
        deposit: 200.00,
        discount: 0,
        total: 989.20,
        status: 'paid',
        method: 'Visa ending in 4242'
    },
    timeline: [
        {
            event: 'Order Placed',
            date: '2025-01-28T10:30:00Z',
            completed: true
        },
        {
            event: 'Payment Received',
            date: '2025-01-28T10:32:00Z',
            completed: true
        },
        {
            event: 'Order Confirmed',
            date: null,
            completed: false,
            current: true
        },
        {
            event: 'Out for Delivery',
            date: null,
            completed: false
        },
        {
            event: 'Delivered',
            date: null,
            completed: false
        }
    ],
    notes: [
        {
            author: 'System',
            date: '2025-01-28T10:30:00Z',
            text: 'Order created from customer checkout.'
        },
        {
            author: 'System',
            date: '2025-01-28T10:32:00Z',
            text: 'Payment of ₱989.20 received via credit card.'
        }
    ]
};

/**
 * Get order ID from URL
 */
function getOrderIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || sampleOrderDetail.id;
}

/**
 * Format date for display
 */
function formatDate(dateStr, includeTime = false) {
    if (!dateStr) return 'Pending';
    const date = new Date(dateStr);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    if (includeTime) {
        options.hour = 'numeric';
        options.minute = '2-digit';
        options.hour12 = true;
    }
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format short date
 */
function formatShortDate(dateStr) {
    if (!dateStr) return 'Pending';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format time
 */
function formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        'returned': 'Returned',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

/**
 * Get initial for avatar
 */
function getInitial(name) {
    return name?.charAt(0)?.toUpperCase() || '?';
}

/**
 * Populate order header
 */
function populateHeader(order) {
    document.getElementById('orderIdTitle').textContent = order.id;
    document.getElementById('orderStatusBadge').textContent = getStatusText(order.status);
    document.getElementById('orderStatusBadge').className = `status-badge ${order.status}`;
    document.getElementById('orderDate').textContent = `Placed on ${formatDate(order.dates.ordered, true)}`;

    // Populate action buttons based on status
    const actionsContainer = document.getElementById('orderActions');
    let actionsHtml = '';

    switch (order.status) {
        case 'pending':
            actionsHtml = `
                <button class="btn btn-secondary" onclick="cancelOrder()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    Cancel Order
                </button>
                <button class="btn btn-primary" onclick="confirmOrder()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Confirm Order
                </button>
            `;
            break;
        case 'confirmed':
            actionsHtml = `
                <button class="btn btn-primary" onclick="dispatchOrder()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    Dispatch Order
                </button>
            `;
            break;
        case 'out_for_delivery':
            actionsHtml = `
                <button class="btn btn-primary" onclick="markDelivered()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Mark as Delivered
                </button>
            `;
            break;
        default:
            actionsHtml = `
                <button class="btn btn-secondary" onclick="printOrder()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <polyline points="6 9 6 2 18 2 18 9"/>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                        <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    Print
                </button>
            `;
    }

    actionsContainer.innerHTML = actionsHtml;
}

/**
 * Populate customer information
 */
function populateCustomer(customer) {
    document.getElementById('customerAvatar').textContent = getInitial(customer.name);
    document.getElementById('customerName').textContent = customer.name;
    document.getElementById('customerEmail').textContent = customer.email;
    document.getElementById('customerPhone').textContent = customer.phone;
}

/**
 * Populate rental items
 */
function populateItems(items, duration) {
    const listContainer = document.getElementById('rentalItemsList');
    document.getElementById('itemCountBadge').textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

    const itemsHtml = items.map(item => `
        <div class="rental-item">
            <div class="rental-item-image">
                ${item.image 
                    ? `<img src="${item.image}" alt="${item.name}">` 
                    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>`
                }
            </div>
            <div class="rental-item-info">
                <div class="rental-item-name">${item.name}</div>
                <div class="rental-item-category">${item.category}</div>
                <div class="rental-item-meta">
                    <span>Qty: ${item.quantity}</span>
                    <span>${duration} day${duration !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="rental-item-price">
                <div class="rental-item-rate">${formatCurrency(item.dailyRate)}/day</div>
                <div class="rental-item-total">Total: ${formatCurrency(item.subtotal)}</div>
            </div>
        </div>
    `).join('');

    listContainer.innerHTML = itemsHtml;
}

/**
 * Populate delivery information
 */
function populateDelivery(delivery, dates) {
    document.getElementById('deliveryMethod').textContent = delivery.method;
    document.getElementById('deliveryAddress').textContent = delivery.address;
    document.getElementById('deliverySchedule').textContent = `${formatShortDate(delivery.scheduledDate)} • ${delivery.scheduledTime}`;
    document.getElementById('driverName').textContent = delivery.driver || 'Not Assigned';
    document.getElementById('deliveryNotes').textContent = delivery.notes || 'No special instructions';
}

/**
 * Populate payment summary
 */
function populatePayment(payment) {
    const paymentBadge = document.getElementById('paymentBadge');
    paymentBadge.textContent = payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
    paymentBadge.className = `payment-badge ${payment.status}`;

    const paymentRowsHtml = `
        <div class="payment-row">
            <span class="label">Subtotal</span>
            <span class="value">${formatCurrency(payment.subtotal)}</span>
        </div>
        <div class="payment-row">
            <span class="label">Tax (12%)</span>
            <span class="value">${formatCurrency(payment.tax)}</span>
        </div>
        <div class="payment-row">
            <span class="label">Delivery Fee</span>
            <span class="value">${formatCurrency(payment.deliveryFee)}</span>
        </div>
        <div class="payment-row">
            <span class="label">Security Deposit</span>
            <span class="value">${formatCurrency(payment.deposit)}</span>
        </div>
        ${payment.discount > 0 ? `
        <div class="payment-row discount">
            <span class="label">Discount</span>
            <span class="value">-${formatCurrency(payment.discount)}</span>
        </div>
        ` : ''}
    `;

    document.getElementById('paymentRows').innerHTML = paymentRowsHtml;
    document.getElementById('paymentTotal').textContent = formatCurrency(payment.total);
    document.getElementById('paymentMethodText').textContent = payment.method;
}

/**
 * Populate order timeline
 */
function populateTimeline(timeline) {
    const timelineContainer = document.getElementById('orderTimeline');

    const timelineHtml = timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : ''} ${item.current ? 'current' : ''}">
            <div class="timeline-icon">
                ${item.completed ? `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                ` : item.current ? `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="4"/>
                    </svg>
                ` : ''}
            </div>
            <div class="timeline-content">
                <div class="timeline-title">${item.event}</div>
                <div class="timeline-date">${item.date ? formatDate(item.date, true) : 'Pending'}</div>
            </div>
        </div>
    `).join('');

    timelineContainer.innerHTML = timelineHtml;
}

/**
 * Populate status progress
 */
function populateStatusProgress(status) {
    const statuses = [
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'out_for_delivery', label: 'Out for Delivery' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' }
    ];

    const currentIndex = statuses.findIndex(s => s.id === status);
    
    const progressHtml = statuses.map((s, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return `
            <div class="status-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                <div class="status-step-indicator">
                    ${isCompleted ? `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    ` : isCurrent ? `
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="4"/>
                        </svg>
                    ` : ''}
                </div>
                <span class="status-step-label">${s.label}</span>
            </div>
        `;
    }).join('');

    document.getElementById('statusProgress').innerHTML = progressHtml;

    // Add action button based on status
    const actionContainer = document.getElementById('statusActionContainer');
    let actionHtml = '';

    switch (status) {
        case 'pending':
            actionHtml = `<button class="btn btn-primary" onclick="confirmOrder()">Confirm Order</button>`;
            break;
        case 'confirmed':
            actionHtml = `<button class="btn btn-primary" onclick="dispatchOrder()">Schedule Dispatch</button>`;
            break;
        case 'out_for_delivery':
            actionHtml = `<button class="btn btn-primary" onclick="markDelivered()">Mark Delivered</button>`;
            break;
        case 'active':
            actionHtml = `<button class="btn btn-secondary" onclick="scheduleReturn()">Schedule Return</button>`;
            break;
    }

    actionContainer.innerHTML = actionHtml;
}

/**
 * Populate notes
 */
function populateNotes(notes) {
    const notesContainer = document.getElementById('notesList');

    if (notes.length === 0) {
        notesContainer.innerHTML = '<div class="notes-empty">No notes yet</div>';
        return;
    }

    const notesHtml = notes.map(note => `
        <div class="note-item">
            <div class="note-header">
                <span class="note-author">${note.author}</span>
                <span class="note-date">${formatDate(note.date, true)}</span>
            </div>
            <p class="note-text">${note.text}</p>
        </div>
    `).join('');

    notesContainer.innerHTML = notesHtml;
}

/**
 * Action handlers
 */
function confirmOrder() {
    if (confirm('Confirm this order?')) {
        sampleOrderDetail.status = 'confirmed';
        sampleOrderDetail.timeline[2].completed = true;
        sampleOrderDetail.timeline[2].date = new Date().toISOString();
        sampleOrderDetail.timeline[2].current = false;
        sampleOrderDetail.timeline[3].current = true;
        sampleOrderDetail.notes.push({
            author: 'Admin',
            date: new Date().toISOString(),
            text: 'Order confirmed and ready for dispatch scheduling.'
        });
        loadOrderDetail();
        alert('Order confirmed successfully!');
    }
}

function cancelOrder() {
    if (confirm('Are you sure you want to cancel this order?')) {
        sampleOrderDetail.status = 'cancelled';
        sampleOrderDetail.notes.push({
            author: 'Admin',
            date: new Date().toISOString(),
            text: 'Order cancelled by administrator.'
        });
        loadOrderDetail();
        alert('Order cancelled.');
    }
}

function dispatchOrder() {
    if (confirm('Mark this order as dispatched?')) {
        sampleOrderDetail.status = 'out_for_delivery';
        sampleOrderDetail.timeline[3].completed = true;
        sampleOrderDetail.timeline[3].date = new Date().toISOString();
        sampleOrderDetail.timeline[3].current = false;
        sampleOrderDetail.timeline[4].current = true;
        sampleOrderDetail.delivery.driver = 'Mike Johnson';
        sampleOrderDetail.notes.push({
            author: 'Admin',
            date: new Date().toISOString(),
            text: 'Order dispatched. Driver: Mike Johnson'
        });
        loadOrderDetail();
        alert('Order dispatched!');
    }
}

function markDelivered() {
    if (confirm('Mark this order as delivered?')) {
        sampleOrderDetail.status = 'active';
        sampleOrderDetail.timeline[4].completed = true;
        sampleOrderDetail.timeline[4].date = new Date().toISOString();
        sampleOrderDetail.timeline[4].current = false;
        sampleOrderDetail.notes.push({
            author: 'Admin',
            date: new Date().toISOString(),
            text: 'Equipment delivered to customer.'
        });
        loadOrderDetail();
        alert('Order marked as delivered!');
    }
}

function scheduleReturn() {
    alert('Return scheduling modal would open here.');
}

function printOrder() {
    window.print();
}

/**
 * Load order detail
 */
function loadOrderDetail() {
    const order = sampleOrderDetail;
    
    populateHeader(order);
    populateCustomer(order.customer);
    populateItems(order.items, order.dates.duration);
    populateDelivery(order.delivery, order.dates);
    populatePayment(order.payment);
    populateTimeline(order.timeline);
    populateStatusProgress(order.status);
    populateNotes(order.notes);
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetail();

    // Add note button handler
    document.getElementById('addNoteBtn')?.addEventListener('click', () => {
        const note = prompt('Enter note:');
        if (note) {
            sampleOrderDetail.notes.push({
                author: 'Admin',
                date: new Date().toISOString(),
                text: note
            });
            populateNotes(sampleOrderDetail.notes);
        }
    });
});

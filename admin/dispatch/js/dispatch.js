/**
 * =====================================================
 * DISPATCH PAGE - JavaScript Module
 * Handles dispatch management - deliveries and pickups
 * =====================================================
 */

// Sample dispatch data
const sampleDispatches = [
    {
        id: 'DSP-001',
        orderId: 'ORD-2025-0142',
        type: 'delivery',
        status: 'scheduled',
        scheduledTime: '10:00 AM - 12:00 PM',
        scheduledDate: '2025-01-30',
        customer: {
            name: 'John Doe',
            phone: '+63 912 345 6789',
            avatar: null
        },
        address: '123 Main Street, Makati City, Metro Manila 1200',
        items: ['Canon EOS R5', '50mm Lens'],
        driver: {
            name: 'Mike Johnson',
            avatar: null
        }
    },
    {
        id: 'DSP-002',
        orderId: 'ORD-2025-0141',
        type: 'delivery',
        status: 'in_transit',
        scheduledTime: '9:00 AM - 11:00 AM',
        scheduledDate: '2025-01-30',
        customer: {
            name: 'Maria Santos',
            phone: '+63 917 234 5678',
            avatar: null
        },
        address: '456 Rizal Avenue, Quezon City, Metro Manila 1100',
        items: ['Sony A7 IV'],
        driver: {
            name: 'Carlos Rivera',
            avatar: null
        }
    },
    {
        id: 'DSP-003',
        orderId: 'ORD-2025-0138',
        type: 'pickup',
        status: 'scheduled',
        scheduledTime: '2:00 PM - 4:00 PM',
        scheduledDate: '2025-01-30',
        customer: {
            name: 'Pedro Cruz',
            phone: '+63 918 345 6789',
            avatar: null
        },
        address: '789 Ayala Boulevard, Taguig City, Metro Manila 1630',
        items: ['Sound System', 'Stage Lights (4x)'],
        driver: {
            name: 'Mike Johnson',
            avatar: null
        }
    },
    {
        id: 'DSP-004',
        orderId: 'ORD-2025-0145',
        type: 'delivery',
        status: 'pending',
        scheduledTime: '1:00 PM - 3:00 PM',
        scheduledDate: '2025-01-30',
        customer: {
            name: 'Ana Reyes',
            phone: '+63 919 456 7890',
            avatar: null
        },
        address: '321 EDSA, Mandaluyong City, Metro Manila 1550',
        items: ['DJ Equipment Set'],
        driver: null
    },
    {
        id: 'DSP-005',
        orderId: 'ORD-2025-0140',
        type: 'pickup',
        status: 'completed',
        scheduledTime: '9:00 AM - 11:00 AM',
        scheduledDate: '2025-01-30',
        customer: {
            name: 'Lisa Wong',
            phone: '+63 920 567 8901',
            avatar: null
        },
        address: '567 Ortigas Avenue, Pasig City, Metro Manila 1600',
        items: ['Projector HD'],
        driver: {
            name: 'Carlos Rivera',
            avatar: null
        }
    },
    {
        id: 'DSP-006',
        orderId: 'ORD-2025-0147',
        type: 'delivery',
        status: 'pending',
        scheduledTime: '3:00 PM - 5:00 PM',
        scheduledDate: '2025-01-30',
        customer: {
            name: 'Mark Johnson',
            phone: '+63 921 678 9012',
            avatar: null
        },
        address: '890 Shaw Boulevard, Mandaluyong City, Metro Manila 1550',
        items: ['Videoke System', 'Wireless Mic (2x)'],
        driver: null
    },
    {
        id: 'DSP-007',
        orderId: 'ORD-2025-0146',
        type: 'pickup',
        status: 'scheduled',
        scheduledTime: '4:00 PM - 6:00 PM',
        scheduledDate: '2025-01-31',
        customer: {
            name: 'Sarah Lee',
            phone: '+63 922 789 0123',
            avatar: null
        },
        address: '234 Bonifacio High Street, Taguig City, Metro Manila 1630',
        items: ['Camera Drone', 'Extra Batteries'],
        driver: {
            name: 'Mike Johnson',
            avatar: null
        }
    }
];

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
                    <span class="dispatch-order-id">${dispatch.orderId}</span>
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
 * Update stats
 */
function updateStats(dispatches) {
    const today = new Date().toISOString().split('T')[0];
    
    const todayDispatches = dispatches.filter(d => d.scheduledDate === '2025-01-30'); // Using sample date
    
    const deliveries = todayDispatches.filter(d => d.type === 'delivery' && d.status !== 'completed').length;
    const pickups = todayDispatches.filter(d => d.type === 'pickup' && d.status !== 'completed').length;
    const pending = dispatches.filter(d => d.status === 'pending').length;
    const completed = todayDispatches.filter(d => d.status === 'completed').length;

    document.getElementById('deliveryCount').textContent = deliveries;
    document.getElementById('pickupCount').textContent = pickups;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('completedCount').textContent = completed;
}

/**
 * Filter dispatches
 */
function filterDispatches() {
    const activeTab = document.querySelector('.filter-tab.active');
    const filterType = activeTab?.dataset.filter || 'all';
    const searchTerm = document.getElementById('dispatchSearchInput')?.value.toLowerCase() || '';

    let filtered = sampleDispatches;

    // Filter by type
    if (filterType !== 'all') {
        filtered = filtered.filter(d => d.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(d =>
            d.orderId.toLowerCase().includes(searchTerm) ||
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
    window.location.href = `/admin/orders/orderdetail.php?id=${orderId}`;
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
    const dispatch = sampleDispatches.find(d => d.id === dispatchId);
    if (dispatch && confirm(`Mark ${dispatch.type} for ${dispatch.customer.name} as complete?`)) {
        dispatch.status = 'completed';
        filterDispatches();
        updateStats(sampleDispatches);
        alert(`${dispatch.type.charAt(0).toUpperCase() + dispatch.type.slice(1)} marked as complete!`);
    }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderDispatches(sampleDispatches);
    updateStats(sampleDispatches);

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

    // Date range handler
    document.getElementById('dateRangeSelect')?.addEventListener('change', function() {
        // In production, this would filter by actual dates
        filterDispatches();
    });
});

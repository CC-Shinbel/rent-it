/**
 * =====================================================
 * CUSTOMERS PAGE - JavaScript Module
 * Handles customer list display, filtering, and actions
 * =====================================================
 */

// Sample customer data with booking info
const sampleCustomers = [
    {
        id: 'USR-12345',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+63 912 345 6789',
        avatar: null,
        booking: {
            id: 'BK-78901',
            items: ['Canon EOS R5', '50mm Lens'],
            totalItems: 2,
            startDate: '2025-01-30',
            endDate: '2025-02-02',
            duration: 3,
            status: 'active',
            payment: 'paid'
        }
    },
    {
        id: 'USR-12346',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '+63 917 234 5678',
        avatar: null,
        booking: {
            id: 'BK-78902',
            items: ['Sony A7 IV'],
            totalItems: 1,
            startDate: '2025-01-29',
            endDate: '2025-02-01',
            duration: 3,
            status: 'active',
            payment: 'paid'
        }
    },
    {
        id: 'USR-12347',
        name: 'Pedro Cruz',
        email: 'pedro.cruz@email.com',
        phone: '+63 918 345 6789',
        avatar: null,
        booking: {
            id: 'BK-78903',
            items: ['Sound System', 'Stage Lights'],
            totalItems: 5,
            startDate: '2025-01-22',
            endDate: '2025-01-25',
            duration: 3,
            status: 'overdue',
            payment: 'overdue'
        }
    },
    {
        id: 'USR-12348',
        name: 'Ana Reyes',
        email: 'ana.reyes@email.com',
        phone: '+63 919 456 7890',
        avatar: null,
        booking: {
            id: 'BK-78904',
            items: ['DJ Equipment Set'],
            totalItems: 1,
            startDate: '2025-01-25',
            endDate: '2025-01-28',
            duration: 3,
            status: 'returned',
            payment: 'paid'
        }
    },
    {
        id: 'USR-12349',
        name: 'Carlos Garcia',
        email: 'carlos.g@email.com',
        phone: '+63 920 567 8901',
        avatar: null,
        booking: {
            id: 'BK-78905',
            items: ['Videoke System Pro', 'Wireless Mic'],
            totalItems: 3,
            startDate: '2025-01-28',
            endDate: '2025-01-30',
            duration: 2,
            status: 'pending',
            payment: 'pending'
        }
    },
    {
        id: 'USR-12350',
        name: 'Lisa Wong',
        email: 'lisa.wong@email.com',
        phone: '+63 921 678 9012',
        avatar: null,
        booking: {
            id: 'BK-78906',
            items: ['Projector HD'],
            totalItems: 1,
            startDate: '2025-01-20',
            endDate: '2025-01-22',
            duration: 2,
            status: 'completed',
            payment: 'paid'
        }
    },
    {
        id: 'USR-12351',
        name: 'Mark Johnson',
        email: 'mark.j@email.com',
        phone: '+63 922 789 0123',
        avatar: null,
        booking: {
            id: 'BK-78907',
            items: ['Camera Drone', 'Extra Batteries'],
            totalItems: 2,
            startDate: '2025-01-18',
            endDate: '2025-01-20',
            duration: 2,
            status: 'completed',
            payment: 'paid'
        }
    },
    {
        id: 'USR-12352',
        name: 'Sarah Lee',
        email: 'sarah.lee@email.com',
        phone: '+63 923 890 1234',
        avatar: null,
        booking: {
            id: 'BK-78908',
            items: ['LED Panel Lights'],
            totalItems: 4,
            startDate: '2025-01-23',
            endDate: '2025-01-26',
            duration: 3,
            status: 'overdue',
            payment: 'partial'
        }
    },
    {
        id: 'USR-12353',
        name: 'James Chen',
        email: 'james.chen@email.com',
        phone: '+63 924 901 2345',
        avatar: null,
        booking: {
            id: 'BK-78909',
            items: ['Gimbal Stabilizer'],
            totalItems: 1,
            startDate: '2025-01-31',
            endDate: '2025-02-03',
            duration: 3,
            status: 'pending',
            payment: 'paid'
        }
    },
    {
        id: 'USR-12354',
        name: 'Emily Torres',
        email: 'emily.torres@email.com',
        phone: '+63 925 012 3456',
        avatar: null,
        booking: {
            id: 'BK-78910',
            items: ['Ring Light Pro', 'Softbox Kit'],
            totalItems: 2,
            startDate: '2025-01-27',
            endDate: '2025-01-29',
            duration: 2,
            status: 'active',
            payment: 'paid'
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
        'active': 'Active',
        'overdue': 'Overdue',
        'pending': 'Pending',
        'returned': 'Returned',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

/**
 * Get payment display text
 */
function getPaymentText(payment) {
    const paymentMap = {
        'paid': 'Paid',
        'pending': 'Pending',
        'partial': 'Partial',
        'overdue': 'Overdue'
    };
    return paymentMap[payment] || payment;
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Render customer row
 */
function renderCustomerRow(customer) {
    const initial = getInitial(customer.name);
    const booking = customer.booking;
    const itemsText = booking.items.length === 1 
        ? booking.items[0] 
        : `${booking.items[0]} +${booking.items.length - 1} more`;
    
    return `
        <tr data-customer-id="${customer.id}">
            <td>
                <div class="customer-cell">
                    <div class="customer-avatar">
                        ${customer.avatar 
                            ? `<img src="${customer.avatar}" alt="${customer.name}">` 
                            : initial}
                    </div>
                    <div class="customer-info">
                        <span class="customer-name">${customer.name}</span>
                        <span class="customer-email">${customer.email}</span>
                    </div>
                </div>
            </td>
            <td>
                <a href="admin/orders/orderdetail.php?id=${booking.id}" class="booking-id">${booking.id}</a>
            </td>
            <td>
                <div class="items-cell">
                    <span class="item-name">${itemsText}</span>
                    <span class="item-count">${booking.totalItems} item${booking.totalItems !== 1 ? 's' : ''}</span>
                </div>
            </td>
            <td>
                <div class="dates-cell">
                    <span class="date-range">${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</span>
                    <span class="date-duration">${booking.duration} day${booking.duration !== 1 ? 's' : ''}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span>
            </td>
            <td>
                <span class="payment-badge ${booking.payment}">${getPaymentText(booking.payment)}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view" title="View details" onclick="viewCustomer('${customer.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <button class="action-btn email" title="Send email" onclick="sendEmail('${customer.email}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                    </button>
                    <button class="action-btn call" title="Call customer" onclick="callCustomer('${customer.phone}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Render all customers
 */
function renderCustomers(customers) {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="customers-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <h3 class="customers-empty-title">No customers found</h3>
                        <p class="customers-empty-text">Try adjusting your search or filter criteria</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = customers.map(customer => renderCustomerRow(customer)).join('');
}

/**
 * Update KPI counts
 */
function updateKPICounts() {
    const activeBookings = sampleCustomers.filter(c => c.booking.status === 'active').length;
    const overdueReturns = sampleCustomers.filter(c => c.booking.status === 'overdue').length;
    
    document.getElementById('activeBookingsCount').textContent = activeBookings;
    document.getElementById('overdueReturnsCount').textContent = overdueReturns;
    
    // These would come from API in production
    document.getElementById('monthlyRevenueValue').textContent = '₱42,580';
    document.getElementById('totalCustomersCount').textContent = '1,842';
}

/**
 * Filter customers based on search and filter selections
 */
function filterCustomers() {
    const searchTerm = document.getElementById('customerSearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'recent';

    let filtered = [...sampleCustomers];

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.booking.id.toLowerCase().includes(searchTerm) ||
            customer.booking.items.some(item => item.toLowerCase().includes(searchTerm))
        );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
        switch (statusFilter) {
            case 'active':
                filtered = filtered.filter(c => c.booking.status === 'active');
                break;
            case 'overdue':
                filtered = filtered.filter(c => c.booking.status === 'overdue');
                break;
            case 'inactive':
                filtered = filtered.filter(c => 
                    c.booking.status === 'completed' || c.booking.status === 'returned'
                );
                break;
        }
    }

    // Apply sort
    switch (sortFilter) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'bookings':
            filtered.sort((a, b) => b.booking.totalItems - a.booking.totalItems);
            break;
        case 'revenue':
            // Would sort by revenue in production
            break;
        default: // recent
            filtered.sort((a, b) => new Date(b.booking.startDate) - new Date(a.booking.startDate));
    }

    renderCustomers(filtered);
}

/**
 * View customer details
 */
function viewCustomer(customerId) {
    const customer = sampleCustomers.find(c => c.id === customerId);
    if (customer) {
        window.location.href = `/admin/orders/orderdetail.php?id=${customer.booking.id}`;
    }
}

/**
 * Show email modal for customer
 */
function sendEmail(email, customerName = '') {
    // Find customer data
    const customer = sampleCustomers.find(c => c.email === email);
    const name = customerName || customer?.name || 'Customer';
    
    showEmailModal({
        to: email,
        customerName: name,
        subject: '',
        message: ''
    });
}

/**
 * Show email modal
 */
function showEmailModal(data) {
    // Remove existing modal
    document.querySelector('.email-modal-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'email-modal-backdrop';
    backdrop.innerHTML = `
        <div class="email-modal">
            <div class="email-modal-header">
                <h3 class="email-modal-title">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Send Email
                </h3>
                <button class="email-modal-close" title="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="email-modal-body">
                <div class="email-form-group">
                    <label class="email-form-label">To</label>
                    <input type="text" class="email-form-input" id="emailTo" value="${data.to}" readonly>
                </div>
                <div class="email-form-group">
                    <label class="email-form-label">From</label>
                    <input type="text" class="email-form-input" id="emailFrom" value="admin@rentit.com" readonly>
                </div>
                <div class="email-form-group">
                    <label class="email-form-label">Template</label>
                    <select class="email-form-select" id="emailTemplate">
                        <option value="">Select a template (optional)</option>
                        <option value="reminder">Rental Reminder</option>
                        <option value="confirmation">Booking Confirmation</option>
                        <option value="overdue">Overdue Notice</option>
                        <option value="thankyou">Thank You</option>
                        <option value="custom">Custom Message</option>
                    </select>
                </div>
                <div class="email-form-group">
                    <label class="email-form-label">Subject</label>
                    <input type="text" class="email-form-input" id="emailSubject" placeholder="Enter email subject...">
                </div>
                <div class="email-form-group">
                    <label class="email-form-label">Message</label>
                    <textarea class="email-form-textarea" id="emailMessage" rows="8" placeholder="Enter your message..."></textarea>
                </div>
            </div>
            <div class="email-modal-footer">
                <button class="btn btn-secondary email-cancel-btn">Cancel</button>
                <button class="btn btn-primary email-send-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13"/>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    Send Email
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(() => backdrop.classList.add('open'));

    // Template change handler
    const templateSelect = backdrop.querySelector('#emailTemplate');
    templateSelect.addEventListener('change', (e) => {
        updateEmailTemplate(e.target.value, data.customerName);
    });

    // Close handlers
    const close = () => {
        backdrop.classList.remove('open');
        setTimeout(() => backdrop.remove(), 300);
    };

    backdrop.querySelector('.email-modal-close').addEventListener('click', close);
    backdrop.querySelector('.email-cancel-btn').addEventListener('click', close);
    
    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
    });

    // Close on Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Send email handler
    backdrop.querySelector('.email-send-btn').addEventListener('click', () => {
        const to = backdrop.querySelector('#emailTo').value;
        const subject = backdrop.querySelector('#emailSubject').value;
        const message = backdrop.querySelector('#emailMessage').value;

        if (!subject.trim()) {
            AdminComponents.showToast('Please enter a subject', 'warning');
            return;
        }
        if (!message.trim()) {
            AdminComponents.showToast('Please enter a message', 'warning');
            return;
        }

        // In production, this would send via API
        // For now, simulate sending
        AdminComponents.showToast('Email sent successfully!', 'success');
        close();
    });
}

/**
 * Update email content based on template selection
 */
function updateEmailTemplate(template, customerName) {
    const subjectInput = document.getElementById('emailSubject');
    const messageTextarea = document.getElementById('emailMessage');

    const templates = {
        reminder: {
            subject: 'Rental Reminder - RentIt',
            message: `Hi ${customerName},

This is a friendly reminder about your upcoming rental.

Please remember to:
- Pick up your items on time
- Bring valid ID for verification
- Review our rental terms and conditions

If you have any questions, please don't hesitate to contact us.

Best regards,
RentIt Team`
        },
        confirmation: {
            subject: 'Booking Confirmed - RentIt',
            message: `Hi ${customerName},

Great news! Your booking has been confirmed.

Your rental details have been saved in our system. You will receive a reminder before your pickup date.

Thank you for choosing RentIt!

Best regards,
RentIt Team`
        },
        overdue: {
            subject: 'Overdue Notice - Action Required',
            message: `Hi ${customerName},

We noticed that your rental items are currently overdue.

Please return the items as soon as possible to avoid additional late fees. If you need to extend your rental period, please contact us immediately.

Current late fees may apply as per our rental agreement.

Please contact us if you have any questions or concerns.

Best regards,
RentIt Team`
        },
        thankyou: {
            subject: 'Thank You for Renting with Us!',
            message: `Hi ${customerName},

Thank you for choosing RentIt for your rental needs!

We hope you had a great experience with our equipment. We would love to hear your feedback.

Looking forward to serving you again soon!

Best regards,
RentIt Team`
        },
        custom: {
            subject: '',
            message: ''
        }
    };

    if (template && templates[template]) {
        subjectInput.value = templates[template].subject;
        messageTextarea.value = templates[template].message;
    }
}

/**
 * Call customer
 */
function callCustomer(phone) {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderCustomers(sampleCustomers);
    updateKPICounts();

    // Search input handler
    const searchInput = document.getElementById('customerSearchInput');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterCustomers, 300);
        });
    }

    // Filter change handlers
    document.getElementById('statusFilter')?.addEventListener('change', filterCustomers);
    document.getElementById('sortFilter')?.addEventListener('change', filterCustomers);

    // Export button (placeholder)
    document.getElementById('exportCustomersBtn')?.addEventListener('click', () => {
        alert('Export functionality would generate a CSV/Excel file of the customer list.');
    });
});

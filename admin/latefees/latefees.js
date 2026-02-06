/**
 * =====================================================
 * LATE FEES TRACKER - JavaScript
 * Fetches overdue rentals from DB and renders dynamically
 * =====================================================
 */

// Initialize admin components
document.addEventListener('DOMContentLoaded', () => {
    AdminComponents.initPage('latefees');
    fetchLateFees();
    attachEventListeners();
});

const baseHref = document.querySelector('base')?.href || `${window.location.origin}/`;
function buildUrl(path) {
    const normalized = path.startsWith('/') ? path.slice(1) : path;
    return new URL(normalized, baseHref).toString();
}

let overdueData = [];

// ─────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────

async function fetchLateFees() {
    try {
        // Check if order_id is in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id');

        let url = buildUrl('admin/api/get_latefees.php');
        if (orderId) {
            url += `?order_id=${encodeURIComponent(orderId)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch late fees');
        }

        overdueData = data.overdue || [];
        updateStats(data.stats);
        renderOverdueItems(overdueData);

    } catch (error) {
        console.error('Error fetching late fees:', error);
        AdminComponents.showToast?.('Failed to load late fees data', 'error');

        const list = document.getElementById('overdueList');
        if (list) {
            list.innerHTML = `
                <div class="overdue-empty" style="text-align:center;padding:2rem;">
                    <p style="color:var(--admin-text-secondary);">Failed to load data. Please refresh.</p>
                </div>
            `;
        }
    }
}

// ─────────────────────────────────────────────────────
// STATS UPDATE
// ─────────────────────────────────────────────────────

function updateStats(stats) {
    if (!stats) return;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setVal('statOutstandingFees', formatCurrency(stats.total_outstanding));
    setVal('statOverdueRentals', stats.overdue_count);
    setVal('statCollectedMonth', formatCurrency(stats.collected_month));
    setVal('statRemindersSent', stats.reminders_sent);
}

// ─────────────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────────────

function renderOverdueItems(items) {
    const list = document.getElementById('overdueList');
    const emptyState = document.getElementById('overdueEmpty');
    if (!list) return;

    if (!items || items.length === 0) {
        list.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'flex';
            emptyState.style.flexDirection = 'column';
            emptyState.style.alignItems = 'center';
            emptyState.style.justifyContent = 'center';
            emptyState.style.padding = '3rem 1rem';
            list.appendChild(emptyState);
        }
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    list.innerHTML = items.map(item => renderOverdueCard(item)).join('');
}

function renderOverdueCard(rental) {
    const daysOverdue = rental.days_overdue;
    const priority = rental.priority; // critical, warning, mild
    const itemNames = rental.items.map(i => i.item_name).join(', ');
    const priorityTitle = `${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`;

    return `
        <div class="overdue-item ${priority}" data-id="${rental.order_id}" data-days="${daysOverdue}">
            <div class="overdue-priority">
                <span class="priority-indicator ${priority}" title="${priorityTitle}"></span>
            </div>
            <div class="overdue-main">
                <div class="overdue-customer">
                    <span class="customer-name">${escapeHtml(rental.customer.name)}</span>
                    <span class="customer-email">${escapeHtml(rental.customer.email)}</span>
                </div>
                <div class="overdue-details">
                    <span class="equipment-name">${escapeHtml(rental.order_id_formatted)} — ${escapeHtml(itemNames)}</span>
                    <span class="days-overdue">${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue</span>
                </div>
            </div>
            <div class="overdue-fee">
                <span class="fee-amount">${formatCurrency(rental.late_fee)}</span>
                <span class="fee-label">Late Fee</span>
            </div>
            <div class="overdue-actions">
                <button class="action-btn reminder-btn" title="Send reminder" data-action="remind" onclick="openReminder(${rental.order_id})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                </button>
                <button class="action-btn call-btn" title="Call customer" data-action="call" onclick="logCall(${rental.order_id})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                </button>
                <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve" onclick="resolveItem(${rental.order_id})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// ─────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────

function attachEventListeners() {
    // Filter dropdown
    const filterSelect = document.getElementById('overdueFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            filterOverdueItems(filterSelect.value);
        });
    }

    // Send All Reminders
    const sendAllBtn = document.getElementById('sendAllRemindersBtn');
    if (sendAllBtn) {
        sendAllBtn.addEventListener('click', sendAllReminders);
    }

    // Modal close buttons
    const closeBtn = document.getElementById('closeReminderModal');
    const cancelBtn = document.getElementById('cancelReminderBtn');
    const overlay = document.querySelector('#reminderModal .modal-overlay');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Send Reminder button in modal
    const sendBtn = document.getElementById('sendReminderBtn');
    if (sendBtn) sendBtn.addEventListener('click', sendReminder);

    // Template select change
    const templateSelect = document.getElementById('templateSelect');
    if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
            updateEmailTemplate(e.target.value);
        });
    }

    // Template "Use" buttons
    document.querySelectorAll('.template-btn.use').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const templateItem = e.target.closest('.template-item');
            const templateType = templateItem?.dataset.template;
            if (templateType) {
                const templateSelect = document.getElementById('templateSelect');
                if (templateSelect) templateSelect.value = templateType;
                updateEmailTemplate(templateType);
                AdminComponents.showToast?.(`"${templateType}" template loaded`, 'info');
            }
        });
    });
}

// ─────────────────────────────────────────────────────
// FILTER
// ─────────────────────────────────────────────────────

function filterOverdueItems(filter) {
    if (filter === 'all') {
        renderOverdueItems(overdueData);
        return;
    }

    const filtered = overdueData.filter(item => {
        const days = item.days_overdue;
        switch (filter) {
            case '1-3': return days >= 1 && days <= 3;
            case '4-7': return days >= 4 && days <= 7;
            case '7+':  return days > 7;
            default:    return true;
        }
    });

    renderOverdueItems(filtered);
}

// ─────────────────────────────────────────────────────
// REMINDER MODAL
// ─────────────────────────────────────────────────────

let currentReminderId = null;

function openReminder(orderId) {
    const rental = overdueData.find(r => r.order_id === orderId);
    if (!rental) return;

    currentReminderId = orderId;

    // Populate modal
    const recipientEl = document.getElementById('reminderRecipient');
    const emailEl = document.getElementById('reminderEmail');
    if (recipientEl) recipientEl.textContent = rental.customer.name;
    if (emailEl) emailEl.textContent = rental.customer.email;

    // Set default template
    const templateSelect = document.getElementById('templateSelect');
    if (templateSelect) {
        // Auto-select template based on severity
        if (rental.days_overdue >= 7) {
            templateSelect.value = 'final';
        } else if (rental.days_overdue >= 4) {
            templateSelect.value = 'urgent';
        } else {
            templateSelect.value = 'gentle';
        }
        updateEmailTemplate(templateSelect.value, rental);
    }

    // Show modal
    const modal = document.getElementById('reminderModal');
    if (modal) modal.classList.add('open');
}

function closeModal() {
    const modal = document.getElementById('reminderModal');
    if (modal) modal.classList.remove('open');
    currentReminderId = null;
}

function updateEmailTemplate(templateType, rental) {
    if (!rental && currentReminderId) {
        rental = overdueData.find(r => r.order_id === currentReminderId);
    }

    const customerName = rental?.customer?.name || '[Customer Name]';
    const itemNames = rental?.items?.map(i => i.item_name).join(', ') || '[Equipment Name]';
    const dueDate = rental?.end_date || '[Due Date]';
    const lateFee = rental ? formatCurrency(rental.late_fee) : '₱[Amount]';
    const daysOverdue = rental?.days_overdue || '[X]';

    const templates = {
        gentle: {
            subject: `Rental Return Reminder - ${itemNames}`,
            body: `Hi ${customerName},\n\nThis is a friendly reminder that your rental of ${itemNames} was due on ${dueDate}.\n\nYour current late fee is: ${lateFee}\n\nPlease return the equipment at your earliest convenience to avoid additional charges. If you have already returned the item, please disregard this message.\n\nIf you need to extend your rental, please contact us at (02) 8123-4567.\n\nThank you for your understanding.\n\nBest regards,\nSound Rental Team`
        },
        urgent: {
            subject: `URGENT: Rental ${daysOverdue} Days Overdue - ${itemNames}`,
            body: `Dear ${customerName},\n\nURGENT: Your rental of ${itemNames} is now ${daysOverdue} days overdue.\n\nAccrued late fee: ${lateFee}\n\nPlease return the equipment immediately to prevent further charges. Late fees continue to accumulate daily.\n\nIf you are unable to return the items, please contact us immediately at (02) 8123-4567.\n\nRegards,\nSound Rental Team`
        },
        final: {
            subject: `FINAL NOTICE: Immediate Return Required - ${itemNames}`,
            body: `Dear ${customerName},\n\nFINAL NOTICE: Your rental of ${itemNames} is ${daysOverdue} days overdue with a total late fee of ${lateFee}.\n\nThis is our final notice before escalation. Please return all equipment within 24 hours or we will be forced to take further action, which may include additional penalties.\n\nContact us immediately at (02) 8123-4567.\n\nSound Rental Management`
        },
        payment: {
            subject: `Payment Due: Late Fees of ${lateFee}`,
            body: `Dear ${customerName},\n\nYou have an outstanding late fee of ${lateFee} for the rental of ${itemNames} (due: ${dueDate}).\n\nPlease settle the payment at your earliest convenience. You can pay via:\n- Bank transfer\n- GCash/Maya\n- In-person at our office\n\nFor questions, contact us at (02) 8123-4567.\n\nThank you,\nSound Rental Team`
        },
        custom: {
            subject: `Regarding Your Rental - ${itemNames}`,
            body: ''
        }
    };

    const template = templates[templateType] || templates.gentle;
    const subjectEl = document.getElementById('emailSubject');
    const bodyEl = document.getElementById('emailBody');
    if (subjectEl) subjectEl.value = template.subject;
    if (bodyEl) bodyEl.value = template.body;
}

function sendReminder() {
    if (!currentReminderId) return;

    const rental = overdueData.find(r => r.order_id === currentReminderId);
    if (!rental) return;

    // In a real app, this would call an API to send the email
    AdminComponents.showToast?.(`Reminder sent to ${rental.customer.name}`, 'success');
    closeModal();

    // Add to activity list
    addActivity('sent', `Reminder sent to ${rental.customer.name}`);
}

function sendAllReminders() {
    if (overdueData.length === 0) {
        AdminComponents.showToast?.('No overdue rentals to send reminders for', 'info');
        return;
    }

    if (!confirm(`Send reminders to all ${overdueData.length} overdue customers?`)) return;

    AdminComponents.showToast?.(`Reminders sent to ${overdueData.length} customers`, 'success');
    addActivity('sent', `Bulk reminders sent (${overdueData.length} customers)`);
}

// ─────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────

function logCall(orderId) {
    const rental = overdueData.find(r => r.order_id === orderId);
    if (!rental) return;

    AdminComponents.showToast?.(`Call logged for ${rental.customer.name}`, 'info');
    addActivity('call', `Call logged: ${rental.customer.name}`);
}

function resolveItem(orderId) {
    const rental = overdueData.find(r => r.order_id === orderId);
    if (!rental) return;

    if (!confirm(`Mark ${rental.order_id_formatted} as resolved?`)) return;

    AdminComponents.showToast?.(`${rental.order_id_formatted} marked as resolved`, 'success');
    addActivity('resolved', `Late fee resolved for ${rental.customer.name}`);

    // Remove from local data and re-render
    overdueData = overdueData.filter(r => r.order_id !== orderId);
    renderOverdueItems(overdueData);

    // Update stats locally
    const statsOutstanding = document.getElementById('statOutstandingFees');
    const statsCount = document.getElementById('statOverdueRentals');
    if (statsOutstanding) {
        const total = overdueData.reduce((sum, r) => sum + r.late_fee, 0);
        statsOutstanding.textContent = formatCurrency(total);
    }
    if (statsCount) statsCount.textContent = overdueData.length;
}

// ─────────────────────────────────────────────────────
// ACTIVITY LOG (client-side only)
// ─────────────────────────────────────────────────────

function addActivity(type, text) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    const icons = {
        sent: `<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>`,
        resolved: `<polyline points="20 6 9 17 4 12"/>`,
        call: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`
    };

    const activityHtml = `
        <div class="activity-item" style="animation: fadeIn 0.3s ease;">
            <div class="activity-icon ${type}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${icons[type] || icons.sent}
                </svg>
            </div>
            <div class="activity-info">
                <span class="activity-text">${escapeHtml(text)}</span>
                <span class="activity-time">Just now</span>
            </div>
        </div>
    `;

    activityList.insertAdjacentHTML('afterbegin', activityHtml);
}

// ─────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────

function formatCurrency(amount) {
    return '₱' + Number(amount || 0).toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

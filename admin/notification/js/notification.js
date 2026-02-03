/**
 * Admin Notifications Page
 * Handles notification filtering, marking as read, clearing, and actions
 */

document.addEventListener('DOMContentLoaded', function() {
    initNotifications();
});

function initNotifications() {
    // Initialize admin components
    if (typeof AdminComponents !== 'undefined') {
        AdminComponents.injectSidebar();
        AdminComponents.injectTopbar();
    }
    
    // Initialize notification functionality
    initFilters();
    initNotificationActions();
    initMarkAllRead();
    initClearAll();
    updateFilterCounts();
}

/**
 * Initialize filter tabs
 */
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter notifications
            const filter = this.dataset.filter;
            filterNotifications(filter);
        });
    });
}

/**
 * Filter notifications based on selected tab
 */
function filterNotifications(filter) {
    const notifications = document.querySelectorAll('.notification-item');
    const groups = document.querySelectorAll('.notification-group');
    const emptyState = document.querySelector('.empty-state');
    let visibleCount = 0;
    
    notifications.forEach(notification => {
        let shouldShow = false;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'unread':
                shouldShow = notification.classList.contains('unread');
                break;
            case 'orders':
                shouldShow = notification.dataset.type === 'order';
                break;
            case 'returns':
                shouldShow = notification.dataset.type === 'return';
                break;
            case 'system':
                shouldShow = notification.dataset.type === 'system';
                break;
            case 'alerts':
                shouldShow = notification.dataset.type === 'alert';
                break;
            default:
                shouldShow = true;
        }
        
        notification.style.display = shouldShow ? 'flex' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    // Show/hide groups based on visible notifications
    groups.forEach(group => {
        const visibleItems = group.querySelectorAll('.notification-item[style="display: flex;"], .notification-item:not([style])');
        const hasVisible = Array.from(visibleItems).some(item => item.style.display !== 'none');
        group.style.display = hasVisible ? 'flex' : 'none';
    });
    
    // Show empty state if no notifications visible
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
}

/**
 * Initialize notification item actions
 */
function initNotificationActions() {
    // Mark single notification as read on click
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't mark as read if clicking on buttons
            if (e.target.closest('button')) return;
            markAsRead(this);
        });
    });
    
    // Handle dismiss buttons
    document.querySelectorAll('.btn-notification-menu').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const notification = this.closest('.notification-item');
            dismissNotification(notification);
        });
    });
    
    // Handle action buttons
    document.querySelectorAll('.btn-notification-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleNotificationAction(this);
        });
    });
}

/**
 * Mark a notification as read
 */
function markAsRead(notification) {
    notification.classList.remove('unread');
    updateFilterCounts();
}

/**
 * Dismiss a notification with animation
 */
function dismissNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        notification.remove();
        updateFilterCounts();
        checkEmptyGroups();
        checkEmptyState();
    }, 300);
}

/**
 * Handle notification action button clicks
 */
function handleNotificationAction(button) {
    const action = button.textContent.trim().toLowerCase();
    const notification = button.closest('.notification-item');
    
    switch(action) {
        case 'view order':
            // Navigate to order details
            window.location.href = 'admin/orders/orders.html';
            break;
        case 'schedule pickup':
            // Navigate to dispatch or returns
            window.location.href = 'admin/dispatch/dispatch.html';
            break;
        case 'view details':
            showToast('Opening details...', 'info');
            break;
        case 'view inventory':
            // Navigate to catalog/inventory
            showToast('Opening inventory...', 'info');
            break;
        case 'view transaction':
            window.location.href = 'admin/orders/orders.html';
            break;
        case 'contact customer':
            window.location.href = 'admin/customers/customers.html';
            break;
        case 'schedule repair':
            window.location.href = 'admin/repairs/repairs.html';
            break;
        case 'view equipment':
            showToast('Opening equipment details...', 'info');
            break;
        case 'view profile':
            window.location.href = 'admin/customers/customers.html';
            break;
        case 'view report':
            showToast('Opening report...', 'info');
            break;
        case 'mark as read':
            markAsRead(notification);
            showToast('Marked as read', 'success');
            break;
        case 'dismiss':
            dismissNotification(notification);
            break;
        default:
            console.log('Action clicked:', action);
    }
}

/**
 * Initialize Mark All Read button
 */
function initMarkAllRead() {
    const markAllBtn = document.querySelector('.btn-mark-all');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', function() {
            const unreadNotifications = document.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(notification => {
                notification.classList.remove('unread');
            });
            updateFilterCounts();
            showToast('All notifications marked as read', 'success');
        });
    }
}

/**
 * Initialize Clear All button
 */
function initClearAll() {
    const clearAllBtn = document.querySelector('.btn-clear');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all notifications?')) {
                const notifications = document.querySelectorAll('.notification-item');
                notifications.forEach((notification, index) => {
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateX(20px)';
                        notification.style.transition = 'all 0.3s ease';
                    }, index * 50);
                });
                
                setTimeout(() => {
                    document.querySelectorAll('.notification-item').forEach(n => n.remove());
                    checkEmptyGroups();
                    checkEmptyState();
                    showToast('All notifications cleared', 'info');
                }, notifications.length * 50 + 300);
            }
        });
    }
}

/**
 * Update filter count badges
 */
function updateFilterCounts() {
    const allCount = document.querySelectorAll('.notification-item').length;
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const ordersCount = document.querySelectorAll('.notification-item[data-type="order"]').length;
    const returnsCount = document.querySelectorAll('.notification-item[data-type="return"]').length;
    const systemCount = document.querySelectorAll('.notification-item[data-type="system"]').length;
    const alertsCount = document.querySelectorAll('.notification-item[data-type="alert"]').length;
    
    // Update count badges
    updateCountBadge('all', allCount);
    updateCountBadge('unread', unreadCount);
    updateCountBadge('orders', ordersCount);
    updateCountBadge('returns', returnsCount);
    updateCountBadge('system', systemCount);
    updateCountBadge('alerts', alertsCount);
}

/**
 * Update a specific count badge
 */
function updateCountBadge(filter, count) {
    const tab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
    if (tab) {
        const badge = tab.querySelector('.filter-count');
        if (badge) {
            badge.textContent = count;
            // Hide badge if count is 0
            badge.style.display = count === 0 ? 'none' : 'inline';
        }
    }
}

/**
 * Check and remove empty notification groups
 */
function checkEmptyGroups() {
    const groups = document.querySelectorAll('.notification-group');
    groups.forEach(group => {
        const items = group.querySelectorAll('.notification-item');
        if (items.length === 0) {
            group.remove();
        }
    });
}

/**
 * Check if we should show empty state
 */
function checkEmptyState() {
    const notificationsList = document.querySelector('.notifications-list');
    const emptyState = document.querySelector('.empty-state');
    const remainingNotifications = document.querySelectorAll('.notification-item');
    
    if (remainingNotifications.length === 0 && emptyState) {
        emptyState.style.display = 'flex';
        if (notificationsList) {
            notificationsList.style.display = 'none';
        }
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        padding: 12px 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

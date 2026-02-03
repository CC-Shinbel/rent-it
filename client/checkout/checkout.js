/**
 * RentIt - Checkout Page JavaScript
 * Manages checkout functionality and order confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inject shared components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'cart', 'client');
        Components.injectTopbar('topbarContainer', 'Checkout');
        Components.injectFooter('footerContainer');
    }

    // Initialize checkout functionality
    generateReceiptId();
    initDeliveryOptions();
    initPaymentOptions();
    initPromoCode();
    initConfirmOrder();
    loadCartData();
});

/**
 * Constants
 */
const DELIVERY_FEES = {
    standard: 150,
    express: 300,
    pickup: 0
};
const SERVICE_FEE = 50;

/**
 * Generate unique receipt ID
 */
function generateReceiptId() {
    const receiptIdEl = document.getElementById('receiptId');
    if (!receiptIdEl) return;
    
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    receiptIdEl.textContent = `RIT-${year}-${randomPart}`;
}

/**
 * Initialize delivery options
 */
function initDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected from all
            deliveryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to clicked
            option.classList.add('selected');
            option.querySelector('input').checked = true;
            
            // Update totals
            updateOrderSummary();
        });
    });
}

/**
 * Initialize payment options
 */
function initPaymentOptions() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected from all
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to clicked
            option.classList.add('selected');
            option.querySelector('input').checked = true;
        });
    });
}



/**
 * Initialize promo code functionality
 */
function initPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const applyBtn = document.getElementById('btnApplyPromo');
    
    if (!promoInput || !applyBtn) return;
    
    applyBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        
        if (!code) {
            showToast('Please enter a promo code', 'error');
            return;
        }
        
        // Sample promo codes
        const promoCodes = {
            'WELCOME10': 10,
            'RENTIT20': 20,
            'SAVE15': 15
        };
        
        if (promoCodes[code]) {
            const discount = promoCodes[code];
            applyDiscount(discount);
            promoInput.disabled = true;
            applyBtn.textContent = 'Applied';
            applyBtn.disabled = true;
            showToast(`Promo code applied! ${discount}% discount`, 'success');
        } else {
            showToast('Invalid promo code', 'error');
        }
    });
}


function applyDiscount(percentage) {
    const subtotalEl = document.getElementById('summarySubtotal');
    const discountRow = document.getElementById('discountRow');
    const discountEl = document.getElementById('summaryDiscount');
    
    if (!subtotalEl || !discountRow || !discountEl) return;
    
    const subtotal = parseFloat(subtotalEl.textContent.replace(/[₱,]/g, ''));
    const discountAmount = Math.round(subtotal * (percentage / 100));
    
    discountEl.textContent = `-₱${discountAmount.toLocaleString()}`;
    discountRow.style.display = 'flex';
    
    discountRow.dataset.discount = discountAmount;
    
    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotalEl = document.getElementById('summarySubtotal');
    const deliveryEl = document.getElementById('summaryDelivery');
    const totalEl = document.getElementById('summaryTotal');
    const discountRow = document.getElementById('discountRow');

    if (!subtotalEl || !deliveryEl || !totalEl) return;

    const subtotal = subtotalEl.dataset.value 
        ? parseFloat(subtotalEl.dataset.value) 
        : parseFloat(subtotalEl.textContent.replace(/[₱,]/g, ''));
    
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    const deliveryType = selectedDelivery ? selectedDelivery.value : 'standard';
    const deliveryFee = DELIVERY_FEES[deliveryType];

    deliveryEl.textContent = deliveryFee === 0 ? 'Free' : `₱${deliveryFee.toLocaleString()}`;

    let total = subtotal + deliveryFee + SERVICE_FEE;

    const discountAmount = parseFloat(discountRow.dataset.discount) || 0;
    if (discountRow.style.display !== 'none') {
        total -= discountAmount;
    }

    totalEl.textContent = `₱${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}


function initConfirmOrder() {
    const confirmBtn = document.getElementById('btnConfirmOrder');
    
    if (!confirmBtn) return;
    
    confirmBtn.addEventListener('click', () => {
        // Validate customer info
        const customerName = document.getElementById('customerName')?.textContent;
        const customerEmail = document.getElementById('customerEmail')?.textContent;
        
        if (!customerName || customerName === 'Not set' || !customerEmail || customerEmail === 'Not set') {
            showToast('Please complete your customer information', 'error');
            return;
        }
        
        // Show processing state
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
            </svg>
            Processing...
        `;
        
        // Simulate order processing
        setTimeout(() => {
            // Update receipt status
            const statusBadge = document.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Confirmed';
                statusBadge.classList.remove('pending');
                statusBadge.classList.add('confirmed');
            }
            
            // Update button
            confirmBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Order Confirmed!
            `;
            confirmBtn.style.background = 'var(--success-color, #22C55E)';
            confirmBtn.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
            
            // Clear cart from localStorage
            localStorage.removeItem('rentit_cart');
            
            showToast('Order placed successfully! You will receive a confirmation email.', 'success');
            
            // Redirect to rentals page after delay
            setTimeout(() => {
                window.location.href = '/client/myrentals/myrentals.html';
            }, 3000);
        }, 2000);
    });
}

/**
 * Load cart data from localStorage
 * In a real app, this would be passed from the cart page
 */
function loadCartData() {
    const cart = localStorage.getItem('rentit_cart');
    
    if (cart) {
        try {
            const cartItems = JSON.parse(cart);
            // In a real app, would dynamically render order items from cart data
            const itemCountEl = document.getElementById('itemCount');
            if (itemCountEl && cartItems.length > 0) {
                itemCountEl.textContent = `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`;
            }
        } catch (e) {
            console.error('Error loading cart data:', e);
        }
    }
    
    // Initialize summary
    updateOrderSummary();
}

/**
 * Toast notification helper
 */
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSvg = type === 'success' 
        ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    
    toast.innerHTML = `
        ${iconSvg}
        <span class="toast-message">${message}</span>
    `;
    
    // Add toast styles if not present
    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                transform: translateX(120%);
                transition: transform 0.3s ease;
            }
            .toast.show {
                transform: translateX(0);
            }
            .toast-icon {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
            }
            .toast-message {
                font-size: 0.9rem;
                color: var(--text-primary);
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

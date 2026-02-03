/**
 * RentIt - Cart Page JavaScript
 * Inayos para sa MySQL Database at UI Synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject components (Siguraduhing tama ang path ng components.js sa HTML)
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'cart', 'client');
        Components.injectTopbar('topbarContainer', 'My Cart');
    }

    // 2. Initialize functionalities
    initCartLogic();
});

const CONSTANTS = {
    DELIVERY_FEE: 150,
    SERVICE_FEE: 50,
    STORAGE_KEY: 'rentit_cart'
};

function initCartLogic() {
    const selectAll = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const checkoutBtn = document.getElementById('btnCheckout');
    const removeSelectedBtn = document.getElementById('btnRemoveSelected');

    // --- Calculation Logic ---
    function calculateTotal() {
        let subtotal = 0;
        let selectedCount = 0;

        document.querySelectorAll('.item-checkbox:checked').forEach(cb => {
            const card = cb.closest('.cart-item-card');
            if (card) {
                // Kunin ang subtotal text ng bawat card
                const itemSubtotalText = card.querySelector('.cart-item-subtotal').textContent;
                const itemSubtotal = parseFloat(itemSubtotalText.replace(/[₱,]/g, ''));
                subtotal += itemSubtotal;
                selectedCount++;
            }
        });

        // Update Summary Display
        document.getElementById('cartSubtotal').textContent = `₱${subtotal.toLocaleString()}`;
        
        if (selectedCount > 0) {
            const total = subtotal + CONSTANTS.DELIVERY_FEE + CONSTANTS.SERVICE_FEE;
            document.getElementById('cartTotal').textContent = `₱${total.toLocaleString()}`;
            if (checkoutBtn) checkoutBtn.disabled = false;
            if (removeSelectedBtn) {
                removeSelectedBtn.disabled = false;
                removeSelectedBtn.classList.add('active');
                removeSelectedBtn.querySelector('span').textContent = `Remove Selected (${selectedCount})`;
            }
        } else {
            document.getElementById('cartTotal').textContent = `₱0`;
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (removeSelectedBtn) {
                removeSelectedBtn.disabled = true;
                removeSelectedBtn.classList.remove('active');
                removeSelectedBtn.querySelector('span').textContent = `Remove Selected`;
            }
        }
    }

    // --- Date & Subtotal Logic ---
    window.updateItemTotal = function(id) {
        const startInput = document.getElementById(`start-${id}`);
        const endInput = document.getElementById(`end-${id}`);
        const daysDisplay = document.getElementById(`days-${id}`);
        const subtotalDisplay = document.getElementById(`subtotal-${id}`);
        const card = document.getElementById(`card-${id}`);

        if (!startInput || !endInput) return;

        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        const pricePerDay = parseFloat(card.dataset.price);

        if (end < start) {
            endInput.value = startInput.value;
            alert("End date cannot be earlier than start date.");
            return;
        }

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        daysDisplay.textContent = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        const total = pricePerDay * diffDays;
        subtotalDisplay.textContent = `₱${total.toLocaleString()}`;

        calculateTotal();
    };

    // --- Delete Logic (PHP Integration) ---
    async function deleteItems(ids) {
        try {
            const formData = new FormData();
            formData.append('delete_ids', JSON.stringify(ids));

            // Siguraduhing may delete_cart_items.php ka sa folder
            const response = await fetch('delete_to_cart.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                ids.forEach(id => {
                    const el = document.getElementById(`card-${id}`);
                    if (el) el.remove();
                });
                calculateTotal();
                showToast('Items removed successfully', 'success');
                
                // Kung wala ng item, reload para ipakita ang "Empty Cart" div
                if (document.querySelectorAll('.cart-item-card').length === 0) {
                    location.reload();
                }
            }
        } catch (error) {
            console.error("Error deleting items:", error);
            showToast('Failed to delete items from database', 'error');
        }
    }

    // --- Event Listeners ---
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            itemCheckboxes.forEach(cb => {
                cb.checked = this.checked;
                cb.closest('.cart-item-card').classList.toggle('selected', this.checked);
            });
            calculateTotal();
        });
    }

    itemCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            this.closest('.cart-item-card').classList.toggle('selected', this.checked);
            calculateTotal();
        });
    });

    if (removeSelectedBtn) {
        removeSelectedBtn.addEventListener('click', () => {
            const selected = Array.from(document.querySelectorAll('.item-checkbox:checked'))
                                 .map(cb => cb.dataset.id);
            if (selected.length > 0 && confirm(`Remove ${selected.length} item(s)?`)) {
                deleteItems(selected);
            }
        });
    }

    // --- Proceed to Checkout ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const selectedData = [];
            document.querySelectorAll('.item-checkbox:checked').forEach(cb => {
                const id = cb.dataset.id;
                const card = document.getElementById(`card-${id}`);
                selectedData.push({
                    id: id,
                    name: card.querySelector('.cart-item-name').textContent,
                    price: parseFloat(card.dataset.price),
                    days: parseInt(document.getElementById(`days-${id}`).textContent),
                    startDate: document.getElementById(`start-${id}`).value,
                    endDate: document.getElementById(`end-${id}`).value
                });
            });

            // I-save sa localStorage para sa checkout.php
            localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(selectedData));
            window.location.href = '../checkout/checkout.php';
        });
    }

    calculateTotal(); // Run once on load
}

// Toast Helper (Para sa visual feedback)
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '15px';
    toast.style.background = type === 'success' ? '#22C55E' : '#EF4444';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
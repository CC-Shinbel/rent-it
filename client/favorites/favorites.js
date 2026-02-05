/**
 * Favorites Page JavaScript
 * Handles favorites management - Database integrated
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'favorites', 'client');
        Components.injectTopbar('topbarContainer', 'My Favorites');
        Components.injectFooter('footerContainer');
    }

    initFavorites();
});

/**
 * Initialize favorites functionality
 */
function initFavorites() {
    // Attach listeners to buttons rendered by PHP
    attachRemoveListeners();
    attachMoveToCartListeners();

    // Initial count check
    updateFavoritesCount();
}

/**
 * Attach remove button listeners
 */
function attachRemoveListeners() {
    document.querySelectorAll('.btn-remove-favorite').forEach(btn => {
        btn.onclick = (e) => {
            const card = btn.closest('.favorite-card');
            const itemId = card.dataset.id;
            removeFavorite(itemId);
        };
    });
}

/**
 * Remove item from favorites via Database
 */
function removeFavorite(itemId) {
    if(confirm('Remove this from your favorites?')) {
        fetch('/rent-it/client/favorites/remove_favorite.php',
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'item_id=' + itemId
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                const card = document.querySelector(`.favorite-card[data-id="${itemId}"]`);
                if(card) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    card.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        card.remove();
                        updateFavoritesCount();
                        checkEmptyState();
                    }, 300);
                }
                showToast('Item removed from favorites', 'info');
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(err => console.error("Fetch Error:", err));
    }
}

/**
 * Attach move to cart button listeners
 */
function attachMoveToCartListeners() {
    document.querySelectorAll('.btn-move-to-cart').forEach(btn => {
        btn.onclick = (e) => {
            const card = btn.closest('.favorite-card');
            const itemId = card.dataset.id;
            moveToCart(itemId);
        };
    });
}

/**
 * Move item from favorites to cart
 */
function moveToCart(itemId) {
    let cart = getCart();
    if (!cart.find(item => item.id === itemId)) {
        cart.push({ id: itemId, quantity: 1 });
        saveCart(cart);
    }
    
    removeFavorite(itemId);
    
    showToast('Item moved to cart!', 'success');
}

/**
 * Cart Helpers (LocalStorage)
 */
function getCart() {
    const stored = localStorage.getItem('rentit_cart');
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem('rentit_cart', JSON.stringify(cart));
}

/**
 * UI State Helpers
 */
function updateFavoritesCount() {
    const countEl = document.getElementById('favoritesCount');
    const cards = document.querySelectorAll('.favorite-card');
    if (countEl) {
        countEl.textContent = cards.length;
    }
}

function checkEmptyState() {
    const cards = document.querySelectorAll('.favorite-card');
    if (cards.length === 0) {
        const grid = document.getElementById('favoritesGrid');
        const emptyState = document.getElementById('emptyFavorites');
        if (grid) grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    }
}


function addToCart(itemId) {
    const formData = new FormData();
    formData.append('item_id', itemId);

    fetch('../../api/cart/add_to_cart.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "Success") {
            alert("Added to cart!");
        } else {
            alert(data);
        }
    });
}
/**
 * Toast System
 */
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 14px 24px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
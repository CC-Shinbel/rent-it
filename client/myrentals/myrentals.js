/* =====================================================
   MY RENTALS PAGE JAVASCRIPT
   RentIt - Client Portal
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components using Components module
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'myrentals', 'client');
        Components.injectTopbar('topbarContainer', 'My Rentals');
        Components.injectFooter('footerContainer');
    }
    
    initRentalActions();
});

/**
 * Initialize rental card actions
 */
function initRentalActions() {
    // Extend buttons
    document.querySelectorAll('.btn-extend').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.rental-card');
            const title = card.querySelector('.card-title')?.textContent || 'Rental';
            
            // Show extension modal (placeholder)
            alert(`Extend rental: ${title}\n\nThis would open an extension form.`);
        });
    });

    // Return buttons
    document.querySelectorAll('.btn-return').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.rental-card');
            const title = card.querySelector('.card-title')?.textContent || 'Rental';
            
            // Show return confirmation (placeholder)
            if (confirm(`Request return for: ${title}?\n\nOur team will contact you to schedule pickup.`)) {
                alert('Return request submitted! We\'ll contact you within 24 hours.');
            }
        });
    });

    // Receipt download buttons
    document.querySelectorAll('.action-btn:not(.action-muted)').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.textContent.includes('Receipt')) {
                e.preventDefault();
                alert('Downloading receipt...\n\nThis would download the PDF receipt.');
            }
        });
    });
}

/**
 * Update active rentals count
 */
function updateActiveRentalsCount() {
    const cards = document.querySelectorAll('.rental-card');
    const badge = document.getElementById('unitsBadge');
    
    if (badge) {
        const count = cards.length;
        badge.textContent = `${count} Unit${count !== 1 ? 's' : ''} Active`;
    }
}

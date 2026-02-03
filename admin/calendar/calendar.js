/**
 * =====================================================
 * CALENDAR MASTER VIEW - JavaScript
 * Interactive calendar functionality
 * ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin components
    AdminComponents.initPage('calendar');
    
    // Initialize calendar functionality
    CalendarManager.init();
});

const CalendarManager = {
    currentDate: new Date(2026, 0, 15), // Start at Jan 15, 2026
    
    /**
     * Initialize calendar
     */
    init() {
        this.bindEvents();
        this.updateDateRange();
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation
        document.getElementById('prevWeekBtn')?.addEventListener('click', () => this.navigateWeek(-1));
        document.getElementById('nextWeekBtn')?.addEventListener('click', () => this.navigateWeek(1));
        document.getElementById('todayBtn')?.addEventListener('click', () => this.goToToday());
        
        // Filters
        document.getElementById('assetTypeFilter')?.addEventListener('change', (e) => this.filterByAssetType(e.target.value));
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.filterByStatus(e.target.value));
        
        // Booking blocks
        document.querySelectorAll('.booking-block.booked').forEach(block => {
            block.addEventListener('click', (e) => this.showBookingDetails(e.target.closest('.booking-block')));
        });
        
        // Modal
        document.getElementById('closeBookingModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBookingModalBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('bookingModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'bookingModal') this.closeModal();
        });
        
        // New booking button
        document.getElementById('newBookingBtn')?.addEventListener('click', () => this.showNewBookingModal());
        
        // Edit booking
        document.getElementById('editBookingBtn')?.addEventListener('click', () => {
            AdminComponents.showToast('Edit functionality would open booking form', 'info');
            this.closeModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft' && e.altKey) this.navigateWeek(-1);
            if (e.key === 'ArrowRight' && e.altKey) this.navigateWeek(1);
        });
    },
    
    /**
     * Navigate weeks
     */
    navigateWeek(direction) {
        const days = direction * 7;
        this.currentDate.setDate(this.currentDate.getDate() + days);
        this.updateDateRange();
        AdminComponents.showToast(`Viewing week of ${this.formatDate(this.currentDate)}`, 'info');
    },
    
    /**
     * Go to current week
     */
    goToToday() {
        this.currentDate = new Date();
        this.updateDateRange();
        AdminComponents.showToast('Jumped to current week', 'info');
    },
    
    /**
     * Update date range label
     */
    updateDateRange() {
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 5); // Saturday
        
        const label = document.getElementById('dateRangeLabel');
        if (label) {
            label.textContent = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
        }
    },
    
    /**
     * Format date
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    
    /**
     * Filter by asset type
     */
    filterByAssetType(type) {
        const rows = document.querySelectorAll('.calendar-grid tbody tr');
        rows.forEach(row => {
            if (type === 'all' || row.dataset.type === type) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        AdminComponents.showToast(`Filtered by: ${type === 'all' ? 'All types' : type}`, 'info');
    },
    
    /**
     * Filter by status
     */
    filterByStatus(status) {
        // This would filter the visible blocks
        // For demo, just show a toast
        AdminComponents.showToast(`Filter applied: ${status === 'all' ? 'All statuses' : status}`, 'info');
    },
    
    /**
     * Show booking details modal
     */
    showBookingDetails(block) {
        if (!block) return;
        
        const bookingId = block.dataset.bookingId;
        const modal = document.getElementById('bookingModal');
        
        // Mock data - in real app, fetch from backend
        const mockBookings = {
            'B001': { customer: 'John Smith', event: 'Birthday Party', equipment: 'KRK-001 Pro System', duration: 'Jan 15-16, 2026 (2 days)', status: 'Booked', total: '₱3,500.00' },
            'B002': { customer: 'Sarah Johnson', event: 'Corporate Event', equipment: 'KRK-002 Premium', duration: 'Jan 16-19, 2026 (4 days)', status: 'Booked', total: '₱8,000.00' },
            'B003': { customer: 'Mike Davis', event: 'Wedding Reception', equipment: 'KRK-004 Deluxe', duration: 'Jan 17-18, 2026 (2 days)', status: 'Booked', total: '₱5,000.00' },
            'B004': { customer: 'Emily White', event: 'House Party', equipment: 'SPK-001 Speaker Set', duration: 'Jan 16-17, 2026 (2 days)', status: 'Booked', total: '₱2,500.00' },
            'B005': { customer: 'Sarah Johnson', event: 'Package Deal', equipment: 'MIC-001 Wireless', duration: 'Jan 15-18, 2026 (4 days)', status: 'Booked', total: '₱1,500.00' },
            'B006': { customer: 'Tom Brown', event: 'Karaoke Night', equipment: 'MIC-002 Wired Set', duration: 'Jan 17-19, 2026 (3 days)', status: 'Booked', total: '₱1,200.00' },
        };
        
        const booking = mockBookings[bookingId] || mockBookings['B001'];
        
        // Populate modal
        document.getElementById('modalCustomer').textContent = booking.customer;
        document.getElementById('modalEvent').textContent = booking.event;
        document.getElementById('modalEquipment').textContent = booking.equipment;
        document.getElementById('modalDuration').textContent = booking.duration;
        document.getElementById('modalStatus').textContent = booking.status;
        document.getElementById('modalTotal').textContent = booking.total;
        
        // Show modal
        modal?.classList.add('open');
    },
    
    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('bookingModal')?.classList.remove('open');
    },
    
    /**
     * Show new booking modal
     */
    showNewBookingModal() {
        AdminComponents.showModal({
            title: 'New Booking',
            content: `
                <form class="new-booking-form">
                    <div class="form-group">
                        <label class="form-label">Customer Name</label>
                        <input type="text" class="form-input" placeholder="Enter customer name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Equipment</label>
                        <select class="form-select" required>
                            <option value="">Select equipment</option>
                            <option value="KRK-001">KRK-001 Pro System</option>
                            <option value="KRK-002">KRK-002 Premium</option>
                            <option value="KRK-003">KRK-003 Standard</option>
                            <option value="KRK-004">KRK-004 Deluxe</option>
                            <option value="SPK-001">SPK-001 Speaker Set</option>
                            <option value="MIC-001">MIC-001 Wireless</option>
                            <option value="MIC-002">MIC-002 Wired Set</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Event Type</label>
                        <input type="text" class="form-input" placeholder="e.g., Birthday, Wedding">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-input" required>
                    </div>
                </form>
            `,
            confirmText: 'Create Booking',
            cancelText: 'Cancel',
            onConfirm: () => {
                AdminComponents.showToast('Booking created successfully!', 'success');
            }
        });
    }
};

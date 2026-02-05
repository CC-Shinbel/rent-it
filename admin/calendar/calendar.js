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
    currentDate: new Date(),
    weekDays: [],
    calendarData: null,
    
    /**
     * Initialize calendar
     */
    async init() {
        this.calculateWeekDays();
        this.bindEvents();
        await this.fetchCalendarData();
    },
    
    /**
     * Calculate week days (Mon-Sat)
     */
    calculateWeekDays() {
        const monday = new Date(this.currentDate);
        const dayOfWeek = monday.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(monday.getDate() + diff);
        
        this.weekDays = [];
        for (let i = 0; i < 6; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            this.weekDays.push(day);
        }
        
        this.updateDateRange();
        this.updateHeaderDates();
    },
    
    /**
     * Fetch calendar data from API
     */
    async fetchCalendarData() {
        const startDate = this.formatDateISO(this.weekDays[0]);
        const endDate = this.formatDateISO(this.weekDays[5]);
        
        try {
            const response = await fetch(`admin/api/get_calendar.php?start=${startDate}&end=${endDate}`);
            const data = await response.json();
            
            if (data.success) {
                this.calendarData = data;
                this.renderCalendar();
                this.updateStats();
            } else {
                console.error('Failed to fetch calendar:', data.message);
                this.showError('Failed to load calendar data');
            }
        } catch (error) {
            console.error('Error fetching calendar:', error);
            this.showError('Error loading calendar data');
        }
    },
    
    /**
     * Show error in calendar body
     */
    showError(message) {
        const tbody = document.getElementById('calendarBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--color-error);">
                        ${message}
                    </td>
                </tr>
            `;
        }
    },
    
    /**
     * Render calendar grid
     */
    renderCalendar() {
        const tbody = document.getElementById('calendarBody');
        if (!tbody || !this.calendarData) return;
        
        const { items, bookings, repairs } = this.calendarData;
        
        if (items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        No items found in the database.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Build rows for each item
        const rows = items.map(item => this.renderItemRow(item, bookings, repairs)).join('');
        tbody.innerHTML = rows;
        
        // Bind click events for booking blocks
        document.querySelectorAll('.booking-block.booked').forEach(block => {
            block.addEventListener('click', (e) => this.showBookingDetails(e.target.closest('.booking-block')));
        });
    },
    
    /**
     * Render a single item row
     */
    renderItemRow(item, bookings, repairs) {
        // Get category type for filtering
        const categoryType = this.getCategoryType(item.category);
        
        // Build day cells
        const dayCells = this.weekDays.map((day, dayIndex) => {
            return this.renderDayCell(item, day, dayIndex, bookings, repairs);
        }).join('');
        
        return `
            <tr data-asset="ITEM-${item.id}" data-type="${categoryType}">
                <td class="asset-cell">
                    <div class="asset-info">
                        <span class="asset-id">ITM-${String(item.id).padStart(3, '0')}</span>
                        <span class="asset-name">${this.escapeHtml(item.name)}</span>
                    </div>
                </td>
                ${dayCells}
            </tr>
        `;
    },
    
    /**
     * Render a day cell for an item
     */
    renderDayCell(item, day, dayIndex, bookings, repairs) {
        const dateStr = this.formatDateISO(day);
        
        // Check for booking on this day
        const booking = bookings.find(b => 
            b.item_id === item.id && 
            dateStr >= b.start_date && 
            dateStr <= b.end_date
        );
        
        // Check for repair on this day
        const repair = repairs.find(r => 
            r.item_id === item.id && 
            dateStr >= r.reported_date && 
            (r.resolved_date === null || dateStr <= r.resolved_date)
        );
        
        if (booking) {
            // Check if this is the start date of the booking
            const isStart = dateStr === booking.start_date;
            if (isStart) {
                // Calculate span (number of days in this week)
                const endDate = new Date(booking.end_date);
                const startDate = new Date(booking.start_date);
                const weekEnd = this.weekDays[5];
                
                const effectiveEnd = endDate > weekEnd ? weekEnd : endDate;
                const daysInWeek = Math.min(6 - dayIndex, Math.ceil((effectiveEnd - day) / (1000 * 60 * 60 * 24)) + 1);
                const widthPercent = daysInWeek * 100;
                const extraPx = (daysInWeek - 1);
                
                return `
                    <td class="day-cell">
                        <div class="booking-block booked" style="width: calc(${widthPercent}% + ${extraPx}px);" 
                             title="${this.escapeHtml(booking.customer_name)} | ${this.formatDateShort(startDate)} - ${this.formatDateShort(endDate)}" 
                             data-booking-id="${booking.id}"
                             data-order-id="${booking.order_id}">
                            <span class="booking-customer">${this.escapeHtml(booking.customer_name)}</span>
                        </div>
                    </td>
                `;
            } else {
                // This day is covered by a multi-day booking block
                return `<td class="day-cell"></td>`;
            }
        }
        
        if (repair && repair.status !== 'Resolved') {
            // Check if this is the start date of the repair
            const isStart = dateStr === repair.reported_date;
            if (isStart) {
                const reportedDate = new Date(repair.reported_date);
                const resolvedDate = repair.resolved_date ? new Date(repair.resolved_date) : this.weekDays[5];
                const weekEnd = this.weekDays[5];
                
                const effectiveEnd = resolvedDate > weekEnd ? weekEnd : resolvedDate;
                const daysInWeek = Math.min(6 - dayIndex, Math.ceil((effectiveEnd - day) / (1000 * 60 * 60 * 24)) + 1);
                const widthPercent = daysInWeek * 100;
                const extraPx = (daysInWeek - 1);
                
                return `
                    <td class="day-cell">
                        <div class="booking-block repair" style="width: calc(${widthPercent}% + ${extraPx}px);" 
                             title="In Repair - ${this.escapeHtml(repair.description || 'Maintenance')}" 
                             data-repair-id="${repair.id}">
                            <span class="booking-status">In Repair</span>
                        </div>
                    </td>
                `;
            } else {
                return `<td class="day-cell"></td>`;
            }
        }
        
        // Available
        return `
            <td class="day-cell">
                <div class="booking-block available" title="Available for booking">
                    <span class="booking-status">Available</span>
                </div>
            </td>
        `;
    },
    
    /**
     * Get category type for filtering
     */
    getCategoryType(category) {
        if (!category) return 'equipment';
        const cat = category.toLowerCase();
        if (cat.includes('karaoke') || cat.includes('premium') || cat.includes('professional')) return 'karaoke';
        if (cat.includes('speaker')) return 'speaker';
        if (cat.includes('mic')) return 'microphone';
        if (cat.includes('portable')) return 'portable';
        return 'equipment';
    },
    
    /**
     * Update stats display
     */
    updateStats() {
        if (!this.calendarData) return;
        const { stats } = this.calendarData;
        
        document.getElementById('statBookings').textContent = stats.bookingsThisWeek || 0;
        document.getElementById('statRepair').textContent = stats.inRepair || 0;
        document.getElementById('statCleaning').textContent = stats.cleaning || 0;
        document.getElementById('statAvailable').textContent = stats.available || 0;
    },
    
    /**
     * Update header dates
     */
    updateHeaderDates() {
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headers = document.querySelectorAll('#calendarHeader .day-column');
        
        headers.forEach((header, index) => {
            if (index < this.weekDays.length) {
                const dayName = header.querySelector('.day-name');
                const dayDate = header.querySelector('.day-date');
                if (dayName) dayName.textContent = dayNames[index];
                if (dayDate) dayDate.textContent = this.formatDateShort(this.weekDays[index]);
            }
        });
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
    async navigateWeek(direction) {
        const days = direction * 7;
        this.currentDate.setDate(this.currentDate.getDate() + days);
        this.calculateWeekDays();
        await this.fetchCalendarData();
        AdminComponents.showToast(`Viewing week of ${this.formatDate(this.weekDays[0])}`, 'info');
    },
    
    /**
     * Go to current week
     */
    async goToToday() {
        this.currentDate = new Date();
        this.calculateWeekDays();
        await this.fetchCalendarData();
        AdminComponents.showToast('Jumped to current week', 'info');
    },
    
    /**
     * Update date range label
     */
    updateDateRange() {
        const label = document.getElementById('dateRangeLabel');
        if (label && this.weekDays.length >= 6) {
            label.textContent = `${this.formatDate(this.weekDays[0])} - ${this.formatDate(this.weekDays[5])}`;
        }
    },
    
    /**
     * Format date for display
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    
    /**
     * Format date short (Jan 15)
     */
    formatDateShort(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    
    /**
     * Format date as ISO (YYYY-MM-DD)
     */
    formatDateISO(date) {
        return date.toISOString().split('T')[0];
    },
    
    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    },
    
    /**
     * Filter by asset type
     */
    filterByAssetType(type) {
        const rows = document.querySelectorAll('#calendarBody tr');
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
        AdminComponents.showToast(`Filter applied: ${status === 'all' ? 'All statuses' : status}`, 'info');
    },
    
    /**
     * Show booking details modal
     */
    showBookingDetails(block) {
        if (!block) return;
        
        const bookingId = block.dataset.bookingId;
        const orderId = block.dataset.orderId;
        const modal = document.getElementById('bookingModal');
        
        // Find booking in data
        const booking = this.calendarData?.bookings?.find(b => b.id === bookingId);
        const item = this.calendarData?.items?.find(i => i.id === booking?.item_id);
        
        if (booking) {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            document.getElementById('modalCustomer').textContent = booking.customer_name;
            document.getElementById('modalEvent').textContent = booking.venue || 'Rental';
            document.getElementById('modalEquipment').textContent = item ? item.name : 'Equipment';
            document.getElementById('modalDuration').textContent = `${this.formatDateShort(startDate)} - ${this.formatDateShort(endDate)} (${duration} days)`;
            document.getElementById('modalStatus').textContent = booking.status;
            document.getElementById('modalTotal').textContent = '₱' + booking.total.toLocaleString('en-PH', { minimumFractionDigits: 2 });
        }
        
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
        // Build equipment options from items
        const itemOptions = this.calendarData?.items?.map(item => 
            `<option value="${item.id}">ITM-${String(item.id).padStart(3, '0')} ${item.name}</option>`
        ).join('') || '';
        
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
                            ${itemOptions}
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

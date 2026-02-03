/**
 * =====================================================
 * REPAIRS MANAGEMENT - JavaScript
 * Interactive repairs functionality
 * ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin components
    AdminComponents.initPage('repairs');
    
    // Initialize repairs functionality
    RepairsManager.init();
});

const RepairsManager = {
    /**
     * Initialize repairs manager
     */
    init() {
        this.bindEvents();
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search
        document.getElementById('searchRepairs')?.addEventListener('input', (e) => this.searchRepairs(e.target.value));
        
        // Filters
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.filterByStatus(e.target.value));
        document.getElementById('priorityFilter')?.addEventListener('change', (e) => this.filterByPriority(e.target.value));
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => this.filterByCategory(e.target.value));
        
        // New repair button
        document.getElementById('newRepairBtn')?.addEventListener('click', () => this.showNewRepairModal());
        
        // Export button
        document.getElementById('exportRepairsBtn')?.addEventListener('click', () => this.exportRepairs());
        
        // Table action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const row = e.currentTarget.closest('tr');
                const ticketId = row?.dataset.ticket;
                this.handleAction(action, ticketId, row);
            });
        });
        
        // Modal close
        document.getElementById('closeRepairModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelRepairModalBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('repairModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        
        // Edit repair button
        document.getElementById('editRepairBtn')?.addEventListener('click', () => {
            AdminComponents.showToast('Edit functionality would open repair form', 'info');
            this.closeModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
        
        // Pagination
        document.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AdminComponents.showToast('Page navigation (demo)', 'info');
            });
        });
    },
    
    /**
     * Search repairs
     */
    searchRepairs(query) {
        const rows = document.querySelectorAll('#repairsTableBody tr');
        const searchTerm = query.toLowerCase().trim();
        
        rows.forEach(row => {
            const ticketId = row.dataset.ticket?.toLowerCase() || '';
            const equipmentName = row.querySelector('.equipment-name')?.textContent.toLowerCase() || '';
            
            if (searchTerm === '' || ticketId.includes(searchTerm) || equipmentName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },
    
    /**
     * Filter by status
     */
    filterByStatus(status) {
        const rows = document.querySelectorAll('#repairsTableBody tr');
        
        rows.forEach(row => {
            if (status === 'all' || row.dataset.status === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        AdminComponents.showToast(`Filtered by: ${status === 'all' ? 'All statuses' : status}`, 'info');
    },
    
    /**
     * Filter by priority
     */
    filterByPriority(priority) {
        const rows = document.querySelectorAll('#repairsTableBody tr');
        
        rows.forEach(row => {
            if (priority === 'all' || row.dataset.priority === priority) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        AdminComponents.showToast(`Filtered by: ${priority === 'all' ? 'All priorities' : priority + ' priority'}`, 'info');
    },
    
    /**
     * Filter by category
     */
    filterByCategory(category) {
        // Demo - would filter by category attribute
        AdminComponents.showToast(`Category filter: ${category === 'all' ? 'All categories' : category}`, 'info');
    },
    
    /**
     * Handle table action
     */
    handleAction(action, ticketId, row) {
        switch (action) {
            case 'view':
                this.showRepairDetails(ticketId);
                break;
            case 'edit':
                this.editRepair(ticketId);
                break;
            case 'complete':
                this.markComplete(ticketId, row);
                break;
            case 'available':
                this.makeAvailable(ticketId, row);
                break;
            case 'parts':
                this.trackParts(ticketId);
                break;
            case 'remove':
                this.confirmRemove(ticketId, row);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    },
    
    /**
     * Show repair details
     */
    showRepairDetails(ticketId) {
        // Mock data - in real app, fetch from backend
        const mockData = {
            'RPR-001': {
                ticketId: 'RPR-001',
                equipment: 'KRK-001 Pro System',
                category: 'Karaoke System',
                serial: 'KRK-2024-001',
                status: 'In Progress',
                priority: 'High',
                technician: 'Mike Rodriguez',
                cost: '₱2,500',
                description: 'Audio distortion detected during quality check after last rental. Customer reported crackling sound at higher volumes. Suspected amplifier board issue requiring component-level diagnosis.'
            },
            'RPR-002': {
                ticketId: 'RPR-002',
                equipment: 'SPK-003 Subwoofer',
                category: 'Speakers',
                serial: 'SPK-2023-003',
                status: 'Awaiting Parts',
                priority: 'Medium',
                technician: 'John Santos',
                cost: '₱4,500',
                description: 'Woofer cone damage from overdriving. Replacement 12" woofer driver ordered from supplier. Expected delivery in 2 weeks.'
            },
            'RPR-004': {
                ticketId: 'RPR-004',
                equipment: 'KRK-005 Basic Set',
                category: 'Karaoke System',
                serial: 'KRK-2022-005',
                status: 'To Be Removed',
                priority: 'High',
                technician: 'Tech Team',
                cost: '₱15,000+',
                description: 'Multiple component failures: amplifier board, display screen, and power supply. Repair cost exceeds 70% of replacement value. Recommended for catalog removal and parts salvage.'
            }
        };
        
        const data = mockData[ticketId] || mockData['RPR-001'];
        
        // Populate modal
        document.getElementById('modalTicketId').textContent = data.ticketId;
        document.getElementById('modalEquipment').textContent = data.equipment;
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalSerial').textContent = data.serial;
        document.getElementById('modalTechnician').textContent = data.technician;
        document.getElementById('modalCost').textContent = data.cost;
        document.getElementById('modalDescription').textContent = data.description;
        
        // Update status badge
        const statusBadge = document.getElementById('modalStatus');
        statusBadge.textContent = data.status;
        statusBadge.className = 'status-badge ' + data.status.toLowerCase().replace(/\s+/g, '-');
        
        // Update priority badge
        const priorityBadge = document.getElementById('modalPriority');
        priorityBadge.textContent = data.priority;
        priorityBadge.className = 'priority-badge ' + data.priority.toLowerCase();
        
        // Show modal
        document.getElementById('repairModal')?.classList.add('open');
    },
    
    /**
     * Edit repair
     */
    editRepair(ticketId) {
        AdminComponents.showToast(`Editing repair ${ticketId}...`, 'info');
    },
    
    /**
     * Mark repair as complete
     */
    markComplete(ticketId, row) {
        AdminComponents.showModal({
            title: 'Mark Repair Complete',
            content: `
                <p>Are you sure you want to mark <strong>${ticketId}</strong> as completed?</p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label">Actual Cost (₱)</label>
                    <input type="number" class="form-input" id="actualCostInput" placeholder="Enter actual repair cost">
                </div>
                <div class="form-group">
                    <label class="form-label">Completion Notes</label>
                    <textarea class="form-input" id="completionNotes" rows="3" placeholder="Enter any notes about the repair"></textarea>
                </div>
            `,
            confirmText: 'Mark Complete',
            cancelText: 'Cancel',
            onConfirm: () => {
                // Update row status
                const statusBadge = row.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = 'Completed';
                    statusBadge.className = 'status-badge completed';
                }
                row.dataset.status = 'completed';
                
                AdminComponents.showToast(`${ticketId} marked as completed!`, 'success');
            }
        });
    },
    
    /**
     * Make equipment available
     */
    makeAvailable(ticketId, row) {
        AdminComponents.showModal({
            title: 'Make Available for Rental',
            content: `
                <p>This will return <strong>${ticketId}</strong> to the rental catalog.</p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label">Quality Check Status</label>
                    <select class="form-select" id="qualityStatus" style="width: 100%;">
                        <option value="passed">Passed - Ready for rental</option>
                        <option value="limited">Limited - Minor issues noted</option>
                    </select>
                </div>
            `,
            confirmText: 'Make Available',
            cancelText: 'Cancel',
            onConfirm: () => {
                // Remove row from table (demo)
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                }, 500);
                
                AdminComponents.showToast('Equipment returned to catalog and available for rental!', 'success');
            }
        });
    },
    
    /**
     * Track parts order
     */
    trackParts(ticketId) {
        AdminComponents.showModal({
            title: 'Parts Order Tracking',
            content: `
                <div class="parts-tracking">
                    <div class="tracking-info" style="margin-bottom: 1rem;">
                        <p><strong>Order ID:</strong> PO-2026-0158</p>
                        <p><strong>Supplier:</strong> AudioParts Philippines</p>
                        <p><strong>Items:</strong> 12" Woofer Driver (x1)</p>
                    </div>
                    <div class="tracking-timeline">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="width: 10px; height: 10px; background: #22C55E; border-radius: 50%;"></span>
                            <span>Order placed - Jan 8, 2026</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="width: 10px; height: 10px; background: #22C55E; border-radius: 50%;"></span>
                            <span>Processing confirmed - Jan 9, 2026</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="width: 10px; height: 10px; background: var(--admin-orange-500); border-radius: 50%; animation: pulse 2s infinite;"></span>
                            <span>In transit - ETA Jan 22, 2026</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; opacity: 0.5;">
                            <span style="width: 10px; height: 10px; background: var(--admin-border-color); border-radius: 50%;"></span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>
            `,
            confirmText: 'Update Tracking',
            cancelText: 'Close',
            onConfirm: () => {
                AdminComponents.showToast('Parts tracking info updated', 'info');
            }
        });
    },
    
    /**
     * Confirm removal from catalog
     */
    confirmRemove(ticketId, row) {
        AdminComponents.showModal({
            title: 'Remove from Catalog',
            content: `
                <div style="color: #EF4444; margin-bottom: 1rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; display: block; margin: 0 auto 0.5rem;">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <p style="text-align: center;"><strong>This action cannot be undone.</strong></p>
                <p style="text-align: center; margin-top: 0.5rem;">The equipment associated with <strong>${ticketId}</strong> will be permanently removed from the rental catalog.</p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label">Removal Reason</label>
                    <select class="form-select" id="removalReason" style="width: 100%;">
                        <option value="unrepairable">Unrepairable - Beyond economic repair</option>
                        <option value="obsolete">Obsolete - No longer meets standards</option>
                        <option value="damaged">Severely Damaged - Write-off</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Salvage Parts?</label>
                    <select class="form-select" id="salvageParts" style="width: 100%;">
                        <option value="yes">Yes - Salvage usable components</option>
                        <option value="no">No - Dispose completely</option>
                    </select>
                </div>
            `,
            confirmText: 'Remove Equipment',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: () => {
                // Remove row
                row.style.opacity = '0.5';
                row.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    row.remove();
                }, 300);
                
                AdminComponents.showToast('Equipment removed from catalog', 'warning');
            }
        });
    },
    
    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('repairModal')?.classList.remove('open');
    },
    
    /**
     * Show new repair modal
     */
    showNewRepairModal() {
        AdminComponents.showModal({
            title: 'New Repair Ticket',
            content: `
                <form class="new-repair-form">
                    <div class="form-group">
                        <label class="form-label">Equipment *</label>
                        <select class="form-select" id="equipmentSelect" required style="width: 100%;">
                            <option value="">Select equipment</option>
                            <option value="KRK-001">KRK-001 Pro System</option>
                            <option value="KRK-002">KRK-002 Premium</option>
                            <option value="KRK-003">KRK-003 Standard</option>
                            <option value="SPK-001">SPK-001 Speaker Set</option>
                            <option value="SPK-002">SPK-002 Subwoofer</option>
                            <option value="MIC-001">MIC-001 Wireless</option>
                            <option value="LGT-001">LGT-001 LED Par Set</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Issue Type *</label>
                        <input type="text" class="form-input" id="issueType" placeholder="e.g., Audio Distortion, Power Failure" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority *</label>
                        <select class="form-select" id="prioritySelect" required style="width: 100%;">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Assign To</label>
                        <select class="form-select" id="technicianSelect" style="width: 100%;">
                            <option value="">Unassigned</option>
                            <option value="mike">Mike Rodriguez</option>
                            <option value="john">John Santos</option>
                            <option value="external">External Technician</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Estimated Cost (₱)</label>
                        <input type="number" class="form-input" id="estimatedCost" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-input" id="issueDescription" rows="3" placeholder="Describe the issue in detail..."></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Create Ticket',
            cancelText: 'Cancel',
            onConfirm: () => {
                const ticketId = 'RPR-' + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
                AdminComponents.showToast(`Repair ticket ${ticketId} created successfully!`, 'success');
            }
        });
    },
    
    /**
     * Export repairs data
     */
    exportRepairs() {
        AdminComponents.showToast('Exporting repairs data to CSV...', 'info');
        
        // Simulate export delay
        setTimeout(() => {
            AdminComponents.showToast('Repairs data exported successfully!', 'success');
        }, 1500);
    }
};

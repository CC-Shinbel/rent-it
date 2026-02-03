/**
 * =====================================================
 * LATE FEES TRACKER - JavaScript
 * Interactive late fees functionality
 * ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin components
    AdminComponents.initPage('latefees');
    
    // Initialize late fees functionality
    LateFeesManager.init();
});

const LateFeesManager = {
    // Email templates
    templates: {
        gentle: {
            subject: 'Friendly Reminder: Equipment Return Due',
            body: `Hi [Customer Name],

This is a friendly reminder that your rental of [Equipment Name] was due on [Due Date]. 

Your current late fee is: ₱[Late Fee Amount]

Please return the equipment at your earliest convenience to avoid additional charges. If you have already returned the item, please disregard this message.

If you need to extend your rental, please contact us at (02) 8123-4567.

Thank you for your understanding.

Best regards,
Sound Rental Team`
        },
        urgent: {
            subject: 'URGENT: Equipment Return Overdue',
            body: `Dear [Customer Name],

URGENT: Your rental of [Equipment Name] is now [Days Overdue] days overdue.

Current outstanding late fee: ₱[Late Fee Amount]

Late fees accrue daily at ₱500/day. Please return the equipment immediately to avoid further charges.

If you are experiencing difficulties, please contact us immediately at (02) 8123-4567 to discuss options.

This matter requires your immediate attention.

Sound Rental Management`
        },
        final: {
            subject: 'FINAL NOTICE: Immediate Equipment Return Required',
            body: `Dear [Customer Name],

FINAL NOTICE

This is our final notice regarding your overdue rental:

Equipment: [Equipment Name]
Days Overdue: [Days Overdue] days
Outstanding Late Fee: ₱[Late Fee Amount]

If the equipment is not returned within 48 hours, we will be forced to:
1. Charge the full replacement cost to your account
2. Report the matter to appropriate authorities
3. Take legal action if necessary

Please contact us IMMEDIATELY at (02) 8123-4567.

Sound Rental Management`
        },
        payment: {
            subject: 'Payment Due: Outstanding Late Fees',
            body: `Dear [Customer Name],

Thank you for returning the equipment. However, you have an outstanding balance for late fees:

Equipment: [Equipment Name]
Days Overdue: [Days Overdue] days
Late Fee Due: ₱[Late Fee Amount]

Payment Methods:
- GCash: 09XX-XXX-XXXX
- Bank Transfer: BDO 1234-5678-9012
- In-person at our shop

Please settle your balance within 7 days to avoid collection procedures.

Thank you for your prompt attention.

Sound Rental Team`
        }
    },
    
    /**
     * Initialize late fees manager
     */
    init() {
        this.bindEvents();
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Filter
        document.getElementById('overdueFilter')?.addEventListener('change', (e) => this.filterOverdue(e.target.value));
        
        // Bulk actions
        document.getElementById('sendAllRemindersBtn')?.addEventListener('click', () => this.sendAllReminders());
        document.getElementById('manageTemplatesBtn')?.addEventListener('click', () => this.showTemplatesManager());
        
        // Add template button
        document.getElementById('addTemplateBtn')?.addEventListener('click', () => this.showAddTemplateModal());
        
        // Overdue item actions
        document.querySelectorAll('.overdue-item .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const item = e.currentTarget.closest('.overdue-item');
                const itemId = item?.dataset.id;
                this.handleAction(action, itemId, item);
            });
        });
        
        // Template actions
        document.querySelectorAll('.template-btn.use').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.currentTarget.closest('.template-item')?.dataset.template;
                this.useTemplate(template);
            });
        });
        
        document.querySelectorAll('.template-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.currentTarget.closest('.template-item')?.dataset.template;
                this.editTemplate(template);
            });
        });
        
        // Modal events
        document.getElementById('closeReminderModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelReminderBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('reminderModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        
        // Send reminder button
        document.getElementById('sendReminderBtn')?.addEventListener('click', () => this.sendReminder());
        
        // Template select change
        document.getElementById('templateSelect')?.addEventListener('change', (e) => {
            this.loadTemplateContent(e.target.value);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    },
    
    /**
     * Filter overdue items
     */
    filterOverdue(filter) {
        const items = document.querySelectorAll('.overdue-item');
        
        items.forEach(item => {
            const days = parseInt(item.dataset.days) || 0;
            let show = true;
            
            switch (filter) {
                case '1-3':
                    show = days >= 1 && days <= 3;
                    break;
                case '4-7':
                    show = days >= 4 && days <= 7;
                    break;
                case '7+':
                    show = days > 7;
                    break;
                default:
                    show = true;
            }
            
            item.style.display = show ? '' : 'none';
        });
        
        AdminComponents.showToast(`Filtered: ${filter === 'all' ? 'All overdue' : filter + ' days'}`, 'info');
    },
    
    /**
     * Handle action button click
     */
    handleAction(action, itemId, item) {
        switch (action) {
            case 'remind':
                this.showReminderModal(item);
                break;
            case 'call':
                this.logCall(item);
                break;
            case 'resolve':
                this.resolveItem(itemId, item);
                break;
        }
    },
    
    /**
     * Show reminder modal
     */
    showReminderModal(item) {
        const customerName = item?.querySelector('.customer-name')?.textContent || 'Customer';
        const customerEmail = item?.querySelector('.customer-email')?.textContent || 'email@example.com';
        
        document.getElementById('reminderRecipient').textContent = customerName;
        document.getElementById('reminderEmail').textContent = customerEmail;
        
        // Load default template
        this.loadTemplateContent('gentle');
        
        document.getElementById('reminderModal')?.classList.add('open');
    },
    
    /**
     * Load template content into modal
     */
    loadTemplateContent(templateKey) {
        const template = this.templates[templateKey];
        
        if (template) {
            document.getElementById('emailSubject').value = template.subject;
            document.getElementById('emailBody').value = template.body;
        } else if (templateKey === 'custom') {
            document.getElementById('emailSubject').value = '';
            document.getElementById('emailBody').value = '';
        }
    },
    
    /**
     * Send reminder
     */
    sendReminder() {
        const recipient = document.getElementById('reminderRecipient')?.textContent;
        
        // Simulate sending
        AdminComponents.showToast(`Sending reminder to ${recipient}...`, 'info');
        
        setTimeout(() => {
            AdminComponents.showToast(`Reminder sent to ${recipient}!`, 'success');
            this.closeModal();
        }, 1500);
    },
    
    /**
     * Send reminders to all overdue customers
     */
    sendAllReminders() {
        const visibleItems = document.querySelectorAll('.overdue-item:not([style*="display: none"])');
        const count = visibleItems.length;
        
        AdminComponents.showModal({
            title: 'Send Bulk Reminders',
            content: `
                <p>You are about to send reminders to <strong>${count} customers</strong> with overdue rentals.</p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label">Template to Use</label>
                    <select class="form-select" id="bulkTemplateSelect" style="width: 100%;">
                        <option value="gentle">Gentle Reminder</option>
                        <option value="urgent">Urgent Notice</option>
                        <option value="final">Final Warning</option>
                    </select>
                </div>
                <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--admin-text-tertiary);">
                    Each email will be personalized with the customer's information and fee amount.
                </p>
            `,
            confirmText: `Send ${count} Reminders`,
            cancelText: 'Cancel',
            onConfirm: () => {
                AdminComponents.showToast(`Sending ${count} reminders...`, 'info');
                
                // Simulate bulk send
                setTimeout(() => {
                    AdminComponents.showToast(`${count} reminders sent successfully!`, 'success');
                }, 2000);
            }
        });
    },
    
    /**
     * Log a call attempt
     */
    logCall(item) {
        const customerName = item?.querySelector('.customer-name')?.textContent || 'Customer';
        
        AdminComponents.showModal({
            title: 'Log Call',
            content: `
                <p>Log call attempt for <strong>${customerName}</strong></p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label">Call Result</label>
                    <select class="form-select" id="callResult" style="width: 100%;">
                        <option value="answered">Answered - Promised to return</option>
                        <option value="no-answer">No Answer</option>
                        <option value="busy">Busy</option>
                        <option value="voicemail">Left Voicemail</option>
                        <option value="wrong-number">Wrong Number</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-input" id="callNotes" rows="3" placeholder="Add any notes about the call..."></textarea>
                </div>
            `,
            confirmText: 'Log Call',
            cancelText: 'Cancel',
            onConfirm: () => {
                AdminComponents.showToast(`Call logged for ${customerName}`, 'success');
            }
        });
    },
    
    /**
     * Resolve overdue item
     */
    resolveItem(itemId, item) {
        const customerName = item?.querySelector('.customer-name')?.textContent || 'Customer';
        const feeAmount = item?.querySelector('.fee-amount')?.textContent || '₱0';
        
        AdminComponents.showModal({
            title: 'Resolve Overdue Item',
            content: `
                <p>Mark this rental as resolved for <strong>${customerName}</strong></p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label">Resolution Type</label>
                    <select class="form-select" id="resolutionType" style="width: 100%;">
                        <option value="returned-paid">Equipment Returned + Fee Paid (${feeAmount})</option>
                        <option value="returned-waived">Equipment Returned + Fee Waived</option>
                        <option value="returned-partial">Equipment Returned + Partial Payment</option>
                        <option value="lost">Equipment Lost - Full Charge Applied</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount Received (₱)</label>
                    <input type="number" class="form-input" id="amountReceived" value="${feeAmount.replace(/[^\d]/g, '')}" placeholder="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-input" id="resolutionNotes" rows="2" placeholder="Optional notes..."></textarea>
                </div>
            `,
            confirmText: 'Resolve',
            cancelText: 'Cancel',
            onConfirm: () => {
                // Animate removal
                item.style.opacity = '0.5';
                item.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    item.remove();
                    AdminComponents.showToast(`Resolved: ${customerName}`, 'success');
                }, 300);
            }
        });
    },
    
    /**
     * Use template
     */
    useTemplate(templateKey) {
        // Show the reminder modal with selected template
        document.getElementById('templateSelect').value = templateKey;
        this.loadTemplateContent(templateKey);
        
        // If no item is selected, use first overdue item
        const firstItem = document.querySelector('.overdue-item');
        if (firstItem) {
            const customerName = firstItem.querySelector('.customer-name')?.textContent || 'Customer';
            const customerEmail = firstItem.querySelector('.customer-email')?.textContent || 'email@example.com';
            
            document.getElementById('reminderRecipient').textContent = customerName;
            document.getElementById('reminderEmail').textContent = customerEmail;
        }
        
        document.getElementById('reminderModal')?.classList.add('open');
        AdminComponents.showToast(`Template loaded: ${templateKey}`, 'info');
    },
    
    /**
     * Edit template
     */
    editTemplate(templateKey) {
        const template = this.templates[templateKey];
        const templateNames = {
            gentle: 'Gentle Reminder',
            urgent: 'Urgent Notice',
            final: 'Final Warning',
            payment: 'Payment Request'
        };
        
        AdminComponents.showModal({
            title: `Edit Template: ${templateNames[templateKey]}`,
            content: `
                <div class="form-group">
                    <label class="form-label">Subject Line</label>
                    <input type="text" class="form-input" id="editSubject" value="${template?.subject || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Email Body</label>
                    <textarea class="form-input" id="editBody" rows="12" style="font-family: monospace; font-size: 0.8125rem;">${template?.body || ''}</textarea>
                </div>
                <p style="font-size: 0.75rem; color: var(--admin-text-tertiary); margin-top: 0.5rem;">
                    Available placeholders: [Customer Name], [Equipment Name], [Due Date], [Days Overdue], [Late Fee Amount]
                </p>
            `,
            confirmText: 'Save Template',
            cancelText: 'Cancel',
            onConfirm: () => {
                AdminComponents.showToast(`Template "${templateNames[templateKey]}" saved!`, 'success');
            }
        });
    },
    
    /**
     * Show templates manager
     */
    showTemplatesManager() {
        AdminComponents.showModal({
            title: 'Email Templates Manager',
            content: `
                <p style="margin-bottom: 1rem;">Manage your email reminder templates. Click on a template to edit it.</p>
                <div class="templates-manager-list">
                    <div class="template-manager-item" style="padding: 1rem; background: var(--admin-bg-secondary); border-radius: var(--admin-radius-md); margin-bottom: 0.75rem; cursor: pointer;">
                        <strong>Gentle Reminder</strong>
                        <p style="font-size: 0.75rem; color: var(--admin-text-tertiary); margin-top: 0.25rem;">Friendly first reminder for slightly overdue items</p>
                    </div>
                    <div class="template-manager-item" style="padding: 1rem; background: var(--admin-bg-secondary); border-radius: var(--admin-radius-md); margin-bottom: 0.75rem; cursor: pointer;">
                        <strong>Urgent Notice</strong>
                        <p style="font-size: 0.75rem; color: var(--admin-text-tertiary); margin-top: 0.25rem;">Stronger reminder for items 4-7 days overdue</p>
                    </div>
                    <div class="template-manager-item" style="padding: 1rem; background: var(--admin-bg-secondary); border-radius: var(--admin-radius-md); margin-bottom: 0.75rem; cursor: pointer;">
                        <strong>Final Warning</strong>
                        <p style="font-size: 0.75rem; color: var(--admin-text-tertiary); margin-top: 0.25rem;">Last notice before escalation</p>
                    </div>
                    <div class="template-manager-item" style="padding: 1rem; background: var(--admin-bg-secondary); border-radius: var(--admin-radius-md); cursor: pointer;">
                        <strong>Payment Request</strong>
                        <p style="font-size: 0.75rem; color: var(--admin-text-tertiary); margin-top: 0.25rem;">Request for outstanding late fee payment</p>
                    </div>
                </div>
            `,
            confirmText: 'Add New Template',
            cancelText: 'Close',
            onConfirm: () => {
                this.showAddTemplateModal();
            }
        });
    },
    
    /**
     * Show add template modal
     */
    showAddTemplateModal() {
        AdminComponents.showModal({
            title: 'Create New Template',
            content: `
                <div class="form-group">
                    <label class="form-label">Template Name</label>
                    <input type="text" class="form-input" id="newTemplateName" placeholder="e.g., Special Offer">
                </div>
                <div class="form-group">
                    <label class="form-label">Subject Line</label>
                    <input type="text" class="form-input" id="newTemplateSubject" placeholder="Email subject">
                </div>
                <div class="form-group">
                    <label class="form-label">Email Body</label>
                    <textarea class="form-input" id="newTemplateBody" rows="10" placeholder="Write your email template here..."></textarea>
                </div>
                <p style="font-size: 0.75rem; color: var(--admin-text-tertiary);">
                    Available placeholders: [Customer Name], [Equipment Name], [Due Date], [Days Overdue], [Late Fee Amount]
                </p>
            `,
            confirmText: 'Create Template',
            cancelText: 'Cancel',
            onConfirm: () => {
                const name = document.getElementById('newTemplateName')?.value;
                AdminComponents.showToast(`Template "${name}" created!`, 'success');
            }
        });
    },
    
    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('reminderModal')?.classList.remove('open');
    }
};

/**
 * =====================================================
 * NEW ITEM PAGE - JavaScript
 * Handles form functionality for adding new rental items
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initImageUpload();
    initTagsInput();
    initFormValidation();
});

/**
 * Initialize Image Upload Functionality
 */
function initImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('itemImage');
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const removeBtn = document.getElementById('removeImageBtn');

    if (!uploadArea || !fileInput) return;

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageFile(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    // Remove image button
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            fileInput.value = '';
            preview.style.display = 'none';
            preview.src = '';
            placeholder.style.display = 'flex';
            removeBtn.style.display = 'none';
        });
    }

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            if (removeBtn) removeBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Initialize Tags Input
 */
function initTagsInput() {
    const tagsInput = document.getElementById('itemTags');
    const tagsPreview = document.getElementById('tagsPreview');

    if (!tagsInput || !tagsPreview) return;

    tagsInput.addEventListener('input', updateTagsPreview);
    tagsInput.addEventListener('blur', updateTagsPreview);

    function updateTagsPreview() {
        const value = tagsInput.value.trim();
        if (!value) {
            tagsPreview.innerHTML = '';
            return;
        }

        const tags = value.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        tagsPreview.innerHTML = tags.map(tag => `
            <span class="tag-pill">
                ${escapeHtml(tag)}
            </span>
        `).join('');
    }
}

/**
 * Initialize Form Validation and Submission
 */
function initFormValidation() {
    const form = document.getElementById('newItemForm');
    const saveBtn = document.getElementById('saveItemBtn');

    if (!form || !saveBtn) return;

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect form data
        const formData = collectFormData();

        // Show loading state
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Saving...
        `;

        try {
            // Simulate API call (replace with actual API endpoint)
            await simulateSaveItem(formData);

            // Show success message
            showNotification('Item created successfully!', 'success');

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'admin/dashboard/dashboard.php';
            }, 1500);

        } catch (error) {
            console.error('Error saving item:', error);
            showNotification('Failed to save item. Please try again.', 'error');

            // Reset button state
            saveBtn.disabled = false;
            saveBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Item
            `;
        }
    });
}

/**
 * Collect all form data
 */
function collectFormData() {
    return {
        name: document.getElementById('itemName')?.value || '',
        description: document.getElementById('itemDescription')?.value || '',
        category: document.getElementById('itemCategory')?.value || '',
        brand: document.getElementById('itemBrand')?.value || '',
        model: document.getElementById('itemModel')?.value || '',
        sku: document.getElementById('itemSKU')?.value || '',
        dailyRate: parseFloat(document.getElementById('dailyRate')?.value) || 0,
        weeklyRate: parseFloat(document.getElementById('weeklyRate')?.value) || 0,
        depositAmount: parseFloat(document.getElementById('depositAmount')?.value) || 0,
        lateFeeRate: parseFloat(document.getElementById('lateFeeRate')?.value) || 0,
        totalUnits: parseInt(document.getElementById('totalUnits')?.value) || 1,
        availableUnits: parseInt(document.getElementById('availableUnits')?.value) || 1,
        condition: document.getElementById('itemCondition')?.value || 'good',
        status: document.getElementById('itemStatus')?.value || 'available',
        isVisible: document.getElementById('isVisible')?.checked || false,
        isFeatured: document.getElementById('isFeatured')?.checked || false,
        tags: (document.getElementById('itemTags')?.value || '')
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0),
        createdAt: new Date().toISOString()
    };
}

/**
 * Simulate saving item (replace with actual API call)
 */
function simulateSaveItem(data) {
    return new Promise((resolve, reject) => {
        console.log('Saving item:', data);
        
        // Simulate network delay
        setTimeout(() => {
            // Simulate success
            resolve({ success: true, id: 'VDK-' + Math.floor(Math.random() * 10000) });
            
            // To simulate error, uncomment:
            // reject(new Error('Network error'));
        }, 1000);
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Check if AdminComponents has notification method
    if (typeof AdminComponents !== 'undefined' && AdminComponents.showToast) {
        AdminComponents.showToast(message, type);
        return;
    }

    // Fallback simple notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 14px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animation keyframes
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
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);

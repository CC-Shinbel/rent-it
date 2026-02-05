/**
 * ITEMS PAGE - JavaScript
 * Fetch and render items from the database
 */

// Resolve absolute URLs based on the current base tag or window origin
const baseHref = document.querySelector('base')?.href || `${window.location.origin}/`;
function buildUrl(path) {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return new URL(normalizedPath, baseHref).toString();
}

let itemsData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    attachFilters();
});

async function fetchItems() {
    const tbody = document.getElementById('itemsTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    try {
        const response = await fetch(buildUrl('admin/api/get_items.php'));
        if (!response.ok) throw new Error('Network error');
        const result = await response.json();
        if (result.success) {
            itemsData = result.data || [];
            renderItems(itemsData);
        } else {
            renderError(result.message || 'Failed to load items');
        }
    } catch (err) {
        console.error(err);
        renderError('Failed to load items');
    }
}

function renderError(message) {
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1rem; color:var(--admin-text-muted);">${message}</td></tr>`;
}

function renderItems(items) {
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;

    if (!items.length) {
        renderError('No items found');
        return;
    }

    tbody.innerHTML = items.map(renderItemRow).join('');
}

function renderItemRow(item) {
    const statusClass = getStatusClass(item.status);
    const image = item.image ? `assets/images/items/${item.image}` : '';
    const price = Number(item.price_per_day || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `
        <tr>
            <td>${item.item_id}</td>
            <td>
                <div class="item-cell">
                    <div class="item-thumb">
                        ${image ? `<img src="${image}" alt="${item.item_name}">` : '<div class="item-thumb-placeholder">No Image</div>'}
                    </div>
                    <div class="item-info">
                        <div class="item-name">${escapeHtml(item.item_name || 'Unnamed')}</div>
                        <div class="item-desc">${escapeHtml(item.description || '')}</div>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(item.category || 'Uncategorized')}</td>
            <td>₱${price}</td>
            <td><span class="status-badge ${statusClass}">${escapeHtml(item.status || 'Unknown')}</span></td>
            <td>${item.total_times_rented || 0}</td>
        </tr>
    `;
}

function getStatusClass(status) {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('available')) return 'status-success';
    if (normalized.includes('booked') || normalized.includes('reserved')) return 'status-warning';
    if (normalized.includes('maintenance') || normalized.includes('repair')) return 'status-info';
    if (normalized.includes('unavailable')) return 'status-danger';
    return 'status-default';
}

function attachFilters() {
    const searchInput = document.getElementById('itemSearchInput');
    const statusFilter = document.getElementById('statusFilter');
    const refreshBtn = document.getElementById('refreshItemsBtn');

    if (searchInput) {
        let timer;
        searchInput.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(filterItems, 250);
        });
    }

    statusFilter?.addEventListener('change', filterItems);
    refreshBtn?.addEventListener('click', fetchItems);
}

function filterItems() {
    const searchTerm = (document.getElementById('itemSearchInput')?.value || '').toLowerCase();
    const statusValue = document.getElementById('statusFilter')?.value || 'all';

    let filtered = itemsData;

    if (searchTerm) {
        filtered = filtered.filter(item =>
            (item.item_name || '').toLowerCase().includes(searchTerm) ||
            (item.category || '').toLowerCase().includes(searchTerm) ||
            (item.status || '').toLowerCase().includes(searchTerm)
        );
    }

    if (statusValue !== 'all') {
        filtered = filtered.filter(item => (item.status || '').toLowerCase() === statusValue.toLowerCase());
    }

    renderItems(filtered);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

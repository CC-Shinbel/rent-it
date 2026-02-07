/**
 * ============================================================
 * RENTIT THEME MODULE
 * Dark/Light Mode Toggle with localStorage Persistence
 * 
 * This script runs immediately to prevent "theme flash" on load.
 * Include this in <head> or early in <body> of all HTML files.
 * ============================================================
 */

(function() {
    'use strict';

    // ============================
    // IMMEDIATE THEME APPLICATION
    // Prevents flash of wrong theme on page load
    // ============================
    const savedTheme = localStorage.getItem('rentit-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // ============================
    // THEME TOGGLE INITIALIZATION
    // Sets up click handler after DOM is ready
    // ============================
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (!themeToggle) return;

        themeToggle.addEventListener('click', function() {
            // Get current theme
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            
            // Toggle theme
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage
            localStorage.setItem('rentit-theme', newTheme);
            
            // Announce change for accessibility
            const announcement = newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
            themeToggle.setAttribute('aria-label', announcement);
        });
    }

    function initPageSkeleton() {
        let overlay = document.querySelector('.page-skeleton-overlay');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-skeleton-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            overlay.innerHTML = `
            <div class="page-skeleton-shell">
                <aside class="page-skeleton-sidebar">
                    <div class="page-skeleton-logo skeleton-shape"></div>
                    <div class="page-skeleton-nav">
                        <span class="page-skeleton-pill skeleton-shape w-70"></span>
                        <span class="page-skeleton-pill skeleton-shape w-60"></span>
                        <span class="page-skeleton-pill skeleton-shape w-80"></span>
                        <span class="page-skeleton-pill skeleton-shape w-50"></span>
                        <span class="page-skeleton-pill skeleton-shape w-70"></span>
                    </div>
                    <div class="page-skeleton-user">
                        <span class="page-skeleton-circle skeleton-shape"></span>
                        <span class="page-skeleton-line skeleton-shape w-60" style="height: 12px;"></span>
                    </div>
                </aside>
                <section class="page-skeleton-main">
                    <div class="page-skeleton-topbar">
                        <span class="page-skeleton-line skeleton-shape w-30" style="height: 14px;"></span>
                        <span class="page-skeleton-circle skeleton-shape"></span>
                    </div>
                    <div class="page-skeleton-card">
                        <div class="page-skeleton-row" style="grid-template-columns: 1fr auto;">
                            <span class="page-skeleton-line skeleton-shape w-40" style="height: 14px;"></span>
                            <span class="page-skeleton-pill skeleton-shape w-20"></span>
                        </div>
                        <div class="page-skeleton-table">
                            <div class="page-skeleton-row">
                                <span class="page-skeleton-line skeleton-shape w-35 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-25 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-20 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-15 page-skeleton-block"></span>
                            </div>
                            <div class="page-skeleton-row">
                                <span class="page-skeleton-line skeleton-shape w-40 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-30 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-20 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-15 page-skeleton-block"></span>
                            </div>
                            <div class="page-skeleton-row">
                                <span class="page-skeleton-line skeleton-shape w-50 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-25 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-20 page-skeleton-block"></span>
                                <span class="page-skeleton-line skeleton-shape w-15 page-skeleton-block"></span>
                            </div>
                        </div>
                    </div>
                    <div class="page-skeleton-loader">
                        <span class="page-skeleton-spinner" aria-hidden="true"></span>
                        <span>Loading content...</span>
                    </div>
                </section>
            </div>
        `;

            document.body.appendChild(overlay);
        }

        const hideOverlay = () => {
            overlay.classList.add('is-hidden');
            setTimeout(() => overlay.remove(), 350);
        };

        window.addEventListener('load', hideOverlay, { once: true });
        setTimeout(hideOverlay, 3500);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initThemeToggle();
            initPageSkeleton();
        });
    } else {
        initThemeToggle();
        initPageSkeleton();
    }
})();

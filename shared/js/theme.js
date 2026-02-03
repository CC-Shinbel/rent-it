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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();

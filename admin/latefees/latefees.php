<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /rent-it/admin/auth/login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <base href="/rent-it/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Late Fees Tracker | Admin Portal</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Admin Shared Styles -->
    <link rel="stylesheet" href="admin/shared/css/admin-theme.css">
    <link rel="stylesheet" href="admin/shared/css/admin-globals.css">
    <link rel="stylesheet" href="admin/shared/css/admin-components.css">
    
    <!-- Page Specific Styles -->
    <link rel="stylesheet" href="admin/latefees/latefees.css">
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar Container (injected via JS) -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="admin-main">
            <!-- Header Container (injected via JS) -->
            <div id="headerContainer"></div>
            
            <!-- Page Content -->
            <div class="admin-content">
                <!-- Page Title & Actions -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">
                        <svg class="page-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                            <path d="M17 14l-5 5-3-3"/>
                        </svg>
                        Late Fees Tracker
                    </h1>
                    <p class="page-subtitle">Monitor overdue rentals, manage late fees, and send reminders</p>
                </div>
                <div class="page-header-right">
                    <button class="btn btn-secondary" id="manageTemplatesBtn" title="Manage email templates">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        Email Templates
                    </button>
                    <button class="btn btn-primary" id="sendAllRemindersBtn" title="Send reminders to all overdue customers">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 2L11 13"/>
                            <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                        Send All Reminders
                    </button>
                </div>
            </div>
            
            <!-- Stats Overview -->
            <div class="latefees-stats">
                <div class="stat-card" title="Total outstanding late fees">
                    <div class="stat-icon danger">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">₱45,750</span>
                        <span class="stat-label">Outstanding Fees</span>
                    </div>
                </div>
                
                <div class="stat-card" title="Currently overdue rentals">
                    <div class="stat-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">12</span>
                        <span class="stat-label">Overdue Rentals</span>
                    </div>
                </div>
                
                <div class="stat-card" title="Late fees collected this month">
                    <div class="stat-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">₱28,500</span>
                        <span class="stat-label">Collected This Month</span>
                    </div>
                </div>
                
                <div class="stat-card" title="Reminders sent today">
                    <div class="stat-icon pending">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">8</span>
                        <span class="stat-label">Reminders Sent Today</span>
                    </div>
                </div>
            </div>
            
            <!-- Two Column Layout -->
            <div class="latefees-layout">
                <!-- Left: Overdue List -->
                <div class="overdue-section">
                    <div class="admin-card">
                        <div class="card-header">
                            <h2 class="card-title">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                                Overdue Rentals
                            </h2>
                            <div class="card-actions">
                                <select id="overdueFilter" class="form-select" title="Filter by overdue period">
                                    <option value="all">All Overdue</option>
                                    <option value="1-3">1-3 Days</option>
                                    <option value="4-7">4-7 Days</option>
                                    <option value="7+">7+ Days</option>
                                </select>
                            </div>
                        </div>
                        <div class="overdue-list" id="overdueList">
                            <!-- Overdue Item 1 - Critical -->
                            <div class="overdue-item critical" data-id="OD-001" data-days="12">
                                <div class="overdue-priority">
                                    <span class="priority-indicator critical" title="Critical: 12 days overdue"></span>
                                </div>
                                <div class="overdue-main">
                                    <div class="overdue-customer">
                                        <span class="customer-name">Michael Chen</span>
                                        <span class="customer-email">michael.chen@email.com</span>
                                    </div>
                                    <div class="overdue-details">
                                        <span class="equipment-name">KRK-001 Pro System</span>
                                        <span class="days-overdue">12 days overdue</span>
                                    </div>
                                </div>
                                <div class="overdue-fee">
                                    <span class="fee-amount">₱6,000</span>
                                    <span class="fee-label">Late Fee</span>
                                </div>
                                <div class="overdue-actions">
                                    <button class="action-btn reminder-btn" title="Send reminder" data-action="remind">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn call-btn" title="Call customer" data-action="call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Overdue Item 2 - Critical -->
                            <div class="overdue-item critical" data-id="OD-002" data-days="9">
                                <div class="overdue-priority">
                                    <span class="priority-indicator critical" title="Critical: 9 days overdue"></span>
                                </div>
                                <div class="overdue-main">
                                    <div class="overdue-customer">
                                        <span class="customer-name">Sarah Williams</span>
                                        <span class="customer-email">s.williams@business.com</span>
                                    </div>
                                    <div class="overdue-details">
                                        <span class="equipment-name">KRK-002 Premium + SPK-001</span>
                                        <span class="days-overdue">9 days overdue</span>
                                    </div>
                                </div>
                                <div class="overdue-fee">
                                    <span class="fee-amount">₱9,000</span>
                                    <span class="fee-label">Late Fee</span>
                                </div>
                                <div class="overdue-actions">
                                    <button class="action-btn reminder-btn" title="Send reminder" data-action="remind">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn call-btn" title="Call customer" data-action="call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Overdue Item 3 - Warning -->
                            <div class="overdue-item warning" data-id="OD-003" data-days="5">
                                <div class="overdue-priority">
                                    <span class="priority-indicator warning" title="Warning: 5 days overdue"></span>
                                </div>
                                <div class="overdue-main">
                                    <div class="overdue-customer">
                                        <span class="customer-name">David Martinez</span>
                                        <span class="customer-email">david.m@gmail.com</span>
                                    </div>
                                    <div class="overdue-details">
                                        <span class="equipment-name">MIC-001 Wireless Set</span>
                                        <span class="days-overdue">5 days overdue</span>
                                    </div>
                                </div>
                                <div class="overdue-fee">
                                    <span class="fee-amount">₱1,250</span>
                                    <span class="fee-label">Late Fee</span>
                                </div>
                                <div class="overdue-actions">
                                    <button class="action-btn reminder-btn" title="Send reminder" data-action="remind">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn call-btn" title="Call customer" data-action="call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Overdue Item 4 - Warning -->
                            <div class="overdue-item warning" data-id="OD-004" data-days="4">
                                <div class="overdue-priority">
                                    <span class="priority-indicator warning" title="Warning: 4 days overdue"></span>
                                </div>
                                <div class="overdue-main">
                                    <div class="overdue-customer">
                                        <span class="customer-name">Jennifer Lopez</span>
                                        <span class="customer-email">jlo.events@mail.com</span>
                                    </div>
                                    <div class="overdue-details">
                                        <span class="equipment-name">LGT-001 LED Par Set</span>
                                        <span class="days-overdue">4 days overdue</span>
                                    </div>
                                </div>
                                <div class="overdue-fee">
                                    <span class="fee-amount">₱2,000</span>
                                    <span class="fee-label">Late Fee</span>
                                </div>
                                <div class="overdue-actions">
                                    <button class="action-btn reminder-btn" title="Send reminder" data-action="remind">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn call-btn" title="Call customer" data-action="call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Overdue Item 5 - Mild -->
                            <div class="overdue-item mild" data-id="OD-005" data-days="2">
                                <div class="overdue-priority">
                                    <span class="priority-indicator mild" title="Mild: 2 days overdue"></span>
                                </div>
                                <div class="overdue-main">
                                    <div class="overdue-customer">
                                        <span class="customer-name">Robert Kim</span>
                                        <span class="customer-email">rkim@company.ph</span>
                                    </div>
                                    <div class="overdue-details">
                                        <span class="equipment-name">KRK-003 Standard</span>
                                        <span class="days-overdue">2 days overdue</span>
                                    </div>
                                </div>
                                <div class="overdue-fee">
                                    <span class="fee-amount">₱1,000</span>
                                    <span class="fee-label">Late Fee</span>
                                </div>
                                <div class="overdue-actions">
                                    <button class="action-btn reminder-btn" title="Send reminder" data-action="remind">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn call-btn" title="Call customer" data-action="call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Overdue Item 6 - Mild -->
                            <div class="overdue-item mild" data-id="OD-006" data-days="1">
                                <div class="overdue-priority">
                                    <span class="priority-indicator mild" title="Mild: 1 day overdue"></span>
                                </div>
                                <div class="overdue-main">
                                    <div class="overdue-customer">
                                        <span class="customer-name">Anna Santos</span>
                                        <span class="customer-email">anna.santos@email.ph</span>
                                    </div>
                                    <div class="overdue-details">
                                        <span class="equipment-name">MIC-002 Wired Set</span>
                                        <span class="days-overdue">1 day overdue</span>
                                    </div>
                                </div>
                                <div class="overdue-fee">
                                    <span class="fee-amount">₱250</span>
                                    <span class="fee-label">Late Fee</span>
                                </div>
                                <div class="overdue-actions">
                                    <button class="action-btn reminder-btn" title="Send reminder" data-action="remind">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn call-btn" title="Call customer" data-action="call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn resolve-btn" title="Mark as resolved" data-action="resolve">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right: Email Templates & Activity -->
                <div class="templates-section">
                    <!-- Email Templates Card -->
                    <div class="admin-card templates-card">
                        <div class="card-header">
                            <h2 class="card-title">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                </svg>
                                Quick Templates
                            </h2>
                            <button class="btn btn-ghost btn-sm" id="addTemplateBtn" title="Create new template">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="templates-list">
                            <div class="template-item" data-template="gentle">
                                <div class="template-info">
                                    <span class="template-name">Gentle Reminder</span>
                                    <span class="template-preview">Hi [Name], this is a friendly reminder...</span>
                                </div>
                                <div class="template-actions">
                                    <button class="template-btn use" title="Use this template">Use</button>
                                    <button class="template-btn edit" title="Edit template">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="template-item" data-template="urgent">
                                <div class="template-info">
                                    <span class="template-name">Urgent Notice</span>
                                    <span class="template-preview">URGENT: Your rental is [X] days overdue...</span>
                                </div>
                                <div class="template-actions">
                                    <button class="template-btn use" title="Use this template">Use</button>
                                    <button class="template-btn edit" title="Edit template">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="template-item" data-template="final">
                                <div class="template-info">
                                    <span class="template-name">Final Warning</span>
                                    <span class="template-preview">Final Notice: Immediate return required...</span>
                                </div>
                                <div class="template-actions">
                                    <button class="template-btn use" title="Use this template">Use</button>
                                    <button class="template-btn edit" title="Edit template">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="template-item" data-template="payment">
                                <div class="template-info">
                                    <span class="template-name">Payment Request</span>
                                    <span class="template-preview">Payment due: Late fees of ₱[Amount]...</span>
                                </div>
                                <div class="template-actions">
                                    <button class="template-btn use" title="Use this template">Use</button>
                                    <button class="template-btn edit" title="Edit template">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity Card -->
                    <div class="admin-card activity-card">
                        <div class="card-header">
                            <h2 class="card-title">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                </svg>
                                Recent Activity
                            </h2>
                        </div>
                        <div class="activity-list">
                            <div class="activity-item">
                                <div class="activity-icon sent">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 2L11 13"/>
                                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                                    </svg>
                                </div>
                                <div class="activity-info">
                                    <span class="activity-text">Reminder sent to Michael Chen</span>
                                    <span class="activity-time">10 minutes ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon resolved">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                                <div class="activity-info">
                                    <span class="activity-text">Payment received from James Tan - ₱3,500</span>
                                    <span class="activity-time">1 hour ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon sent">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 2L11 13"/>
                                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                                    </svg>
                                </div>
                                <div class="activity-info">
                                    <span class="activity-text">Bulk reminders sent (5 customers)</span>
                                    <span class="activity-time">2 hours ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon call">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <div class="activity-info">
                                    <span class="activity-text">Call logged: Sarah Williams - No answer</span>
                                    <span class="activity-time">3 hours ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon resolved">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                                <div class="activity-info">
                                    <span class="activity-text">Equipment returned by Lisa Park</span>
                                    <span class="activity-time">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer (injected via JS) -->
        <footer id="admin-footer"></footer>
    </main>
    
    <!-- Send Reminder Modal -->
    <div class="modal" id="reminderModal">
        <div class="modal-overlay"></div>
        <div class="modal-container reminder-modal">
            <div class="modal-header">
                <h2 class="modal-title">Send Reminder</h2>
                <button class="modal-close" id="closeReminderModal" title="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="reminder-recipient">
                    <label class="form-label">To:</label>
                    <div class="recipient-info">
                        <span class="recipient-name" id="reminderRecipient">Michael Chen</span>
                        <span class="recipient-email" id="reminderEmail">michael.chen@email.com</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Template</label>
                    <select class="form-select" id="templateSelect" style="width: 100%;">
                        <option value="gentle">Gentle Reminder</option>
                        <option value="urgent">Urgent Notice</option>
                        <option value="final">Final Warning</option>
                        <option value="payment">Payment Request</option>
                        <option value="custom">Custom Message</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Subject</label>
                    <input type="text" class="form-input" id="emailSubject" value="Rental Return Reminder - [Equipment Name]">
                </div>
                <div class="form-group">
                    <label class="form-label">Message</label>
                    <textarea class="form-input email-body" id="emailBody" rows="8">Hi [Customer Name],

This is a friendly reminder that your rental of [Equipment Name] was due on [Due Date]. 

Your current late fee is: ₱[Late Fee Amount]

Please return the equipment at your earliest convenience to avoid additional charges. If you have already returned the item, please disregard this message.

If you need to extend your rental, please contact us at (02) 8123-4567.

Thank you for your understanding.

Best regards,
Sound Rental Team</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelReminderBtn">Cancel</button>
                <button class="btn btn-primary" id="sendReminderBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"/>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    Send Reminder
                </button>
            </div>
        </div>
    </div>
    
        </div>
        </main>
        
        <!-- Footer Container (injected via JS) -->
        <div id="footerContainer"></div>
    </div>
    
    <!-- Toast Container -->
    <div id="toast-container"></div>
    
    <!-- Scripts -->
    <script src="admin/shared/js/admin-components.js"></script>
    <script src="admin/latefees/latefees.js"></script>
</body>
</html>



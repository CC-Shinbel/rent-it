<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt Calendar Master View - Visual booking and availability grid">
    <title>Calendar - RentIt Admin</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
    <link rel="apple-touch-icon" href="assets/images/rIT_logo_tp.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Admin Stylesheets -->
    <link rel="stylesheet" href="admin/shared/css/admin-theme.css">
    <link rel="stylesheet" href="admin/shared/css/admin-globals.css">
    <link rel="stylesheet" href="admin/shared/css/admin-components.css">
    <link rel="stylesheet" href="admin/calendar/calendar.css">
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar Container -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="admin-main">
            <!-- Header Container -->
            <div id="headerContainer"></div>
            
            <!-- Content Area -->
            <div class="admin-content">
                <!-- Page Header -->
                <div class="admin-page-header">
                    <div>
                        <h1 class="admin-page-title">Calendar Master View</h1>
                        <p class="admin-page-subtitle">View all bookings, maintenance, and availability at a glance.</p>
                    </div>
                    <div class="admin-page-actions">
                        <div class="filter-group">
                            <select class="form-select" id="assetTypeFilter" title="Filter by asset type">
                                <option value="all">All Asset Types</option>
                                <option value="karaoke">Karaoke Machines</option>
                                <option value="speaker">Speaker Sets</option>
                                <option value="microphone">Microphones</option>
                                <option value="accessory">Accessories</option>
                            </select>
                            <select class="form-select" id="statusFilter" title="Filter by status">
                                <option value="all">All Status</option>
                                <option value="booked">Booked</option>
                                <option value="repair">In Repair</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="available">Available</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" id="newBookingBtn" title="Create a new booking">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            New Booking
                        </button>
                    </div>
                </div>

                <!-- Legend & Navigation -->
                <div class="calendar-controls animate-fadeInUp">
                    <div class="calendar-legend" title="Status color legend">
                        <div class="legend-item">
                            <span class="legend-color booked"></span>
                            <span class="legend-label">Booked</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color repair"></span>
                            <span class="legend-label">In Repair</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color cleaning"></span>
                            <span class="legend-label">Cleaning</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color available"></span>
                            <span class="legend-label">Available</span>
                        </div>
                    </div>
                    <div class="calendar-nav">
                        <button class="btn btn-ghost btn-sm" id="prevWeekBtn" title="Go to previous week">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>
                        <span class="calendar-date-range" id="dateRangeLabel">Jan 15 - Jan 20, 2026</span>
                        <button class="btn btn-ghost btn-sm" id="nextWeekBtn" title="Go to next week">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                        <button class="btn btn-secondary btn-sm" id="todayBtn" title="Jump to current week">Today</button>
                    </div>
                </div>

                <!-- Calendar Grid -->
                <div class="calendar-card admin-card animate-fadeInUp">
                    <div class="calendar-grid-wrapper">
                        <table class="calendar-grid" id="calendarGrid">
                            <thead>
                                <tr>
                                    <th class="asset-column" title="Asset/Equipment name">Asset Name</th>
                                    <th class="day-column" title="Monday, January 15">
                                        <div class="day-header">
                                            <span class="day-name">Mon</span>
                                            <span class="day-date">Jan 15</span>
                                        </div>
                                    </th>
                                    <th class="day-column" title="Tuesday, January 16">
                                        <div class="day-header">
                                            <span class="day-name">Tue</span>
                                            <span class="day-date">Jan 16</span>
                                        </div>
                                    </th>
                                    <th class="day-column" title="Wednesday, January 17">
                                        <div class="day-header">
                                            <span class="day-name">Wed</span>
                                            <span class="day-date">Jan 17</span>
                                        </div>
                                    </th>
                                    <th class="day-column" title="Thursday, January 18">
                                        <div class="day-header">
                                            <span class="day-name">Thu</span>
                                            <span class="day-date">Jan 18</span>
                                        </div>
                                    </th>
                                    <th class="day-column" title="Friday, January 19">
                                        <div class="day-header">
                                            <span class="day-name">Fri</span>
                                            <span class="day-date">Jan 19</span>
                                        </div>
                                    </th>
                                    <th class="day-column" title="Saturday, January 20">
                                        <div class="day-header">
                                            <span class="day-name">Sat</span>
                                            <span class="day-date">Jan 20</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- KRK-001 Pro System -->
                                <tr data-asset="KRK-001" data-type="karaoke">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">KRK-001</span>
                                            <span class="asset-name">Pro System</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block booked" style="width: calc(200% + 1px);" title="John Smith - Birthday | Jan 15-16, 2026" data-booking-id="B001">
                                            <span class="booking-customer">John Smith - Birthday</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- KRK-002 Premium -->
                                <tr data-asset="KRK-002" data-type="karaoke">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">KRK-002</span>
                                            <span class="asset-name">Premium</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block booked" style="width: calc(400% + 3px);" title="Sarah Johnson - Corporate | Jan 16-19, 2026" data-booking-id="B002">
                                            <span class="booking-customer">Sarah Johnson - Corporate</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- KRK-003 Standard -->
                                <tr data-asset="KRK-003" data-type="karaoke">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">KRK-003</span>
                                            <span class="asset-name">Standard</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block cleaning" style="width: calc(100%);" title="Cleaning in progress | Expected completion: Jan 15" data-maintenance-id="M001">
                                            <span class="booking-status">Cleaning</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" style="width: calc(500% + 4px);" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                </tr>
                                
                                <!-- KRK-004 Deluxe -->
                                <tr data-asset="KRK-004" data-type="karaoke">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">KRK-004</span>
                                            <span class="asset-name">Deluxe</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block booked" style="width: calc(200% + 1px);" title="Mike Davis - Wedding | Jan 17-18, 2026" data-booking-id="B003">
                                            <span class="booking-customer">Mike Davis - Wedding</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- KRK-005 Basic -->
                                <tr data-asset="KRK-005" data-type="karaoke">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">KRK-005</span>
                                            <span class="asset-name">Basic</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block repair" style="width: calc(300% + 2px);" title="In Repair - Speaker issue | Expected: Jan 17" data-maintenance-id="M002">
                                            <span class="booking-status">In Repair</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- SPK-001 Speaker Set -->
                                <tr data-asset="SPK-001" data-type="speaker">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">SPK-001</span>
                                            <span class="asset-name">Speaker Set</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block booked" style="width: calc(200% + 1px);" title="Emily White | Jan 16-17, 2026" data-booking-id="B004">
                                            <span class="booking-customer">Emily White</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" style="width: calc(300% + 2px);" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                </tr>
                                
                                <!-- MIC-001 Wireless -->
                                <tr data-asset="MIC-001" data-type="microphone">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">MIC-001</span>
                                            <span class="asset-name">Wireless</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block booked" style="width: calc(400% + 3px);" title="Package deal with KRK-002 | Jan 15-18, 2026" data-booking-id="B005">
                                            <span class="booking-customer">Sarah Johnson (Package)</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- MIC-002 Wired Set -->
                                <tr data-asset="MIC-002" data-type="microphone">
                                    <td class="asset-cell">
                                        <div class="asset-info">
                                            <span class="asset-id">MIC-002</span>
                                            <span class="asset-name">Wired Set</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                    <td class="day-cell">
                                        <div class="booking-block booked" style="width: calc(300% + 2px);" title="Tom Brown - Karaoke | Jan 17-19, 2026" data-booking-id="B006">
                                            <span class="booking-customer">Tom Brown - Karaoke</span>
                                        </div>
                                    </td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell"></td>
                                    <td class="day-cell">
                                        <div class="booking-block available" title="Available for booking">
                                            <span class="booking-status">Available</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="calendar-summary animate-fadeInUp">
                    <div class="summary-card" title="Total bookings this week">
                        <div class="summary-icon info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <div class="summary-content">
                            <span class="summary-value">6</span>
                            <span class="summary-label">Bookings This Week</span>
                        </div>
                    </div>
                    <div class="summary-card" title="Items currently in repair">
                        <div class="summary-icon danger">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                            </svg>
                        </div>
                        <div class="summary-content">
                            <span class="summary-value">1</span>
                            <span class="summary-label">In Repair</span>
                        </div>
                    </div>
                    <div class="summary-card" title="Items being cleaned">
                        <div class="summary-icon warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                            </svg>
                        </div>
                        <div class="summary-content">
                            <span class="summary-value">1</span>
                            <span class="summary-label">Cleaning</span>
                        </div>
                    </div>
                    <div class="summary-card" title="Equipment ready for rental">
                        <div class="summary-icon success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </div>
                        <div class="summary-content">
                            <span class="summary-value">24</span>
                            <span class="summary-label">Available</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer Container -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Booking Detail Modal -->
    <div class="modal-backdrop" id="bookingModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Booking Details</h3>
                <button class="modal-close" id="closeBookingModal" title="Close modal">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="booking-detail-grid">
                    <div class="detail-item">
                        <label>Customer</label>
                        <span id="modalCustomer">John Smith</span>
                    </div>
                    <div class="detail-item">
                        <label>Event Type</label>
                        <span id="modalEvent">Birthday Party</span>
                    </div>
                    <div class="detail-item">
                        <label>Equipment</label>
                        <span id="modalEquipment">KRK-001 Pro System</span>
                    </div>
                    <div class="detail-item">
                        <label>Duration</label>
                        <span id="modalDuration">Jan 15-16, 2026 (2 days)</span>
                    </div>
                    <div class="detail-item">
                        <label>Status</label>
                        <span class="status-badge status-booked" id="modalStatus">Booked</span>
                    </div>
                    <div class="detail-item">
                        <label>Total</label>
                        <span id="modalTotal">₱3,500.00</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelBookingModalBtn">Close</button>
                <button class="btn btn-primary" id="editBookingBtn">Edit Booking</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="admin/shared/js/admin-components.js"></script>
    <script src="admin/calendar/calendar.js"></script>
</body>
</html>




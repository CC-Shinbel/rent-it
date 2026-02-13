import React, { useState, useEffect } from "react";
import "../styles/admin-components.css";
import "../styles/admin-globals.css";
import "../styles/admin-theme.css";
import "../styles/pages/admin-dashboard.css";
import "../styles/pages/admin-login.css";
import "../styles/pages/customers.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with API call
  useEffect(() => {
    const mockCustomers = [
      {
        id: "CUST-001",
        name: "Juan Dela Cruz",
        email: "juan.delacruz@email.com",
        avatar: "JD",
        bookings: [
          { id: "BK-001", items: "Karaoke Pro System", itemCount: 1, rentalStart: "2025-02-01", rentalEnd: "2025-02-15", duration: "14 days", status: "active", payment: "paid" },
          { id: "BK-005", items: "LED Projector", itemCount: 1, rentalStart: "2025-02-16", rentalEnd: "2025-03-01", duration: "13 days", status: "pending", payment: "pending" }
        ]
      },
      {
        id: "CUST-002",
        name: "Maria Santos",
        email: "maria.santos@email.com",
        avatar: "MS",
        bookings: [
          { id: "BK-002", items: "LED Projector, Bluetooth Speaker", itemCount: 2, rentalStart: "2025-02-05", rentalEnd: "2025-02-20", duration: "15 days", status: "active", payment: "paid" }
        ]
      },
      {
        id: "CUST-003",
        name: "Carlos Reyes",
        email: "carlos.reyes@email.com",
        avatar: "CR",
        bookings: [
          { id: "BK-003", items: "Microphone Stand Pro", itemCount: 1, rentalStart: "2025-01-20", rentalEnd: "2025-02-10", duration: "21 days", status: "overdue", payment: "overdue" }
        ]
      },
      {
        id: "CUST-004",
        name: "Ana Garcia",
        email: "ana.garcia@email.com",
        avatar: "AG",
        bookings: [
          { id: "BK-004", items: "Portable Speaker", itemCount: 1, rentalStart: "2025-01-15", rentalEnd: "2025-01-31", duration: "16 days", status: "completed", payment: "paid" }
        ]
      },
      {
        id: "CUST-005",
        name: "Roberto Lopez",
        email: "roberto.lopez@email.com",
        avatar: "RL",
        bookings: [
          { id: "BK-006", items: "4K Projector", itemCount: 1, rentalStart: "2025-02-10", rentalEnd: "2025-02-28", duration: "18 days", status: "active", payment: "partial" }
        ]
      },
      {
        id: "CUST-006",
        name: "Sofia Martinez",
        email: "sofia.martinez@email.com",
        avatar: "SM",
        bookings: [
          { id: "BK-007", items: "Audio Setup, Microphone", itemCount: 2, rentalStart: "2025-02-08", rentalEnd: "2025-02-25", duration: "17 days", status: "active", payment: "paid" }
        ]
      },
      {
        id: "CUST-007",
        name: "Miguel Torres",
        email: "miguel.torres@email.com",
        avatar: "MT",
        bookings: [
          { id: "BK-008", items: "Karaoke System", itemCount: 1, rentalStart: "2025-01-25", rentalEnd: "2025-02-12", duration: "18 days", status: "completed", payment: "paid" }
        ]
      },
      {
        id: "CUST-008",
        name: "Lucia Fernandez",
        email: "lucia.fernandez@email.com",
        avatar: "LF",
        bookings: [
          { id: "BK-009", items: "Portable Speaker", itemCount: 1, rentalStart: "2025-02-12", rentalEnd: "2025-02-22", duration: "10 days", status: "active", payment: "pending" }
        ]
      },
      {
        id: "CUST-009",
        name: "Patricia Aquino",
        email: "patricia.aquino@email.com",
        avatar: "PA",
        bookings: [
          { id: "BK-010", items: "LED Projector", itemCount: 1, rentalStart: "2025-02-03", rentalEnd: "2025-02-18", duration: "15 days", status: "active", payment: "paid" }
        ]
      },
      {
        id: "CUST-010",
        name: "Joseph Gonzales",
        email: "joseph.gonzales@email.com",
        avatar: "JG",
        bookings: [
          { id: "BK-011", items: "Microphone, Audio Cable", itemCount: 2, rentalStart: "2025-02-14", rentalEnd: "2025-03-05", duration: "19 days", status: "active", payment: "paid" }
        ]
      }
    ];
    setCustomers(mockCustomers);
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = customers;

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((c) => c.bookings.some((b) => b.status === "active"));
      } else if (statusFilter === "overdue") {
        filtered = filtered.filter((c) => c.bookings.some((b) => b.status === "overdue"));
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((c) => !c.bookings.some((b) => b.status === "active"));
      }
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.bookings.some((b) => b.id.toLowerCase().includes(term))
      );
    }

    // Apply sort
    if (sortFilter === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortFilter === "bookings") {
      filtered.sort((a, b) => b.bookings.length - a.bookings.length);
    } else if (sortFilter === "revenue") {
      // Mock revenue calculation
      filtered.sort((a, b) => {
        const revenueA = a.bookings.reduce((sum, b) => sum + (parseInt(b.duration) * 100), 0);
        const revenueB = b.bookings.reduce((sum, b) => sum + (parseInt(b.duration) * 100), 0);
        return revenueB - revenueA;
      });
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [customers, statusFilter, searchTerm, sortFilter]);

  const getKPIStats = () => {
    const activeBookings = customers.reduce(
      (sum, c) => sum + c.bookings.filter((b) => b.status === "active").length,
      0
    );
    const overdueReturns = customers.reduce(
      (sum, c) => sum + c.bookings.filter((b) => b.status === "overdue").length,
      0
    );
    const monthlyRevenue = customers.reduce((sum, c) => {
      return sum + c.bookings.reduce((bsum, b) => bsum + (parseInt(b.duration) * 100), 0);
    }, 0);

    return {
      activeBookings,
      monthlyRevenue: monthlyRevenue.toLocaleString(),
      totalCustomers: customers.length,
      overdueReturns
    };
  };

  const kpi = getKPIStats();
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleExport = () => {
    alert("Export functionality would be implemented here.");
  };

  const handleViewCustomer = (customerId) => {
    alert(`View customer ${customerId}`);
  };

  const handleEmailCustomer = (customerEmail) => {
    alert(`Email modal would open for ${customerEmail}`);
  };

  const handleCallCustomer = (customerName, customerPhone = "+63-917-000-0000") => {
    alert(`Call would be initiated for ${customerName}: ${customerPhone}`);
  };

  const getPrimaryBooking = (customer) => {
    return customer.bookings.length > 0 ? customer.bookings[0] : null;
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">
            Manage customer accounts and rental history
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-secondary" onClick={handleExport} title="Export customer data">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="customers-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpi.activeBookings}</div>
            <div className="kpi-label">Active Bookings</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <text
                x="12"
                y="17"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="currentColor"
                stroke="none"
              >
                ₱
              </text>
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-value">₱{kpi.monthlyRevenue}</div>
            <div className="kpi-label">Monthly Revenue</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpi.totalCustomers.toLocaleString()}</div>
            <div className="kpi-label">Total Customers</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{kpi.overdueReturns}</div>
            <div className="kpi-label">Overdue Returns</div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="customers-toolbar">
        <div className="customers-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="customers-filters">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="active">Active Rentals</option>
            <option value="overdue">Overdue</option>
            <option value="inactive">No Active Rentals</option>
          </select>
          <select
            className="filter-select"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="bookings">Most Bookings</option>
            <option value="revenue">Highest Revenue</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="customers-table-container">
        {paginatedCustomers.length > 0 ? (
          <table className="admin-table customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Booking ID</th>
                <th>Items</th>
                <th>Rental Period</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => {
                const primaryBooking = getPrimaryBooking(customer);
                return (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">{customer.avatar}</div>
                        <div className="customer-info">
                          <div className="customer-name">{customer.name}</div>
                          <div className="customer-email">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {customer.bookings.length > 1 ? (
                        <select className="booking-dropdown" defaultValue={primaryBooking.id}>
                          {customer.bookings.map((booking) => (
                            <option key={booking.id} value={booking.id}>
                              {booking.id}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="booking-id">{primaryBooking?.id}</span>
                      )}
                    </td>
                    <td>
                      <div className="items-cell">
                        <div className="item-name">{primaryBooking?.items}</div>
                        <div className="item-count">{primaryBooking?.itemCount} item(s)</div>
                      </div>
                    </td>
                    <td>
                      <div className="dates-cell">
                        <div className="date-range">
                          {primaryBooking?.rentalStart} to {primaryBooking?.rentalEnd}
                        </div>
                        <div className="date-duration">{primaryBooking?.duration}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${primaryBooking?.status}`}>
                        {primaryBooking?.status.charAt(0).toUpperCase() +
                          primaryBooking?.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-badge ${primaryBooking?.payment}`}>
                        {primaryBooking?.payment.charAt(0).toUpperCase() +
                          primaryBooking?.payment.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn view"
                          onClick={() => handleViewCustomer(customer.id)}
                          title="View customer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="action-btn email"
                          onClick={() => handleEmailCustomer(customer.email)}
                          title="Send email"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 6l10 7 10-7" />
                          </svg>
                        </button>
                        <button
                          className="action-btn call"
                          onClick={() => handleCallCustomer(customer.name)}
                          title="Call customer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="customers-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div className="customers-empty-title">No customers found</div>
            <div className="customers-empty-text">
              Try adjusting your search or filter criteria.
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="customers-pagination">
        <span className="pagination-info">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{" "}
          {filteredCustomers.length} customers
        </span>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="pagination-pages">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 5 && <span className="page-dots">...</span>}
            {totalPages > 5 && (
              <button
                className={`page-btn ${currentPage === totalPages ? "active" : ""}`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

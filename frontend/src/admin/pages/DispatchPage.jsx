import React, { useState, useEffect } from "react";
import "../styles/admin-components.css";
import "../styles/admin-globals.css";
import "../styles/admin-theme.css";
import "../styles/pages/admin-dashboard.css";
import "../styles/pages/admin-login.css";
import "../styles/pages/dispatch.css";

export default function DispatchPage() {
  const [dispatches, setDispatches] = useState([]);
  const [filteredDispatches, setFilteredDispatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState("week");

  // Mock data - replace with API call
  useEffect(() => {
    const mockDispatches = [
      {
        id: "ORD-001",
        orderId: "ORD-001",
        type: "delivery",
        status: "confirmed",
        time: "10:00 AM",
        customerName: "Juan Dela Cruz",
        customerPhone: "+63-917-123-4567",
        customerAvatar: "JD",
        address: "123 Main St, Makati City, Manila",
        items: ["Karaoke Pro System"],
        itemCount: 1,
      },
      {
        id: "ORD-002",
        orderId: "ORD-002",
        type: "delivery",
        status: "out_for_delivery",
        time: "11:30 AM",
        customerName: "Maria Santos",
        customerPhone: "+63-917-234-5678",
        customerAvatar: "MS",
        address: "456 Oak Ave, Quezon City, Manila",
        items: ["LED Projector", "Bluetooth Speaker"],
        itemCount: 2,
      },
      {
        id: "ORD-003",
        orderId: "ORD-003",
        type: "pickup",
        status: "active",
        time: "1:00 PM",
        customerName: "Carlos Reyes",
        customerPhone: "+63-917-345-6789",
        customerAvatar: "CR",
        address: "789 Pine Rd, Pasig City, Manila",
        items: ["Microphone Stand Pro"],
        itemCount: 1,
      },
      {
        id: "ORD-004",
        orderId: "ORD-004",
        type: "delivery",
        status: "completed",
        time: "2:15 PM",
        customerName: "Ana Garcia",
        customerPhone: "+63-917-456-7890",
        customerAvatar: "AG",
        address: "321 Elm St, Caloocan City, Manila",
        items: ["Portable Speaker"],
        itemCount: 1,
      },
      {
        id: "ORD-005",
        orderId: "ORD-005",
        type: "returning",
        status: "return_scheduled",
        time: "3:30 PM",
        customerName: "Roberto Lopez",
        customerPhone: "+63-917-567-8901",
        customerAvatar: "RL",
        address: "654 Maple Dr, Las Piñas City, Manila",
        items: ["4K Projector"],
        itemCount: 1,
      },
      {
        id: "ORD-006",
        orderId: "ORD-006",
        type: "delivery",
        status: "pending",
        time: "4:45 PM",
        customerName: "Sofia Martinez",
        customerPhone: "+63-917-678-9012",
        customerAvatar: "SM",
        address: "987 Cedar Ln, Taguig City, Manila",
        items: ["Audio Setup", "Microphone"],
        itemCount: 2,
      },
      {
        id: "ORD-007",
        orderId: "ORD-007",
        type: "pickup",
        status: "returned",
        time: "9:00 AM",
        customerName: "Miguel Torres",
        customerPhone: "+63-917-789-0123",
        customerAvatar: "MT",
        address: "111 Birch Way, Cavite City, Cavite",
        items: ["Karaoke System"],
        itemCount: 1,
      },
      {
        id: "ORD-008",
        orderId: "ORD-008",
        type: "delivery",
        status: "late",
        time: "12:00 PM",
        customerName: "Lucia Fernandez",
        customerPhone: "+63-917-890-1234",
        customerAvatar: "LF",
        address: "222 Spruce St, Navotas City, Manila",
        items: ["Portable Speaker"],
        itemCount: 1,
      },
    ];
    setDispatches(mockDispatches);
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = dispatches;

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((d) => d.status === activeFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.orderId.toLowerCase().includes(term) ||
          d.customerName.toLowerCase().includes(term) ||
          d.address.toLowerCase().includes(term)
      );
    }

    setFilteredDispatches(filtered);
  }, [dispatches, activeFilter, searchTerm]);

  const getStats = () => {
    const deliveries = dispatches.filter((d) => d.type === "delivery").length;
    const pickups = dispatches.filter((d) => d.type === "pickup").length;
    const pending = dispatches.filter((d) => d.status === "pending").length;
    const completed = dispatches.filter((d) => d.status === "completed").length;
    return { deliveries, pickups, pending, completed };
  };

  const stats = getStats();

  const handleStatusClick = (status) => {
    setActiveFilter(status);
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dispatch</h1>
          <p className="admin-page-subtitle">
            Manage deliveries and pickups for rental orders
          </p>
        </div>
        <div className="admin-page-actions">
          <select
            id="dateRangeSelect"
            className="filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week" selected>
              This Week
            </option>
            <option value="all">All Scheduled</option>
          </select>
        </div>
      </div>

      {/* Dispatch Stats */}
      <section className="dispatch-stats">
        <div className="stat-card">
          <div className="stat-icon delivery">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value" id="deliveryCount">
              {stats.deliveries}
            </span>
            <span className="stat-label">Deliveries Today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pickup">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value" id="pickupCount">
              {stats.pickups}
            </span>
            <span className="stat-label">Pickups Today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value" id="pendingCount">
              {stats.pending}
            </span>
            <span className="stat-label">Pending Assignment</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value" id="completedCount">
              {stats.completed}
            </span>
            <span className="stat-label">Completed Today</span>
          </div>
        </div>
      </section>

      {/* Dispatch Filters */}
      <div className="dispatch-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleStatusClick("all")}
          >
            All
          </button>
          <button
            className={`filter-tab ${activeFilter === "pending" ? "active" : ""}`}
            onClick={() => handleStatusClick("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${activeFilter === "confirmed" ? "active" : ""}`}
            onClick={() => handleStatusClick("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`filter-tab ${activeFilter === "out_for_delivery" ? "active" : ""}`}
            onClick={() => handleStatusClick("out_for_delivery")}
          >
            Out for Delivery
          </button>
          <button
            className={`filter-tab ${activeFilter === "active" ? "active" : ""}`}
            onClick={() => handleStatusClick("active")}
          >
            Active
          </button>
          <button
            className={`filter-tab ${activeFilter === "return_scheduled" ? "active" : ""}`}
            onClick={() => handleStatusClick("return_scheduled")}
          >
            Return Scheduled
          </button>
          <button
            className={`filter-tab ${activeFilter === "returned" ? "active" : ""}`}
            onClick={() => handleStatusClick("returned")}
          >
            Returned
          </button>
          <button
            className={`filter-tab ${activeFilter === "completed" ? "active" : ""}`}
            onClick={() => handleStatusClick("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-tab ${activeFilter === "cancelled" ? "active" : ""}`}
            onClick={() => handleStatusClick("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={`filter-tab ${activeFilter === "late" ? "active" : ""}`}
            onClick={() => handleStatusClick("late")}
          >
            Late
          </button>
        </div>
        <div className="filter-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            height="18"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            id="dispatchSearchInput"
            placeholder="Search by order ID, customer, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dispatch Cards Grid */}
      <div className="dispatch-grid" id="dispatchGrid">
        {filteredDispatches.length > 0 ? (
          filteredDispatches.map((dispatch) => (
            <div key={dispatch.id} className="dispatch-card">
              <div className="dispatch-card-header">
                <div className="dispatch-type delivery">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  {dispatch.type}
                </div>
                <span
                  className={`dispatch-status ${dispatch.status}`}
                >
                  {dispatch.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="dispatch-card-body">
                <div className="dispatch-order-info">
                  <div className="dispatch-order-id">{dispatch.orderId}</div>
                  <div className="dispatch-time">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {dispatch.time}
                  </div>
                </div>

                <div className="dispatch-customer">
                  <div className="dispatch-customer-avatar">
                    {dispatch.customerAvatar}
                  </div>
                  <div className="dispatch-customer-info">
                    <div className="dispatch-customer-name">
                      {dispatch.customerName}
                    </div>
                    <div className="dispatch-customer-phone">
                      {dispatch.customerPhone}
                    </div>
                  </div>
                </div>

                <div className="dispatch-address">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div className="dispatch-address-text">
                    {dispatch.address}
                  </div>
                </div>

                <div className="dispatch-items">
                  {dispatch.items.map((item, idx) => (
                    <span key={idx} className="dispatch-item-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dispatch-card-footer">
                <span className="dispatch-detail">
                  {dispatch.itemCount} item{dispatch.itemCount > 1 ? "s" : ""}
                </span>
                <div className="dispatch-actions">
                  <button
                    className="dispatch-action-btn"
                    title="View details"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    className="dispatch-action-btn"
                    title="Call customer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </button>
                  <button
                    className="dispatch-action-btn"
                    title="Update status"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="dispatch-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <h3>No dispatches scheduled</h3>
            <p>There are no deliveries or pickups for the selected period.</p>
          </div>
        )}
      </div>
    </>
  );
}

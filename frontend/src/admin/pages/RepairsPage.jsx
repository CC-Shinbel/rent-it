import React, { useState, useEffect } from "react";
import "../styles/admin-components.css";
import "../styles/admin-globals.css";
import "../styles/admin-theme.css";
import "../styles/pages/admin-dashboard.css";
import "../styles/pages/admin-login.css";
import "../styles/pages/repairs.css";

export default function RepairsPage() {
  const [repairs, setRepairs] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockRepairs = [
      {
        id: "RPR-001",
        equipment: "KRK-001 Pro System",
        category: "karaoke",
        serial: "KRK-2024-001",
        issueType: "Audio Distortion",
        priority: "high",
        status: "in-progress",
        created: "2025-02-10",
        eta: "2025-02-15",
        cost: "₱2,500",
        description: "Audio distortion detected during quality check after last rental. Customer reported crackling sound at higher volumes. Suspected amplifier board issue requiring component-level diagnosis.",
        technician: "Mike Rodriguez",
        timeline: [
          { date: "2025-02-10", time: "10:30 AM", text: "Ticket created and assigned", status: "completed" },
          { date: "2025-02-11", time: "09:00 AM", text: "Initial inspection completed", status: "completed" },
          { date: "2025-02-12", time: "02:30 PM", text: "Components ordered, awaiting delivery", status: "completed" },
          { date: "2025-02-15", time: "04:00 PM", text: "Testing and quality assurance", status: "active" },
          { date: "2025-02-16", time: "10:00 AM", text: "Ready for return", status: "pending" }
        ]
      },
      {
        id: "RPR-002",
        equipment: "SPK-042 Bluetooth Speaker",
        category: "speakers",
        serial: "SPK-2024-042",
        issueType: "Power Issue",
        priority: "high",
        status: "awaiting-parts",
        created: "2025-02-09",
        eta: "2025-02-18",
        cost: "₱1,200",
        description: "Device won't power on. Battery may be defective. Replacement battery ordered awaiting arrival.",
        technician: "Sarah Chen",
        timeline: [
          { date: "2025-02-09", time: "03:15 PM", text: "Ticket created", status: "completed" },
          { date: "2025-02-10", time: "11:00 AM", text: "Diagnosed battery failure", status: "completed" },
          { date: "2025-02-12", time: "01:30 PM", text: "Replacement battery ordered", status: "active" },
          { date: "2025-02-18", time: "02:00 PM", text: "Installation and testing", status: "pending" }
        ]
      },
      {
        id: "RPR-003",
        equipment: "MIC-015 Professional Microphone",
        category: "microphones",
        serial: "MIC-2024-015",
        issueType: "Sound Quality",
        priority: "medium",
        status: "completed",
        created: "2025-02-01",
        eta: "2025-02-08",
        cost: "₱800",
        description: "Intermittent audio feedback issues. Replaced internal capacitors and recalibrated.",
        technician: "John Martinez",
        timeline: [
          { date: "2025-02-01", time: "09:45 AM", text: "Ticket created", status: "completed" },
          { date: "2025-02-02", time: "10:30 AM", text: "Diagnostic testing started", status: "completed" },
          { date: "2025-02-05", time: "03:00 PM", text: "Components replaced", status: "completed" },
          { date: "2025-02-08", time: "11:00 AM", text: "Quality assurance passed", status: "completed" }
        ]
      },
      {
        id: "RPR-004",
        equipment: "LGT-088 LED Lights",
        category: "lighting",
        serial: "LGT-2024-088",
        issueType: "Control Failure",
        priority: "low",
        status: "in-progress",
        created: "2025-02-11",
        eta: "2025-02-14",
        cost: "₱950",
        description: "DMX controller not responding. Suspected firmware issue. Updating controller software.",
        technician: "Alex Thompson",
        timeline: [
          { date: "2025-02-11", time: "02:30 PM", text: "Received and inspected", status: "completed" },
          { date: "2025-02-12", time: "09:00 AM", text: "Firmware update in progress", status: "active" },
          { date: "2025-02-14", time: "04:00 PM", text: "Final testing", status: "pending" }
        ]
      },
      {
        id: "RPR-005",
        equipment: "ACC-033 Cable Harness",
        category: "accessories",
        serial: "ACC-2024-033",
        issueType: "Physical Damage",
        priority: "medium",
        status: "to-remove",
        created: "2025-02-06",
        eta: "2025-02-13",
        cost: "₱450",
        description: "Heavy wear and fraying on connection points. Beyond economical repair. Recommend replacement.",
        technician: "Mike Rodriguez",
        timeline: [
          { date: "2025-02-06", time: "11:15 AM", text: "Damage assessment", status: "completed" },
          { date: "2025-02-07", time: "10:00 AM", text: "Deemed unrepairable", status: "completed" },
          { date: "2025-02-13", time: "09:00 AM", text: "Marked for removal from inventory", status: "active" }
        ]
      },
      {
        id: "RPR-006",
        equipment: "KRK-003 Karaoke System",
        category: "karaoke",
        serial: "KRK-2024-003",
        issueType: "Display Issue",
        priority: "low",
        status: "completed",
        created: "2025-01-28",
        eta: "2025-02-05",
        cost: "₱1,800",
        description: "LCD screen flickering intermittently. Replaced screen module and power supply.",
        technician: "Sarah Chen",
        timeline: [
          { date: "2025-01-28", time: "04:00 PM", text: "Customer reported issue", status: "completed" },
          { date: "2025-01-30", time: "09:30 AM", text: "Screen module replaced", status: "completed" },
          { date: "2025-02-03", time: "02:15 PM", text: "Testing completed", status: "completed" },
          { date: "2025-02-05", time: "11:00 AM", text: "Ready for rental", status: "completed" }
        ]
      },
      {
        id: "RPR-007",
        equipment: "SPK-051 Subwoofer",
        category: "speakers",
        serial: "SPK-2024-051",
        issueType: "No Power",
        priority: "high",
        status: "unavailable",
        created: "2025-01-15",
        eta: "N/A",
        cost: "₱3,200",
        description: "Multiple electrical malfunctions. Cost of repair exceeds 60% of replacement value. Marked unavailable.",
        technician: "John Martinez",
        timeline: [
          { date: "2025-01-15", time: "01:45 PM", text: "Received for repair", status: "completed" },
          { date: "2025-01-17", time: "11:00 AM", text: "Initial diagnosis", status: "completed" },
          { date: "2025-01-20", time: "03:30 PM", text: "Cost-benefit analysis", status: "completed" },
          { date: "2025-01-22", time: "09:00 AM", text: "Marked unavailable - units scrapped", status: "completed" }
        ]
      },
      {
        id: "RPR-008",
        equipment: "MIC-022 Wireless Microphone",
        category: "microphones",
        serial: "MIC-2024-022",
        issueType: "Frequency Issue",
        priority: "medium",
        status: "in-progress",
        created: "2025-02-08",
        eta: "2025-02-16",
        cost: "₱1,100",
        description: "Frequency module not syncing with receiver. Replacing frequency selector board.",
        technician: "Alex Thompson",
        timeline: [
          { date: "2025-02-08", time: "10:20 AM", text: "Ticket opened", status: "completed" },
          { date: "2025-02-10", time: "02:00 PM", text: "Module diagnosis completed", status: "completed" },
          { date: "2025-02-12", time: "10:30 AM", text: "Replacement board installed", status: "active" },
          { date: "2025-02-16", time: "03:00 PM", text: "Final calibration", status: "pending" }
        ]
      }
    ];
    setRepairs(mockRepairs);
  }, []);

  // Filter repairs
  useEffect(() => {
    let filtered = repairs;

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((r) => r.priority === priorityFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((r) => r.category === categoryFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(term) ||
          r.equipment.toLowerCase().includes(term) ||
          r.serial.toLowerCase().includes(term)
      );
    }

    setFilteredRepairs(filtered);
  }, [repairs, statusFilter, priorityFilter, categoryFilter, searchTerm]);

  const getStats = () => {
    const inProgress = repairs.filter((r) => r.status === "in-progress").length;
    const awaitingParts = repairs.filter((r) => r.status === "awaiting-parts").length;
    const completed = repairs.filter((r) => r.status === "completed").length;
    const unavailable = repairs.filter((r) => r.status === "unavailable").length;
    return { inProgress, awaitingParts, completed, unavailable };
  };

  const stats = getStats();

  const handleViewRepair = (repair) => {
    setSelectedRepair(repair);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRepair(null);
  };

  const handleEditRepair = () => {
    alert(`Edit repair ${selectedRepair.id}`);
  };

  const handleExport = () => {
    alert("Export repairs data to CSV");
  };

  const handleNewRepair = () => {
    alert("Create new repair ticket");
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      "in-progress": "in-progress",
      "awaiting-parts": "awaiting-parts",
      completed: "completed",
      "to-remove": "to-remove",
      unavailable: "unavailable"
    };
    return statusMap[status] || status;
  };

  const getPriorityBadgeClass = (priority) => {
    const priorityMap = {
      high: "high",
      medium: "medium",
      low: "low"
    };
    return priorityMap[priority] || priority;
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <svg
              className="page-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4z" />
              <circle cx="12" cy="2" r="1" />
            </svg>
            Repairs Management
          </h1>
          <p className="page-subtitle">
            Track equipment repairs, maintenance status, and availability
          </p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={handleExport} title="Export repairs data to CSV">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button className="btn btn-primary" onClick={handleNewRepair} title="Add new repair ticket">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Repair Ticket
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="repairs-stats">
        <div className="stat-card" title="Items currently under repair">
          <div className="stat-icon pending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card" title="Items waiting for repair">
          <div className="stat-icon warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.awaitingParts}</span>
            <span className="stat-label">Awaiting Parts</span>
          </div>
        </div>

        <div className="stat-card" title="Repairs completed">
          <div className="stat-icon success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card" title="Items set as unavailable">
          <div className="stat-icon danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.unavailable}</span>
            <span className="stat-label">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="repairs-controls admin-card">
        <div className="controls-left">
          <div className="search-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by item name or ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="controls-right">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="awaiting-parts">Awaiting Parts</option>
            <option value="completed">Completed</option>
            <option value="unavailable">Unavailable</option>
            <option value="to-remove">To Be Removed</option>
          </select>
          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="karaoke">Karaoke Systems</option>
            <option value="speakers">Speakers</option>
            <option value="microphones">Microphones</option>
            <option value="lighting">Lighting</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Repairs Table */}
      <div className="admin-card repairs-table-container">
        {filteredRepairs.length > 0 ? (
          <table className="admin-table repairs-table">
            <thead>
              <tr>
                <th title="Unique repair ticket ID">Ticket ID</th>
                <th title="Equipment under repair">Equipment</th>
                <th title="Type of issue">Issue Type</th>
                <th title="Priority level">Priority</th>
                <th title="Current repair status">Status</th>
                <th title="Date ticket was created">Created</th>
                <th title="Expected completion">ETA</th>
                <th title="Estimated repair cost">Est. Cost</th>
                <th title="Available actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepairs.map((repair) => (
                <tr key={repair.id}>
                  <td>
                    <span className="ticket-badge">{repair.id}</span>
                  </td>
                  <td>
                    <div className="equipment-details">
                      <span className="equipment-name">{repair.equipment}</span>
                      <span className="equipment-category">{repair.category}</span>
                    </div>
                  </td>
                  <td>
                    <span className="issue-badge">{repair.issueType}</span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(repair.priority)}`}>
                      {repair.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(repair.status)}`}>
                      {repair.status.replace("-", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="date-cell">{repair.created}</span>
                  </td>
                  <td>
                    <span className="date-cell">{repair.eta}</span>
                  </td>
                  <td>
                    <span className="cost-cell">{repair.cost}</span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewRepair(repair)}
                          title="View details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button className="action-btn edit-btn" title="Edit ticket">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        {repair.status === "completed" && (
                          <button className="action-btn available-btn" title="Mark as available">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                        )}
                        {repair.status === "in-progress" && (
                          <button className="action-btn complete-btn" title="Mark as complete">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                        )}
                        {repair.status === "awaiting-parts" && (
                          <button className="action-btn parts-btn" title="Parts arrived">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--admin-text-muted)" }}>
            No repairs found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination" style={{ display: filteredRepairs.length > 0 ? "flex" : "none" }}>
        <span className="pagination-info">Showing {filteredRepairs.length} repairs</span>
      </div>

      {/* Repair Detail Modal */}
      {modalOpen && selectedRepair && (
        <div className="modal active" id="repairModal">
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="modal-container repair-modal">
            <div className="modal-header">
              <h2 className="modal-title">Repair Details</h2>
              <button
                className="modal-close"
                onClick={handleCloseModal}
                title="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="repair-detail-grid">
                <div className="detail-section">
                  <h3>Equipment Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Ticket ID:</span>
                    <span className="detail-value">{selectedRepair.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Equipment:</span>
                    <span className="detail-value">{selectedRepair.equipment}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{selectedRepair.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Serial No:</span>
                    <span className="detail-value">{selectedRepair.serial}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Repair Status</h3>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${getStatusBadgeClass(selectedRepair.status)}`}>
                      {selectedRepair.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Priority:</span>
                    <span className={`priority-badge ${getPriorityBadgeClass(selectedRepair.priority)}`}>
                      {selectedRepair.priority}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Assigned To:</span>
                    <span className="detail-value">{selectedRepair.technician}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Est. Cost:</span>
                    <span className="detail-value">{selectedRepair.cost}</span>
                  </div>
                </div>
              </div>
              <div className="detail-section full-width">
                <h3>Issue Description</h3>
                <p>{selectedRepair.description}</p>
              </div>
              <div className="detail-section full-width">
                <h3>Repair Timeline</h3>
                <div className="timeline">
                  {selectedRepair.timeline.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className={`timeline-dot ${item.status}`}></div>
                      <div className="timeline-content">
                        <span className="timeline-date">{item.date} - {item.time}</span>
                        <span className="timeline-text">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleEditRepair}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

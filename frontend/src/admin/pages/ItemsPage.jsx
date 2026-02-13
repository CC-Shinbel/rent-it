import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-components.css";
import "../styles/admin-globals.css";
import "../styles/admin-theme.css";
import "../styles/pages/admin-dashboard.css";
import "../styles/pages/admin-login.css";
import "../styles/pages/item.css";

export default function ItemsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with API call
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        name: "Karaoke Pro System X-200",
        description: "Professional karaoke system with dual microphones",
        category: "Premium",
        dailyRate: 850,
        depositAmount: 3000,
        status: "Available",
        isVisible: true,
        isFeatured: true,
        tags: ["karaoke", "sound", "premium"],
        timesRented: 12,
        image: null,
      },
      {
        id: 2,
        name: "Portable Bluetooth Speaker",
        description: "Portable speaker with 8-hour battery",
        category: "Portable",
        dailyRate: 150,
        depositAmount: 500,
        status: "Available",
        isVisible: true,
        isFeatured: false,
        tags: ["bluetooth", "portable"],
        timesRented: 28,
        image: null,
      },
      {
        id: 3,
        name: "LED Projector 4K",
        description: "4K LED projector for events",
        category: "Professional",
        dailyRate: 1200,
        depositAmount: 5000,
        status: "Booked",
        isVisible: true,
        isFeatured: true,
        tags: ["projector", "4k", "professional"],
        timesRented: 15,
        image: null,
      },
      {
        id: 4,
        name: "Microphone Stand Pro",
        description: "Adjustable microphone stand",
        category: "Portable",
        dailyRate: 100,
        depositAmount: 300,
        status: "Under Maintenance",
        isVisible: false,
        isFeatured: false,
        tags: ["microphone", "stand"],
        timesRented: 8,
        image: null,
      },
    ];
    setItems(mockItems);
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = items;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.status.toLowerCase().includes(term)
      );
    }

    setFilteredItems(filtered);
  }, [items, statusFilter, searchTerm]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Available":
        return "status-success";
      case "Booked":
        return "status-info";
      case "Reserved":
        return "status-warning";
      case "Under Maintenance":
      case "Repairing":
        return "status-warning";
      case "Unavailable":
        return "status-danger";
      default:
        return "status-default";
    }
  };

  const handleRefresh = () => {
    // TODO: Implement API call to refresh items
    console.log("Refresh clicked");
  };

  const handleEditItem = (itemId) => {
    // TODO: Navigate to edit page
    console.log("Edit item:", itemId);
  };

  const handleRepairItem = (itemId) => {
    // TODO: Implement repair status update
    console.log("Set to repair:", itemId);
  };

  const handleSetUnavailable = (itemId) => {
    // TODO: Implement unavailable status update
    console.log("Set unavailable:", itemId);
  };

  const handleSetAvailable = (itemId) => {
    // TODO: Implement available status update
    console.log("Set available:", itemId);
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Items</h1>
          <p className="admin-page-subtitle">
            Manage all rental items available in the catalog
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            className="btn btn-primary"
            title="Add new item"
            onClick={() => navigate("/admin/newitem")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      <div className="items-toolbar">
        <div className="items-search">
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
            id="itemSearchInput"
            placeholder="Search items by name, category, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="items-filters">
          <select
            id="statusFilter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Reserved">Reserved</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Repairing">Repairing</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <button
            className="btn btn-secondary"
            id="refreshItemsBtn"
            title="Refresh items list"
            onClick={handleRefresh}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="items-table-container">
        <table className="admin-table items-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Category</th>
              <th>Pricing</th>
              <th>Status &amp; Visibility</th>
              <th>Tags</th>
              <th>Times Rented</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="itemsTableBody">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>
                  <div className="item-cell">
                    <div className="item-thumb">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="item-thumb-placeholder">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="24"
                            height="24"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-desc">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>
                  <div className="item-pricing">
                    <div className="price-main">₱{item.dailyRate}/day</div>
                    {item.depositAmount > 0 && (
                      <div className="price-deposit">
                        Deposit: ₱{item.depositAmount}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="item-status-visibility">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    <div className="visibility-badges">
                      {item.isVisible && (
                        <span className="visibility-badge visible">Visible</span>
                      )}
                      {!item.isVisible && (
                        <span className="visibility-badge hidden">Hidden</span>
                      )}
                      {item.isFeatured && (
                        <span className="visibility-badge featured">Featured</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="item-tags">
                    {item.tags && item.tags.length > 0 ? (
                      item.tags.map((tag, idx) => (
                        <span key={idx} className="item-tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="item-no-tags">No tags</span>
                    )}
                  </div>
                </td>
                <td>{item.timesRented}</td>
                <td>
                  <div className="item-actions">
                    <button
                      className="item-action-btn item-action-edit"
                      onClick={() => handleEditItem(item.id)}
                      title="Edit item"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="14"
                        height="14"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>

                    {item.status === "Available" && (
                      <>
                        <button
                          className="item-action-btn item-action-repair"
                          onClick={() => handleRepairItem(item.id)}
                          title="Mark as under repair"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="14"
                            height="14"
                          >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                          </svg>
                          Repair
                        </button>
                        <button
                          className="item-action-btn item-action-unavailable"
                          onClick={() => handleSetUnavailable(item.id)}
                          title="Mark as unavailable"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="14"
                            height="14"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          Unavailable
                        </button>
                      </>
                    )}

                    {(item.status === "Repairing" ||
                      item.status === "Under Maintenance") && (
                      <button
                        className="item-action-btn item-action-available"
                        onClick={() => handleSetAvailable(item.id)}
                        title="Mark as available"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Available
                      </button>
                    )}

                    {item.status === "Unavailable" && (
                      <button
                        className="item-action-btn item-action-available"
                        onClick={() => handleSetAvailable(item.id)}
                        title="Mark as available"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Available
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import '../styles/pages/history.css';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Mock history data
  useEffect(() => {
    const mockData = [
      {
        order_id: 101,
        id: 'ORD-2026-00101',
        customer: {
          name: 'John Dela Cruz',
          email: 'john.dela@email.com',
          avatar: null
        },
        items: [
          { name: 'Karaoke System Pro', quantity: 1 },
          { name: 'Wireless Mics (2x)', quantity: 2 }
        ],
        dates: {
          start: '2026-01-15',
          end: '2026-01-20',
          duration: 5
        },
        total: 2500,
        status: 'returned'
      },
      {
        order_id: 102,
        id: 'ORD-2026-00102',
        customer: {
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          avatar: null
        },
        items: [
          { name: 'DJ Speaker System', quantity: 1 }
        ],
        dates: {
          start: '2026-01-18',
          end: '2026-01-23',
          duration: 5
        },
        total: 1800,
        status: 'completed'
      },
      {
        order_id: 103,
        id: 'ORD-2026-00103',
        customer: {
          name: 'Robert Tanaka',
          email: 'robert.tanaka@email.com',
          avatar: null
        },
        items: [
          { name: 'LED Lighting Kit', quantity: 1 },
          { name: 'Light Stand (3x)', quantity: 3 }
        ],
        dates: {
          start: '2026-01-20',
          end: '2026-01-25',
          duration: 5
        },
        total: 3200,
        status: 'returned'
      },
      {
        order_id: 104,
        id: 'ORD-2026-00104',
        customer: {
          name: 'Sophie Miller',
          email: 'sophie.m@email.com',
          avatar: null
        },
        items: [
          { name: 'Portable Monitor Speaker', quantity: 1 }
        ],
        dates: {
          start: '2026-02-01',
          end: '2026-02-05',
          duration: 4
        },
        total: 1200,
        status: 'returned'
      },
      {
        order_id: 105,
        id: 'ORD-2026-00105',
        customer: {
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          avatar: null
        },
        items: [
          { name: 'Karaoke System Pro', quantity: 1 }
        ],
        dates: {
          start: '2026-02-03',
          end: '2026-02-08',
          duration: 5
        },
        total: 2200,
        status: 'returned'
      },
      {
        order_id: 106,
        id: 'ORD-2026-00106',
        customer: {
          name: 'Elena Rodriguez',
          email: 'elena.r@email.com',
          avatar: null
        },
        items: [
          { name: 'DJ Mixer Console', quantity: 1 },
          { name: 'Turntable Set (2x)', quantity: 2 }
        ],
        dates: {
          start: '2026-02-05',
          end: '2026-02-10',
          duration: 5
        },
        total: 4500,
        status: 'completed'
      },
      {
        order_id: 107,
        id: 'ORD-2026-00107',
        customer: {
          name: 'James Wilson',
          email: 'james.w@email.com',
          avatar: null
        },
        items: [
          { name: 'Wireless Microphone System', quantity: 1 }
        ],
        dates: {
          start: '2026-02-08',
          end: '2026-02-12',
          duration: 4
        },
        total: 950,
        status: 'returned'
      },
      {
        order_id: 108,
        id: 'ORD-2026-00108',
        customer: {
          name: 'Lisa Park',
          email: 'lisa.park@email.com',
          avatar: null
        },
        items: [
          { name: 'Stage Lighting Rig', quantity: 1 }
        ],
        dates: {
          start: '2026-02-09',
          end: '2026-02-13',
          duration: 4
        },
        total: 3400,
        status: 'returned'
      },
      {
        order_id: 109,
        id: 'ORD-2026-00109',
        customer: {
          name: 'David Brown',
          email: 'david.b@email.com',
          avatar: null
        },
        items: [
          { name: 'Professional Amplifier', quantity: 2 }
        ],
        dates: {
          start: '2026-02-10',
          end: '2026-02-13',
          duration: 3
        },
        total: 2100,
        status: 'completed'
      },
      {
        order_id: 110,
        id: 'ORD-2026-00110',
        customer: {
          name: 'Nina Martinez',
          email: 'nina.m@email.com',
          avatar: null
        },
        items: [
          { name: 'Audio Console', quantity: 1 }
        ],
        dates: {
          start: '2026-02-11',
          end: '2026-02-13',
          duration: 2
        },
        total: 1650,
        status: 'returned'
      }
    ];

    setHistoryData(mockData);
  }, []);

  // Filter history based on search and filters
  useEffect(() => {
    let filtered = historyData;

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(lowerSearch) ||
        order.customer.name.toLowerCase().includes(lowerSearch) ||
        order.customer.email.toLowerCase().includes(lowerSearch) ||
        order.items.some(item => item.name.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.dates.end);

        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredHistoryData(filtered);
    setCurrentPage(1);
  }, [historyData, searchTerm, statusFilter, dateFilter]);

  // Get KPI stats
  const getStats = () => {
    const completed = historyData.filter(o => o.status === 'returned' || o.status === 'completed').length;
    const revenue = historyData.reduce((sum, o) => sum + o.total, 0);
    return { completed, revenue };
  };

  const stats = getStats();

  // Pagination
  const totalPages = Math.ceil(filteredHistoryData.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredHistoryData.slice(start, start + PAGE_SIZE);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return '₱' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  const handleViewOrder = (orderId) => {
    alert(`Viewing order details for order ${orderId}`);
  };

  const handleDeleteHistory = (orderId, orderLabel) => {
    if (window.confirm(`Are you sure you want to delete ${orderLabel}? This will permanently remove this completed transaction.`)) {
      setHistoryData(prev => prev.filter(o => o.order_id !== orderId));
      alert('History record deleted successfully');
    }
  };

  const handleExport = () => {
    alert('Export functionality would generate a CSV/PDF of the rental history.');
  };

  const handleRefresh = () => {
    alert('History refreshed');
  };

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Rental History</h1>
          <p className="admin-page-subtitle">View all completed and returned rental orders</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-secondary" onClick={handleExport} title="Export history data">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="btn btn-secondary" onClick={handleRefresh} title="Refresh history">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="history-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Completed</div>
            <div className="kpi-value">{stats.completed}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <text x="12" y="17" textAnchor="middle" fontSize="16" fontWeight="bold" fill="currentColor" stroke="none">₱</text>
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Revenue</div>
            <div className="kpi-value">{formatCurrency(stats.revenue)}</div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="history-toolbar">
        <div className="history-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by order ID, customer, or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="history-filters">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="returned">Returned</option>
          </select>
          <select
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="history-table-container">
        <table className="admin-table history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Rental Period</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="history-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <h3 className="history-empty-title">No completed rentals found</h3>
                    <p className="history-empty-text">Completed and returned orders will appear here</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map(order => {
                const initial = getInitial(order.customer.name);
                const itemsText = order.items.length === 0
                  ? 'No items'
                  : order.items.length === 1
                    ? order.items[0].name
                    : `${order.items[0].name} +${order.items.length - 1} more`;
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <tr key={order.order_id} data-order-id={order.order_id}>
                    <td>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleViewOrder(order.order_id); }} className="order-id">{order.id}</a>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {initial}
                        </div>
                        <div className="customer-info">
                          <span className="customer-name">{order.customer.name}</span>
                          <span className="customer-email">{order.customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="items-cell">
                        <span className="item-name">{itemsText}</span>
                        <span className="item-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td>
                      <div className="dates-cell">
                        <span className="date-range">{formatDate(order.dates.start)} - {formatDate(order.dates.end)}</span>
                        <span className="date-duration">{order.dates.duration} day{order.dates.duration !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td>
                      <span className="total-amount">{formatCurrency(order.total)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === 'returned' ? 'Returned' : 'Completed'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn view"
                          title="View order details"
                          onClick={() => handleViewOrder(order.order_id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete history record"
                          onClick={() => handleDeleteHistory(order.order_id, order.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredHistoryData.length > 0 && (
        <div className="history-pagination">
          <span className="pagination-info">
            Showing {start + 1}-{Math.min(start + PAGE_SIZE, filteredHistoryData.length)} of {filteredHistoryData.length} records
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span className="pagination-pages">
              {generatePageNumbers().map((page, idx) => {
                if (page === '...') {
                  return <span key={idx} className="page-dots">...</span>;
                }
                return (
                  <button
                    key={idx}
                    className={`page-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryPage;

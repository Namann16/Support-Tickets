import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your tickets');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/tickets/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      } else {
        setError('Failed to fetch tickets');
      }
    } catch (err) {
      setError('Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { class: 'badge-open', icon: ClockIcon, text: 'Open' },
      in_progress: { class: 'badge-in-progress', icon: ExclamationTriangleIcon, text: 'In Progress' },
      resolved: { class: 'badge-resolved', icon: CheckCircleIcon, text: 'Resolved' },
      closed: { class: 'badge-closed', icon: XCircleIcon, text: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.open;
    const Icon = config.icon;

    return (
      <span className={`badge ${config.class}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      critical: { class: 'badge-critical', text: 'Critical' },
      high: { class: 'badge-high', text: 'High' },
      medium: { class: 'badge-medium', text: 'Medium' },
      low: { class: 'badge-low', text: 'Low' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;

    return { total, open, inProgress, resolved };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="loading">
          <div className="spinner"></div>
          Loading your tickets...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="card-title">My Support Tickets</h1>
              <p className="card-subtitle">
                Track the status of your support requests
              </p>
            </div>
            <button
              onClick={fetchTickets}
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid mb-6">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-input form-select"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your filters'}
            </h3>
            <p className="text-gray-600">
              {tickets.length === 0 
                ? 'Submit your first support ticket to get started.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="ticket-list">
            {filteredTickets.map(ticket => (
              <div key={ticket._id} className="ticket-item">
                <div className="ticket-header">
                  <div className="flex-1">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <div className="ticket-meta">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                      <span className="text-sm text-gray-500">
                        #{ticket._id.slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="ticket-description">
                  {ticket.description.length > 200 
                    ? `${ticket.description.substring(0, 200)}...`
                    : ticket.description
                  }
                </p>
                
                <div className="ticket-footer">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Created: {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                    </span>
                    {ticket.updatedAt !== ticket.createdAt && (
                      <span className="text-sm text-gray-500">
                        Updated: {format(new Date(ticket.updatedAt), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                  
                  {ticket.assignedTo && (
                    <div className="text-sm text-gray-500">
                      Assigned to: {ticket.assignedTo.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList; 
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  UsersIcon, 
  TicketIcon, 
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserPlusIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Fetch tickets and users
      const [ticketsRes, usersRes] = await Promise.all([
        fetch('/api/tickets', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (ticketsRes.ok && usersRes.ok) {
        const ticketsData = await ticketsRes.json();
        const usersData = await usersRes.json();
        setTickets(ticketsData.data || []);
        setUsers(usersData.data || []);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
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
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getDashboardStats = () => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      totalUsers,
      activeUsers
    };
  };

  const stats = getDashboardStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="loading">
          <div className="spinner"></div>
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
              <CogIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="card-title">Admin Panel</h1>
              <p className="card-subtitle">
                Manage tickets, users, and system settings
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChartBarIcon className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TicketIcon className="w-4 h-4 inline mr-2" />
            Tickets
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UsersIcon className="w-4 h-4 inline mr-2" />
            Users
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid mb-8">
              <div className="stat-card">
                <div className="stat-number">{stats.totalTickets}</div>
                <div className="stat-label">Total Tickets</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.openTickets}</div>
                <div className="stat-label">Open Tickets</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.inProgressTickets}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.resolvedTickets}</div>
                <div className="stat-label">Resolved</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.activeUsers}</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
                <div className="space-y-3">
                  {tickets.slice(0, 5).map(ticket => (
                    <div key={ticket._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map(user => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <span className={`badge ${user.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">All Tickets</h3>
              <button onClick={fetchData} className="btn btn-secondary btn-sm">
                Refresh
              </button>
            </div>

            <div className="ticket-list">
              {tickets.map(ticket => (
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
                      {ticket.assignedTo && (
                        <span className="text-sm text-gray-500">
                          Assigned to: {ticket.assignedTo.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-secondary">
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">User Management</h3>
              <button className="btn btn-primary btn-sm">
                <UserPlusIcon className="w-4 h-4" />
                Add User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          user.role === 'admin' ? 'badge-critical' :
                          user.role === 'agent' ? 'badge-high' : 'badge-medium'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${user.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-secondary">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 
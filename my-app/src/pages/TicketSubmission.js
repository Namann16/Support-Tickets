import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TicketIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const TicketSubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Please log in to submit a ticket' });
        setLoading(false);
        return;
      }

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Ticket submitted successfully!' });
        setFormData({
          title: '',
          description: '',
          priority: 'medium'
        });
        
        // Redirect to tickets list after a short delay
        setTimeout(() => {
          navigate('/tickets');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit ticket' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="card-title">Submit a Support Ticket</h1>
              <p className="card-subtitle">
                Tell us about your issue and we'll help you resolve it quickly
              </p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'} mb-6`}>
            <div className="flex items-center gap-2">
              {message.type === 'error' ? (
                <ExclamationTriangleIcon className="w-5 h-5" />
              ) : (
                <CheckCircleIcon className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Tips for faster resolution:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific and detailed in your description</li>
                <li>• Include any error messages or screenshots if applicable</li>
                <li>• Choose the appropriate priority level</li>
                <li>• Provide steps to reproduce the issue</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">
              Ticket Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Brief summary of your issue"
              required
              maxLength={100}
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.title.length}/100 characters
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Priority Level *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="form-input form-select"
              required
            >
              <option value="low">Low - General inquiry or feature request</option>
              <option value="medium">Medium - Minor issue or bug</option>
              <option value="high">High - Important issue affecting workflow</option>
              <option value="critical">Critical - System down or major functionality broken</option>
            </select>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input form-textarea"
              placeholder="Please provide a detailed description of your issue. Include any error messages, steps to reproduce, and what you were trying to accomplish."
              required
              rows={6}
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.description.length}/1000 characters
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Submitting Ticket...
                </>
              ) : (
                <>
                  <TicketIcon className="w-5 h-5" />
                  Submit Ticket
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="btn btn-secondary"
            >
              View My Tickets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketSubmission; 
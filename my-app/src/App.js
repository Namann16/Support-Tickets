import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  TicketIcon, 
  UserGroupIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import TicketSubmission from './pages/TicketSubmission';
import TicketList from './pages/TicketList';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import { decodeToken } from './utils/auth';
import './App.css';

function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role || null);
      setUser(decoded);
      
      // Token expiration check
      if (decoded?.exp && Date.now() / 1000 > decoded.exp) {
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
        setUser(null);
        alert('Session expired. Please log in again.');
      }
    } else {
      setRole(null);
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  // Protect Admin Panel route
  const ProtectedRoute = ({ children, adminOnly }) => {
    if (!token) return <Navigate to="/auth" replace />;
    if (adminOnly && role !== 'admin') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-content">
            <Link to="/" className="nav-brand">
              <TicketIcon className="w-8 h-8 text-blue-600" />
              <span>Support Hub</span>
            </Link>
            
            <div className="nav-links">
              <Link to="/" className="nav-link">
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              {token && (
                <>
                  <Link to="/tickets" className="nav-link">
                    <ClipboardDocumentListIcon className="w-5 h-5" />
                    <span>My Tickets</span>
                  </Link>
                  
                  {role === 'admin' && (
                    <Link to="/admin" className="nav-link">
                      <CogIcon className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </>
              )}
              
              {token ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Welcome, {user?.name || 'User'}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="btn btn-primary btn-sm">
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container">
          <Routes>
            <Route path="/" element={<TicketSubmission />} />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <TicketList />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

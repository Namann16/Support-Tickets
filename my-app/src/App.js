import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import TicketSubmission from './pages/TicketSubmission';
import TicketList from './pages/TicketList';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import { decodeToken } from './utils/auth';
import logo from './logo.svg';
import './App.css';

function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role || null);
      // Token expiration check
      if (decoded?.exp && Date.now() / 1000 > decoded.exp) {
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
        alert('Session expired. Please log in again.');
      }
    } else {
      setRole(null);
    }
  }, [token]);

  // Protect Admin Panel route
  const ProtectedRoute = ({ children, adminOnly }) => {
    if (!token) return <Navigate to="/auth" replace />;
    if (adminOnly && role !== 'admin') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Submit Ticket</Link>
        <Link to="/tickets" style={{ marginRight: '1rem' }}>Ticket List</Link>
        {role === 'admin' && <Link to="/admin" style={{ marginRight: '1rem' }}>Admin Panel</Link>}
        <Link to="/auth">Login/Register</Link>
        {token && <button style={{ marginLeft: '1rem' }} onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<TicketSubmission />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;

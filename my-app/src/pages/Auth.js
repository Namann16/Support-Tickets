import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    customerId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (!isLogin && !formData.customerId) {
      setMessage({ type: 'error', text: 'Customer ID is required for registration' });
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password,
            customerId: formData.customerId 
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.data?.token) {
          localStorage.setItem('token', data.data.token);
          setMessage({ type: 'success', text: 'Success! Redirecting...' });
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage({ type: 'success', text: 'Success! Please log in.' });
          setIsLogin(true);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Authentication failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      customerId: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-header text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="card-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="card-subtitle">
              {isLogin ? 'Sign in to your account' : 'Join our support platform'}
            </p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'} mb-4`}>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Customer ID
                </label>
                <input
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your customer ID"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <LockClosedIcon className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <LockClosedIcon className="w-4 h-4 inline mr-2" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 
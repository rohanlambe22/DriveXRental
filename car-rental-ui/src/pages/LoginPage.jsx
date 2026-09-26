import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Sparkles, UserCheck, Shield } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const userInfo = await login(email, password);
      if (userInfo.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick 1-click Demo Fillers for Interview Presentation
  const fillCustomerDemo = () => {
    setEmail('john@example.com');
    setPassword('Customer@123');
  };

  const fillAdminDemo = () => {
    setEmail('admin@carrental.com');
    setPassword('Admin@123');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to manage reservations or rent a vehicle</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary btn-full">
            <LogIn size={18} />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Pre-fill Box for Interviews */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <Sparkles size={16} /> Interview Quick Fill:
          </div>
          <div className="demo-buttons">
            <button type="button" onClick={fillCustomerDemo} className="btn-demo-chip">
              <UserCheck size={14} /> Fill Customer Credentials
            </button>
            <button type="button" onClick={fillAdminDemo} className="btn-demo-chip admin">
              <Shield size={14} /> Fill Admin Credentials
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
};

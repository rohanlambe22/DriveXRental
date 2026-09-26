import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, Shield, CalendarCheck, LogIn, UserPlus } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <Car className="brand-icon" />
          <span>DriveX<span className="brand-accent">Rental</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Browse Fleet
          </Link>

          {isAuthenticated && (
            <Link to="/my-bookings" className={`nav-item ${isActive('/my-bookings') ? 'active' : ''}`}>
              <CalendarCheck className="nav-icon" />
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className={`nav-item admin-badge ${isActive('/admin') ? 'active' : ''}`}>
              <Shield className="nav-icon" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* User Account Controls */}
        <div className="auth-controls">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-info">
                <User className="user-avatar" />
                <div>
                  <div className="user-name">{user.fullName}</div>
                  <div className="user-role">{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut className="btn-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <LogIn className="btn-icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn-register">
                <UserPlus className="btn-icon" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

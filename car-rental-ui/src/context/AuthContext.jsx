import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate session from localStorage on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user credentials:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userInfo = {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };

    setToken(data.token);
    setUser(userInfo);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (fullName, email, password, role) => {
    const data = await authService.register(fullName, email, password, role);
    const userInfo = {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };

    setToken(data.token);
    setUser(userInfo);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'Admin';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

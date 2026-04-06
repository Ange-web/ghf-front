"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext(null);

// Helper to format API errors
function formatApiErrorDetail(detail) {
  if (detail == null) return "Une erreur est survenue. Veuillez réessayer.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = checking, false = not authenticated, object = authenticated
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data);
    } catch (error) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post(
        '/api/auth/login',
        { email, password }
      );
      if (data.access_token) localStorage.setItem('token', data.access_token);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      const message = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post(
        '/api/auth/register',
        { name, email, password }
      );
      if (data.access_token) localStorage.setItem('token', data.access_token);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      const message = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      const { data: updatedUser } = await api.put(
        '/api/auth/profile',
        data
      );
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      const message = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile,
      isAuthenticated: !!user && user !== false,
      isAdmin: user?.role?.toLowerCase() === 'admin' || user?.user?.role?.toLowerCase() === 'admin' || user?.is_admin === true || user?.user?.is_admin === true,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

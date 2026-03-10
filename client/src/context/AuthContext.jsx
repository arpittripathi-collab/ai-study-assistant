import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('study_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a token in local storage on boot, we assume they are logged in.
    // In a production app, we would verify this token with a /api/auth/me route.
    if (token) {
      const savedUser = localStorage.getItem('study_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser({ _id: data._id, email: data.email });
      setToken(data.token);
      localStorage.setItem('study_token', data.token);
      localStorage.setItem('study_user', JSON.stringify({ _id: data._id, email: data.email }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { email, password });
      setUser({ _id: data._id, email: data.email });
      setToken(data.token);
      localStorage.setItem('study_token', data.token);
      localStorage.setItem('study_user', JSON.stringify({ _id: data._id, email: data.email }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('study_token');
    localStorage.removeItem('study_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

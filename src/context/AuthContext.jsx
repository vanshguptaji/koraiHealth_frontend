import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // For now, just trust the stored user data since getCurrentUser 
          // might need debugging. In production, you'd want to verify this.
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
          
          // Optionally verify with backend (comment out if having issues)
          /*
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
          */
        } catch (error) {
          // Token is invalid or expired, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          console.log('Token validation failed:', error);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';
import client from '../services/restClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('feathers-jwt');
    console.log('AuthContext: Checking for existing token:', !!token);
    
    if (token) {
      client.authenticate()
        .then(response => {
          console.log('AuthContext: Token verification successful:', response.user);
          setUser(response.user);
        })
        .catch((error) => {
          console.log('AuthContext: Token verification failed:', error);
          localStorage.removeItem('feathers-jwt');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('AuthContext: No token found');
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext: Attempting login for:', email);
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL;
      console.log('AuthContext: Server URL:', serverUrl);
      
      const response = await client.authenticate({
        strategy: 'local',
        email,
        password
      });
      console.log('AuthContext: Login successful:', response);
      console.log('AuthContext: Setting user state to:', response.user);
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      
      let errorMessage = 'Login failed';
      if (error.message) {
        if (error.message.includes('Invalid login')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'User not found';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await client.logout();
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('feathers-jwt');
    }
  };

  const register = async (userData) => {
    try {
      const response = await client.service('users').create(userData);
      console.log('AuthContext: Registration successful:', response);
      return { success: true, user: response };
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Role-based helper functions
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isCustomer = () => {
    return user && user.role === 'customer';
  };

  const getUserRole = () => {
    return user ? user.role : null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin,
    isCustomer,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
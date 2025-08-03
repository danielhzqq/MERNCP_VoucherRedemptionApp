import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CustomerProtectedRoute = ({ children, redirectPath = '/customer/login' }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('CustomerProtectedRoute: user =', user, 'loading =', loading);

  if (loading) {
    console.log('CustomerProtectedRoute: Still loading...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('CustomerProtectedRoute: No user, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('CustomerProtectedRoute: User authenticated, rendering children');
  return children;
};

export default CustomerProtectedRoute; 
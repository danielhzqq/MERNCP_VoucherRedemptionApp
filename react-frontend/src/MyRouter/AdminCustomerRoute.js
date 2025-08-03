import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminCustomerRoute = ({ children, redirectPath = '/customer/login' }) => {
  const { user, loading, isAdmin, isCustomer } = useContext(AuthContext);

  console.log('AdminCustomerRoute: user =', user, 'loading =', loading, 'isAdmin =', isAdmin(), 'isCustomer =', isCustomer());

  if (loading) {
    console.log('AdminCustomerRoute: Still loading...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('AdminCustomerRoute: No user, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Allow both admin and customer users to access this route
  if (isAdmin() || isCustomer()) {
    console.log('AdminCustomerRoute: User authorized (admin or customer), rendering children');
    return children;
  }

  console.log('AdminCustomerRoute: User not authorized, redirecting to:', redirectPath);
  return <Navigate to={redirectPath} replace />;
};

export default AdminCustomerRoute; 
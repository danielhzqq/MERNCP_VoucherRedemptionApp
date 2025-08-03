import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AuthContext } from '../../context/AuthContext';

const AdminCustomerSwitch = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Only show this component for admin users
  if (!user || !isAdmin()) {
    return null;
  }

  const handleAdminMode = () => {
    navigate('/admin/dashboard');
  };

  const handleCustomerMode = () => {
    navigate('/customer/home');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="shadow-xl border-0 bg-white">
        <div className="p-4">
          <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i className="pi pi-sync text-blue-600"></i>
            Switch Mode
          </div>
          <div className="space-y-3">
            <Button
              label="Admin Mode"
              icon="pi pi-shield"
              className="p-button-sm p-button-outlined w-full"
              onClick={handleAdminMode}
              style={{ borderColor: '#3B82F6', color: '#3B82F6' }}
            />
            <Button
              label="Customer Mode"
              icon="pi pi-user"
              className="p-button-sm p-button-outlined w-full"
              onClick={handleCustomerMode}
              style={{ borderColor: '#10B981', color: '#10B981' }}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Quick access for admin users
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCustomerSwitch; 
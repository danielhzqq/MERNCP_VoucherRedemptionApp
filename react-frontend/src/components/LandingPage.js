import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import CarterRewardsLogo from './common/CarterRewardsLogo';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CarterRewardsLogo size="xlarge" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CarterRewards Voucher System</h1>
          <p className="text-xl text-gray-600 mb-8">Welcome to our elegant rewards management platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Portal Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-user text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Customer Portal</h2>
              <p className="text-gray-600 mb-6">
                Browse and redeem vouchers, manage your account, and track your redemption history.
              </p>
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>Browse available vouchers</span>
                </div>
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>Redeem vouchers with points</span>
                </div>
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>Download PDF certificates</span>
                </div>
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>View redemption history</span>
                </div>
              </div>
              <Button
                label="Access Customer Portal"
                icon="pi pi-arrow-right"
                className="w-full"
                onClick={() => navigate('/customer/login')}
              />
            </div>
          </Card>

          {/* Admin Portal Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-shield text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Admin Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage vouchers, users, and system analytics. Full administrative control.
              </p>
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>Create and manage vouchers</span>
                </div>
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>User account management</span>
                </div>
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>System analytics and reports</span>
                </div>
                <div className="flex items-center">
                  <i className="pi pi-check-circle text-primary mr-3"></i>
                  <span>Transaction monitoring</span>
                </div>
              </div>
              <Button
                label="Access Admin Portal"
                icon="pi pi-arrow-right"
                className="w-full p-button-outlined"
                onClick={() => navigate('/admin/login')}
              />
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © 2024 CarterRewards. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 
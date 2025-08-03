import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { emailRegex } from '../../utils/regex';
import client from '../../services/restClient';
import CarterRewardsLogo from '../common/CarterRewardsLogo';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [maskPassword, setMaskPassword] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('feathers-jwt');
    if (token) {
      // Verify if user has admin role
      client.authenticate()
        .then(response => {
          if (response.user && response.user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          }
        })
        .catch(() => {
          // Token invalid, stay on login page
        });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateLogin()) {
      setLoading(false);
      return;
    }

    try {
      const response = await client.authenticate({
        strategy: 'local',
        email,
        password
      });

      // Check if user has admin role
      if (response.user && response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        await client.logout();
      }
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Invalid credentials or insufficient permissions');
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CarterRewardsLogo size="large" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CarterRewards Admin Portal</h1>
            <p className="text-gray-600">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <Message 
              severity="error" 
              text={error} 
              className="mb-4"
            />
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={onEnter}
                className="w-full"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <InputText
                  id="password"
                  type={maskPassword ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={onEnter}
                  className="w-full pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setMaskPassword(!maskPassword)}
                >
                  <i className={`pi ${maskPassword ? 'pi-eye' : 'pi-eye-slash'}`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.checked)}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              label={loading ? "Signing in..." : "Sign In"}
              icon={loading ? "pi pi-spinner pi-spin" : "pi pi-sign-in"}
              className="w-full"
              loading={loading}
              disabled={loading}
            />
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact system administrator
            </p>
            <div className="mt-4 space-y-2">
              <Button
                label="Back to Customer Portal"
                icon="pi pi-arrow-left"
                className="p-button-text p-button-sm"
                onClick={() => navigate('/customer/login')}
              />
              <div className="text-xs text-gray-400 mt-2">
                Admin users can also access customer features
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin; 
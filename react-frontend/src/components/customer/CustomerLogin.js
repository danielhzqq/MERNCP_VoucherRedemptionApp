import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { emailRegex } from "../../utils/regex";
import client from "../../services/restClient";
import CarterRewardsLogo from "../common/CarterRewardsLogo";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    aboutMe: ''
  });
  const [signUpErrors, setSignUpErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [maskPassword, setMaskPassword] = useState(true);
  const [maskSignUpPassword, setMaskSignUpPassword] = useState(true);
  const [maskConfirmPassword, setMaskConfirmPassword] = useState(true);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('feathers-jwt');
    if (token) {
      // Allow both admin and customer users to access customer areas
      client.authenticate()
        .then(response => {
          if (response.user) {
            navigate('/customer/home', { replace: true });
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
      const result = await login(email, password);
      if (result.success) {
        // Allow both admin and customer users to access customer areas
        navigate('/customer/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateSignUp()) {
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const existingUser = await client.service('users').find({
        query: { email: signUpData.email }
      });
      
      if (existingUser.data.length > 0) {
        setError('User with this email already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = await client.service('users').create({
        email: signUpData.email,
        name: signUpData.name,
        username: signUpData.username,
        phoneNumber: signUpData.phoneNumber,
        password: signUpData.password,
        address: signUpData.address,
        aboutMe: signUpData.aboutMe,
        isActive: true,
        points: 0
      });

      // Auto-login after successful signup
      const loginResult = await login(signUpData.email, signUpData.password);
      if (loginResult.success) {
        navigate('/customer/home');
      } else {
        setError('Account created successfully! Please log in.');
        setShowSignUp(false);
      }
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = () => {
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const validateSignUp = () => {
    const errors = {};
    
    if (!signUpData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!emailRegex.test(signUpData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!signUpData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (signUpData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const setSignUpField = (field, value) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
    if (signUpErrors[field]) {
      setSignUpErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      if (showSignUp) {
        handleSignUp(e);
      } else {
        handleLogin(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <CarterRewardsLogo size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {showSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {showSignUp 
                ? 'Join CarterRewards to start redeeming amazing vouchers!' 
                : 'Sign in to your CarterRewards account'
              }
            </p>
          </div>

          {error && (
            <Message 
              severity="error" 
              text={error} 
              className="mb-4"
            />
          )}

          {!showSignUp ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <InputText
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={onEnter}
                  className="w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <InputText
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
                    onClick={() => setMaskPassword(!maskPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`pi ${maskPassword ? 'pi-eye' : 'pi-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.checked)}
                    id="rememberMe"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/reset" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                label="Sign In"
                className="w-full"
                loading={loading}
                disabled={loading}
              />

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowSignUp(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <InputText
                  value={signUpData.name}
                  onChange={(e) => setSignUpField('name', e.target.value)}
                  onKeyPress={onEnter}
                  className={`w-full ${signUpErrors.name ? 'p-invalid' : ''}`}
                  placeholder="Enter your full name"
                  required
                />
                {signUpErrors.name && (
                  <small className="p-error">{signUpErrors.name}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <InputText
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpField('email', e.target.value)}
                  onKeyPress={onEnter}
                  className={`w-full ${signUpErrors.email ? 'p-invalid' : ''}`}
                  placeholder="Enter your email address"
                  required
                />
                {signUpErrors.email && (
                  <small className="p-error">{signUpErrors.email}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <InputText
                  value={signUpData.username}
                  onChange={(e) => setSignUpField('username', e.target.value)}
                  onKeyPress={onEnter}
                  className={`w-full ${signUpErrors.username ? 'p-invalid' : ''}`}
                  placeholder="Choose a username"
                  required
                />
                {signUpErrors.username && (
                  <small className="p-error">{signUpErrors.username}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <InputText
                  value={signUpData.phoneNumber}
                  onChange={(e) => setSignUpField('phoneNumber', e.target.value)}
                  onKeyPress={onEnter}
                  className="w-full"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <InputText
                    type={maskSignUpPassword ? "password" : "text"}
                    value={signUpData.password}
                    onChange={(e) => setSignUpField('password', e.target.value)}
                    onKeyPress={onEnter}
                    className={`w-full pr-10 ${signUpErrors.password ? 'p-invalid' : ''}`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMaskSignUpPassword(!maskSignUpPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`pi ${maskSignUpPassword ? 'pi-eye' : 'pi-eye-slash'}`}></i>
                  </button>
                </div>
                {signUpErrors.password && (
                  <small className="p-error">{signUpErrors.password}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <InputText
                    type={maskConfirmPassword ? "password" : "text"}
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpField('confirmPassword', e.target.value)}
                    onKeyPress={onEnter}
                    className={`w-full pr-10 ${signUpErrors.confirmPassword ? 'p-invalid' : ''}`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMaskConfirmPassword(!maskConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`pi ${maskConfirmPassword ? 'pi-eye' : 'pi-eye-slash'}`}></i>
                  </button>
                </div>
                {signUpErrors.confirmPassword && (
                  <small className="p-error">{signUpErrors.confirmPassword}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <InputTextarea
                  value={signUpData.address}
                  onChange={(e) => setSignUpField('address', e.target.value)}
                  onKeyPress={onEnter}
                  className="w-full"
                  placeholder="Enter your address"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>
                <InputTextarea
                  value={signUpData.aboutMe}
                  onChange={(e) => setSignUpField('aboutMe', e.target.value)}
                  onKeyPress={onEnter}
                  className="w-full"
                  placeholder="Tell us about yourself (optional)"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                label="Create Account"
                className="w-full"
                loading={loading}
                disabled={loading}
              />

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowSignUp(false)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomerLogin; 
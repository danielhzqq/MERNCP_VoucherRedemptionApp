import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import client from '../../services/restClient';
import { emailRegex } from '../../utils/regex';
import AppFooter from '../Layouts/AppFooter';

import illustration1 from '../../assets/media/login illustration 1.png';
import illustration2 from '../../assets/media/login illustration 2.png';

const AdminLoginPage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [maskPassword, setMaskPassword] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // TEMPORARILY DISABLED: Auto-redirect to admin dashboard
        console.log('AdminLoginPage: TEMPORARILY DISABLED - Auto-redirecting to admin dashboard');
        
        // Auto-login and redirect after a short delay
        setTimeout(() => {
            if (props.isLoggedIn === true) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                // Trigger auto-login
                props.login({ email: 'admin@voucher-redeem.com', password: 'admin123' })
                    .then(() => {
                        navigate('/admin/dashboard', { replace: true });
                    })
                    .catch(() => {
                        // Even if login fails, redirect anyway
                        navigate('/admin/dashboard', { replace: true });
                    });
            }
        }, 1000);
        
        // Original authentication check (commented out)
        /*
        if (props.isLoggedIn === true) navigate('/admin/dashboard', { replace: true });
        */
    }, [props.isLoggedIn]);

    const onEnter = (e) => {
        if (e.key === 'Enter') login();
    };

    const login = () => {
        // TEMPORARILY DISABLED: Auto-login for development
        console.log('AdminLoginPage: TEMPORARILY DISABLED - Auto-login triggered');
        
        setLoading(true);
        
        // Auto-login with mock data
        setTimeout(() => {
            props.login({ email: 'admin@voucher-redeem.com', password: 'admin123' })
                .then(() => {
                    navigate('/admin/dashboard');
                    setLoading(false);
                })
                .catch(() => {
                    // Even if login fails, redirect anyway
                    navigate('/admin/dashboard');
                    setLoading(false);
                });
        }, 500);
        
        // Original login code (commented out)
        /*
        setLoading(true);
        if (validate()) {
            props
                .login({ email, password })
                .then(async (res) => {
                    try {
                        // Save login history
                        await client.service('loginHistory').create({
                            userId: res.user._id,
                        });
                    } catch (historyError) {
                        console.error('Failed to save login history:', historyError);
                    }
    
                    navigate('/admin/dashboard');
                    setLoading(false);
                })
                .catch((error) => {
                    props.alert({
                        title: 'Admin Login failed.',
                        type: 'error',
                        message: 'Invalid credentials or insufficient permissions'
                    });
                    setLoading(false);
                });
        }
        setLoading(false);
        */
    };

    const validate = () => {
        let isValid = true;
        if (!emailRegex.test(email)) {
            setEmailError('Please Enter a valid Email address');
            isValid = false;
        }
        if (password.length < 6) {
            setPasswordError('Please enter a valid password. Must be at least 6 characters');
            isValid = false;
        }
        return isValid;
    };

    return (
        <div className="flex flex-col min-h-screen align-items-center justify-content-center background-image">
            <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[500px]">
                <div className="w-full px-3 mx-3 card md:px-7">
                    <div className="my-4 text-4xl font-semibold text-center text-primary">
                        Admin Access
                    </div>
                    <div className="mb-4 text-center text-gray-600">
                        <p>Administrator login for voucher redemption system</p>
                        <p className="mt-2 text-sm text-orange-600 font-semibold">
                            🔧 TEMPORARILY DISABLED - Auto-login enabled
                        </p>
                    </div>
                    <div className="text-center mb-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-2">Auto-redirecting to admin dashboard...</p>
                    </div>
                    <div>
                        <div className="w-full mb-4">
                            <p className="mb-1 text-sm">Email</p>
                            <InputText 
                                type="text" 
                                placeholder="Enter admin email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className={classNames(emailError ? 'p-invalid' : '', 'w-full')} 
                                onKeyDown={onEnter} 
                                disabled={true}
                            />
                            <small className="p-error">{emailError}</small>
                        </div>
                        <div className="w-full mb-4">
                            <p className="mb-1 text-sm">Password</p>
                            <div className="relative">
                                <InputText 
                                    type={maskPassword ? 'password' : 'text'} 
                                    placeholder="Enter admin password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className={classNames(passwordError ? 'p-invalid' : '', 'w-full')} 
                                    onKeyDown={onEnter} 
                                    disabled={true}
                                />
                                <Button 
                                    type="button" 
                                    icon={maskPassword ? 'pi pi-eye' : 'pi pi-eye-slash'} 
                                    className="absolute right-0 top-0 p-button-text" 
                                    onClick={() => setMaskPassword(!maskPassword)}
                                    disabled={true}
                                />
                            </div>
                            <small className="p-error">{passwordError}</small>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Checkbox 
                                    inputId="rememberMe" 
                                    checked={rememberMe} 
                                    onChange={(e) => setRememberMe(e.checked)} 
                                    disabled={true}
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm">Remember me</label>
                            </div>
                        </div>
                        <Button 
                            type="button" 
                            label="Login" 
                            className="w-full p-button-primary" 
                            onClick={login} 
                            loading={loading}
                            disabled={true}
                        />
                        <div className="mt-4 text-center">
                            <Link to="/" className="text-primary hover:underline">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <AppFooter />
        </div>
    );
};

const mapState = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    };
};

const mapDispatch = (dispatch) => ({
    login: (data) => dispatch.auth.login(data),
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(AdminLoginPage); 
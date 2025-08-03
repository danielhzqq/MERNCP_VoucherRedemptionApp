import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { classNames } from "primereact/utils";
import AppMenu from "./AppMenu.js";
import AppFooter from "../AppFooter.js";
import AppSideBarProvider from "./AppSideBarProvider.js";
import Toggle from "../../../assets/icons/Toggle.js";
import Home from "../../../assets/icons/Home.js";
import Data from "../../../assets/icons/Data.js";
import Report from "../../../assets/icons/Report.js";
import Users from "../../../assets/icons/Users.js";
import Admin from "../../../assets/icons/Admin.js";
import Profile from "../../../assets/icons/Profile.js";
import Email from "../../../assets/icons/Email.js";
import Documents from "../../../assets/icons/Documents.js";
import Errors from "../../../assets/icons/Errors.js";
import Addresses from "../../../assets/icons/Addresses.js";
import Phones from "../../../assets/icons/Phones.js";
import MailSent from "../../../assets/icons/MailSent.js";
import UserLogin from "../../../assets/icons/UserLogin.js";
import Voucher from "../../../assets/icons/Voucher.js";
import Transaction from "../../../assets/icons/Transaction.js";
import Analytics from "../../../assets/icons/Analytics.js";

const AppSideBar = (props) => {
    const { activeKey: initialActiveKey, activeDropdown: initialActiveDropdown } = props;
    const [activeKey, setActiveKey] = useState(initialActiveKey);
    const [activeDropdown, setActiveDropdown] = useState(initialActiveDropdown);
    const [open, setOpen] = useState(true);

    return (
        <>
            <div className={classNames('duration-300 flex-shrink-0', open ? 'w-[280px]' : 'w-[calc(3rem+20px)]')}></div>
            <AppSideBarProvider activeKey={activeKey} setActiveKey={setActiveKey} open={open} setOpen={setOpen} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown}>
                <div className={classNames('fixed z-[100] flex flex-col top-20 left-0 h-[calc(100vh-5rem)] overflow-y-hidden overflow-x-hidden  flex-shrink-0 shadow bg-[#F8F9FA] border-r border-[#DEE2E6] border-solid duration-300', open ? 'w-[280px]' : 'w-[calc(3rem+20px)]')}>
                    <div className="flex-grow gap-1 p-2 overflow-x-hidden overflow-y-auto no-scrollbar">
                        <div className="flex gap-3 px-3 py-[10px]">
                            <span className="cursor-pointer" onClick={() => setOpen(!open)}>
                                <Toggle />
                            </span>
                        </div>
                        
                        {/* Dashboard */}
                        <AppMenu
                            icon={<Home />}
                            label="Dashboard"
                            menuKey="dashboard"
                            to="/admin/dashboard"
                            menus={[]}
                            setActiveKey={setActiveKey}
                        />

                        {/* Voucher Management */}
                        <AppMenu
                            icon={<Voucher />}
                            label="Voucher Management"
                            menuKey="voucher-management"
                            to="/admin/dashboard"
                            menus={[
                                {
                                    label: 'All Vouchers',
                                    icon: <Voucher />,
                                    menuKey: 'all-vouchers',
                                    to: '/voucher'
                                },
                                {
                                    label: 'Categories',
                                    icon: <Data />,
                                    menuKey: 'categories',
                                    to: '/catergory'
                                },
                                {
                                    label: 'Voucher Analytics',
                                    icon: <Analytics />,
                                    menuKey: 'voucher-analytics',
                                    to: '/voucher-analytics'
                                },
                                {
                                    label: 'Voucher Templates',
                                    icon: <Documents />,
                                    menuKey: 'voucher-templates',
                                    to: '/templates'
                                }
                            ]}
                            setActiveKey={setActiveKey}
                        />

                        {/* User Management */}
                        <AppMenu
                            icon={<Users />}
                            label="User Management"
                            menuKey="user-management"
                            to="/admin/dashboard"
                            menus={[
                                {
                                    label: 'All Users',
                                    icon: <Users />,
                                    menuKey: 'all-users',
                                    to: '/users'
                                },
                                {
                                    label: 'User Profiles',
                                    icon: <Profile />,
                                    menuKey: 'user-profiles',
                                    to: '/profiles'
                                },
                                {
                                    label: 'User Invites',
                                    icon: <MailSent />,
                                    menuKey: 'user-invites',
                                    to: '/userInvites'
                                },
                                {
                                    label: 'Login History',
                                    icon: <UserLogin />,
                                    menuKey: 'login-history',
                                    to: '/userLogin'
                                },
                                {
                                    label: 'User Addresses',
                                    icon: <Addresses />,
                                    menuKey: 'user-addresses',
                                    to: '/userAddresses'
                                },
                                {
                                    label: 'User Phones',
                                    icon: <Phones />,
                                    menuKey: 'user-phones',
                                    to: '/userPhones'
                                }
                            ]}
                            setActiveKey={setActiveKey}
                        />

                        {/* Transactions */}
                        <AppMenu
                            icon={<Transaction />}
                            label="Transactions"
                            menuKey="transactions"
                            to="/admin/dashboard"
                            menus={[
                                {
                                    label: 'All Transactions',
                                    icon: <Transaction />,
                                    menuKey: 'all-transactions',
                                    to: '/cartitemhistory'
                                },
                                {
                                    label: 'Transaction Analytics',
                                    icon: <Analytics />,
                                    menuKey: 'transaction-analytics',
                                    to: '/transaction-analytics'
                                },
                                {
                                    label: 'Redemption Reports',
                                    icon: <Report />,
                                    menuKey: 'redemption-reports',
                                    to: '/redemption-reports'
                                },
                                {
                                    label: 'Points Management',
                                    icon: <Data />,
                                    menuKey: 'points-management',
                                    to: '/points-management'
                                }
                            ]}
                            setActiveKey={setActiveKey}
                        />

                        {/* Analytics & Reports */}
                        <AppMenu
                            icon={<Analytics />}
                            label="Analytics"
                            menuKey="analytics"
                            to="/admin/dashboard"
                            menus={[
                                {
                                    label: 'Dashboard Analytics',
                                    icon: <Analytics />,
                                    menuKey: 'dashboard-analytics',
                                    to: '/dashboard-analytics'
                                },
                                {
                                    label: 'User Analytics',
                                    icon: <Users />,
                                    menuKey: 'user-analytics',
                                    to: '/user-analytics'
                                },
                                {
                                    label: 'Voucher Performance',
                                    icon: <Voucher />,
                                    menuKey: 'voucher-performance',
                                    to: '/voucher-performance'
                                },
                                {
                                    label: 'Revenue Reports',
                                    icon: <Report />,
                                    menuKey: 'revenue-reports',
                                    to: '/revenue-reports'
                                }
                            ]}
                            setActiveKey={setActiveKey}
                        />

                        {/* System Administration */}
                        <AppMenu
                            icon={<Admin />}
                            label="System Admin"
                            menuKey="system-admin"
                            to="/admin/dashboard"
                            menus={[
                                {
                                    label: 'System Settings',
                                    icon: <Admin />,
                                    menuKey: 'system-settings',
                                    to: '/system-settings'
                                },
                                {
                                    label: 'Email Management',
                                    icon: <Email />,
                                    menuKey: 'email-management',
                                    to: '/mails'
                                },
                                {
                                    label: 'Error Logs',
                                    icon: <Errors />,
                                    menuKey: 'error-logs',
                                    to: '/errorLogs'
                                },
                                {
                                    label: 'System Health',
                                    icon: <Data />,
                                    menuKey: 'system-health',
                                    to: '/system-health'
                                },
                                {
                                    label: 'Backup & Restore',
                                    icon: <Documents />,
                                    menuKey: 'backup-restore',
                                    to: '/backup-restore'
                                }
                            ]}
                            setActiveKey={setActiveKey}
                        />
                        
                        {/* Logout Section */}
                        <div className="mt-auto p-4 border-t border-gray-200">
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        props.logout();
                                        window.location.href = '/';
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                    <i className="pi pi-sign-out text-lg"></i>
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={classNames('text-center duration-300', open ? 'opacity-100' : 'opacity-0')}>
                        <AppFooter />
                    </div>
                </div>
            </AppSideBarProvider>
        </>
    );
};

const mapState = (state) => {
    return {};
};

const mapDispatch = (dispatch) => ({
    logout: () => dispatch.auth.logout(),
});

export default connect(mapState, mapDispatch)(AppSideBar);

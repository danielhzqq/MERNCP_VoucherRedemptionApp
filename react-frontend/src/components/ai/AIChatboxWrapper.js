import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AIChatbox from "./AIChatbox";

const AIChatboxWrapper = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Check if current route is customer-related
  const isCustomerRoute = location.pathname.startsWith('/customer') || 
                         location.pathname === '/';
  
  // Check if current route is an authentication page (login, signup, etc.)
  const isAuthRoute = location.pathname === '/login' ||
                     location.pathname === '/signup' ||
                     location.pathname === '/reset' ||
                     location.pathname === '/login-faq' ||
                     location.pathname === '/admin/login';
  
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/users') ||
                      location.pathname.startsWith('/voucher') ||
                      location.pathname.startsWith('/cartitems') ||
                      location.pathname.startsWith('/dashboard') ||
                      location.pathname.startsWith('/project') ||
                      location.pathname.startsWith('/roles') ||
                      location.pathname.startsWith('/positions') ||
                      location.pathname.startsWith('/profiles') ||
                      location.pathname.startsWith('/companies') ||
                      location.pathname.startsWith('/branches') ||
                      location.pathname.startsWith('/departments') ||
                      location.pathname.startsWith('/sections') ||
                      location.pathname.startsWith('/companyAddresses') ||
                      location.pathname.startsWith('/companyPhones') ||
                      location.pathname.startsWith('/permissionServices') ||
                      location.pathname.startsWith('/permissionFields') ||
                      location.pathname.startsWith('/superior') ||
                      location.pathname.startsWith('/departmentAdmin') ||
                      location.pathname.startsWith('/departmentHOD') ||
                      location.pathname.startsWith('/departmentHOS') ||
                      location.pathname.startsWith('/employees') ||
                      location.pathname.startsWith('/staffinfo') ||
                      location.pathname.startsWith('/tests') ||
                      location.pathname.startsWith('/notifications') ||
                      location.pathname.startsWith('/inbox') ||
                      location.pathname.startsWith('/templates') ||
                      location.pathname.startsWith('/mails') ||
                      location.pathname.startsWith('/documentStorages') ||
                      location.pathname.startsWith('/dynaLoader') ||
                      location.pathname.startsWith('/dynaFields') ||
                      location.pathname.startsWith('/jobQues') ||
                      location.pathname.startsWith('/mailQues') ||
                      location.pathname.startsWith('/chataiProject') ||
                      location.pathname.startsWith('/prompts') ||
                      location.pathname.startsWith('/chataiUsage') ||
                      location.pathname.startsWith('/errorLogs') ||
                      location.pathname.startsWith('/userInvites') ||
                      location.pathname.startsWith('/userLogin') ||
                      location.pathname.startsWith('/userAddresses') ||
                      location.pathname.startsWith('/userPhones') ||
                      location.pathname.startsWith('/userChangePassword') ||
                      location.pathname.startsWith('/account') ||
                      location.pathname.startsWith('/catergory') ||
                      location.pathname.startsWith('/cartitemhistory');

  // Only show AI chatbox if:
  // 1. User is authenticated
  // 2. User is a customer OR admin user on customer routes (customer mode)
  // 3. Current route is customer-related
  // 4. Not on auth or admin routes
  const shouldShowAIChatbox = user && 
                             ((user.role === 'customer') || 
                              (user.role === 'admin' && isCustomerRoute)) && 
                             isCustomerRoute && 
                             !isAuthRoute && 
                             !isAdminRoute;

  if (!shouldShowAIChatbox) {
    return null;
  }

  return <AIChatbox />;
};

export default AIChatboxWrapper; 
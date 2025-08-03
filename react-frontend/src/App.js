import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import MyRouter from "./MyRouter/MyRouter";
import store from "./utils/store";
import { AppConfigStatic } from "./AppConfigStatic";
import AppTopbar from "./components/Layouts/AppTopbar";
import AppFooter from "./components/Layouts/AppFooter";
import MainLayout from "./components/Layouts/MainLayout";
import LoadingWrapper from "./MyRouter/wrappers/LoadingWrapper";
import ToastWrapper from "./MyRouter/wrappers/ToastWrapper";
import StartupWrapper from "./MyRouter/wrappers/StartupWrapper";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CartPopup from "./components/customer/CartPopup";

import AdminCustomerSwitch from "./components/admin/AdminCustomerSwitch";
import AIChatboxWrapper from "./components/ai/AIChatboxWrapper";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/layout/layout.scss";
import "./assets/mainTheme/mainTheme.css";
import "./css/customStyles.css";
import "./css/customer-dashboard.css";
import "./css/carter-rewards-fonts.css";
import "./css/carter-rewards-theme.css";

const App = () => {
  const location = useLocation();

  const showSideMenuButton = false;
  
  // Check if current route is customer-related
  const isCustomerRoute = location.pathname.startsWith('/customer') || 
                         location.pathname === '/';
  
  // Check if current route is admin-related

  
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

  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          {isAdminRoute && <AppTopbar showSideMenuButton={showSideMenuButton} />}
          {isAdminRoute ? (
            <MainLayout>
              <MyRouter />
            </MainLayout>
          ) : (
            <>
              <MyRouter />
              {/* Only show CartPopup and AIChatbox on customer routes, not auth or admin routes */}
              {!isAuthRoute && !isAdminRoute && <CartPopup />}
              <AIChatboxWrapper />
            </>
          )}

          <LoadingWrapper />
          <ToastWrapper />
          <StartupWrapper />

          {/* Admin Customer Switch - Only visible for admin users */}
          <AdminCustomerSwitch />

          <AppConfigStatic
            rippleEffect={true}
            inputStyle={"outlined"}
            layoutMode={"static"}
            layoutColorMode={"light"}
          />
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;

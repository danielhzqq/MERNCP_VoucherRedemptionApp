import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import CarterRewardsLogo from "../common/CarterRewardsLogo";
import CustomerSidebar from "./CustomerSidebar";

const CustomerHeader = ({ searchTerm, setSearchTerm, children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const { cart, setShowCart } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="customer-header shadow-sm">
      {/* Mobile Sidebar */}
      <CustomerSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <button type="button" onClick={() => navigate('/customer/home')} className="flex items-center gap-2 text-[var(--text-primary)] focus:outline-none">
              <CarterRewardsLogo size="medium" />
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/customer/home" className={`text-sm font-medium nav-link ${location.pathname === "/customer/home" ? "active" : ""}`}>Home</Link>
              <Link to="/customer/rewards" className={`text-sm font-medium nav-link ${location.pathname === "/customer/rewards" ? "active" : ""}`}>Rewards</Link>
              <Link to="/customer/account" className={`text-sm font-medium nav-link ${location.pathname === "/customer/account" ? "active" : ""}`}>Account</Link>
            </nav>
          </div>
          {/* Right side: Search, Cart, and Profile */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Search Bar - Desktop Only */}
            {typeof searchTerm === 'string' && typeof setSearchTerm === 'function' && (
              <div className="hidden lg:block w-64 max-w-xs">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                  </div>
                  <input
                    className="input pl-10 py-2 w-full"
                    placeholder="Search rewards"
                    type="search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Cart Button - Desktop Only */}
            <div className="relative flex-shrink-0 hidden lg:block">
              <button
                className="relative p-3 cart-icon hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg border border-gray-200 hover:border-primary bg-white"
                onClick={() => setShowCart(true)}
                aria-label="Open Cart"
                title="View Cart"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                {/* Cart Item Count Badge */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full px-1.5 py-0.5 font-bold min-w-[20px] flex items-center justify-center shadow-lg">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Profile Picture - Desktop Only */}
            <div className="relative flex-shrink-0 hidden lg:block">
              {user?.profileImage ? (
                <div 
                  className="size-10 rounded-full bg-cover bg-center flex items-center justify-center text-base font-bold border-2 border-gray-200 hover:border-[var(--primary-color)] transition-colors duration-200"
                  style={{ backgroundImage: `url('${user.profileImage}')` }}
                  title={user?.name || user?.username || 'User'}
                >
                  {/* Fallback initial if image fails to load */}
                  <span className="sr-only">{user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
              ) : (
                <div className="size-10 rounded-full bg-cover bg-center flex items-center justify-center text-base font-bold bg-[var(--secondary-color)] text-[var(--primary-color)] border-2 border-gray-200 hover:border-[var(--primary-color)] transition-colors duration-200">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {/* Admin Badge */}
              {isAdmin() && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  Admin
                </div>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader; 
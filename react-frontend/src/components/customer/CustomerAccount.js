import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CustomerHeader from "./CustomerHeader";
import client from "../../services/restClient";

const CustomerAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for real-time data
  const [userData, setUserData] = useState(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data and transaction count
  const fetchUserData = async () => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch current user data (including points)
      const currentUser = await client.service('users').get(user._id);
      setUserData(currentUser);

      // Fetch transaction count from cartitemhistory
      const transactions = await client.service('cartitemhistory').find({
        query: {
          userId: user._id,
          $limit: 1000 // Get all transactions for this user
        }
      });
      
      setTransactionCount(transactions.total || 0);

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load account information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when user changes
  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Expose refresh function globally for other components
  useEffect(() => {
    window.refreshUserAccount = fetchUserData;
    return () => {
      delete window.refreshUserAccount;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Format member since date
  const getMemberSince = () => {
    if (!userData?.createdAt) return "N/A";
    const date = new Date(userData.createdAt);
    return date.getFullYear().toString();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (userData?.username) return userData.username;
    if (userData?.email) return userData.email.split('@')[0];
    return user?.name || "User";
  };

  // Get user profile image
  const getUserProfileImage = () => {
    if (userData?.profileImage) return userData.profileImage;
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuCw7uEHcoHwrOII3ttdaNh2nG0k2r1P1xf0kH_Km-RnySq9XMLRkfgxB9slZTp1Z1l7kZz31o5Aoavg3n-LLDQo0f4vTWp7h3dZLPdbmJ8RX_HnPXQ6Sa1IhGJ-Dc6hAJn6E-jW_PtTejA1Flm0posum6zp4xxtk1NM_LiDIe7gFFqToP9IAKaaNjotfd74X_DkXN3DzIf0_-g44oAhenGOtyYH3P4-EQTMhjmh4ouu4kSJYHvHbEJcS9oPdYuW8Qz7M-KNt6iGvzk";
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)] text-[var(--text-primary)] font-sans">
        <div className="layout-container flex h-full grow flex-col">
          <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
                  <span className="ml-3 text-lg">Loading account information...</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)] text-[var(--text-primary)] font-sans">
        <div className="layout-container flex h-full grow flex-col">
          <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="text-red-500 text-lg mb-4">{error}</div>
                  <button 
                    onClick={fetchUserData}
                    className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)] text-[var(--text-primary)] font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32" 
                    style={{backgroundImage: `url('${getUserProfileImage()}')`}}
                  ></div>
                  <button className="absolute bottom-0 right-0 bg-[var(--primary-color)] text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-9.9 9.9A2 2 0 015.172 17H4a2 2 0 01-2-2v-1.172a2 2 0 01.586-1.414l9.9-9.9zM15 5l-1.414-1.414L5 12.172V14h1.828L15 5z"></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[var(--text-primary)] text-2xl font-bold">{getUserDisplayName()}</p>
                  <p className="text-[var(--text-secondary)] text-sm">Member since {getMemberSince()}</p>
                  {userData?.email && (
                    <p className="text-[var(--text-secondary)] text-sm mt-1">{userData.email}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-auto">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl">
                    <p className="text-[var(--primary-color)] text-4xl font-bold">
                      {userData?.points ? userData.points.toLocaleString() : '0'}
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Points</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl">
                    <p className="text-[var(--primary-color)] text-4xl font-bold">
                      {transactionCount.toLocaleString()}
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Transactions</p>
                  </div>
                </div>
              </div>
              
              {/* Additional User Information */}
              {(userData?.phoneNumber || userData?.address || userData?.aboutMe) && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    {userData?.phoneNumber && (
                      <div className="flex items-center">
                        <span className="text-[var(--text-secondary)] text-sm w-24">Phone:</span>
                        <span className="text-[var(--text-primary)]">{userData.phoneNumber}</span>
                      </div>
                    )}
                    {userData?.address && (
                      <div className="flex items-start">
                        <span className="text-[var(--text-secondary)] text-sm w-24">Address:</span>
                        <span className="text-[var(--text-primary)]">{userData.address}</span>
                      </div>
                    )}
                    {userData?.aboutMe && (
                      <div className="flex items-start">
                        <span className="text-[var(--text-secondary)] text-sm w-24">About:</span>
                        <span className="text-[var(--text-primary)]">{userData.aboutMe}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[var(--text-primary)] text-xl font-bold text-center">Account Settings</h2>
                  <button 
                    onClick={fetchUserData}
                    className="text-[var(--primary-color)] hover:text-blue-600 text-sm"
                    title="Refresh account data"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <button type="button" className="flex items-center justify-center group w-full bg-white hover:bg-gray-50 transition-colors px-0" onClick={() => navigate('/customer/update-info')} style={{padding: 0}}>
                      <span className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-color)]">Update Personal Information</span>
                    </button>
                  </li>
                  <li className="py-4">
                    <button type="button" className="flex items-center justify-center group w-full bg-white hover:bg-gray-50 transition-colors px-0" onClick={() => navigate('/customer/my-vouchers')} style={{padding: 0}}>
                      <span className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-color)]">View Transaction History</span>
                    </button>
                  </li>
                  <li className="py-4">
                    <a className="flex items-center justify-center group w-full" href="#">
                      <span className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-color)]">App Settings</span>
                    </a>
                  </li>
                  <li className="py-4">
                    <a className="flex items-center justify-center group w-full" href="#">
                      <span className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-color)]">Help &amp; Support</span>
                    </a>
                  </li>
                  <li className="py-4 border-t-2 border-gray-300">
                    <button type="button" className="flex items-center justify-center group w-full bg-white hover:bg-gray-50 transition-colors px-0" onClick={handleLogout} style={{padding: 0}}>
                      <span className="text-base font-medium text-red-600 group-hover:text-red-700">Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerAccount; 
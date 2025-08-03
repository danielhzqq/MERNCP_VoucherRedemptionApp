import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { downloadVoucherPDF } from "../../utils/pdfGenerator";
import client from "../../services/restClient";
import moment from "moment";
import { Message } from "primereact/message";

const CustomerDashboard = () => {
  const { user, logout, isAdmin, isCustomer } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Odometer-style count-up animation for points
  const [displayPoints, setDisplayPoints] = useState(0);
  const [animateEnd, setAnimateEnd] = useState(false);
  
  useEffect(() => {
    const target = userPoints;
    const duration = 1500;
    const frameRate = 30;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    setAnimateEnd(false);
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setDisplayPoints(Math.floor(progress * target));
      if (frame === totalFrames) {
        setDisplayPoints(target);
        setAnimateEnd(true);
        clearInterval(counter);
      }
    }, 1000 / frameRate);
    return () => clearInterval(counter);
  }, [userPoints]);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      if (user && user._id && user._id !== 'mock-admin-id') {
        // Fetch current user data to get username and other details
        const userResponse = await client.service('users').get(user._id);
        setUserData(userResponse);
      } else {
        // Fallback for mock users or when user is not available
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to null if API fails
      setUserData(null);
    }
  };

  // Fetch user points from backend
  const fetchUserPoints = async (showLoading = false) => {
    try {
      if (showLoading) setPointsLoading(true);
      
      if (user && user._id && user._id !== 'mock-admin-id') {
        // Fetch current user data to get real-time points
        const userResponse = await client.service('users').get(user._id);
        setUserPoints(userResponse.points || 0);
      } else {
        // Fallback for mock users or when user is not available
        setUserPoints(0);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
      // Fallback to 0 if API fails
      setUserPoints(0);
    } finally {
      if (showLoading) setPointsLoading(false);
    }
  };

  // Initial fetch and periodic refresh of user data and points
  useEffect(() => {
    fetchUserData();
    fetchUserPoints();
    
    // Set up periodic refresh every 30 seconds for real-time updates
    const intervalId = setInterval(() => {
      fetchUserData();
      fetchUserPoints();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [user?._id]);

  // Expose refresh function for other components to call
  useEffect(() => {
    if (window) {
      window.refreshUserPoints = () => fetchUserPoints(true);
    }
    
    return () => {
      if (window) {
        delete window.refreshUserPoints;
      }
    };
  }, []);

  // Helper function to get display name
  const getDisplayName = () => {
    if (userData?.username) return userData.username;
    if (userData?.name) return userData.name;
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    return 'User';
  };

  // Fetch redeemed vouchers from backend
  useEffect(() => {
    const fetchRedeemedVouchers = async () => {
      try {
        setLoading(true);
        
        // Fetch redeemed vouchers (cart item history) for the current user
        const redeemedResponse = await client.service('cartitemhistory').find({
          query: { 
            userId: user?._id || 'mock-user-id',
            $limit: 20,
            $sort: { completedDate: -1 }, // Most recent first
            $populate: [
              {
                path: 'voucherId',
                service: 'voucher',
                select: ['title', 'description', 'image', 'points', 'categoryId']
              },
              {
                path: 'voucherId.categoryId',
                service: 'catergory',
                select: ['name']
              }
            ]
          }
        });
        
        // Transform redeemed vouchers to match the expected format
        const transformedRedeemedVouchers = (redeemedResponse.data || []).map(item => ({
          id: item._id,
          voucherId: item.voucherId?._id,
          title: item.voucherId?.title || 'Unknown Voucher',
          description: item.voucherId?.description || 'No description available',
          image: item.voucherId?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
          points: item.voucherId?.points || 0,
          category: item.voucherId?.categoryId?.name || 'Uncategorized',
          quantity: item.quantity,
          redeemedDate: item.completedDate,
          createdAt: item.createdAt
        }));
        
        setRedeemedVouchers(transformedRedeemedVouchers);
      } catch (error) {
        console.error('Error fetching redeemed vouchers:', error);
        // Fallback to mock data if API fails
        setRedeemedVouchers([
          {
            id: 'mock-redeemed-1',
            voucherId: 'mock-voucher-1',
            title: "Weekend Getaway",
            description: "Escape to a luxurious resort with your points.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
            points: 25000,
            category: "Travel",
            quantity: 1,
            redeemedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'mock-redeemed-2',
            voucherId: 'mock-voucher-2',
            title: "Fine Dining Experience",
            description: "Enjoy a gourmet meal at a top-rated restaurant.",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
            points: 15000,
            category: "Dining",
            quantity: 2,
            redeemedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRedeemedVouchers();
  }, [user?._id]);

  // Helper to split number into digits (no commas)
  function getOdometerDigits(num) {
    return num.toString().padStart(5, '0').split("");
  }

  // Odometer digit stack (0-9)
  function OdometerDigit({ digit, animate }) {
    const digitNum = Number(digit);
    return (
      <span className="odometer-digit">
        <span
          className="odometer-digit-inner"
          style={{ transform: `translateY(-${digitNum * 1.2}em)` }}
        >
          {[...Array(10).keys()].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </span>
      </span>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Filter redeemed vouchers by search term
  const searchFilteredRedeemedVouchers = searchTerm
    ? redeemedVouchers.filter((voucher) =>
        voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : redeemedVouchers;

  const handleDownloadPDF = async (voucher) => {
    try {
      await downloadVoucherPDF(voucher);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading voucher PDF. Please try again.');
    }
  };

  const formatDate = (date) => {
    return moment(date).format('MMM DD, YYYY');
  };

  const getTimeAgo = (date) => {
    return moment(date).fromNow();
  };



  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)] text-[var(--text-primary)]">
      <div className="layout-container flex h-full grow flex-col">
        <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl">
            <div className="mb-4 px-4">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back, {getDisplayName()}</h2>
            </div>

            {/* Admin Mode Indicator */}
            {isAdmin() && (
              <div className="mb-4 px-4">
                <Message 
                  severity="info" 
                  text="You are currently viewing the customer interface as an admin user. Use the switch in the bottom right to toggle between admin and customer modes."
                  className="w-full"
                />
              </div>
            )}
            
            {/* Points Card */}
            <div className="mb-6 px-4">
              <div className="relative rounded-2xl shadow-lg overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative z-10 p-8 flex flex-col justify-end min-h-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-lg font-medium">Total Points</p>
                    <button
                      onClick={() => fetchUserPoints(true)}
                      disabled={pointsLoading}
                      className="text-white hover:text-blue-200 transition-colors duration-200 disabled:opacity-50"
                      title="Refresh points"
                    >
                      {pointsLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className={`odometer flex space-x-1 text-white text-5xl font-bold ${animateEnd ? 'odometer-finish' : ''}`} style={{letterSpacing: '-0.04em'}}>
                    {getOdometerDigits(displayPoints).map((digit, i) => (
                      <OdometerDigit key={i} digit={digit} animate={animateEnd} />
                    ))}
                  </div>
                  <div className="mt-2 text-white text-sm opacity-80">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>



            {/* Redeemed Vouchers Section */}
            <section className="mb-8 px-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Redeemed Vouchers</h3>
                  <p className="text-gray-600 mt-1">Your recent voucher redemptions</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-gray-600">
                      {searchFilteredRedeemedVouchers.length} voucher{searchFilteredRedeemedVouchers.length !== 1 ? 's' : ''} redeemed
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/customer/my-vouchers')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View All Transaction History
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : searchFilteredRedeemedVouchers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No Redeemed Vouchers Yet</h4>
                    <p className="text-gray-500 mb-6">
                      You haven't redeemed any vouchers yet. Start earning points and redeem them for amazing rewards!
                    </p>
                    <button 
                      onClick={() => navigate('/customer/vouchers')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Browse Available Vouchers
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Scrollable List */}
                  <div className="max-h-96 overflow-y-auto">
                    {searchFilteredRedeemedVouchers.map((voucher, index) => (
                      <div 
                        key={voucher.id} 
                        className={`redeemed-voucher-item px-8 py-6 border-b border-gray-100 transition-colors duration-200 ${
                          index === searchFilteredRedeemedVouchers.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-6 items-center">
                          {/* Voucher Details - Expanded */}
                          <div className="col-span-5">
                            <div className="flex items-center space-x-5">
                              <div className="flex-shrink-0">
                              <img
                                src={voucher.image}
                                alt={voucher.title}
                                  className="voucher-image w-20 h-20 object-cover rounded-xl shadow-md"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80";
                                }}
                              />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-gray-900 leading-tight mb-2 line-clamp-1">
                                  {voucher.title}
                                </h4>
                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                                  {voucher.description}
                                </p>
                                <div>
                                  <span className="status-badge bg-green-100 text-green-800">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    REDEEMED
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Category - Centered */}
                          <div className="col-span-2 flex justify-center">
                            <span className="status-badge bg-blue-100 text-blue-800 px-4 py-2">
                              {voucher.category}
                            </span>
                          </div>
                          
                          {/* Points - Centered */}
                          <div className="col-span-2 flex justify-center">
                            <div className="text-center">
                              <span className="text-lg font-bold text-gray-900">
                              {voucher.points.toLocaleString()}
                            </span>
                              <div className="text-xs text-gray-500 mt-1">points</div>
                          </div>
                          </div>
                          
                          {/* Redeemed Date - Centered */}
                          <div className="col-span-2 flex justify-center">
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">
                              {formatDate(voucher.redeemedDate)}
                            </div>
                              <div className="text-xs text-gray-500 mt-1">
                              {getTimeAgo(voucher.redeemedDate)}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons - Centered */}
                          <div className="col-span-1 flex justify-center">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleDownloadPDF(voucher)}
                                className="action-button inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                title="Download PDF"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => navigate(`/customer/voucher/${voucher.voucherId}`)}
                                className="action-button inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                title="View Details"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard; 
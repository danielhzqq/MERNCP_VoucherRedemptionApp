import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import client from "../../services/restClient";

const CustomerVoucherDetail = () => {
  const { user, logout } = useContext(AuthContext);
  const { addToCart } = useCart();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { voucherId } = useParams();
  const navigate = useNavigate();
  
  // State for voucher data and user points
  const [voucherData, setVoucherData] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Fetch voucher data from database
  const fetchVoucherData = async () => {
    if (!voucherId) {
      setError('Voucher ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch voucher with populated category data
      const voucherResponse = await client.service('voucher').get(voucherId, {
        query: {
          $populate: [
            {
              path: 'categoryId',
              service: 'catergory',
              select: ['name']
            }
          ]
        }
      });

      // Transform the data to match the component's expected structure
      const transformedVoucher = {
        id: voucherResponse._id,
        title: voucherResponse.title || 'Unknown Voucher',
        points: voucherResponse.points ? `${voucherResponse.points.toLocaleString()} points` : '0 points',
        category: voucherResponse.categoryId?.name || 'Uncategorized',
        description: voucherResponse.description || 'No description available',
        terms: voucherResponse.termsAndCondition ? voucherResponse.termsAndCondition.split('\n').filter(term => term.trim()) : [
          'Valid for 12 months from date of redemption',
          'Subject to availability',
          'Cannot be combined with other offers',
          'Non-transferable and non-refundable',
          'Blackout dates may apply'
        ],
        img: voucherResponse.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZQR8_1iqHyvPuug8nwb02iHeRHfmGFZkHklr3uFAmd0tKQtKL8PiTI3WGVzpnmZoqZntasEVCTlay8VPhlDjaa8ftsTCqbS02vMdxtmNZAupQIq9CidrfwyWCIxvyx7kz51KUsHoBeh_bF9amhwqmYvvnB_hLIHIUXdOmqKDAVnbfak5INaOLB5n7qaz6YZnveEYRHAbvTB3rnOwoV9jeymZCRFXb7rBsmTyPcRfSzT7mlxlO_zXGQCfHpGuGeCX7Q83BLUiYKVA',
        originalPoints: voucherResponse.points || 0
      };

      setVoucherData(transformedVoucher);

    } catch (err) {
      console.error('Error fetching voucher data:', err);
      setError('Failed to load voucher details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user points
  const fetchUserPoints = async () => {
    if (!user || !user._id) {
      setUserPoints(0);
      return;
    }

    try {
      const userResponse = await client.service('users').get(user._id);
      setUserPoints(userResponse.points || 0);
    } catch (err) {
      console.error('Error fetching user points:', err);
      setUserPoints(0);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchVoucherData();
    fetchUserPoints();
  }, [voucherId, user?._id]);

  const handleAddToCart = () => {
    if (voucherData) {
      addToCart(voucherData);
      // Optionally show a success message or navigate to cart
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-800">
        <div className="flex-grow">
          <CustomerHeader user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading voucher details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-800">
        <div className="flex-grow">
          <CustomerHeader user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button 
                  onClick={fetchVoucherData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/customer/rewards')}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Rewards
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // No voucher data
  if (!voucherData) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-800">
        <div className="flex-grow">
          <CustomerHeader user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-gray-500 text-lg mb-4">Voucher not found</div>
                <button 
                  onClick={() => navigate('/customer/rewards')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Rewards
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check if user has enough points
  const hasEnoughPoints = userPoints >= voucherData.originalPoints;
  const pointsDifference = voucherData.originalPoints - userPoints;

  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-800">
      <div className="flex-grow">
        <CustomerHeader user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* End Header */}
        
        <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate('/customer/rewards')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Rewards
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img 
                  alt={voucherData.title} 
                  className="w-full h-full object-cover object-center" 
                  src={voucherData.img} 
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {voucherData.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {voucherData.points}
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {voucherData.category}
                  </span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {voucherData.description}
                </p>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Terms & Conditions
                </h3>
                <ul className="space-y-2">
                  {voucherData.terms.map((term, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={!hasEnoughPoints}
                  className={`button_primary flex-1 ${!hasEnoughPoints ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {hasEnoughPoints ? 'Add to Cart' : 'Insufficient Points'}
                </button>
                <button 
                  onClick={() => navigate('/customer/rewards')}
                  className="button_secondary flex-1"
                >
                  Browse More Rewards
                </button>
              </div>

              {/* User Points Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Points:</span>
                  <span className="text-lg font-bold text-blue-600">{userPoints.toLocaleString()}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {hasEnoughPoints ? (
                    <span className="text-green-600">You have enough points to redeem this reward!</span>
                  ) : (
                    <span className="text-red-600">
                      You need {pointsDifference.toLocaleString()} more points to redeem this reward.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerVoucherDetail; 
import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import client from "../../services/restClient";

const CartPopup = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    redeemCart,
    showCart,
    setShowCart,
    isGeneratingPDFs,
  } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useContext(AuthContext);
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(false);

  // Fetch user points when cart is shown
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (showCart && user && user._id && user._id !== 'mock-admin-id') {
        try {
          setLoadingPoints(true);
          const userResponse = await client.service('users').get(user._id);
          setUserPoints(userResponse.points || 0);
        } catch (error) {
          console.error('Error fetching user points:', error);
          setUserPoints(0);
        } finally {
          setLoadingPoints(false);
        }
      }
    };

    fetchUserPoints();
  }, [showCart, user?._id]);

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black bg-opacity-30">
      {/* Modal */}
      <div className="bg-white rounded-t-2xl shadow-xl w-full max-w-md mx-auto p-6 relative animate-slideup">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={() => setShowCart(false)}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-8">Your cart is empty.</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-4">
              {cart.map(({ voucher, quantity }) => (
                <li key={voucher.title} className="flex items-center py-3 gap-3">
                  <img src={voucher.img} alt={voucher.title} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-[var(--text-primary)]">{voucher.title}</div>
                    <div className="text-xs text-[var(--text-secondary)]">Points: {voucher.points || voucher.price || "-"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded bg-gray-200 text-lg"
                      onClick={() => updateQuantity(voucher.title, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{quantity}</span>
                    <button
                      className="px-2 py-1 rounded bg-gray-200 text-lg"
                      onClick={() => updateQuantity(voucher.title, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(voucher.title)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
            {/* Points Information */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Your Points:</span>
                <span className="font-semibold text-blue-600">
                  {loadingPoints ? 'Loading...' : userPoints.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Total Needed:</span>
                <span className="font-semibold text-red-600">
                  {cart.reduce((total, item) => {
                    const points = parseInt(item.voucher.points) || 0;
                    return total + (points * item.quantity);
                  }, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Remaining:</span>
                <span className={`font-semibold ${userPoints >= cart.reduce((total, item) => {
                  const points = parseInt(item.voucher.points) || 0;
                  return total + (points * item.quantity);
                }, 0) ? 'text-green-600' : 'text-red-600'}`}>
                  {(userPoints - cart.reduce((total, item) => {
                    const points = parseInt(item.voucher.points) || 0;
                    return total + (points * item.quantity);
                  }, 0)).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={clearCart}
                disabled={isGeneratingPDFs}
              >
                Clear Cart
              </button>
              <button
                className="button_primary px-6 py-2"
                onClick={() => setShowConfirm(true)}
                disabled={isGeneratingPDFs || userPoints < cart.reduce((total, item) => {
                  const points = parseInt(item.voucher.points) || 0;
                  return total + (points * item.quantity);
                }, 0)}
              >
                {isGeneratingPDFs ? 'Generating PDFs...' : 'Redeem All'}
              </button>
            </div>
          </>
        )}
        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center">
              <h3 className="text-lg font-bold mb-4">Confirm Redemption</h3>
              <p className="mb-6">
                {isGeneratingPDFs
                  ? 'Generating PDF vouchers... Please wait.'
                  : 'Are you sure you want to redeem all vouchers in your cart? PDF files will be downloaded for each voucher.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="button_secondary px-4 py-2"
                  onClick={() => setShowConfirm(false)}
                  disabled={isGeneratingPDFs}
                >
                  Cancel
                </button>
                <button
                  className="button_primary px-4 py-2"
                  onClick={() => {
                    redeemCart();
                    setShowConfirm(false);
                  }}
                  disabled={isGeneratingPDFs}
                >
                  {isGeneratingPDFs ? 'Generating...' : 'Confirm'}
                </button>
              </div>
              {isGeneratingPDFs && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Creating your voucher PDFs...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-slideup { animation: slideup 0.3s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slideup { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default CartPopup; 
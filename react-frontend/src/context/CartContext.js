import React, { createContext, useContext, useState } from "react";
import { downloadMultipleVoucherPDFs } from "../utils/pdfGenerator";
import { generateMultipleUniqueVoucherCodes } from "../utils/voucherCodeGenerator";
import client from "../services/restClient";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // [{voucher, quantity}]
  const [showCart, setShowCart] = useState(false);
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;

  // Add voucher to cart (if exists, increment quantity)
  const addToCart = async (voucher) => {
    // Check if user is authenticated
    if (!user || !user._id || user._id === 'mock-admin-id') {
      alert('Please log in to add vouchers to cart.');
      return;
    }

    try {
      // Fetch current user to check points balance
      const currentUser = await client.service('users').get(user._id);
      const currentPoints = currentUser.points || 0;
      const voucherPoints = parseInt(voucher.points) || 0;

      // Check if user has enough points for this voucher
      if (currentPoints < voucherPoints) {
        alert(`Insufficient points. You have ${currentPoints.toLocaleString()} points but need ${voucherPoints.toLocaleString()} points for this voucher.`);
        return;
      }

      setCart((prev) => {
        const found = prev.find((item) => item.voucher.title === voucher.title);
        if (found) {
          return prev.map((item) =>
            item.voucher.title === voucher.title
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { voucher, quantity: 1 }];
        }
      });
      setShowCart(true);
    } catch (error) {
      console.error('Error checking user points:', error);
      alert('Error checking your points balance. Please try again.');
    }
  };

  // Remove voucher from cart
  const removeFromCart = (voucherTitle) => {
    setCart((prev) => prev.filter((item) => item.voucher.title !== voucherTitle));
  };

  // Update quantity
  const updateQuantity = (voucherTitle, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.voucher.title === voucherTitle
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Redeem vouchers and generate PDFs
  const redeemCart = async () => {
    try {
      setIsGeneratingPDFs(true);
      
      // Check if user is authenticated
      if (!user || !user._id || user._id === 'mock-admin-id') {
        throw new Error('User not authenticated. Please log in to redeem vouchers.');
      }

      // Calculate total points needed
      const totalPointsNeeded = cart.reduce((total, item) => {
        const points = parseInt(item.voucher.points) || 0;
        return total + (points * item.quantity);
      }, 0);

      // Fetch current user to check points balance
      const currentUser = await client.service('users').get(user._id);
      const currentPoints = currentUser.points || 0;

      // Check if user has enough points
      if (currentPoints < totalPointsNeeded) {
        throw new Error(`Insufficient points. You have ${currentPoints.toLocaleString()} points but need ${totalPointsNeeded.toLocaleString()} points.`);
      }

      // Create individual cartitemhistory records for each voucher quantity
      const redemptionPromises = [];
      cart.forEach((item) => {
        // Generate unique voucher codes for each quantity
        const voucherCodes = generateMultipleUniqueVoucherCodes(item.quantity);
        
        // Create a separate record for each quantity
        for (let i = 0; i < item.quantity; i++) {
          const cartItemHistoryData = {
            voucherId: item.voucher._id || item.voucher.id,
            userId: user._id,
            quantity: 1, // Each record represents 1 voucher
            completedDate: new Date(),
            voucherCode: voucherCodes[i], // Unique voucher code for this redemption
          };
          
          // Only add createdBy/updatedBy if user ID is valid
          if (user._id !== 'mock-admin-id') {
            cartItemHistoryData.createdBy = user._id;
            cartItemHistoryData.updatedBy = user._id;
          }
          
          console.log(`Creating cartitemhistory record ${i + 1}/${item.quantity} for voucher:`, cartItemHistoryData);
          redemptionPromises.push(client.service('cartitemhistory').create(cartItemHistoryData));
        }
      });

      // Wait for all cartitemhistory records to be created
      await Promise.all(redemptionPromises);

      // Update user's points balance
      const newPointsBalance = currentPoints - totalPointsNeeded;
      await client.service('users').patch(user._id, {
        points: newPointsBalance
      });

      // Generate and download PDFs for all vouchers
      const vouchersToRedeem = [];
      cart.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          vouchersToRedeem.push(item.voucher);
        }
      });
      
      await downloadMultipleVoucherPDFs(vouchersToRedeem);
      
      // Clear cart and close modal
      setCart([]);
      setShowCart(false);
      
      // Refresh user points if the global function exists
      if (window.refreshUserPoints) {
        window.refreshUserPoints();
      }
      
      // Show success message
      alert(`Successfully redeemed ${vouchersToRedeem.length} voucher(s)! Your new balance is ${newPointsBalance.toLocaleString()} points. PDF files have been downloaded.`);
      
    } catch (error) {
      console.error('Error redeeming vouchers:', error);
      alert(`Error redeeming vouchers: ${error.message}`);
    } finally {
      setIsGeneratingPDFs(false);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    redeemCart,
    showCart,
    setShowCart,
    isGeneratingPDFs,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 
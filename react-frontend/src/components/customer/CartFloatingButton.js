import React from "react";
import { useCart } from "../../context/CartContext";

const CartFloatingButton = () => {
  const { cart, setShowCart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      className="fixed bottom-6 right-6 z-50 bg-[var(--primary-color)] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center hover:bg-blue-700 transition-colors"
      onClick={() => setShowCart(true)}
      aria-label="Open Cart"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
      </svg>
      {count > 0 && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
          {count}
        </span>
      )}
    </button>
  );
};

export default CartFloatingButton; 
import React from 'react';

const CarterRewardsLogo = ({ size = 'medium', className = '' }) => {
  // Size variants
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
    xlarge: 'text-4xl'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  const textSize = sizeClasses[size] || sizeClasses.medium;
  const iconSize = iconSizes[size] || iconSizes.medium;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Ascending bar chart icon */}
      <div className={`flex items-end gap-0.5 ${iconSize}`}>
        <div className="w-1 bg-red-600 rounded-sm" style={{ height: '40%' }}></div>
        <div className="w-1 bg-red-600 rounded-sm" style={{ height: '60%' }}></div>
        <div className="w-1 bg-red-600 rounded-sm" style={{ height: '100%' }}></div>
      </div>
      
      {/* CarterRewards text with cursive font */}
      <span 
        className={`carter-rewards-logo carter-rewards-logo-${size} ${textSize}`}
      >
        CarterRewards
      </span>
    </div>
  );
};

export default CarterRewardsLogo; 
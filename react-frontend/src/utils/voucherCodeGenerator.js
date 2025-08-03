// Generate a unique voucher code
export const generateUniqueVoucherCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate a 12-character code for better uniqueness
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add timestamp prefix for additional uniqueness
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${timestamp}-${result}`;
};

// Generate multiple unique voucher codes
export const generateMultipleUniqueVoucherCodes = (count) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateUniqueVoucherCode());
  }
  return codes;
}; 
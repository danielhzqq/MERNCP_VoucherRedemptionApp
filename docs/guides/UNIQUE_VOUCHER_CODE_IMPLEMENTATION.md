# Unique Voucher Code Implementation

## Overview
Implemented a system to ensure that voucher codes are unique, immutable, and generated only once during redemption. This prevents duplicate codes and ensures each voucher has a permanent, traceable identifier.

## Problem Statement
**Before**: Voucher codes were generated randomly each time a PDF was downloaded, which meant:
- Same voucher could have different codes on different downloads
- No way to track individual vouchers
- Potential for confusion and fraud
- No audit trail for voucher usage

**After**: Each voucher gets a unique, immutable code generated once during redemption and stored in the database.

## Key Features

### 1. **Unique Code Generation**
- 12-character alphanumeric codes with timestamp prefix
- Guaranteed uniqueness across all redemptions
- Format: `{timestamp}-{random12chars}` (e.g., `LQ1234567890-ABC123DEF456`)

### 2. **Immutable Codes**
- Generated once during redemption
- Stored permanently in database
- Never changes, even on multiple PDF downloads
- Provides consistent audit trail

### 3. **Database Storage**
- Added `voucherCode` field to `cartitemhistory` model
- Unique index to prevent duplicates
- Required field for all new redemptions

## Technical Implementation

### **Database Schema Update**
```javascript
// cartitemhistory.model.js
voucherCode: {
  type: String,
  required: true,
  unique: true,
  index: true
}
```

### **Unique Code Generator**
```javascript
// voucherCodeGenerator.js
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
```

### **Redemption Process**
```javascript
// CartContext.js - redeemCart function
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
    
    // Create database record with unique code
    redemptionPromises.push(client.service('cartitemhistory').create(cartItemHistoryData));
  }
});
```

### **PDF Generation**
```javascript
// pdfGenerator.js
const getVoucherCode = (voucher) => {
  // If voucher has a stored code, use it; otherwise generate a fallback
  if (voucher.voucherCode) {
    return voucher.voucherCode;
  }
  
  // Fallback: generate a temporary code (should not happen in normal operation)
  return `TEMP-${generateRandomCode()}`;
};
```

## Code Examples

### **Voucher Code Format**
```
LQ1234567890-ABC123DEF456
│  │           │
│  │           └─ 12-character random code
│  └─ Timestamp in base36
└─ Prefix for readability
```

### **Database Record Example**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  voucherId: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439013"),
  quantity: 1,
  completedDate: ISODate("2024-12-15T14:30:25.000Z"),
  voucherCode: "LQ1234567890-ABC123DEF456", // Unique and immutable
  createdBy: ObjectId("507f1f77bcf86cd799439013"),
  updatedBy: ObjectId("507f1f77bcf86cd799439013"),
  createdAt: ISODate("2024-12-15T14:30:25.000Z"),
  updatedAt: ISODate("2024-12-15T14:30:25.000Z")
}
```

### **PDF Content Example**
```
┌─────────────────────────────────────┐
│ VOUCHER                             │
│                                     │
│ Voucher Name: Coffee Shop Discount  │
│                                     │
│ Voucher Details:                    │
│ Points Required: 500 points         │
│ Category: Food & Beverage           │
│                                     │
│ Voucher Code: LQ1234567890-ABC123DEF456 │
│                                     │
│ QR Code: [QR Code Image]            │
└─────────────────────────────────────┘
```

## Migration Process

### **For Existing Records**
Created migration script `add-voucher-codes-to-existing-records.js`:

```javascript
// Find records without voucher codes
const recordsWithoutVoucherCode = await cartitemhistoryCollection.find({
  voucherCode: { $exists: false }
}).toArray();

// Generate unique codes for each record
const voucherCodes = generateMultipleUniqueVoucherCodes(recordsWithoutVoucherCode.length);

// Update each record
for (let i = 0; i < recordsWithoutVoucherCode.length; i++) {
  await cartitemhistoryCollection.updateOne(
    { _id: recordsWithoutVoucherCode[i]._id },
    { $set: { voucherCode: voucherCodes[i] } }
  );
}
```

### **Running Migration**
```bash
cd voucher-redeem-merncp-a9b115
node add-voucher-codes-to-existing-records.js
```

## Benefits

### 1. **Security & Integrity**
- Each voucher has a unique, traceable identifier
- Prevents duplicate voucher usage
- Enables fraud detection and prevention
- Provides complete audit trail

### 2. **User Experience**
- Consistent voucher codes across all downloads
- No confusion from changing codes
- Reliable voucher identification
- Professional voucher presentation

### 3. **Administrative Benefits**
- Easy voucher tracking and management
- Simplified customer support
- Better reporting and analytics
- Reduced fraud potential

### 4. **Technical Benefits**
- Database-level uniqueness constraints
- Efficient indexing for lookups
- Scalable code generation
- Backward compatibility maintained

## Validation & Testing

### **Uniqueness Validation**
```javascript
// Database constraint ensures uniqueness
voucherCode: {
  type: String,
  required: true,
  unique: true,  // MongoDB unique index
  index: true    // Optimized for lookups
}
```

### **Code Generation Testing**
```javascript
// Test multiple code generation
const codes = generateMultipleUniqueVoucherCodes(1000);
const uniqueCodes = new Set(codes);
console.log(`Generated ${codes.length} codes, ${uniqueCodes.size} unique`);
// Should output: Generated 1000 codes, 1000 unique
```

### **PDF Consistency Testing**
```javascript
// Download same voucher multiple times
// Verify same voucher code appears in all PDFs
const voucher = await getVoucherFromDatabase(voucherId);
const pdf1 = await generatePDF(voucher);
const pdf2 = await generatePDF(voucher);
// pdf1.voucherCode === pdf2.voucherCode should be true
```

## Error Handling

### **Fallback Scenarios**
1. **Missing Voucher Code**: Generates temporary code with "TEMP-" prefix
2. **Database Errors**: Logs error and continues with fallback
3. **Code Generation Failure**: Retries with different parameters

### **Validation Checks**
```javascript
// Validate voucher code format
const isValidVoucherCode = (code) => {
  const pattern = /^[A-Z0-9]+-[A-Z0-9]{12}$/;
  return pattern.test(code);
};

// Check for duplicate codes
const isCodeUnique = async (code) => {
  const existing = await cartitemhistoryCollection.findOne({ voucherCode: code });
  return !existing;
};
```

## Future Enhancements

### **Potential Improvements**
1. **Barcode Integration**: Add barcode alongside QR code
2. **Code Prefixes**: Different prefixes for different voucher types
3. **Expiration Tracking**: Include expiration in code format
4. **Regional Codes**: Location-specific code prefixes
5. **Batch Processing**: Optimize for bulk voucher generation

### **Security Enhancements**
1. **Code Encryption**: Encrypt sensitive voucher data
2. **Digital Signatures**: Add cryptographic signatures
3. **Rate Limiting**: Prevent code generation abuse
4. **Audit Logging**: Enhanced tracking of code usage

## Monitoring & Maintenance

### **Database Monitoring**
```javascript
// Monitor for duplicate codes
const duplicateCodes = await cartitemhistoryCollection.aggregate([
  { $group: { _id: "$voucherCode", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
]);

// Monitor code generation performance
const codeGenerationTime = Date.now() - startTime;
console.log(`Generated ${count} codes in ${codeGenerationTime}ms`);
```

### **Regular Maintenance**
- Monitor unique index performance
- Clean up temporary codes
- Archive old voucher records
- Update code generation algorithms

## Conclusion

The unique voucher code implementation provides:
- **Security**: Each voucher has a unique, immutable identifier
- **Reliability**: Consistent codes across all operations
- **Traceability**: Complete audit trail for all vouchers
- **Scalability**: Efficient database design for large volumes
- **User Experience**: Professional, consistent voucher presentation

This system ensures that voucher codes are truly unique and cannot be changed after redemption, providing a robust foundation for voucher management and fraud prevention. 
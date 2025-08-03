# PDF Download Quantity Enhancement

## Overview
Enhanced the PDF download functionality on the customer my-vouchers page (`http://localhost:3000/customer/my-vouchers`) to ensure that the number of PDFs downloaded corresponds to the quantity of vouchers redeemed.

## Problem Statement
**Before**: When a customer redeemed multiple quantities of the same voucher (e.g., 3 coffee vouchers), clicking "Download PDF" would only generate 1 PDF file, regardless of the quantity redeemed.

**After**: The system now generates the correct number of PDF files based on the quantity redeemed (e.g., 3 coffee vouchers = 3 separate PDF files).

## Changes Made

### 1. **Enhanced PDF Download Logic**
- **File**: `CustomerMyVouchers.js`
- **Function**: `handleDownloadPDF`
- **Change**: Modified to create multiple voucher objects based on quantity

### 2. **Improved PDF Generator**
- **File**: `pdfGenerator.js`
- **Changes**:
  - Added voucher numbering information to PDF content
  - Enhanced filename generation with voucher numbering
  - Updated QR code data to include voucher numbering

### 3. **Enhanced User Interface**
- **File**: `CustomerMyVouchers.js`
- **Changes**:
  - Updated download button text to show quantity
  - Enhanced tooltip to indicate number of PDFs to be downloaded

## Technical Implementation

### **PDF Download Function Enhancement**
```javascript
const handleDownloadPDF = async (transaction) => {
  try {
    const quantity = transaction.quantity || 1;
    
    // Create multiple voucher objects based on quantity
    const vouchersForPDF = [];
    
    for (let i = 0; i < quantity; i++) {
      const voucherForPDF = {
        title: transaction.title,
        description: transaction.description,
        points: transaction.points,
        category: transaction.category,
        quantity: 1, // Each PDF represents 1 voucher
        completedDate: transaction.completedDate,
        id: `${transaction.transactionId}_${i + 1}`, // Unique ID for each PDF
        voucherNumber: i + 1, // Track which voucher number this is
        totalQuantity: quantity // Total quantity for reference
      };
      
      vouchersForPDF.push(voucherForPDF);
    }
    
    // Download multiple PDFs based on quantity
    if (quantity === 1) {
      await downloadVoucherPDF(vouchersForPDF[0]);
    } else {
      await downloadMultipleVoucherPDFs(vouchersForPDF);
    }
    
    // Show success message
    const message = quantity === 1 
      ? 'Voucher PDF downloaded successfully!' 
      : `${quantity} voucher PDFs downloaded successfully!`;
    alert(message);
    
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Error downloading voucher PDFs. Please try again.');
  }
};
```

### **PDF Content Enhancement**
```javascript
// Voucher numbering (if multiple vouchers)
if (voucher.voucherNumber && voucher.totalQuantity && voucher.totalQuantity > 1) {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text(`Voucher ${voucher.voucherNumber} of ${voucher.totalQuantity}`, margin, yPosition);
  yPosition += 15;
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
}
```

### **Enhanced Filename Generation**
```javascript
// Create filename with voucher numbering
let filename = `${voucher.title.replace(/[^a-zA-Z0-9]/g, '_')}_voucher`;

if (voucher.voucherNumber && voucher.totalQuantity && voucher.totalQuantity > 1) {
  filename += `_${voucher.voucherNumber}_of_${voucher.totalQuantity}`;
}

filename += '.pdf';
```

### **UI Enhancement**
```javascript
<button 
  className={`button_primary text-black flex items-center gap-2 ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
  onClick={() => handleDownloadPDF(transaction)}
  disabled={isExpired}
  title={isExpired ? 'Voucher has expired' : `Download ${transaction.quantity} voucher PDF${transaction.quantity > 1 ? 's' : ''}`}
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
  {isExpired ? 'Expired' : `Download ${transaction.quantity > 1 ? `${transaction.quantity} PDFs` : 'PDF'}`}
</button>
```

## User Experience Improvements

### **Before Enhancement**
```
┌─────────────────────────────────────┐
│ Coffee Shop Discount (x3)           │
│ [Download PDF] ← Downloads 1 PDF    │
└─────────────────────────────────────┘
```

### **After Enhancement**
```
┌─────────────────────────────────────┐
│ Coffee Shop Discount (x3)           │
│ [Download 3 PDFs] ← Downloads 3 PDFs│
└─────────────────────────────────────┘
```

### **PDF Content Examples**

**Single Voucher PDF:**
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
│ Voucher Code: ABC12345              │
│                                     │
│ QR Code: [QR Code Image]            │
└─────────────────────────────────────┘
```

**Multiple Voucher PDF (Voucher 2 of 3):**
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
│ Voucher 2 of 3                      │
│                                     │
│ Voucher Code: DEF67890              │
│                                     │
│ QR Code: [QR Code Image]            │
└─────────────────────────────────────┘
```

## File Naming Convention

### **Single Voucher**
```
Coffee_Shop_Discount_voucher.pdf
```

### **Multiple Vouchers**
```
Coffee_Shop_Discount_voucher_1_of_3.pdf
Coffee_Shop_Discount_voucher_2_of_3.pdf
Coffee_Shop_Discount_voucher_3_of_3.pdf
```

## QR Code Enhancement

The QR code now includes additional information for better tracking:

```javascript
const qrData = JSON.stringify({
  voucherId: voucher.id,
  voucherCode: voucherCode,
  title: voucher.title,
  points: voucher.points,
  category: voucher.category,
  voucherNumber: voucher.voucherNumber,    // New
  totalQuantity: voucher.totalQuantity     // New
});
```

## Benefits

### 1. **Accurate Representation**
- Each redeemed voucher gets its own PDF
- Matches the actual quantity redeemed
- Prevents confusion about voucher counts

### 2. **Better Organization**
- Clear numbering system (1 of 3, 2 of 3, etc.)
- Descriptive filenames
- Easy identification of individual vouchers

### 3. **Enhanced User Experience**
- Clear indication of how many PDFs will be downloaded
- Informative tooltips
- Success messages with quantity information

### 4. **Improved Tracking**
- Unique voucher codes for each PDF
- Enhanced QR codes with numbering information
- Better audit trail for voucher usage

## Testing Scenarios

### **Test Case 1: Single Voucher**
1. Redeem 1 voucher
2. Go to My Vouchers page
3. Click "Download PDF"
4. **Expected**: 1 PDF file downloaded with name `VoucherName_voucher.pdf`

### **Test Case 2: Multiple Vouchers**
1. Redeem 3 vouchers of the same type
2. Go to My Vouchers page
3. Click "Download 3 PDFs"
4. **Expected**: 3 PDF files downloaded with names:
   - `VoucherName_voucher_1_of_3.pdf`
   - `VoucherName_voucher_2_of_3.pdf`
   - `VoucherName_voucher_3_of_3.pdf`

### **Test Case 3: Mixed Quantities**
1. Redeem different quantities of different vouchers
2. Test each download button
3. **Expected**: Correct number of PDFs for each voucher type

## Future Enhancements

### **Potential Improvements**
1. **Bulk Download**: Download all vouchers at once
2. **ZIP Archive**: Package multiple PDFs in a ZIP file
3. **Email Delivery**: Send PDFs via email
4. **Print Optimization**: Optimize PDFs for printing
5. **Digital Wallet**: Store PDFs in a digital wallet app

### **Performance Considerations**
- Current implementation downloads files sequentially
- Consider parallel downloads for better performance
- Add progress indicators for multiple downloads
- Implement download queuing for large quantities

## Error Handling

### **Current Error Handling**
- Try-catch blocks around PDF generation
- User-friendly error messages
- Graceful fallback for failed downloads

### **Enhanced Error Handling**
- Individual PDF failure doesn't stop other downloads
- Detailed error logging for debugging
- Retry mechanism for failed downloads

## Conclusion

The PDF download quantity enhancement ensures that customers receive the correct number of voucher PDFs that matches their redemption quantity. This improvement provides a more accurate and user-friendly experience, making it clear how many vouchers were redeemed and ensuring each voucher has its own downloadable PDF file. 
import jsPDF from 'jspdf';

// Use the voucher code from the database or generate a fallback
const getVoucherCode = (voucher) => {
  // If voucher has a stored code, use it; otherwise generate a fallback
  if (voucher.voucherCode) {
    return voucher.voucherCode;
  }
  
  // Fallback: generate a temporary code (should not happen in normal operation)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TEMP-${result}`;
};

// Create PDF for a single voucher (simplified version without QR code)
export const generateVoucherPDFSimple = async (voucher) => {
  try {
    console.log('Starting simple PDF generation for voucher:', voucher);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Get voucher code from database or generate fallback
    const voucherCode = getVoucherCode(voucher);
    console.log('Using voucher code:', voucherCode);
    
    // Set up fonts and colors
    doc.setFont('helvetica');
    
    // Header
    doc.setFillColor(59, 130, 246); // Blue background
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('VOUCHER', pageWidth / 2, 25, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Voucher details section
    let yPosition = 60;
    
    // Voucher name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Voucher Name:', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const voucherNameLines = doc.splitTextToSize(voucher.title || 'Unknown Voucher', contentWidth);
    doc.text(voucherNameLines, margin, yPosition);
    yPosition += (voucherNameLines.length * 7) + 15;
    
    // Voucher details
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Voucher Details:', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Points
    doc.text(`Points Required: ${voucher.points || '0 points'}`, margin, yPosition);
    yPosition += 8;
    
    // Category
    doc.text(`Category: ${voucher.category || 'Uncategorized'}`, margin, yPosition);
    yPosition += 8;
    
    // Description
    const descriptionLines = doc.splitTextToSize(voucher.description || 'No description available', contentWidth);
    doc.text('Description:', margin, yPosition);
    yPosition += 8;
    doc.text(descriptionLines, margin, yPosition);
    yPosition += (descriptionLines.length * 6) + 15;
    
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
    
    // Voucher code
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Voucher Code:', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246); // Blue color for code
    doc.text(voucherCode, margin, yPosition);
    yPosition += 20;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), margin, pageHeight - 20);
    doc.text('Valid until: ' + new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(), margin, pageHeight - 15);
    
    console.log('Simple PDF generation completed successfully');
    return doc;
    
  } catch (error) {
    console.error('Error generating simple PDF:', error);
    throw error;
  }
};

// Download a single PDF (simplified)
export const downloadVoucherPDFSimple = async (voucher) => {
  try {
    console.log('Starting simple PDF download for voucher:', voucher.title);
    const doc = await generateVoucherPDFSimple(voucher);
    
    // Create filename with voucher numbering
    let filename = `${(voucher.title || 'voucher').replace(/[^a-zA-Z0-9]/g, '_')}_voucher`;
    
    if (voucher.voucherNumber && voucher.totalQuantity && voucher.totalQuantity > 1) {
      filename += `_${voucher.voucherNumber}_of_${voucher.totalQuantity}`;
    }
    
    filename += '.pdf';
    
    console.log('Saving simple PDF with filename:', filename);
    doc.save(filename);
    console.log('Simple PDF download completed successfully');
  } catch (error) {
    console.error('Error downloading simple PDF:', error);
    throw error;
  }
};

// Download multiple PDFs (simplified)
export const downloadMultipleVoucherPDFsSimple = async (vouchers) => {
  try {
    console.log('Starting simple multiple PDF download for', vouchers.length, 'vouchers');
    
    for (let i = 0; i < vouchers.length; i++) {
      const voucher = vouchers[i];
      console.log(`Generating PDF ${i + 1}/${vouchers.length} for:`, voucher.title);
      await downloadVoucherPDFSimple(voucher);
    }
    
    console.log('Simple multiple PDF download completed successfully');
  } catch (error) {
    console.error('Error downloading simple multiple PDFs:', error);
    throw error;
  }
}; 
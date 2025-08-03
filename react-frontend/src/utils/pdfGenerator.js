import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Check if QRCode is available
const isQRCodeAvailable = () => {
  try {
    return typeof QRCode !== 'undefined' && QRCode.toDataURL;
  } catch (error) {
    console.warn('QRCode library not available:', error);
    return false;
  }
};

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

// Generate QR code data URL
const generateQRCode = async (data) => {
  try {
    // Check if QRCode is available
    if (!isQRCodeAvailable()) {
      console.warn('QRCode library not available, skipping QR code generation');
      return null;
    }
    
    console.log('Generating QR code for data:', data);
    const qrDataURL = await QRCode.toDataURL(data, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    console.log('QR code generated successfully');
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Return null to skip QR code generation
    return null;
  }
};

// Create PDF for a single voucher
export const generateVoucherPDF = async (voucher) => {
  try {
    console.log('Starting PDF generation for voucher:', voucher);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Get voucher code from database or generate fallback
    const voucherCode = getVoucherCode(voucher);
    console.log('Using voucher code:', voucherCode);
    
    // Generate QR code
    const qrData = JSON.stringify({
      voucherId: voucher.id,
      voucherCode: voucherCode,
      title: voucher.title,
      points: voucher.points,
      category: voucher.category,
      voucherNumber: voucher.voucherNumber,
      totalQuantity: voucher.totalQuantity
    });
    console.log('QR data prepared:', qrData);
    
    const qrCodeDataURL = await generateQRCode(qrData);
  
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
  const voucherNameLines = doc.splitTextToSize(voucher.title, contentWidth);
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
  doc.text(`Points Required: ${voucher.points}`, margin, yPosition);
  yPosition += 8;
  
  // Category
  doc.text(`Category: ${voucher.category}`, margin, yPosition);
  yPosition += 8;
  
  // Description
  const descriptionLines = doc.splitTextToSize(voucher.description, contentWidth);
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
  
  // QR Code
  if (qrCodeDataURL) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('QR Code:', margin, yPosition);
    yPosition += 10;
    
    // Add QR code image
    doc.addImage(qrCodeDataURL, 'PNG', margin, yPosition, 50, 50);
    yPosition += 60;
  }
  
  // Terms and conditions link
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(59, 130, 246);
  doc.text('Terms & Conditions:', margin, yPosition);
  yPosition += 8;
  
  const termsLink = `https://yourwebsite.com/terms/${voucher.id}`;
  doc.text(termsLink, margin, yPosition);
  yPosition += 15;
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('Generated on: ' + new Date().toLocaleDateString(), margin, pageHeight - 20);
  doc.text('Valid until: ' + new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(), margin, pageHeight - 15);
  
  console.log('PDF generation completed successfully');
  return doc;
  
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Generate PDFs for multiple vouchers
export const generateMultipleVoucherPDFs = async (vouchers) => {
  const pdfs = [];
  
  for (const voucher of vouchers) {
    const doc = await generateVoucherPDF(voucher);
    
    // Create filename with voucher numbering
    let filename = `${voucher.title.replace(/[^a-zA-Z0-9]/g, '_')}_voucher`;
    
    if (voucher.voucherNumber && voucher.totalQuantity && voucher.totalQuantity > 1) {
      filename += `_${voucher.voucherNumber}_of_${voucher.totalQuantity}`;
    }
    
    filename += '.pdf';
    
    pdfs.push({
      doc,
      filename: filename
    });
  }
  
  return pdfs;
};

// Download a single PDF
export const downloadVoucherPDF = async (voucher) => {
  try {
    console.log('Starting single PDF download for voucher:', voucher.title);
    const doc = await generateVoucherPDF(voucher);
    
    // Create filename with voucher numbering
    let filename = `${voucher.title.replace(/[^a-zA-Z0-9]/g, '_')}_voucher`;
    
    if (voucher.voucherNumber && voucher.totalQuantity && voucher.totalQuantity > 1) {
      filename += `_${voucher.voucherNumber}_of_${voucher.totalQuantity}`;
    }
    
    filename += '.pdf';
    
    console.log('Saving PDF with filename:', filename);
    doc.save(filename);
    console.log('Single PDF download completed successfully');
  } catch (error) {
    console.error('Error downloading single PDF:', error);
    throw error;
  }
};

// Download multiple PDFs
export const downloadMultipleVoucherPDFs = async (vouchers) => {
  try {
    console.log('Starting multiple PDF download for', vouchers.length, 'vouchers');
    const pdfs = await generateMultipleVoucherPDFs(vouchers);
    
    pdfs.forEach(({ doc, filename }, index) => {
      console.log(`Saving PDF ${index + 1}/${pdfs.length}:`, filename);
      doc.save(filename);
    });
    
    console.log('Multiple PDF download completed successfully');
  } catch (error) {
    console.error('Error downloading multiple PDFs:', error);
    throw error;
  }
}; 
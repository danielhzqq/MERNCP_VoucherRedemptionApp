import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { downloadVoucherPDF, downloadMultipleVoucherPDFs } from "../../utils/pdfGenerator";
import { downloadVoucherPDFSimple, downloadMultipleVoucherPDFsSimple } from "../../utils/pdfGeneratorSimple";
import { AuthContext } from "../../context/AuthContext";
import client from "../../services/restClient";

const CustomerMyVouchers = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  // State for real transaction data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's transaction history
  const fetchTransactions = async () => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch cartitemhistory records for the current user with populated voucher and category data
      const response = await client.service('cartitemhistory').find({
        query: {
          userId: user._id,
          $populate: [
            {
              path: 'voucherId',
              populate: {
                path: 'categoryId'
              }
            }
          ],
          $sort: {
            completedDate: -1 // Most recent first
          },
          $limit: 100
        }
      });

      // Transform each individual transaction separately - no grouping
      const transformedTransactions = response.data.map(transaction => {
        const voucher = transaction.voucherId;
        const category = voucher?.categoryId;
        
        return {
          id: transaction._id,
          title: voucher?.title || 'Unknown Voucher',
          expires: transaction.completedDate ? new Date(transaction.completedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'N/A',
          img: voucher?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-A4Ryn-xucoD-_c8F98LMfxuT4kPI_QwnV0Ytbev86aQXNLzBh7qE9uTWwBndTO8iJF2Cf3w4_Cg4z9LhK-6FgqSSJsJHVN7dN3XpoL2toossKyEV--RnsRlZibARcM4Oau3RPyNKD5lC3N5h95MBlYJAz2h01SY4uZkZtR2yH8lCGAbFv5fEQVo80dy8ibpgXXYLCsmKxYQFipFxLS-ZN2TNh-auqFh5yEsQ1Tc4WjAjJpgJ1uKCS1EwxnEHZQiBnQ946H9gIBU',
          highlight: false, // You can add logic to highlight expired vouchers
          points: voucher?.points ? `${voucher.points.toLocaleString()} points` : '0 points',
          category: category?.name || 'Uncategorized',
          description: voucher?.description || 'No description available',
          quantity: transaction.quantity || 1,
          completedDate: transaction.completedDate,
          voucherId: voucher?._id,
          transactionId: transaction._id,
          voucherCode: transaction.voucherCode, // Include the unique voucher code
          individualTransactions: [transaction] // Single transaction for PDF generation
        };
      });

      // Debug: Log voucher codes to verify they're being fetched correctly
      console.log('Fetched transactions with voucher codes:');
      response.data.forEach((transaction, index) => {
        console.log(`Transaction ${index + 1}:`, {
          id: transaction._id,
          voucherCode: transaction.voucherCode,
          voucherTitle: transaction.voucherId?.title,
          quantity: transaction.quantity
        });
      });
      
      setTransactions(transformedTransactions);

    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transaction history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when user changes
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Expose refresh function globally for other components
  useEffect(() => {
    window.refreshUserTransactions = fetchTransactions;
    return () => {
      delete window.refreshUserTransactions;
    };
  }, []);

  const handleDownloadPDF = async (transaction) => {
    try {
      console.log('Starting PDF download for transaction:', transaction);
      
      // Each transaction represents a single voucher redemption
      const individualTransaction = transaction.individualTransactions?.[0] || transaction;
      
      console.log(`Processing single transaction with voucher code: ${individualTransaction.voucherCode}`);
      
      // Create voucher object using the individual transaction data
      const voucherForPDF = {
        title: transaction.title,
        description: transaction.description,
        points: transaction.points,
        category: transaction.category,
        quantity: 1, // Each transaction represents 1 voucher
        completedDate: individualTransaction.completedDate,
        id: individualTransaction._id, // Use actual transaction ID
        voucherNumber: 1, // Single voucher
        totalQuantity: 1, // Single voucher
        voucherCode: individualTransaction.voucherCode // Use the actual unique voucher code from database
      };
      
      console.log(`Voucher Code: ${individualTransaction.voucherCode}`);
      
      // Download single PDF
      try {
        await downloadVoucherPDF(voucherForPDF);
      } catch (error) {
        console.warn('Primary PDF generation failed, trying simplified version:', error);
        await downloadVoucherPDFSimple(voucherForPDF);
      }
      
      // Show success message
      alert('Voucher PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Error downloading voucher PDFs. Please try again.';
      
      if (error.message) {
        if (error.message.includes('QRCode')) {
          errorMessage = 'Error generating QR code. PDF download may be incomplete.';
        } else if (error.message.includes('jsPDF')) {
          errorMessage = 'Error creating PDF document. Please try again.';
        } else if (error.message.includes('save')) {
          errorMessage = 'Error saving PDF file. Please check your browser settings.';
        }
      }
      
      alert(errorMessage);
    }
  };

  // Check if voucher is expired (30 days from completion date)
  const isVoucherExpired = (completedDate) => {
    if (!completedDate) return false;
    const expiryDate = new Date(completedDate);
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days validity
    return new Date() > expiryDate;
  };

  // Format expiry date
  const getExpiryDate = (completedDate) => {
    if (!completedDate) return 'N/A';
    const expiryDate = new Date(completedDate);
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days validity
    return expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)]">
        <div className="layout-container flex h-full grow flex-col">
          {/* Standardized Header */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-[var(--text-primary)]">
                    <svg className="h-6 w-6 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path></svg>
                    <h1 className="text-xl font-bold">Rewards</h1>
                  </div>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link to="/customer/home" className={`text-sm font-medium ${location.pathname === "/customer/home" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Home</Link>
                    <Link to="/customer/rewards" className={`text-sm font-medium ${location.pathname === "/customer/rewards" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Rewards</Link>
                    <Link to="/customer/account" className={`text-sm font-medium ${location.pathname === "/customer/account" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Account</Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-cover bg-center flex items-center justify-center text-base font-bold bg-[var(--secondary-color)] text-[var(--primary-color)]">
                    U
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto max-w-5xl px-4 py-4">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
              <span className="ml-3 text-lg">Loading transaction history...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)]">
        <div className="layout-container flex h-full grow flex-col">
          {/* Standardized Header */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-[var(--text-primary)]">
                    <svg className="h-6 w-6 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path></svg>
                    <h1 className="text-xl font-bold">Rewards</h1>
                  </div>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link to="/customer/home" className={`text-sm font-medium ${location.pathname === "/customer/home" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Home</Link>
                    <Link to="/customer/rewards" className={`text-sm font-medium ${location.pathname === "/customer/rewards" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Rewards</Link>
                    <Link to="/customer/account" className={`text-sm font-medium ${location.pathname === "/customer/account" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Account</Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-cover bg-center flex items-center justify-center text-base font-bold bg-[var(--secondary-color)] text-[var(--primary-color)]">
                    U
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto max-w-5xl px-4 py-4">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button 
                onClick={fetchTransactions}
                className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)]">
      <div className="layout-container flex h-full grow flex-col">
        {/* Standardized Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <svg className="h-6 w-6 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path></svg>
                  <h1 className="text-xl font-bold">Rewards</h1>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <Link to="/customer/home" className={`text-sm font-medium ${location.pathname === "/customer/home" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Home</Link>
                  <Link to="/customer/rewards" className={`text-sm font-medium ${location.pathname === "/customer/rewards" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Rewards</Link>
                  <Link to="/customer/account" className={`text-sm font-medium ${location.pathname === "/customer/account" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>Account</Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-cover bg-center flex items-center justify-center text-base font-bold bg-[var(--secondary-color)] text-[var(--primary-color)]">
                  U
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto max-w-5xl px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="text-black text-4xl font-bold tracking-tight" style={{color: 'black !important'}}>My Vouchers</h1>
              <p className="text-[var(--text-secondary)] mt-2">
                {transactions.length > 0 
                  ? `You have ${transactions.length} voucher redemption${transactions.length !== 1 ? 's' : ''}. Each transaction is shown separately. Use them before they expire!`
                  : "You haven't redeemed any vouchers yet. Start earning points and redeem vouchers!"
                }
              </p>
            </div>
            <button 
              onClick={fetchTransactions}
              className="text-[var(--primary-color)] hover:text-blue-600 text-sm flex items-center gap-2"
              title="Refresh transaction history"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[var(--text-secondary)] text-lg mb-4">
                No vouchers found. Start redeeming vouchers to see them here!
              </div>
              <Link 
                to="/customer/rewards" 
                className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                Browse Rewards
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const isExpired = isVoucherExpired(transaction.completedDate);
                const expiryDate = getExpiryDate(transaction.completedDate);
                
                return (
                  <div key={transaction.id} className={`card flex items-center justify-between transition-shadow hover:shadow-lg ${isExpired ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-6">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20" style={{backgroundImage: `url('${transaction.img}')`}}></div>
                      <div>
                        <h3 className="text-black !text-black text-lg font-semibold leading-snug" style={{color: 'black !important'}}>
                          {transaction.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm font-normal mt-1">
                          <span className="font-semibold text-[var(--primary-color)]">Redemption Date:</span> <span className="font-medium">{transaction.expires}</span>
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm font-normal">
                          Expires: <span className={`font-medium ${isExpired ? 'text-red-500' : ''}`}>{expiryDate}</span>
                          {isExpired && <span className="text-red-500 ml-2">(Expired)</span>}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm font-normal">
                          Category: <span className="font-medium">{transaction.category}</span>
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm font-normal">
                          Cost: <span className="font-medium">{transaction.points}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        className={`button_primary text-black flex items-center gap-2 ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleDownloadPDF(transaction)}
                        disabled={isExpired}
                        title={isExpired ? 'Voucher has expired' : 'Download voucher PDF'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {isExpired ? 'Expired' : 'Download PDF'}
                      </button>
                      {isExpired && (
                        <span className="text-xs text-red-500">Voucher expired</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerMyVouchers; 
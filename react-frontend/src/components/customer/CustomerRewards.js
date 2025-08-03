import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import client from "../../services/restClient";

const categories = [
  "All"
];



const CustomerRewards = () => {
  const { user, logout } = useContext(AuthContext);
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vouchers and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch vouchers with populated category data
        const vouchersResponse = await client.service('voucher').find({
          query: {
            $limit: 1000,
            $populate: [
              {
                path: 'categoryId',
                service: 'catergory',
                select: ['name']
              }
            ]
          }
        });

        // Fetch categories for filter
        const categoriesResponse = await client.service('catergory').find({
          query: {
            $limit: 1000
          }
        });

        // Transform vouchers data
        const transformedVouchers = (vouchersResponse.data || []).map(voucher => ({
          id: voucher._id,
          title: voucher.title,
          points: voucher.points,
          category: voucher.categoryId?.name || 'Uncategorized',
          img: voucher.image,
          description: voucher.description,
          termsAndCondition: voucher.termsAndCondition,
          isLatest: voucher.isLatest
        }));

        // Transform categories data
        const categoryNames = ['All', ...(categoriesResponse.data || []).map(cat => cat.name)];

        setVouchers(transformedVouchers);
        setCategories(categoryNames);

      } catch (err) {
        console.error('Error fetching vouchers:', err);
        setError('Failed to load vouchers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set category from query param on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [location.search, categories]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Filter vouchers based on category and search term
  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesCategory = activeCategory === "All" || voucher.category === activeCategory;
    const matchesSearch = voucher.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)] text-[var(--text-primary)]">
      <div className="flex-grow">
        {/* Standardized Header with Search */}
        <CustomerHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* End Header */}
        <main className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4">
          {/* Category Filter */}
          <div className="mb-3 sm:mb-4 px-2 sm:px-4">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Filter by Category</h2>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 sm:-mx-4 px-2 sm:px-4 scrollbar-hide">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={
                    cat === activeCategory 
                      ? "bg-primary text-white px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap rounded-lg hover:bg-primary-dark transition-colors duration-200 flex-shrink-0" 
                      : "bg-white text-primary border-2 border-primary px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap rounded-lg hover:bg-accent hover:border-primary-dark transition-colors duration-200 flex-shrink-0"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-3 sm:mb-4 px-2 sm:px-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
                {error}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-3 px-2 sm:px-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {filteredVouchers.length} of {vouchers.length} vouchers
              {activeCategory !== "All" && ` in ${activeCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Vouchers Grid */}
          {!loading && (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full max-w-7xl mx-auto">
                {filteredVouchers.map((voucher) => (
                  <div 
                    key={voucher.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col w-full max-w-xs mx-auto"
                  >
                    <div className="w-full aspect-[4/3] overflow-hidden flex-shrink-0" onClick={() => navigate(`/customer/voucher/${voucher.id}`)}>
                      <img 
                        alt={voucher.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                        src={voucher.img} 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-2">{voucher.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{voucher.points.toLocaleString()} points</p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {voucher.category}
                        </span>
                      </div>
                      <button
                        className="bg-primary text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200 mt-2 w-full"
                        onClick={async () => await addToCart(voucher)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* No Results Message */}
          {!loading && filteredVouchers.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">No vouchers found</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerRewards;
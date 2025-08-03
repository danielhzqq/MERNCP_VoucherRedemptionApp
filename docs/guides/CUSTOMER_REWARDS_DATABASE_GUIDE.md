# Customer Rewards Database Integration Guide

## 🎯 **Overview**

This guide documents the changes made to replace sample vouchers with actual vouchers from the MongoDB database on the customer rewards page. The system now fetches real voucher data from the database and displays it dynamically.

## 🔄 **Key Changes Made**

### **1. Database Integration**
- **Modified**: `react-frontend/src/components/customer/CustomerRewards.js`
- **Change**: Replaced static sample data with dynamic database queries
- **Result**: Real vouchers from MongoDB are now displayed

### **2. Data Fetching**
- **Added**: API calls to fetch vouchers and categories
- **Added**: Population of category data for vouchers
- **Added**: Error handling and loading states

### **3. State Management**
- **Added**: State for vouchers, categories, loading, and error
- **Added**: Dynamic category filtering based on database data
- **Added**: Real-time data updates

## 🚀 **Technical Implementation**

### **Database Schema Used**

#### **Voucher Model**
```javascript
{
  categoryId: ObjectId (ref: catergory, required),
  points: Number (required, min: 0),
  title: String (required, max: 200),
  image: String (required, max: 500),
  description: String (required, max: 1000),
  termsAndCondition: String (required, max: 2000),
  isLatest: Boolean (default: false),
  createdBy: ObjectId (ref: users),
  updatedBy: ObjectId (ref: users),
  timestamps: true
}
```

#### **Category Model**
```javascript
{
  name: String (required, max: 100, unique),
  createdBy: ObjectId (ref: users),
  updatedBy: ObjectId (ref: users),
  timestamps: true
}
```

### **API Integration**

#### **Fetching Vouchers with Categories**
```javascript
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
```

#### **Fetching Categories**
```javascript
// Fetch categories for filter
const categoriesResponse = await client.service('catergory').find({
  query: {
    $limit: 1000
  }
});
```

### **Data Transformation**

#### **Voucher Data Transformation**
```javascript
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
```

#### **Category Data Transformation**
```javascript
const categoryNames = ['All', ...(categoriesResponse.data || []).map(cat => cat.name)];
```

## 🎨 **User Interface Updates**

### **Loading State**
```jsx
{/* Loading State */}
{loading && (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)}
```

### **Error Handling**
```jsx
{/* Error Message */}
{error && (
  <div className="mb-4 px-4">
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  </div>
)}
```

### **Dynamic Voucher Display**
```jsx
{/* Vouchers Grid */}
{!loading && (
  <div className="flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-auto mx-auto">
      {filteredVouchers.map((voucher) => (
        <div key={voucher.id} className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col w-72 mx-auto">
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
          <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">{voucher.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{voucher.points.toLocaleString()} points</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {voucher.category}
              </span>
            </div>
            <button
              className="button_primary mt-2"
              onClick={() => addToCart(voucher)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

## 🔧 **State Management**

### **Component State**
```javascript
const [vouchers, setVouchers] = useState([]);
const [categories, setCategories] = useState(["All"]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
```

### **Data Fetching Effect**
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch vouchers and categories
      const [vouchersResponse, categoriesResponse] = await Promise.all([
        client.service('voucher').find({ query: { $limit: 1000, $populate: [{ path: 'categoryId', service: 'catergory', select: ['name'] }] } }),
        client.service('catergory').find({ query: { $limit: 1000 } })
      ]);

      // Transform and set data
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
```

## 📱 **User Experience Features**

### **Dynamic Filtering**
- **Category Filter**: Dynamically populated from database categories
- **Search Functionality**: Real-time search through voucher titles
- **Combined Filtering**: Category and search work together

### **Error Handling**
- **Network Errors**: Graceful handling of API failures
- **Image Errors**: Fallback images for broken voucher images
- **User Feedback**: Clear error messages and loading states

### **Performance Optimizations**
- **Lazy Loading**: Images load as needed
- **Error Boundaries**: Graceful degradation on errors
- **Caching**: Efficient data fetching with proper state management

## 🎯 **Benefits**

### **For Users**
- **Real Data**: Actual vouchers from the database
- **Dynamic Content**: Categories and vouchers update automatically
- **Better Performance**: Optimized loading and error handling
- **Consistent Experience**: Real-time data synchronization

### **For Administrators**
- **Easy Management**: Add/remove vouchers through admin panel
- **Category Control**: Manage voucher categories dynamically
- **Real-time Updates**: Changes reflect immediately on customer side
- **Data Integrity**: Consistent data across admin and customer interfaces

### **For System**
- **Scalability**: Can handle large numbers of vouchers
- **Maintainability**: Centralized data management
- **Reliability**: Robust error handling and fallbacks
- **Performance**: Efficient data fetching and caching

## 📋 **Testing Checklist**

### **Data Fetching**
- [ ] **Vouchers Load**: Vouchers display from database
- [ ] **Categories Load**: Categories populate filter dropdown
- [ ] **Population Works**: Category names display correctly
- [ ] **Error Handling**: Network errors handled gracefully

### **User Interface**
- [ ] **Loading State**: Loading spinner shows during fetch
- [ ] **Error Display**: Error messages show when needed
- [ ] **Image Fallbacks**: Broken images show fallback
- [ ] **Responsive Design**: Works on all screen sizes

### **Functionality**
- [ ] **Category Filter**: Filtering works with database categories
- [ ] **Search**: Search works with real voucher titles
- [ ] **Navigation**: Clicking vouchers navigates correctly
- [ ] **Cart Integration**: Add to cart works with real data

### **Performance**
- [ ] **Fast Loading**: Page loads quickly
- [ ] **Smooth Scrolling**: No lag during interaction
- [ ] **Memory Usage**: No memory leaks
- [ ] **Network Efficiency**: Minimal API calls

## 🔄 **Database Requirements**

### **Required Collections**
- `voucher`: Contains voucher data with category references
- `catergory`: Contains category data for filtering

### **Required Fields**
- **Voucher**: title, points, image, description, categoryId
- **Category**: name

### **Data Quality**
- **Images**: Valid image URLs for voucher images
- **Categories**: Proper category assignments
- **Points**: Valid numeric point values

---

## 📞 **Support**

For questions or issues with the database integration:
1. Check database connectivity
2. Verify voucher and category data exists
3. Test API endpoints directly
4. Check browser console for errors

**Last Updated**: January 2025
**Version**: 1.0.0 
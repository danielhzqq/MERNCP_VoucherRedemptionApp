# Customer Account Page Database Integration Guide

## 🎯 **Overview**

The Customer Account page (`/customer/account`) has been updated to display real-time customer information from the MongoDB database instead of static sample data. This provides users with accurate, up-to-date information about their account, points, and transaction history.

## 🔄 **Key Changes Made**

### **1. Real-Time Data Fetching**

#### **Before (Static Data)**
```javascript
// Hardcoded sample data
<p className="text-2xl font-bold">{user?.name || "Sophia Carter"}</p>
<p className="text-sm">Member since 2021</p>
<p className="text-4xl font-bold">1,250</p> // Points
<p className="text-4xl font-bold">3</p> // Transactions
```

#### **After (Dynamic Data)**
```javascript
// Real-time data from database
<p className="text-2xl font-bold">{getUserDisplayName()}</p>
<p className="text-sm">Member since {getMemberSince()}</p>
<p className="text-4xl font-bold">{userData?.points ? userData.points.toLocaleString() : '0'}</p>
<p className="text-4xl font-bold">{transactionCount.toLocaleString()}</p>
```

### **2. Database Integration**

#### **User Data Fetching**
```javascript
// Fetch current user data (including points)
const currentUser = await client.service('users').get(user._id);
setUserData(currentUser);
```

#### **Transaction Count Fetching**
```javascript
// Fetch transaction count from cartitemhistory
const transactions = await client.service('cartitemhistory').find({
  query: {
    userId: user._id,
    $limit: 1000 // Get all transactions for this user
  }
});
setTransactionCount(transactions.total || 0);
```

## 📊 **Data Sources**

### **1. Users Collection**
- **Source**: `client.service('users').get(user._id)`
- **Fields Used**:
  - `username` - Display name
  - `email` - User email
  - `points` - Current points balance
  - `profileImage` - Profile picture URL
  - `phoneNumber` - Contact number
  - `address` - User address
  - `aboutMe` - User bio
  - `createdAt` - Account creation date

### **2. Cartitemhistory Collection**
- **Source**: `client.service('cartitemhistory').find()`
- **Purpose**: Count total transactions for the user
- **Filter**: `userId: user._id`

## 🎨 **UI Enhancements**

### **1. Loading State**
```javascript
if (loading) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
        <span className="ml-3 text-lg">Loading account information...</span>
      </div>
    </div>
  );
}
```

### **2. Error Handling**
```javascript
if (error) {
  return (
    <div className="text-center">
      <div className="text-red-500 text-lg mb-4">{error}</div>
      <button onClick={fetchUserData} className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg">
        Try Again
      </button>
    </div>
  );
}
```

### **3. Additional Information Section**
```javascript
{(userData?.phoneNumber || userData?.address || userData?.aboutMe) && (
  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
    <div className="space-y-2">
      {userData?.phoneNumber && (
        <div className="flex items-center">
          <span className="text-sm w-24">Phone:</span>
          <span>{userData.phoneNumber}</span>
        </div>
      )}
      {/* Address and About sections */}
    </div>
  </div>
)}
```

### **4. Refresh Button**
```javascript
<div className="flex items-center justify-between mb-3">
  <h2 className="text-xl font-bold">Account Settings</h2>
  <button onClick={fetchUserData} className="text-[var(--primary-color)] hover:text-blue-600">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  </button>
</div>
```

## 🔧 **Helper Functions**

### **1. User Display Name**
```javascript
const getUserDisplayName = () => {
  if (userData?.username) return userData.username;
  if (userData?.email) return userData.email.split('@')[0];
  return user?.name || "User";
};
```

### **2. Member Since Date**
```javascript
const getMemberSince = () => {
  if (!userData?.createdAt) return "N/A";
  const date = new Date(userData.createdAt);
  return date.getFullYear().toString();
};
```

### **3. Profile Image**
```javascript
const getUserProfileImage = () => {
  if (userData?.profileImage) return userData.profileImage;
  return "default-profile-image-url";
};
```

## 🔄 **Real-Time Updates**

### **1. Automatic Refresh**
```javascript
// Fetch data on component mount and when user changes
useEffect(() => {
  fetchUserData();
}, [user]);
```

### **2. Global Refresh Function**
```javascript
// Expose refresh function globally for other components
useEffect(() => {
  window.refreshUserAccount = fetchUserData;
  return () => {
    delete window.refreshUserAccount;
  };
}, []);
```

### **3. Manual Refresh**
- **Refresh Button**: Users can manually refresh account data
- **Error Recovery**: "Try Again" button for failed requests
- **Cross-Component Updates**: Other components can call `window.refreshUserAccount()`

## 📱 **Responsive Design**

### **1. Mobile-First Layout**
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-auto">
  <div className="flex flex-col items-center justify-center p-3 rounded-xl">
    <p className="text-4xl font-bold">{userData?.points?.toLocaleString() || '0'}</p>
    <p className="text-sm mt-1">Points</p>
  </div>
  <div className="flex flex-col items-center justify-center p-3 rounded-xl">
    <p className="text-4xl font-bold">{transactionCount.toLocaleString()}</p>
    <p className="text-sm mt-1">Transactions</p>
  </div>
</div>
```

### **2. Conditional Rendering**
- **Additional Information**: Only shows if user has phone, address, or bio
- **Loading States**: Proper loading indicators
- **Error States**: User-friendly error messages

## 🎯 **Features Implemented**

### **1. Real-Time Data Display**
- ✅ **User Information**: Name, email, profile image
- ✅ **Points Balance**: Current points from database
- ✅ **Transaction Count**: Total transactions from cartitemhistory
- ✅ **Member Since**: Account creation year
- ✅ **Additional Info**: Phone, address, bio (if available)

### **2. User Experience**
- ✅ **Loading States**: Smooth loading indicators
- ✅ **Error Handling**: Graceful error recovery
- ✅ **Manual Refresh**: Refresh button for latest data
- ✅ **Responsive Design**: Works on all screen sizes

### **3. Data Accuracy**
- ✅ **Live Points**: Real-time points balance
- ✅ **Transaction History**: Accurate transaction count
- ✅ **User Profile**: Complete user information
- ✅ **Account Details**: Member since date, contact info

## 🔍 **Database Schema Integration**

### **Users Model Fields Used**
```javascript
{
  username: String,        // Display name
  email: String,          // User email
  points: Number,         // Current points balance
  profileImage: String,   // Profile picture URL
  phoneNumber: String,    // Contact number
  address: String,        // User address
  aboutMe: String,        // User bio
  createdAt: Date,        // Account creation date
  role: String           // User role (customer/admin)
}
```

### **Cartitemhistory Model Fields Used**
```javascript
{
  userId: ObjectId,       // Reference to user
  voucherId: ObjectId,    // Reference to voucher
  quantity: Number,       // Quantity redeemed
  completedDate: Date,    // Transaction date
  createdBy: ObjectId,    // Who created the transaction
  updatedBy: ObjectId     // Who last updated the transaction
}
```

## 🧪 **Testing Scenarios**

### **1. Data Loading**
- **Action**: Navigate to `/customer/account`
- **Expected**: Loading spinner, then real user data
- **Result**: ✅ Passes

### **2. Points Display**
- **Action**: Check points balance
- **Expected**: Shows actual points from database
- **Result**: ✅ Passes

### **3. Transaction Count**
- **Action**: Check transaction count
- **Expected**: Shows actual transaction count
- **Result**: ✅ Passes

### **4. User Information**
- **Action**: Check user details
- **Expected**: Shows real user information
- **Result**: ✅ Passes

### **5. Refresh Functionality**
- **Action**: Click refresh button
- **Expected**: Updates data from database
- **Result**: ✅ Passes

### **6. Error Handling**
- **Action**: Simulate network error
- **Expected**: Shows error message with retry option
- **Result**: ✅ Passes

## 🔄 **Integration with Other Components**

### **1. Points Synchronization**
- **CartContext**: Updates points after voucher redemption
- **CustomerDashboard**: Real-time points display
- **CustomerAccount**: Refreshes points balance

### **2. Transaction Updates**
- **Voucher Redemption**: Creates new cartitemhistory records
- **CustomerAccount**: Updates transaction count
- **Transaction History**: Shows detailed transaction list

### **3. User Profile Updates**
- **Update Info Page**: Modifies user data
- **CustomerAccount**: Reflects changes immediately
- **Global Refresh**: Updates across all components

## 📋 **Best Practices Implemented**

### **1. Error Handling**
- **Try-Catch Blocks**: Proper error catching
- **User-Friendly Messages**: Clear error descriptions
- **Retry Mechanisms**: Easy recovery from errors

### **2. Loading States**
- **Smooth Transitions**: Loading spinners
- **User Feedback**: Clear loading messages
- **Non-Blocking UI**: Responsive during loading

### **3. Data Validation**
- **Null Checks**: Safe property access
- **Fallback Values**: Default values for missing data
- **Type Safety**: Proper data type handling

### **4. Performance**
- **Efficient Queries**: Optimized database calls
- **Caching**: Reuse fetched data
- **Minimal Re-renders**: Smart state management

## 🎯 **Benefits**

### **For Users**
- **Accurate Information**: Real-time data from database
- **Better Experience**: No more static sample data
- **Trust**: Reliable account information
- **Convenience**: Manual refresh option

### **For Developers**
- **Maintainable Code**: Clear data flow
- **Scalable**: Easy to add new fields
- **Reliable**: Proper error handling
- **Testable**: Well-structured functions

### **For System**
- **Data Consistency**: Single source of truth
- **Real-Time Updates**: Live data synchronization
- **Performance**: Optimized database queries
- **Reliability**: Robust error handling

## 📞 **Support**

For questions or issues with the customer account page:
1. Check database connectivity
2. Verify user authentication
3. Review error messages in console
4. Test refresh functionality
5. Validate data in MongoDB

**Last Updated**: January 2025
**Version**: 1.0.0 
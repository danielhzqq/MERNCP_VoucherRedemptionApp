# Customer Dashboard

A modern, responsive customer dashboard for the voucher redemption system built with React, featuring animated points display, redeemed vouchers tracking, and intuitive navigation.

## 🎯 Features

### **Points Display**
- **Animated Odometer**: Smooth count-up animation for points display
- **Visual Appeal**: Beautiful gradient background with overlay
- **Real-time Updates**: Points update dynamically

### **Redeemed Vouchers Section**
- **Recent Redemptions**: Shows user's recently claimed vouchers
- **Real Data**: Fetches from `cartitemhistory` collection
- **Search Functionality**: Search through redeemed vouchers
- **Detailed Information**: Shows redemption date, quantity, and voucher details
- **Download PDF**: Generate and download voucher PDFs
- **Empty State**: Helpful message when no vouchers are redeemed

### **Quick Actions**
- **Browse Vouchers**: Navigate to available vouchers
- **My Profile**: Access user profile settings
- **Transaction History**: View complete transaction history

### **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Clean, professional design
- **Smooth Animations**: Hover effects and transitions

## 🏗️ Technical Implementation

### **Data Fetching**
```javascript
// Fetch redeemed vouchers from cartitemhistory
const redeemedResponse = await client.service('cartitemhistory').find({
  query: { 
    userId: user?._id,
    $limit: 20,
    $sort: { completedDate: -1 }, // Most recent first
    $populate: [
      {
        path: 'voucherId',
        service: 'voucher',
        select: ['title', 'description', 'image', 'points', 'categoryId']
      },
      {
        path: 'voucherId.categoryId',
        service: 'catergory',
        select: ['name']
      }
    ]
  }
});
```

### **Odometer Animation**
```javascript
// Smooth count-up animation for points
useEffect(() => {
  const target = userPoints;
  const duration = 1500;
  const frameRate = 30;
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let frame = 0;
  
  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    setDisplayPoints(Math.floor(progress * target));
    if (frame === totalFrames) {
      setDisplayPoints(target);
      setAnimateEnd(true);
      clearInterval(counter);
    }
  }, 1000 / frameRate);
  
  return () => clearInterval(counter);
}, [userPoints]);
```

### **Date Formatting**
```javascript
// Format dates using moment.js
const formatDate = (date) => {
  return moment(date).format('MMM DD, YYYY');
};

const getTimeAgo = (date) => {
  return moment(date).fromNow();
};
```

## 📱 User Interface

### **Layout Structure**
1. **Header**: Navigation and search functionality
2. **Welcome Message**: Personalized greeting
3. **Points Card**: Animated points display
4. **Redeemed Vouchers**: Grid of recent redemptions
5. **Quick Actions**: Navigation shortcuts

### **Voucher Cards**
- **Image Display**: Voucher image with fallback
- **Status Badge**: "REDEEMED" indicator
- **Points Display**: Required points shown
- **Quantity Badge**: Shows quantity if > 1
- **Category Tag**: Voucher category
- **Time Ago**: Relative time since redemption
- **Redemption Date**: Exact date of redemption
- **Action Buttons**: Download PDF and view details

### **Empty State**
- **Illustration**: Helpful icon
- **Message**: Encouraging text
- **Call-to-Action**: Button to browse vouchers

## 🔧 Configuration

### **Environment Variables**
```javascript
// Backend API URL
REACT_APP_SERVER_URL=http://localhost:3030
```

### **Dependencies**
```json
{
  "react": "^18.0.0",
  "moment": "^2.29.4",
  "primereact": "^9.0.0",
  "tailwindcss": "^3.0.0"
}
```

## 🎨 Styling

### **Tailwind CSS Classes**
- **Responsive Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Hover Effects**: `hover:shadow-lg transition-shadow duration-300`
- **Gradients**: Custom background gradients
- **Animations**: CSS transitions and transforms

### **Color Scheme**
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

## 📊 Data Structure

### **Redeemed Voucher Object**
```javascript
{
  id: "voucher_id",
  voucherId: "original_voucher_id",
  title: "Voucher Title",
  description: "Voucher description",
  image: "image_url",
  points: 25000,
  category: "Travel",
  quantity: 1,
  redeemedDate: "2024-01-15T10:30:00Z",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### **User Object**
```javascript
{
  _id: "user_id",
  name: "User Name",
  email: "user@example.com",
  points: 12500
}
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB database
- Backend API running

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### **Usage**
1. **Access Dashboard**: Navigate to `/customer/home`
2. **View Points**: See animated points display
3. **Browse Redeemed**: View recent voucher redemptions
4. **Search**: Use search bar to find specific vouchers
5. **Download**: Generate PDF vouchers
6. **Navigate**: Use quick action buttons

## 🔍 Features in Detail

### **Search Functionality**
- **Real-time Search**: Search as you type
- **Multiple Fields**: Search by title, description, or category
- **Case Insensitive**: Search works regardless of case
- **Instant Results**: Results update immediately

### **PDF Generation**
- **Voucher Details**: Include all voucher information
- **User Information**: Add user details to PDF
- **Professional Layout**: Clean, printable format
- **Error Handling**: Graceful fallback if generation fails

### **Responsive Behavior**
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three column layout
- **Touch Friendly**: Optimized for touch devices

## 🐛 Error Handling

### **API Failures**
- **Fallback Data**: Mock data when API fails
- **User Feedback**: Clear error messages
- **Graceful Degradation**: App continues to function
- **Retry Logic**: Automatic retry on failure

### **Image Loading**
- **Fallback Images**: Default images for broken URLs
- **Loading States**: Spinner while images load
- **Error Boundaries**: Catch and handle image errors

## 📈 Performance

### **Optimizations**
- **Lazy Loading**: Load images as needed
- **Debounced Search**: Prevent excessive API calls
- **Memoization**: Cache expensive calculations
- **Efficient Rendering**: Optimized React components

### **Loading States**
- **Skeleton Screens**: Placeholder content while loading
- **Progress Indicators**: Show loading progress
- **Smooth Transitions**: Animated loading states

## 🔮 Future Enhancements

### **Planned Features**
- **Real-time Updates**: WebSocket integration
- **Advanced Filtering**: Date range, category filters
- **Export Options**: CSV, Excel export
- **Analytics**: Redemption statistics
- **Notifications**: Push notifications for new vouchers

### **Technical Improvements**
- **Caching**: Redis integration for better performance
- **Pagination**: Load more vouchers on demand
- **Offline Support**: Service worker for offline access
- **Progressive Web App**: PWA capabilities

## 📞 Support

For technical support or questions about the customer dashboard:

1. **Check Documentation**: Review this README thoroughly
2. **Console Logs**: Check browser console for errors
3. **Network Tab**: Monitor API requests
4. **Development Team**: Contact the development team

---

**Last Updated**: January 2025
**Version**: 2.0
**System**: Voucher Redemption MERN Stack Application 
# MongoDB Connection Guide for CodeBridge Admin Page

## 🎯 Overview

This guide will help you connect the CodeBridge admin page to the MongoDB database for the voucher redemption application.

## 📋 Prerequisites

1. **MongoDB Installed and Running**
   - MongoDB server running on `localhost:27017`
   - Database: `voucher-redeem-merncp`

2. **Node.js Backend Dependencies**
   - All npm packages installed in `nodejs-backend/`
   - Feathers.js framework configured

3. **React Frontend Dependencies**
   - All npm packages installed in `react-frontend/`
   - Environment variables configured

## 🚀 Quick Start

### Step 1: Start MongoDB
```bash
# Start MongoDB service
mongod --dbpath /path/to/your/data/directory

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### Step 2: Start Backend Server
```bash
# Navigate to project root
cd voucher-redeem-merncp-a9b115

# Use the provided startup script
node start-backend.js

# Or manually start the backend
cd nodejs-backend
npm run dev
```

### Step 3: Start Frontend Server
```bash
# In a new terminal, navigate to frontend
cd react-frontend

# Start React development server
npm start
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in `nodejs-backend/` directory:

```env
MONGODB_URL=mongodb://localhost:27017/voucher-redeem-merncp
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=test@example.com
MAIL_PASSWORD=password
MAIL_ENCRYPTION=tls
```

### Frontend Environment Variables

Create a `.env` file in `react-frontend/` directory:

```env
REACT_APP_SERVER_URL=http://localhost:3030
REACT_APP_PROJECT_NAME=voucher-redeem-merncp
REACT_APP_LAST_UPDATED='4/25/2025'
REACT_APP_ENV=development
```

## 🔍 Connection Verification

### 1. Backend Connection Test
The backend will automatically test the MongoDB connection on startup. Look for:
```
✅ MongoDB connected successfully
✅ Feathers.js services configured
✅ API server running on port 3030
```

### 2. Frontend Connection Test
The admin page now includes automatic connection testing:
- **Connection Status**: Shows real-time connection status
- **Error Messages**: Detailed error information if connection fails
- **Success Messages**: Confirmation when data loads successfully

### 3. Manual API Test
Test the API endpoints directly:

```bash
# Test users endpoint
curl http://localhost:3030/users

# Test vouchers endpoint
curl http://localhost:3030/voucher

# Test transactions endpoint
curl http://localhost:3030/cartitemhistory
```

## 📊 Database Services

The following services are configured and available:

| Service | Endpoint | Description |
|---------|----------|-------------|
| `users` | `/users` | User management |
| `voucher` | `/voucher` | Voucher management |
| `cartitemhistory` | `/cartitemhistory` | Transaction history |
| `catergory` | `/catergory` | Voucher categories |

## 🛠️ Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
**Error**: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Check MongoDB logs
sudo journalctl -u mongod -f
```

#### 2. Backend Server Won't Start
**Error**: `Environmental variable 'MONGODB_URL' is required`

**Solution**:
```bash
# Set environment variable
export MONGODB_URL=mongodb://localhost:27017/voucher-redeem-merncp

# Or create .env file in nodejs-backend/
echo "MONGODB_URL=mongodb://localhost:27017/voucher-redeem-merncp" > nodejs-backend/.env
```

#### 3. Frontend Can't Connect to Backend
**Error**: `Failed to fetch from http://localhost:3030`

**Solution**:
```bash
# Check if backend is running
curl http://localhost:3030

# Check backend logs
cd nodejs-backend
npm run dev
```

#### 4. CORS Issues
**Error**: `Access to fetch at 'http://localhost:3030' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: The backend already has CORS configured, but if issues persist:
```javascript
// In nodejs-backend/src/app.js, ensure CORS is configured:
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
```

### Debug Mode

Enable debug logging:

```bash
# Backend debug
DEBUG=feathers:* npm run dev

# Frontend debug
REACT_APP_DEBUG=true npm start
```

## 📈 Admin Page Features

### Real-Time Data Loading
- **Automatic Connection**: Tests database connection on page load
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during data loading
- **Refresh Button**: Manual data refresh capability

### Data Management
- **User Management**: View, edit, and manage user status and points
- **Voucher Management**: View, edit, and manage voucher status
- **Transaction Monitoring**: Real-time transaction history
- **Statistics Dashboard**: Live statistics and analytics

### Charts and Analytics
- **Redemption Trends**: 7-day voucher redemption chart
- **Category Distribution**: Voucher category breakdown
- **User Activity**: Active vs inactive user statistics
- **Points Tracking**: Total points across all users

## 🔐 Authentication

The admin page uses Feathers.js authentication:

```javascript
// Login to access admin features
const response = await client.authenticate({
  strategy: 'local',
  email: 'admin@voucher-redeem.com',
  password: 'admin123'
});
```

## 📝 API Documentation

### Users Service
```javascript
// Get all users
const users = await client.service('users').find();

// Update user
await client.service('users').patch(userId, { points: 1000 });

// Change user status
await client.service('users').patch(userId, { isActive: false });
```

### Vouchers Service
```javascript
// Get all vouchers
const vouchers = await client.service('voucher').find();

// Update voucher
await client.service('voucher').patch(voucherId, { isLatest: false });
```

### Transactions Service
```javascript
// Get transaction history
const transactions = await client.service('cartitemhistory').find();
```

## 🎯 Success Indicators

When everything is working correctly, you should see:

1. **Backend Console**:
   ```
   ✅ MongoDB connected successfully
   ✅ Feathers.js server running on port 3030
   ✅ All services configured
   ```

2. **Frontend Admin Page**:
   ```
   ✅ Successfully connected to MongoDB database
   ✅ Data loaded successfully: X users, Y vouchers, Z transactions
   ```

3. **Database Connection**:
   ```
   ✅ Real-time data updates
   ✅ CRUD operations working
   ✅ Charts displaying live data
   ```

## 🆘 Support

If you encounter issues:

1. **Check Logs**: Review backend and frontend console logs
2. **Verify Services**: Ensure MongoDB and Node.js services are running
3. **Test Endpoints**: Use curl or Postman to test API endpoints
4. **Environment Variables**: Verify all required environment variables are set

## 📞 Contact

For additional support, check the project documentation or create an issue in the repository. 
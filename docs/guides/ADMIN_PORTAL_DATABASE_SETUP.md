# Admin Portal Database Connection Guide

## 🎯 Overview

This guide will help you connect the VoucherApp admin portal to the MongoDB database. The admin portal provides comprehensive management features for users, vouchers, transactions, and analytics.

## 📋 Prerequisites

### Required Software
1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher) OR **Docker** (for containerized MongoDB)
3. **npm** or **yarn** package manager

### Optional Software
- **Docker Desktop** (for containerized setup)
- **MongoDB Compass** (GUI for MongoDB)

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Run the setup script:**
   ```bash
   cd voucher-redeem-merncp-a9b115
   node setup-database.js
   ```

2. **The script will:**
   - Check for MongoDB installation
   - Start MongoDB with Docker (if available)
   - Install backend dependencies
   - Start the backend server
   - Configure environment variables

### Option 2: Manual Setup

#### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:5.0.13
```

**Using MongoDB Atlas (Cloud):**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string and update environment variables

#### Step 2: Install Backend Dependencies

```bash
cd voucher-redeem-merncp-a9b115/nodejs-backend
npm install
```

#### Step 3: Configure Environment Variables

**Backend Environment** (`nodejs-backend/.env`):
```env
MONGODB_URL=mongodb://localhost:27017/voucher-redeem-merncp
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=test@example.com
MAIL_PASSWORD=password
MAIL_ENCRYPTION=tls
```

**Frontend Environment** (`react-frontend/.env`):
```env
REACT_APP_SERVER_URL=http://localhost:3030
REACT_APP_PROJECT_NAME=voucher-redeem-merncp
REACT_APP_LAST_UPDATED='4/25/2025'
REACT_APP_ENV=development
```

#### Step 4: Start Backend Server

```bash
cd voucher-redeem-merncp-a9b115
node start-backend.js
```

#### Step 5: Start Frontend Server

```bash
cd voucher-redeem-merncp-a9b115/react-frontend
npm install
npm start
```

## 🔍 Verification Steps

### 1. Backend Connection Test

**Check backend logs for:**
```
✅ MongoDB connected successfully
✅ Feathers.js services configured
✅ API server running on port 3030
```

**Test API endpoints:**
```bash
curl http://localhost:3030/users
curl http://localhost:3030/voucher
curl http://localhost:3030/cartitemhistory
```

### 2. Frontend Connection Test

**Access admin portal:**
- URL: `http://localhost:3000/admin/dashboard`
- Look for connection status indicator
- Check for real-time data loading

### 3. Database Connection Test

**Using MongoDB Compass:**
- Connect to: `mongodb://localhost:27017`
- Database: `voucher-redeem-merncp`
- Collections: `users`, `voucher`, `cartitemhistory`, `catergory`

**Using MongoDB Shell:**
```bash
mongosh
use voucher-redeem-merncp
show collections
db.users.find().limit(5)
```

## 🛠️ Admin Portal Features

### Dashboard Overview
- **Real-time Statistics**: Users, vouchers, transactions
- **Connection Status**: Live database connection indicator
- **Error Handling**: Detailed error messages and troubleshooting

### User Management
- **User List**: View all registered users
- **User Details**: Edit user information, points, status
- **User Analytics**: Activity tracking and statistics

### Voucher Management
- **Voucher List**: View all available vouchers
- **Voucher Details**: Edit voucher information, status, points
- **Category Management**: Organize vouchers by categories

### Transaction Monitoring
- **Transaction History**: View all redemption transactions
- **Transaction Details**: User, voucher, date, points
- **Analytics**: Transaction trends and patterns

### Analytics & Reports
- **Voucher Performance**: Redemption rates and trends
- **User Activity**: User engagement and activity patterns
- **Revenue Reports**: Points usage and revenue tracking

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
**Error**: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
- Start MongoDB service: `net start MongoDB`
- Check if MongoDB is running: `netstat -an | findstr 27017`
- Use Docker: `docker run -d -p 27017:27017 mongo:5.0.13`

#### 2. Backend Server Won't Start
**Error**: `Port 3030 already in use`

**Solutions:**
- Kill existing process: `netstat -ano | findstr 3030`
- Use different port: Update `config/default.json`
- Restart terminal/command prompt

#### 3. Frontend Can't Connect to Backend
**Error**: `Failed to fetch from http://localhost:3030`

**Solutions:**
- Check backend is running: `curl http://localhost:3030`
- Verify environment variables: `REACT_APP_SERVER_URL`
- Check CORS settings in backend

#### 4. Admin Portal Shows No Data
**Error**: Empty tables or "No data available"

**Solutions:**
- Check database has data: `db.users.find().count()`
- Verify API endpoints: Test with Postman/curl
- Check browser console for errors

### Debug Commands

#### Check MongoDB Status
```bash
# Windows
net start | findstr MongoDB

# Check MongoDB process
tasklist | findstr mongod

# Test MongoDB connection
mongosh --eval "db.runCommand('ping')"
```

#### Check Backend Status
```bash
# Check if port 3030 is in use
netstat -an | findstr 3030

# Test backend API
curl -X GET http://localhost:3030/users

# Check backend logs
tail -f nodejs-backend/logs/app.log
```

#### Check Frontend Status
```bash
# Check if port 3000 is in use
netstat -an | findstr 3000

# Test frontend
curl -X GET http://localhost:3000
```

## 📊 Database Schema

### Collections Overview

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  username: String,
  points: Number,
  status: String, // 'active', 'inactive'
  createdAt: Date,
  updatedAt: Date
}
```

#### Voucher Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  points: Number,
  categoryId: ObjectId,
  status: String, // 'active', 'inactive', 'expired'
  createdAt: Date,
  updatedAt: Date
}
```

#### CartItemHistory Collection (Transactions)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  voucherId: ObjectId,
  points: Number,
  status: String, // 'redeemed', 'cancelled'
  redeemedAt: Date,
  createdAt: Date
}
```

#### Category Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String, // 'active', 'inactive'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different credentials for development/production
- Rotate database passwords regularly

### Database Security
- Enable MongoDB authentication
- Use strong passwords
- Restrict network access
- Enable SSL/TLS for production

### API Security
- Implement rate limiting
- Use JWT tokens for authentication
- Validate all input data
- Log security events

## 📈 Performance Optimization

### Database Indexing
```javascript
// Create indexes for better performance
db.users.createIndex({ "email": 1 })
db.voucher.createIndex({ "categoryId": 1 })
db.cartitemhistory.createIndex({ "userId": 1, "redeemedAt": -1 })
```

### Caching
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets

### Monitoring
- Monitor database performance
- Track API response times
- Set up alerts for errors

## 🚀 Production Deployment

### Environment Setup
```env
# Production environment variables
MONGODB_URL=mongodb://username:password@host:port/database
NODE_ENV=production
PORT=3030
```

### Security Checklist
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS for all connections
- [ ] Implement proper CORS settings
- [ ] Set up firewall rules
- [ ] Configure backup strategy

### Monitoring Setup
- [ ] Database monitoring (MongoDB Atlas or self-hosted)
- [ ] Application monitoring (PM2, New Relic, etc.)
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Performance monitoring

## 📞 Support

### Getting Help
1. Check this guide for common issues
2. Review the MongoDB documentation
3. Check the Feathers.js documentation
4. Review application logs for errors

### Useful Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Feathers.js Documentation](https://docs.feathersjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Last Updated**: July 31, 2025
**Version**: 1.0.0 
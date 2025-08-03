# MongoDB Database Setup for Voucher Redemption System

## 🗄️ Database Schema Overview

This document describes the MongoDB database setup for the Voucher Redemption MERN Stack application. The database follows the Entity-Relationship Diagram (ERD) shown in the project documentation.

## 📊 Database Collections

### 1. **Users Collection** (`users`)
Represents user accounts in the system.

**Fields:**
- `email` (String, Required, Unique) - User's email address
- `username` (String, Required) - User's chosen username
- `phoneNumber` (String, Optional) - User's phone contact
- `password` (String, Required) - Hashed password
- `profileImage` (String, Optional) - URL to profile picture
- `isActive` (Boolean, Default: true) - Account status
- `points` (Number, Default: 0) - User's accumulated points
- `address` (String, Optional) - User's physical address
- `aboutMe` (String, Optional) - User description
- `createdAt` (Date) - Record creation timestamp
- `updatedAt` (Date) - Record update timestamp

### 2. **Categories Collection** (`catergory`)
Represents voucher categories.

**Fields:**
- `name` (String, Required, Unique) - Category name (e.g., "Travel", "Dining")
- `createdAt` (Date) - Record creation timestamp
- `updatedAt` (Date) - Record update timestamp

### 3. **Vouchers Collection** (`voucher`)
Represents available vouchers for redemption.

**Fields:**
- `categoryId` (ObjectId, Required) - Reference to category
- `points` (Number, Required) - Points required for redemption
- `title` (String, Required) - Voucher title
- `image` (String, Required) - Voucher image URL
- `description` (String, Required) - Voucher description
- `termsAndCondition` (String, Required) - Terms and conditions
- `isLatest` (Boolean, Default: false) - Featured voucher flag
- `createdAt` (Date) - Record creation timestamp
- `updatedAt` (Date) - Record update timestamp

### 4. **Cart Items Collection** (`cartitems`)
Represents items in user shopping carts.

**Fields:**
- `voucherId` (ObjectId, Required) - Reference to voucher
- `userId` (ObjectId, Required) - Reference to user
- `quantity` (Number, Required, Min: 1, Max: 100) - Number of vouchers
- `createdAt` (Date) - Record creation timestamp
- `updatedAt` (Date) - Record update timestamp

### 5. **Cart Item History Collection** (`cartitemhistory`)
Represents completed voucher redemptions.

**Fields:**
- `voucherId` (ObjectId, Required) - Reference to voucher
- `userId` (ObjectId, Required) - Reference to user
- `quantity` (Number, Required) - Number of vouchers redeemed
- `completedDate` (Date, Required) - Redemption completion date
- `createdAt` (Date) - Record creation timestamp
- `updatedAt` (Date) - Record update timestamp

## 🔗 Relationships

- **User** → **Cart Items** (One-to-Many)
- **User** → **Cart Item History** (One-to-Many)
- **Voucher** → **Cart Items** (One-to-Many)
- **Voucher** → **Cart Item History** (One-to-Many)
- **Category** → **Vouchers** (One-to-Many)

## 🚀 Setup Instructions

### Prerequisites
- MongoDB installed and running locally
- Node.js and npm installed
- bcryptjs package installed

### 1. Database Connection
The application connects to MongoDB using the following URL:
```
mongodb://127.0.0.1:27017/voucher-redeem-merncp
```

### 2. Initialize Database
Run the initialization script to populate the database with sample data:

```bash
cd nodejs-backend
node init-db.js
```

### 3. Test Database Connection
Verify the database setup:

```bash
cd nodejs-backend
node test-db.js
```

### 4. Start Backend Server
Start the development server:

```bash
cd nodejs-backend
npm run dev
```

## 📋 Sample Data

The initialization script creates:

- **7 Categories**: Travel, Dining, Electronics, Experiences, Fashion, Entertainment, Shopping
- **5 Vouchers**: Weekend Getaway, Fine Dining, Latest Headphones, Adventure Package, Luxury Spa Day
- **2 Users**: john.doe@example.com, jane.smith@example.com
- **Sample Cart Items**: Items in user shopping carts
- **Sample Cart Item History**: Completed redemptions

## 🔐 Authentication

- Passwords are hashed using bcryptjs with salt rounds of 10
- JWT authentication is implemented for secure API access
- User sessions are managed through Feathers authentication

## 📝 API Endpoints

The backend provides RESTful API endpoints for:

- **Users**: `/users` - User management
- **Categories**: `/catergory` - Category management
- **Vouchers**: `/voucher` - Voucher management
- **Cart Items**: `/cartitems` - Shopping cart management
- **Cart Item History**: `/cartitemhistory` - Redemption history

## 🛠️ Development

### Model Updates
When updating models, ensure to:
1. Update the schema definition
2. Run database initialization if needed
3. Test the changes with the test script

### Environment Variables
Required environment variables:
- `MONGODB_URL` - MongoDB connection string
- `MAIL_*` - Email configuration for notifications

## 📊 Database Statistics

After initialization, the database contains:
- **Categories**: 7
- **Vouchers**: 5
- **Users**: 2
- **Cart Items**: 2
- **Cart Item History**: 2

## 🔍 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Ensure MongoDB is running locally
   - Check the connection URL in environment variables

2. **Model Registration Error**
   - Verify all models are properly exported
   - Check for circular dependencies

3. **Validation Errors**
   - Ensure required fields are provided
   - Check field types and constraints

### Useful Commands

```bash
# Test database connection
node test-db.js

# Initialize database with sample data
node init-db.js

# Start development server
npm run dev

# Check MongoDB status
mongosh
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Feathers.js Documentation](https://docs.feathersjs.com/) 
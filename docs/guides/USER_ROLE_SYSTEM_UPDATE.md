# User Role System Update

## 🎯 Overview

The user role system has been updated to simplify the role structure. Previously, the system supported multiple roles: `customer`, `admin`, `staff`, `manager`, and `supervisor`. Now, the system only supports two roles: `admin` and `customer`.

## 🔄 Changes Made

### 1. Database Schema Update

**File**: `nodejs-backend/src/models/users.model.js`

**Before**:
```javascript
role: {
  type: String,
  required: false,
  default: "customer",
  enum: ["customer", "admin", "staff", "manager", "supervisor"],
  index: true,
}
```

**After**:
```javascript
role: {
  type: String,
  required: false,
  default: "customer",
  enum: ["customer", "admin"],
  index: true,
}
```

### 2. Migration Script

**File**: `update-user-roles.js`

A migration script has been created to:
- Update existing users with invalid roles to valid roles
- Convert `staff`, `manager`, and `supervisor` roles to `admin`
- Convert any other invalid roles to `customer`
- Create a default admin user if none exists

### 3. Frontend Authentication Context

**File**: `react-frontend/src/context/AuthContext.js`

Added role-based helper functions:
```javascript
const isAdmin = () => {
  return user && user.role === 'admin';
};

const isCustomer = () => {
  return user && user.role === 'customer';
};

const getUserRole = () => {
  return user ? user.role : null;
};
```

## 🚀 How to Apply the Update

### Step 1: Run the Migration Script

```bash
cd voucher-redeem-merncp-a9b115
node update-user-roles.js
```

This script will:
- Connect to your MongoDB database
- Find all users with invalid roles
- Update them to valid roles (`admin` or `customer`)
- Create a default admin user if none exists
- Show a summary of changes made

### Step 2: Restart the Backend Server

```bash
cd nodejs-backend
npm run dev
```

### Step 3: Test the Changes

1. **Test Admin Login**:
   - URL: `http://localhost:3000/admin/login`
   - Email: `admin@voucher-redeem.com`
   - Password: `admin123`

2. **Test Customer Login**:
   - URL: `http://localhost:3000/customer/login`
   - Use any existing customer account

## 📊 Role Assignment Logic

The migration script uses the following logic to assign roles:

### Admin Role Assignment
Users are assigned the `admin` role if:
- Their email contains "admin"
- They previously had `staff`, `manager`, or `supervisor` roles

### Customer Role Assignment
Users are assigned the `customer` role if:
- They don't meet admin criteria
- They had any other invalid role
- They had no role assigned

## 🔐 Default Admin User

If no admin user exists after the migration, the script creates a default admin:

```
Email: admin@voucher-redeem.com
Password: admin123
Role: admin
```

## 🛡️ Security Considerations

### Role Validation
- The database schema now enforces only valid roles
- Invalid roles will cause validation errors
- All existing invalid roles are automatically corrected

### Authentication
- Admin users can access admin routes and features
- Customer users can only access customer routes and features
- Role-based access control is enforced at both frontend and backend

## 📝 Usage Examples

### Frontend Role Checking

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MyComponent = () => {
  const { isAdmin, isCustomer, getUserRole } = useContext(AuthContext);

  if (isAdmin()) {
    return <AdminDashboard />;
  }

  if (isCustomer()) {
    return <CustomerDashboard />;
  }

  return <LoginPage />;
};
```

### Backend Role Validation

```javascript
// In your service hooks
const checkAdminRole = (context) => {
  if (context.params.user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return context;
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    create: [checkAdminRole],
    update: [checkAdminRole],
    patch: [checkAdminRole],
    remove: [checkAdminRole]
  }
};
```

## 🔍 Verification

After running the migration, verify the changes:

### Check Database
```bash
# Connect to MongoDB
mongosh
use voucher-redeem-merncp

# Check role distribution
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

# Check for any invalid roles
db.users.find({ role: { $nin: ["customer", "admin"] } })
```

### Check Application
1. Verify admin login works
2. Verify customer login works
3. Check that role-based routing works correctly
4. Test admin-only features
5. Test customer-only features

## 🐛 Troubleshooting

### Common Issues

1. **Migration Script Fails**
   - Ensure MongoDB is running
   - Check database connection string
   - Verify you have write permissions

2. **Users Still Have Invalid Roles**
   - Run the migration script again
   - Check for any custom validation logic
   - Verify the schema changes are applied

3. **Authentication Issues**
   - Clear browser localStorage
   - Restart both frontend and backend servers
   - Check authentication tokens

### Debug Commands

```bash
# Check MongoDB connection
mongosh --eval "db.runCommand('ping')"

# Check user roles
mongosh voucher-redeem-merncp --eval "db.users.find({}, {email: 1, role: 1})"

# Check backend logs
cd nodejs-backend
npm run dev
```

## 📚 Related Files

- `nodejs-backend/src/models/users.model.js` - Updated user schema
- `update-user-roles.js` - Migration script
- `react-frontend/src/context/AuthContext.js` - Updated authentication context
- `react-frontend/src/MyRouter/ProtectedRoute.js` - Route protection
- `react-frontend/src/MyRouter/CustomerProtectedRoute.js` - Customer route protection

## 🎉 Summary

The user role system has been successfully simplified to support only `admin` and `customer` roles. This change:

- ✅ Simplifies the role management system
- ✅ Reduces complexity in authentication logic
- ✅ Maintains security with role-based access control
- ✅ Provides clear separation between admin and customer features
- ✅ Includes automatic migration of existing data
- ✅ Creates a default admin user for system access

The system is now ready for production use with the simplified role structure. 
# User Role Management Guide

## 🎯 **Overview**

This guide explains how to add, change, and manage user roles in the Voucher Redemption System. The system supports two main roles: **customer** and **admin**.

## 🔐 **Available Roles**

### **Customer Role**
- **Access**: Customer portal (`/customer/*`)
- **Features**: Browse vouchers, redeem vouchers, manage profile
- **Default**: All new users are customers by default

### **Admin Role**
- **Access**: Admin portal (`/admin/*`) + all management routes
- **Features**: Manage vouchers, users, analytics, system administration
- **Restricted**: Only specific users should have admin access

## 🛠️ **Methods to Manage User Roles**

## **Method 1: Admin Dashboard (Recommended)**

### **Step-by-Step Process**
1. **Access Admin Portal**
   ```
   http://localhost:3000/admin/login
   ```

2. **Navigate to User Management**
   - Go to Admin Dashboard
   - Find "Users" or "User Management" section
   - Click on the user you want to modify

3. **Edit User Role**
   - Click "Edit" button
   - Look for "Role" field
   - Change to either "customer" or "admin"
   - Save changes

### **Benefits**
- ✅ **User-Friendly**: No technical knowledge required
- ✅ **Visual Interface**: Easy to see all users and their roles
- ✅ **Audit Trail**: Changes are logged in the system
- ✅ **Validation**: Built-in validation prevents errors

## **Method 2: Database Direct Update**

### **Connect to MongoDB**
```bash
# Using mongosh (newer MongoDB client)
mongosh

# Using mongo (legacy client)
mongo

# Switch to your database
use nodejs-backend
```

### **Common Commands**

#### **View All Users and Their Roles**
```javascript
db.users.find({}, {email: 1, role: 1, _id: 0})
```

#### **Find User by Email**
```javascript
db.users.findOne({email: "user@example.com"})
```

#### **Update User to Admin**
```javascript
db.users.updateOne(
  {email: "user@example.com"},
  {$set: {role: "admin"}}
)
```

#### **Update User to Customer**
```javascript
db.users.updateOne(
  {email: "user@example.com"},
  {$set: {role: "customer"}}
)
```

#### **Add Role Field to All Users (Migration)**
```javascript
db.users.updateMany(
  {role: {$exists: false}},
  {$set: {role: "customer"}}
)
```

#### **List Users Without Role Field**
```javascript
db.users.find({role: {$exists: false}}, {email: 1, _id: 0})
```

### **Benefits**
- ✅ **Direct Control**: Immediate database changes
- ✅ **Bulk Operations**: Can update multiple users at once
- ✅ **No UI Limitations**: Full database access

## **Method 3: Using the Provided Script**

### **Setup**
1. **Navigate to Project Directory**
   ```bash
   cd voucher-redeem-merncp-a9b115
   ```

2. **Install Dependencies** (if not already installed)
   ```bash
   npm install mongodb
   ```

### **Available Commands**

#### **Add Role Field to Existing Users**
```bash
node update-user-roles.js add-roles
```
- Sets all users without a role to "customer"
- Safe migration command

#### **Create New Admin User**
```bash
node update-user-roles.js create-admin admin@example.com password123
```
- Creates a new admin user
- If user exists, updates their role to admin

#### **Update Specific User Roles**
```bash
node update-user-roles.js update-roles
```
- Updates specific users (modify script for your needs)
- Lists all users and their current roles

### **Benefits**
- ✅ **Automated**: No manual database queries
- ✅ **Safe**: Built-in error handling
- ✅ **Reusable**: Can be run multiple times
- ✅ **Logging**: Shows what changes were made

## **Method 4: API Calls**

### **Using cURL**
```bash
# Update user role via REST API
curl -X PATCH http://localhost:3030/users/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"role": "admin"}'
```

### **Using JavaScript**
```javascript
const client = require('./services/restClient');

async function updateUserRole(userId, newRole) {
  try {
    const result = await client.service('users').patch(userId, {
      role: newRole
    });
    console.log('User role updated:', result);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

// Usage
updateUserRole('user-id-here', 'admin');
```

### **Benefits**
- ✅ **Programmatic**: Can be integrated into other scripts
- ✅ **Authenticated**: Uses proper authentication
- ✅ **RESTful**: Standard API approach

## 🔧 **Database Schema Update**

### **User Model Changes**
The user model has been updated to include the role field:

```javascript
role: {
  type: String,
  required: false,
  default: "customer",
  enum: ["customer", "admin"],
  index: true,
}
```

### **Migration Steps**
1. **Update Model**: The user model has been updated
2. **Restart Backend**: Restart your Node.js backend
3. **Run Migration**: Use the script to add roles to existing users

```bash
node update-user-roles.js add-roles
```

## 🚨 **Security Considerations**

### **Admin Access Control**
- **Limit Admin Users**: Only give admin access to trusted users
- **Regular Audits**: Periodically review who has admin access
- **Strong Passwords**: Ensure admin users have strong passwords
- **Two-Factor Authentication**: Consider implementing 2FA for admins

### **Role Validation**
- **Server-Side**: Always validate roles on the server
- **Client-Side**: UI should reflect user's actual role
- **Session Management**: Clear sessions when roles change

## 📊 **Monitoring and Auditing**

### **Check Current Roles**
```javascript
// MongoDB query to see all admin users
db.users.find({role: "admin"}, {email: 1, createdAt: 1, _id: 0})

// Count users by role
db.users.aggregate([
  {$group: {_id: "$role", count: {$sum: 1}}}
])
```

### **Audit Trail**
- **Admin Dashboard**: Logs role changes
- **Database**: Timestamps on user records
- **Application Logs**: Check server logs for role changes

## 🔄 **Common Scenarios**

### **Scenario 1: New User Registration**
```javascript
// New users automatically get "customer" role
const newUser = {
  email: "user@example.com",
  password: "hashedPassword",
  role: "customer", // Default value
  // ... other fields
}
```

### **Scenario 2: Promoting User to Admin**
```javascript
// Method 1: Admin Dashboard
// Navigate to Users → Edit → Change Role to "admin"

// Method 2: Database
db.users.updateOne(
  {email: "user@example.com"},
  {$set: {role: "admin"}}
)

// Method 3: Script
node update-user-roles.js create-admin user@example.com password
```

### **Scenario 3: Demoting Admin to Customer**
```javascript
// Method 1: Admin Dashboard
// Navigate to Users → Edit → Change Role to "customer"

// Method 2: Database
db.users.updateOne(
  {email: "admin@example.com"},
  {$set: {role: "customer"}}
)
```

### **Scenario 4: Bulk Role Update**
```javascript
// Update all users without role to customer
db.users.updateMany(
  {role: {$exists: false}},
  {$set: {role: "customer"}}
)

// Update specific users to admin
db.users.updateMany(
  {email: {$in: ["admin1@example.com", "admin2@example.com"]}},
  {$set: {role: "admin"}}
)
```

## 🚀 **Best Practices**

### **Role Management**
1. **Principle of Least Privilege**: Only give necessary permissions
2. **Regular Reviews**: Periodically audit user roles
3. **Documentation**: Keep track of who has admin access
4. **Backup**: Always backup before bulk role changes

### **Security**
1. **Strong Authentication**: Use strong passwords for admin accounts
2. **Session Management**: Clear sessions when roles change
3. **Monitoring**: Monitor for unusual role changes
4. **Validation**: Always validate roles on both client and server

### **User Experience**
1. **Clear Messaging**: Inform users when their role changes
2. **Graceful Degradation**: Handle role changes without breaking UX
3. **Error Handling**: Provide clear error messages for unauthorized access

## 📋 **Quick Reference**

### **Common Commands**
```bash
# Add roles to existing users
node update-user-roles.js add-roles

# Create admin user
node update-user-roles.js create-admin admin@example.com password

# View all users and roles
node update-user-roles.js update-roles
```

### **Database Queries**
```javascript
// View all users
db.users.find({}, {email: 1, role: 1, _id: 0})

// Find admin users
db.users.find({role: "admin"})

// Update user to admin
db.users.updateOne({email: "user@example.com"}, {$set: {role: "admin"}})
```

### **API Endpoints**
```
PATCH /users/{userId} - Update user (including role)
GET /users - List all users
GET /users/{userId} - Get specific user
```

---

**Last Updated**: July 31, 2025  
**Version**: 1.0.0 
# Admin Account Management

This document explains how to manage admin accounts in the voucher redemption system.

## Quick Setup

### 1. Create Default Admin Account

Run the following command to create a default admin account:

```bash
node add-admin.js
```

This will create:
- **Email**: admin@voucher-redeem.com
- **Password**: admin123
- **Username**: admin
- **Role**: Administrator
- **Position**: Administrator

### 2. Access Admin Panel

After creating the admin account, you can access the admin panel at:
```
http://localhost:3000/admin
```

## Advanced Admin Management

Use the comprehensive management script for more control:

```bash
node manage-admin.js <command> [options]
```

### Available Commands

#### List All Admin Accounts
```bash
node manage-admin.js list
```

#### Add New Admin Account
```bash
node manage-admin.js add <email> [password] [username]
```

Examples:
```bash
node manage-admin.js add admin2@example.com password123
node manage-admin.js add superadmin@company.com securepass123 superadmin
```

#### Update Admin Account
```bash
node manage-admin.js update <email> <field> <value>
```

Supported fields:
- `password` - Update password
- `username` - Update username
- `active` - Enable/disable account (true/false)

Examples:
```bash
node manage-admin.js update admin@example.com password newpassword123
node manage-admin.js update admin@example.com username newadmin
node manage-admin.js update admin@example.com active false
```

#### Delete Admin Account
```bash
node manage-admin.js delete <email>
```

Example:
```bash
node manage-admin.js delete admin2@example.com
```

## Database Structure

### Admin Account Components

1. **User Record** (`users` collection)
   - Basic user information (email, username, password)
   - Account status and metadata

2. **Role Record** (`roles` collection)
   - Defines admin privileges
   - Name: "admin"
   - Description: "Administrator with full system access"

3. **Position Record** (`positions` collection)
   - Job position information
   - Name: "Administrator"
   - Description: "System Administrator Position"

4. **Profile Record** (`profiles` collection)
   - Links user to role and position
   - Contains additional profile information

### Required Fields

#### User Model
- `email` (required, unique)
- `username` (required)
- `password` (required, hashed)
- `isActive` (boolean, default: true)
- `points` (number, default: 0)

#### Profile Model
- `name` (required)
- `userId` (required, references users)
- `role` (required, references roles)
- `position` (required, references positions)
- `hod` (boolean, default: false)
- `hos` (boolean, default: false)

## Security Considerations

1. **Password Security**
   - Passwords are hashed using bcrypt with salt rounds of 10
   - Never store plain text passwords

2. **Account Management**
   - Only create admin accounts for trusted users
   - Regularly update admin passwords
   - Disable inactive admin accounts

3. **Access Control**
   - Admin accounts have full system access
   - Use role-based permissions for different admin levels

## Troubleshooting

### Common Issues

1. **"User already exists"**
   - Check if the email is already in use
   - Use a different email address

2. **"Role not found"**
   - The script automatically creates admin roles
   - If this error occurs, run the script again

3. **"Position not found"**
   - The script automatically creates admin positions
   - If this error occurs, run the script again

4. **"Cannot connect to database"**
   - Ensure MongoDB is running
   - Check the MONGODB_URL environment variable
   - Verify network connectivity

### Reset Admin Password

If you need to reset an admin password:

```bash
node manage-admin.js update admin@voucher-redeem.com password newpassword123
```

### Disable Admin Account

To temporarily disable an admin account:

```bash
node manage-admin.js update admin@voucher-redeem.com active false
```

To re-enable:

```bash
node manage-admin.js update admin@voucher-redeem.com active true
```

## Environment Variables

Make sure these environment variables are set:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/voucher-redeem-merncp
```

## Support

For additional help with admin account management, check:
1. Database logs for connection issues
2. Application logs for authentication errors
3. Network connectivity to MongoDB
4. Environment variable configuration 
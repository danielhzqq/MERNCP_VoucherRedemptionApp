# 🔧 Scripts Index

Utility scripts for the Rewards Voucher Redemption System.

## 🚀 **Quick Setup Scripts**

### **Database & System Setup**
- [setup-database.js](setup-database.js) - Initialize database and collections
- [start-backend.js](start-backend.js) - Start backend server with proper configuration

### **User Management**
- [add-admin-user.js](add-admin-user.js) - Create admin user account
- [update-user-roles.js](update-user-roles.js) - Bulk update user roles
- [fix-user-roles.js](fix-user-roles.js) - Fix user role assignments
- [verify-roles.js](verify-roles.js) - Verify user role integrity
- [update-role-status.js](update-role-status.js) - Update role status fields

## 🎫 **Voucher Management Scripts**

### **Voucher Code Management**
- [run-voucher-code-migration.js](run-voucher-code-migration.js) - Migrate voucher codes
- [add-voucher-codes-to-existing-records.js](add-voucher-codes-to-existing-records.js) - Add codes to existing records

## 🧪 **Testing Scripts**

### **AI Integration Tests**
- [test-backend-ai.js](test-backend-ai.js) - Test backend AI service
- [test-ollama-api.js](test-ollama-api.js) - Test Ollama API integration
- [test-voucher-codes.js](test-voucher-codes.js) - Test voucher code generation

## 📋 **Usage Instructions**

### **Running Scripts**

#### **Database Setup**
```bash
# Setup database
node docs/scripts/setup-database.js

# Start backend
node docs/scripts/start-backend.js
```

#### **User Management**
```bash
# Create admin user
node docs/scripts/add-admin-user.js

# Update user roles
node docs/scripts/update-user-roles.js

# Fix user roles
node docs/scripts/fix-user-roles.js

# Verify roles
node docs/scripts/verify-roles.js
```

#### **Voucher Management**
```bash
# Run voucher code migration
node docs/scripts/run-voucher-code-migration.js

# Add voucher codes to existing records
node docs/scripts/add-voucher-codes-to-existing-records.js
```

#### **Testing**
```bash
# Test AI integration
node docs/scripts/test-backend-ai.js

# Test Ollama API
node docs/scripts/test-ollama-api.js

# Test voucher codes
node docs/scripts/test-voucher-codes.js
```

## 🔧 **Script Categories**

### **Setup & Configuration**
- Database initialization
- Backend server startup
- Environment configuration

### **User Management**
- Admin user creation
- Role assignment and updates
- User data verification

### **Data Migration**
- Voucher code generation
- Database record updates
- Data integrity checks

### **Testing & Validation**
- API endpoint testing
- AI service validation
- Code generation testing

## ⚠️ **Important Notes**

### **Before Running Scripts**
1. **Database Connection**: Ensure MongoDB is running
2. **Environment Variables**: Set up proper .env files
3. **Dependencies**: Install required npm packages
4. **Backup**: Backup database before running migration scripts

### **Script Safety**
- **Read First**: Review script contents before execution
- **Test Environment**: Test scripts in development first
- **Backup Data**: Always backup before data modifications
- **Permissions**: Ensure proper database permissions

### **Error Handling**
- **Connection Errors**: Check MongoDB connection
- **Permission Errors**: Verify database access rights
- **Validation Errors**: Check input data format
- **Timeout Errors**: Increase timeout for large operations

## 📚 **Related Documentation**

### **Setup Guides**
- [MongoDB Setup](../guides/MONGODB_SETUP.md)
- [Admin Portal Database Setup](../guides/ADMIN_PORTAL_DATABASE_SETUP.md)
- [Re-enable Authentication](../guides/RE_ENABLE_AUTH.md)

### **User Management**
- [User Role Management Guide](../guides/USER_ROLE_MANAGEMENT_GUIDE.md)
- [Add Voucher Admin Guide](../guides/ADD_VOUCHER_ADMIN_GUIDE.md)

### **Testing**
- [AI Chatbox Troubleshooting](../guides/AI_CHAT_TROUBLESHOOTING.md)
- [Ollama Setup Guide](../guides/OLLAMA_SETUP_GUIDE.md)

---

**Need help?** Check the [AI Chatbox Troubleshooting](../guides/AI_CHAT_TROUBLESHOOTING.md) guide or review the [Codebase Analysis](../guides/CODEBASE_ANALYSIS.md) for system overview. 
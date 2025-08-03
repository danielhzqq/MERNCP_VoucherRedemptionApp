# 🧪 Tests Index

Test files for the Rewards Voucher Redemption System.

## 🚀 **Quick Test Commands**

### **AI Integration Tests**
```bash
# Test backend AI service
node docs/tests/test-backend-ai.js

# Test Ollama API integration
node docs/tests/test-ollama-api.js

# Test voucher code generation
node docs/tests/test-voucher-codes.js
```

## 📋 **Test Categories**

### **AI System Tests**
- [test-backend-ai.js](test-backend-ai.js) - Backend AI service testing
- [test-ollama-api.js](test-ollama-api.js) - Ollama API integration testing

### **Voucher System Tests**
- [test-voucher-codes.js](test-voucher-codes.js) - Voucher code generation testing

## 🔧 **Test Descriptions**

### **AI Integration Tests**

#### **Backend AI Service Test**
- **File**: `test-backend-ai.js`
- **Purpose**: Test the backend AI chat service
- **Features**:
  - Connection testing
  - Message sending
  - Response validation
  - Error handling

#### **Ollama API Test**
- **File**: `test-ollama-api.js`
- **Purpose**: Test direct Ollama API integration
- **Features**:
  - API connectivity
  - Model availability
  - Response streaming
  - Error handling

### **Voucher System Tests**

#### **Voucher Code Test**
- **File**: `test-voucher-codes.js`
- **Purpose**: Test voucher code generation and validation
- **Features**:
  - Code generation
  - Uniqueness validation
  - Database integration
  - Error handling

## 🛠️ **Test Setup**

### **Prerequisites**
1. **MongoDB**: Database must be running
2. **Backend**: Backend server should be started
3. **Ollama**: Ollama service should be running (for AI tests)
4. **Environment**: Proper .env configuration

### **Environment Variables**
```bash
# Required for AI tests
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:0.6b

# Required for backend tests
MONGODB_URI=mongodb://localhost:27017/voucher-system
JWT_SECRET=your-jwt-secret
```

## 📊 **Test Results**

### **Expected Outcomes**

#### **AI Tests**
- ✅ **Connection**: Successfully connect to Ollama
- ✅ **Response**: Receive valid AI responses
- ✅ **Streaming**: Handle streaming responses correctly
- ✅ **Error Handling**: Graceful error handling

#### **Voucher Tests**
- ✅ **Generation**: Generate unique voucher codes
- ✅ **Validation**: Validate code format and uniqueness
- ✅ **Database**: Store codes in database correctly
- ✅ **Retrieval**: Retrieve codes from database

### **Common Issues**

#### **AI Connection Issues**
- **Ollama not running**: Start Ollama service
- **Wrong port**: Check OLLAMA_BASE_URL
- **Model not available**: Install required model

#### **Database Issues**
- **MongoDB not running**: Start MongoDB service
- **Connection string**: Check MONGODB_URI
- **Authentication**: Verify database credentials

## 🔍 **Troubleshooting**

### **AI Test Failures**
1. **Check Ollama Status**
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Verify Model Installation**
   ```bash
   ollama list
   ```

3. **Test Direct API**
   ```bash
   node docs/tests/test-ollama-api.js
   ```

### **Backend Test Failures**
1. **Check Backend Status**
   ```bash
   curl http://localhost:3030/health
   ```

2. **Verify Database Connection**
   ```bash
   node docs/scripts/setup-database.js
   ```

3. **Check Environment Variables**
   ```bash
   cat nodejs-backend/.env
   ```

### **Voucher Test Failures**
1. **Check Database Schema**
   ```bash
   node docs/scripts/verify-roles.js
   ```

2. **Verify Voucher Collection**
   ```bash
   mongo voucher-system --eval "db.voucher.find().limit(1)"
   ```

## 📚 **Related Documentation**

### **Setup Guides**
- [Ollama Setup Guide](../guides/OLLAMA_SETUP_GUIDE.md)
- [MongoDB Setup](../guides/MONGODB_SETUP.md)
- [AI Chatbox Troubleshooting](../guides/AI_CHAT_TROUBLESHOOTING.md)

### **Implementation Guides**
- [AI Chat Implementation](../guides/AI_CHAT_IMPLEMENTATION.md)
- [Ollama Integration Complete](../guides/OLLAMA_INTEGRATION_COMPLETE.md)
- [Unique Voucher Code Implementation](../guides/UNIQUE_VOUCHER_CODE_IMPLEMENTATION.md)

### **Scripts**
- [Database Setup](../scripts/setup-database.js)
- [Role Verification](../scripts/verify-roles.js)
- [Voucher Code Migration](../scripts/run-voucher-code-migration.js)

## 🎯 **Test Best Practices**

### **Before Running Tests**
1. **Environment Check**: Verify all services are running
2. **Data Backup**: Backup test data if needed
3. **Clean State**: Ensure clean test environment
4. **Dependencies**: Install all required packages

### **During Testing**
1. **Monitor Logs**: Watch for error messages
2. **Check Responses**: Validate test outputs
3. **Document Issues**: Note any failures
4. **Retry Logic**: Implement retry for flaky tests

### **After Testing**
1. **Cleanup**: Remove test data
2. **Documentation**: Update test results
3. **Issue Tracking**: Report any failures
4. **Improvements**: Suggest test enhancements

---

**Need help?** Check the [AI Chatbox Troubleshooting](../guides/AI_CHAT_TROUBLESHOOTING.md) guide or review the [Ollama Setup Guide](../guides/OLLAMA_SETUP_GUIDE.md) for AI integration issues. 
# Qwen AI Configuration Guide

## 🚀 **Overview**

This guide will help you configure Qwen AI (by Alibaba Cloud) to provide real AI responses in your voucher redemption platform's chatbox. Currently, the system uses mock responses, but with Qwen AI configured, you'll get intelligent, contextual responses.

## 📋 **Prerequisites**

1. **Alibaba Cloud Account**: You need an Alibaba Cloud account
2. **Qwen AI API Key**: Get your API key from Alibaba Cloud DashScope
3. **Node.js Backend**: Your backend should be running

## 🔑 **Step 1: Get Qwen AI API Key**

### **1.1 Create Alibaba Cloud Account**
1. Go to [Alibaba Cloud](https://www.alibabacloud.com/)
2. Sign up for a free account
3. Complete the verification process

### **1.2 Access DashScope**
1. Go to [DashScope](https://dashscope.aliyun.com/)
2. Sign in with your Alibaba Cloud account
3. Navigate to the API Keys section

### **1.3 Generate API Key**
1. Click "Create API Key"
2. Give it a name (e.g., "Voucher Platform AI")
3. Copy the generated API key (it starts with `sk-`)

## ⚙️ **Step 2: Configure API Key**

### **Option A: Environment Variable (Recommended)**

**For Windows:**
```bash
# Set environment variable
set QWEN_API_KEY=sk-your-api-key-here

# Or add to your .env file (create if it doesn't exist)
echo QWEN_API_KEY=sk-your-api-key-here > .env
```

**For Linux/Mac:**
```bash
# Set environment variable
export QWEN_API_KEY=sk-your-api-key-here

# Or add to your .env file
echo "QWEN_API_KEY=sk-your-api-key-here" >> .env
```

### **Option B: Configuration File**

Add the API key to your backend configuration:

```json
// nodejs-backend/config/default.json
{
  "host": "localhost",
  "port": 3030,
  "public": "../public/",
  "paginate": {
    "default": 1000,
    "max": 100000
  },
  "mongodb": "mongodb://localhost:27017/voucher-redeem-merncp",
  "qwenApiKey": "sk-your-api-key-here",
  "authentication": {
    // ... existing config
  }
}
```

### **Option C: .env File (Most Secure)**

Create a `.env` file in your `nodejs-backend` directory:

```bash
# nodejs-backend/.env
QWEN_API_KEY=sk-your-api-key-here
MONGODB_URI=mongodb://localhost:27017/voucher-redeem-merncp
JWT_SECRET=your-jwt-secret
```

## 🔧 **Step 3: Install dotenv (if using .env file)**

If you're using a `.env` file, install the dotenv package:

```bash
cd nodejs-backend
npm install dotenv
```

Then add this to the top of your `src/app.js`:

```javascript
require('dotenv').config();
```

## 🧪 **Step 4: Test Configuration**

### **4.1 Restart Backend Server**
```bash
cd nodejs-backend
npm start
```

### **4.2 Check Backend Logs**
Look for one of these messages:
- ✅ **Success**: No specific message (Qwen AI is working silently)
- ⚠️ **Fallback**: `"Qwen AI not configured - using mock responses"`

### **4.3 Test API Endpoint**
Create a test script to verify the API key:

```javascript
// test-qwen-api.js
const axios = require('axios');

async function testQwenAPI() {
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'user',
              content: 'Hello, how are you?'
            }
          ]
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 100
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Qwen AI API Test Successful!');
    console.log('Response:', response.data.output.text);
  } catch (error) {
    console.error('❌ Qwen AI API Test Failed:', error.response?.data || error.message);
  }
}

testQwenAPI();
```

Run the test:
```bash
node test-qwen-api.js
```

## 🎯 **Step 5: Verify Frontend Integration**

1. **Start your frontend**:
   ```bash
   cd react-frontend
   npm start
   ```

2. **Login as a user** and go to a customer page

3. **Test the AI chatbox**:
   - Click the blue AI chat button
   - Send a message like "Hello, can you help me with vouchers?"
   - You should get a real AI response instead of mock responses

## 🔍 **Step 6: Monitor Usage**

### **Check API Usage in DashScope**
1. Go to [DashScope Console](https://dashscope.aliyun.com/)
2. Navigate to "Usage & Billing"
3. Monitor your API calls and costs

### **Backend Logs**
Watch your backend logs for:
- API call success/failure
- Response times
- Error messages

## 🛠️ **Troubleshooting**

### **Issue: "Qwen AI not configured"**
**Solution:**
- Check if `QWEN_API_KEY` environment variable is set
- Verify the API key is correct
- Restart the backend server

### **Issue: "401 Unauthorized"**
**Solution:**
- Verify your API key is valid
- Check if you have sufficient credits in DashScope
- Ensure the API key has the correct permissions

### **Issue: "Rate Limit Exceeded"**
**Solution:**
- Check your DashScope usage limits
- Implement rate limiting in your application
- Consider upgrading your DashScope plan

### **Issue: "Network Error"**
**Solution:**
- Check your internet connection
- Verify firewall settings
- Ensure DashScope is accessible from your region

## 💰 **Cost Management**

### **Qwen AI Pricing (as of 2024)**
- **Qwen-Turbo**: ~$0.002 per 1K tokens
- **Qwen-Plus**: ~$0.01 per 1K tokens
- **Qwen-Max**: ~$0.03 per 1K tokens

### **Cost Optimization Tips**
1. **Use Qwen-Turbo** for most use cases (good balance of speed/cost)
2. **Set reasonable max_tokens** (currently set to 1000)
3. **Monitor usage** regularly
4. **Implement caching** for common questions

## 🔒 **Security Best Practices**

1. **Never commit API keys** to version control
2. **Use environment variables** or secure configuration management
3. **Rotate API keys** regularly
4. **Monitor for unusual usage patterns**
5. **Set up usage alerts** in DashScope

## 📊 **Expected Behavior After Configuration**

### **Before (Mock Responses):**
```
User: "Hello, how can you help me?"
AI: "I'd be happy to help you with that! How can I assist you today?"
```

### **After (Qwen AI):**
```
User: "Hello, how can you help me?"
AI: "Hello! I'm your AI assistant for the voucher redemption platform. I can help you with:

• Finding and redeeming vouchers
• Checking your point balance
• Troubleshooting account issues
• Providing voucher recommendations
• Answering questions about the platform

What would you like assistance with today?"
```

## 🎉 **Success Indicators**

You'll know Qwen AI is working when:
- ✅ Backend starts without "Qwen AI not configured" message
- ✅ AI responses are more detailed and contextual
- ✅ Responses vary based on the conversation
- ✅ No errors in backend logs related to Qwen AI
- ✅ API calls are being made to DashScope (check network tab)

## 📞 **Support**

If you encounter issues:
1. Check the [DashScope Documentation](https://help.aliyun.com/zh/dashscope/)
2. Review your API key permissions
3. Check your account status and credits
4. Contact Alibaba Cloud support if needed

---

**Need help?** Check the troubleshooting section above or refer to the [AI Chat Troubleshooting Guide](./AI_CHAT_TROUBLESHOOTING.md) for general chat issues. 
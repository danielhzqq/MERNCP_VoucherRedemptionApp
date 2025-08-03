# AI Chat Troubleshooting Guide

## ✅ **Current Status Check**

Based on our testing, all components are importing successfully:
- ✅ AI chat service imports successfully
- ✅ AI chat model imports successfully  
- ✅ Qwen AI module imports successfully
- ✅ Frontend component is properly structured
- ✅ Service is registered in backend

## 🔍 **Step-by-Step Troubleshooting**

### **1. Backend Server Status**
```bash
# Make sure your backend is running
cd nodejs-backend
npm start
# or
node src/app.js
```

**Expected:** Backend should start without errors and show the AI chat service being registered.

### **2. Check Backend Logs**
When you start the backend, look for:
```
Qwen AI not configured - using mock responses
```
This means the service is working but using mock responses (which is fine for testing).

### **3. Frontend Authentication**
- Make sure you are **logged in** as a user
- The AI chat requires JWT authentication
- Check if you have a valid session

### **4. Test the API Endpoint Directly**

**Using Browser Dev Tools:**
1. Open browser dev tools (F12)
2. Go to Network tab
3. Send a message in the AI chatbox
4. Look for a request to `/ai-chat`
5. Check the response

**Expected Request:**
```javascript
POST /ai-chat
Headers: {
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}
Body: {
  "topic": "general",
  "message": "Hello",
  "history": [...]
}
```

**Expected Response:**
```javascript
{
  "text": "I'd be happy to help you with that! How can I assist you today?",
  "topic": "general",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **5. Common Issues & Solutions**

#### **Issue: "401 Unauthorized"**
**Cause:** User not authenticated
**Solution:** 
- Make sure you're logged in
- Check if JWT token is valid
- Try logging out and logging back in

#### **Issue: "404 Not Found"**
**Cause:** AI chat service not registered
**Solution:**
- Restart backend server
- Check if service is in `src/services/index.js`
- Verify all AI chat files exist

#### **Issue: "500 Internal Server Error"**
**Cause:** Backend error
**Solution:**
- Check backend console logs
- Look for specific error messages
- Verify database connection

#### **Issue: "Network Error"**
**Cause:** Frontend can't reach backend
**Solution:**
- Check if backend is running on correct port
- Verify CORS settings
- Check network connectivity

#### **Issue: "No response from AI"**
**Cause:** API call failing
**Solution:**
- Check browser console for errors
- Verify backend logs
- Test with mock responses first

### **6. Testing with Mock Responses**

The system is designed to work with mock responses if no Qwen API key is set. You should get responses like:
- "I'd be happy to help you with that! How can I assist you today?"
- "I'm here to help with any questions about our voucher platform. What would you like to know?"

### **7. Enable Debug Logging**

Add this to your backend config to see more detailed logs:
```javascript
// In config/default.json or similar
{
  "debug": true,
  "aiChatDebug": true
}
```

### **8. Manual API Test**

You can test the API manually using curl or Postman:

```bash
curl -X POST http://localhost:3030/ai-chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "general",
    "message": "Hello",
    "history": []
  }'
```

### **9. Frontend Debug Steps**

1. **Open browser dev tools**
2. **Go to Console tab**
3. **Try sending a message in the chatbox**
4. **Look for any error messages**
5. **Check Network tab for failed requests**

### **10. Backend Debug Steps**

1. **Check backend console output**
2. **Look for error messages**
3. **Verify service registration**
4. **Test database connection**

## 🚀 **Quick Fix Checklist**

- [ ] Backend server is running
- [ ] User is logged in (has JWT token)
- [ ] No CORS errors in browser console
- [ ] Network requests are reaching backend
- [ ] Backend logs show no errors
- [ ] AI chat service is registered

## 📞 **If Still Not Working**

If you've gone through all these steps and the AI chat still isn't working:

1. **Check browser console** for any JavaScript errors
2. **Check backend logs** for any server errors
3. **Try a different browser** to rule out browser-specific issues
4. **Clear browser cache** and try again
5. **Restart both frontend and backend** servers

## 🎯 **Expected Behavior**

When working correctly:
1. You see the AI chat button (blue circle with + icon) in bottom-right
2. Clicking it opens the chat window
3. You can type a message and click Send
4. You get a response from the AI (even if it's a mock response)
5. The conversation history is maintained in the chat window

## 🔧 **Configuration Options**

### **Using Qwen AI (Optional)**
If you want real AI responses, add to your `.env` file:
```bash
QWEN_API_KEY=your_qwen_api_key_here
```

### **Mock Responses (Default)**
If no API key is set, the system will use intelligent mock responses based on the message content.

---

**Need more help?** Check the browser console and backend logs for specific error messages, and I can help you debug further! 
# AI Chat Implementation

## Overview
Implemented a comprehensive AI chat system for the voucher redemption platform with support for customer support, voucher suggestions, and admin support using local Ollama AI models.

## Features

### **Frontend Components**
- **Floating Chat Button**: Bottom-right corner button to open chat
- **General Chat Interface**: Unified chat for all types of support
- **Real-time Chat Interface**: Message history with user/AI distinction
- **Responsive Design**: Works on desktop and mobile devices

### **Backend Services**
- **AI Chat Service**: Handles chat requests and AI integration
- **Ollama AI Integration**: Local AI responses with fallback to mock responses
- **User Context**: Personalized responses based on user data
- **Authentication**: Secure chat access with JWT authentication

## Technical Implementation

### **Frontend Structure**

#### **AIChatbox Component** (`react-frontend/src/components/ai/AIChatbox.js`)
```javascript
// Key Features:
- Floating button with AI icon
- Modal chat window with unified interface
- Real-time message display
- Integration with backend AI service
- Responsive design with Tailwind CSS
```

#### **App Integration** (`react-frontend/src/App.js`)
```javascript
// Added to customer routes only
{!isAuthRoute && !isAdminRoute && <AIChatbox />}
```

### **Backend Structure**

#### **AI Chat Service** (`nodejs-backend/src/services/ai-chat/`)
```
ai-chat/
├── ai-chat.class.js      # Main service logic
├── ai-chat.hooks.js      # Authentication hooks
├── ai-chat.service.js    # Service registration
└── ollama-ai.js         # Ollama AI integration
```

#### **Service Registration** (`nodejs-backend/src/services/index.js`)
```javascript
const aiChat = require("./ai-chat/ai-chat.service.js");
app.configure(aiChat);
```

## Configuration

### **Environment Variables**
Add to your `.env` file:
```bash
# Ollama AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

### **Backend Configuration**
In your backend config files, you can also set:
```javascript
// config/default.json or similar
{
  "ollamaBaseURL": "http://localhost:11434",
  "ollamaModel": "llama2"
}
```

## API Endpoints

### **POST /ai-chat**
Handles chat requests with AI responses.

**Request Body:**
```json
{
  "topic": "general",
  "message": "User's message",
  "history": [
    {
      "sender": "user|ai",
      "text": "Message content"
    }
  ]
}
```

**Response:**
```json
{
  "text": "AI response",
  "topic": "customer",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Ollama Setup

### **Installation**
1. Download and install Ollama from [ollama.ai](https://ollama.ai/download)
2. Start Ollama service: `ollama serve`
3. Pull a model: `ollama pull llama2`

### **Model Options**
- **llama2**: Good balance of speed and quality (~4GB RAM)
- **llama2:13b**: Better quality but slower (~8GB RAM)
- **mistral**: Excellent quality (~4GB RAM)
- **phi**: Fast responses (~2GB RAM)

### **Testing**
Use the provided test script:
```bash
node test-ollama-api.js
```

## Database Schema

### **AI Chat Collection** (`ai-chat`)
```javascript
{
  topic: String,           // "general", "customer", "voucher", "admin"
  message: String,         // User's message
  response: String,        // AI response
  userId: ObjectId,        // Reference to user
  sessionId: String,       // Chat session identifier
  metadata: Object,        // Additional context
  createdBy: ObjectId,     // User who created the record
  updatedBy: ObjectId,     // User who last updated
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## Usage Examples

### **Customer Support**
```
User: "I can't redeem my voucher"
AI: "I'm sorry to hear that. Let me help you troubleshoot. 
    First, please check if you have enough points for the voucher. 
    You can view your current balance in your account dashboard..."
```

### **Voucher Suggestions**
```
User: "What vouchers do you recommend?"
AI: "Based on your preferences and current point balance, 
    I'd recommend checking out our food & dining vouchers! 
    We have great deals at popular restaurants..."
```

### **Admin Support**
```
User: "How do I create a new voucher?"
AI: "To create a new voucher, you'll need admin permissions. 
    Go to the voucher management section in the admin panel..."
```

## Error Handling

### **Fallback System**
- If Ollama is not available, falls back to intelligent mock responses
- Mock responses are contextual based on the conversation topic
- Graceful degradation ensures the chat always works

### **Error Messages**
- Connection errors: "Ollama is not running. Please start Ollama first."
- Model errors: "Model not available. Please pull the required model."
- Network errors: "Failed to get response from Ollama"

## Performance Considerations

### **Response Times**
- Local Ollama models: 2-10 seconds (depending on model size)
- Mock responses: ~1 second
- Network timeout: 30 seconds for local models

### **Resource Usage**
- **Minimum**: 8GB RAM, 4-core CPU
- **Recommended**: 16GB RAM, 8-core CPU
- **Optimal**: 32GB RAM, 16-core CPU

## Security Features

### **Authentication**
- JWT token required for all chat requests
- User context is securely passed to AI
- No sensitive data is logged

### **Privacy**
- All AI processing happens locally
- No data sent to external servers
- Conversations are stored in your database only

## Testing

### **Manual Testing**
1. Start backend server
2. Login as a user
3. Navigate to customer page
4. Click AI chat button
5. Send test messages
6. Verify responses

### **Automated Testing**
```bash
# Test Ollama connection
node test-ollama-api.js

# Test backend service
npm test
```

## Troubleshooting

### **Common Issues**
1. **Ollama not running**: Start with `ollama serve`
2. **Model not available**: Pull with `ollama pull llama2`
3. **Slow responses**: Use smaller model or increase RAM
4. **Connection refused**: Check if Ollama is on port 11434

### **Debug Steps**
1. Check Ollama status: `ollama list`
2. Test API directly: `curl http://localhost:11434/api/tags`
3. Check backend logs for connection status
4. Verify environment variables

## Future Enhancements

### **Planned Features**
- **Model Switching**: Allow users to choose different AI models
- **Conversation History**: Persistent chat sessions
- **File Upload**: Support for image/document analysis
- **Voice Input**: Speech-to-text integration
- **Multi-language Support**: Internationalization

### **Performance Improvements**
- **Response Caching**: Cache common responses
- **Streaming Responses**: Real-time response generation
- **Model Optimization**: Better quantization and optimization
- **Load Balancing**: Multiple Ollama instances

## Conclusion

The AI chat implementation provides a robust, local-first solution for customer support and assistance. Using Ollama ensures privacy, reduces costs, and provides reliable AI responses without external dependencies.

The system gracefully falls back to mock responses when Ollama is unavailable, ensuring the chat feature always works for users.

For setup instructions, see the [Ollama Setup Guide](./OLLAMA_SETUP_GUIDE.md). 
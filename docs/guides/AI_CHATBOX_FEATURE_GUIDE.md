# AI Chatbox Feature - Complete Understanding Guide

## 🎯 **Overview**

The AI Chatbox is an intelligent customer support system integrated into your voucher redemption platform. It provides real-time AI assistance to users for customer support, voucher recommendations, and platform guidance.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Ollama AI     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Local)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   AI Service    │    │   AI Models     │
│   - Chat Button │    │   - Prompt      │    │   - qwen3:0.6b  │
│   - Chat Modal  │    │   - Response    │    │   - llama2      │
│   - Messages    │    │   - Cleaning    │    │   - mistral     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 **Frontend Components**

### **1. AIChatbox Component** (`react-frontend/src/components/ai/AIChatbox.js`)

#### **Key Features:**
- **Floating Button**: Blue circular button in bottom-right corner
- **Chat Modal**: Expandable chat window with header, messages, and input
- **Real-time Messaging**: Live message display with user/AI distinction
- **Responsive Design**: Works on desktop and mobile devices

#### **State Management:**
```javascript
const [open, setOpen] = useState(false);           // Chat window open/closed
const [messages, setMessages] = useState([...]);   // Message history
const [input, setInput] = useState("");            // Current input text
const [loading, setLoading] = useState(false);     // Loading state
```

#### **Key Functions:**
```javascript
// Send message to backend AI service
const handleSend = async () => {
  const res = await client.service("ai-chat").create({
    topic: "general",
    message: input,
    history: messages,
  });
  setMessages(prev => [...prev, { sender: "ai", text: res.text }]);
};
```

### **2. Integration in App.js**
```javascript
// Only shows on customer routes, not admin or auth routes
{!isAuthRoute && !isAdminRoute && <AIChatbox />}
```

## 🔧 **Backend Services**

### **1. AI Chat Service** (`nodejs-backend/src/services/ai-chat/`)

#### **Service Structure:**
```
ai-chat/
├── ai-chat.class.js      # Main service logic
├── ai-chat.hooks.js      # Authentication hooks
├── ai-chat.service.js    # Service registration
└── ollama-ai.js         # Ollama AI integration
```

#### **Key Components:**

#### **A. AiChatService Class**
```javascript
class AiChatService extends Service {
  constructor(options, app) {
    // Initialize Ollama AI connection
    this.ollamaAI = createOllamaAI(ollamaBaseURL, ollamaModel);
  }

  async create(data, params) {
    // 1. Get user context
    // 2. Build AI prompt
    // 3. Call Ollama AI
    // 4. Clean response
    // 5. Store in database
    // 6. Return response
  }
}
```

#### **B. Prompt Building**
```javascript
buildPrompt(topic, message, history, userContext) {
  let systemPrompt = "";
  
  switch (topic) {
    case "general":
      systemPrompt = `You are a helpful AI assistant for a voucher redemption platform.
      
      IMPORTANT INSTRUCTIONS:
      - Respond directly and naturally without any special formatting or tags
      - Be friendly, professional, and provide clear, actionable advice
      - Keep responses concise but informative
      - Always provide practical, step-by-step solutions when possible`;
      break;
  }
  
  return `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
}
```

#### **C. Response Cleaning**
```javascript
cleanResponse(response) {
  // Remove <think> tags and their content
  let cleaned = response.replace(/<think>[\s\S]*?<\/think>/g, '');
  
  // Remove any remaining XML-like tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}
```

### **2. Ollama AI Integration** (`ollama-ai.js`)

#### **Key Features:**
- **Local AI Processing**: Uses Ollama for local AI inference
- **Streaming Responses**: Handles real-time response generation
- **Model Management**: Supports multiple AI models
- **Error Handling**: Graceful fallback to mock responses

#### **API Integration:**
```javascript
async chatCompletion(messages, options = {}) {
  const response = await axios.post(
    `${this.baseURL}/api/chat`,
    {
      model: options.model || this.model,
      messages: messages,
      options: {
        temperature: 0.7,
        max_tokens: 1000,
        ...
      }
    },
    {
      responseType: 'stream'  // Handle streaming responses
    }
  );
}
```

## 🗄️ **Database Integration**

### **AI Chat Collection Schema:**
```javascript
{
  topic: String,           // "general", "customer", "voucher", "admin"
  message: String,         // User's message
  response: String,        // AI response (cleaned)
  userId: ObjectId,        // Reference to user
  sessionId: String,       // Chat session identifier
  metadata: Object,        // Additional context
  createdBy: ObjectId,     // User who created the record
  updatedBy: ObjectId,     // User who last updated
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## 🔐 **Security & Authentication**

### **JWT Authentication:**
- All chat requests require valid JWT token
- User context is securely passed to AI
- No sensitive data is logged or exposed

### **User Context Integration:**
```javascript
// Get user data for personalized responses
const userData = await this.app.service('users').get(user._id);
userContext = `User: ${userData.name}, Points: ${userData.points}`;
```

## 🎯 **Use Cases & Capabilities**

### **1. Customer Support**
```
User: "I can't redeem my voucher"
AI: "I'm sorry to hear that. Let me help you troubleshoot:

1. Check if you have enough points for the voucher
2. Verify the voucher is still valid (not expired)
3. Make sure you're logged into the correct account
4. Try refreshing the page and attempting again

If the issue persists, please contact our support team with your voucher ID."
```

### **2. Voucher Recommendations**
```
User: "What vouchers do you recommend with 5000 points?"
AI: "Based on your point balance, here are some great options:

• Food & Dining vouchers (2,000-4,000 points)
• Shopping vouchers (1,500-3,500 points)
• Entertainment vouchers (3,000-5,000 points)

I'd recommend checking out our food & dining section first - we have excellent deals at popular restaurants!"
```

### **3. Platform Guidance**
```
User: "How do I check my point balance?"
AI: "You can check your point balance in several ways:

1. **Dashboard**: Look at the top-right corner of your dashboard
2. **Profile Page**: Go to your profile and view account details
3. **Rewards Page**: Visit the rewards section to see your current balance

Your points are automatically updated after each transaction."
```

## ⚡ **Performance & Optimization**

### **Response Times:**
- **Ollama AI**: 2-5 seconds (local processing)
- **Mock Responses**: ~1 second (fallback)
- **Network Timeout**: 30 seconds

### **Resource Usage:**
- **Model Size**: 522 MB (qwen3:0.6b)
- **RAM Usage**: ~1-2 GB during inference
- **CPU**: Moderate usage during generation

### **Optimization Features:**
- **Response Cleaning**: Removes unwanted tags and formatting
- **Fallback System**: Mock responses when AI unavailable
- **Error Handling**: Graceful degradation
- **Caching**: Future enhancement for common responses

## 🔄 **Configuration Options**

### **Environment Variables:**
```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:0.6b

# Alternative Models
OLLAMA_MODEL=llama2:7b-chat-q4_0
OLLAMA_MODEL=mistral:7b-instruct-q4_0
OLLAMA_MODEL=danielhzq/qwen3_0p6b:latest
```

### **Backend Configuration:**
```javascript
// config/default.json
{
  "ollamaBaseURL": "http://localhost:11434",
  "ollamaModel": "qwen3:0.6b"
}
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **1. AI Not Responding**
- Check if Ollama is running: `ollama list`
- Verify model availability: `ollama list`
- Check backend logs for connection status

#### **2. Unusable Responses**
- Response cleaning should handle `<think>` tags
- Check if cleaning function is working
- Verify prompt engineering

#### **3. Authentication Errors**
- Ensure user is logged in
- Check JWT token validity
- Verify authentication middleware

### **Debug Steps:**
1. **Check Ollama Status**: `ollama list`
2. **Test API Directly**: `node test-ollama-api.js`
3. **Check Backend Logs**: Look for connection messages
4. **Verify Frontend**: Check browser console for errors

## 🚀 **Future Enhancements**

### **Planned Features:**
- **Model Switching**: Allow users to choose different AI models
- **Response Caching**: Cache common responses for faster replies
- **Streaming Responses**: Real-time response generation
- **Voice Input**: Speech-to-text integration
- **File Upload**: Image/document analysis
- **Multi-language Support**: Internationalization

### **Advanced Features:**
- **Context Memory**: Better conversation context
- **Personalization**: Enhanced user preference learning
- **Proactive Suggestions**: AI-initiated recommendations
- **Sentiment Analysis**: Emotion-aware responses
- **Analytics Dashboard**: Chat analytics and insights

## 📊 **Benefits & Advantages**

### **Privacy & Security:**
- 🔐 All AI processing happens locally
- 🛡️ No data sent to external servers
- 🔑 No API keys or external dependencies

### **Cost & Performance:**
- 💰 No API costs or usage limits
- ⚡ Fast local processing
- 🌐 Works offline after model download

### **Control & Customization:**
- 🎛️ Full control over models
- 🔧 Customizable responses
- 📊 Local analytics and monitoring

## 🎉 **Summary**

The AI Chatbox feature provides:

1. **Intelligent Customer Support**: Real-time AI assistance for users
2. **Local AI Processing**: Privacy-focused, cost-effective AI
3. **Seamless Integration**: Native part of the voucher platform
4. **Robust Architecture**: Reliable, scalable, and maintainable
5. **User-Friendly Interface**: Clean, responsive chat interface

**The AI Chatbox transforms your voucher platform into an intelligent, self-service support system that enhances user experience and reduces manual support workload.** 🚀 
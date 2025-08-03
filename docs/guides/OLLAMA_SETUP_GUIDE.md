# Ollama Setup Guide for AI Chat

## 🚀 **Overview**

This guide will help you configure Ollama (local AI models) to provide intelligent responses in your voucher redemption platform's chatbox. Ollama allows you to run AI models locally without needing external API keys or internet connectivity.

## 📋 **Prerequisites**

1. **Windows 10/11, macOS, or Linux**
2. **At least 8GB RAM** (16GB+ recommended)
3. **Node.js Backend**: Your backend should be running
4. **Internet connection** (only for initial model download)

## 🔧 **Step 1: Install Ollama**

### **Windows:**
1. Go to [Ollama Downloads](https://ollama.ai/download)
2. Download the Windows installer
3. Run the installer and follow the setup wizard
4. Ollama will start automatically as a Windows service

### **macOS:**
```bash
# Using Homebrew
brew install ollama

# Or download from website
# https://ollama.ai/download
```

### **Linux:**
```bash
# Install using curl
curl -fsSL https://ollama.ai/install.sh | sh

# Or using package manager
# Ubuntu/Debian
sudo apt-get install ollama

# CentOS/RHEL
sudo yum install ollama
```

## 🎯 **Step 2: Start Ollama Service**

### **Windows:**
- Ollama starts automatically as a Windows service
- Check if it's running: `ollama list`

### **macOS/Linux:**
```bash
# Start Ollama service
ollama serve

# Or run in background
nohup ollama serve > ollama.log 2>&1 &
```

## 📦 **Step 3: Download AI Models**

### **Recommended Models:**

**For Lightweight Usage (2-4GB RAM):**
```bash
# Llama2 7B (good balance of speed/quality)
ollama pull llama2

# Or even smaller
ollama pull llama2:7b-chat-q4_0
```

**For Better Quality (8GB+ RAM):**
```bash
# Llama2 13B (better responses)
ollama pull llama2:13b

# Or Mistral (excellent quality)
ollama pull mistral
```

**For Fast Responses (4-6GB RAM):**
```bash
# Phi-2 (Microsoft's fast model)
ollama pull phi

# Or TinyLlama
ollama pull tinyllama
```

### **Check Available Models:**
```bash
ollama list
```

## ⚙️ **Step 4: Configure Your Application**

### **Option A: Environment Variables (Recommended)**

**Windows:**
```bash
set OLLAMA_BASE_URL=http://localhost:11434
set OLLAMA_MODEL=llama2
```

**Linux/macOS:**
```bash
export OLLAMA_BASE_URL=http://localhost:11434
export OLLAMA_MODEL=llama2
```

### **Option B: .env File**

Create a `.env` file in your `nodejs-backend` directory:
```bash
# nodejs-backend/.env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
MONGODB_URI=mongodb://localhost:27017/voucher-redeem-merncp
JWT_SECRET=your-jwt-secret
```

### **Option C: Configuration File**

Add to your backend configuration:
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
  "ollamaBaseURL": "http://localhost:11434",
  "ollamaModel": "llama2",
  "authentication": {
    // ... existing config
  }
}
```

## 🧪 **Step 5: Test Ollama Setup**

### **5.1 Test Ollama Directly**
```bash
# Test basic chat
ollama run llama2 "Hello, how are you?"

# Test with system prompt
ollama run llama2 "You are a helpful assistant. Say hello!"
```

### **5.2 Test API Endpoint**
```bash
# Test Ollama API directly
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'
```

### **5.3 Test Your Application**
```bash
# Start your backend
cd nodejs-backend
npm start
```

Look for these messages in the console:
- ✅ `"Ollama connected successfully. Available models: llama2"`
- ⚠️ `"Ollama is running but no models are available"`
- ❌ `"Ollama not available - using mock responses"`

## 🎯 **Step 6: Verify Frontend Integration**

1. **Start your frontend**:
   ```bash
   cd react-frontend
   npm start
   ```

2. **Login as a user** and go to a customer page

3. **Test the AI chatbox**:
   - Click the blue AI chat button
   - Send a message like "Hello, can you help me with vouchers?"
   - You should get a response from your local Ollama model

## 🔍 **Step 7: Monitor Performance**

### **Check Ollama Status:**
```bash
# List running models
ollama list

# Check Ollama logs
ollama logs

# Monitor resource usage
# Windows: Task Manager
# Linux/macOS: htop or top
```

### **Backend Logs:**
Watch your backend logs for:
- Ollama connection status
- Response times
- Error messages

## 🛠️ **Troubleshooting**

### **Issue: "Ollama is not running"**
**Solution:**
```bash
# Start Ollama service
ollama serve

# Check if it's running
curl http://localhost:11434/api/tags
```

### **Issue: "No models available"**
**Solution:**
```bash
# Pull a model
ollama pull llama2

# Check available models
ollama list
```

### **Issue: "Connection refused"**
**Solution:**
- Check if Ollama is running on port 11434
- Verify firewall settings
- Try restarting Ollama service

### **Issue: "Slow responses"**
**Solution:**
- Use a smaller model (llama2:7b instead of llama2:13b)
- Increase system RAM
- Use quantization (q4_0, q8_0)
- Close other applications

### **Issue: "Out of memory"**
**Solution:**
- Use a smaller model
- Increase system RAM
- Use model quantization
- Close other applications

## 💾 **Model Management**

### **List Models:**
```bash
ollama list
```

### **Remove Model:**
```bash
ollama rm llama2
```

### **Update Model:**
```bash
ollama pull llama2:latest
```

### **Check Model Info:**
```bash
ollama show llama2
```

## ⚡ **Performance Optimization**

### **Model Selection Guide:**

**For Development/Testing:**
```bash
ollama pull llama2:7b-chat-q4_0  # ~4GB RAM, fast
```

**For Production (Good Quality):**
```bash
ollama pull llama2:13b-chat-q4_0  # ~8GB RAM, better quality
```

**For Production (Best Quality):**
```bash
ollama pull mistral:7b-instruct-q4_0  # ~4GB RAM, excellent quality
```

### **System Requirements:**
- **Minimum**: 8GB RAM, 4-core CPU
- **Recommended**: 16GB RAM, 8-core CPU
- **Optimal**: 32GB RAM, 16-core CPU

## 🔒 **Security Considerations**

1. **Local Only**: Ollama runs locally, no data sent to external servers
2. **No API Keys**: No need for external API keys or accounts
3. **Privacy**: All conversations stay on your machine
4. **Network**: Can work completely offline after model download

## 📊 **Expected Behavior After Setup**

### **Before (Mock Responses):**
```
User: "Hello, how can you help me?"
AI: "I'd be happy to help you with that! How can I assist you today?"
```

### **After (Ollama AI):**
```
User: "Hello, how can you help me?"
AI: "Hello! I'm your AI assistant for the voucher redemption platform. I can help you with various tasks including:

• Finding and redeeming vouchers based on your preferences
• Checking your current point balance and transaction history
• Troubleshooting account issues or technical problems
• Providing personalized voucher recommendations
• Answering questions about the platform's features and policies

What specific assistance do you need today? I'm here to help make your voucher redemption experience smooth and enjoyable!"
```

## 🎉 **Success Indicators**

You'll know Ollama is working when:
- ✅ Backend shows: `"Ollama connected successfully. Available models: llama2"`
- ✅ AI responses are more detailed and contextual
- ✅ Responses vary based on the conversation
- ✅ No errors in backend logs related to Ollama
- ✅ Response times are reasonable (2-10 seconds)

## 📞 **Support**

If you encounter issues:
1. Check [Ollama Documentation](https://ollama.ai/docs)
2. Verify Ollama is running: `ollama list`
3. Check system resources (RAM, CPU)
4. Try a different model
5. Check the troubleshooting section above

---

**Need help?** Check the troubleshooting section above or refer to the [AI Chat Troubleshooting Guide](./AI_CHAT_TROUBLESHOOTING.md) for general chat issues. 
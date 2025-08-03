const { Service } = require("feathers-mongoose");
const createOllamaAI = require("./ollama-ai");

exports.AiChatService = class AiChatService extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
    
    // Initialize Ollama AI with configuration from environment or config
    const ollamaBaseURL = process.env.OLLAMA_BASE_URL || app.get('ollamaBaseURL') || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || app.get('ollamaModel') || 'llama2';
    
    this.ollamaAI = createOllamaAI(ollamaBaseURL, ollamaModel);
    
    // Test Ollama connection on startup
    this.testOllamaConnection();
  }

  async testOllamaConnection() {
    try {
      const models = await this.ollamaAI.listModels();
      if (models.length > 0) {
        console.log(`✅ Ollama connected successfully. Available models: ${models.map(m => m.name).join(', ')}`);
      } else {
        console.log('⚠️  Ollama is running but no models are available');
      }
    } catch (error) {
      console.log('❌ Ollama not available - using mock responses');
      console.log('   To use Ollama: 1) Install Ollama 2) Start Ollama service 3) Pull a model (e.g., ollama pull llama2)');
    }
  }

  async create(data, params) {
    const { topic, message, history } = data;
    
    try {
      // Get user context if available
      const user = params.user;
      let userContext = "";
      
      if (user && user._id) {
        try {
          const userData = await this.app.service('users').get(user._id);
          userContext = `User: ${userData.name || userData.username || 'Unknown'}, Points: ${userData.points || 0}`;
        } catch (err) {
          console.log('Could not fetch user data for AI context');
        }
      }

      // Build prompt based on topic
      const prompt = this.buildPrompt(topic, message, history, userContext);
      
      // Call Ollama AI API
      const aiResponse = await this.callOllamaAI(prompt);
      
      // Store the chat interaction in the database
      const chatRecord = {
        topic,
        message,
        response: aiResponse,
        userId: user?._id || null,
        sessionId: params.sessionId || null,
        metadata: {
          userContext,
          historyLength: history?.length || 0
        },
        createdBy: user?._id || null,
        updatedBy: user?._id || null
      };
      
      // Save to database using the parent Service class
      await super.create(chatRecord, params);
      
      return {
        text: aiResponse,
        topic,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  buildPrompt(topic, message, history, userContext) {
    let systemPrompt = "";
    
    switch (topic) {
      case "customer":
        systemPrompt = `You are a helpful customer support assistant for a voucher redemption platform. 
        Help users with account issues, point redemption, voucher usage, and general platform questions.
        Be friendly, professional, and provide clear, actionable advice.`;
        break;
        
      case "voucher":
        systemPrompt = `You are a voucher recommendation assistant. 
        Based on user preferences and available vouchers, suggest relevant rewards.
        Consider user points, interests, and redemption history.
        Provide personalized suggestions with reasoning.`;
        break;
        
      case "admin":
        systemPrompt = `You are an admin support assistant for the voucher platform.
        Help with administrative tasks, user management, voucher creation, and system issues.
        Provide technical guidance and best practices for platform management.`;
        break;
        
      case "general":
      default:
        systemPrompt = `You are a helpful AI assistant for a voucher redemption platform. 
        You can help with customer support, voucher suggestions, admin tasks, and general questions about the platform.
        
        IMPORTANT INSTRUCTIONS:
        - Respond directly and naturally without any special formatting or tags
        - Be friendly, professional, and provide clear, actionable advice
        - Keep responses concise but informative
        - If users ask about vouchers, help them find relevant rewards
        - If they have account issues, guide them through troubleshooting
        - If they need admin help, provide appropriate guidance
        - Always provide practical, step-by-step solutions when possible
        - Use bullet points or numbered lists for complex instructions
        
        Remember: Users want quick, helpful answers they can act on immediately.`;
        break;
    }

    // Add user context if available
    if (userContext) {
      systemPrompt += `\n\nUser Context: ${userContext}`;
    }

    // Build conversation history
    let conversationHistory = "";
    if (history && history.length > 0) {
      conversationHistory = history
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
    }

    return `${systemPrompt}

${conversationHistory ? `Previous conversation:
${conversationHistory}

` : ''}User: ${message}
Assistant:`;
  }

  async callOllamaAI(prompt) {
    try {
      // Try to use Ollama AI
      const response = await this.ollamaAI.generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('Ollama AI Error:', error.message);
      
      // Fallback to mock responses if Ollama is not available
      const mockResponses = {
        customer: [
          "I'd be happy to help you with that! Could you please provide more details about your issue?",
          "I understand your concern. Let me guide you through the process step by step.",
          "For account-related issues, you can try logging out and logging back in, or contact our support team.",
          "To redeem vouchers, make sure you have enough points and the voucher is still valid."
        ],
        voucher: [
          "Based on your preferences, I'd recommend checking out our food & dining vouchers!",
          "You have enough points for several great rewards. Would you like me to suggest some options?",
          "I see you're interested in travel rewards. We have some excellent deals available.",
          "For your point balance, I'd suggest starting with smaller rewards to build up your redemption history."
        ],
        admin: [
          "For admin tasks, make sure you have the proper permissions and are logged in as an administrator.",
          "To create new vouchers, use the voucher management section in the admin panel.",
          "User management can be done through the users section. Remember to follow security best practices.",
          "For system issues, check the logs and ensure all services are running properly."
        ],
        general: [
          "I'd be happy to help you with that! How can I assist you today?",
          "I'm here to help with any questions about our voucher platform. What would you like to know?",
          "I can help you with vouchers, account issues, or general platform questions. What do you need?",
          "Let me know what you'd like assistance with, and I'll do my best to help!"
        ]
      };

      // Extract topic from prompt to select appropriate responses
      let topic = "general";
      if (prompt.includes("voucher recommendation") || prompt.includes("voucher")) topic = "voucher";
      if (prompt.includes("admin support") || prompt.includes("admin")) topic = "admin";
      if (prompt.includes("customer support") || prompt.includes("account")) topic = "customer";

      const responses = mockResponses[topic];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return randomResponse;
    }
  }
}

 
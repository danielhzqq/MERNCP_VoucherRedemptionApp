const axios = require('axios');

class OllamaAI {
  constructor(baseURL = 'http://localhost:11434', model = 'llama2') {
    this.baseURL = baseURL;
    this.model = model;
  }

  async chatCompletion(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: options.model || this.model,
          messages: messages,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.8,
            max_tokens: options.max_tokens || 1000,
            ...options
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000, // 30 second timeout for local models
          responseType: 'stream'
        }
      );

      return new Promise((resolve, reject) => {
        let fullResponse = '';
        
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                fullResponse += data.message.content;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        });
        
        response.data.on('end', () => {
          resolve(fullResponse);
        });
        
        response.data.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Ollama API Error:', error.response?.data || error.message);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama is not running. Please start Ollama first.');
      }
      
      throw new Error('Failed to get response from Ollama');
    }
  }

  async generateResponse(prompt, context = '') {
    const messages = [
      {
        role: 'system',
        content: (context || 'You are a helpful assistant for a voucher redemption platform.') + 
                '\n\nIMPORTANT: Respond directly and naturally. Do not use <think> tags or any special formatting. ' +
                'Provide clear, helpful responses that users can immediately understand and use.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.chatCompletion(messages);
    
    // Clean up the response by removing <think> tags and their content
    return this.cleanResponse(response);
  }

  cleanResponse(response) {
    // Remove <think> tags and their content
    let cleaned = response.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    // Remove any remaining XML-like tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Clean up extra whitespace and newlines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    cleaned = cleaned.trim();
    
    // If the response is empty after cleaning, provide a fallback
    if (!cleaned || cleaned.length < 10) {
      return "I apologize, but I'm having trouble generating a proper response. Please try asking your question again.";
    }
    
    return cleaned;
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to list Ollama models:', error.message);
      return [];
    }
  }

  async isModelAvailable(modelName) {
    try {
      const models = await this.listModels();
      return models.some(model => model.name === modelName);
    } catch (error) {
      return false;
    }
  }

  async pullModel(modelName) {
    try {
      console.log(`Pulling model: ${modelName}`);
      const response = await axios.post(`${this.baseURL}/api/pull`, {
        name: modelName
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to pull model ${modelName}:`, error.message);
      throw error;
    }
  }
}

// Export a factory function to create OllamaAI instance
module.exports = function createOllamaAI(baseURL, model) {
  return new OllamaAI(baseURL, model);
};

// Export the class for direct use
module.exports.OllamaAI = OllamaAI; 
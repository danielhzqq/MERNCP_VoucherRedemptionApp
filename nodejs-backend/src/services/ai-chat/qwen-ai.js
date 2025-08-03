const axios = require('axios');

class QwenAI {
  constructor(apiKey, baseURL = 'https://dashscope.aliyuncs.com/api/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async chatCompletion(messages, model = 'qwen-turbo') {
    try {
      const response = await axios.post(
        `${this.baseURL}/services/aigc/text-generation/generation`,
        {
          model: model,
          input: {
            messages: messages
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 0.8
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.output.text;
    } catch (error) {
      console.error('Qwen AI API Error:', error.response?.data || error.message);
      throw new Error('Failed to get response from Qwen AI');
    }
  }

  async generateResponse(prompt, context = '') {
    const messages = [
      {
        role: 'system',
        content: context || 'You are a helpful assistant for a voucher redemption platform.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.chatCompletion(messages);
  }
}

// Export a factory function to create QwenAI instance
module.exports = function createQwenAI(apiKey) {
  return new QwenAI(apiKey);
};

// Export the class for direct use
module.exports.QwenAI = QwenAI; 
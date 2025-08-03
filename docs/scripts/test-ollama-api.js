const axios = require('axios');

async function testOllamaAPI() {
  console.log('🧪 Testing Ollama API Configuration...\n');
  
  const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'qwen3:0.6b';
  
  console.log(`📍 Ollama Base URL: ${baseURL}`);
  console.log(`🤖 Model: ${model}`);
  
  try {
    // Test 1: Check if Ollama is running
    console.log('\n1️⃣ Testing Ollama connection...');
    const tagsResponse = await axios.get(`${baseURL}/api/tags`, {
      timeout: 5000
    });
    
    const models = tagsResponse.data.models || [];
    console.log(`✅ Ollama is running! Available models: ${models.map(m => m.name).join(', ')}`);
    
    // Test 2: Check if the specified model is available
    const modelAvailable = models.some(m => m.name === model);
    if (!modelAvailable) {
      console.log(`⚠️  Model '${model}' is not available. Available models: ${models.map(m => m.name).join(', ')}`);
      console.log(`💡 To pull the model: ollama pull ${model}`);
      return;
    }
    
    console.log(`✅ Model '${model}' is available!`);
    
    // Test 3: Test chat completion
    console.log('\n2️⃣ Testing chat completion...');
    const chatResponse = await axios.post(
      `${baseURL}/api/chat`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for a voucher redemption platform. Please respond briefly.'
          },
          {
            role: 'user',
            content: 'Hello! Please respond with "Ollama is working correctly!" if you can see this message.'
          }
        ],
        options: {
          temperature: 0.7,
          max_tokens: 100
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
    
    // Handle streaming response
    let fullResponse = '';
    chatResponse.data.on('data', (chunk) => {
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
    
    await new Promise((resolve, reject) => {
      chatResponse.data.on('end', () => {
        console.log('✅ Chat completion successful!');
        console.log('📝 Response:', fullResponse);
        resolve();
      });
      
      chatResponse.data.on('error', (error) => {
        reject(error);
      });
    });
    console.log('\n🎉 Your Ollama configuration is working correctly!');
    console.log('You can now use the AI chatbox in your application.');
    
  } catch (error) {
    console.log('❌ Ollama API Test Failed');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔌 Ollama is not running or not accessible');
      console.log('💡 To start Ollama:');
      console.log('   Windows: ollama serve (or restart the service)');
      console.log('   macOS/Linux: ollama serve');
      console.log('   Check if Ollama is running: ollama list');
    } else if (error.response) {
      // Server responded with error status
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      
      if (error.response.status === 404) {
        console.log('\n🔍 This usually means:');
        console.log('- The model is not available');
        console.log('- Try pulling the model: ollama pull ' + model);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log('Network Error:', error.message);
      console.log('\n🌐 This usually means:');
      console.log('- Ollama is not running');
      console.log('- Firewall blocking the request');
      console.log('- Wrong base URL');
    } else {
      // Something else happened
      console.log('Error:', error.message);
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Install Ollama: https://ollama.ai/download');
    console.log('2. Start Ollama: ollama serve');
    console.log('3. Pull a model: ollama pull llama2');
    console.log('4. Check if running: ollama list');
    console.log('5. Verify the base URL and model name');
  }
}

// Run the test
testOllamaAPI(); 
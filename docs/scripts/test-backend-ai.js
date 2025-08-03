const axios = require('axios');

async function testBackendAI() {
  console.log('🧪 Testing Backend AI Service...\n');
  
  try {
    // Test the backend AI chat endpoint
    const response = await axios.post(
      'http://localhost:3030/ai-chat',
      {
        topic: 'general',
        message: 'Hello! I need help with vouchers. Can you give me a detailed response about how to redeem them?',
        history: []
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token' // This will cause auth error but we can see the response structure
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Backend AI Test Successful!');
    console.log('📝 Response:', response.data);
    
  } catch (error) {
    console.log('❌ Backend AI Test Failed');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n🔑 This is expected - authentication required');
        console.log('💡 To test properly:');
        console.log('   1. Start your frontend: cd react-frontend && npm start');
        console.log('   2. Login as a user');
        console.log('   3. Use the AI chatbox in the browser');
        console.log('   4. Check if responses are from Ollama or mock data');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔌 Backend is not running');
      console.log('💡 Start the backend: cd nodejs-backend && npm start');
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Also test Ollama directly to compare
async function testOllamaDirect() {
  console.log('\n🧪 Testing Ollama Directly...\n');
  
  try {
    const response = await axios.post(
      'http://localhost:11434/api/chat',
      {
        model: 'qwen3:0.6b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for a voucher redemption platform. Respond directly and naturally without any special formatting or tags.'
          },
          {
            role: 'user',
            content: 'Hello! I need help with vouchers. Can you give me a detailed response about how to redeem them?'
          }
        ],
        options: {
          temperature: 0.7,
          max_tokens: 200
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
        responseType: 'stream'
      }
    );
    
    // Handle streaming response
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
    
    await new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log('✅ Ollama Direct Test Successful!');
        console.log('📝 Raw Response:', fullResponse);
        
        // Clean the response
        const cleaned = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<[^>]*>/g, '').trim();
        console.log('📝 Cleaned Response:', cleaned);
        
        resolve();
      });
      
      response.data.on('error', (error) => {
        reject(error);
      });
    });
    
  } catch (error) {
    console.log('❌ Ollama Direct Test Failed:', error.message);
  }
}

// Run both tests
async function runTests() {
  await testBackendAI();
  await testOllamaDirect();
  
  console.log('\n🔍 Analysis:');
  console.log('1. If Ollama direct test works but backend doesn\'t, the backend is using mock responses');
  console.log('2. If both work, check the response quality in the browser');
  console.log('3. If neither works, Ollama might not be running properly');
}

runTests(); 
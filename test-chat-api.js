// Test script for the new chat API
// Usage: 
// To test the v1 API:       node test-chat-api.js v1
// To test the updated API:  node test-chat-api.js updated 
// To test the legacy API:   node test-chat-api.js legacy

const http = require('http');
const https = require('https');

async function makeRequest(url, data) {
  const isHttps = url.startsWith('https');
  const client = isHttps ? https : http;
  
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const req = client.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ 
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(parsedData) 
          });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function testChatApi() {
  const apiType = process.argv[2] || 'v1';
  let apiUrl;
  
  switch(apiType) {
    case 'v1':
      apiUrl = 'http://localhost:3000/api/v1/chat';
      break;
    case 'updated':
      apiUrl = 'http://localhost:3000/api/chat/route-updated';
      break;
    case 'legacy':
      apiUrl = 'http://localhost:3000/api/chat';
      break;
    default:
      apiUrl = 'http://localhost:3000/api/v1/chat';
  }
  
  console.log(`Testing ${apiType} chat API at ${apiUrl}`);
  
  const testCases = [
    {
      name: "Basic question",
      payload: {
        message: "What does Islam teach about patience?",
        userId: "test-user"
      }
    },
    {
      name: "With conversation history",
      payload: {
        message: "Can you tell me more about Ramadan?",
        conversationHistory: [
          { role: "user", content: "What are the pillars of Islam?" },
          { role: "assistant", content: "As-salamu alaykum! The five pillars of Islam are: Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting during Ramadan), and Hajj (pilgrimage to Mecca)." }
        ],
        userId: "test-user"
      }
    },
    {
      name: "With content unlocking",
      payload: {
        message: "I'm feeling anxious about my future. How can patience help me?",
        enableUnlocking: true,
        userId: "test-user"
      }
    }
  ];
  
  for (const test of testCases) {
    console.log(`\n🧪 Running test: ${test.name}`);
    
    try {
      const startTime = Date.now();
      const response = await makeRequest(apiUrl, test.payload);
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        console.error(`❌ Error: HTTP ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`✅ Success (${responseTime}ms):`);
      
      // Handle different response formats
      if (data.success && data.data) {
        // New API format
        console.log('Response:', data.data.response ? data.data.response.substring(0, 150) + '...' : 'No response');
        console.log('Suggestions:', data.data.suggestions);
        
        if (data.data.unlocks) {
          console.log('Unlocks:', data.data.unlocks.length);
        }
      } else if (data.response) {
        // Legacy API format
        console.log('Response:', data.response.substring(0, 150) + '...');
        console.log('Suggestions:', data.suggestions);
        
        if (data.unlocks) {
          console.log('Unlocks:', data.unlocks.length);
        }
        
        if (data.spiritualGuidance) {
          console.log('Spiritual Guidance:', data.spiritualGuidance);
        }
      } else {
        console.log('Unexpected response format:', data);
      }
    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }
}

testChatApi().catch(console.error);

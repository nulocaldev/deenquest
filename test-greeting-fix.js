// Test script to verify greeting fix
const fetch = require('node-fetch').default;

async function testGreetingFix() {
  console.log('==== TESTING GREETING FIX ====');
  
  // Test 1: First message - should include greeting
  console.log('\nTEST 1: First message - should include greeting');
  const firstResponse = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Can you tell me about patience in Islam?",
      context: "Islamic guidance chat",
      conversationHistory: [],
      userId: "test_user_1",
      enableUnlocking: true
    })
  });
  
  const data1 = await firstResponse.json();
  console.log("Response:", data1.response.substring(0, 100) + "...");
  console.log("Contains greeting:", data1.response.includes("As-salamu alaykum") || 
                                  data1.response.includes("Assalamu alaikum") || 
                                  data1.response.toLowerCase().includes("salam"));
  
  // Test 2: Follow-up message - should NOT include greeting
  console.log('\nTEST 2: Follow-up message - should NOT include greeting');
  const conversationHistory = [
    { role: 'user', content: "Can you tell me about patience in Islam?" },
    { role: 'assistant', content: data1.response }
  ];
  
  const secondResponse = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Thank you. What does the Quran say about it?",
      context: "Islamic guidance chat",
      conversationHistory: conversationHistory,
      userId: "test_user_1",
      enableUnlocking: true
    })
  });
  
  const data2 = await secondResponse.json();
  console.log("Response:", data2.response.substring(0, 100) + "...");
  console.log("Contains greeting:", data2.response.includes("As-salamu alaykum") || 
                                  data2.response.includes("Assalamu alaikum") || 
                                  data2.response.toLowerCase().includes("salam") ||
                                  data2.response.toLowerCase().includes("walaykoum"));
  
  // Test 3: User explicitly greets - may acknowledge but shouldn't repeat in future
  console.log('\nTEST 3: User greeting - should acknowledge but not repeat in future');
  const updatedHistory = [
    ...conversationHistory,
    { role: 'user', content: "Thank you. What does the Quran say about it?" },
    { role: 'assistant', content: data2.response }
  ];
  
  const thirdResponse = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Assalamu alaikum! Can you tell me about gratitude?",
      context: "Islamic guidance chat",
      conversationHistory: updatedHistory,
      userId: "test_user_1",
      enableUnlocking: true
    })
  });
  
  const data3 = await thirdResponse.json();
  console.log("Response:", data3.response.substring(0, 100) + "...");
  console.log("Contains response to greeting:", data3.response.toLowerCase().includes("walaykoum") || 
                                             data3.response.toLowerCase().includes("wa alaykum") ||
                                             data3.response.toLowerCase().includes("wa'alaykum"));
  
  // Test 4: Message after greeting - should NOT repeat greeting
  console.log('\nTEST 4: Message after greeting - should NOT repeat greeting');
  const finalHistory = [
    ...updatedHistory,
    { role: 'user', content: "Assalamu alaikum! Can you tell me about gratitude?" },
    { role: 'assistant', content: data3.response }
  ];
  
  const fourthResponse = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "And what about forgiveness?",
      context: "Islamic guidance chat",
      conversationHistory: finalHistory,
      userId: "test_user_1",
      enableUnlocking: true
    })
  });
  
  const data4 = await fourthResponse.json();
  console.log("Response:", data4.response.substring(0, 100) + "...");
  console.log("Contains greeting:", data4.response.toLowerCase().includes("walaykoum") || 
                                  data4.response.toLowerCase().includes("wa alaykum") ||
                                  data4.response.toLowerCase().includes("wa'alaykum"));
  
  console.log("\n✅ Testing complete!");
}

testGreetingFix();

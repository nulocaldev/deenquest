const fetch = require('node-fetch');

async function testHybridAPI() {
  const testPayload = {
    message: "Tell me about patience in Islam",
    context: "Islamic guidance and wisdom chat",
    conversationHistory: [
      { role: "user", content: "I am struggling with patience" },
      { role: "assistant", content: "Patience is a virtue in Islam..." }
    ],
    userId: "test_user_123"
  };

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("Error testing hybrid API:", error);
  }
}

testHybridAPI();

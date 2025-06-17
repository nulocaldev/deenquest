const fetch = require('node-fetch').default;

console.log("\n📝 IMPORTANT: This test requires the Next.js development server to be running.");
console.log("   Run 'npm run dev' in a separate terminal before executing this test.\n");

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
    // Check for port 3001 as Next.js defaults to this when 3000 is in use
    const port = 3001;
    console.log(`Testing API on http://localhost:${port}/api/chat...\n`);
    
    const response = await fetch(`http://localhost:${port}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();
    
    console.log("API Response Summary:");
    console.log("--------------------");
    console.log(`✅ AI Response: ${data.response ? "Received" : "Missing"}`);
    console.log(`✅ Suggestions: ${data.suggestions ? `${data.suggestions.length} items` : "Missing"}`);
    console.log(`✅ Unlocks: ${data.unlocks ? `${data.unlocks.length} items` : "None"}`);
    console.log(`✅ Spiritual Guidance: ${data.spiritualGuidance ? "Provided" : "None"}`);
    
    console.log("\nFull Response Data:");
    console.log("------------------");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error testing hybrid API:", error);
  }
}

testHybridAPI();

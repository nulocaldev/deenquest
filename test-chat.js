// Test script to verify chat functionality and suggestions
console.log("=== DeenQuest Chat Test ===");

// Test 1: Check if suggestions are present in initial message
console.log("1. Checking for initial suggestions...");
const initialMessage = document.querySelector('[data-testid="ai-message"]') || 
                      document.querySelector('.space-y-3');

if (initialMessage) {
  console.log("✅ Initial AI message found");
  
  // Look for suggestion buttons
  const suggestions = document.querySelectorAll('button[class*="aurora-cyan"]') ||
                     document.querySelectorAll('button:contains("Tell me about")') ||
                     document.querySelectorAll('.flex-wrap button');
  
  if (suggestions.length > 0) {
    console.log(`✅ Found ${suggestions.length} suggestion buttons`);
    suggestions.forEach((btn, i) => {
      console.log(`   Suggestion ${i + 1}: "${btn.textContent?.trim()}"`);
    });
  } else {
    console.log("❌ No suggestion buttons found");
    console.log("Checking for any buttons in the chat area...");
    const allButtons = document.querySelectorAll('button');
    console.log(`Found ${allButtons.length} total buttons on page`);
  }
} else {
  console.log("❌ Initial AI message not found");
}

// Test 2: Check API connectivity
console.log("\n2. Testing chat API...");
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'Test message', 
    context: 'Testing API' 
  })
})
.then(response => response.json())
.then(data => {
  console.log("✅ Chat API working:", data.response.substring(0, 50) + "...");
  if (data.suggestions) {
    console.log("✅ API returns suggestions:", data.suggestions);
  }
})
.catch(error => {
  console.log("❌ Chat API error:", error);
});

console.log("\n=== Test Complete ===");

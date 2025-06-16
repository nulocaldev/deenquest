#!/bin/bash

echo "🧪 Testing DeenQuest Chat Interface Suggestions"
echo "=============================================="

# Test 1: Check if chat page loads
echo "1. Testing chat page load..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/chat)
if [ "$response" = "200" ]; then
    echo "✅ Chat page loads successfully"
else
    echo "❌ Chat page failed to load (HTTP $response)"
    exit 1
fi

# Test 2: Check if suggestions are in HTML
echo "2. Testing suggestions in HTML..."
suggestions_count=$(curl -s http://localhost:3000/chat | grep -o "Tell me about the pillars of Islam" | wc -l)
if [ "$suggestions_count" -gt 0 ]; then
    echo "✅ Suggestions found in HTML ($suggestions_count instances)"
else
    echo "❌ No suggestions found in HTML"
fi

# Test 3: Check if API returns suggestions
echo "3. Testing chat API suggestions..."
api_response=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"message": "Hello", "context": "Islamic guidance"}' \
    http://localhost:3000/api/chat)

suggestions_in_api=$(echo "$api_response" | grep -o '"suggestions"' | wc -l)
if [ "$suggestions_in_api" -gt 0 ]; then
    echo "✅ API returns suggestions"
    echo "   Sample response: $(echo "$api_response" | head -c 100)..."
else
    echo "❌ API does not return suggestions"
fi

# Test 4: Check if Sparkles icon is in HTML
echo "4. Testing suggestion icons..."
sparkles_count=$(curl -s http://localhost:3000/chat | grep -o "lucide-sparkles" | wc -l)
if [ "$sparkles_count" -gt 0 ]; then
    echo "✅ Sparkles icons found ($sparkles_count instances)"
else
    echo "❌ No sparkles icons found"
fi

# Test 5: Check if suggestions have proper styling
echo "5. Testing suggestion styling..."
styled_suggestions=$(curl -s http://localhost:3000/chat | grep -o 'style=".*background.*rgba.*59.*130.*246' | wc -l)
if [ "$styled_suggestions" -gt 0 ]; then
    echo "✅ Suggestions have proper inline styling"
else
    echo "❌ Suggestions missing proper styling"
fi

echo ""
echo "🎉 Chat interface suggestions test completed!"
echo ""
echo "To manually test:"
echo "1. Open http://localhost:3000/chat"
echo "2. Look for clickable blue suggestion buttons below the AI message"
echo "3. Click a suggestion to test functionality"
echo "4. Send a message and check if new AI responses have suggestions"

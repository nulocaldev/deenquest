#!/bin/bash

# Test the chat API using curl
echo "Testing Chat API..."

# API endpoint
API_URL="http://localhost:3000/api/v1/chat"

# Basic test
echo -e "\n🧪 Testing basic question..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"What does Islam teach about patience?"}' \
  "$API_URL" | jq '.data.response' | head -c 150

# Test with conversation history
echo -e "\n🧪 Testing with conversation history..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me more about Ramadan", 
    "conversationHistory": [
      {"role": "user", "content": "What are the pillars of Islam?"}, 
      {"role": "assistant", "content": "As-salamu alaykum! The five pillars of Islam are..."}
    ]
  }' \
  "$API_URL" | jq '.data.response' | head -c 150

# Test with content unlocking
echo -e "\n🧪 Testing with content unlocking..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am feeling anxious about my future. How can patience help me?", 
    "enableUnlocking": true
  }' \
  "$API_URL" | jq '.data.suggestions'

echo -e "\nTests completed!"

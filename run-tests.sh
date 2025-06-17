#!/bin/bash

# Test Script for Chat API Refactoring

echo "===================== CHAT API REFACTORING TEST SUITE ====================="
echo ""
echo "This script will run the test suite to validate the chat API refactoring."
echo ""

# Run Jest tests
echo "🧪 Running Jest unit tests for chat services..."
npx jest

# Check if Next.js server is running
echo ""
echo "🔄 Checking if Next.js server is running..."
SERVER_RUNNING=false

# Try to connect to localhost:3000
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Next.js server is running! Proceeding with API endpoint tests."
  SERVER_RUNNING=true
else
  echo "❌ Next.js server is not running. Skipping API endpoint tests."
  echo "   To run API endpoint tests, start the Next.js server with 'npm run dev' in another terminal."
fi

# Test API endpoints only if server is running
if [ "$SERVER_RUNNING" = true ]; then
  echo ""
  echo "🔄 Testing Chat API Endpoints..."
  echo "  -> Testing v1 endpoint (new service-oriented architecture)"
  node test-chat-api.js v1

  echo ""
  echo "  -> Testing backwards compatibility endpoint (legacy route)"
  node test-chat-api.js legacy
fi

echo ""
echo "✅ All tests complete. Check the output above for any failures."

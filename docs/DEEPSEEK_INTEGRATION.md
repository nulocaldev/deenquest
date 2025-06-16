# DeepSeek Integration Guide

## Overview
DeenQuest integrates with DeepSeek AI to provide intelligent Islamic guidance through chat and journal features. This integration uses the native DeepSeek API for optimal performance and cost-effectiveness.

## Features
- **Hikmah Chat**: AI-powered Islamic Q&A with contextual responses
- **AI Journal Prompts**: Dynamically generated Islamic reflection prompts
- **Intelligent Feedback**: AI analysis of journal reflections
- **Fallback Responses**: Graceful handling when AI service is unavailable
- **Error Recovery**: Robust error handling with user-friendly messages

## Setup

### 1. Get DeepSeek API Key
1. Visit [DeepSeek Open Platform](https://platform.deepseek.com/)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

### 3. Optional Configuration
You can customize the integration by setting additional environment variables:

```bash
# Custom API endpoint (if using a proxy)
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Request timeout in milliseconds
DEEPSEEK_TIMEOUT=30000

# Maximum tokens for AI responses
DEEPSEEK_MAX_TOKENS=1000

# Temperature for AI responses (0.0 - 1.0)
DEEPSEEK_TEMPERATURE=0.7
```

## Usage

### Chat Integration
The chat feature automatically uses DeepSeek AI when a user sends a message:

```typescript
// The chat component automatically calls /api/chat
// which uses our DeepSeek integration
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage })
});
```

### Journal Prompts
Journal prompts are generated using DeepSeek:

```typescript
// Fetch a new AI-generated Islamic reflection prompt
const response = await fetch('/api/journal/prompt');
const { prompt } = await response.json();
```

### Direct API Usage
You can also use the DeepSeek API directly:

```typescript
import { DeepSeekAPI } from '@/lib/deepseek';

const deepseek = new DeepSeekAPI({
  apiKey: 'your-api-key',
  temperature: 0.8,
  maxTokens: 500
});

const response = await deepseek.generateIslamicResponse(
  "What is the importance of prayer in Islam?",
  "User is asking about daily prayers"
);
```

## Error Handling

The integration includes comprehensive error handling:

- **Missing API Key**: Graceful fallback responses
- **Rate Limiting**: Automatic retry with exponential backoff
- **Network Issues**: Timeout handling and connection error recovery
- **Invalid Responses**: Validation and fallback content

## Best Practices

### 1. API Key Security
- Never commit your API key to version control
- Use environment variables for configuration
- Rotate your API keys regularly

### 2. Rate Limiting
- The integration handles rate limits automatically
- Consider implementing client-side throttling for high-traffic scenarios

### 3. Cost Management
- Monitor your API usage on the DeepSeek platform
- Set appropriate `max_tokens` limits
- Use temperature settings wisely

### 4. Error Recovery
- The app provides meaningful fallback responses
- Users can continue using the app even without AI features
- Error messages are user-friendly and Islamic-themed

## Troubleshooting

### Common Issues

1. **"DeepSeek API key is required"**
   - Ensure `DEEPSEEK_API_KEY` is set in your environment
   - Check that the key starts with `sk-`

2. **"Invalid DeepSeek API key"**
   - Verify your API key is correct
   - Check if the key has been revoked or expired

3. **"Rate limit exceeded"**
   - Wait a moment before retrying
   - Consider upgrading your DeepSeek plan

4. **"Request timeout"**
   - Check your internet connection
   - Consider increasing `DEEPSEEK_TIMEOUT`

### Development Mode
For development without an API key, the app will use fallback responses:

```typescript
// Example fallback response
"I'm currently having trouble connecting to my AI service. However, I'm here to help with Islamic guidance! Please feel free to ask your question, and I'll do my best to provide helpful insights based on Islamic teachings."
```

## API Endpoints

### POST /api/chat
Chat with Hikmah AI

**Request:**
```json
{
  "message": "What is the importance of prayer?",
  "context": "Previous conversation context (optional)"
}
```

**Response:**
```json
{
  "response": "AI-generated Islamic guidance",
  "isDeepSeek": true
}
```

### GET /api/journal/prompt
Get a new journal prompt

**Response:**
```json
{
  "prompt": "AI-generated reflection prompt",
  "isDeepSeek": true
}
```

### POST /api/journal/prompt
Get a topic-specific journal prompt

**Request:**
```json
{
  "topic": "patience"
}
```

**Response:**
```json
{
  "prompt": "AI-generated prompt about patience",
  "isDeepSeek": true
}
```

## Models Used
- **Primary**: `deepseek-chat` - General conversation model
- **Alternative**: `deepseek-coder` - For code-related Islamic questions (if needed)

## Compliance
The integration follows Islamic principles:
- Responses are based on authentic Islamic teachings
- Sources are provided when quoting Quran or Hadith
- Respectful of different Islamic interpretations
- Encourages spiritual growth and learning

## Support
For issues specific to DeepSeek integration:
1. Check the DeepSeek platform documentation
2. Verify your API key and usage limits
3. Review the error logs for specific error messages
4. Consider the troubleshooting section above

For general app issues, refer to the main README.md file.

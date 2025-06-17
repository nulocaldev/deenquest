# DeenQuest Chat API Documentation

This document describes the refactored Chat API for DeenQuest, following a service-oriented architecture with clear separation of concerns.

## API Endpoints

### Primary Endpoint

```
POST /api/chat
```

This is the main API endpoint for chat functionality. It uses the new service-oriented architecture while maintaining backward compatibility.

### Versioned Endpoint

```
POST /api/v1/chat
```

This is the versioned API endpoint that follows API versioning best practices. It has identical functionality to the primary endpoint.

## Request Format

The API accepts requests with the following structure:

```json
{
  "message": "User's message here",
  "context": "Optional context for the conversation",
  "conversationHistory": [
    { "role": "user", "content": "Previous user message" },
    { "role": "assistant", "content": "Previous assistant response" }
  ],
  "userId": "optional-user-id",
  "enableUnlocking": true
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| message | string | Yes | The user's message to be processed |
| context | string | No | Optional context to guide the AI response |
| conversationHistory | array | No | Array of previous messages in the conversation |
| userId | string | No | User identifier for personalization (defaults to "anonymous") |
| enableUnlocking | boolean | No | Whether to enable content unlocking features (defaults to true) |

## Response Format

The API returns responses with the following structure:

```json
{
  "success": true,
  "data": {
    "response": "The AI response text",
    "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
    "unlocks": [
      {
        "id": "content-id",
        "type": "content-type",
        "title": "Content Title",
        "description": "Content Description",
        "unlockedAt": "2025-06-17T12:00:00Z",
        "priority": "high"
      }
    ],
    "spiritualGuidance": {
      "quranReferences": ["Quran reference 1", "Quran reference 2"],
      "prayerReminders": ["Prayer reminder 1", "Prayer reminder 2"],
      "duaaSuggestions": ["Duaa suggestion 1", "Duaa suggestion 2"]
    },
    "conversationContext": {
      "userId": "user-id",
      "topics": ["topic1", "topic2"],
      "emotionalTone": "neutral",
      "knowledgeLevel": "beginner"
    }
  }
}
```

### Response Properties

| Property | Type | Description |
|----------|------|-------------|
| success | boolean | Indicates if the request was successful |
| data.response | string | The main AI response text |
| data.suggestions | array | Suggested follow-up questions or prompts |
| data.unlocks | array | Content items unlocked based on the conversation |
| data.spiritualGuidance | object | Spiritual guidance related to the conversation |
| data.conversationContext | object | Analyzed context of the conversation |

## Error Handling

The API returns error responses with the following structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Request validation failed |
| INTERNAL_SERVER_ERROR | Server-side error occurred |
| SERVICE_UNAVAILABLE | External service (e.g., AI) is unavailable |

## Architecture

The API follows a service-oriented architecture with clear separation of concerns:

1. **API Layer** (`src/app/api/chat/route.ts`): Handles HTTP requests/responses
2. **Service Layer**:
   - `src/services/chat/chatService.ts`: Business logic for chat functionality
   - `src/services/ai/deepseekService.ts`: AI service integration
   - `src/services/content/contentUnlockService.ts`: Content unlocking functionality
3. **Utility Layer**:
   - `src/utils/apiResponse.ts`: Standardized API response formatting
   - `src/utils/errorHandler.ts`: Centralized error handling
4. **Types Layer**:
   - `src/types/chat.ts`: Type definitions for chat functionality
   - `src/types/content.ts`: Type definitions for content unlocking

This architecture provides maintainability, testability, and scalability while ensuring a clear separation of concerns.

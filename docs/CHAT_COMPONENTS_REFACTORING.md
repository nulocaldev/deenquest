# Chat Components Refactoring Documentation

## Overview

This document outlines the refactored chat components for the DeenQuest application. The refactoring focused on implementing a clean, modular architecture with proper separation of concerns, type safety, and maintainability.

## Architecture

The chat feature follows a clean, layered architecture:

1. **API Layer**
   - `/src/app/api/v1/chat/route.ts`: Versioned API endpoint
   - `/src/app/api/chat/route.ts`: Main API endpoint with backward compatibility

2. **Service Layer**
   - `/src/services/chat/chatService.ts`: Business logic for chat
   - `/src/services/ai/deepseekService.ts`: DeepSeek AI integration
   - `/src/services/content/contentUnlockService.ts`: Content unlocking logic

3. **UI Layer**
   - `/src/components/chat/HikmahChat2.tsx`: Main chat component
   - `/src/components/chat/ui/ChatMessage.tsx`: Message display component
   - `/src/components/chat/ui/ChatInput.tsx`: Message input component
   - `/src/components/chat/ui/ChatSuggestions.tsx`: Chat suggestions component
   - `/src/components/chat/ui/UnlockedContentNotification.tsx`: Content unlock notifications

4. **Context Layer**
   - `/src/contexts/ChatContext.tsx`: State management and API interaction

5. **Types Layer**
   - `/src/types/chat.ts`: Chat-related type definitions
   - `/src/types/content.ts`: Content-related type definitions

6. **Utilities Layer**
   - `/src/utils/apiResponse.ts`: Standardized API responses
   - `/src/utils/errorHandler.ts`: Centralized error handling

## Component Structure

### HikmahChat2

The main chat component that:
- Wraps the chat interface with the ChatProvider
- Provides the overall layout and structure
- Handles theme and styling

### ChatContext

A React context that:
- Manages chat state (messages, suggestions, unlocked content)
- Handles API interactions
- Provides a clean interface for components to interact with the chat service

### ChatMessage

A reusable component for displaying:
- User messages
- AI assistant messages
- System messages
- Typing indicators
- Content unlock cards

### ChatSuggestions

A component for displaying clickable suggestions:
- Receives suggestions from the AI
- Handles suggestion selection

### ChatInput

A component for user input:
- Text input field
- Send button
- Attachment button (placeholder)
- Handles keyboard shortcuts

### UnlockedContentNotification

A component for displaying content unlocks:
- Shows newly unlocked content
- Displays content type, title, and priority

## Benefits of the Refactoring

1. **Maintainability**: Components are modular and have clear responsibilities
2. **Reusability**: Components can be reused in different parts of the application
3. **Testability**: Each component can be tested in isolation
4. **Separation of Concerns**: UI is separated from business logic and API interactions
5. **Type Safety**: Strong typing prevents many common errors
6. **Scalability**: New features can be added without changing existing code

## Usage

### Basic Usage

```tsx
import HikmahChat2 from '@/components/chat/HikmahChat2';

export default function ChatPage() {
  return <HikmahChat2 />;
}
```

### Advanced Usage with Custom User ID

```tsx
import HikmahChat2 from '@/components/chat/HikmahChat2';

export default function ChatPageWithUser() {
  const userId = 'user_123';
  return <HikmahChat2 userId={userId} />;
}
```

### Using Chat Context Directly

```tsx
import { useChat, ChatProvider } from '@/contexts/ChatContext';

function MyChatComponent() {
  const { messages, sendMessage } = useChat();
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello')}>Send</button>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <MyChatComponent />
    </ChatProvider>
  );
}
```

## Testing

The chat components include unit tests to ensure reliability:

- Service layer tests for `chatService.ts`
- Component tests for UI components

Run tests with:

```bash
npm test
```

Or with coverage:

```bash
npm run test:coverage
```

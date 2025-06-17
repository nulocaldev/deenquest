# DeenQuest

An elegant, AI-powered gamified Islamic learning companion featuring glass morphism design, aurora glows, and intelligent guidance through DeepSeek AI integration.

## ✨ Features

### 🎯 Core Features
- **Hikmah Cards**: Collectible Islamic wisdom cards with beautiful glass morphism design
- **AI-Powered Chat**: Intelligent Islamic guidance powered by DeepSeek AI with content unlocking
- **Smart Journal**: AI-generated reflection prompts and feedback
- **Interactive Games**: Engaging Islamic learning games
- **User Profiles**: Personalized learning experience

### 🤖 AI Integration (Service-Oriented Architecture)
- **DeepSeek AI**: Native integration with DeepSeek's powerful language models
- **Content Unlocking**: Dynamically unlocks Islamic wisdom content based on conversation topics
- **Spiritual Guidance**: Provides relevant spiritual guidance based on user conversations
- **Fallback Responses**: Graceful handling when AI service is unavailable
- **Conversation Analysis**: Analyzes user messages for topics, emotional tone, and knowledge level

### 🎨 Design System
- **Glass Morphism**: Elegant frosted glass card effects
- **Aurora Glows**: Subtle gradient border animations
- **Theme Support**: Comprehensive light/dark mode
- **Responsive Design**: Mobile-first, accessible interface
- **Modern UI**: Built with Tailwind CSS and shadcn/ui

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- DeepSeek API key (optional, has fallbacks)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/deenquest.git
   cd deenquest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your DeepSeek API key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧩 Main Components

### Chat API

The chat API provides:
- Basic chat functionality
- Advanced content unlocking
- Spiritual guidance
- Conversation analysis

Sample API request:
```javascript
fetch('/api/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: "Tell me about patience in Islam",
    conversationHistory: [/* previous messages */],
    userId: "user123",
    enableUnlocking: true
  })
})
```

### Dashboard Interface
The main dashboard is located at `/src/app/page.tsx` and features:
- Chat interface with DeepSeek AI integration
- Quick access to Hikmah Cards, Journal, Games, and Profile
- Progress tracking and goal setting
- Recent content unlocks display

## 🔄 Chat API & UI

The DeenQuest Chat functionality has been refactored to a modern, service-oriented architecture:

### Backend Architecture
- **Versioned API**: Clean `/api/v1/chat` endpoint with backward compatibility
- **Service Layer**: Separation of concerns with dedicated services
- **Type Safety**: Comprehensive TypeScript interfaces for all data models
- **Error Handling**: Unified error handling and response formatting
- **Testing**: Jest-based test suite for all services

### Frontend Architecture
- **Context-based State**: React Context for centralized state management
- **Modular Components**: Clean separation of UI concerns
- **Type Safety**: Full TypeScript support throughout
- **Responsive Design**: Mobile-first, accessible interface
- **Theme Integration**: Aurora/glassmorphism theming

### Key Files
- **API**: `/src/app/api/v1/chat/route.ts`
- **Services**: 
  - `/src/services/ai/deepseekService.ts`
  - `/src/services/chat/chatService.ts`
  - `/src/services/content/contentUnlockService.ts`
- **Frontend**:
  - `/src/contexts/ChatContext.tsx` 
  - `/src/components/chat/HikmahChat2.tsx`
  - `/src/components/chat/ui/*` (modular UI components)

### Testing
Run the test suite to validate the chat implementation:
```bash
./run-tests.sh
```

See the full implementation documentation in `/docs/CHAT_API_DOCUMENTATION.md` and `/docs/CHAT_COMPONENTS_REFACTORING.md`.

## 🏗️ Architecture

DeenQuest follows a clean, service-oriented architecture with proper separation of concerns:

### API Layer
- **Versioned API**: `/src/app/api/v1/chat/route.ts` - Main versioned chat API endpoint
- **Backward Compatibility**: `/src/app/api/chat/route.ts` - Maintains compatibility with existing clients

### Service Layer
- **Chat Service**: `/src/services/chat/chatService.ts` - Core chat business logic
- **DeepSeek Service**: `/src/services/ai/deepseekService.ts` - AI integration
- **Content Unlock Service**: `/src/services/content/contentUnlockService.ts` - Content unlocking logic

### UI Layer
- **Chat Components**: `/src/components/chat/HikmahChat2.tsx` - Main chat component
- **UI Components**: `/src/components/chat/ui/*` - Reusable UI components for messages, input, etc.

### Context Layer
- **Chat Context**: `/src/contexts/ChatContext.tsx` - State management and API interaction

### Types Layer
- **Chat Types**: `/src/types/chat.ts` - Type definitions for chat functionality
- **Content Types**: `/src/types/content.ts` - Type definitions for content unlocking

### Utilities Layer
- **API Response**: `/src/utils/apiResponse.ts` - Standardized API responses
- **Error Handler**: `/src/utils/errorHandler.ts` - Centralized error handling

## 📚 Content Unlocking System

The content unlocking system analyzes user messages and conversation history to provide relevant Islamic wisdom and guidance:

1. **Message Analysis**: Identifies topics, questions, emotional tone, and underlying spiritual themes
2. **Content Mapping**: Maps analyzed topics to relevant content in the database
3. **Spiritual Guidance**: Generates contextually appropriate spiritual guidance with Quranic references and duas
4. **UI Integration**: Displays unlocked content in the "Recently Unlocked Wisdom" section and guidance within chat messages
5. **User Progression**: Awards hikmah points for unlocked content to track spiritual growth

### Unlockable Content Types

- **Wisdom Cards**: Quranic verses, hadith, and scholarly wisdom with reflections
- **Journal Prompts**: Guided reflection questions for spiritual growth
- **Islamic Games**: Educational quizzes and interactive learning activities
- **Achievements**: Recognition for consistent engagement and knowledge acquisition

## 🔍 Conversation Analysis

The conversation analyzer (`/src/lib/conversation-analyzer.ts`) performs sophisticated analysis of user messages:

- **Topic Detection**: Identifies Islamic topics discussed (prayer, patience, gratitude, etc.)
- **Spiritual Theme Extraction**: Recognizes underlying spiritual themes (trust in Allah, mindfulness, etc.)
- **Emotional State Assessment**: Detects emotional states (seeking, troubled, grateful, etc.)
- **Knowledge Level Evaluation**: Assesses the user's knowledge level for adaptive responses
- **Engagement Scoring**: Measures user engagement to determine content unlock timing

## 🛠️ Testing

To test the hybrid API functionality:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run the dedicated Node.js test script:
   ```bash
   node test-hybrid-api.js
   ```

3. Test specific Islamic topics to trigger different content unlocks:
   - **Patience/Sabr**: "Tell me about patience in Islam" or "How can I be more patient?"
   - **Prayer/Salah**: "What's the importance of prayer?" or "Help me improve my salah"
   - **Gratitude/Shukr**: "How can I be more thankful to Allah?" or "Importance of gratitude"

## 📝 Architecture Documentation

For detailed information about the implementation and architecture:
- **Implementation Overview**: `/IMPLEMENTATION_SUMMARY.md`
- **Technical Details**: `/IMPLEMENTATION_SUMMARY_NEW.md`
- **Completion Status**: `/COMPLETION_SUMMARY.md`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### DeepSeek AI Setup
1. Get your API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Add to `.env.local`:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   ```

For detailed configuration options, see [DeepSeek Integration Guide](./docs/DEEPSEEK_INTEGRATION.md).

## 📱 Pages & Features

- **`/`** - Main dashboard with feature cards
- **`/cards`** - Hikmah card collection interface
- **`/chat`** - AI-powered Islamic Q&A chat
- **`/journal`** - Reflection prompts and journaling
- **`/games`** - Interactive Islamic learning games
- **`/profile`** - User profile and settings

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: shadcn/ui
- **AI Integration**: DeepSeek API (native)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 🎨 Design Philosophy

DeenQuest embraces modern web design principles:

- **Glass Morphism**: Elegant transparency effects
- **Aurora Gradients**: Subtle, animated color transitions  
- **Islamic Aesthetics**: Colors and patterns inspired by Islamic art
- **Accessibility**: WCAG 2.1 compliant design
- **Performance**: Optimized for fast loading and smooth interactions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DeepSeek AI** for providing powerful language models
- **Islamic Community** for guidance on authentic teachings
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for the utility-first styling system

## 🔗 Links

- [DeepSeek Platform](https://platform.deepseek.com/)
- [DeepSeek Integration Guide](./docs/DEEPSEEK_INTEGRATION.md)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Built with ❤️ for the Muslim community**

# DeenQuest

An elegant, AI-powered gamified Islamic learning companion featuring glass morphism design, aurora glows, and intelligent guidance through DeepSeek AI integration.

## ✨ Features

### 🎯 Core Features
- **Hikmah Cards**: Collectible Islamic wisdom cards with beautiful glass morphism design
- **AI-Powered Chat**: Intelligent Islamic guidance powered by DeepSeek AI
- **Smart Journal**: AI-generated reflection prompts and feedback
- **Interactive Games**: Engaging Islamic learning games
- **User Profiles**: Personalized learning experience

### 🎨 Design System
- **Glass Morphism**: Elegant frosted glass card effects
- **Aurora Glows**: Subtle gradient border animations
- **Theme Support**: Comprehensive light/dark mode
- **Responsive Design**: Mobile-first, accessible interface
- **Modern UI**: Built with Tailwind CSS and shadcn/ui

### 🤖 AI Integration
- **DeepSeek AI**: Native integration with DeepSeek's powerful language models
- **Islamic Context**: AI responses grounded in authentic Islamic teachings
- **Fallback Responses**: Graceful handling when AI service is unavailable
- **Smart Prompts**: Dynamic generation of meaningful reflection prompts

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

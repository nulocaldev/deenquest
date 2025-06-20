import { DeepSeekService, deepseekService as defaultDeepseekService } from '../ai/deepseekService';
import { getIslamicGuidancePrompt } from '../ai/systemPrompts';
import { contentUnlockService } from '../content/contentUnlockService';
import { ChatMessage, ChatRequest, ChatResponse, ConversationContext, SpiritualGuidance } from '@/types/chat';

/**
 * Chat service handles the business logic for chat functionality
 */
export class ChatService {
  private deepseekService: DeepSeekService;
  constructor(deepseekServiceInstance?: DeepSeekService) {
    this.deepseekService = deepseekServiceInstance || defaultDeepseekService;
  }

  /**
   * Process a chat request and generate a response
   */
  async processChat(request: ChatRequest): Promise<ChatResponse> {
    const { 
      message, 
      context, 
      conversationHistory = [], 
      userId = 'anonymous',
      enableUnlocking = true
    } = request;

    // Convert history to DeepSeek format
    const historyMessages = conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    // Add system message
    const systemMessage = {
      role: 'system' as const,
      content: getIslamicGuidancePrompt(context)
    };

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: message
    };

    // Get response from DeepSeek
    const rawContent = await this.deepseekService.generateIslamicResponse(message, context);
    // Trim and conditionally add greeting for first message
    const trimmedContent = rawContent.trim();
    const shouldGreet = !Array.isArray(conversationHistory) || conversationHistory.length === 0;
    const responseText = shouldGreet
      ? `As-salamu alaykum! ${trimmedContent}`
      : trimmedContent;

    // Process content unlocking if enabled
    let unlockData: any = null;
    if (enableUnlocking) {
      unlockData = await contentUnlockService.checkForUnlocks(userId, message, conversationHistory);
    }
    
    // Format the response - NO GREETING PREFIX (handled by the front-end for first message only)
    // This ensures we don't have duplicate greetings in the responses
    let chatResponse: ChatResponse = {
      response: responseText,
      suggestions: unlockData?.context?.topics ? 
        this.generatePersonalizedSuggestions(
          unlockData.context.topics, 
          unlockData.context.emotionalTone || 'neutral', 
          unlockData.context.knowledgeLevel || 'beginner'
        ) : [
          "Tell me more about this topic",
          "Can you provide a Quranic perspective?", 
          "What would the Prophet (PBUH) say about this?"
        ],
      isDeepSeek: true
    };
    
    // Add unlock data if available
    if (unlockData) {
      chatResponse = {
        ...chatResponse,
        unlocks: unlockData.unlocks,
        spiritualGuidance: unlockData.spiritualGuidance,
        conversationContext: unlockData.context
      };
    }
    
    return chatResponse;
  }
  
  // No longer using the greeting function as this is handled by the UI layer
  // The deepseekService is instructed not to add greetings via system prompts
  
  /**
   * Generate personalized suggestions based on conversation context
   */
  private generatePersonalizedSuggestions(
    topics: string[] = [], 
    emotionalTone: string = 'neutral', 
    knowledgeLevel: string = 'beginner'
  ): string[] {
    const suggestions: string[] = [];
    
    // Base suggestions that are always relevant
    const baseSuggestions = [
      "How can I learn more about this topic?",
      "What does the Quran say about this?",
      "Can you share a hadith related to this?"
    ];
    
    // Add topic-specific suggestions
    if (Array.isArray(topics) && (topics.includes('prayer') || topics.includes('salah'))) {
      suggestions.push("How can I improve my khushoo in prayer?");
      suggestions.push("What are common mistakes people make in salah?");
      if (knowledgeLevel === 'beginner') {
        suggestions.push("Can you explain the steps of wudu?");
      } else {
        suggestions.push("What are some sunnah prayers I can add to my routine?");
      }
    }
    
    if (Array.isArray(topics) && (topics.includes('patience') || topics.includes('sabr'))) {
      suggestions.push("Share a story about the Prophet's patience");
      suggestions.push("What duas can I recite when facing hardship?");
      if (emotionalTone === 'troubled') {
        suggestions.push("How can faith help me through difficult times?");
      }
    }
    
    if (Array.isArray(topics) && topics.includes('quran')) {
      suggestions.push("Which surah is recommended for daily recitation?");
      if (knowledgeLevel === 'advanced') {
        suggestions.push("Can you explain the concept of Asbab al-Nuzul?");
      } else {
        suggestions.push("What are some easy surahs to memorize?");
      }
    }
    
    if (Array.isArray(topics) && (topics.includes('gratitude') || topics.includes('shukr'))) {
      suggestions.push("How can I practice gratitude daily?");
      suggestions.push("What are the benefits of being grateful in Islam?");
    }
    
    // Add emotional tone-specific suggestions
    if (emotionalTone === 'seeking') {
      suggestions.push("I want to strengthen my faith, where should I start?");
      suggestions.push("How can I feel closer to Allah?");
    }
    
    if (emotionalTone === 'troubled') {
      suggestions.push("What does Islam teach about overcoming anxiety?");
      suggestions.push("How can I find peace in difficult times?");
    }
    
    if (emotionalTone === 'grateful') {
      suggestions.push("What are the best ways to express gratitude to Allah?");
      suggestions.push("How can I give back to others as a form of thankfulness?");
    }
    
    // If we have enough suggestions, return a subset; otherwise add base suggestions
    if (suggestions.length >= 3) {
      return suggestions.slice(0, 3); // Return up to 3 personalized suggestions
    } else {
      // Add base suggestions to fill up to 3 total
      return [...suggestions, ...baseSuggestions].slice(0, 3);
    }
  }
  
  /**
   * Generate fallback response when the AI service is unavailable
   */
  getFallbackResponse(userMessage: string): ChatResponse {
    const fallbackResponses = [
      "I'm having technical difficulties right now. The Prophet (peace be upon him) taught us that seeking knowledge is valuable, so please try your question again in a moment.",
      "My systems are temporarily offline. Remember that Allah is always near to those who seek guidance. Please try again shortly.",
      "I'm experiencing connectivity issues. With every hardship comes ease, as mentioned in the Quran. Please retry your question in a moment.",
      "My knowledge systems are temporarily unavailable, but Islamic guidance is always available through the Quran and Sunnah. Please try again shortly."
    ];
    const responseIndex = Math.abs(userMessage.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % fallbackResponses.length;
    const fallbackResponse = fallbackResponses[responseIndex];
    
    // Create simple analysis for fallback suggestions
    const mockAnalysis = this.createSimpleMockAnalysis(userMessage);
    const fallbackSuggestions = this.generatePersonalizedSuggestions(
      mockAnalysis.topics,
      mockAnalysis.emotionalIndicators[0] || 'neutral',
      mockAnalysis.complexityScore > 7 ? 'advanced' : 
      mockAnalysis.complexityScore > 4 ? 'intermediate' : 'beginner'
    );
    
    return {
      response: fallbackResponse,
      suggestions: fallbackSuggestions,
      isDeepSeek: false
    };
  }
  
  /**
   * Create a simple mock analysis when the conversation analyzer fails
   */
  private createSimpleMockAnalysis(message: string) {
    const lowerMessage = message.toLowerCase();
    
    // Extract potential topics
    const topics: string[] = [];
    
    if (lowerMessage.includes('prayer') || lowerMessage.includes('salah')) topics.push('prayer');
    if (lowerMessage.includes('patience') || lowerMessage.includes('sabr')) topics.push('patience');
    if (lowerMessage.includes('quran') || lowerMessage.includes('verse')) topics.push('quran');
    if (lowerMessage.includes('grateful') || lowerMessage.includes('thankful')) topics.push('gratitude');
    if (lowerMessage.includes('forgive') || lowerMessage.includes('mercy')) topics.push('forgiveness');
    
    // If no specific topics detected
    if (topics.length === 0) topics.push('general');
    
    // Detect potential emotional indicators
    const emotionalIndicators = [];
    
    if (/\b(help|need|guide|advice|lost|confused)\b/.test(lowerMessage)) emotionalIndicators.push('seeking');
    if (/\b(worry|difficult|hard|struggle|problem|stress|anxious)\b/.test(lowerMessage)) emotionalIndicators.push('troubled');
    if (/\b(thank|grateful|blessed|appreciate|fortunate|happy)\b/.test(lowerMessage)) emotionalIndicators.push('grateful');
    if (/\b(learn|understand|curious|interested|question)\b/.test(lowerMessage)) emotionalIndicators.push('curious');
    
    // Default emotional state if none detected
    if (emotionalIndicators.length === 0) emotionalIndicators.push('neutral');
    
    // Create basic analysis object
    return {
      topics,
      emotionalIndicators,
      complexityScore: 5,
      engagementScore: 7,
      wordCount: message.split(/\s+/).length,
    };
  }
  
  /**
   * Stream chat response in chunks
   */
  async *streamChatResponse(request: ChatRequest): AsyncGenerator<string> {
    const { message, context } = request;

    // Simulate streaming by splitting the response into chunks
    const fullResponse = await this.deepseekService.generateIslamicResponse(message, context);
    const chunks = fullResponse.match(/.{1,50}/g) || [];

    for (const chunk of chunks) {
      yield chunk;
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
    }
  }
}

// Export a singleton ChatService using the shared default service
export const chatService = new ChatService();

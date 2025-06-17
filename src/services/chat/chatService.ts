import { deepseekService } from '../ai/deepseekService';
import { contentUnlockService } from '../content/contentUnlockService';
import { ChatMessage, ChatRequest, ChatResponse, ConversationContext, SpiritualGuidance } from '@/types/chat';

/**
 * Chat service handles the business logic for chat functionality
 */
export class ChatService {
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

    // Get response from DeepSeek
    const response = await deepseekService.generateIslamicResponse(message, context);
    
    // Process content unlocking if enabled
    let unlockData: any = null;
    if (enableUnlocking) {
      unlockData = await contentUnlockService.checkForUnlocks(userId, message, conversationHistory);
    }
    
    // Format the response - NO GREETING PREFIX (handled by the front-end for first message only)
    let chatResponse: ChatResponse = {
      response: response.trim(),
      suggestions: unlockData?.context?.topics ? 
        this.generatePersonalizedSuggestions(
          unlockData.context.topics, 
          unlockData.context.emotionalTone || 'neutral', 
          unlockData.context.knowledgeLevel || 'beginner'
        ) : [
          "Tell me more about this topic",
          "Can you provide a Quranic perspective?", 
          "What would the Prophet (PBUH) say about this?"
        ]
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
}

// Export a singleton instance for convenience
export const chatService = new ChatService();

import { NextRequest } from 'next/server';
import { chatService } from '@/services/chat/chatService';
import { createSuccessResponse, createErrorResponse } from '@/utils/apiResponse';
import { handleApiError, ValidationError } from '@/utils/errorHandler';
import { ChatRequest, ChatMessage, ConversationContext } from '@/types/chat';

/**
 * Main chat API route handler
 * This has been refactored to use the service-oriented architecture
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const requestData: ChatRequest = await request.json();
    
    // Validate required fields
    if (!requestData.message) {
      throw new ValidationError('Message is required');
    }
    
    // Process the chat request
    try {
      const response = await chatService.processChat(requestData);
      return createSuccessResponse(response);
    } catch (chatError) {
      console.warn('Chat processing error, using fallback:', chatError);
      
      // Use fallback response if chat processing fails
      const fallbackResponse = chatService.getFallbackResponse(requestData.message);
      return createSuccessResponse(fallbackResponse);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

// Legacy code from the original implementation
// This is preserved for backward compatibility but should be gradually migrated
// to the service layer as part of the refactoring process

/**
 * Generate chat responses based on user input
 * @param message User's message
 * @param conversationHistory Previous messages in the conversation
 * @returns AI assistant response with optional unlocked content
 */
async function generateChatResponse(message: string, conversationHistory: ChatMessage[] = []) {
  if (!message) {
    return {
      response: "I didn't receive a message to respond to. How can I help you today?",
      suggestions: [
        "Can you tell me about Islam?",
        "What are the five pillars?",
        "How do I perform salah (prayer)?"
      ]
    };
  }

  try {
    // Clean and prepare the message
    const cleanedMessage = message.trim();
    
    // Process the message for insights
    let insights = await analyzeMessageForUnlocking(cleanedMessage, conversationHistory);
    
    // Determine if any content was unlocked
    const hasUnlocks = insights.unlocks && insights.unlocks.length > 0;
    
    // Prepare API request payload
    const apiPayload = {
      message: cleanedMessage,
      conversationHistory,
      systemPrompt: generateSystemPrompt(insights, hasUnlocks)
    };
    
    try {
      // Call DeepSeek AI API for response
      const aiResponse = await callDeepSeekAPI(apiPayload);
      
      // Process and format the AI response
      return {
        response: aiResponse.response,
        suggestions: generateSuggestions(cleanedMessage, aiResponse.response, insights),
        unlocks: insights.unlocks,
        spiritualGuidance: generateSpiritualGuidance(insights),
        conversationContext: insights.context,
        isDeepSeek: true
      };
    } catch (aiError) {
      console.error('DeepSeek API error:', aiError);
      
      // Fallback to simpler response generation
      const fallbackResponse = generateFallbackResponse(cleanedMessage);
      return {
        response: fallbackResponse,
        suggestions: generateSuggestions(cleanedMessage, fallbackResponse, insights),
        unlocks: insights.unlocks,
        spiritualGuidance: generateSpiritualGuidance(insights),
        conversationContext: insights.context,
        isDeepSeek: false
      };
    }
  } catch (error) {
    console.error('Error in chat generation:', error);
    return {
      response: "I'm having trouble processing your request right now. Please try again in a moment.",
      suggestions: [
        "Ask a simple question",
        "Try a different topic",
        "Tell me about your faith journey"
      ]
    };
  }
}

/**
 * Call the DeepSeek API to generate a response
 */
async function callDeepSeekAPI({ 
  message, 
  conversationHistory, 
  systemPrompt 
}: { 
  message: string; 
  conversationHistory: ChatMessage[]; 
  systemPrompt: string;
}) {
  // Implementation omitted for brevity - now handled by DeepSeek Service
  const { DeepSeekService } = await import('@/services/ai/deepseekService');
  // Import the type separately as TypeScript type imports aren't available at runtime
  type DeepSeekMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
  };
  
  const deepseekService = new DeepSeekService();
  
  // Convert to DeepSeekMessage format with proper typing
  const systemMessage: DeepSeekMessage = { role: 'system', content: systemPrompt };
  const userMessage: DeepSeekMessage = { role: 'user', content: message };
  
  // Filter and map conversation history to ensure valid roles
  const historyMessages: DeepSeekMessage[] = conversationHistory
    .filter(msg => ['user', 'assistant', 'system'].includes(msg.role))
    .map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));
  
  const allMessages: DeepSeekMessage[] = [systemMessage, ...historyMessages, userMessage];
  
  const responseContent = await deepseekService.chat(allMessages);
  
  return {
    response: responseContent
  };
}

/**
 * Generate a fallback response when AI services are unavailable
 */
function generateFallbackResponse(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword matching for basic responses
  if (lowerMessage.includes('salah') || lowerMessage.includes('prayer')) {
    return "Prayer (Salah) is one of the five pillars of Islam. Muslims pray five times daily: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer includes specific movements and recitations.";
  }
  
  if (lowerMessage.includes('quran') || lowerMessage.includes('read')) {
    return "The Quran is the holy book of Islam, believed to be the word of Allah as revealed to Prophet Muhammad ﷺ. It consists of 114 chapters (suras) and is a guide for humanity, covering spiritual, moral, social, and legal teachings.";
  }
  
  // Default response
  return "I understand you're asking about Islamic knowledge. While I'm experiencing some technical limitations at the moment, I'm here to assist with basic information. Could you please rephrase your question or ask about a specific aspect of Islam?";
}

/**
 * Generate system prompt based on conversation insights
 */
function generateSystemPrompt(
  insights: { topics: string[] }, 
  hasUnlocks: boolean
): string {
  // Implementation moved to systemPrompts.ts service
  const basePrompt = `You are Hikmah, an AI assistant focused on Islamic knowledge and guidance. Provide accurate, respectful information about Islam based on Quran and authentic Hadith. Be supportive, educational, and empathetic.`;
  
  let specialInstructions = '';
  
  // Add custom instructions based on insights
  if (insights.topics.includes('prayer') || insights.topics.includes('salah')) {
    specialInstructions += ' Include practical steps for prayer when relevant.';
  }
  
  if (insights.topics.includes('quran')) {
    specialInstructions += ' Reference specific Quranic verses when appropriate.';
  }
  
  // Add unlock-related instructions
  if (hasUnlocks) {
    specialInstructions += ' The user has shown dedication to learning. Provide more depth in your responses.';
  }
  
  return `${basePrompt}${specialInstructions}`;
}

/**
 * Generate personalized spiritual guidance based on conversation insights
 */
function generateSpiritualGuidance(
  insights: { topics?: string[] }
): {
  prayerReminders: string[];
  quranReferences: string[];
  hadithReferences: string[];
  duaaSuggestions: string[];
  spiritualPractices: string[];
  generalWisdom: string[];
} | null {
  // Generate guidance only if we have meaningful insights
  if (!insights || !insights.topics || insights.topics.length === 0) {
    return null;
  }
  
  // Initialize guidance object with explicitly typed arrays
  const guidance: {
    prayerReminders: string[];
    quranReferences: string[];
    hadithReferences: string[];
    duaaSuggestions: string[];
    spiritualPractices: string[];
    generalWisdom: string[];
  } = {
    prayerReminders: [],
    quranReferences: [],
    hadithReferences: [],
    duaaSuggestions: [],
    spiritualPractices: [],
    generalWisdom: []
  };
  
  // Basic recommendations based on topics
  const topics = insights.topics.map(t => t.toLowerCase());
  
  // Prayer-related guidance
  if (topics.includes('prayer') || topics.includes('salah')) {
    guidance.prayerReminders.push('Remember to maintain focus (khushu) in your prayers');
    guidance.spiritualPractices.push('Consider praying the Sunnah prayers along with obligatory ones');
    guidance.hadithReferences.push('The Prophet ﷺ said: "The first thing that the servant will be held accountable for on the Day of Judgment is prayer"');
  }
  
  // Quran-related guidance
  if (topics.includes('quran') || topics.includes('reading')) {
    guidance.quranReferences.push('Consider setting a daily Quran reading goal, even if it\'s just a few verses');
    guidance.spiritualPractices.push('Try to understand the meaning of what you recite');
    guidance.generalWisdom.push('The Prophet ﷺ said: "The best among you is the one who learns the Quran and teaches it"');
  }
  
  // Wisdom for everyone
  guidance.generalWisdom.push('Remember that consistency in small good deeds is better than occasional large ones');
  guidance.duaaSuggestions.push('Rabbi zidni ilma (My Lord, increase me in knowledge)');
  
  return guidance;
}

async function analyzeMessageForUnlocking(
  message: string,
  conversationHistory: ChatMessage[]
) {
  try {
    // Import the conversation analyzer and content unlock engine
    const { ConversationAnalyzer } = await import('@/lib/conversation-analyzer');
    const ContentUnlockEngine = await import('@/lib/content-unlock-engine').then(module => module.default);
    
    const analyzer = new ConversationAnalyzer();
    const unlockEngine = new ContentUnlockEngine();
    
    // Extract message content for analysis
    const userMessage = message.toLowerCase();
    const chatHistory = conversationHistory.map(msg => msg.content).join(' ').toLowerCase();
    
    // Attempt to perform conversation analysis
    let analysis;
    try {
      const context = {
        userId: 'dynamic-user',
        sessionId: 'current-session',
        topics: [],
        spiritualThemes: [],
        emotionalTone: 'neutral' as const,
        knowledgeLevel: 'beginner' as const,
        engagementLevel: 5,
        messageCount: conversationHistory.length + 1,
        sessionDuration: 0,
        lastInteraction: new Date(), // Ensure this is a Date object as required by analyzer
        unlockTriggers: []
      };

      analysis = await analyzer.analyzeMessage(userMessage, context);
    } catch (analyzerError) {
      console.error('Error in conversation analyzer:', analyzerError);
      analysis = createSimpleMockAnalysis(userMessage);
    }
    
    // Define default values for analysis in case any properties are missing
    const analysisWithDefaults = {
      topics: analysis?.topics || ['general'],
      spiritualThemes: analysis?.spiritualThemes || [],
      emotionalIndicators: analysis?.emotionalIndicators || ['neutral'],
      complexityScore: analysis?.complexityScore || 5,
      engagementScore: analysis?.engagementScore || 5,
      unlockTriggers: analysis?.unlockTriggers || []
    };
    
    // Build conversation context
    const context = {
      userId: 'dynamic-user',
      sessionId: 'current-session',
      topics: analysisWithDefaults.topics,
      spiritualThemes: analysisWithDefaults.spiritualThemes,
      emotionalTone: determineEmotionalTone(analysisWithDefaults.emotionalIndicators) as 'seeking' | 'reflective' | 'curious' | 'troubled' | 'grateful' | 'peaceful' | 'neutral',
      knowledgeLevel: determineKnowledgeLevel(analysisWithDefaults.complexityScore) as 'beginner' | 'intermediate' | 'advanced',
      engagementLevel: analysisWithDefaults.engagementScore,
      messageCount: conversationHistory.length + 1,
      sessionDuration: estimateSessionDuration(conversationHistory),
      lastInteraction: new Date(),
      unlockTriggers: analysisWithDefaults.unlockTriggers
    };
    
    // Check for content unlocks
    const unlocks = await unlockEngine.checkForUnlocks(
      'dynamic-user',  // Using userId directly instead of the analysis object
      context
    );
    
    return {
      topics: analysisWithDefaults.topics,
      unlocks,
      context
    };
  } catch (error) {
    console.error('Error in message analysis:', error);
    
    // Return minimal default analysis on error
    return {
      topics: ['general'],
      unlocks: [],
      context: {
        userId: 'dynamic-user',
        sessionId: 'current-session',
        topics: ['general'],
        spiritualThemes: [],
        emotionalTone: 'neutral',
        knowledgeLevel: 'beginner',
        engagementLevel: 5,
        messageCount: conversationHistory.length + 1,
        sessionDuration: 0,
        lastInteraction: new Date(),
        unlockTriggers: []
      }
    };
  }
}

/**
 * Create a simple mock analysis when the analyzer fails
 */
function createSimpleMockAnalysis(message: string) {
  const lowerMessage = message.toLowerCase();
  const topics = [];
  
  // Simple keyword matching
  if (lowerMessage.includes('prayer') || lowerMessage.includes('salah')) {
    topics.push('prayer');
  }
  
  if (lowerMessage.includes('quran') || lowerMessage.includes('read')) {
    topics.push('quran');
  }
  
  if (lowerMessage.includes('fasting') || lowerMessage.includes('ramadan')) {
    topics.push('fasting');
  }
  
  if (topics.length === 0) {
    topics.push('general');
  }
  
  return {
    topics,
    spiritualThemes: [],
    emotionalIndicators: ['neutral'],
    knowledgeIndicators: ['basic'],
    unlockTriggers: [],
    engagementScore: 5,
    complexityScore: 5,
    wordCount: lowerMessage.split(' ').length
  };
}

/**
 * Determine emotional tone from emotional indicators
 */
function determineEmotionalTone(emotionalIndicators: string[]): 'seeking' | 'reflective' | 'curious' | 'troubled' | 'grateful' | 'peaceful' | 'neutral' {
  if (!emotionalIndicators || emotionalIndicators.length === 0) {
    return 'neutral';
  }
  
  // Map common emotional indicators to tones
  const indicatorToTone: Record<string, 'seeking' | 'reflective' | 'curious' | 'troubled' | 'grateful' | 'peaceful' | 'neutral'> = {
    'confused': 'seeking',
    'questioning': 'seeking',
    'curious': 'curious',
    'interested': 'curious',
    'sad': 'troubled',
    'worried': 'troubled',
    'anxious': 'troubled',
    'thankful': 'grateful',
    'appreciative': 'grateful',
    'calm': 'peaceful',
    'content': 'peaceful'
  };
  
  // Check for matches
  for (const indicator of emotionalIndicators) {
    const lowerIndicator = indicator.toLowerCase();
    if (indicatorToTone[lowerIndicator]) {
      return indicatorToTone[lowerIndicator];
    }
  }
  
  return 'neutral';
}

/**
 * Determine knowledge level from complexity score
 */
function determineKnowledgeLevel(complexityScore: number): 'beginner' | 'intermediate' | 'advanced' {
  if (complexityScore >= 8) {
    return 'advanced';
  } else if (complexityScore >= 5) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}

/**
 * Estimate session duration from conversation history
 */
function estimateSessionDuration(conversationHistory: ChatMessage[]) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 0;
  }
  
  // If we have timestamps, use them
  if (conversationHistory[0].timestamp) {
    try {
      const firstMessageTime = new Date(conversationHistory[0].timestamp);
      const currentTime = new Date();
      
      // Calculate minutes
      return Math.max(1, Math.round((currentTime.getTime() - firstMessageTime.getTime()) / (1000 * 60)));
    } catch (e) {
      // Fall back to message count estimate if timestamp parsing fails
      console.error('Error parsing timestamps:', e);
    }
  }
  
  // Fallback: estimate based on message count (assume 1 minute per message)
  return conversationHistory.length;
}

/**
 * Generate contextual suggestions based on the conversation
 */
function generateSuggestions(
  userMessage: string, 
  aiResponse: string, 
  insights: { topics?: string[] }
): string[] {
  const defaultSuggestions = [
    "Tell me more about this topic",
    "How can I apply this knowledge?",
    "What does the Quran say about this?"
  ];
  
  // If we have topics from insights, use them to generate better suggestions
  if (insights && insights.topics && insights.topics.length > 0) {
    const topic = insights.topics[0].toLowerCase();
    
    if (topic === 'prayer' || topic === 'salah') {
      return [
        "How do I perform the prayer correctly?",
        "What are the times for the five daily prayers?",
        "What can invalidate my prayer?"
      ];
    }
    
    if (topic === 'quran') {
      return [
        "How can I improve my Quran recitation?",
        "What's the best way to understand the Quran?",
        "Can you suggest a Quran reading plan?"
      ];
    }
    
    if (topic === 'ramadan' || topic === 'fasting') {
      return [
        "What are the benefits of fasting?",
        "How do I make the most of Ramadan?",
        "What breaks the fast?"
      ];
    }
  }
  
  return defaultSuggestions;
}

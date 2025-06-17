/**
 * Types for the chat feature
 */

/**
 * Chat message interface
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

/**
 * Chat request interface for the API
 */
export interface ChatRequest {
  message: string;
  context?: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
  enableUnlocking?: boolean;
}

/**
 * Chat response interface from the API
 */
export interface ChatResponse {
  response: string;
  suggestions: string[];
  unlocks?: UnlockNotification[];
  spiritualGuidance?: SpiritualGuidance;
  conversationContext?: ConversationContext;
  isDeepSeek?: boolean;
}

/**
 * Notification for unlocked content
 */
export interface UnlockNotification {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: Date | string;
  priority: 'high' | 'medium' | 'low';
  details?: string;
}

/**
 * Spiritual guidance information
 */
export interface SpiritualGuidance {
  prayerReminders?: string[];
  quranReferences?: string[];
  hadithReferences?: string[];
  duaaSuggestions?: string[];
  spiritualPractices?: string[];
  generalWisdom?: string[];
}

/**
 * Conversation context
 */
export interface ConversationContext {
  userId: string;
  sessionId: string;
  topics: string[];
  spiritualThemes: string[];
  emotionalTone: 'neutral' | 'seeking' | 'troubled' | 'grateful' | 'curious' | 'peaceful';
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  engagementLevel: number;
  messageCount: number;
  sessionDuration: number;
  lastInteraction: Date | string;
  unlockTriggers: string[];
}

/**
 * Message interface for individual messages in the chat
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean; // Add optional isLoading property
}

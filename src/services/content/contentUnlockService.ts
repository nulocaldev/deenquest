import { ChatMessage, ConversationContext, SpiritualGuidance, UnlockNotification } from '@/types/chat';
import { ContentUnlockResult, UnlockableContent } from '@/types/content';

/**
 * Service for managing content unlocking based on conversation analysis
 */
export class ContentUnlockService {
  /**
   * Check for content unlocks based on user message and conversation history
   */
  async checkForUnlocks(
    userId: string,
    message: string,
    conversationHistory: ChatMessage[]
  ): Promise<{
    unlocks: UnlockNotification[];
    spiritualGuidance: SpiritualGuidance;
    context: ConversationContext;
  }> {
    try {
      // Analyze the message and conversation
      const analysis = await this.analyzeMessageForUnlocking(message, conversationHistory);
      
      // Build the conversation context
      const context: ConversationContext = {
        userId,
        sessionId: 'default',
        topics: analysis.topics || ['general'],
        spiritualThemes: analysis.spiritualThemes || [],
        emotionalTone: this.determineEmotionalTone(analysis.emotionalIndicators),
        knowledgeLevel: this.determineKnowledgeLevel(analysis.complexityScore),
        engagementLevel: analysis.engagementScore || 5,
        messageCount: conversationHistory.length + 1,
        sessionDuration: 0,
        lastInteraction: new Date(),
        unlockTriggers: analysis.unlockTriggers || []
      };
      
      // Format the unlocks
      const unlocks = this.formatUnlocks(analysis.contentResults || []);
      
      // Generate spiritual guidance
      const spiritualGuidance = this.generateSpiritualGuidance(
        context.topics,
        context.spiritualThemes,
        context.emotionalTone
      );
      
      return { unlocks, spiritualGuidance, context };
    } catch (error) {
      console.error('Content unlocking error:', error);
      
      // Return empty results if there's an error
      return {
        unlocks: [],
        spiritualGuidance: {},
        context: {
          userId,
          sessionId: 'default',
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
   * Analyze a message for potential content unlocking
   * This is a placeholder for the actual conversation analysis
   */
  private async analyzeMessageForUnlocking(
    message: string,
    conversationHistory: ChatMessage[]
  ) {
    // Simple keyword analysis as a placeholder
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
    const emotionalIndicators: string[] = [];
    
    if (/\\b(help|need|guide|advice|lost|confused)\\b/.test(lowerMessage)) emotionalIndicators.push('seeking');
    if (/\\b(worry|difficult|hard|struggle|problem|stress|anxious)\\b/.test(lowerMessage)) emotionalIndicators.push('troubled');
    if (/\\b(thank|grateful|blessed|appreciate|fortunate|happy)\\b/.test(lowerMessage)) emotionalIndicators.push('grateful');
    if (/\\b(learn|understand|curious|interested|question)\\b/.test(lowerMessage)) emotionalIndicators.push('curious');
    
    // Default emotional state if none detected
    if (emotionalIndicators.length === 0) emotionalIndicators.push('neutral');
    
    // Mock content results for unlocking
    const contentResults: ContentUnlockResult[] = [];
    
    // Add mock content unlocks based on detected topics
    if (topics.includes('patience')) {
      contentResults.push({
        unlocked: true,
        content: {
          id: 'patience-wisdom',
          content_type: 'wisdom_card',
          title: 'Patience in Hardship',
          description: 'Understanding Sabr in Islamic teachings',
          content_data: {},
          unlock_conditions: {},
          spiritual_themes: [],
          islamic_topics: [],
          difficulty_level: 1,
          unlock_priority: 8,
        },
        reason: 'Topic detected in conversation',
        priority: 8,
        recommendedTiming: 'immediate'
      });
    }
    
    return {
      topics,
      spiritualThemes: topics,
      emotionalIndicators,
      complexityScore: 5,
      engagementScore: 7,
      contentResults,
      unlockTriggers: topics
    };
  }
  
  /**
   * Format content unlock results into user-friendly notifications
   */
  private formatUnlocks(contentResults: ContentUnlockResult[]): UnlockNotification[] {
    return contentResults
      .filter(result => result?.unlocked)
      .map(result => ({
        id: result.content?.id || 'unknown',
        type: result.content?.content_type || 'wisdom_card',
        title: result.content?.title || 'Islamic Wisdom',
        description: result.content?.description || '',
        unlockedAt: new Date(),
        priority: result.priority > 8 ? 'high' : result.priority > 4 ? 'medium' : 'low',
        details: result.reason
      }));
  }
  
  /**
   * Determine the emotional tone based on indicators
   */
  private determineEmotionalTone(
    emotionalIndicators: string[] = []
  ): ConversationContext['emotionalTone'] {
    if (emotionalIndicators.includes('seeking')) return 'seeking';
    if (emotionalIndicators.includes('troubled')) return 'troubled';
    if (emotionalIndicators.includes('grateful')) return 'grateful';
    if (emotionalIndicators.includes('curious')) return 'curious';
    if (emotionalIndicators.includes('peaceful')) return 'peaceful';
    return 'neutral';
  }
  
  /**
   * Determine knowledge level based on complexity score
   */
  private determineKnowledgeLevel(
    complexityScore: number = 5
  ): ConversationContext['knowledgeLevel'] {
    if (complexityScore > 7) return 'advanced';
    if (complexityScore > 4) return 'intermediate';
    return 'beginner';
  }
  
  /**
   * Generate spiritual guidance based on topics and themes
   */
  private generateSpiritualGuidance(
    topics: string[] = [],
    themes: string[] = [],
    emotionalTone: string = 'neutral'
  ): SpiritualGuidance {
    const guidance: SpiritualGuidance = {};
    
    // Add Quranic references based on topics
    if (topics.includes('patience')) {
      guidance.quranReferences = [
        'And seek help through patience and prayer. Indeed, it is difficult except for the humbly submissive (Quran 2:45)',
        'And be patient, for indeed, Allah does not allow to be lost the reward of those who do good (Quran 11:115)',
      ];
    }
    
    if (topics.includes('gratitude')) {
      guidance.quranReferences = [
        'And [remember] when your Lord proclaimed, "If you are grateful, I will surely increase you [in favor]" (Quran 14:7)',
        'So remember Me; I will remember you. And be grateful to Me and do not deny Me (Quran 2:152)'
      ];
    }
    
    if (topics.includes('prayer') || topics.includes('salah')) {
      guidance.prayerReminders = [
        'Remember that prayer is the pillar of our faith and a direct connection to Allah',
        'The Prophet (PBUH) said: "The comfort of my eyes lies in prayer"'
      ];
    }
    
    // Add dua suggestions based on emotional tone
    if (emotionalTone === 'troubled') {
      guidance.duaaSuggestions = [
        'Rabbi inni massaniya ad-durru wa anta arhamur rahimeen (My Lord, indeed adversity has touched me, and You are the Most Merciful)',
        'Hasbunallahu wa ni\'mal wakeel (Sufficient for us is Allah, and [He is] the best Disposer of affairs)'
      ];
    }
    
    if (emotionalTone === 'seeking') {
      guidance.duaaSuggestions = [
        'Rabbi zidni ilma (My Lord, increase me in knowledge)',
        'Allahumma inni as\'aluka ilman nafi\'an (O Allah, I ask You for beneficial knowledge)'
      ];
    }
    
    // If no specific guidance was generated, provide general wisdom
    if (Object.keys(guidance).length === 0) {
      guidance.generalWisdom = [
        'Remember that every moment is an opportunity to draw closer to Allah through remembrance and good deeds'
      ];
    }
    
    return guidance;
  }
}

// Export a singleton instance for convenience
export const contentUnlockService = new ContentUnlockService();

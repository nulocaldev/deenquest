// DeenQuest Content Unlocking Engine
// Phase 1: Progressive content unlocking based on conversation analysis

import { ConversationContext, UnlockableContent, UnlockCondition } from './conversation-analyzer';

export interface ContentUnlockResult {
  unlocked: boolean;
  content?: UnlockableContent;
  reason?: string;
  priority: number;
  recommendedTiming: 'immediate' | 'after_response' | 'session_end' | 'next_session';
}

export interface UnlockNotification {
  id: string;
  type: 'wisdom_card' | 'game' | 'journal_prompt' | 'achievement';
  title: string;
  description: string;
  content: any;
  unlockedAt: Date;
  priority: 'low' | 'medium' | 'high';
  celebrationLevel: 'subtle' | 'moderate' | 'celebration';
}

// Core content unlocking engine
export class ContentUnlockEngine {
  private unlockedContentCache = new Map<string, Set<string>>();
  private contentDatabase: UnlockableContent[] = [];

  constructor() {
    this.initializeContentDatabase();
  }

  private initializeContentDatabase() {
    // This would typically load from database, but initializing with sample data
    this.contentDatabase = [
      // Wisdom Cards
      {
        id: 'patience-hardship-card',
        content_type: 'wisdom_card',
        title: 'Finding Patience in Hardship',
        description: 'Discover how Islamic teachings guide us through difficult times',
        content_data: {
          quote: "And give good tidings to the patient, Who, when disaster strikes them, say, 'Indeed we belong to Allah, and indeed to Him we will return.'",
          reference: 'Quran 2:155-156',
          reflection: 'True patience (sabr) is not just enduring hardship, but trusting in Allah\'s wisdom and maintaining hope.',
          arabic: 'وَبَشِّرِ الصَّابِرِينَ',
          theme: 'patience',
          actionItems: [
            'Take a moment to make dua when facing difficulty',
            'Remember that trials are tests that can strengthen our faith',
            'Seek comfort in prayer and remembrance of Allah'
          ]
        },
        unlock_conditions: {
          topics_required: ['hardship', 'difficulty', 'struggle', 'trials'],
          themes_required: ['patience', 'trust_in_allah'],
          engagement_threshold: 6,
          emotional_states: ['troubled', 'seeking'],
          conversation_count_min: 1
        },
        spiritual_themes: ['patience', 'trust_in_allah', 'hardship'],
        islamic_topics: ['sabr', 'tawakkul', 'trials'],
        difficulty_level: 2,
        unlock_priority: 10
      },
      {
        id: 'gratitude-blessings-card',
        content_type: 'wisdom_card',
        title: 'The Heart of Gratitude',
        description: 'Understanding gratitude as a path to contentment and closeness to Allah',
        content_data: {
          quote: 'If you are grateful, I will certainly give you more.',
          reference: 'Quran 14:7',
          reflection: 'Gratitude (shukr) transforms our perspective and opens our hearts to recognize Allah\'s countless blessings.',
          arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
          theme: 'gratitude',
          actionItems: [
            'List three blessings you experienced today',
            'Say "Alhamdulillahi Rabbil Alameen" with conscious appreciation',
            'Share a blessing with someone to spread gratitude'
          ]
        },
        unlock_conditions: {
          topics_required: ['gratitude', 'blessings', 'thankful', 'appreciate'],
          themes_required: ['gratitude', 'contentment'],
          engagement_threshold: 4,
          emotional_states: ['grateful', 'peaceful'],
          conversation_count_min: 1
        },
        spiritual_themes: ['gratitude', 'contentment', 'mindfulness'],
        islamic_topics: ['shukr', 'barakah', 'contentment'],
        difficulty_level: 1,
        unlock_priority: 5
      },

      // Games
      {
        id: 'prayer-times-quiz',
        content_type: 'game',
        title: 'Prayer Times & Practices Quiz',
        description: 'Test your knowledge of Islamic prayer times and practices',
        content_data: {
          type: 'quiz',
          difficulty: 'beginner',
          questions: [
            {
              question: 'How many obligatory prayers are there in a day?',
              options: ['3', '4', '5', '6'],
              correct: 2,
              explanation: 'There are five daily obligatory prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.'
            },
            {
              question: 'Which prayer is performed just after sunset?',
              options: ['Asr', 'Maghrib', 'Isha', 'Fajr'],
              correct: 1,
              explanation: 'Maghrib prayer is performed just after sunset, marking the end of the day.'
            },
            {
              question: 'What is the Arabic word for prayer?',
              options: ['Dhikr', 'Dua', 'Salah', 'Salam'],
              correct: 2,
              explanation: 'Salah is the Arabic word for the formal Islamic prayer performed five times daily.'
            }
          ],
          points_per_question: 10,
          bonus_for_perfect: 25
        },
        unlock_conditions: {
          topics_required: ['prayer', 'salah', 'worship'],
          themes_required: ['daily_practice', 'worship'],
          engagement_threshold: 5,
          knowledge_level: 'beginner',
          conversation_count_min: 2
        },
        spiritual_themes: ['daily_practice', 'worship', 'knowledge'],
        islamic_topics: ['salah', 'prayer_times', 'worship'],
        difficulty_level: 1,
        unlock_priority: 15
      },
      {
        id: 'quran-verses-game',
        content_type: 'game',
        title: 'Quranic Verses Matching',
        description: 'Match beautiful Quranic verses with their themes and meanings',
        content_data: {
          type: 'matching',
          difficulty: 'intermediate',
          pairs: [
            {
              verse: 'And it is He who created the heavens and earth in truth. And the day He says, "Be," and it is, His word is the truth.',
              reference: 'Quran 6:73',
              theme: 'Divine Power',
              meaning: 'Allah\'s absolute power to create and command'
            },
            {
              verse: 'And whoever relies upon Allah - then He is sufficient for him.',
              reference: 'Quran 65:3',
              theme: 'Trust in Allah',
              meaning: 'Complete reliance on Allah brings sufficiency'
            }
          ],
          scoring: {
            perfect_match: 15,
            partial_match: 5,
            bonus_for_all: 30
          }
        },
        unlock_conditions: {
          topics_required: ['quran', 'verses', 'ayah'],
          themes_required: ['knowledge', 'spiritual_growth'],
          engagement_threshold: 7,
          knowledge_level: 'intermediate',
          conversation_count_min: 3
        },
        spiritual_themes: ['knowledge', 'spiritual_growth', 'quran'],
        islamic_topics: ['quran', 'ayah', 'tafseer'],
        difficulty_level: 3,
        unlock_priority: 20
      },

      // Journal Prompts
      {
        id: 'daily-blessings-reflection',
        content_type: 'journal_prompt',
        title: 'Reflecting on Daily Blessings',
        description: 'A guided reflection on recognizing Allah\'s blessings in your daily life',
        content_data: {
          prompt: 'Take a moment to reflect on your day and identify three specific blessings you experienced. How did each blessing make you feel closer to Allah?',
          follow_up_questions: [
            'What blessing surprised you today that you might normally take for granted?',
            'How can you show gratitude for these blessings in your actions tomorrow?',
            'What would you like to ask Allah for in terms of guidance or support?',
            'How has recognizing these blessings changed your mood or perspective?'
          ],
          reflection_time: 10,
          spiritual_focus: 'gratitude and mindfulness',
          suggested_duas: [
            'Alhamdulillahi Rabbil Alameen (All praise belongs to Allah, Lord of all the worlds)',
            'Rabbana atina fi\'d-dunya hasanatan wa fi\'l-akhirati hasanatan wa qina adhab an-nar'
          ]
        },
        unlock_conditions: {
          topics_required: ['gratitude', 'blessings', 'reflection'],
          themes_required: ['gratitude', 'daily_reflection'],
          engagement_threshold: 5,
          emotional_states: ['grateful', 'reflective'],
          conversation_count_min: 2
        },
        spiritual_themes: ['gratitude', 'daily_reflection', 'mindfulness'],
        islamic_topics: ['shukr', 'reflection', 'daily_practice'],
        difficulty_level: 1,
        unlock_priority: 8
      },
      {
        id: 'overcoming-challenges-journal',
        content_type: 'journal_prompt',
        title: 'Finding Strength in Challenges',
        description: 'Explore how Islamic principles can help you navigate life\'s difficulties',
        content_data: {
          prompt: 'Think about a current challenge you\'re facing. How might Islamic teachings and principles help you approach this situation with wisdom and patience?',
          follow_up_questions: [
            'What Islamic concept or teaching resonates most with your current situation?',
            'How can you practice sabr (patience) in dealing with this challenge?',
            'What specific duas or prayers might support you through this difficulty?',
            'What lessons might Allah be teaching you through this experience?',
            'How can you maintain hope and trust in Allah\'s plan?'
          ],
          reflection_time: 15,
          spiritual_focus: 'patience, trust, and spiritual resilience',
          suggested_duas: [
            'Hasbunallahu wa ni\'mal wakeel (Allah is sufficient for us and He is the best disposer of affairs)',
            'Rabbi ishurni shukra ni\'matika (My Lord, enable me to be grateful for Your favor)'
          ]
        },
        unlock_conditions: {
          topics_required: ['challenge', 'difficulty', 'struggle', 'help'],
          themes_required: ['patience', 'trust_in_allah'],
          engagement_threshold: 7,
          emotional_states: ['troubled', 'seeking'],
          conversation_count_min: 3
        },
        spiritual_themes: ['patience', 'trust_in_allah', 'spiritual_growth'],
        islamic_topics: ['sabr', 'tawakkul', 'dua'],
        difficulty_level: 2,
        unlock_priority: 12
      },

      // Achievements
      {
        id: 'thoughtful-seeker',
        content_type: 'achievement',
        title: 'Thoughtful Seeker',
        description: 'Asked deep, meaningful questions about Islamic concepts',
        content_data: {
          badge_icon: 'brain',
          badge_color: 'purple',
          badge_gradient: 'from-purple-400 to-pink-400',
          points: 100,
          description: 'Your curiosity and thoughtful questions demonstrate a sincere desire to understand Islam deeply.',
          celebration_message: 'MashAllah! Your thoughtful questions show the heart of a true seeker of knowledge.',
          unlocked_benefits: [
            'Access to advanced Islamic discussion topics',
            'Personalized learning path recommendations',
            'Priority access to new wisdom cards'
          ]
        },
        unlock_conditions: {
          topics_required: ['questions', 'understanding', 'learning'],
          engagement_threshold: 8,
          conversation_count_min: 5,
          emotional_states: ['curious', 'seeking']
        },
        spiritual_themes: ['knowledge_seeking', 'curiosity', 'spiritual_growth'],
        islamic_topics: ['ilm', 'learning', 'questions'],
        difficulty_level: 2,
        unlock_priority: 25
      },
      {
        id: 'grateful-heart',
        content_type: 'achievement',
        title: 'Grateful Heart',
        description: 'Consistently expressed gratitude and appreciation in conversations',
        content_data: {
          badge_icon: 'heart',
          badge_color: 'pink',
          badge_gradient: 'from-pink-400 to-rose-400',
          points: 150,
          description: 'Your grateful heart reflects the beautiful character that Islam encourages us to develop.',
          celebration_message: 'SubhanAllah! Your gratitude illuminates your conversations with light and positivity.',
          unlocked_benefits: [
            'Access to advanced gratitude practices',
            'Special gratitude-themed journal prompts',
            'Community recognition for positive spirit'
          ]
        },
        unlock_conditions: {
          themes_required: ['gratitude', 'contentment'],
          emotional_states: ['grateful', 'peaceful'],
          conversation_count_min: 7,
          engagement_threshold: 6
        },
        spiritual_themes: ['gratitude', 'character_building', 'contentment'],
        islamic_topics: ['shukr', 'akhlaq', 'character'],
        difficulty_level: 1,
        unlock_priority: 18
      }
    ];
  }

  // Main method to check for content unlocks
  async checkForUnlocks(
    userId: string,
    conversationContext: ConversationContext
  ): Promise<ContentUnlockResult[]> {
    const results: ContentUnlockResult[] = [];
    
    // Get user's already unlocked content
    const unlockedContent = this.unlockedContentCache.get(userId) || new Set();
    
    // Check each piece of content for unlock eligibility
    for (const content of this.contentDatabase) {
      if (unlockedContent.has(content.id)) {
        continue; // Already unlocked
      }
      
      const unlockResult = await this.evaluateUnlockConditions(
        content,
        conversationContext,
        userId
      );
      
      if (unlockResult.unlocked) {
        // Mark as unlocked
        if (!this.unlockedContentCache.has(userId)) {
          this.unlockedContentCache.set(userId, new Set());
        }
        this.unlockedContentCache.get(userId)!.add(content.id);
        
        results.push(unlockResult);
      }
    }
    
    // Sort by priority (lower number = higher priority)
    return results.sort((a, b) => (a.priority || 100) - (b.priority || 100));
  }

  // Evaluate if content meets unlock conditions
  private async evaluateUnlockConditions(
    content: UnlockableContent,
    context: ConversationContext,
    userId: string
  ): Promise<ContentUnlockResult> {
    const conditions = content.unlock_conditions;
    let score = 0;
    let maxScore = 0;
    const reasons: string[] = [];

    // Check topic requirements
    if (conditions.topics_required && conditions.topics_required.length > 0) {
      maxScore += 30;
      const topicMatches = conditions.topics_required.filter(topic =>
        context.topics.some(contextTopic => 
          contextTopic.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(contextTopic.toLowerCase())
        )
      );
      
      if (topicMatches.length > 0) {
        const topicScore = (topicMatches.length / conditions.topics_required.length) * 30;
        score += topicScore;
        reasons.push(`Discussed relevant topics: ${topicMatches.join(', ')}`);
      }
    }

    // Check spiritual theme requirements
    if (conditions.themes_required && conditions.themes_required.length > 0) {
      maxScore += 25;
      const themeMatches = conditions.themes_required.filter(theme =>
        context.spiritualThemes.includes(theme)
      );
      
      if (themeMatches.length > 0) {
        const themeScore = (themeMatches.length / conditions.themes_required.length) * 25;
        score += themeScore;
        reasons.push(`Explored spiritual themes: ${themeMatches.join(', ')}`);
      }
    }

    // Check engagement threshold
    if (conditions.engagement_threshold) {
      maxScore += 20;
      if (context.engagementLevel >= conditions.engagement_threshold) {
        score += 20;
        reasons.push(`High engagement level: ${context.engagementLevel}/10`);
      }
    }

    // Check conversation count
    if (conditions.conversation_count_min) {
      maxScore += 10;
      if (context.messageCount >= conditions.conversation_count_min) {
        score += 10;
        reasons.push(`Sufficient conversation depth: ${context.messageCount} messages`);
      }
    }

    // Check emotional states
    if (conditions.emotional_states && conditions.emotional_states.length > 0) {
      maxScore += 15;
      if (conditions.emotional_states.includes(context.emotionalTone)) {
        score += 15;
        reasons.push(`Emotional state match: ${context.emotionalTone}`);
      }
    }

    // Check knowledge level
    if (conditions.knowledge_level && conditions.knowledge_level !== 'any') {
      maxScore += 10;
      if (this.knowledgeLevelMatches(conditions.knowledge_level, context.knowledgeLevel)) {
        score += 10;
        reasons.push(`Knowledge level appropriate: ${context.knowledgeLevel}`);
      }
    }

    // Calculate unlock probability
    const unlockThreshold = maxScore * 0.6; // Need 60% match
    const unlocked = score >= unlockThreshold;

    return {
      unlocked,
      content: unlocked ? content : undefined,
      reason: unlocked ? reasons.join('; ') : `Insufficient match (${score}/${maxScore})`,
      priority: content.unlock_priority,
      recommendedTiming: this.determineUnlockTiming(content, context)
    };
  }

  private knowledgeLevelMatches(required: string, actual: string): boolean {
    const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const requiredLevel = levels[required as keyof typeof levels] || 1;
    const actualLevel = levels[actual as keyof typeof levels] || 1;
    
    // Allow for some flexibility - can unlock content one level above current
    return actualLevel >= requiredLevel - 1;
  }

  private determineUnlockTiming(
    content: UnlockableContent,
    context: ConversationContext
  ): ContentUnlockResult['recommendedTiming'] {
    // High priority achievements should be immediate
    if (content.content_type === 'achievement' && content.unlock_priority <= 20) {
      return 'immediate';
    }
    
    // Wisdom cards and journal prompts can wait until after response
    if (content.content_type === 'wisdom_card' || content.content_type === 'journal_prompt') {
      return 'after_response';
    }
    
    // Games are better introduced at session end
    if (content.content_type === 'game') {
      return 'session_end';
    }
    
    return 'after_response';
  }

  // Create user-friendly unlock notifications
  createUnlockNotifications(unlockResults: ContentUnlockResult[]): UnlockNotification[] {
    return unlockResults
      .filter(result => result.unlocked && result.content)
      .map(result => {
        const content = result.content!;
        
        return {
          id: content.id,
          type: content.content_type,
          title: content.title,
          description: content.description,
          content: content.content_data,
          unlockedAt: new Date(),
          priority: this.getPriorityLevel(content.unlock_priority),
          celebrationLevel: this.getCelebrationLevel(content.content_type, content.unlock_priority)
        };
      });
  }

  private getPriorityLevel(priority: number): 'low' | 'medium' | 'high' {
    if (priority <= 10) return 'high';
    if (priority <= 25) return 'medium';
    return 'low';
  }

  private getCelebrationLevel(
    type: UnlockableContent['content_type'],
    priority: number
  ): 'subtle' | 'moderate' | 'celebration' {
    if (type === 'achievement') return 'celebration';
    if (priority <= 15) return 'moderate';
    return 'subtle';
  }

  // Get personalized content recommendations
  async getPersonalizedRecommendations(
    userId: string,
    context: ConversationContext,
    limit: number = 3
  ): Promise<UnlockableContent[]> {
    const unlockedContent = this.unlockedContentCache.get(userId) || new Set();
    
    const availableContent = this.contentDatabase
      .filter(content => !unlockedContent.has(content.id))
      .map(content => ({
        content,
        relevanceScore: this.calculateRelevanceScore(content, context)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(item => item.content);
    
    return availableContent;
  }

  private calculateRelevanceScore(
    content: UnlockableContent,
    context: ConversationContext
  ): number {
    let score = 0;
    
    // Topic relevance
    const topicMatches = content.islamic_topics.filter(topic =>
      context.topics.some(contextTopic => 
        contextTopic.toLowerCase().includes(topic.toLowerCase())
      )
    );
    score += topicMatches.length * 10;
    
    // Theme relevance
    const themeMatches = content.spiritual_themes.filter(theme =>
      context.spiritualThemes.includes(theme)
    );
    score += themeMatches.length * 15;
    
    // Knowledge level appropriateness
    if (this.knowledgeLevelMatches(
      content.unlock_conditions.knowledge_level || 'any',
      context.knowledgeLevel
    )) {
      score += 20;
    }
    
    // Priority boost
    score += Math.max(0, 50 - content.unlock_priority);
    
    return score;
  }

  // Method to manually trigger content unlock (for testing/admin)
  async forceUnlock(
    userId: string,
    contentId: string,
    reason: string = 'Manual unlock'
  ): Promise<UnlockNotification | null> {
    const content = this.contentDatabase.find(c => c.id === contentId);
    if (!content) return null;
    
    if (!this.unlockedContentCache.has(userId)) {
      this.unlockedContentCache.set(userId, new Set());
    }
    this.unlockedContentCache.get(userId)!.add(contentId);
    
    return {
      id: content.id,
      type: content.content_type,
      title: content.title,
      description: content.description,
      content: content.content_data,
      unlockedAt: new Date(),
      priority: 'high',
      celebrationLevel: 'moderate'
    };
  }
}

export default ContentUnlockEngine;

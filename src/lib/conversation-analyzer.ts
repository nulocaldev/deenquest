// DeenQuest Conversation Analysis Engine
// Phase 1: Foundation - Real-time conversation analysis and topic extraction

export interface ConversationContext {
  userId: string;
  sessionId: string;
  topics: string[];
  spiritualThemes: string[];
  emotionalTone: 'seeking' | 'reflective' | 'curious' | 'troubled' | 'grateful' | 'peaceful' | 'neutral';
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  engagementLevel: number; // 1-10
  messageCount: number;
  sessionDuration: number; // minutes
  lastInteraction: Date;
  unlockTriggers: string[];
}

export interface ConversationAnalysis {
  topics: string[];
  spiritualThemes: string[];
  emotionalIndicators: string[];
  knowledgeIndicators: string[];
  unlockTriggers: string[];
  engagementScore: number;
  complexityScore: number;
  wordCount: number;
}

export interface UnlockCondition {
  topics_required?: string[];
  themes_required?: string[];
  engagement_threshold?: number;
  conversation_count_min?: number;
  emotional_states?: string[];
  knowledge_level?: string;
  time_requirements?: Record<string, any>;
  prerequisite_unlocks?: string[];
}

export interface UnlockableContent {
  id: string;
  content_type: 'wisdom_card' | 'game' | 'journal_prompt' | 'achievement';
  title: string;
  description: string;
  content_data: Record<string, any>;
  unlock_conditions: UnlockCondition;
  spiritual_themes: string[];
  islamic_topics: string[];
  difficulty_level: number;
  unlock_priority: number;
}

// Core conversation analysis class
export class ConversationAnalyzer {
  private islamicTopics: Map<string, string[]>;
  private spiritualThemes: Map<string, string[]>;
  private emotionalIndicators: Map<string, string[]>;
  private knowledgeIndicators: Map<string, number>;

  constructor() {
    this.initializeAnalysisData();
  }

  private initializeAnalysisData() {
    // Islamic topics and their related keywords
    this.islamicTopics = new Map([
      ['prayer', ['salah', 'prayer', 'namaz', 'worship', 'dua', 'supplication', 'fajr', 'maghrib', 'isha', 'zuhr', 'asr']],
      ['quran', ['quran', 'koran', 'ayah', 'verse', 'surah', 'chapter', 'recitation', 'tajweed', 'tafseer']],
      ['prophet', ['prophet', 'muhammad', 'messenger', 'sunnah', 'hadith', 'example', 'pbuh', 'rasul']],
      ['patience', ['patience', 'sabr', 'endurance', 'perseverance', 'steadfast', 'trials', 'hardship']],
      ['gratitude', ['gratitude', 'thankful', 'grateful', 'shukr', 'blessing', 'alhamdulillah', 'appreciate']],
      ['forgiveness', ['forgiveness', 'mercy', 'rahma', 'compassion', 'pardon', 'overlook', 'maghfira']],
      ['knowledge', ['knowledge', 'ilm', 'learning', 'education', 'wisdom', 'understanding', 'study']],
      ['charity', ['charity', 'zakat', 'sadaqah', 'giving', 'helping', 'poor', 'needy', 'donation']],
      ['fasting', ['fasting', 'sawm', 'ramadan', 'iftar', 'suhur', 'abstain', 'discipline']],
      ['pilgrimage', ['hajj', 'umrah', 'pilgrimage', 'mecca', 'kaaba', 'ihram', 'tawaf', 'sacred']]
    ]);

    // Spiritual themes and their indicators
    this.spiritualThemes = new Map([
      ['trust_in_allah', ['trust', 'tawakkul', 'reliance', 'depend', 'allah', 'faith', 'belief']],
      ['daily_practice', ['daily', 'routine', 'habit', 'regular', 'consistent', 'practice', 'discipline']],
      ['character_building', ['character', 'akhlaq', 'morality', 'ethics', 'behavior', 'manners', 'conduct']],
      ['spiritual_growth', ['growth', 'development', 'progress', 'journey', 'path', 'closer', 'spiritual']],
      ['community', ['community', 'ummah', 'together', 'brotherhood', 'sisterhood', 'family', 'society']],
      ['repentance', ['repentance', 'tawbah', 'forgive', 'sorry', 'mistake', 'sin', 'regret']],
      ['mindfulness', ['mindful', 'present', 'aware', 'conscious', 'attention', 'focus', 'meditation']],
      ['contentment', ['content', 'satisfied', 'enough', 'qana\'ah', 'peaceful', 'calm', 'acceptance']]
    ]);

    // Emotional indicators for different states
    this.emotionalIndicators = new Map([
      ['seeking', ['need', 'help', 'guidance', 'advice', 'lost', 'confused', 'searching', 'looking']],
      ['reflective', ['think', 'reflect', 'consider', 'ponder', 'contemplate', 'wonder', 'realize']],
      ['curious', ['why', 'how', 'what', 'question', 'curious', 'interested', 'learn', 'understand']],
      ['troubled', ['difficult', 'hard', 'struggle', 'problem', 'worry', 'stress', 'anxious', 'upset']],
      ['grateful', ['thank', 'grateful', 'blessed', 'appreciate', 'alhamdulillah', 'fortunate', 'happy']],
      ['peaceful', ['peace', 'calm', 'serene', 'tranquil', 'content', 'satisfied', 'balanced', 'harmony']]
    ]);

    // Knowledge level indicators (complexity scores)
    this.knowledgeIndicators = new Map([
      ['basic', 1], ['fundamental', 1], ['simple', 1], ['beginning', 1],
      ['intermediate', 2], ['moderate', 2], ['developing', 2],
      ['advanced', 3], ['complex', 3], ['deep', 3], ['sophisticated', 3],
      ['scholarly', 4], ['academic', 4], ['theological', 4], ['jurisprudence', 4]
    ]);
  }

  // Main analysis method
  async analyzeMessage(
    message: string,
    conversationHistory: ConversationContext
  ): Promise<ConversationAnalysis> {
    const cleanMessage = this.preprocessMessage(message);
    
    return {
      topics: this.extractTopics(cleanMessage),
      spiritualThemes: this.extractSpiritualThemes(cleanMessage),
      emotionalIndicators: this.extractEmotionalIndicators(cleanMessage),
      knowledgeIndicators: this.extractKnowledgeIndicators(cleanMessage),
      unlockTriggers: this.identifyUnlockTriggers(cleanMessage, conversationHistory),
      engagementScore: this.calculateEngagementScore(cleanMessage, conversationHistory),
      complexityScore: this.calculateComplexityScore(cleanMessage),
      wordCount: cleanMessage.split(' ').length
    };
  }

  private preprocessMessage(message: string): string {
    return message.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractTopics(message: string): string[] {
    const foundTopics: string[] = [];
    
    for (const [topic, keywords] of this.islamicTopics) {
      const matchCount = keywords.filter(keyword => 
        message.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        foundTopics.push(topic);
      }
    }
    
    return foundTopics;
  }

  private extractSpiritualThemes(message: string): string[] {
    const foundThemes: string[] = [];
    
    for (const [theme, indicators] of this.spiritualThemes) {
      const matchCount = indicators.filter(indicator => 
        message.includes(indicator.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        foundThemes.push(theme);
      }
    }
    
    return foundThemes;
  }

  private extractEmotionalIndicators(message: string): string[] {
    const foundEmotions: string[] = [];
    
    for (const [emotion, indicators] of this.emotionalIndicators) {
      const matchCount = indicators.filter(indicator => 
        message.includes(indicator.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        foundEmotions.push(emotion);
      }
    }
    
    return foundEmotions;
  }

  private extractKnowledgeIndicators(message: string): string[] {
    const indicators: string[] = [];
    
    for (const [term, level] of this.knowledgeIndicators) {
      if (message.includes(term.toLowerCase())) {
        indicators.push(`${term}:${level}`);
      }
    }
    
    return indicators;
  }

  private identifyUnlockTriggers(
    message: string, 
    context: ConversationContext
  ): string[] {
    const triggers: string[] = [];
    
    // Topic-based triggers
    if (message.includes('difficult') || message.includes('struggle')) {
      triggers.push('discussed_difficulty');
    }
    
    if (message.includes('grateful') || message.includes('thankful')) {
      triggers.push('expressed_gratitude');
    }
    
    if (message.includes('?') && message.split('?').length > 1) {
      triggers.push('asked_questions');
    }
    
    if (message.includes('pray') || message.includes('salah')) {
      triggers.push('discussed_prayer');
    }
    
    if (message.includes('quran') || message.includes('ayah')) {
      triggers.push('mentioned_quran');
    }
    
    // Context-based triggers
    if (context.messageCount >= 5 && context.engagementLevel >= 7) {
      triggers.push('sustained_engagement');
    }
    
    if (context.sessionDuration >= 10) {
      triggers.push('long_conversation');
    }
    
    return triggers;
  }

  private calculateEngagementScore(
    message: string, 
    context: ConversationContext
  ): number {
    let score = 5; // Base score
    
    // Length indicates engagement
    const wordCount = message.split(' ').length;
    if (wordCount > 20) score += 2;
    else if (wordCount > 10) score += 1;
    else if (wordCount < 3) score -= 2;
    
    // Questions indicate curiosity
    const questionCount = (message.match(/\?/g) || []).length;
    score += Math.min(questionCount * 1.5, 3);
    
    // Personal pronouns indicate engagement
    const personalWords = ['i', 'me', 'my', 'myself', 'feel', 'think'];
    const personalCount = personalWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    score += Math.min(personalCount * 0.5, 2);
    
    // Emotional words indicate deeper engagement
    const emotionalWords = ['feel', 'emotion', 'heart', 'soul', 'struggle', 'joy'];
    const emotionalCount = emotionalWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    score += Math.min(emotionalCount * 1, 2);
    
    return Math.min(Math.max(score, 1), 10);
  }

  private calculateComplexityScore(message: string): number {
    let complexity = 1;
    
    const wordCount = message.split(' ').length;
    if (wordCount > 50) complexity += 3;
    else if (wordCount > 25) complexity += 2;
    else if (wordCount > 10) complexity += 1;
    
    // Check for complex Islamic terms
    const complexTerms = ['tafseer', 'jurisprudence', 'fiqh', 'theology', 'philosophy'];
    const complexCount = complexTerms.filter(term => 
      message.toLowerCase().includes(term)
    ).length;
    complexity += complexCount * 2;
    
    return Math.min(complexity, 10);
  }

  // Determine overall emotional tone
  assessEmotionalTone(emotionalIndicators: string[]): ConversationContext['emotionalTone'] {
    if (emotionalIndicators.length === 0) return 'neutral';
    
    // Priority order for emotional states
    if (emotionalIndicators.includes('troubled')) return 'troubled';
    if (emotionalIndicators.includes('seeking')) return 'seeking';
    if (emotionalIndicators.includes('grateful')) return 'grateful';
    if (emotionalIndicators.includes('peaceful')) return 'peaceful';
    if (emotionalIndicators.includes('reflective')) return 'reflective';
    if (emotionalIndicators.includes('curious')) return 'curious';
    
    return 'neutral';
  }

  // Determine knowledge level based on conversation history
  assessKnowledgeLevel(
    knowledgeIndicators: string[],
    conversationHistory: ConversationContext
  ): ConversationContext['knowledgeLevel'] {
    const avgComplexity = knowledgeIndicators.reduce((sum, indicator) => {
      const level = parseInt(indicator.split(':')[1] || '1');
      return sum + level;
    }, 0) / Math.max(knowledgeIndicators.length, 1);
    
    // Factor in conversation history
    const topicDiversity = new Set(conversationHistory.topics).size;
    const adjustedComplexity = avgComplexity + (topicDiversity * 0.1);
    
    if (adjustedComplexity >= 3) return 'advanced';
    if (adjustedComplexity >= 2) return 'intermediate';
    return 'beginner';
  }

  // Update conversation context with new analysis
  updateContext(
    currentContext: ConversationContext,
    newAnalysis: ConversationAnalysis
  ): ConversationContext {
    return {
      ...currentContext,
      topics: [...new Set([...currentContext.topics, ...newAnalysis.topics])],
      spiritualThemes: [...new Set([...currentContext.spiritualThemes, ...newAnalysis.spiritualThemes])],
      emotionalTone: this.assessEmotionalTone(newAnalysis.emotionalIndicators),
      knowledgeLevel: this.assessKnowledgeLevel(newAnalysis.knowledgeIndicators, currentContext),
      engagementLevel: Math.round((currentContext.engagementLevel + newAnalysis.engagementScore) / 2),
      messageCount: currentContext.messageCount + 1,
      lastInteraction: new Date(),
      unlockTriggers: [...new Set([...currentContext.unlockTriggers, ...newAnalysis.unlockTriggers])]
    };
  }
}

// Specialized analyzer for Islamic content
export class IslamicContentAnalyzer extends ConversationAnalyzer {
  private quranReferences: Map<string, string>;
  private hadithCategories: Map<string, string[]>;
  private islamicConcepts: Map<string, string>;

  constructor() {
    super();
    this.initializeIslamicData();
  }

  private initializeIslamicData() {
    // Common Quranic themes and references
    this.quranReferences = new Map([
      ['patience', 'Quran 2:153 - "And give good tidings to the patient"'],
      ['gratitude', 'Quran 14:7 - "If you are grateful, I will certainly give you more"'],
      ['trust', 'Quran 65:3 - "And whoever relies upon Allah - then He is sufficient for him"'],
      ['forgiveness', 'Quran 42:40 - "But whoever forgives and makes reconciliation, his reward is with Allah"']
    ]);

    // Hadith categories for different topics
    this.hadithCategories = new Map([
      ['character', ['akhlaq', 'manners', 'behavior', 'conduct', 'ethics']],
      ['worship', ['salah', 'prayer', 'dhikr', 'remembrance', 'devotion']],
      ['social', ['family', 'neighbors', 'community', 'relationships', 'society']],
      ['knowledge', ['learning', 'teaching', 'wisdom', 'education', 'study']]
    ]);

    // Key Islamic concepts and their explanations
    this.islamicConcepts = new Map([
      ['tawakkul', 'Trust and reliance upon Allah while taking practical steps'],
      ['sabr', 'Patient perseverance in the face of trials and difficulties'],
      ['shukr', 'Gratitude expressed through recognition, feeling, and action'],
      ['ihsan', 'Excellence in worship and character, as if seeing Allah'],
      ['taqwa', 'God-consciousness and awareness of Allah in all actions']
    ]);
  }

  // Enhanced analysis specifically for Islamic content
  async analyzeIslamicContent(
    message: string,
    context: ConversationContext
  ): Promise<ConversationAnalysis & {
    quranReferences: string[];
    hadithCategories: string[];
    islamicConcepts: string[];
    spiritualOpportunities: string[];
  }> {
    const baseAnalysis = await this.analyzeMessage(message, context);
    
    return {
      ...baseAnalysis,
      quranReferences: this.findRelevantQuranReferences(message),
      hadithCategories: this.identifyHadithCategories(message),
      islamicConcepts: this.extractIslamicConcepts(message),
      spiritualOpportunities: this.identifySpiritualOpportunities(message, context)
    };
  }

  private findRelevantQuranReferences(message: string): string[] {
    const references: string[] = [];
    
    for (const [theme, reference] of this.quranReferences) {
      if (message.toLowerCase().includes(theme)) {
        references.push(reference);
      }
    }
    
    return references;
  }

  private identifyHadithCategories(message: string): string[] {
    const categories: string[] = [];
    
    for (const [category, keywords] of this.hadithCategories) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        categories.push(category);
      }
    }
    
    return categories;
  }

  private extractIslamicConcepts(message: string): string[] {
    const concepts: string[] = [];
    
    for (const [concept, description] of this.islamicConcepts) {
      if (message.toLowerCase().includes(concept.toLowerCase())) {
        concepts.push(`${concept}: ${description}`);
      }
    }
    
    return concepts;
  }

  private identifySpiritualOpportunities(
    message: string,
    context: ConversationContext
  ): string[] {
    const opportunities: string[] = [];
    
    // Prayer reminder opportunities
    if (message.includes('busy') || message.includes('time')) {
      opportunities.push('prayer_reminder');
    }
    
    // Reflection opportunities
    if (context.emotionalTone === 'reflective' || message.includes('think')) {
      opportunities.push('guided_reflection');
    }
    
    // Dua suggestion opportunities
    if (context.emotionalTone === 'troubled' || message.includes('help')) {
      opportunities.push('dua_suggestion');
    }
    
    // Learning opportunities
    if (context.emotionalTone === 'curious' || message.includes('learn')) {
      opportunities.push('learning_path');
    }
    
    return opportunities;
  }
}

export default ConversationAnalyzer;

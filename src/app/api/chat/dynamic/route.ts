// DeenQuest Dynamic Chat API with Progressive Content Unlocking
// Integrates conversation analysis and content unlocking with existing chat

import { NextRequest, NextResponse } from 'next/server';
import { ConversationAnalyzer, IslamicContentAnalyzer, ConversationContext } from '@/lib/conversation-analyzer';
import ContentUnlockEngine, { UnlockNotification } from '@/lib/content-unlock-engine';

// Extend the existing chat message interface
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  analysis?: any;
  unlocks?: UnlockNotification[];
}

interface ChatResponse {
  message: string;
  unlocks: UnlockNotification[];
  suggestions: ConversationSuggestion[];
  spiritualGuidance?: SpiritualGuidance;
  conversationContext: ConversationContext;
}

interface ConversationSuggestion {
  id: string;
  type: 'topic_suggestion' | 'spiritual_practice' | 'learning_path' | 'reflection';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  icon?: string;
}

interface SpiritualGuidance {
  prayerReminders?: string[];
  quranReferences?: string[];
  hadithReferences?: string[];
  duaaSuggestions?: string[];
  spiritualPractices?: string[];
}

// Initialize analysis and unlock engines
const conversationAnalyzer = new IslamicContentAnalyzer();
const contentUnlockEngine = new ContentUnlockEngine();

// In-memory conversation context storage (would be database in production)
const conversationSessions = new Map<string, ConversationContext>();

export async function POST(request: NextRequest) {
  try {
    const { message, userId, sessionId, conversationHistory } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Get or create conversation context
    const contextKey = `${userId}_${sessionId || 'default'}`;
    let conversationContext = conversationSessions.get(contextKey) || {
      userId,
      sessionId: sessionId || generateSessionId(),
      topics: [],
      spiritualThemes: [],
      emotionalTone: 'neutral' as const,
      knowledgeLevel: 'beginner' as const,
      engagementLevel: 5,
      messageCount: 0,
      sessionDuration: 0,
      lastInteraction: new Date(),
      unlockTriggers: []
    };

    // Update session duration
    const sessionStart = conversationSessions.has(contextKey) 
      ? conversationContext.lastInteraction 
      : new Date();
    conversationContext.sessionDuration = Math.floor(
      (new Date().getTime() - sessionStart.getTime()) / (1000 * 60)
    );

    // Analyze the user's message
    const messageAnalysis = await conversationAnalyzer.analyzeIslamicContent(
      message,
      conversationContext
    );

    // Update conversation context with analysis
    conversationContext = conversationAnalyzer.updateContext(
      conversationContext,
      messageAnalysis
    );

    // Store updated context
    conversationSessions.set(contextKey, conversationContext);

    // Check for content unlocks
    const unlockResults = await contentUnlockEngine.checkForUnlocks(
      userId,
      conversationContext
    );

    // Create unlock notifications
    const unlockNotifications = contentUnlockEngine.createUnlockNotifications(
      unlockResults
    );

    // Generate AI response using DeepSeek (existing integration)
    const aiResponse = await generateAIResponse(
      message,
      conversationHistory,
      conversationContext,
      messageAnalysis
    );

    // Generate conversation suggestions
    const suggestions = await generateConversationSuggestions(
      conversationContext,
      messageAnalysis
    );

    // Generate spiritual guidance
    const spiritualGuidance = await generateSpiritualGuidance(
      messageAnalysis,
      conversationContext
    );

    // Prepare response
    const response: ChatResponse = {
      message: aiResponse,
      unlocks: unlockNotifications,
      suggestions,
      spiritualGuidance,
      conversationContext
    };

    // Log conversation data (would save to database in production)
    await logConversationData(userId, sessionId || 'default', {
      userMessage: message,
      aiResponse,
      analysis: messageAnalysis,
      unlocks: unlockNotifications,
      context: conversationContext
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Dynamic chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// Generate AI response with context awareness
async function generateAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  context: ConversationContext,
  analysis: any
): Promise<string> {
  // Build context-aware prompt for DeepSeek
  const systemPrompt = buildSystemPrompt(context, analysis);
  
  // Prepare conversation history for AI
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  // Call DeepSeek API (using existing integration)
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your message. Please try again.';
    
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return generateFallbackResponse(userMessage, context);
  }
}

function buildSystemPrompt(
  context: ConversationContext,
  analysis: any
): string {
  const basePrompt = `You are Hikmah, an AI Islamic companion for DeenQuest. You provide thoughtful, authentic Islamic guidance while being warm and supportive.

Current conversation context:
- User's spiritual interests: ${context.spiritualThemes.join(', ') || 'general Islamic guidance'}
- Topics discussed: ${context.topics.join(', ') || 'introductory conversation'}
- User's emotional tone: ${context.emotionalTone}
- Knowledge level: ${context.knowledgeLevel}
- Engagement level: ${context.engagementLevel}/10

Recent analysis insights:
- Spiritual themes detected: ${analysis.spiritualThemes?.join(', ') || 'none'}
- Emotional indicators: ${analysis.emotionalIndicators?.join(', ') || 'neutral'}
- Quran references suggested: ${analysis.quranReferences?.join('; ') || 'none'}

Guidelines:
1. Respond naturally and conversationally, incorporating the user's emotional state
2. Adapt your language complexity to their knowledge level
3. Reference relevant Quranic verses or Hadith when appropriate
4. Provide practical Islamic guidance and spiritual insights
5. Be encouraging and supportive, especially if the user seems troubled
6. Ask thoughtful questions to deepen the conversation when appropriate
7. Maintain authenticity to Islamic teachings while being accessible`;

  // Add specific guidance based on emotional tone
  if (context.emotionalTone === 'troubled') {
    return basePrompt + `\n\nSpecial guidance: The user seems to be going through difficulties. Focus on providing comfort, hope, and practical Islamic coping strategies. Emphasize Allah's mercy and the temporary nature of worldly struggles.`;
  } else if (context.emotionalTone === 'grateful') {
    return basePrompt + `\n\nSpecial guidance: The user is expressing gratitude. Encourage this positive state, share verses about gratitude, and help them see how gratitude leads to spiritual growth.`;
  } else if (context.emotionalTone === 'curious') {
    return basePrompt + `\n\nSpecial guidance: The user is curious and seeking knowledge. Provide detailed explanations, ask engaging questions, and encourage their desire to learn about Islam.`;
  }

  return basePrompt;
}

function generateFallbackResponse(
  userMessage: string,
  context: ConversationContext
): string {
  const responses = {
    troubled: "I understand you're going through a difficult time. Remember that Allah is always with those who turn to Him. Would you like to talk about what's troubling you, or would you prefer we focus on finding some peace through Islamic teachings?",
    grateful: "SubhanAllah, it's beautiful to hear your gratitude. As Allah says in the Quran, 'If you are grateful, I will certainly give you more.' Your grateful heart is a sign of spiritual awareness.",
    curious: "I love your curiosity about Islamic teachings! Knowledge seeking is highly valued in Islam. What specific aspect would you like to explore together?",
    seeking: "I'm here to help guide you on your spiritual journey. What particular guidance or understanding are you seeking today?",
    peaceful: "MashAllah, it sounds like you're in a good spiritual space. How can I help you continue growing in your Islamic journey?",
    reflective: "Reflection is such an important part of spiritual growth. What insights or thoughts would you like to explore together?"
  };

  return responses[context.emotionalTone] || 
    "Thank you for sharing with me. I'm here to support your Islamic journey. What would you like to discuss or learn about today?";
}

// Generate conversation suggestions based on context
async function generateConversationSuggestions(
  context: ConversationContext,
  analysis: any
): Promise<ConversationSuggestion[]> {
  const suggestions: ConversationSuggestion[] = [];

  // Topic-based suggestions
  if (context.topics.includes('prayer') && !context.topics.includes('dhikr')) {
    suggestions.push({
      id: 'dhikr-suggestion',
      type: 'spiritual_practice',
      title: 'Explore Dhikr (Remembrance of Allah)',
      description: 'Since you\'re interested in prayer, you might enjoy learning about dhikr and its spiritual benefits.',
      action: 'suggest_dhikr_topic',
      priority: 'medium',
      icon: 'heart'
    });
  }

  if (context.spiritualThemes.includes('gratitude') && context.engagementLevel >= 7) {
    suggestions.push({
      id: 'gratitude-practice',
      type: 'spiritual_practice',
      title: 'Daily Gratitude Practice',
      description: 'Develop a daily Islamic gratitude practice to deepen your spiritual awareness.',
      action: 'suggest_gratitude_practice',
      priority: 'high',
      icon: 'sun'
    });
  }

  // Knowledge level appropriate suggestions
  if (context.knowledgeLevel === 'beginner' && context.messageCount >= 5) {
    suggestions.push({
      id: 'five-pillars',
      type: 'learning_path',
      title: 'Learn About the Five Pillars',
      description: 'Ready to explore the foundational practices of Islam?',
      action: 'suggest_five_pillars',
      priority: 'medium',
      icon: 'book'
    });
  }

  // Emotional state suggestions
  if (context.emotionalTone === 'reflective') {
    suggestions.push({
      id: 'reflection-prompt',
      type: 'reflection',
      title: 'Guided Reflection',
      description: 'Take a moment for deeper spiritual reflection with Islamic guidance.',
      action: 'suggest_reflection_exercise',
      priority: 'high',
      icon: 'lightbulb'
    });
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

// Generate spiritual guidance based on conversation
async function generateSpiritualGuidance(
  analysis: any,
  context: ConversationContext
): Promise<SpiritualGuidance> {
  const guidance: SpiritualGuidance = {};

  // Prayer reminders based on context
  if (shouldSuggestPrayerReminder(context)) {
    guidance.prayerReminders = [
      "It's a beautiful time to remember Allah through prayer",
      "Consider taking a moment for dhikr or dua"
    ];
  }

  // Quran references from analysis
  if (analysis.quranReferences && analysis.quranReferences.length > 0) {
    guidance.quranReferences = analysis.quranReferences.slice(0, 2);
  }

  // Contextual dua suggestions
  if (context.emotionalTone === 'troubled') {
    guidance.duaaSuggestions = [
      "Hasbunallahu wa ni'mal wakeel (Allah is sufficient for us and He is the best disposer of affairs)",
      "Rabbi ishurni shukra ni'matika (My Lord, enable me to be grateful for Your favor)"
    ];
  } else if (context.emotionalTone === 'grateful') {
    guidance.duaaSuggestions = [
      "Alhamdulillahi Rabbil Alameen (All praise belongs to Allah, Lord of all the worlds)",
      "Rabbana atina fi'd-dunya hasanatan (Our Lord, give us good in this world and good in the next world)"
    ];
  }

  // Spiritual practices based on themes
  if (context.spiritualThemes.includes('mindfulness')) {
    guidance.spiritualPractices = [
      "Practice conscious breathing while saying 'SubhanAllah'",
      "Take moments throughout the day to remember Allah's presence"
    ];
  }

  return guidance;
}

function shouldSuggestPrayerReminder(context: ConversationContext): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Suggest prayer reminders during general prayer times (simplified)
  const prayerHours = [5, 6, 12, 13, 15, 16, 18, 19, 20, 21]; // Approximate prayer times
  
  return prayerHours.includes(hour) && 
         context.sessionDuration >= 10 && 
         !context.topics.includes('prayer');
}

// Log conversation data (would integrate with database)
async function logConversationData(
  userId: string,
  sessionId: string,
  data: any
): Promise<void> {
  // In production, this would save to the database tables we created
  console.log('Conversation logged:', {
    userId,
    sessionId,
    timestamp: new Date().toISOString(),
    topicsDiscussed: data.context.topics,
    spiritualThemes: data.context.spiritualThemes,
    unlocks: data.unlocks.map((u: UnlockNotification) => u.title),
    engagementLevel: data.context.engagementLevel
  });
  
  // TODO: Implement database storage
  // await saveConversationToDatabase(userId, sessionId, data);
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    features: [
      'conversation_analysis',
      'content_unlocking',
      'spiritual_guidance',
      'intelligent_suggestions'
    ],
    timestamp: new Date().toISOString()
  });
}

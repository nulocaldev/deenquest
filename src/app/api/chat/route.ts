import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekAPI } from '@/lib/deepseek';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  context?: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      context, 
      conversationHistory = [], 
      userId = 'anonymous' 
    }: ChatRequest = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    try {
      const deepseek = new DeepSeekAPI({ apiKey: process.env.DEEPSEEK_API_KEY });
      
      // Generate clean AI response
      const response = await deepseek.generateIslamicResponse(message, context);
      
      // Base response
      let chatResponse: any = {
        response,
        suggestions: [
          "Tell me more about this topic",
          "Can you provide a Quranic perspective?", 
          "What would the Prophet (PBUH) say about this?"
        ]
      };

      // Enhanced content unlocking
      const unlockData = await processContentUnlocking(message, conversationHistory, userId);
      if (unlockData) {
        chatResponse = {
          ...chatResponse,
          unlocks: unlockData.unlocks,
          spiritualGuidance: unlockData.spiritualGuidance,
          conversationContext: unlockData.context
        };
      }

      return NextResponse.json(chatResponse);
    } catch (deepseekError) {
      console.warn('DeepSeek API failed, using fallback:', deepseekError);
      const fallbackResponse = getFallbackResponse(message);
      return NextResponse.json({
        response: fallbackResponse,
        suggestions: [
          "Tell me more about this topic",
          "Can you provide a Quranic perspective?",
          "What would the Prophet (PBUH) say about this?",
          "Share wisdom about patience"
        ],
        isDeepSeek: false
      });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        response: "I'm having trouble right now. Please try again in a moment.",
        suggestions: [
          "Try asking again",
          "Ask a different question"
        ]
      },
      { status: 500 }
    );
  }
}

async function processContentUnlocking(
  message: string,
  conversationHistory: ChatMessage[],
  userId: string
) {
  try {
    const unlocks: any[] = [];
    const spiritualGuidance: any = {};

    // Dynamic unlocking logic
    const analysis = await analyzeMessageForUnlocking(message, conversationHistory);
    if (analysis.unlocks) unlocks.push(...analysis.unlocks);
    if (analysis.spiritualGuidance) Object.assign(spiritualGuidance, analysis.spiritualGuidance);

    const conversationContext = {
      userId,
      sessionId: 'default',
      topics: analysis.topics,
      spiritualThemes: Object.keys(spiritualGuidance),
      emotionalTone: analysis.emotionalTone,
      knowledgeLevel: analysis.knowledgeLevel,
      engagementLevel: unlocks.length > 0 ? 8 : 5,
      messageCount: conversationHistory.length + 1,
      sessionDuration: 0,
      lastInteraction: new Date(),
      unlockTriggers: unlocks.map(u => u.id)
    };

    return {
      unlocks,
      spiritualGuidance: Object.keys(spiritualGuidance).length > 0 ? spiritualGuidance : undefined,
      context: conversationContext
    };
  } catch (error) {
    console.error('Content unlocking error:', error);
    return null;
  }
}

async function analyzeMessageForUnlocking(
  message: string,
  conversationHistory: ChatMessage[]
) {
  // Placeholder for dynamic analysis logic
  const unlocks = [];
  const spiritualGuidance = {};
  const topics = ['general'];
  const emotionalTone = 'neutral';
  const knowledgeLevel = 'beginner';

  // Example: Analyze message and history for unlocking
  if (message.toLowerCase().includes('patience')) {
    unlocks.push({
      id: 'patience-wisdom',
      type: 'wisdom_card',
      title: 'Patience in Hardship',
      description: 'Understanding Sabr in Islamic teachings',
      unlockedAt: new Date(),
      priority: 'high'
    });
    spiritualGuidance.quranReferences = ['And give good tidings to the patient (Quran 2:155)'];
    topics.push('patience');
    emotionalTone = 'seeking';
  }

  return { unlocks, spiritualGuidance, topics, emotionalTone, knowledgeLevel };
}

function getFallbackResponse(userMessage: string): string {
  const fallbackResponses = [
    "I'm having technical difficulties right now. The Prophet (peace be upon him) taught us that seeking knowledge is valuable, so please try your question again in a moment.",
    "My systems are temporarily offline. Remember that Allah is always near to those who seek guidance. Please try again shortly.",
    "I'm experiencing connectivity issues. With every hardship comes ease, as mentioned in the Quran. Please retry your question in a moment.",
    "My knowledge systems are temporarily unavailable, but Islamic guidance is always available through the Quran and Sunnah. Please try again shortly."
  ];
  const responseIndex = Math.abs(userMessage.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % fallbackResponses.length;
  return fallbackResponses[responseIndex];
}

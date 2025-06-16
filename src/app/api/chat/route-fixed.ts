import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekAPI } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    try {
      const deepseek = new DeepSeekAPI(process.env.DEEPSEEK_API_KEY);
      const response = await deepseek.generateIslamicResponse(message, context);

      return NextResponse.json({ 
        response,
        suggestions: [
          "Tell me more about this topic",
          "Can you provide a Quranic perspective?", 
          "What would the Prophet (PBUH) say about this?"
        ]
      });
    } catch (deepseekError) {
      console.warn('DeepSeek API failed, using enhanced fallback:', deepseekError);
      
      // Enhanced fallback response with suggestions
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
        response: "I apologize, but I'm having trouble right now. Please try again in a moment. May Allah guide and bless you.",
        suggestions: [
          "Try asking again",
          "Ask a different question"
        ]
      },
      { status: 500 }
    );
  }
}

function getFallbackResponse(userMessage: string): string {
  // Enhanced Islamic-themed fallback responses
  const fallbackResponses = [
    "**Alhamdulillah** for your question! While I'm experiencing technical difficulties, remember that **seeking knowledge is beloved to Allah**. [Hadith - Bukhari] The Prophet (peace be upon him) said: 'Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.'",
    
    "**SubhanAllah**, your sincere inquiry shows a heart seeking guidance. Though my systems are temporarily offline, remember: **Allah is always near**. [Quran 2:186] {ar}وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ{/ar}",
    
    "**May Allah reward** your quest for Islamic knowledge! While I'm having connectivity issues, this is a beautiful reminder that **with every hardship comes ease**. [Quran 94:5-6] Please try again in a moment, in sha Allah.",
    
    "**Barakallahu feeki/feek** for your patience. My knowledge systems are temporarily unavailable, but **Allah's guidance never fails**. [Quran 2:2] This Quran is guidance for the righteous. Please retry your question shortly."
  ];
  
  // Select response based on message content for variety
  const responseIndex = Math.abs(userMessage.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % fallbackResponses.length;
  return fallbackResponses[responseIndex];
}

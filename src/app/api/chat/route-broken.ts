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
    );
  }
}

function getFallbackResponse(error: any): string {
  if (error.message?.includes('API key')) {
    return "I'm currently having trouble connecting to my AI service. However, I'm here to help with Islamic guidance! Please feel free to ask your question, and I'll do my best to provide helpful insights based on Islamic teachings. For more detailed responses, please ensure the DeepSeek API is properly configured.";
  }
  
  if (error.message?.includes('rate limit')) {
    return "I'm experiencing high demand right now. Please try again in a moment. In the meantime, remember that seeking knowledge is a blessed act in Islam, as the Prophet (peace be upon him) said: 'Seek knowledge from the cradle to the grave.'";
  }
  
  return "I apologize, but I'm having technical difficulties right now. Please try again later. Remember, Allah is always there to listen to your prayers and guide you. May Allah grant you peace and guidance.";
}

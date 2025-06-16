import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekAPI } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    const deepseek = new DeepSeekAPI({ apiKey: process.env.DEEPSEEK_API_KEY });
    const prompt = await deepseek.generateJournalPrompt(topic);

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('DeepSeek Journal Prompt Error:', error);
    
    // Fallback prompts for when DeepSeek is unavailable
    const fallbackPrompts = [
      "Reflect on the blessings Allah has given you today. How can you show gratitude for these gifts? Consider writing about three specific things you're thankful for and how they strengthen your faith.",
      "Think about a challenge you're currently facing. How can the teachings of Islam guide you through this difficulty? What duas or verses bring you comfort?",
      "Consider the five daily prayers and their impact on your day. How do they serve as moments of reflection and connection with Allah? What thoughts come to mind during these sacred times?",
      "Reflect on the concept of patience (sabr) in Islam. How have you practiced patience recently? What can you learn from the examples of the Prophets and righteous people?",
      "Think about your relationships with family and friends. How can you embody Islamic values of kindness, forgiveness, and compassion in these relationships?"
    ];
    
    const randomPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
    
    return NextResponse.json({ 
      prompt: randomPrompt,
      isDeepSeek: false 
    });
  }
}

export async function GET() {
  // For simple GET requests without topic
  try {
    const deepseek = new DeepSeekAPI({ apiKey: process.env.DEEPSEEK_API_KEY });
    const prompt = await deepseek.generateJournalPrompt();

    return NextResponse.json({ prompt });
  } catch (error) {
    const fallbackPrompt = "Reflect on your spiritual journey today. What moments brought you closer to Allah? How can you continue to grow in your faith and practice? Consider the small acts of worship and kindness that made a difference in your day.";
    
    return NextResponse.json({ 
      prompt: fallbackPrompt,
      isDeepSeek: false 
    });
  }
}

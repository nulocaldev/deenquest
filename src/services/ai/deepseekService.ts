import axios from 'axios';
import { getIslamicGuidancePrompt, getJournalPromptGeneratorPrompt } from './systemPrompts';

const DEEPSEEK_API_URL = process.env.NEXT_PUBLIC_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepSeekConfig {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  maxTokens?: number;
  temperature?: number;
}

export class DeepSeekService {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;
  private maxTokens: number;
  private temperature: number;
  private retryCount: number;

  constructor(config: DeepSeekConfig = {}) {
    this.apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = config.baseURL || DEEPSEEK_API_URL;
    this.timeout = config.timeout || 30000;
    this.maxTokens = config.maxTokens || 1000;
    this.temperature = config.temperature || 0.7;
    this.retryCount = 3;
  }

  /**
   * Send a message to the DeepSeek AI model with retry mechanism
   */
  async generateIslamicResponse(message: string, context?: string): Promise<string> {
    const systemPrompt = getIslamicGuidancePrompt(context);
    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    try {
      const response = await this.makeRequest(messages);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating Islamic response:', error);
      return this.getFallbackResponse(message);
    }
  }

  protected makeRequest(messages: DeepSeekMessage[]): Promise<DeepSeekResponse> {
    return axios.post(
      this.baseURL,
      {
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.timeout,
      }
    ).then(response => response.data);
  }

  /**
   * Generate a journal prompt based on a topic
   */
  async generateJournalPrompt(topic?: string): Promise<string> {
    const systemMessage: DeepSeekMessage = {
      role: 'system',
      content: getJournalPromptGeneratorPrompt()
    };

    const userMessage = topic 
      ? `Generate a journal prompt about ${topic} from an Islamic perspective.`
      : 'Generate a thoughtful Islamic reflection prompt for daily journaling.';

    const messages: DeepSeekMessage[] = [
      systemMessage,
      {
        role: 'user',
        content: userMessage
      }
    ];

    try {
      const response = await this.makeRequest(messages);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating journal prompt:', error);
      return "I'm having trouble coming up with a journal prompt right now. Please try again later.";
    }
  }

  /**
   * Get a fallback response when the DeepSeek API is unavailable
   */
  private getFallbackResponse(userMessage: string): string {
    // Islamic-themed fallback responses when DeepSeek API is unavailable
    const fallbackResponses = [
      "Thank you for your question. While I'm experiencing some technical difficulties connecting to my knowledge base, I want to remind you that **seeking knowledge is beloved to Allah**. [Hadith - Bukhari] The Prophet (peace be upon him) said: 'Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.'",
      
      "Your question shows a sincere heart seeking guidance. Though I'm having connectivity issues, remember that **Allah is always near to those who call upon Him**. [Quran 2:186] {ar}وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ{/ar} - 'And when My servants ask you about Me, indeed I am near.'",
      
      "I appreciate your patience. While my systems are temporarily offline, I encourage you to **reflect on this beautiful verse**: [Quran 94:5-6] 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.' Your spiritual journey continues even when technology fails us.",
      
      "Although I'm experiencing technical difficulties, remember that **every moment of seeking Islamic guidance is rewarded**. [Hadith - Muslim] Please try again in a few moments, or consider this an opportunity for personal reflection and dhikr.",
      
      "My connection to the knowledge servers is unstable, but **Allah's guidance never fails**. [Quran 2:2] This Quran is a guide for the righteous. Please retry your question, and in the meantime, make du'aa for beneficial knowledge."
    ];
    
    // Select response based on message content for some variety
    const responseIndex = Math.abs(userMessage.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % fallbackResponses.length;
    return fallbackResponses[responseIndex];
  }
}

// Export a singleton instance for convenience
export const deepseekService = new DeepSeekService();

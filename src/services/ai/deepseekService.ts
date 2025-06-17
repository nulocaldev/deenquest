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
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        const response = await this.makeApiCall(message, context);
        return response;
      } catch (error) {
        console.error(`API call attempt ${attempt + 1} failed:`, error);
        lastError = error as Error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt))); // Exponential backoff
      }
    }
    
    throw new Error(`Failed to get AI response after ${this.retryCount} attempts. Last error: ${lastError?.message}`);
  }

  private async makeApiCall(message: string, context?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    const systemMessage: DeepSeekMessage = {
      role: 'system',
      content: getIslamicGuidancePrompt(context)
    };

    const messages: DeepSeekMessage[] = [
      systemMessage,
      {
        role: 'user',
        content: message
      }
    ];

    try {
      const response = await axios.post<DeepSeekResponse>(
        this.baseURL,
        {
          model: 'deepseek-chat',
          messages,
          stream: false,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.timeout,
        }
      );

      const responseContent = response.data.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('Empty response from DeepSeek API');
      }

      return responseContent;
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid DeepSeek API key');
        } else if (error.response?.status === 429) {
          throw new Error('DeepSeek API rate limit exceeded');
        } else if (error.response?.status === 500) {
          throw new Error('DeepSeek API server error');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('DeepSeek API request timeout');
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to DeepSeek API');
        }
      }
      
      throw new Error('Failed to get response from DeepSeek API');
    }
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

    return await this.chat(messages);
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

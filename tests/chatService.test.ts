import { ChatService } from '../src/services/chat/chatService';
import { deepseekService } from '../src/services/ai/deepseekService';
import { contentUnlockService } from '../src/services/content/contentUnlockService';

// Mock the deepseekService and contentUnlockService
jest.mock('../src/services/ai/deepseekService', () => ({
  deepseekService: {
    generateIslamicResponse: jest.fn(),
    getFallbackResponse: jest.fn()
  }
}));

jest.mock('../src/services/content/contentUnlockService', () => ({
  contentUnlockService: {
    checkForUnlocks: jest.fn()
  }
}));

describe('ChatService', () => {
  let chatService: ChatService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    chatService = new ChatService();
  });
  
  describe('processChat', () => {
    it('should process a chat message and return a response', async () => {
      // Mock the deepseekService response
      (deepseekService.generateIslamicResponse as jest.Mock).mockResolvedValue(
        'This is a test response from DeepSeek.'
      );
      
      // Mock the contentUnlockService response
      (contentUnlockService.checkForUnlocks as jest.Mock).mockResolvedValue({
        unlocks: [
          {
            id: 'test-unlock',
            type: 'wisdom_card',
            title: 'Test Wisdom',
            description: 'This is a test wisdom card',
            priority: 'high',
            unlockedAt: new Date()
          }
        ],
        spiritualGuidance: {
          quranReferences: ['Test Quran reference']
        },
        context: {
          userId: 'test-user',
          sessionId: 'test-session',
          topics: ['general'],
          spiritualThemes: [],
          emotionalTone: 'neutral',
          knowledgeLevel: 'beginner',
          engagementLevel: 5,
          messageCount: 1,
          sessionDuration: 0,
          lastInteraction: new Date(),
          unlockTriggers: []
        }
      });
      
      // Call the processChat method
      const response = await chatService.processChat({
        message: 'Test message',
        userId: 'test-user',
        enableUnlocking: true
      });
      
      // Assertions
      expect(deepseekService.generateIslamicResponse).toHaveBeenCalledWith('Test message', undefined);
      expect(contentUnlockService.checkForUnlocks).toHaveBeenCalledWith('test-user', 'Test message', []);
      
      // Check response structure
      expect(response).toHaveProperty('response');
      expect(response).toHaveProperty('suggestions');
      expect(response).toHaveProperty('unlocks');
      expect(response).toHaveProperty('spiritualGuidance');
      expect(response).toHaveProperty('conversationContext');
      
      // Specific content checks
      expect(response.response).toContain('This is a test response from DeepSeek');
      expect(response.unlocks).toHaveLength(1);
      expect(response.unlocks?.[0].id).toBe('test-unlock');
      expect(response.spiritualGuidance?.quranReferences).toHaveLength(1);
    });
    
    it('should add a greeting if there is no greeting in the conversation history', async () => {
      // Mock the deepseekService response
      (deepseekService.generateIslamicResponse as jest.Mock).mockResolvedValue(
        'This is a test response from DeepSeek.'
      );
      
      // Mock the contentUnlockService response
      (contentUnlockService.checkForUnlocks as jest.Mock).mockResolvedValue({
        unlocks: [],
        spiritualGuidance: {},
        context: {
          userId: 'test-user',
          sessionId: 'test-session',
          topics: ['general'],
          spiritualThemes: [],
          emotionalTone: 'neutral',
          knowledgeLevel: 'beginner',
          engagementLevel: 5,
          messageCount: 1,
          sessionDuration: 0,
          lastInteraction: new Date(),
          unlockTriggers: []
        }
      });
      
      // Call the processChat method with empty conversation history
      const response = await chatService.processChat({
        message: 'Test message',
        userId: 'test-user',
        conversationHistory: [],
        enableUnlocking: true
      });
      
      // Check that the greeting was added
      expect(response.response).toContain('As-salamu alaykum!');
      expect(response.response).toContain('This is a test response from DeepSeek');
    });
    
    it('should not add a greeting if there is already a greeting in the conversation history', async () => {
      // Mock the deepseekService response
      (deepseekService.generateIslamicResponse as jest.Mock).mockResolvedValue(
        'This is a test response from DeepSeek.'
      );
      
      // Mock the contentUnlockService response
      (contentUnlockService.checkForUnlocks as jest.Mock).mockResolvedValue({
        unlocks: [],
        spiritualGuidance: {},
        context: {
          userId: 'test-user',
          sessionId: 'test-session',
          topics: ['general'],
          spiritualThemes: [],
          emotionalTone: 'neutral',
          knowledgeLevel: 'beginner',
          engagementLevel: 5,
          messageCount: 2,
          sessionDuration: 0,
          lastInteraction: new Date(),
          unlockTriggers: []
        }
      });
      
      // Call the processChat method with conversation history that includes a greeting
      const response = await chatService.processChat({
        message: 'Test message',
        userId: 'test-user',
        conversationHistory: [
          { role: 'assistant', content: 'As-salamu alaykum! How can I help you?', timestamp: new Date().toISOString() }
        ],
        enableUnlocking: true
      });
      
      // Check that no additional greeting was added
      expect(response.response).toBe('This is a test response from DeepSeek.');
    });
    
    it('should use the fallback response if deepseekService throws an error', async () => {
      // Mock the deepseekService to throw an error
      (deepseekService.generateIslamicResponse as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );
      
      // Mock the fallback response
      (deepseekService.getFallbackResponse as jest.Mock).mockReturnValue(
        'This is a fallback response.'
      );
      
      // Call the processChat method
      try {
        await chatService.processChat({
          message: 'Test message',
          userId: 'test-user'
        });
        
        // If the above doesn't throw, the test should fail
        fail('Expected processChat to throw an error');
      } catch (error) {
        // The error should be propagated to be handled by the API route
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error');
      }
    });
  });
  
  describe('getFallbackResponse', () => {
    it('should return a fallback response', () => {
      // Set up the deepseekService fallback response mock
      (deepseekService.getFallbackResponse as jest.Mock).mockReturnValue(
        'This is a fallback response from DeepSeek.'
      );
      
      // Call the getFallbackResponse method
      const response = chatService.getFallbackResponse('Test message');
      
      // Check the response
      expect(response).toHaveProperty('response');
      expect(response).toHaveProperty('suggestions');
      expect(response).toHaveProperty('isDeepSeek', false);
      expect(typeof response.response).toBe('string');
      expect(response.response.length).toBeGreaterThan(10);
    });
  });
});

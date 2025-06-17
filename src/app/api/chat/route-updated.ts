import { NextRequest } from 'next/server';
import { chatService } from '@/services/chat/chatService';
import { createSuccessResponse, createErrorResponse } from '@/utils/apiResponse';
import { handleApiError, ValidationError } from '@/utils/errorHandler';
import { ChatRequest } from '@/types/chat';

/**
 * POST handler for the chat API
 * This is the updated version that uses the new service-oriented architecture
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const requestData: ChatRequest = await request.json();
    
    // Validate required fields
    if (!requestData.message) {
      throw new ValidationError('Message is required');
    }
    
    // Process the chat request
    try {
      const response = await chatService.processChat(requestData);
      return createSuccessResponse(response);
    } catch (chatError) {
      console.warn('Chat processing error, using fallback:', chatError);
      
      // Use fallback response if chat processing fails
      const fallbackResponse = chatService.getFallbackResponse(requestData.message);
      return createSuccessResponse(fallbackResponse);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

// Set this API route to be dynamic (not static)
export const dynamic = 'force-dynamic';

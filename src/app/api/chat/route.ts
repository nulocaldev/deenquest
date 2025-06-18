import { NextRequest } from 'next/server';
import { chatService } from '@/services/chat/chatService';
import { createSuccessResponse, createErrorResponse } from '@/utils/apiResponse';
import { handleApiError, ValidationError } from '@/utils/errorHandler';
import { ChatRequest, ChatMessage, ConversationContext } from '@/types/chat';

/**
 * Main chat API route handler
 * This has been refactored to use the service-oriented architecture
 */
export async function POST(request: NextRequest) {
  console.log('POST /api/chat invoked');
  try {
    const requestData: ChatRequest = await request.json();

    if (!requestData.message) {
      throw new ValidationError('Message is required');
    }

    // Stream the AI response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatService.streamChatResponse(requestData)) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (streamError) {
          controller.error(streamError);
        }
      }
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.warn('Chat processing error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response('Request timeout', { status: 408 });
    }

    return handleApiError(error);
  }
}

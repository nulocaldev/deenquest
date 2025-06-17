import { NextRequest } from 'next/server';
import { POST as chatHandler } from './route';

/**
 * This is a backward compatibility route that forwards requests to the main route handler
 * It ensures existing clients continue to work without changes
 */
export async function POST(request: NextRequest) {
  // Forward the request to the main chat handler
  return chatHandler(request);
}

// Set this API route to be dynamic (not static)
export const dynamic = 'force-dynamic';

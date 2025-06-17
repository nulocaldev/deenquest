import { NextResponse } from 'next/server';

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Create an error API response
 */
export function createErrorResponse(message: string, status: number = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(errors: Record<string, string>): NextResponse {
  return NextResponse.json(
    { 
      error: 'Validation failed', 
      validationErrors: errors 
    }, 
    { status: 400 }
  );
}

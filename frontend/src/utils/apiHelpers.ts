import { NextRequest, NextResponse } from 'next/server';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}

export function createApiResponse<T>(data: T, message?: string, statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode },
  );
}

export function createErrorResponse(message: string, statusCode = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: statusCode },
  );
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      return `Field '${field}' is required`;
    }
  }
  return null;
}

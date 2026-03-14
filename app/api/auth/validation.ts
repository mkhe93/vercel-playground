import * as v from 'valibot';
import { NextResponse } from 'next/server';

/**
 * Helper function to validate request data and return a typed result
 * @param schema - The Valibot schema to validate against
 * @param data - The data to validate
 * @returns Either the validated data or a NextResponse with error
 */
export function validateRequest<TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: TSchema,
  data: unknown
): { success: true; data: v.InferOutput<TSchema> } | { success: false; response: NextResponse } {
  const result = v.safeParse(schema, data);

  if (!result.success) {
    const firstError = result.issues[0];
    return {
      success: false,
      response: NextResponse.json(
        { error: firstError?.message || 'Invalid request data' },
        { status: 400 }
      )
    };
  }

  return {
    success: true,
    data: result.output
  };
}

/**
 * Helper to format Valibot errors into user-friendly messages
 */
export function formatValidationErrors(issues: v.BaseIssue<unknown>[]): string[] {
  return issues.map(issue => {
    const path = issue.path?.map(p => p.key).join('.') || 'field';
    return `${path}: ${issue.message}`;
  });
}

/**
 * Custom error response with validation details
 */
export function validationErrorResponse(issues: v.BaseIssue<unknown>[]) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: formatValidationErrors(issues)
    },
    { status: 400 }
  );
}

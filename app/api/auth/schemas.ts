import * as v from 'valibot';

/**
 * Login Request Schema
 * Validates the incoming login request body
 */
export const LoginRequestSchema = v.object({
  email: v.pipe(
    v.string('Email must be a string'),
    v.trim(),
    v.nonEmpty('Email is required'),
    v.email('Invalid email format')
  ),
  password: v.pipe(
    v.string('Password must be a string'),
    v.nonEmpty('Password is required'),
    v.minLength(6, 'Password must be at least 6 characters')
  ),
});

export type LoginRequest = v.InferOutput<typeof LoginRequestSchema>;

/**
 * User Schema
 * Represents a user in the system (with password)
 */
export const UserSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
  name: v.pipe(v.string(), v.nonEmpty()),
});

export type User = v.InferOutput<typeof UserSchema>;

/**
 * Public User Schema
 * User data without sensitive information (password)
 */
export const PublicUserSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.email()),
  name: v.pipe(v.string(), v.nonEmpty()),
});

export type PublicUser = v.InferOutput<typeof PublicUserSchema>;

/**
 * Session Schema
 * Represents the session data stored in cookies
 */
export const SessionSchema = v.object({
  userId: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.email()),
  name: v.pipe(v.string(), v.nonEmpty()),
});

export type Session = v.InferOutput<typeof SessionSchema>;

/**
 * Login Success Response Schema
 */
export const LoginSuccessResponseSchema = v.object({
  success: v.literal(true),
  user: PublicUserSchema,
});

export type LoginSuccessResponse = v.InferOutput<typeof LoginSuccessResponseSchema>;

/**
 * Error Response Schema
 */
export const ErrorResponseSchema = v.object({
  error: v.pipe(v.string(), v.nonEmpty()),
});

export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>;

/**
 * Login Response Schema (union of success and error)
 */
export const LoginResponseSchema = v.variant('success', [
  LoginSuccessResponseSchema,
  v.object({
    success: v.literal(false),
    error: v.pipe(v.string(), v.nonEmpty()),
  }),
]);

export type LoginResponse = v.InferOutput<typeof LoginResponseSchema>;

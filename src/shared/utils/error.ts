import { isHttpError } from '@core/api/interceptors/error.interceptor';

/**
 * Extract a user-readable message from any thrown error.
 * Use this in mutation onError callbacks.
 */
export const getErrorMessage = (error: unknown): string => {
  if (isHttpError(error)) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred.';
};

/**
 * Extract field-level validation errors from an API error.
 * Returns a Record<fieldName, errorMessage> for use with setError in RHF.
 */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!isHttpError(error) || !error.errors) return {};
  return Object.fromEntries(
    Object.entries(error.errors).map(([field, messages]) => [field, messages[0]]),
  );
};

import type { AxiosInstance, AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly errors?: Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'HttpError';
    this.statusCode = apiError.statusCode;
    this.code = apiError.code;
    this.errors = apiError.errors;
  }
}

export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof HttpError;

export const setupErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; code?: string; errors?: Record<string, string[]> }>) => {
      if (error.response) {
        const { status, data } = error.response;
        throw new HttpError({
          message: data?.message ?? getDefaultMessage(status),
          code: data?.code ?? `HTTP_${status}`,
          statusCode: status,
          errors: data?.errors,
        });
      }

      if (error.request) {
        throw new HttpError({
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          statusCode: 0,
        });
      }

      throw new HttpError({
        message: error.message ?? 'An unexpected error occurred.',
        code: 'UNKNOWN_ERROR',
        statusCode: 0,
      });
    },
  );
};

const getDefaultMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: 'Bad request. Please check your input.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. The resource may already exist.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'A server error occurred. Please try again later.',
    502: 'Service temporarily unavailable.',
    503: 'Service temporarily unavailable.',
  };
  return messages[status] ?? 'An unexpected error occurred.';
};

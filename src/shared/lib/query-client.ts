import { QueryClient } from '@tanstack/react-query';
import { isHttpError } from '@core/api/interceptors/error.interceptor';

const isClientError = (error: unknown): boolean =>
  isHttpError(error) && error.statusCode >= 400 && error.statusCode < 500;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min — data stays fresh
      gcTime: 10 * 60 * 1000,         // 10 min — keep unused cache
      refetchOnWindowFocus: false,     // Enterprise apps don't need this
      retry: (failureCount, error) => {
        // Never retry client errors (4xx)
        if (isClientError(error)) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

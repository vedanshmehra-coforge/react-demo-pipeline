import { type ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@shared/lib/query-client';
import { router } from '@routes/index';
import { ToastContainer } from './toast-container';
import { featureFlags } from '@config/feature-flags';

interface ProvidersProps {
  children?: ReactNode;
}

export const Providers = (_props: ProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer />
    {featureFlags.enableQueryDevtools && (
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    )}
  </QueryClientProvider>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

import * as Sentry from "@sentry/react";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  try {
    // Initialize Sentry defensively. Some older/newer SDK APIs for integrations
    // (e.g. Sentry.browserTracingIntegration) may not exist depending on the
    // installed @sentry/* package versions, which can cause runtime errors.
    // Use a minimal init to avoid throwing during app startup.
    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: 1.0,
    });
  } catch (e) {
    // Log but don't break the app if Sentry init fails
    // eslint-disable-next-line no-console
    console.warn('Sentry init failed:', e);
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-right" richColors theme="dark" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);

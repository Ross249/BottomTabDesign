import { useCallback } from 'react';
import { reportError, withErrorHandling } from 'utils/errorHandler';

interface UseErrorHandlerReturn {
  reportError: (error: Error, context?: string, additionalData?: Record<string, any>) => void;
  withErrorHandling: <T>(fn: () => Promise<T> | T, context?: string) => Promise<T | null>;
  handleAsyncError: <T>(fn: () => Promise<T>, context?: string) => Promise<T | undefined>;
  safeExecute: <T>(fn: () => T, fallback?: T, context?: string) => T;
}

/**
 * Custom hook for error handling throughout the app
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const handleAsyncError = useCallback(
    async <T>(fn: () => Promise<T>, context?: string): Promise<T | undefined> => {
      try {
        return await fn();
      } catch (error) {
        if (error instanceof Error) {
          reportError(error, context || 'Async Operation');
        }
        return undefined;
      }
    },
    []
  );

  const safeExecute = useCallback(<T>(fn: () => T, fallback?: T, context?: string): T => {
    try {
      return fn();
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, context || 'Safe Execute');
      }
      return fallback as T;
    }
  }, []);

  return {
    reportError,
    withErrorHandling,
    handleAsyncError,
    safeExecute,
  };
};

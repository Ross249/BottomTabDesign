interface ErrorInfo {
  timestamp: number;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  platform: string;
}

interface ErrorReport {
  error: Error;
  errorInfo: ErrorInfo;
  context?: string;
  additionalData?: Record<string, any>;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private generateErrorInfo(context?: string): ErrorInfo {
    return {
      timestamp: Date.now(),
      platform: 'react-native',
      buildVersion: __DEV__ ? 'development' : 'production',
      // Add more context as needed
      ...(context && { context }),
    };
  }

  /**
   * Report an error with context and additional data
   */
  reportError(error: Error, context?: string, additionalData?: Record<string, any>): void {
    const errorReport: ErrorReport = {
      error,
      errorInfo: this.generateErrorInfo(context),
      context,
      additionalData,
    };

    // Log to console in development
    if (__DEV__) {
      console.group('🚨 Error Report');
      console.error('Error:', error.name, error.message);
      console.error('Stack:', error.stack);
      console.log('Context:', context);
      console.log('Additional Data:', additionalData);
      console.log('Error Info:', errorReport.errorInfo);
      console.groupEnd();
    }

    // Add to queue for processing
    this.errorQueue.push(errorReport);

    // Process the queue
    this.processErrorQueue();
  }

  /**
   * Handle errors caught by error boundary
   */
  handleBoundaryError(error: Error, errorInfo?: any): void {
    this.reportError(error, 'Error Boundary', {
      componentStack: errorInfo?.componentStack,
      errorBoundary: true,
    });
  }

  /**
   * Process queued errors (send to crash reporting services)
   */
  private async processErrorQueue(): Promise<void> {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;

    try {
      // Process all queued errors
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      for (const errorReport of errors) {
        await this.sendErrorReport(errorReport);
      }
    } catch (reportingError) {
      console.error('Failed to report errors:', reportingError);
      // Re-queue failed reports
      this.errorQueue.unshift(...this.errorQueue);
    } finally {
      this.isReporting = false;
    }
  }

  /**
   * Send error report to external services
   */
  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    // Here you can integrate with crash reporting services

    // Example: Sentry
    // Sentry.withScope((scope) => {
    //   scope.setTag('context', errorReport.context);
    //   scope.setContext('errorInfo', errorReport.errorInfo);
    //   scope.setContext('additionalData', errorReport.additionalData);
    //   Sentry.captureException(errorReport.error);
    // });

    // Example: Firebase Crashlytics
    // crashlytics().recordError(errorReport.error);
    // crashlytics().setAttributes(errorReport.additionalData || {});

    // Example: Custom API
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name: errorReport.error.name,
    //     message: errorReport.error.message,
    //     stack: errorReport.error.stack,
    //     ...errorReport.errorInfo,
    //     ...errorReport.additionalData,
    //   }),
    // });

    // For now, just log in development
    if (__DEV__) {
      console.log('📤 Error report sent:', {
        error: errorReport.error.message,
        context: errorReport.context,
      });
    }
  }

  /**
   * Clear all queued errors
   */
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Get current error queue length
   */
  getQueueLength(): number {
    return this.errorQueue.length;
  }
}

export const errorHandler = ErrorHandler.getInstance();

/**
 * Convenience function to report errors
 */
export const reportError = (
  error: Error,
  context?: string,
  additionalData?: Record<string, any>
): void => {
  errorHandler.reportError(error, context, additionalData);
};

/**
 * Try-catch wrapper with automatic error reporting
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T> | T,
  context?: string
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error) {
      reportError(error, context);
    }
    return null;
  }
};

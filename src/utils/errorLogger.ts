import type { AppError, ErrorLogEntry, ErrorLevel } from '@/types/error';

// Lazy import to avoid circular dependencies
let notificationService: any = null;
const getNotificationService = async () => {
  if (!notificationService) {
    const module = await import('@/services/notificationService');
    notificationService = module.notificationService;
  }
  return notificationService;
};

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100; // Keep last 100 errors in memory

  /**
   * Log an error with structured information
   */
  logError(params: {
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
    source: AppError['source'];
    level: ErrorLevel;
    additionalInfo?: any;
  }): void {
    const entry: ErrorLogEntry = {
      id: this.generateId(),
      message: params.message,
      stack: params.stack,
      code: params.code,
      statusCode: params.statusCode,
      source: params.source,
      level: params.level,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      additionalInfo: params.additionalInfo,
    };

    // Add to memory logs
    this.addToLogs(entry);

    // Console logging based on level
    this.consoleLog(entry);

    // Show toast notification for user-facing errors
    this.showToastNotification(entry);

    // Send to external service (if configured)
    this.sendToExternalService(entry);
  }

  /**
   * Log an error from Error object
   */
  logErrorObject(error: Error | AppError, source: AppError['source'] = 'unknown', level: ErrorLevel = 'medium'): void {
    const appError = error as AppError;

    this.logError({
      message: error.message,
      stack: error.stack,
      code: appError.code,
      statusCode: appError.statusCode,
      source: appError.source || source,
      level,
      additionalInfo: appError.details,
    });
  }

  /**
   * Log API errors specifically
   */
  logApiError(error: any, endpoint?: string): void {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message || 'API Error';
    const code = error.response?.data?.code || error.code;

    let level: ErrorLevel = 'medium';
    if (statusCode >= 500) level = 'high';
    else if (statusCode === 401 || statusCode === 403) level = 'low';
    else if (statusCode >= 400) level = 'medium';

    this.logError({
      message,
      stack: error.stack,
      code,
      statusCode,
      source: 'api',
      level,
      additionalInfo: {
        endpoint,
        requestConfig: error.config,
        responseData: error.response?.data,
      },
    });
  }

  /**
   * Log network errors
   */
  logNetworkError(error: Error): void {
    this.logError({
      message: error.message || 'Network Error',
      stack: error.stack,
      source: 'network',
      level: 'high',
      additionalInfo: {
        online: navigator.onLine,
        connectionType: (navigator as any).connection?.effectiveType,
      },
    });
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: ErrorLevel): ErrorLogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get error statistics
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: { low: 0, medium: 0, high: 0, critical: 0 },
      bySource: { api: 0, client: 0, network: 0, unknown: 0 },
      recent: this.logs.filter(log =>
        Date.now() - new Date(log.timestamp).getTime() < 60000 // Last minute
      ).length,
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level]++;
      stats.bySource[log.source]++;
    });

    return stats;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToLogs(entry: ErrorLogEntry): void {
    this.logs.unshift(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  private consoleLog(entry: ErrorLogEntry): void {
    const logData = {
      ...entry,
      formattedMessage: `[${entry.level.toUpperCase()}] ${entry.source}: ${entry.message}`,
    };

    switch (entry.level) {
      case 'critical':
      case 'high':
        console.error(logData);
        break;
      case 'medium':
        console.warn(logData);
        break;
      case 'low':
        console.info(logData);
        break;
    }
  }

  private async showToastNotification(entry: ErrorLogEntry): Promise<void> {
    // Only show toast for certain error levels and sources
    const shouldShowToast =
      (entry.level === 'high' || entry.level === 'critical') &&
      (entry.source === 'api' || entry.source === 'network');

    if (!shouldShowToast) return;

    try {
      const notifications = await getNotificationService();

      // Don't show toast for authentication errors (handled elsewhere)
      if (entry.statusCode === 401 || entry.statusCode === 403) {
        return;
      }

      // Show appropriate toast based on error type
      if (entry.source === 'network') {
        notifications.warning('Error de conexión. Verifica tu conexión a internet.');
      } else if (entry.statusCode && entry.statusCode >= 500) {
        notifications.error('Error del servidor. Intenta nuevamente más tarde.');
      } else if (entry.level === 'critical') {
        notifications.error('Ocurrió un error crítico. La página se recargará automáticamente.');

        // Auto-reload for critical errors after a delay
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      // Fallback - don't create infinite error loops
      console.warn('Could not show error notification:', error);
    }
  }

  private sendToExternalService(entry: ErrorLogEntry): void {
    // TODO: Implement external logging service integration
    // Examples: Sentry, LogRocket, Datadog, etc.

    // For now, only log critical errors to avoid spam
    if (entry.level === 'critical') {
      // This could be Sentry, LogRocket, or custom logging endpoint
      console.log('Would send to external service:', entry);
    }
  }
}

// Global error handler for unhandled errors
const setupGlobalErrorHandlers = () => {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      source: 'client',
      level: 'high',
      additionalInfo: { type: 'unhandledrejection', reason: event.reason },
    });
  });

  // Global error handler
  window.addEventListener('error', (event) => {
    errorLogger.logError({
      message: event.message || 'Global Error',
      stack: event.error?.stack,
      source: 'client',
      level: 'high',
      additionalInfo: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'error',
      },
    });
  });
};

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Auto-setup global handlers
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}
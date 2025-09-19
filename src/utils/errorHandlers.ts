import { errorLogger } from './errorLogger';
import type { AppError } from '@/types/error';

/**
 * Enhanced error creation utility
 */
export const createAppError = (
  message: string,
  options: {
    code?: string;
    statusCode?: number;
    source?: AppError['source'];
    details?: any;
  } = {}
): AppError => {
  const error = new Error(message) as AppError;
  error.code = options.code;
  error.statusCode = options.statusCode;
  error.source = options.source || 'unknown';
  error.details = options.details;
  error.timestamp = new Date().toISOString();

  return error;
};

/**
 * Safe async function wrapper that catches and logs errors
 */
export const safeAsync = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: Error) => void
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = error instanceof Error ? error : new Error(String(error));

      errorLogger.logErrorObject(appError, 'client', 'medium');

      if (errorHandler) {
        errorHandler(appError);
      }

      return null;
    }
  };
};

/**
 * Safe synchronous function wrapper that catches and logs errors
 */
export const safeSync = <T extends any[], R>(
  fn: (...args: T) => R,
  errorHandler?: (error: Error) => void
) => {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      const appError = error instanceof Error ? error : new Error(String(error));

      errorLogger.logErrorObject(appError, 'client', 'medium');

      if (errorHandler) {
        errorHandler(appError);
      }

      return null;
    }
  };
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        errorLogger.logError({
          message: `Retry failed after ${maxRetries} attempts: ${lastError.message}`,
          stack: lastError.stack,
          source: 'client',
          level: 'high',
          additionalInfo: {
            attempts: maxRetries + 1,
            finalError: lastError,
          },
        });
        throw lastError;
      }

      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));

      errorLogger.logError({
        message: `Retry attempt ${attempt + 1} failed: ${lastError.message}`,
        source: 'client',
        level: 'low',
        additionalInfo: {
          attempt: attempt + 1,
          maxRetries,
          nextDelay: delay * 2,
        },
      });
    }
  }

  throw lastError!;
};

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: any): string => {
  // Log the error
  errorLogger.logApiError(error);

  // Network error
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR') {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    if (error.code === 'TIMEOUT') {
      return 'La solicitud tardó demasiado tiempo. Intenta nuevamente.';
    }
    return 'Error de red. Intenta nuevamente.';
  }

  // HTTP error responses
  const status = error.response.status;
  const message = error.response.data?.message;

  switch (status) {
    case 400:
      return message || 'Datos inválidos. Verifica la información ingresada.';
    case 401:
      return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 409:
      return message || 'Conflicto con los datos existentes.';
    case 422:
      return message || 'Datos de entrada inválidos.';
    case 429:
      return 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.';
    case 500:
      return 'Error interno del servidor. Intenta nuevamente más tarde.';
    case 502:
    case 503:
    case 504:
      return 'Servicio temporalmente no disponible. Intenta nuevamente más tarde.';
    default:
      return message || `Error ${status}. Intenta nuevamente.`;
  }
};

/**
 * Global unhandled error boundary
 */
export const setupErrorReporting = () => {
  // Report errors to external service (when available)
  const reportError = (error: Error, errorInfo?: any) => {
    // TODO: Integrate with external error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });

    errorLogger.logErrorObject(error, 'client', 'high');
  };

  return {
    reportError,
  };
};
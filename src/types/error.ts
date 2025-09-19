export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
  timestamp?: string;
  source?: 'api' | 'client' | 'network' | 'unknown';
}

export interface ErrorInfo {
  componentStack: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export type ErrorLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorLogEntry {
  id: string;
  message: string;
  stack?: string;
  code?: string;
  statusCode?: number;
  source: AppError['source'];
  level: ErrorLevel;
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: number;
  additionalInfo?: any;
}
import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ErrorType = 'error' | 'warning' | 'info' | 'critical';

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: ErrorType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card' | 'banner' | 'page';
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryText?: string;
  retryLoading?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
  size = 'md',
  variant = 'inline',
  showIcon = true,
  dismissible = false,
  onDismiss,
  onRetry,
  retryText = 'Intentar nuevamente',
  retryLoading = false,
  className = '',
  actions,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          title: 'text-red-900',
          message: 'text-red-700',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          title: 'text-yellow-900',
          message: 'text-yellow-700',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-500',
          title: 'text-blue-900',
          message: 'text-blue-700',
        };
      case 'critical':
        return {
          container: 'bg-red-100 border-red-300 text-red-900',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-800',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-500',
          title: 'text-gray-900',
          message: 'text-gray-700',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          icon: 'h-4 w-4',
          title: 'text-sm font-medium',
          message: 'text-xs',
          button: 'text-xs px-2 py-1',
        };
      case 'lg':
        return {
          container: 'p-6',
          icon: 'h-6 w-6',
          title: 'text-lg font-semibold',
          message: 'text-base',
          button: 'text-base px-4 py-2',
        };
      default:
        return {
          container: 'p-4',
          icon: 'h-5 w-5',
          title: 'text-base font-medium',
          message: 'text-sm',
          button: 'text-sm px-3 py-2',
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'banner':
        return 'border-l-4 border-t-0 border-r-0 border-b-0 rounded-none';
      case 'card':
        return 'border rounded-lg shadow-sm';
      case 'page':
        return 'border rounded-lg shadow-sm max-w-md mx-auto';
      default:
        return 'border rounded-md';
    }
  };

  const typeClasses = getTypeClasses();
  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  const content = (
    <div className={cn(
      typeClasses.container,
      sizeClasses.container,
      variantClasses,
      className
    )}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <div className={cn(typeClasses.icon, sizeClasses.icon)}>
              {getIcon()}
            </div>
          </div>
        )}

        <div className={cn('flex-1', showIcon && 'ml-3')}>
          {title && (
            <h3 className={cn(typeClasses.title, sizeClasses.title, 'mb-1')}>
              {title}
            </h3>
          )}

          <p className={cn(typeClasses.message, sizeClasses.message)}>
            {message}
          </p>

          {(onRetry || actions) && (
            <div className="mt-3 flex items-center space-x-2">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  disabled={retryLoading}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'inline-flex items-center space-x-1',
                    sizeClasses.button
                  )}
                >
                  <RefreshCw className={cn(
                    'h-4 w-4',
                    retryLoading && 'animate-spin'
                  )} />
                  <span>{retryText}</span>
                </Button>
              )}
              {actions}
            </div>
          )}
        </div>

        {dismissible && onDismiss && (
          <div className="flex-shrink-0 ml-4">
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="sm"
              className={cn(
                'h-auto p-0',
                typeClasses.icon
              )}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'page') {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized error components for common use cases
interface ApiErrorProps {
  error: any;
  onRetry?: () => void;
  retryLoading?: boolean;
  className?: string;
}

export const ApiError: React.FC<ApiErrorProps> = ({
  error,
  onRetry,
  retryLoading = false,
  className = '',
}) => {
  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'Ha ocurrido un error inesperado';
  };

  const getErrorTitle = () => {
    if (error?.response?.status === 404) return 'Recurso no encontrado';
    if (error?.response?.status === 403) return 'Acceso denegado';
    if (error?.response?.status === 401) return 'No autorizado';
    if (error?.response?.status >= 500) return 'Error del servidor';
    return 'Error';
  };

  return (
    <ErrorMessage
      title={getErrorTitle()}
      message={getErrorMessage()}
      type="error"
      variant="card"
      onRetry={onRetry}
      retryLoading={retryLoading}
      className={className}
    />
  );
};

interface FormErrorProps {
  errors: string | string[];
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  errors,
  className = '',
}) => {
  const errorList = Array.isArray(errors) ? errors : [errors];

  return (
    <ErrorMessage
      message={errorList.join('. ')}
      type="error"
      size="sm"
      variant="inline"
      showIcon={false}
      className={className}
    />
  );
};

interface NetworkErrorProps {
  onRetry?: () => void;
  retryLoading?: boolean;
  className?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  retryLoading = false,
  className = '',
}) => (
  <ErrorMessage
    title="Error de conexión"
    message="No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo nuevamente."
    type="error"
    variant="page"
    onRetry={onRetry}
    retryLoading={retryLoading}
    className={className}
  />
);

interface NotFoundErrorProps {
  title?: string;
  message?: string;
  onGoBack?: () => void;
  className?: string;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({
  title = '¡Ups! Página no encontrada',
  message = 'La página que estás buscando no existe o ha sido movida.',
  onGoBack,
  className = '',
}) => (
  <ErrorMessage
    title={title}
    message={message}
    type="warning"
    variant="page"
    className={className}
    actions={onGoBack && (
      <Button onClick={onGoBack} variant="outline" size="sm">
        Regresar
      </Button>
    )}
  />
);

interface ValidationErrorProps {
  message: string;
  field?: string;
  className?: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({
  message,
  field,
  className = '',
}) => (
  <ErrorMessage
    message={field ? `${field}: ${message}` : message}
    type="warning"
    size="sm"
    variant="inline"
    showIcon={false}
    className={cn('mt-1', className)}
  />
);

// Error components collection
export const ErrorComponents = {
  Base: ErrorMessage,
  Api: ApiError,
  Form: FormError,
  Network: NetworkError,
  NotFound: NotFoundError,
  Validation: ValidationError,
};

export default ErrorMessage;
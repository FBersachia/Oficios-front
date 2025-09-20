import toast from 'react-hot-toast';
import type { ToastType, ToastOptions, CustomToastData } from '@/types/notifications';

class NotificationService {
  private defaultOptions: ToastOptions = {
    duration: 4000,
    position: 'top-right',
  };

  /**
   * Configure default options for all toasts
   */
  configure(options: Partial<ToastOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Show a success notification
   */
  success(message: string, options?: ToastOptions): string {
    return toast.success(message, this.mergeOptions(options));
  }

  /**
   * Show an error notification
   */
  error(message: string, options?: ToastOptions): string {
    return toast.error(message, this.mergeOptions(options));
  }

  /**
   * Show a warning notification (using custom styling)
   */
  warning(message: string, options?: ToastOptions): string {
    return toast(message, {
      ...this.mergeOptions(options),
      icon: '⚠️',
      style: {
        background: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #F59E0B',
      },
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, options?: ToastOptions): string {
    return toast(message, {
      ...this.mergeOptions(options),
      icon: 'ℹ️',
      style: {
        background: '#DBEAFE',
        color: '#1E40AF',
        border: '1px solid #3B82F6',
      },
    });
  }

  /**
   * Show a loading notification
   */
  loading(message: string = 'Cargando...', options?: ToastOptions): string {
    return toast.loading(message, this.mergeOptions(options));
  }

  /**
   * Show a custom notification with advanced features
   */
  custom(data: CustomToastData, options?: ToastOptions): string {
    const { title, message, type, actionLabel, onAction, dismissible = true } = data;

    const customContent = (
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex-shrink-0">
          {this.getIconForType(type)}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <div className="text-sm font-medium text-gray-900 mb-1">
              {title}
            </div>
          )}
          <div className="text-sm text-gray-700">
            {message}
          </div>
          {actionLabel && onAction && (
            <div className="mt-2">
              <button
                onClick={() => {
                  onAction();
                  if (dismissible) {
                    toast.dismiss();
                  }
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>
        {dismissible && (
          <button
            onClick={() => toast.dismiss()}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );

    return toast.custom(customContent, {
      ...this.mergeOptions(options),
      style: {
        background: 'white',
        color: '#374151',
        border: '1px solid #E5E7EB',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '12px',
        maxWidth: '400px',
        ...options?.style,
      },
    });
  }

  /**
   * Show a promise-based notification (loading -> success/error)
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ): Promise<T> {
    return toast.promise(
      promise,
      messages,
      this.mergeOptions(options)
    );
  }

  /**
   * Dismiss a specific toast by ID
   */
  dismiss(toastId?: string): void {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    toast.dismiss();
  }

  /**
   * Remove a specific toast by ID
   */
  remove(toastId: string): void {
    toast.remove(toastId);
  }

  /**
   * Get global toast configuration
   */
  getConfig() {
    return this.defaultOptions;
  }

  private mergeOptions(options?: ToastOptions): any {
    return {
      duration: options?.duration ?? this.defaultOptions.duration,
      position: options?.position ?? this.defaultOptions.position,
      id: options?.id,
      icon: options?.icon,
      className: options?.className,
      style: options?.style,
      ariaProps: options?.ariaProps,
    };
  }

  private getIconForType(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'loading':
        return '⏳';
      default:
        return 'ℹ️';
    }
  }
}

// Create and export singleton instance
export const notificationService = new NotificationService();
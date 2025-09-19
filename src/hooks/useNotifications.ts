import { useCallback } from 'react';
import { notificationService } from '@/services/notificationService.tsx';
import { handleApiError } from '@/utils/errorHandlers';
import type { ToastOptions, CustomToastData } from '@/types/notifications';

export const useNotifications = () => {
  // Basic notification methods
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    return notificationService.success(message, options);
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    return notificationService.error(message, options);
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    return notificationService.warning(message, options);
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    return notificationService.info(message, options);
  }, []);

  const showLoading = useCallback((message?: string, options?: ToastOptions) => {
    return notificationService.loading(message, options);
  }, []);

  // Advanced notification methods
  const showCustom = useCallback((data: CustomToastData, options?: ToastOptions) => {
    return notificationService.custom(data, options);
  }, []);

  const showPromise = useCallback(<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => {
    return notificationService.promise(promise, messages, options);
  }, []);

  // API-specific notification methods
  const showApiError = useCallback((error: any, customMessage?: string) => {
    const message = customMessage || handleApiError(error);
    return notificationService.error(message);
  }, []);

  const showApiSuccess = useCallback((message: string = 'Operación completada exitosamente') => {
    return notificationService.success(message);
  }, []);

  // Form-specific notification methods
  const showFormError = useCallback((fieldErrors: Record<string, string[]>) => {
    const firstError = Object.values(fieldErrors).flat()[0];
    if (firstError) {
      return notificationService.error(firstError);
    }
  }, []);

  const showValidationError = useCallback((message: string = 'Por favor, corrige los errores en el formulario') => {
    return notificationService.warning(message);
  }, []);

  // Authentication-specific notifications
  const showLoginSuccess = useCallback((userName?: string) => {
    const message = userName ? `¡Bienvenido, ${userName}!` : '¡Sesión iniciada exitosamente!';
    return notificationService.success(message);
  }, []);

  const showLogoutSuccess = useCallback(() => {
    return notificationService.info('Sesión cerrada exitosamente');
  }, []);

  const showSessionExpired = useCallback(() => {
    return notificationService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
  }, []);

  // Action confirmation notifications
  const showDeleteConfirmation = useCallback((
    itemName: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    return notificationService.custom({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      type: 'warning',
      actionLabel: 'Eliminar',
      onAction: onConfirm,
      dismissible: true,
    }, {
      duration: 0, // Don't auto-dismiss
    });
  }, []);

  // Network status notifications
  const showOfflineWarning = useCallback(() => {
    return notificationService.warning('Sin conexión a internet. Verifica tu conexión.');
  }, []);

  const showOnlineSuccess = useCallback(() => {
    return notificationService.success('Conexión restablecida');
  }, []);

  // Utility methods
  const dismiss = useCallback((toastId?: string) => {
    notificationService.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    notificationService.dismissAll();
  }, []);

  const remove = useCallback((toastId: string) => {
    notificationService.remove(toastId);
  }, []);

  // Configuration
  const configure = useCallback((options: Partial<ToastOptions>) => {
    notificationService.configure(options);
  }, []);

  return {
    // Basic methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showCustom,
    showPromise,

    // API methods
    showApiError,
    showApiSuccess,

    // Form methods
    showFormError,
    showValidationError,

    // Auth methods
    showLoginSuccess,
    showLogoutSuccess,
    showSessionExpired,

    // Action methods
    showDeleteConfirmation,

    // Network methods
    showOfflineWarning,
    showOnlineSuccess,

    // Utility methods
    dismiss,
    dismissAll,
    remove,
    configure,
  };
};

// Network status detection hook
export const useNetworkNotifications = () => {
  const { showOfflineWarning, showOnlineSuccess } = useNotifications();

  const setupNetworkListeners = useCallback(() => {
    const handleOnline = () => showOnlineSuccess();
    const handleOffline = () => showOfflineWarning();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showOnlineSuccess, showOfflineWarning]);

  return { setupNetworkListeners };
};

export default useNotifications;
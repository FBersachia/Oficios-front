export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  id?: string;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaProps?: {
    role?: 'status' | 'alert';
    'aria-live'?: 'assertive' | 'off' | 'polite';
  };
}

export interface NotificationServiceConfig {
  defaultDuration: number;
  defaultPosition: ToastOptions['position'];
  maxToasts: number;
  reverseOrder: boolean;
}

export interface CustomToastData {
  title?: string;
  message: string;
  type: ToastType;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
}
import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            maxWidth: '400px',
          },
          // Success toasts
          success: {
            duration: 3000,
            style: {
              background: '#F0FDF4',
              color: '#166534',
              border: '1px solid #22C55E',
            },
            iconTheme: {
              primary: '#22C55E',
              secondary: '#F0FDF4',
            },
          },
          // Error toasts
          error: {
            duration: 5000,
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #EF4444',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEF2F2',
            },
          },
          // Loading toasts
          loading: {
            duration: Infinity,
            style: {
              background: '#F9FAFB',
              color: '#6B7280',
              border: '1px solid #D1D5DB',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastProvider } from './ToastProvider';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  showHeader?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  showFooter = true,
  showHeader = true,
}) => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Header */}
          {showHeader && <Header />}

          {/* Main Content */}
          <main className={`flex-1 ${className}`}>
            {children}
          </main>

          {/* Footer */}
          {showFooter && <Footer />}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
};

// Specialized layout variants for different page types

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Standard page layout with padding and container
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <Layout className={`py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </Layout>
  );
};

/**
 * Full-width layout without container padding
 */
export const FullWidthLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <Layout className={className}>
      {children}
    </Layout>
  );
};

/**
 * Centered layout for forms and authentication pages
 */
export const CenteredLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <Layout
      className={`flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] py-12 ${className}`}
      showFooter={false}
    >
      <div className="max-w-md w-full space-y-8 px-4">
        {(title || description) && (
          <div className="text-center">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </Layout>
  );
};

/**
 * Dashboard layout with sidebar space reserved
 */
export const DashboardLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <Layout className={`bg-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || description) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm">
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default Layout;
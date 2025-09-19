import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'refresh';
  className?: string;
  color?: 'blue' | 'gray' | 'white' | 'green' | 'red';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  color = 'blue',
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'text-blue-500',
    gray: 'text-gray-500',
    white: 'text-white',
    green: 'text-green-500',
    red: 'text-red-500',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            className={cn(
              'animate-spin',
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        );

      case 'refresh':
        return (
          <RefreshCw
            className={cn(
              'animate-spin',
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full animate-pulse',
                  size === 'sm' ? 'h-1 w-1' :
                  size === 'md' ? 'h-2 w-2' :
                  size === 'lg' ? 'h-3 w-3' : 'h-4 w-4',
                  color === 'blue' ? 'bg-blue-500' :
                  color === 'gray' ? 'bg-gray-500' :
                  color === 'white' ? 'bg-white' :
                  color === 'green' ? 'bg-green-500' : 'bg-red-500'
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={cn(
              'rounded-full animate-pulse',
              sizeClasses[size],
              color === 'blue' ? 'bg-blue-500' :
              color === 'gray' ? 'bg-gray-500' :
              color === 'white' ? 'bg-white' :
              color === 'green' ? 'bg-green-500' : 'bg-red-500'
            )}
          />
        );

      default:
        return (
          <Loader2
            className={cn(
              'animate-spin',
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        );
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-2',
      className
    )}>
      {renderSpinner()}
      {text && (
        <p className={cn(
          'font-medium',
          textSizeClasses[size],
          colorClasses[color]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components for common use cases
interface PageLoadingProps {
  text?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  text = 'Cargando...',
  className = ''
}) => (
  <div className={cn(
    'flex items-center justify-center min-h-[200px] py-12',
    className
  )}>
    <LoadingSpinner size="lg" text={text} />
  </div>
);

interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  size = 'sm',
  className = ''
}) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <LoadingSpinner size={size} />
    {text && (
      <span className="text-sm text-gray-600">{text}</span>
    )}
  </div>
);

interface ButtonLoadingProps {
  size?: 'sm' | 'md';
  color?: 'white' | 'blue';
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = 'sm',
  color = 'white',
  className = ''
}) => (
  <LoadingSpinner
    size={size}
    color={color}
    className={className}
  />
);

// Skeleton loading components
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animate = true
}) => (
  <div
    className={cn(
      'bg-gray-200 rounded',
      animate && 'animate-pulse',
      className
    )}
  />
);

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = ''
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          'h-4',
          index === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <Skeleton
      className={cn(
        'rounded-full',
        sizeClasses[size],
        className
      )}
    />
  );
};

interface SkeletonCardProps {
  showImage?: boolean;
  showAvatar?: boolean;
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = false,
  showAvatar = false,
  lines = 3,
  className = '',
}) => (
  <div className={cn('p-4 space-y-4', className)}>
    {showImage && <Skeleton className="h-48 w-full rounded-lg" />}

    <div className="space-y-3">
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <SkeletonAvatar size="sm" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <SkeletonText lines={lines} />
      </div>

      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  </div>
);

// Loading states for different contexts
export const LoadingStates = {
  Page: PageLoading,
  Inline: InlineLoading,
  Button: ButtonLoading,
  Spinner: LoadingSpinner,
  Skeleton: {
    Base: Skeleton,
    Text: SkeletonText,
    Avatar: SkeletonAvatar,
    Card: SkeletonCard,
  },
};

export default LoadingSpinner;
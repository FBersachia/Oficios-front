import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    'animate-pulse bg-gray-200 rounded',
    className
  )} />
);

interface ProviderSkeletonProps {
  className?: string;
}

export const ProviderSkeleton: React.FC<ProviderSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200',
      className
    )}>
      <div className="p-6">
        {/* Header with image and basic info */}
        <div className="flex items-start space-x-4 mb-4">
          {/* Profile Image Skeleton */}
          <Skeleton className="w-16 h-16 rounded-lg" />

          {/* Basic Info Skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center space-x-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16 ml-2" />
            </div>
          </div>

          {/* Availability Status Skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Services Skeleton */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>

        {/* Bio Skeleton */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Contact Info Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

interface ProviderGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProviderGridSkeleton: React.FC<ProviderGridSkeletonProps> = ({
  count = 6,
  className = '',
}) => {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <ProviderSkeleton key={index} />
      ))}
    </div>
  );
};

interface ProviderListSkeletonProps {
  count?: number;
  className?: string;
}

export const ProviderListSkeleton: React.FC<ProviderListSkeletonProps> = ({
  count = 4,
  className = '',
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProviderSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProviderSkeleton;
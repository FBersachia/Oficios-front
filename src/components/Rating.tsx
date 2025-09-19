import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showTotal?: boolean;
  readonly?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  totalReviews,
  size = 'md',
  showTotal = true,
  readonly = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={cn(
            sizeClasses[size],
            'fill-yellow-400 text-yellow-400'
          )}
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star
            className={cn(
              sizeClasses[size],
              'text-gray-300'
            )}
          />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star
              className={cn(
                sizeClasses[size],
                'fill-yellow-400 text-yellow-400'
              )}
            />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={cn(
            sizeClasses[size],
            'text-gray-300'
          )}
        />
      );
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex items-center space-x-0.5">
        {renderStars()}
      </div>

      <span className={cn(
        'font-medium text-gray-900',
        textSizeClasses[size]
      )}>
        {rating.toFixed(1)}
      </span>

      {showTotal && totalReviews !== undefined && (
        <span className={cn(
          'text-gray-500',
          textSizeClasses[size]
        )}>
          ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
        </span>
      )}
    </div>
  );
};

export default Rating;
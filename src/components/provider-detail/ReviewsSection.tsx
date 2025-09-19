import React, { useState, useEffect } from 'react';
import { Star, Filter, ChevronDown, ThumbsUp, Flag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/Rating';
import { Pagination, usePagination } from '@/components/Pagination';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  service?: string;
  images?: string[];
  response?: {
    text: string;
    date: string;
    authorName: string;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  onWriteReview?: () => void;
  onHelpfulClick?: (reviewId: string) => void;
  onReportReview?: (reviewId: string) => void;
  className?: string;
}

interface ReviewFilters {
  rating?: number;
  hasImages?: boolean;
  verified?: boolean;
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  totalReviews,
  averageRating,
  onWriteReview,
  onHelpfulClick,
  onReportReview,
  className = '',
}) => {
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);

  const pagination = usePagination(filteredReviews.length, {
    itemsPerPage: 10,
  });

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...reviews];

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === filters.rating);
    }

    // Apply images filter
    if (filters.hasImages) {
      filtered = filtered.filter(review => review.images && review.images.length > 0);
    }

    // Apply verified filter
    if (filters.verified) {
      filtered = filtered.filter(review => review.verified);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, filters]);

  // Get reviews for current page
  const currentReviews = filteredReviews.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  // Rating distribution for filters
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / reviews.length) * 100,
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.rating) count++;
    if (filters.hasImages) count++;
    if (filters.verified) count++;
    return count;
  };

  return (
    <div className={cn('py-12 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reseñas y calificaciones
              </h2>
              <div className="flex items-center space-x-4">
                <Rating
                  rating={averageRating}
                  totalReviews={totalReviews}
                  size="lg"
                />
                <span className="text-gray-600">
                  Basado en {totalReviews} reseñas
                </span>
              </div>
            </div>

            <div className="mt-4 lg:mt-0">
              <Button
                onClick={onWriteReview}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Escribir reseña
              </Button>
            </div>
          </div>

          {/* Rating distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de calificaciones
              </h3>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div
                    key={rating}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() =>
                      setFilters(prev => ({
                        ...prev,
                        rating: prev.rating === rating ? undefined : rating,
                      }))
                    }
                  >
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          filters.rating === rating ? 'bg-blue-600' : 'bg-gray-400'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas adicionales
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reseñas verificadas</span>
                  <span className="font-medium">
                    {reviews.filter(r => r.verified).length} de {reviews.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Con fotos</span>
                  <span className="font-medium">
                    {reviews.filter(r => r.images && r.images.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Con respuesta</span>
                  <span className="font-medium">
                    {reviews.filter(r => r.response).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and sorting */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="inline-flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {getFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {getFilterCount()}
                  </span>
                )}
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform',
                  showFilters && 'rotate-180'
                )} />
              </Button>

              <div className="text-sm text-gray-600">
                Mostrando {filteredReviews.length} de {reviews.length} reseñas
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters(prev => ({
                    ...prev,
                    sortBy: e.target.value as ReviewFilters['sortBy'],
                  }))
                }
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="highest">Mejor calificados</option>
                <option value="lowest">Peor calificados</option>
                <option value="helpful">Más útiles</option>
              </select>
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.hasImages || false}
                      onChange={(e) =>
                        setFilters(prev => ({
                          ...prev,
                          hasImages: e.target.checked ? true : undefined,
                        }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Con fotos</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.verified || false}
                      onChange={(e) =>
                        setFilters(prev => ({
                          ...prev,
                          verified: e.target.checked ? true : undefined,
                        }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Solo verificadas</span>
                  </label>
                </div>
                <div>
                  <Button
                    onClick={() => setFilters({ sortBy: 'newest' })}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews list */}
        <div className="space-y-6">
          {currentReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6">
              {/* Review header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.authorAvatar ? (
                      <img
                        src={review.authorAvatar}
                        alt={review.authorName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {review.authorName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {review.authorName}
                      </span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verificado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Rating rating={review.rating} size="sm" showTotal={false} />
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                      {review.service && (
                        <span className="text-sm text-gray-500">
                          · {review.service}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Review content */}
              <div className="mb-4">
                {review.title && (
                  <h4 className="font-medium text-gray-900 mb-2">
                    {review.title}
                  </h4>
                )}
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Review images */}
              {review.images && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Review actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => onHelpfulClick?.(review.id)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful > 0 && review.helpful}</span>
                    <span>Útil</span>
                  </Button>
                </div>

                <Button
                  onClick={() => onReportReview?.(review.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Reportar
                </Button>
              </div>

              {/* Provider response */}
              {review.response && (
                <div className="mt-4 pt-4 border-t border-gray-200 bg-blue-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Respuesta de {review.response.authorName}
                    </span>
                    <span className="text-sm text-blue-700">
                      {formatDate(review.response.date)}
                    </span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    {review.response.text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredReviews.length > 10 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              showPreviousNext={true}
            />
          </div>
        )}

        {/* Empty state */}
        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay reseñas que coincidan
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros para ver más reseñas.
            </p>
            <Button
              onClick={() => setFilters({ sortBy: 'newest' })}
              variant="outline"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
import React, { useState, useEffect, useCallback } from 'react';
import { ProviderCard } from './ProviderCard';
import { ProviderGridSkeleton } from './ProviderSkeleton';
import { NoResultsState } from './NoResultsState';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import type { Provider, ProvidersSearchParams } from '@/types/api';
import { providerService } from '@/services/providerService';

interface ProviderGridProps {
  providers?: Provider[];
  loading?: boolean;
  error?: string | null;
  searchParams?: ProvidersSearchParams;
  onProviderContact?: (provider: Provider) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  className?: string;
  emptyMessage?: string;
  showContactButton?: boolean;
  enableInfiniteScroll?: boolean;
  onClearFilters?: () => void;
  onSearchSuggestion?: (suggestion: string) => void;
  onLocationSuggestion?: (location: string) => void;
}

export const ProviderGrid: React.FC<ProviderGridProps> = ({
  providers = [],
  loading = false,
  error = null,
  searchParams,
  onProviderContact,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  className = '',
  emptyMessage = 'No se encontraron proveedores con los criterios de búsqueda.',
  showContactButton = true,
  enableInfiniteScroll = false,
  onClearFilters,
  onSearchSuggestion,
  onLocationSuggestion,
}) => {
  const { showApiError } = useNotifications();
  const [isRetrying, setIsRetrying] = useState(false);

  // Infinite scroll logic
  const handleScroll = useCallback(() => {
    if (!enableInfiniteScroll || !hasMore || loadingMore || loading) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Trigger load more when user is 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      onLoadMore?.();
    }
  }, [enableInfiniteScroll, hasMore, loadingMore, loading, onLoadMore]);

  useEffect(() => {
    if (enableInfiniteScroll) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, enableInfiniteScroll]);

  const handleRetry = async () => {
    if (!searchParams) return;

    setIsRetrying(true);
    try {
      await providerService.searchProviders(searchParams);
    } catch (err: any) {
      showApiError(err, 'Error al recargar los proveedores');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleProviderContact = (provider: Provider) => {
    if (provider.availabilityStatus === 'unavailable') {
      showApiError(null, 'Este proveedor no está disponible actualmente');
      return;
    }
    onProviderContact?.(provider);
  };

  // Loading state
  if (loading && providers.length === 0) {
    return (
      <div className={className}>
        <ProviderGridSkeleton count={6} />
      </div>
    );
  }

  // Error state
  if (error && providers.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar proveedores
          </h3>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center space-x-2"
          >
            <RefreshCw className={cn(
              'h-4 w-4',
              isRetrying && 'animate-spin'
            )} />
            <span>Intentar nuevamente</span>
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && providers.length === 0) {
    // Use NoResultsState if handlers are provided (search results page)
    if (onClearFilters && onSearchSuggestion && onLocationSuggestion && searchParams) {
      return (
        <NoResultsState
          searchParams={searchParams}
          onClearFilters={onClearFilters}
          onSearchSuggestion={onSearchSuggestion}
          onLocationSuggestion={onLocationSuggestion}
          className={className}
        />
      );
    }

    // Fallback to simple empty state
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay proveedores disponibles
          </h3>
          <p className="text-gray-600">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            showContactButton={showContactButton}
            onContact={handleProviderContact}
            className="h-full"
          />
        ))}
      </div>

      {/* Load More Button (for non-infinite scroll) */}
      {!enableInfiniteScroll && hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            className="inline-flex items-center space-x-2"
          >
            {loadingMore ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Cargando...</span>
              </>
            ) : (
              <span>Cargar más proveedores</span>
            )}
          </Button>
        </div>
      )}

      {/* Infinite Scroll Loading */}
      {enableInfiniteScroll && loadingMore && (
        <div className="mt-8">
          <ProviderGridSkeleton count={3} />
        </div>
      )}

      {/* No more results indicator */}
      {!hasMore && providers.length > 0 && (
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500 text-sm">
            Has visto todos los proveedores disponibles
          </p>
        </div>
      )}
    </div>
  );
};

interface ProviderListProps extends Omit<ProviderGridProps, 'className'> {
  className?: string;
}

export const ProviderList: React.FC<ProviderListProps> = ({
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <ProviderGrid
        {...props}
        className="space-y-4"
      />
    </div>
  );
};

export default ProviderGrid;
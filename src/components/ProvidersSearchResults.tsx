import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, MapPin, Users, Sliders } from 'lucide-react';
import { FilterPanel } from '@/components/FilterPanel';
import { ProviderGrid } from '@/components/ProviderGrid';
import { SortSelector, type SortOption } from '@/components/SortSelector';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { providerService } from '@/services/providerService';
import { useNotifications } from '@/hooks/useNotifications';
import type { Provider, ProvidersSearchParams, Service } from '@/types/api';

interface ActiveFilter {
  type: 'service' | 'location' | 'rating' | 'availability';
  value: string | number;
  label: string;
}

interface ProvidersSearchResultsProps {
  className?: string;
}

export const ProvidersSearchResults: React.FC<ProvidersSearchResultsProps> = ({
  className = '',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showApiError } = useNotifications();

  // State
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Mock data for services and locations
  const [services] = useState<Service[]>([
    { id: 1, name: 'Plomería', description: 'Reparaciones e instalaciones' },
    { id: 2, name: 'Electricidad', description: 'Instalaciones eléctricas' },
    { id: 3, name: 'Carpintería', description: 'Muebles y reparaciones' },
    { id: 4, name: 'Pintura', description: 'Interior y exterior' },
    { id: 5, name: 'Limpieza', description: 'Limpieza profunda' },
    { id: 6, name: 'Jardinería', description: 'Diseño y mantenimiento' },
  ]);

  const [locations] = useState<string[]>([
    'Ciudad de México',
    'Guadalajara',
    'Monterrey',
    'Puebla',
    'Tijuana',
    'León',
    'Juárez',
    'Torreón',
  ]);

  // Parse URL parameters into search filters
  const getFiltersFromURL = useCallback((): ProvidersSearchParams => {
    const params: ProvidersSearchParams = {};

    const query = searchParams.get('q');
    if (query) params.query = query;

    const service = searchParams.get('service');
    if (service) params.serviceIds = [parseInt(service)];

    const location = searchParams.get('location');
    if (location) params.cities = [location];

    const minRating = searchParams.get('minRating');
    if (minRating) params.minRating = parseFloat(minRating);

    const availability = searchParams.get('availability');
    if (availability) params.availabilityStatuses = availability.split(',');

    const sort = searchParams.get('sort') as SortOption;
    if (sort) params.sortBy = sort;

    const page = searchParams.get('page');
    if (page) params.page = parseInt(page);

    return params;
  }, [searchParams]);

  // Update URL with current filters
  const updateURL = useCallback((filters: ProvidersSearchParams) => {
    const newParams = new URLSearchParams();

    if (filters.query) newParams.set('q', filters.query);
    if (filters.serviceIds?.length) newParams.set('service', filters.serviceIds[0].toString());
    if (filters.cities?.length) newParams.set('location', filters.cities[0]);
    if (filters.minRating && filters.minRating > 0) newParams.set('minRating', filters.minRating.toString());
    if (filters.availabilityStatuses?.length) newParams.set('availability', filters.availabilityStatuses.join(','));
    if (filters.sortBy) newParams.set('sort', filters.sortBy);
    if (filters.page && filters.page > 1) newParams.set('page', filters.page.toString());

    setSearchParams(newParams);
  }, [setSearchParams]);

  // Get active filters for display
  const getActiveFilters = useCallback((): ActiveFilter[] => {
    const filters = getFiltersFromURL();
    const activeFilters: ActiveFilter[] = [];

    if (filters.serviceIds?.length) {
      const service = services.find(s => s.id === filters.serviceIds![0]);
      if (service) {
        activeFilters.push({
          type: 'service',
          value: service.id,
          label: service.name
        });
      }
    }

    if (filters.cities?.length) {
      activeFilters.push({
        type: 'location',
        value: filters.cities[0],
        label: filters.cities[0]
      });
    }

    if (filters.minRating && filters.minRating > 0) {
      activeFilters.push({
        type: 'rating',
        value: filters.minRating,
        label: `${filters.minRating}+ estrellas`
      });
    }

    if (filters.availabilityStatuses?.length) {
      filters.availabilityStatuses.forEach(status => {
        const label = status === 'available' ? 'Disponible' :
                      status === 'busy' ? 'Ocupado' : 'No disponible';
        activeFilters.push({
          type: 'availability',
          value: status,
          label
        });
      });
    }

    return activeFilters;
  }, [getFiltersFromURL, services]);

  // Fetch providers
  const fetchProviders = useCallback(async (reset = false) => {
    try {
      const filters = getFiltersFromURL();
      const page = reset ? 1 : currentPage;

      if (reset) {
        setLoading(true);
        setProviders([]);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await providerService.searchProviders({
        ...filters,
        page,
        limit: 12,
      });

      const newProviders = response.data || [];

      if (reset) {
        setProviders(newProviders);
        setCurrentPage(1);
      } else {
        setProviders(prev => [...prev, ...newProviders]);
      }

      setTotalCount(response.total || 0);
      setHasMore(newProviders.length === 12 && (response.total || 0) > page * 12);

      if (reset) {
        setCurrentPage(2);
      } else {
        setCurrentPage(prev => prev + 1);
      }

    } catch (err: any) {
      const errorMessage = 'Error al buscar proveedores';
      setError(errorMessage);
      if (reset) {
        showApiError(err, errorMessage);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getFiltersFromURL, currentPage, showApiError]);

  // Initialize search from URL
  useEffect(() => {
    const filters = getFiltersFromURL();
    setSearchQuery(filters.query || '');
    setSortBy(filters.sortBy || 'relevance');
    fetchProviders(true);
  }, [searchParams]);

  // Handle search
  const handleSearch = (query: string) => {
    const filters = getFiltersFromURL();
    updateURL({ ...filters, query, page: 1 });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: ProvidersSearchParams) => {
    updateURL({ ...newFilters, page: 1 });
  };

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    const filters = getFiltersFromURL();
    setSortBy(newSort);
    updateURL({ ...filters, sortBy: newSort, page: 1 });
  };

  // Handle filter removal
  const handleRemoveFilter = (filter: ActiveFilter) => {
    const filters = getFiltersFromURL();

    switch (filter.type) {
      case 'service':
        delete filters.serviceIds;
        break;
      case 'location':
        delete filters.cities;
        break;
      case 'rating':
        delete filters.minRating;
        break;
      case 'availability':
        if (filters.availabilityStatuses) {
          filters.availabilityStatuses = filters.availabilityStatuses.filter(
            status => status !== filter.value
          );
          if (filters.availabilityStatuses.length === 0) {
            delete filters.availabilityStatuses;
          }
        }
        break;
    }

    updateURL({ ...filters, page: 1 });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const filters = getFiltersFromURL();
    updateURL({ query: filters.query });
  };

  // Handle search suggestions
  const handleSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    const filters = getFiltersFromURL();
    updateURL({ ...filters, query: suggestion, page: 1 });
  };

  // Handle location suggestions
  const handleLocationSuggestion = (location: string) => {
    const filters = getFiltersFromURL();
    updateURL({ ...filters, cities: [location], page: 1 });
  };

  // Load more providers
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProviders(false);
    }
  };

  const activeFilters = getActiveFilters();
  const currentFilters = getFiltersFromURL();

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Search header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search bar */}
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Buscar por servicio, ubicación o nombre..."
                size="md"
              />
            </div>

            {/* Mobile filter toggle */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                variant="outline"
                className="w-full"
              >
                <Sliders className="h-4 w-4 mr-2" />
                Filtros
                {activeFilters.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {activeFilters.map((filter, index) => (
                  <span
                    key={`${filter.type}-${filter.value}-${index}`}
                    className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    <span>{filter.label}</span>
                    <button
                      onClick={() => handleRemoveFilter(filter)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Limpiar todos
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter panel - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterPanel
                filters={currentFilters}
                services={services}
                locations={locations}
                onFiltersChange={handleFiltersChange}
                onClear={handleClearFilters}
                loading={loading}
              />
            </div>
          </div>

          {/* Filter panel - Mobile */}
          {isFilterPanelOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <FilterPanel
                  filters={currentFilters}
                  services={services}
                  locations={locations}
                  onFiltersChange={handleFiltersChange}
                  onClear={handleClearFilters}
                  loading={loading}
                  isOpen={isFilterPanelOpen}
                  onToggle={() => setIsFilterPanelOpen(false)}
                  showToggle={true}
                />
              </div>
            </div>
          )}

          {/* Results area */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentFilters.query ? `Resultados para "${currentFilters.query}"` : 'Todos los profesionales'}
                </h1>
                {totalCount > 0 && (
                  <p className="text-gray-600">
                    {totalCount.toLocaleString()} profesionales encontrados
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <SortSelector
                  value={sortBy}
                  onChange={handleSortChange}
                  variant="compact"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Results grid */}
            <ProviderGrid
              providers={providers}
              loading={loading}
              error={error}
              searchParams={currentFilters}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadingMore={loadingMore}
              enableInfiniteScroll={true}
              emptyMessage="No se encontraron proveedores con los criterios seleccionados."
              onClearFilters={handleClearFilters}
              onSearchSuggestion={handleSearchSuggestion}
              onLocationSuggestion={handleLocationSuggestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersSearchResults;
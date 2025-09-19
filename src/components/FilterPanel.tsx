import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, ChevronUp, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { Service, ProvidersSearchParams } from '@/types/api';

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

interface FilterPanelProps {
  filters?: ProvidersSearchParams;
  services?: Service[];
  locations?: string[];
  onFiltersChange?: (filters: ProvidersSearchParams) => void;
  onClear?: () => void;
  loading?: boolean;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  showToggle?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters = {},
  services = [],
  locations = [],
  onFiltersChange,
  onClear,
  loading = false,
  className = '',
  isOpen = true,
  onToggle,
  showToggle = false,
}) => {
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'services', title: 'Servicios', isOpen: true },
    { id: 'location', title: 'Ubicación', isOpen: true },
    { id: 'rating', title: 'Calificación', isOpen: true },
    { id: 'availability', title: 'Disponibilidad', isOpen: true },
  ]);

  const [localFilters, setLocalFilters] = useState<ProvidersSearchParams>(filters);
  const [minRating, setMinRating] = useState<number[]>([filters.minRating || 0]);

  useEffect(() => {
    setLocalFilters(filters);
    setMinRating([filters.minRating || 0]);
  }, [filters]);

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const updateFilters = (newFilters: Partial<ProvidersSearchParams>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleServiceToggle = (serviceId: number, checked: boolean) => {
    const currentServices = localFilters.serviceIds || [];
    const newServices = checked
      ? [...currentServices, serviceId]
      : currentServices.filter(id => id !== serviceId);

    updateFilters({ serviceIds: newServices.length > 0 ? newServices : undefined });
  };

  const handleLocationToggle = (location: string, checked: boolean) => {
    const currentLocations = localFilters.cities || [];
    const newLocations = checked
      ? [...currentLocations, location]
      : currentLocations.filter(loc => loc !== location);

    updateFilters({ cities: newLocations.length > 0 ? newLocations : undefined });
  };

  const handleAvailabilityToggle = (status: string, checked: boolean) => {
    const currentStatuses = localFilters.availabilityStatuses || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);

    updateFilters({
      availabilityStatuses: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleRatingChange = (value: number[]) => {
    setMinRating(value);
    updateFilters({ minRating: value[0] > 0 ? value[0] : undefined });
  };

  const handleClearAll = () => {
    setLocalFilters({});
    setMinRating([0]);
    onClear?.();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.serviceIds?.length) count += localFilters.serviceIds.length;
    if (localFilters.cities?.length) count += localFilters.cities.length;
    if (localFilters.availabilityStatuses?.length) count += localFilters.availabilityStatuses.length;
    if (localFilters.minRating && localFilters.minRating > 0) count += 1;
    return count;
  };

  const availabilityOptions = [
    { value: 'available', label: 'Disponible', color: 'text-green-600' },
    { value: 'busy', label: 'Ocupado', color: 'text-yellow-600' },
    { value: 'unavailable', label: 'No disponible', color: 'text-red-600' },
  ];

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-gray-600 hover:text-gray-900"
              >
                Limpiar
              </Button>
            )}
            {showToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Services Filter */}
          {services.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('services')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-gray-900">Servicios</h4>
                {sections.find(s => s.id === 'services')?.isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {sections.find(s => s.id === 'services')?.isOpen && (
                <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={localFilters.serviceIds?.includes(service.id) || false}
                        onCheckedChange={(checked) =>
                          handleServiceToggle(service.id, checked as boolean)
                        }
                        disabled={loading}
                      />
                      <label
                        htmlFor={`service-${service.id}`}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
                      >
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location Filter */}
          {locations.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('location')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Ubicación</span>
                </h4>
                {sections.find(s => s.id === 'location')?.isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {sections.find(s => s.id === 'location')?.isOpen && (
                <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={localFilters.cities?.includes(location) || false}
                        onCheckedChange={(checked) =>
                          handleLocationToggle(location, checked as boolean)
                        }
                        disabled={loading}
                      />
                      <label
                        htmlFor={`location-${location}`}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
                      >
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rating Filter */}
          <div>
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Calificación mínima</span>
              </h4>
              {sections.find(s => s.id === 'rating')?.isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {sections.find(s => s.id === 'rating')?.isOpen && (
              <div className="mt-3 space-y-4">
                <div className="px-2">
                  <Slider
                    value={minRating}
                    onValueChange={handleRatingChange}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>0 estrellas</span>
                  <span className="font-medium">
                    {minRating[0] > 0 ? `${minRating[0]}+ estrellas` : 'Cualquier calificación'}
                  </span>
                  <span>5 estrellas</span>
                </div>
                {minRating[0] > 0 && (
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          'h-4 w-4',
                          index < minRating[0]
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Availability Filter */}
          <div>
            <button
              onClick={() => toggleSection('availability')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-sm font-medium text-gray-900">Disponibilidad</h4>
              {sections.find(s => s.id === 'availability')?.isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {sections.find(s => s.id === 'availability')?.isOpen && (
              <div className="mt-3 space-y-3">
                {availabilityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option.value}`}
                      checked={localFilters.availabilityStatuses?.includes(option.value) || false}
                      onCheckedChange={(checked) =>
                        handleAvailabilityToggle(option.value, checked as boolean)
                      }
                      disabled={loading}
                    />
                    <label
                      htmlFor={`availability-${option.value}`}
                      className={cn(
                        "text-sm cursor-pointer flex-1",
                        option.color
                      )}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
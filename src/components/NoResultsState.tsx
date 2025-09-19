import React from 'react';
import { Search, MapPin, Users, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProvidersSearchParams } from '@/types/api';

interface NoResultsStateProps {
  searchParams: ProvidersSearchParams;
  onClearFilters: () => void;
  onSearchSuggestion: (suggestion: string) => void;
  onLocationSuggestion: (location: string) => void;
  className?: string;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchParams,
  onClearFilters,
  onSearchSuggestion,
  onLocationSuggestion,
  className = '',
}) => {
  const hasActiveFilters =
    searchParams.serviceIds?.length ||
    searchParams.cities?.length ||
    searchParams.minRating ||
    searchParams.availabilityStatuses?.length;

  // Popular search suggestions
  const searchSuggestions = [
    'Plomero urgente',
    'Electricista certificado',
    'Carpintero muebles',
    'Pintor casa',
    'Limpieza profunda',
    'Jardinero diseño',
  ];

  // Popular location suggestions
  const locationSuggestions = [
    'Ciudad de México',
    'Guadalajara',
    'Monterrey',
    'Puebla',
    'Tijuana',
    'León',
  ];

  const tips = [
    {
      icon: Search,
      title: 'Prueba términos más generales',
      description: 'Usa palabras clave más amplias como "plomero" en lugar de "plomero especialista en tuberías de cobre"'
    },
    {
      icon: MapPin,
      title: 'Amplía tu área de búsqueda',
      description: 'Considera buscar en ciudades cercanas o elimina el filtro de ubicación'
    },
    {
      icon: Users,
      title: 'Reduce los filtros',
      description: 'Intenta con menos filtros o criterios menos específicos'
    },
  ];

  return (
    <div className={cn('text-center py-12', className)}>
      <div className="max-w-2xl mx-auto">
        {/* Main illustration */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No encontramos profesionales
          </h2>
          <p className="text-gray-600">
            {searchParams.query
              ? `No hay resultados para "${searchParams.query}"`
              : 'No hay profesionales que coincidan con tus criterios'
            }
          </p>
        </div>

        {/* Clear filters suggestion */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <RotateCcw className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-900 font-medium">
                Demasiados filtros activos
              </span>
            </div>
            <p className="text-blue-700 mb-4">
              Tienes varios filtros aplicados. Intenta reducirlos para ver más resultados.
            </p>
            <Button
              onClick={onClearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar todos los filtros
            </Button>
          </div>
        )}

        {/* Tips section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            Consejos para mejorar tu búsqueda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <tip.icon className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{tip.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search suggestions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Búsquedas populares
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {searchSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => onSearchSuggestion(suggestion)}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Location suggestions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ubicaciones populares
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {locationSuggestions.map((location, index) => (
              <Button
                key={index}
                onClick={() => onLocationSuggestion(location)}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-green-50 text-gray-700 border-gray-200"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </Button>
            ))}
          </div>
        </div>

        {/* Help section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-600 mb-4">
            Nuestro equipo está aquí para ayudarte a encontrar el profesional perfecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Contactar soporte
            </Button>
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Solicitar servicio personalizado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoResultsState;
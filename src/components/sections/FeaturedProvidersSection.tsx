import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Users, Award } from 'lucide-react';
import { ProviderCard } from '@/components/ProviderCard';
import { ProviderGridSkeleton } from '@/components/ProviderSkeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { providerService } from '@/services/providerService';
import { useNotifications } from '@/hooks/useNotifications';
import type { Provider } from '@/types/api';

interface FeaturedProvidersSectionProps {
  limit?: number;
  onProviderContact?: (provider: Provider) => void;
  className?: string;
}

export const FeaturedProvidersSection: React.FC<FeaturedProvidersSectionProps> = ({
  limit = 6,
  onProviderContact,
  className = '',
}) => {
  const navigate = useNavigate();
  const { showApiError } = useNotifications();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch providers with high ratings
        const response = await providerService.searchProviders({
          minRating: 4.5,
          sortBy: 'rating',
          limit,
          availabilityStatuses: ['available'],
        });

        setProviders(response.data || []);
      } catch (err: any) {
        const errorMessage = 'Error al cargar los proveedores destacados';
        setError(errorMessage);
        showApiError(err, errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProviders();
  }, [limit, showApiError]);

  const handleProviderContact = (provider: Provider) => {
    onProviderContact?.(provider);
  };

  const handleViewAll = () => {
    navigate('/providers?sort=rating&minRating=4.5');
  };

  // Mock data for when API is not available
  const mockProviders: Provider[] = [
    {
      id: 1,
      businessName: 'Plomería Express',
      bio: 'Especialistas en reparaciones urgentes y mantenimiento preventivo. Más de 10 años de experiencia.',
      cityName: 'Ciudad de México',
      averageRating: 4.9,
      totalReviews: 145,
      availabilityStatus: 'available',
      phoneNumber: '+52 55 1234 5678',
      createdAt: '2023-01-15T00:00:00Z',
      profileImageUrl: null,
      services: [
        { id: 1, name: 'Plomería', description: 'Reparaciones e instalaciones' },
        { id: 2, name: 'Destapado', description: 'Destapado de drenajes' },
      ],
    },
    {
      id: 2,
      businessName: 'Electricidad Profesional',
      bio: 'Instalaciones eléctricas residenciales e industriales con garantía. Equipo certificado.',
      cityName: 'Guadalajara',
      averageRating: 4.8,
      totalReviews: 98,
      availabilityStatus: 'available',
      phoneNumber: '+52 33 9876 5432',
      createdAt: '2023-02-20T00:00:00Z',
      profileImageUrl: null,
      services: [
        { id: 3, name: 'Electricidad', description: 'Instalaciones eléctricas' },
        { id: 4, name: 'Automatización', description: 'Sistemas inteligentes' },
      ],
    },
    {
      id: 3,
      businessName: 'Carpintería Artesanal',
      bio: 'Muebles a medida y reparaciones de alta calidad. Trabajo artesanal con maderas nobles.',
      cityName: 'Monterrey',
      averageRating: 4.7,
      totalReviews: 76,
      availabilityStatus: 'available',
      phoneNumber: '+52 81 5555 1234',
      createdAt: '2023-03-10T00:00:00Z',
      profileImageUrl: null,
      services: [
        { id: 5, name: 'Carpintería', description: 'Muebles y reparaciones' },
        { id: 6, name: 'Ebanistería', description: 'Trabajos especializados' },
      ],
    },
  ];

  const displayProviders = providers.length > 0 ? providers : mockProviders.slice(0, limit);

  return (
    <section className={cn('py-16 lg:py-24 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            <Award className="h-4 w-4" />
            <span>Profesionales destacados</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Los mejores calificados
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conoce a nuestros profesionales con las mejores calificaciones y reseñas.
            Calidad garantizada en cada proyecto.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <ProviderGridSkeleton count={limit} />
        )}

        {/* Error state */}
        {error && !loading && displayProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              No se pudieron cargar los proveedores destacados
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Intentar nuevamente
            </Button>
          </div>
        )}

        {/* Providers grid */}
        {!loading && displayProviders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onContact={handleProviderContact}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow"
                />
              ))}
            </div>

            {/* Stats section */}
            <div className="bg-white rounded-2xl p-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    4.8+
                  </div>
                  <div className="text-sm text-gray-600">
                    Calificación promedio de destacados
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">
                    Clientes satisfechos
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    100%
                  </div>
                  <div className="text-sm text-gray-600">
                    Profesionales verificados
                  </div>
                </div>
              </div>
            </div>

            {/* View all button */}
            <div className="text-center">
              <Button
                onClick={handleViewAll}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Ver todos los profesionales destacados
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        )}

        {/* Why choose featured providers */}
        <div className="mt-16 bg-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            ¿Por qué elegir nuestros profesionales destacados?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Alta calificación</h4>
              <p className="text-sm text-gray-600">Mínimo 4.5 estrellas con múltiples reseñas verificadas</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Verificados</h4>
              <p className="text-sm text-gray-600">Identidad y credenciales profesionales confirmadas</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Experiencia</h4>
              <p className="text-sm text-gray-600">Años de experiencia y proyectos exitosos comprobados</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Disponibles</h4>
              <p className="text-sm text-gray-600">Activos y listos para tomar nuevos proyectos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProvidersSection;
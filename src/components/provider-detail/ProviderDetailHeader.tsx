import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Share2,
  Heart,
  Flag,
  Calendar,
  Award,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/Rating';
import { cn } from '@/lib/utils';
import type { Provider } from '@/types/api';

interface ProviderDetailHeaderProps {
  provider: Provider;
  onContact?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  isBookmarked?: boolean;
  className?: string;
}

export const ProviderDetailHeader: React.FC<ProviderDetailHeaderProps> = ({
  provider,
  onContact,
  onBookmark,
  onShare,
  onReport,
  isBookmarked = false,
  className = '',
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  const getAvailabilityIcon = (status: Provider['availabilityStatus']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'busy':
        return <Pause className="h-5 w-5 text-yellow-500" />;
      case 'unavailable':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getAvailabilityText = (status: Provider['availabilityStatus']) => {
    switch (status) {
      case 'available':
        return 'Disponible para nuevos proyectos';
      case 'busy':
        return 'Ocupado - Disponibilidad limitada';
      case 'unavailable':
        return 'No disponible actualmente';
      default:
        return 'Estado desconocido';
    }
  };

  const getAvailabilityColor = (status: Provider['availabilityStatus']) => {
    switch (status) {
      case 'available':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'busy':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'unavailable':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const yearsActive = Math.floor(
    (Date.now() - new Date(provider.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  const shouldTruncateBio = provider.bio && provider.bio.length > 200;
  const displayBio = shouldTruncateBio && !showFullBio
    ? provider.bio.substring(0, 200) + '...'
    : provider.bio;

  return (
    <div className={cn('bg-white border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main provider info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile image */}
              <div className="flex-shrink-0">
                {provider.profileImageUrl ? (
                  <img
                    src={provider.profileImageUrl}
                    alt={provider.businessName}
                    className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {provider.businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Provider details */}
              <div className="flex-1 min-w-0">
                {/* Name and verification */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {provider.businessName}
                    </h1>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">
                          Verificado
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Profesional certificado
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={onBookmark}
                      variant="outline"
                      size="sm"
                      className={cn(
                        'p-2',
                        isBookmarked && 'text-red-600 bg-red-50 border-red-200'
                      )}
                    >
                      <Heart className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
                    </Button>
                    <Button
                      onClick={onShare}
                      variant="outline"
                      size="sm"
                      className="p-2"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={onReport}
                      variant="ghost"
                      size="sm"
                      className="p-2 text-gray-500"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Location and contact */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.cityName}</span>
                  </div>
                  {provider.phoneNumber && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{provider.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {yearsActive > 0
                        ? `${yearsActive} ${yearsActive === 1 ? 'año' : 'años'} en la plataforma`
                        : 'Nuevo en la plataforma'
                      }
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <Rating
                    rating={provider.averageRating}
                    totalReviews={provider.totalReviews}
                    size="lg"
                    showTotal={true}
                  />
                </div>

                {/* Availability status */}
                <div className={cn(
                  'inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium border',
                  getAvailabilityColor(provider.availabilityStatus)
                )}>
                  {getAvailabilityIcon(provider.availabilityStatus)}
                  <span>{getAvailabilityText(provider.availabilityStatus)}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            {provider.services && provider.services.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Servicios especializados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service) => (
                    <span
                      key={service.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio/Description */}
            {provider.bio && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Acerca de {provider.businessName}
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {displayBio}
                  </p>
                  {shouldTruncateBio && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      {showFullBio ? 'Ver menos' : 'Leer más'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contactar profesional
              </h3>

              {/* Quick stats */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Calificación</span>
                  <span className="font-semibold text-gray-900">
                    {provider.averageRating.toFixed(1)} ⭐
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reseñas</span>
                  <span className="font-semibold text-gray-900">
                    {provider.totalReviews}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo de respuesta</span>
                  <span className="font-semibold text-gray-900">
                    ~2 horas
                  </span>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onContact}
                  disabled={provider.availabilityStatus === 'unavailable'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contactar ahora
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-3"
                  size="lg"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar mensaje
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-3"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Programar cita
                </Button>
              </div>

              {/* Contact info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Al contactar, acepta nuestros términos de servicio.
                  Sus datos están protegidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailHeader;
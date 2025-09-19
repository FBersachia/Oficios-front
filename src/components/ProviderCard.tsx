import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, CheckCircle, XCircle, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rating } from './Rating';
import { cn } from '@/lib/utils';
import type { Provider } from '@/types/api';

interface ProviderCardProps {
  provider: Provider;
  className?: string;
  showContactButton?: boolean;
  onContact?: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  className = '',
  showContactButton = true,
  onContact,
}) => {
  const getAvailabilityIcon = (status: Provider['availabilityStatus']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getAvailabilityText = (status: Provider['availabilityStatus']) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'Ocupado';
      case 'unavailable':
        return 'No disponible';
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

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContact) {
      onContact(provider);
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <Link to={`/providers/${provider.id}`} className="block">
        <div className="p-6">
          {/* Header with image and basic info */}
          <div className="flex items-start space-x-4 mb-4">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {provider.profileImageUrl ? (
                <img
                  src={provider.profileImageUrl}
                  alt={provider.businessName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-500">
                    {provider.businessName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {provider.businessName}
              </h3>

              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {provider.cityName}
                </span>
              </div>

              {/* Rating */}
              <div className="mt-2">
                <Rating
                  rating={provider.averageRating}
                  totalReviews={provider.totalReviews}
                  size="sm"
                />
              </div>
            </div>

            {/* Availability Status */}
            <div className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border',
              getAvailabilityColor(provider.availabilityStatus)
            )}>
              {getAvailabilityIcon(provider.availabilityStatus)}
              <span>{getAvailabilityText(provider.availabilityStatus)}</span>
            </div>
          </div>

          {/* Services */}
          {provider.services && provider.services.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {provider.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {service.name}
                  </span>
                ))}
                {provider.services.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{provider.services.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          {provider.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {provider.bio}
            </p>
          )}

          {/* Contact Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {provider.phoneNumber && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{provider.phoneNumber}</span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>
                  Activo hace {
                    Math.floor((Date.now() - new Date(provider.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                  } días
                </span>
              </div>
            </div>

            {/* Contact Button */}
            {showContactButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleContactClick}
                disabled={provider.availabilityStatus === 'unavailable'}
                className="ml-2"
              >
                Contactar
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProviderCard;
import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LocationMapProps {
  address?: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  showExactLocation?: boolean;
  onDirectionsClick?: () => void;
  className?: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  address,
  city,
  coordinates,
  showExactLocation = false,
  onDirectionsClick,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const fullAddress = address ? `${address}, ${city}` : city;
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleGetDirections = () => {
    const query = address ? `${address}, ${city}` : city;
    const encodedQuery = encodeURIComponent(query);

    // Try to open Google Maps
    if (coordinates) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
        '_blank'
      );
    }

    onDirectionsClick?.();
  };

  const handleOpenInMaps = () => {
    const query = address ? `${address}, ${city}` : city;
    const encodedQuery = encodeURIComponent(query);

    if (coordinates) {
      window.open(`https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`, '_blank');
    } else {
      window.open(`https://maps.google.com/?q=${encodedQuery}`, '_blank');
    }
  };

  return (
    <div className={cn('py-12 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ubicación y contacto
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Dirección</h3>
                  {showExactLocation && address ? (
                    <p className="text-gray-600 mb-2">{address}</p>
                  ) : (
                    <p className="text-gray-600 mb-2">
                      {city} (ubicación exacta disponible al contactar)
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleCopyAddress}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-500 hover:text-gray-700"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-xs text-gray-500">
                      {copied ? 'Copiado' : 'Copiar dirección'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coverage area */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Área de cobertura</h3>
                <p className="text-gray-600 text-sm">
                  Presta servicios en {city} y alrededores (hasta 15 km)
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Cómo llegar
                </Button>

                <Button
                  onClick={handleOpenInMaps}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en Google Maps
                </Button>
              </div>

              {/* Privacy notice */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Información de privacidad
                </h4>
                <p className="text-xs text-gray-600">
                  {showExactLocation
                    ? 'La dirección exacta está disponible porque el profesional la ha verificado.'
                    : 'Por privacidad, solo mostramos el área general. La dirección exacta se proporciona al contactar al profesional.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
              {/* Simulated map with city marker */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                {/* Grid pattern to simulate map */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>
                </div>

                {/* Location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    {/* Pulsing circle */}
                    <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
                    <div className="relative bg-blue-600 rounded-full p-3 shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Location label */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                    <div className="bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium text-gray-900">
                      {city}
                    </div>
                  </div>
                </div>

                {/* Coverage area circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-48 border-2 border-blue-400 border-dashed rounded-full opacity-50"></div>
                </div>
              </div>

              {/* Map controls overlay */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
                <div className="flex flex-col space-y-1">
                  <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600">
                    +
                  </button>
                  <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600">
                    −
                  </button>
                </div>
              </div>

              {/* Map type indicator */}
              <div className="absolute bottom-4 left-4 bg-white rounded px-2 py-1 shadow text-xs text-gray-600">
                Vista general
              </div>

              {/* Interactive overlay */}
              <div className="absolute inset-0 bg-transparent hover:bg-black hover:bg-opacity-5 transition-colors cursor-pointer"
                   onClick={handleOpenInMaps}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-900">
                    Haz clic para ver mapa interactivo
                  </div>
                </div>
              </div>
            </div>

            {/* Map info */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Área aproximada de cobertura del servicio</span>
              <span>Radio de 15 km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
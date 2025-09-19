import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Scissors,
  TreePine,
  Home,
  Car,
  Camera,
  Monitor,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  trending?: boolean;
}

interface PopularServicesSectionProps {
  onServiceClick?: (serviceId: string) => void;
  className?: string;
}

export const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({
  onServiceClick,
  className = '',
}) => {
  const navigate = useNavigate();

  const services: Service[] = [
    {
      id: 'plumbing',
      name: 'Plomería',
      description: 'Reparaciones, instalaciones y mantenimiento',
      icon: Wrench,
      count: 1250,
      trending: true,
    },
    {
      id: 'electrical',
      name: 'Electricidad',
      description: 'Instalaciones eléctricas y reparaciones',
      icon: Zap,
      count: 980,
      trending: true,
    },
    {
      id: 'carpentry',
      name: 'Carpintería',
      description: 'Muebles, reparaciones y construcción',
      icon: Hammer,
      count: 750,
    },
    {
      id: 'painting',
      name: 'Pintura',
      description: 'Pintura interior, exterior y decorativa',
      icon: Paintbrush,
      count: 680,
    },
    {
      id: 'cleaning',
      name: 'Limpieza',
      description: 'Limpieza profunda y mantenimiento',
      icon: Scissors,
      count: 920,
    },
    {
      id: 'gardening',
      name: 'Jardinería',
      description: 'Diseño, mantenimiento y paisajismo',
      icon: TreePine,
      count: 540,
    },
    {
      id: 'construction',
      name: 'Construcción',
      description: 'Obras menores y remodelaciones',
      icon: Home,
      count: 430,
    },
    {
      id: 'automotive',
      name: 'Automotriz',
      description: 'Mecánica y mantenimiento vehicular',
      icon: Car,
      count: 320,
    },
    {
      id: 'photography',
      name: 'Fotografía',
      description: 'Eventos, retratos y comercial',
      icon: Camera,
      count: 280,
    },
    {
      id: 'technology',
      name: 'Tecnología',
      description: 'Reparación y soporte técnico',
      icon: Monitor,
      count: 450,
      trending: true,
    },
    {
      id: 'mobile-repair',
      name: 'Reparación móviles',
      description: 'Smartphones y tablets',
      icon: Smartphone,
      count: 390,
    },
  ];

  const handleServiceClick = (service: Service) => {
    navigate(`/providers?service=${service.id}`);
    onServiceClick?.(service.id);
  };

  const handleViewAll = () => {
    navigate('/providers');
  };

  return (
    <section className={cn('py-16 lg:py-24 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicios más solicitados
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre los servicios que más buscan nuestros usuarios y encuentra
            el profesional perfecto para tu necesidad.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {services.slice(0, 8).map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
            >
              {/* Trending badge */}
              {service.trending && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Trending
                  </span>
                </div>
              )}

              {/* Service icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                <service.icon className="h-6 w-6 text-blue-600" />
              </div>

              {/* Service info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {service.description}
              </p>

              {/* Provider count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {service.count.toLocaleString()} profesionales
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional services preview */}
        {services.length > 8 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <span className="text-sm text-gray-600">También disponibles:</span>
              {services.slice(8).map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <service.icon className="h-4 w-4" />
                  <span>{service.name}</span>
                  <span className="text-gray-500">({service.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View all button */}
        <div className="text-center">
          <Button
            onClick={handleViewAll}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300 px-8 py-3"
          >
            Ver todos los servicios
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-12">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
              {services.reduce((acc, service) => acc + service.count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Profesionales activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
              {services.length}+
            </div>
            <div className="text-sm text-gray-600">Categorías de servicio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
              24/7
            </div>
            <div className="text-sm text-gray-600">Disponibilidad</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
              98%
            </div>
            <div className="text-sm text-gray-600">Satisfacción cliente</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularServicesSection;
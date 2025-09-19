import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  service: string;
  providerName: string;
  date: string;
  avatar?: string;
}

interface TestimonialsSectionProps {
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  autoRotate = true,
  rotateInterval = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'María González',
      location: 'Ciudad de México',
      rating: 5,
      comment: 'Excelente servicio de plomería. Llegaron puntual, resolvieron el problema rápidamente y a un precio muy justo. Definitivamente los recomiendo.',
      service: 'Plomería',
      providerName: 'Plomería Express',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      location: 'Guadalajara',
      rating: 5,
      comment: 'Increíble trabajo de carpintería. Me hicieron un mueble a medida exactamente como lo quería. La calidad es excepcional y el precio muy competitivo.',
      service: 'Carpintería',
      providerName: 'Carpintería Artesanal',
      date: '2024-01-10',
    },
    {
      id: 3,
      name: 'Ana López',
      location: 'Monterrey',
      rating: 5,
      comment: 'El electricista fue muy profesional. Explicó todo el proceso, trabajó limpio y solucionó el problema eléctrico sin complicaciones. Muy satisfecha.',
      service: 'Electricidad',
      providerName: 'Electricidad Profesional',
      date: '2024-01-08',
    },
    {
      id: 4,
      name: 'Roberto Hernández',
      location: 'Puebla',
      rating: 5,
      comment: 'Pintura de toda la casa realizada de manera impecable. Terminaron en el tiempo prometido y el resultado superó mis expectativas. Muy recomendados.',
      service: 'Pintura',
      providerName: 'Pintores Profesionales',
      date: '2024-01-05',
    },
    {
      id: 5,
      name: 'Laura Martínez',
      location: 'Tijuana',
      rating: 5,
      comment: 'Servicio de limpieza excepcional. Dejaron la casa impecable y fueron muy cuidadosos con todos los muebles. Sin duda volveré a contratarlos.',
      service: 'Limpieza',
      providerName: 'Limpieza Total',
      date: '2024-01-03',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={cn(
          'h-4 w-4',
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        )}
      />
    ));
  };

  return (
    <section className={cn('py-16 lg:py-24 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Miles de clientes satisfechos han encontrado el profesional perfecto
            para sus proyectos. Lee sus experiencias reales.
          </p>
        </div>

        {/* Main testimonial display */}
        <div className="relative bg-gray-50 rounded-2xl p-8 md:p-12 mb-8">
          <div className="absolute top-6 left-6 text-blue-200">
            <Quote className="h-12 w-12" />
          </div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {renderStars(testimonials[currentIndex].rating)}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-900 font-medium leading-relaxed mb-6">
                "{testimonials[currentIndex].comment}"
              </blockquote>

              <div className="space-y-2">
                <div className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentIndex].location}
                </div>
                <div className="text-sm text-blue-600">
                  Servicio de {testimonials[currentIndex].service} con {testimonials[currentIndex].providerName}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={goToPrevious}
                variant="outline"
                size="sm"
                className="rounded-full p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Dots indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index === currentIndex
                        ? 'bg-blue-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                  />
                ))}
              </div>

              <Button
                onClick={goToNext}
                variant="outline"
                size="sm"
                className="rounded-full p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonials grid preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                'bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all',
                currentIndex === index
                  ? 'border-blue-300 shadow-md'
                  : 'hover:border-gray-300 hover:shadow-sm'
              )}
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                "{testimonial.comment}"
              </p>

              <div className="space-y-1">
                <div className="font-medium text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.location}
                </div>
                <div className="text-xs text-blue-600">
                  {testimonial.service}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-blue-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                4.9
              </div>
              <div className="text-sm text-gray-600">
                Calificación promedio
              </div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                15K+
              </div>
              <div className="text-sm text-gray-600">
                Reseñas verificadas
              </div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                98%
              </div>
              <div className="text-sm text-gray-600">
                Clientes satisfechos
              </div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                99%
              </div>
              <div className="text-sm text-gray-600">
                Recomiendan nuestros servicios
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Listo para encontrar tu profesional ideal?
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Comenzar búsqueda
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
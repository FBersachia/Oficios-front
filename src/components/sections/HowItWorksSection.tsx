import React from 'react';
import { Search, Users, MessageCircle, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

interface HowItWorksSectionProps {
  onGetStarted?: () => void;
  className?: string;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onGetStarted,
  className = '',
}) => {
  const steps: Step[] = [
    {
      id: 1,
      title: 'Describe tu proyecto',
      description: 'Cuéntanos qué necesitas y en dónde',
      icon: Search,
      details: [
        'Describe el servicio que necesitas',
        'Indica tu ubicación',
        'Especifica fechas y detalles',
        'Recibe sugerencias automáticas'
      ],
    },
    {
      id: 2,
      title: 'Encuentra profesionales',
      description: 'Recibe propuestas de expertos verificados',
      icon: Users,
      details: [
        'Ve perfiles con calificaciones reales',
        'Compara precios y servicios',
        'Lee reseñas de otros clientes',
        'Filtra por ubicación y disponibilidad'
      ],
    },
    {
      id: 3,
      title: 'Conecta y contrata',
      description: 'Comunícate directamente y contrata',
      icon: MessageCircle,
      details: [
        'Chatea directamente con profesionales',
        'Solicita cotizaciones detalladas',
        'Negocia términos y precios',
        'Programa fechas de trabajo'
      ],
    },
    {
      id: 4,
      title: 'Proyecto completado',
      description: 'Disfruta del trabajo bien hecho',
      icon: CheckCircle,
      details: [
        'Recibe trabajo de calidad garantizada',
        'Califica y deja reseñas',
        'Guarda contactos para futuros proyectos',
        'Obtén garantía en servicios'
      ],
    },
  ];

  const benefits = [
    {
      title: 'Profesionales verificados',
      description: 'Todos nuestros profesionales pasan por un proceso de verificación',
    },
    {
      title: 'Precios transparentes',
      description: 'Sin sorpresas, compara cotizaciones antes de decidir',
    },
    {
      title: 'Garantía de calidad',
      description: 'Trabajos respaldados con garantía y soporte',
    },
    {
      title: 'Disponibilidad 24/7',
      description: 'Encuentra profesionales cuando los necesites',
    },
  ];

  return (
    <section className={cn('py-16 lg:py-24 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conectamos a personas que necesitan servicios con profesionales
            calificados de manera simple y segura.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mb-16">
          {/* Progress line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gray-200">
            <div className="h-full bg-blue-600 w-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
                  {/* Step number and icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <step.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.id}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>

                    {/* Step details */}
                    <ul className="text-left space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 z-20">
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video/Demo section */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ve cómo funciona en acción
            </h3>
            <p className="text-gray-600 mb-8">
              Mira este video de 2 minutos para entender mejor el proceso
            </p>

            {/* Video placeholder */}
            <div className="relative bg-gray-100 rounded-xl h-64 md:h-80 flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className="text-gray-600">
                  Haz clic para ver el video demo
                </p>
              </div>
            </div>

            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Comenzar ahora
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            ¿Por qué elegir nuestra plataforma?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ preview */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Tienes preguntas?
          </h3>
          <p className="text-gray-600 mb-6">
            Consulta nuestras preguntas frecuentes o contáctanos directamente
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Ver FAQ
            </Button>
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Contactar soporte
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
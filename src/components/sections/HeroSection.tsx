import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Star } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SearchSuggestion } from '@/components/SearchBar';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  suggestions = [],
  recentSearches = [],
  className = '',
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to providers page with search query
      navigate(`/providers?q=${encodeURIComponent(query.trim())}`);
      onSearch?.(query);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    // Navigate based on suggestion type
    switch (suggestion.type) {
      case 'provider':
        navigate(`/providers/${suggestion.id}`);
        break;
      case 'service':
        navigate(`/providers?service=${suggestion.id}`);
        break;
      case 'location':
        navigate(`/providers?location=${encodeURIComponent(suggestion.text)}`);
        break;
      default:
        handleSearch(suggestion.text);
    }
  };

  const popularSearches = [
    'Plomería',
    'Electricidad',
    'Carpintería',
    'Pintura',
    'Limpieza',
    'Jardinería',
  ];

  const stats = [
    { icon: Users, value: '5,000+', label: 'Profesionales registrados' },
    { icon: Star, value: '4.8', label: 'Calificación promedio' },
    { icon: MapPin, value: '50+', label: 'Ciudades cubiertas' },
  ];

  return (
    <section className={cn('relative bg-gradient-to-br from-blue-50 to-blue-100', className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-15"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Encuentra el{' '}
            <span className="text-blue-600 relative">
              profesional perfecto
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-blue-300"
                viewBox="0 0 100 8"
                fill="currentColor"
                preserveAspectRatio="none"
              >
                <path d="M0,7 Q50,0 100,7 L100,8 L0,8 Z" />
              </svg>
            </span>
            <br />
            para tu proyecto
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conecta con miles de profesionales verificados en tu área.
            Desde reparaciones menores hasta proyectos grandes, encuentra quien necesitas.
          </p>

          {/* Search bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              suggestions={suggestions}
              recentSearches={recentSearches}
              placeholder="¿Qué servicio necesitas? Ej: plomero, electricista, pintor..."
              size="lg"
              className="shadow-lg"
            />
          </div>

          {/* Popular searches */}
          <div className="mb-12">
            <p className="text-sm text-gray-600 mb-3">Búsquedas populares:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(search)}
                  className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/providers')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <Search className="h-5 w-5 mr-2" />
              Explorar profesionales
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300 px-8 py-3"
            >
              Únete como profesional
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
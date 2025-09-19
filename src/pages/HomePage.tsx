import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePageSEO } from '@/components/SEO';
import { HeroSection } from '@/components/sections/HeroSection';
import { PopularServicesSection } from '@/components/sections/PopularServicesSection';
import { FeaturedProvidersSection } from '@/components/sections/FeaturedProvidersSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { useNotifications } from '@/hooks/useNotifications';
import { providerService } from '@/services/providerService';
import type { SearchSuggestion } from '@/components/SearchBar';
import type { Provider } from '@/types/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Mock search suggestions - in a real app, these would come from an API
  useEffect(() => {
    const mockSuggestions: SearchSuggestion[] = [
      {
        id: 'plumbing',
        type: 'service',
        text: 'Plomería',
        subtitle: 'Reparaciones e instalaciones',
      },
      {
        id: 'electrical',
        type: 'service',
        text: 'Electricidad',
        subtitle: 'Instalaciones eléctricas',
      },
      {
        id: 'carpentry',
        type: 'service',
        text: 'Carpintería',
        subtitle: 'Muebles y reparaciones',
      },
      {
        id: 'painting',
        type: 'service',
        text: 'Pintura',
        subtitle: 'Interior y exterior',
      },
      {
        id: 'cdmx',
        type: 'location',
        text: 'Ciudad de México',
        subtitle: 'CDMX',
      },
      {
        id: 'guadalajara',
        type: 'location',
        text: 'Guadalajara',
        subtitle: 'Jalisco',
      },
      {
        id: 'monterrey',
        type: 'location',
        text: 'Monterrey',
        subtitle: 'Nuevo León',
      },
    ];

    setSearchSuggestions(mockSuggestions);
  }, []);

  const handleSearch = (query: string) => {
    // Save to recent searches
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Track search analytics (would be implemented with actual analytics)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        page_location: window.location.href,
      });
    }
  };

  const handleServiceClick = (serviceId: string) => {
    // Track service click analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_click', {
        service_id: serviceId,
        page_location: window.location.href,
      });
    }
  };

  const handleProviderContact = (provider: Provider) => {
    // Show contact modal or redirect to provider detail
    showSuccess(`Contactando a ${provider.businessName}...`);
    navigate(`/providers/${provider.id}`);

    // Track provider contact analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'provider_contact', {
        provider_id: provider.id,
        provider_name: provider.businessName,
        page_location: window.location.href,
      });
    }
  };

  const handleGetStarted = () => {
    navigate('/providers');

    // Track get started analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'get_started', {
        page_location: window.location.href,
      });
    }
  };

  return (
    <>
      <HomePageSEO />

      <Layout variant="page">
        {/* Hero Section */}
        <HeroSection
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          recentSearches={recentSearches}
        />

        {/* Popular Services Section */}
        <PopularServicesSection
          onServiceClick={handleServiceClick}
        />

        {/* Featured Providers Section */}
        <FeaturedProvidersSection
          limit={6}
          onProviderContact={handleProviderContact}
        />

        {/* How It Works Section */}
        <HowItWorksSection
          onGetStarted={handleGetStarted}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          autoRotate={true}
          rotateInterval={6000}
        />

        {/* Additional CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para encontrar tu profesional ideal?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de clientes satisfechos que ya encontraron
              el servicio perfecto para sus proyectos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Buscar profesionales
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
              >
                Registrarse como profesional
              </button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default HomePage;
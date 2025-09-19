import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
  noIndex?: boolean;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Oficios - Encuentra el profesional perfecto para tu proyecto',
  description = 'Conecta con miles de profesionales verificados en México. Plomeros, electricistas, carpinteros y más. Precios transparentes, calidad garantizada.',
  keywords = [
    'servicios profesionales',
    'plomero',
    'electricista',
    'carpintero',
    'pintor',
    'profesionales verificados',
    'servicios domésticos',
    'reparaciones',
    'mantenimiento',
    'México'
  ],
  image = '/images/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  structuredData,
  noIndex = false,
  canonical,
}) => {
  const siteTitle = 'Oficios';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  // Default structured data for the website
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: url || 'https://oficios.com',
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://oficios.com/providers?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: 'https://oficios.com/images/logo.png'
      }
    }
  };

  // Homepage specific structured data
  const homepageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    ...defaultStructuredData,
    mainEntity: {
      '@type': 'Organization',
      name: siteTitle,
      description: 'Plataforma líder en México para conectar clientes con profesionales de servicios domésticos y comerciales',
      url: 'https://oficios.com',
      logo: 'https://oficios.com/images/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+52-800-123-4567',
        contactType: 'customer service',
        availableLanguage: 'Spanish'
      },
      areaServed: {
        '@type': 'Country',
        name: 'Mexico'
      },
      serviceType: [
        'Plomería',
        'Electricidad',
        'Carpintería',
        'Pintura',
        'Limpieza',
        'Jardinería',
        'Construcción',
        'Reparaciones'
      ]
    }
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="es_MX" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional meta tags for better SEO */}
      <meta name="language" content="Spanish" />
      <meta name="geo.region" content="MX" />
      <meta name="geo.country" content="Mexico" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || (type === 'website' ? homepageStructuredData : defaultStructuredData))}
      </script>
    </Helmet>
  );
};

// Specialized SEO components for different page types
interface HomePageSEOProps {
  additionalKeywords?: string[];
}

export const HomePageSEO: React.FC<HomePageSEOProps> = ({
  additionalKeywords = []
}) => {
  const keywords = [
    'servicios profesionales México',
    'plomero cerca de mi',
    'electricista urgente',
    'carpintero económico',
    'pintor profesional',
    'limpieza doméstica',
    'jardinero experto',
    'reparaciones hogar',
    'mantenimiento casa',
    'profesionales verificados',
    ...additionalKeywords
  ];

  return (
    <SEO
      title="Oficios - Encuentra el profesional perfecto para tu proyecto"
      description="Conecta con miles de profesionales verificados en México. Plomeros, electricistas, carpinteros, pintores y más. Precios transparentes, calidad garantizada, disponibles 24/7."
      keywords={keywords}
      type="website"
    />
  );
};

interface ProvidersSEOProps {
  service?: string;
  location?: string;
  count?: number;
}

export const ProvidersSEO: React.FC<ProvidersSEOProps> = ({
  service,
  location,
  count
}) => {
  const getTitle = () => {
    if (service && location) {
      return `${service} en ${location} - ${count || 'Encuentra'} Profesionales Verificados`;
    }
    if (service) {
      return `${service} - Profesionales Verificados en México`;
    }
    if (location) {
      return `Profesionales de Servicios en ${location} - Oficios`;
    }
    return 'Encuentra Profesionales Verificados - Oficios';
  };

  const getDescription = () => {
    if (service && location) {
      return `Encuentra los mejores profesionales de ${service} en ${location}. ${count || 'Múltiples'} expertos verificados con calificaciones reales. Cotiza gratis.`;
    }
    if (service) {
      return `Conecta con profesionales expertos en ${service}. Compara precios, lee reseñas y contrata al mejor. Calidad garantizada.`;
    }
    return 'Explora miles de profesionales verificados en México. Todos los servicios domésticos y comerciales en un solo lugar.';
  };

  return (
    <SEO
      title={getTitle()}
      description={getDescription()}
      keywords={[
        service || 'servicios profesionales',
        location || 'México',
        'profesionales verificados',
        'cotización gratuita',
        'calificaciones reales'
      ]}
    />
  );
};

interface ProviderDetailSEOProps {
  providerName: string;
  services: string[];
  location: string;
  rating: number;
  reviewCount: number;
}

export const ProviderDetailSEO: React.FC<ProviderDetailSEOProps> = ({
  providerName,
  services,
  location,
  rating,
  reviewCount
}) => {
  const title = `${providerName} - ${services.join(', ')} en ${location}`;
  const description = `${providerName} ofrece servicios de ${services.join(', ')} en ${location}. ${rating} estrellas con ${reviewCount} reseñas verificadas. Cotiza ahora.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: providerName,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location,
      addressCountry: 'MX'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1
    },
    serviceType: services,
    areaServed: {
      '@type': 'City',
      name: location
    }
  };

  return (
    <SEO
      title={title}
      description={description}
      keywords={[...services, location, providerName, 'profesional verificado']}
      type="profile"
      structuredData={structuredData}
    />
  );
};

export default SEO;
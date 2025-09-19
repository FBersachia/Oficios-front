import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProvidersSEO } from '@/components/SEO';
import { ProvidersSearchResults } from '@/components/ProvidersSearchResults';
import { useSearchParams } from 'react-router-dom';

export const ProvidersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get current search parameters for SEO
  const currentQuery = searchParams.get('q') || '';
  const currentService = searchParams.get('service') || '';
  const currentLocation = searchParams.get('location') || '';

  // Mock service names mapping (in a real app, this would come from API)
  const serviceNames: Record<string, string> = {
    '1': 'Plomería',
    '2': 'Electricidad',
    '3': 'Carpintería',
    '4': 'Pintura',
    '5': 'Limpieza',
    '6': 'Jardinería',
  };

  const serviceName = currentService ? serviceNames[currentService] : '';

  return (
    <>
      {/* SEO optimization based on search parameters */}
      <ProvidersSEO
        service={serviceName}
        location={currentLocation}
        // In a real app, count would come from the search results
        count={undefined}
      />

      <Layout variant="page">
        <ProvidersSearchResults />
      </Layout>
    </>
  );
};

export default ProvidersPage;
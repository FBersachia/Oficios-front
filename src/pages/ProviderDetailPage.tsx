import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProviderDetailSEO } from '@/components/SEO';
import { ProviderDetailHeader } from '@/components/provider-detail/ProviderDetailHeader';
import { PortfolioGallery } from '@/components/provider-detail/PortfolioGallery';
import { ReviewsSection } from '@/components/provider-detail/ReviewsSection';
import { LocationMap } from '@/components/provider-detail/LocationMap';
import { WriteReviewModal } from '@/components/provider-detail/WriteReviewModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useNotifications } from '@/hooks/useNotifications';
import { providerService } from '@/services/providerService';
import type { Provider } from '@/types/api';

// Mock data interfaces for portfolio and reviews
interface PortfolioImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
}

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  service?: string;
  images?: string[];
  response?: {
    text: string;
    date: string;
    authorName: string;
  };
}

export const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showApiError } = useNotifications();

  // State
  const [provider, setProvider] = useState<Provider | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);

  // Mock authentication state - in real app this would come from auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/providers');
      return;
    }

    fetchProviderData();
  }, [id, navigate]);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch provider details
      const providerResponse = await providerService.getProviderById(parseInt(id!));
      setProvider(providerResponse);

      // Mock portfolio data - in real app this would come from API
      const mockPortfolio: PortfolioImage[] = [
        {
          id: '1',
          url: '/images/portfolio/work1.jpg',
          title: 'Reparación de tubería principal',
          description: 'Trabajo completo de reparación e instalación de nueva tubería',
          category: 'Plomería',
          thumbnailUrl: '/images/portfolio/work1-thumb.jpg',
        },
        {
          id: '2',
          url: '/images/portfolio/work2.jpg',
          title: 'Instalación eléctrica completa',
          description: 'Nuevo cableado para casa de 3 habitaciones',
          category: 'Electricidad',
          thumbnailUrl: '/images/portfolio/work2-thumb.jpg',
        },
        // Add more mock portfolio items...
      ];
      setPortfolioImages(mockPortfolio);

      // Mock reviews data - in real app this would come from API
      const mockReviews: Review[] = [
        {
          id: '1',
          authorName: 'María González',
          rating: 5,
          title: 'Excelente trabajo',
          comment: 'Muy profesional y puntual. Resolvió el problema de plomería rápidamente y dejó todo limpio. Lo recomiendo ampliamente.',
          date: '2024-01-15',
          verified: true,
          helpful: 8,
          service: 'Plomería',
          response: {
            text: 'Muchas gracias por su comentario María. Fue un placer trabajar en su hogar.',
            date: '2024-01-16',
            authorName: providerResponse.businessName,
          },
        },
        {
          id: '2',
          authorName: 'Carlos Ruiz',
          rating: 4,
          comment: 'Buen trabajo en general. Llegó a tiempo y completó la reparación según lo acordado. El precio fue justo.',
          date: '2024-01-10',
          verified: true,
          helpful: 5,
          service: 'Reparaciones',
        },
        // Add more mock reviews...
      ];
      setReviews(mockReviews);

    } catch (err: any) {
      const errorMessage = 'Error al cargar la información del profesional';
      setError(errorMessage);
      showApiError(err, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    // In a real app, this would open contact modal or redirect to messaging
    showSuccess(`Contactando a ${provider?.businessName}...`);

    // Track contact event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'provider_contact', {
        provider_id: provider?.id,
        provider_name: provider?.businessName,
        page_location: window.location.href,
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showSuccess(
      isBookmarked
        ? 'Profesional eliminado de favoritos'
        : 'Profesional agregado a favoritos'
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${provider?.businessName} - Profesional en ${provider?.cityName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Conoce a ${provider?.businessName}, un profesional verificado en ${provider?.cityName}`,
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url);
        showSuccess('Enlace copiado al portapapeles');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const handleReport = () => {
    // In a real app, this would open a report modal
    showSuccess('Reporte enviado. Revisaremos la información.');
  };

  const handleWriteReview = () => {
    setWriteReviewOpen(true);
  };

  const handleLogin = () => {
    // In a real app, this would redirect to login page or open login modal
    navigate('/login');
  };

  const handleSubmitReview = (reviewData: any) => {
    // In a real app, this would submit to API
    console.log('Review submitted:', reviewData);
    showSuccess('¡Reseña publicada exitosamente!');

    // Refresh reviews (in real app would refetch from API)
    fetchProviderData();
  };

  const handleHelpfulClick = (reviewId: string) => {
    // In a real app, this would call API to mark review as helpful
    showSuccess('Gracias por tu feedback');
  };

  const handleReportReview = (reviewId: string) => {
    // In a real app, this would open report modal
    showSuccess('Reporte enviado');
  };

  // Loading state
  if (loading) {
    return (
      <Layout variant="page">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando información del profesional..." />
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !provider) {
    return (
      <Layout variant="page">
        <div className="min-h-screen flex items-center justify-center">
          <ErrorMessage
            title="Error al cargar el profesional"
            message={error || 'No se pudo encontrar la información del profesional'}
            type="error"
            variant="page"
            onRetry={fetchProviderData}
          />
        </div>
      </Layout>
    );
  }

  return (
    <>
      {/* SEO */}
      <ProviderDetailSEO
        providerName={provider.businessName}
        services={provider.services?.map(s => s.name) || []}
        location={provider.cityName}
        rating={provider.averageRating}
        reviewCount={provider.totalReviews}
      />

      <Layout variant="page">
        {/* Provider Header */}
        <ProviderDetailHeader
          provider={provider}
          onContact={handleContact}
          onBookmark={handleBookmark}
          onShare={handleShare}
          onReport={handleReport}
          isBookmarked={isBookmarked}
        />

        {/* Portfolio Gallery */}
        <PortfolioGallery
          images={portfolioImages}
          title={`Trabajos de ${provider.businessName}`}
          description="Ejemplos del trabajo realizado por este profesional"
        />

        {/* Location Map */}
        <LocationMap
          city={provider.cityName}
          showExactLocation={false} // In real app, this would depend on provider settings
        />

        {/* Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          totalReviews={provider.totalReviews}
          averageRating={provider.averageRating}
          onWriteReview={handleWriteReview}
          onHelpfulClick={handleHelpfulClick}
          onReportReview={handleReportReview}
        />

        {/* Write Review Modal */}
        <WriteReviewModal
          isOpen={writeReviewOpen}
          onClose={() => setWriteReviewOpen(false)}
          providerName={provider.businessName}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onSubmitReview={handleSubmitReview}
        />
      </Layout>
    </>
  );
};

export default ProviderDetailPage;
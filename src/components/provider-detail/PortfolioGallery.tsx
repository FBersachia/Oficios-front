import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortfolioImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
}

interface PortfolioGalleryProps {
  images: PortfolioImage[];
  title?: string;
  description?: string;
  onImageClick?: (image: PortfolioImage, index: number) => void;
  className?: string;
}

interface LightboxProps {
  images: PortfolioImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !currentImage) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = currentImage.title || `portfolio-image-${currentImage.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title || 'Portfolio Image',
          text: currentImage.description || 'Check out this work!',
          url: currentImage.url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(currentImage.url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            onClick={onPrevious}
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            onClick={onNext}
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20"
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        <Button
          onClick={handleDownload}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </Button>
        <Button
          onClick={handleShare}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>

      {/* Main image */}
      <div className="relative max-w-7xl max-h-[90vh] mx-4">
        <img
          src={currentImage.url}
          alt={currentImage.title || 'Portfolio image'}
          className="max-w-full max-h-full object-contain"
        />

        {/* Image info */}
        {(currentImage.title || currentImage.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            {currentImage.title && (
              <h3 className="text-white text-xl font-semibold mb-2">
                {currentImage.title}
              </h3>
            )}
            {currentImage.description && (
              <p className="text-gray-200 text-sm">
                {currentImage.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Background click to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  images,
  title = 'Galería de trabajos',
  description,
  onImageClick,
  className = '',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(
    new Set(images.map(img => img.category).filter(Boolean))
  ) as string[];

  // Filter images by category
  const filteredImages = selectedCategory
    ? images.filter(img => img.category === selectedCategory)
    : images;

  const handleImageClick = (image: PortfolioImage, index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    onImageClick?.(image, index);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < filteredImages.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (images.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ZoomIn className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin trabajos disponibles
            </h3>
            <p className="text-gray-600">
              Este profesional aún no ha subido ejemplos de su trabajo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('py-12 bg-white', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                {filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'}
              </p>
            </div>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                >
                  Todos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(image, index)}
              >
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.title || `Portfolio image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>

                {/* Image info */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {image.title}
                    </p>
                  </div>
                )}

                {/* Category badge */}
                {image.category && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {image.category}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show more link if there are many images */}
          {images.length > 12 && filteredImages.length <= 12 && (
            <div className="text-center mt-8">
              <Button variant="outline">
                Ver más trabajos ({images.length - 12} adicionales)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
};

export default PortfolioGallery;
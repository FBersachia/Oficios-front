import React, { useState } from 'react';
import { X, Star, Camera, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  isAuthenticated: boolean;
  onLogin: () => void;
  onSubmitReview?: (review: ReviewData) => void;
  className?: string;
}

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  service?: string;
  images?: File[];
}

const LoginRequired: React.FC<{ onLogin: () => void; onClose: () => void }> = ({
  onLogin,
  onClose,
}) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="h-8 w-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Inicia sesión para escribir una reseña
    </h3>
    <p className="text-gray-600 mb-6">
      Necesitas una cuenta para escribir reseñas y ayudar a otros usuarios
      a tomar mejores decisiones.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
        Iniciar sesión
      </Button>
      <Button onClick={onClose} variant="outline">
        Cancelar
      </Button>
    </div>
  </div>
);

const ReviewForm: React.FC<{
  providerName: string;
  onSubmit: (review: ReviewData) => void;
  onClose: () => void;
}> = ({ providerName, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    title: '',
    comment: '',
    service: '',
    images: [],
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ReviewData>>({});

  const services = [
    'Plomería',
    'Electricidad',
    'Carpintería',
    'Pintura',
    'Limpieza',
    'Jardinería',
    'Reparaciones generales',
    'Otro',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewData> = {};

    if (formData.rating === 0) {
      newErrors.rating = 1; // Use number to indicate error
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    }
    if (formData.comment.length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...validFiles].slice(0, 5), // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Muy malo';
      case 2: return 'Malo';
      case 3: return 'Regular';
      case 4: return 'Bueno';
      case 5: return 'Excelente';
      default: return 'Selecciona una calificación';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Calificación general *
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  (hoveredRating >= star || formData.rating >= star)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
          <span className="ml-3 text-sm text-gray-600">
            {getRatingText(hoveredRating || formData.rating)}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">Selecciona una calificación</p>
        )}
      </div>

      {/* Service */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Tipo de servicio (opcional)
        </label>
        <select
          value={formData.service}
          onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecciona un servicio</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Título de la reseña (opcional)
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Resumen de tu experiencia"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={100}
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.title.length}/100 caracteres
        </p>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Tu experiencia *
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Comparte los detalles de tu experiencia con este profesional..."
          rows={5}
          className={cn(
            'w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.comment ? 'border-red-300' : 'border-gray-300'
          )}
          maxLength={1000}
        />
        <div className="mt-1 flex justify-between">
          <span className="text-sm text-gray-500">
            {formData.comment.length}/1000 caracteres
          </span>
          {errors.comment && (
            <span className="text-sm text-red-600">{errors.comment}</span>
          )}
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Fotos del trabajo (opcional)
        </label>
        <div className="space-y-3">
          {/* Upload button */}
          <div className="flex items-center space-x-3">
            <label className="cursor-pointer bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center space-y-2">
                <Camera className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-600">Subir fotos</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <div className="text-sm text-gray-500">
              <p>Máximo 5 fotos, 5MB cada una</p>
              <p>JPG, PNG o WebP</p>
            </div>
          </div>

          {/* Preview images */}
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Pautas para reseñas
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Sé honesto y constructivo en tu feedback</li>
          <li>• Describe tu experiencia de manera específica</li>
          <li>• Evita información personal o de contacto</li>
          <li>• Mantén un lenguaje respetuoso</li>
        </ul>
      </div>

      {/* Submit buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || formData.rating === 0 || !formData.comment.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Publicando...
            </>
          ) : (
            'Publicar reseña'
          )}
        </Button>
      </div>
    </form>
  );
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  providerName,
  isAuthenticated,
  onLogin,
  onSubmitReview,
  className = '',
}) => {
  if (!isOpen) return null;

  const handleSubmitReview = async (reviewData: ReviewData) => {
    // In a real app, this would make an API call
    console.log('Submitting review:', reviewData);
    onSubmitReview?.(reviewData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={cn(
        'bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Escribir reseña
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Comparte tu experiencia con {providerName}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAuthenticated ? (
            <ReviewForm
              providerName={providerName}
              onSubmit={handleSubmitReview}
              onClose={onClose}
            />
          ) : (
            <LoginRequired onLogin={onLogin} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteReviewModal;
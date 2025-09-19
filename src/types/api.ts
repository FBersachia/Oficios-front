// Common types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// Service types
export interface Service {
  id: number;
  name: string;
}

// City types
export interface City {
  id: number;
  name: string;
}

// Provider types
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';
export type ProviderStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface PortfolioItem {
  id: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface Provider {
  id: number;
  businessName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  cityName: string;
  bio?: string;
  availabilityStatus: AvailabilityStatus;
  status: ProviderStatus;
  services: Service[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface ProviderDetail extends Provider {
  portfolio: PortfolioItem[];
}

export interface ProvidersSearchParams extends PaginationParams {
  cityId?: number;
  serviceIds?: number[];
  search?: string;
  minRating?: number;
  availabilityStatusId?: number;
  availabilityStatus?: AvailabilityStatus;
}

export interface ProvidersResponse {
  providers: Provider[];
  total: number;
  page: number;
  limit: number;
}

// Provider profile management types
export interface CreateProviderProfile {
  businessName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  cityId: number;
  bio?: string;
  serviceIds: number[];
}

export interface UpdateProviderProfile {
  businessName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  cityId?: number;
  bio?: string;
  serviceIds?: number[];
}

export interface CreatePortfolioItem {
  imageUrl: string;
  description: string;
}

// Review types
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  photoUrl?: string;
  clientName: string;
  createdAt: string;
}

export interface CreateReview {
  providerProfileId: number;
  rating: number;
  comment: string;
  photoUrl?: string;
}

export interface ReviewWithStatus extends Review {
  providerProfileId: number;
  status: ReviewStatus;
}

export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export interface ReviewsResponse {
  reviews: Review[];
  statistics: ReviewStatistics;
  pagination: PaginationResponse;
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
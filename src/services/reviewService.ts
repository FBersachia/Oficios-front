import api from '@/lib/axios';
import type {
  ReviewsResponse,
  CreateReview,
  ReviewWithStatus,
  PaginationParams,
} from '@/types/api';

export const reviewService = {
  /**
   * Get reviews for a specific provider
   */
  getProviderReviews: async (
    providerId: number,
    params: PaginationParams = {}
  ): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get<ReviewsResponse>(
      `/providers/${providerId}/reviews?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Create a new review for a provider (requires client or mixto role)
   */
  createReview: async (data: CreateReview): Promise<ReviewWithStatus> => {
    const response = await api.post<ReviewWithStatus>('/reviews', data);
    return response.data;
  },

  /**
   * Get own reviews (reviews created by the authenticated user)
   */
  getOwnReviews: async (params: PaginationParams = {}): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get<ReviewsResponse>(`/reviews/own?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Update own review
   */
  updateReview: async (reviewId: number, data: Partial<CreateReview>): Promise<ReviewWithStatus> => {
    const response = await api.put<ReviewWithStatus>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * Delete own review
   */
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};
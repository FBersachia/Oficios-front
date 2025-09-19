import api from '@/lib/axios';
import type {
  ProvidersSearchParams,
  ProvidersResponse,
  ProviderDetail,
  CreateProviderProfile,
  UpdateProviderProfile,
  CreatePortfolioItem,
  PortfolioItem,
} from '@/types/api';

export const providerService = {
  /**
   * Search providers with filters and pagination
   */
  searchProviders: async (params: ProvidersSearchParams = {}): Promise<ProvidersResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.cityId) searchParams.append('cityId', params.cityId.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params.availabilityStatusId) searchParams.append('availabilityStatusId', params.availabilityStatusId.toString());
    if (params.availabilityStatus) searchParams.append('availabilityStatus', params.availabilityStatus);

    // Handle multiple serviceIds
    if (params.serviceIds && params.serviceIds.length > 0) {
      params.serviceIds.forEach(id => searchParams.append('serviceIds', id.toString()));
    }

    const response = await api.get<ProvidersResponse>(`/providers?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Get provider details by ID
   */
  getProviderById: async (id: number): Promise<ProviderDetail> => {
    const response = await api.get<ProviderDetail>(`/providers/${id}`);
    return response.data;
  },

  /**
   * Create provider profile (requires provider or mixto role)
   */
  createProfile: async (data: CreateProviderProfile): Promise<ProviderDetail> => {
    const response = await api.post<ProviderDetail>('/provider/profile', data);
    return response.data;
  },

  /**
   * Update provider profile (requires provider or mixto role)
   */
  updateProfile: async (data: UpdateProviderProfile): Promise<ProviderDetail> => {
    const response = await api.put<ProviderDetail>('/provider/profile', data);
    return response.data;
  },

  /**
   * Get own provider profile (requires provider or mixto role)
   */
  getOwnProfile: async (): Promise<ProviderDetail> => {
    const response = await api.get<ProviderDetail>('/provider/profile');
    return response.data;
  },

  /**
   * Add item to portfolio (requires provider or mixto role)
   */
  addPortfolioItem: async (data: CreatePortfolioItem): Promise<PortfolioItem> => {
    const response = await api.post<PortfolioItem>('/provider/portfolio', data);
    return response.data;
  },

  /**
   * Update portfolio item (requires provider or mixto role)
   */
  updatePortfolioItem: async (id: number, data: Partial<CreatePortfolioItem>): Promise<PortfolioItem> => {
    const response = await api.put<PortfolioItem>(`/provider/portfolio/${id}`, data);
    return response.data;
  },

  /**
   * Delete portfolio item (requires provider or mixto role)
   */
  deletePortfolioItem: async (id: number): Promise<void> => {
    await api.delete(`/provider/portfolio/${id}`);
  },
};
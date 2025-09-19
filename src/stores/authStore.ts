import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { isTokenExpired } from '@/utils/tokenUtils';
import type { AuthStore, LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Update axios default header for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/register', data);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Update axios default header for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        // Clear axios default header
        delete api.defaults.headers.common['Authorization'];

        // Clear localStorage
        localStorage.removeItem('auth-storage');
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },

      clearError: () => {
        set({ error: null });
      },

      checkTokenExpiration: () => {
        const { token, logout } = get();
        if (token && isTokenExpired(token)) {
          logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Check if token is expired on rehydration
          if (isTokenExpired(state.token)) {
            state.logout();
          } else {
            // Set axios header if token is valid
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          }
        }
      },
    }
  )
);

// Auto-check token expiration every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const store = useAuthStore.getState();
    store.checkTokenExpiration();
  }, 5 * 60 * 1000); // 5 minutes
}

export default useAuthStore;
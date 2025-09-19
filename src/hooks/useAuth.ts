import { useCallback } from 'react';
import useAuthStore from '@/stores/authStore';
import type { LoginCredentials, RegisterData, UserRole } from '@/types/auth';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    setToken,
    clearError,
    checkTokenExpiration,
  } = useAuthStore();

  // Helper function to check if user has specific role
  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  // Helper function to check if user has any of the provided roles
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  // Helper function to check if user is admin or superadmin
  const isAdmin = useCallback((): boolean => {
    return hasAnyRole(['admin', 'superadmin']);
  }, [hasAnyRole]);

  // Helper function to check if user is provider or mixto
  const canProvideServices = useCallback((): boolean => {
    return hasAnyRole(['provider', 'mixto']);
  }, [hasAnyRole]);

  // Helper function to check if user can create reviews
  const canCreateReviews = useCallback((): boolean => {
    return hasAnyRole(['client', 'mixto']);
  }, [hasAnyRole]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    setUser,
    setToken,
    clearError,
    checkTokenExpiration,

    // Helper functions
    hasRole,
    hasAnyRole,
    isAdmin,
    canProvideServices,
    canCreateReviews,
  };
};

export default useAuth;
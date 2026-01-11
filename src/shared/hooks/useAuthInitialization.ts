/**
 * Authentication Initialization Hook
 * Ensures auth state is properly hydrated on app startup
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuth } from '@/store/auth/authSlice';
import { getAccessToken, getCurrentUser } from '@/utils/auth';

export const useAuthInitialization = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  useEffect(() => {
    // Only initialize if not already authenticated and we have tokens
    if (!authState.isAuthenticated) {
      const token = getAccessToken();
      const user = getCurrentUser();

      if (token && user) {
        console.log('🔄 Initializing auth state from localStorage');

        // Verify token is not expired
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Date.now() / 1000;

          if (payload.exp > now) {
            // Token is still valid, restore auth state
            dispatch(setAuth({
              access_token: token,
              refresh_token: '', // Will be handled by API calls
              user: user,
              permissions: user.permissions || [],
              roles: user.roles || [],
              isAuthenticated: true,
              loading: false
            }));

            console.log('✅ Auth state restored from localStorage');
          } else {
            console.log('❌ Token expired, clearing stored auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('❌ Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  }, [dispatch, authState.isAuthenticated]);

  return {
    isInitialized: authState.isAuthenticated || (!getAccessToken() && !authState.loading),
    isAuthenticated: authState.isAuthenticated
  };
};
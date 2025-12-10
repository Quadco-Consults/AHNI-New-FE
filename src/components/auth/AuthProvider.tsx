"use client";

import { useEffect, ReactNode, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/auth/authSlice";
import { getAccessToken, getCurrentUser } from "@/utils/auth";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Restores authentication state from localStorage on app initialization
 *
 * This component runs on every app load to check if there's a valid token
 * and user data in localStorage, then restores the Redux auth state.
 *
 * This solves the issue where users appear unauthenticated after page refresh
 * even though they have valid tokens stored locally.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple auth state restorations
    if (hasInitialized.current) {
      console.log('🚫 Auth restoration already performed, skipping...');
      return;
    }

    const restoreAuthState = () => {
      hasInitialized.current = true;
      const token = getAccessToken();
      const user = getCurrentUser();

      console.log('🔄 AUTH RESTORE DEBUG:', {
        hasToken: !!token,
        hasUser: !!user,
        userId: user?.id || 'none',
        userPermissions: user?.permissions?.length || 0,
        userRoles: user?.roles?.length || 0,
        userDepartment: user?.employee?.department?.name || user?.department?.name || 'none'
      });

      // Only restore if we have both token and user data AND they match
      // Validate token isn't expired or stale
      if (token && user) {
        try {
          // Basic JWT token validation - check if it's not expired
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const isTokenExpired = tokenPayload.exp * 1000 < Date.now();

          if (isTokenExpired) {
            console.warn('⚠️ Token expired, clearing stale auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            return;
          }

          console.log('✅ Restoring authentication state from localStorage');
        } catch (error) {
          console.warn('⚠️ Invalid token format, clearing auth data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          return;
        }

        dispatch(setAuth({
          access_token: token,
          refresh_token: "", // We don't store refresh token in localStorage for security
          isAuthenticated: true,
          loading: false,
          user: {
            ...user,
            // Ensure we have the employee structure for department-based features
            employee: user?.employee || {
              department: user?.department || null,
              position: user?.position || null,
              location: user?.location || null
            }
          },
          // Extract permissions from user object (stored during login)
          permissions: user?.permissions || [],
          roles: user?.roles || []
        }));
      } else {
        console.log('⚠️ No valid authentication data found in localStorage');
        if (token && !user) {
          console.log('🔄 Found token but no user data - clearing invalid token');
          localStorage.removeItem('token');
        }
      }
    };

    restoreAuthState();
  }, [dispatch]);

  return <>{children}</>;
}
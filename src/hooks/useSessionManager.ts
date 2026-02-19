"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Configuration constants
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes of inactivity before logout
const TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // Refresh token every 5 minutes while active
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

// Get base URL for API calls
const getBaseURL = () => {
  const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://127.0.0.1:8000/api/v1/";
  return rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;
};

interface UseSessionManagerOptions {
  enabled?: boolean;
  onSessionExpired?: () => void;
  onTokenRefreshed?: () => void;
  idleTimeoutMs?: number;
  refreshIntervalMs?: number;
}

/**
 * Session Manager Hook
 *
 * Provides activity-based session management with:
 * - Proactive token refresh while user is active
 * - Automatic logout after idle timeout (default 10 minutes)
 * - Activity tracking via mouse, keyboard, scroll, and touch events
 */
export const useSessionManager = (options: UseSessionManagerOptions = {}) => {
  const {
    enabled = true,
    onSessionExpired,
    onTokenRefreshed,
    idleTimeoutMs = IDLE_TIMEOUT_MS,
    refreshIntervalMs = TOKEN_REFRESH_INTERVAL_MS,
  } = options;

  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(token && refreshToken);
  }, []);

  // Refresh the access token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      console.log('🔄 Token refresh already in progress, skipping...');
      return true;
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.warn('⚠️ No refresh token available');
      return false;
    }

    isRefreshingRef.current = true;

    try {
      console.log('🔄 Proactively refreshing access token...');
      const baseURL = getBaseURL();

      const response = await axios.post(`${baseURL}auth/token/refresh/`, {
        refresh: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle different response structures
      const newAccessToken = response.data?.data?.access || response.data?.access;
      const newRefreshToken = response.data?.data?.refresh || response.data?.refresh;

      if (newAccessToken) {
        localStorage.setItem('token', newAccessToken);
        console.log('✅ Access token refreshed successfully');

        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
          console.log('✅ Refresh token rotated successfully');
        }

        onTokenRefreshed?.();
        return true;
      } else {
        console.error('❌ Invalid token refresh response:', response.data);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error.response?.data || error.message);

      // If refresh fails with 401, the refresh token is invalid
      if (error.response?.status === 401) {
        console.warn('🔒 Refresh token expired or invalid, logging out...');
        handleSessionExpired();
        return false;
      }

      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [onTokenRefreshed]);

  // Handle session expiration
  const handleSessionExpired = useCallback(() => {
    console.log('🔒 Session expired due to inactivity');

    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Call custom handler if provided
    onSessionExpired?.();

    // Redirect to login
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath.startsWith('/vendor-portal')) {
      router.push('/vendor-portal/login');
    } else {
      router.push('/auth/login');
    }
  }, [onSessionExpired, router]);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Reset idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      if (isAuthenticated()) {
        console.log(`⏰ User idle for ${idleTimeoutMs / 1000 / 60} minutes, logging out...`);
        handleSessionExpired();
      }
    }, idleTimeoutMs);
  }, [idleTimeoutMs, isAuthenticated, handleSessionExpired]);

  // Start the token refresh interval
  const startRefreshInterval = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Initial refresh check
    const checkAndRefresh = async () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;

      // Only refresh if user was recently active (within last minute)
      if (timeSinceLastActivity < 60000 && isAuthenticated()) {
        await refreshAccessToken();
      } else if (timeSinceLastActivity >= idleTimeoutMs) {
        // User has been idle too long
        handleSessionExpired();
      }
    };

    // Set up periodic refresh
    refreshTimerRef.current = setInterval(checkAndRefresh, refreshIntervalMs);

    console.log(`🔄 Token refresh interval started (every ${refreshIntervalMs / 1000 / 60} minutes)`);
  }, [refreshIntervalMs, idleTimeoutMs, isAuthenticated, refreshAccessToken, handleSessionExpired]);

  // Initialize session management
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Don't set up session management on login/public pages
    const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/vendor-portal/login'];
    const currentPath = window.location.pathname;
    if (publicPaths.some(path => currentPath.startsWith(path))) {
      return;
    }

    if (!isAuthenticated()) {
      console.log('📋 Session manager: User not authenticated, skipping setup');
      return;
    }

    console.log('🚀 Session manager initialized');
    console.log(`   - Idle timeout: ${idleTimeoutMs / 1000 / 60} minutes`);
    console.log(`   - Token refresh interval: ${refreshIntervalMs / 1000 / 60} minutes`);

    // Set initial activity
    updateActivity();

    // Start token refresh interval
    startRefreshInterval();

    // Add activity event listeners
    const handleActivity = () => {
      updateActivity();
    };

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Also track visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Tab became visible, updating activity');
        updateActivity();

        // Proactively refresh token when user returns to tab
        if (isAuthenticated()) {
          refreshAccessToken();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      console.log('🧹 Session manager cleanup');

      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [enabled, idleTimeoutMs, refreshIntervalMs, isAuthenticated, updateActivity, startRefreshInterval, refreshAccessToken]);

  // Return useful methods for manual control
  return {
    refreshToken: refreshAccessToken,
    updateActivity,
    isAuthenticated,
    getIdleTime: () => Date.now() - lastActivityRef.current,
  };
};

export default useSessionManager;

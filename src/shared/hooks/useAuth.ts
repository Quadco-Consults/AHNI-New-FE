import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication status on mount and on storage changes
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
    };

    checkAuth(); // Check on mount

    // Listen for storage changes (when login/logout happens in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isClient]);

  return {
    isLoggedIn: isClient ? isLoggedIn : false,
    isClient,
  };
};
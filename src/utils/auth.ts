// Simple auth utility to replace Redux auth state
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_last_updated');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setCurrentUser = (user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('user_last_updated', Date.now().toString());

  // Dispatch custom event to notify components of user update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: user }));
  }
};

export const getUserLastUpdated = (): number => {
  if (typeof window === 'undefined') return 0;
  const timestamp = localStorage.getItem('user_last_updated');
  return timestamp ? parseInt(timestamp, 10) : 0;
};

export const refreshUserData = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;

  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/auth/user/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setCurrentUser(userData);
      return userData;
    } else {
      console.error('Failed to refresh user data:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
};

export const logout = () => {
  removeAccessToken();
  window.location.href = '/auth/login';
};
// User lookup utility for contract requests
// This can be enhanced to cache user data and provide fallback names

export interface UserDetail {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

// Simple in-memory cache for user lookups
const userCache = new Map<string, UserDetail>();

export const cacheUser = (user: UserDetail) => {
  userCache.set(user.id, user);
};

export const getUserFromCache = (userId: string): UserDetail | null => {
  return userCache.get(userId) || null;
};

export const formatUserName = (user: UserDetail | null, fallbackId?: string): string => {
  if (user) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (fallbackId) {
    return `User ID: ${fallbackId}`;
  }
  return "Not assigned";
};

// Clear cache when needed
export const clearUserCache = () => {
  userCache.clear();
};
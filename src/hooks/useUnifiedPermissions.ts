/**
 * Unified Permissions Hook
 * Provides single source of truth for all permission checking
 * Replaces scattered permission logic throughout the app
 */

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useGetUserProfile } from '@/features/auth/controllers/userController';
import {
  PermissionService,
  NormalizedPermissions,
  PermissionRequirement
} from '@/services/permissionService';

interface UseUnifiedPermissionsReturn {
  normalizedPermissions: NormalizedPermissions | null;
  hasPermission: (requirements: PermissionRequirement[]) => boolean;
  hasPermissionByCodename: (module: string, codename: string) => boolean;
  isAdmin: boolean;
  isLoading: boolean;
  permissions: any[];
  roles: any[];
  user: any;
  getUserPermissions: () => string[];
}

export const useUnifiedPermissions = (): UseUnifiedPermissionsReturn => {
  const authState = useAppSelector(state => state.auth);
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfile();

  // Create normalized permissions from all available sources
  const normalizedPermissions = useMemo(() => {
    // Don't process if we don't have basic user data
    if (!authState.user && !userProfile?.data) {
      return null;
    }

    // Create combined data object with priority: Redux root > Profile > Redux nested
    const combinedData = {
      // Permissions from multiple sources (priority order)
      permissions: authState.permissions ||
                  userProfile?.data?.permissions ||
                  authState.user?.permissions ||
                  [],

      // Roles from multiple sources (priority order)
      roles: authState.roles ||
            userProfile?.data?.roles ||
            authState.user?.roles ||
            [],

      // User data (prefer profile API over Redux)
      user: userProfile?.data || authState.user
    };

    // Only process if we have some data
    if (!combinedData.user) {
      return null;
    }

    return PermissionService.getInstance().normalizePermissions(combinedData);
  }, [
    authState.permissions,
    authState.roles,
    authState.user,
    userProfile?.data
  ]);

  // Permission checking functions
  const hasPermission = useMemo(() => {
    return (requirements: PermissionRequirement[]): boolean => {
      if (!normalizedPermissions) return false;

      return PermissionService.getInstance().hasPermission(
        normalizedPermissions,
        requirements
      );
    };
  }, [normalizedPermissions]);

  const hasPermissionByCodename = useMemo(() => {
    return (module: string, codename: string): boolean => {
      if (!normalizedPermissions) return false;

      return PermissionService.getInstance().hasPermissionByCodename(
        normalizedPermissions,
        module,
        codename
      );
    };
  }, [normalizedPermissions]);

  const getUserPermissions = useMemo(() => {
    return (): string[] => {
      if (!normalizedPermissions) return [];

      return PermissionService.getInstance().getUserPermissionCodenames(
        normalizedPermissions
      );
    };
  }, [normalizedPermissions]);

  // Derived values
  const isAdmin = normalizedPermissions?.isAdmin || false;
  const isLoading = profileLoading || !normalizedPermissions?.isHydrated;

  // Legacy compatibility - provide raw permissions and roles
  const permissions = normalizedPermissions?.permissions || [];
  const roles = normalizedPermissions?.roles || [];
  const user = userProfile?.data || authState.user;

  return {
    normalizedPermissions,
    hasPermission,
    hasPermissionByCodename,
    isAdmin,
    isLoading,
    permissions,
    roles,
    user,
    getUserPermissions
  };
};

/**
 * Simplified hook for basic permission checking
 */
export const useHasPermission = (requirements: PermissionRequirement[]): boolean => {
  const { hasPermission } = useUnifiedPermissions();
  return hasPermission(requirements);
};

/**
 * Hook for checking specific permission by codename
 */
export const useHasPermissionByCodename = (module: string, codename: string): boolean => {
  const { hasPermissionByCodename } = useUnifiedPermissions();
  return hasPermissionByCodename(module, codename);
};

/**
 * Admin status hook
 */
export const useIsAdmin = (): boolean => {
  const { isAdmin } = useUnifiedPermissions();
  return isAdmin;
};

/**
 * Hook for menu permission checking (specific to sidebar needs)
 */
export const useMenuPermissions = () => {
  const { hasPermission, isAdmin, isLoading } = useUnifiedPermissions();

  const canAccessModule = useMemo(() => {
    return (module: string, permissions: string[] = []): boolean => {
      if (isAdmin) return true;
      if (permissions.length === 0) return true;

      return hasPermission([{
        module: module,
        codenames: permissions,
        requireAll: false
      }]);
    };
  }, [hasPermission, isAdmin]);

  return {
    canAccessModule,
    hasPermission,
    isAdmin,
    isLoading
  };
};

/**
 * Debug hook - only use in development
 */
export const usePermissionDebug = () => {
  const { normalizedPermissions, getUserPermissions } = useUnifiedPermissions();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return {
    normalizedPermissions,
    userPermissions: getUserPermissions(),
    debugInfo: {
      permissionCount: normalizedPermissions?.permissions.length || 0,
      roleCount: normalizedPermissions?.roles.length || 0,
      isAdmin: normalizedPermissions?.isAdmin || false,
      userId: normalizedPermissions?.userId || 'unknown'
    }
  };
};
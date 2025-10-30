import { useCallback, useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '@/store/auth/authSlice';
import { IUser } from '@/features/auth/types/user';
import { IPermission, IRole } from '@/features/auth/types/permission';
import { getCurrentUser, isAuthenticated as checkAuth, getUserLastUpdated, refreshUserData } from '@/utils/auth';

/**
 * Universal permission hook for checking user permissions and module access
 *
 * This hook provides a centralized way to check:
 * - Individual permissions by codename
 * - Module access based on assigned_modules
 * - Multiple permission checks
 * - Module-specific permissions
 */
export const usePermissions = () => {
  const auth = useSelector(authSelector);
  const reduxUser = auth.user as IUser | null;
  const [localUser, setLocalUser] = useState<IUser | null>(null);
  const [userLastUpdated, setUserLastUpdated] = useState<number>(0);

  // Initialize local user and track updates
  useEffect(() => {
    const updateLocalUser = () => {
      const currentUser = getCurrentUser();
      const lastUpdated = getUserLastUpdated();
      setLocalUser(currentUser);
      setUserLastUpdated(lastUpdated);
    };

    // Initial load
    updateLocalUser();

    // Listen for user data updates
    const handleUserUpdate = (event: CustomEvent) => {
      updateLocalUser();
    };

    window.addEventListener('userDataUpdated', handleUserUpdate as EventListener);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserUpdate as EventListener);
    };
  }, []);

  // Auto-refresh user data every 5 minutes to catch permission changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const autoRefreshInterval = setInterval(async () => {
      try {
        await refreshUserData();
      } catch (error) {
        console.error('Auto-refresh user data failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoRefreshInterval);
  }, []);

  // Use localStorage if Redux user is empty or has no email
  const user = (reduxUser && reduxUser.email) ? reduxUser : localUser;
  const isAuthenticated = checkAuth();

  // Debug logging to see what we're getting from Redux and localStorage
  console.log('🔍 usePermissions Debug:', {
    auth,
    reduxUser,
    localUser,
    finalUser: user,
    userEmail: user?.email,
    userEmailField: user?.email_address,
    userAllFields: user ? Object.keys(user) : [],
    fullUser: user,
    hasUser: !!user,
    isAuthenticated,
    isAdminEmail: user?.email === 'admin@mail.com'
  });

  /**
   * Check if user has a specific permission by codename
   * Looks through both direct permissions and role-based permissions
   */
  const hasPermission = useCallback((permissionCodename: string): boolean => {
    if (!user) return false;

    // Super admin gets all permissions
    if (user.email === 'admin@mail.com') {
      return true;
    }

    // Check direct permissions assigned to user
    const hasDirectPermission = user.permissions?.some(permissionGroup =>
      permissionGroup.permissions?.some(perm => perm.codename === permissionCodename)
    ) || false;

    // Check permissions from assigned roles (if roles have permissions)
    const hasRolePermission = user.roles?.some((role: any) => {
      // Handle both simple roles (just id/name) and full roles (with permissions)
      if (role.permissions) {
        return role.permissions.some((permissionGroup: any) =>
          permissionGroup.permissions?.some((perm: any) => perm.codename === permissionCodename)
        );
      }
      return false;
    }) || false;

    return hasDirectPermission || hasRolePermission;
  }, [user]);

  /**
   * Check if user has access to a specific module
   * Uses the assigned_modules field from user data
   */
  const hasModule = useCallback((moduleCode: string): boolean => {
    if (!user) return false;

    // Super admin gets access to all modules
    if (user.email === 'admin@mail.com') {
      return true;
    }

    if (!user.assigned_modules) return false;
    return user.assigned_modules.includes(moduleCode);
  }, [user]);

  /**
   * Check if user has ANY of the provided permissions
   * Useful for OR logic - user needs at least one permission
   */
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  /**
   * Check if user has ALL of the provided permissions
   * Useful for AND logic - user needs all permissions
   */
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  /**
   * Get all permissions for a specific module
   * Returns array of permissions user has for the given module
   */
  const getModulePermissions = useCallback((moduleCode: string): IPermission[] => {
    if (!user) return [];

    const allPermissions: IPermission[] = [];

    // Get permissions from direct user permissions
    const directModulePerms = user.permissions?.find(p => p.module === moduleCode);
    if (directModulePerms?.permissions) {
      allPermissions.push(...directModulePerms.permissions);
    }

    // Get permissions from roles (if roles have permissions)
    user.roles?.forEach((role: any) => {
      if (role.permissions) {
        const roleModulePerms = role.permissions.find((p: any) => p.module === moduleCode);
        if (roleModulePerms?.permissions) {
          allPermissions.push(...roleModulePerms.permissions);
        }
      }
    });

    // Remove duplicates by permission id
    const uniquePermissions = allPermissions.filter((perm, index, self) =>
      index === self.findIndex(p => p.id === perm.id)
    );

    return uniquePermissions;
  }, [user]);

  /**
   * Get all modules user has access to
   * Returns both assigned_modules and modules with permissions
   */
  const getAccessibleModules = useCallback((): string[] => {
    if (!user) return [];

    // Super admin gets all modules
    if (user.email === 'admin@mail.com') {
      return ['hr', 'finance', 'procurement', 'admin', 'programs', 'contracts'];
    }

    const modules = new Set<string>();

    // Add assigned modules (primary source of module access)
    if (user.assigned_modules && Array.isArray(user.assigned_modules)) {
      user.assigned_modules.forEach(module => modules.add(module));
    }

    // Add modules from direct permissions
    user.permissions?.forEach(permGroup => {
      if (permGroup.module) {
        modules.add(permGroup.module);
      }
    });

    // Add modules from role permissions (if available)
    user.roles?.forEach((role: any) => {
      if (role.permissions) {
        role.permissions.forEach((permGroup: any) => {
          if (permGroup.module) {
            modules.add(permGroup.module);
          }
        });
      }
    });

    return Array.from(modules);
  }, [user]);

  /**
   * Check if user is admin
   * Checks for admin role, superuser status, or admin permissions
   */
  const isAdmin = useCallback((): boolean => {
    if (!user) return false;

    // Super admin email check - immediate admin access
    if (user.email === 'admin@mail.com') {
      return true;
    }

    // Check if user has admin role
    const hasAdminRole = user.roles?.some(role =>
      role.name?.toLowerCase().includes('admin') ||
      role.name?.toLowerCase().includes('administrator')
    ) || false;

    // Check for admin permissions
    const hasAdminPermissions = hasAnyPermission([
      'manage_users',
      'manage_roles',
      'manage_permissions',
      'system_admin'
    ]);

    // Check standard user flags (these might not exist on all user objects)
    const isStaff = (user as any).is_staff || false;
    const isSuperuser = (user as any).is_superuser || false;

    return hasAdminRole || hasAdminPermissions || isStaff || isSuperuser;
  }, [user, hasAnyPermission]);

  /**
   * Check if user belongs to specific department
   * Uses department field from user data
   */
  const belongsToDepartment = useCallback((department: string): boolean => {
    if (!user) return false;
    return user.department?.toLowerCase() === department.toLowerCase();
  }, [user]);

  /**
   * Get user's highest role level (if roles have levels)
   * Useful for hierarchical permission checking
   */
  const getHighestRoleLevel = useCallback((): number => {
    if (!user || !user.roles) return 0;

    // This assumes roles have a level property - may need backend support
    return Math.max(...user.roles.map(role => (role as any).level || 0));
  }, [user]);

  /**
   * Debug helper - get all user permissions as flat array
   * Useful for development and troubleshooting
   */
  const getAllPermissions = useCallback((): IPermission[] => {
    if (!user) return [];

    const allPermissions: IPermission[] = [];

    // Add direct permissions
    user.permissions?.forEach(permGroup => {
      if (permGroup.permissions) {
        allPermissions.push(...permGroup.permissions);
      }
    });

    // Add role permissions (if available)
    user.roles?.forEach((role: any) => {
      if (role.permissions) {
        role.permissions.forEach((permGroup: any) => {
          if (permGroup.permissions) {
            allPermissions.push(...permGroup.permissions);
          }
        });
      }
    });

    // Remove duplicates
    return allPermissions.filter((perm, index, self) =>
      index === self.findIndex(p => p.id === perm.id)
    );
  }, [user]);

  /**
   * Manually refresh user permissions from server
   * Use this after role/permission changes to get immediate updates
   */
  const refreshPermissions = useCallback(async () => {
    try {
      const freshUserData = await refreshUserData();
      return freshUserData;
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
      return null;
    }
  }, []);

  // Memoized values for performance
  const userModules = useMemo(() => getAccessibleModules(), [getAccessibleModules]);
  const userIsAdmin = useMemo(() => isAdmin(), [isAdmin]);
  const allUserPermissions = useMemo(() => getAllPermissions(), [getAllPermissions]);

  return {
    // Core permission checking
    hasPermission,
    hasModule,
    hasAnyPermission,
    hasAllPermissions,

    // Module and permission queries
    getModulePermissions,
    getAccessibleModules,
    userModules,

    // User status checks
    isAdmin,
    userIsAdmin,
    belongsToDepartment,
    getHighestRoleLevel,

    // Debug and development
    getAllPermissions,
    allUserPermissions,

    // User data and refresh
    user,
    isAuthenticated,
    refreshPermissions,
    userLastUpdated
  };
};

export default usePermissions;
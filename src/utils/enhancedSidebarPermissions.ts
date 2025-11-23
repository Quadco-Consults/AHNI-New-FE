/**
 * Enhanced Sidebar Permission System
 * Fixes permission and menu display issues
 */

import { SidebarItem, GlobalHubItem, PermissionRequirement } from './sidebarItems';
import { IUser, IPermission } from '@/features/auth/types/auth';
import { IUser as UserProfileUser } from '@/features/auth/types/user';
import {
  normalizeUserPermissions,
  isEnhancedSuperAdmin,
  hasEnhancedPermission,
  debugPermissions
} from './authFixUtils';

/**
 * Enhanced permission checker with comprehensive debugging
 */
export function hasPermissionEnhanced(
  rawUserData: UserProfileUser | IUser | any,
  requiredPermissions?: PermissionRequirement[],
  enableDebug: boolean = true,
  externalPermissions?: IPermission[],
  externalRoles?: any[]
): boolean {
  try {
    // Normalize user data
    const { permissions, roles, enhancedUser } = normalizeUserPermissions(rawUserData, externalPermissions, externalRoles);

    if (enableDebug) {
      debugPermissions(enhancedUser, permissions, roles);
    }

    // Super admin bypass
    if (isEnhancedSuperAdmin(enhancedUser, permissions, roles)) {
      if (enableDebug) {
        console.log('✅ SUPER ADMIN ACCESS GRANTED');
      }
      return true;
    }

    // If no permissions required, grant access to authenticated users
    if (!requiredPermissions || requiredPermissions.length === 0) {
      // For items without permission requirements, allow access to any authenticated user
      const isAuthenticated = permissions.length > 0 || enhancedUser?.id || enhancedUser?.email;
      if (enableDebug) {
        console.log(isAuthenticated ? '✅ NO PERMISSIONS REQUIRED - ACCESS GRANTED (Authenticated)' : '❌ NO PERMISSIONS REQUIRED - ACCESS DENIED (Not Authenticated)');
      }
      return isAuthenticated;
    }

    // Use enhanced permission checking
    const hasAccess = hasEnhancedPermission(permissions, requiredPermissions, enhancedUser, roles);

    if (enableDebug) {
      console.log(hasAccess ? '✅ PERMISSION GRANTED' : '❌ PERMISSION DENIED', {
        required: requiredPermissions.map(r => `${r.module}:${r.codenames.join(',')}`),
        userModules: permissions.map(p => p.module),
        userPermissionsDetail: permissions.map(p => ({
          module: p.module,
          codenames: p.permissions?.map((perm: any) => perm.codename) || []
        }))
      });
    }

    return hasAccess;
  } catch (error) {
    console.error('❌ Permission check error:', error);
    return false;
  }
}

/**
 * Enhanced sidebar filtering with improved debugging
 */
export function filterSidebarByPermissionsEnhanced(
  items: SidebarItem[],
  rawUserData: UserProfileUser | IUser | any,
  enableDebug: boolean = false,
  externalPermissions?: IPermission[],
  externalRoles?: any[]
): SidebarItem[] {
  if (enableDebug) {
    console.log('🔍 FILTERING SIDEBAR ITEMS:', {
      totalItems: items.length,
      itemNames: items.map(item => item.name),
      externalPermissionsCount: externalPermissions?.length || 0,
      externalRolesCount: externalRoles?.length || 0
    });
  }

  return items
    .filter(item => {
      const hasAccess = hasPermissionEnhanced(rawUserData, item.permissions, enableDebug, externalPermissions, externalRoles);

      if (enableDebug) {
        console.log(`🔍 Item "${item.name}":`, hasAccess ? '✅ VISIBLE' : '❌ HIDDEN', {
          requiredPerms: item.permissions?.map(p => `${p.module}:${p.codenames.join(',')}`),
          hasRequiredPerms: item.permissions ? item.permissions.length > 0 : false
        });
      }

      return hasAccess;
    })
    .map(item => {
      // Recursively filter children
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterSidebarByPermissionsEnhanced(
          item.children,
          rawUserData,
          enableDebug,
          externalPermissions,
          externalRoles
        );

        // Keep parent if it has visible children or its own path
        if (filteredChildren.length > 0 || item.path) {
          return {
            ...item,
            children: filteredChildren
          };
        }
        return null;
      }
      return item;
    })
    .filter((item): item is SidebarItem => item !== null);
}

/**
 * Enhanced global hub filtering
 */
export function filterGlobalHubByPermissionsEnhanced(
  items: GlobalHubItem[],
  rawUserData: UserProfileUser | IUser | any,
  enableDebug: boolean = false,
  externalPermissions?: IPermission[],
  externalRoles?: any[]
): GlobalHubItem[] {
  return items.filter(item =>
    hasPermissionEnhanced(rawUserData, item.permissions, enableDebug, externalPermissions, externalRoles)
  );
}

/**
 * Enhanced global hub access check - Universal Access
 * ALL authenticated users should have access to Global Hub
 */
export function hasGlobalHubAccessEnhanced(
  rawUserData: UserProfileUser | IUser | any,
  externalPermissions?: IPermission[],
  externalRoles?: any[]
): boolean {
  const { permissions, enhancedUser } = normalizeUserPermissions(rawUserData, externalPermissions, externalRoles);

  // Universal Global Hub Access - any authenticated user with permissions can access
  if (permissions && permissions.length > 0) {
    console.log('✅ GLOBAL HUB ACCESS GRANTED - Universal access for authenticated users');
    return true;
  }

  // Fallback: Check if user is authenticated via user object
  if (enhancedUser && (enhancedUser.id || enhancedUser.email)) {
    console.log('✅ GLOBAL HUB ACCESS GRANTED - User is authenticated');
    return true;
  }

  console.log('❌ GLOBAL HUB ACCESS DENIED - No authentication found');
  return false;
}

/**
 * Enhanced path access checking
 */
export function canAccessPathEnhanced(
  path: string,
  allSidebarItems: SidebarItem[],
  rawUserData: UserProfileUser | IUser | any
): boolean {
  // Recursively search for the path
  const findPath = (items: SidebarItem[]): SidebarItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findPath(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const item = findPath(allSidebarItems);

  if (!item) {
    console.log('❌ Path not found in sidebar:', path);
    return false;
  }

  return hasPermissionEnhanced(rawUserData, item.permissions, true);
}

/**
 * Debug utility to analyze current user state
 */
export function debugCurrentUserState(rawUserData: UserProfileUser | IUser | any) {
  console.log('🚀 === USER STATE DEBUG ===');

  try {
    const { permissions, roles, enhancedUser } = normalizeUserPermissions(rawUserData);

    console.log('📊 User Info:', {
      id: enhancedUser.id,
      email: enhancedUser.email,
      name: `${enhancedUser.first_name} ${enhancedUser.last_name}`,
      department: enhancedUser.department?.name,
      position: enhancedUser.position?.title,
      location: enhancedUser.location?.name,
      is_staff: enhancedUser.is_staff,
      is_superuser: enhancedUser.is_superuser,
      user_type: enhancedUser.user_type
    });

    console.log('🎭 Roles:', {
      count: roles.length,
      roles: roles.map(r => typeof r === 'string' ? r : r?.name || r?.id)
    });

    console.log('🔐 Permissions by Module:');
    permissions.forEach(p => {
      console.log(`  📁 ${p.module}:`, p.permissions?.map((perm: any) => perm.codename) || []);
    });

    console.log('👑 Super Admin Check:',
      isEnhancedSuperAdmin(enhancedUser, permissions, roles) ? 'YES' : 'NO'
    );

  } catch (error) {
    console.error('❌ Debug error:', error);
  }

  console.log('🚀 === END DEBUG ===');
}
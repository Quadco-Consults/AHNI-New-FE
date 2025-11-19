import { SidebarItem, GlobalHubItem, PermissionRequirement } from './sidebarItems';
import { IUser } from '@/features/auth/types/auth';
import {
  isUserAdmin,
  UIPermissionCategory,
  calculateUIPermissions,
  hasUIPermission,
  calculateMenuPermissions
} from '@/utils/positionRolePermissions';

/**
 * Enhanced permission system integration
 * This bridges our new position-role permission system with the existing sidebar logic
 */

/**
 * Check if user is super admin using enhanced detection
 * @param userPermissions - Array of user's permissions from API
 * @param userRoles - Array of user's roles (optional, for when available)
 * @param user - Full user object (optional, for enhanced admin detection)
 * @returns boolean - true if user is super admin
 */
function isSuperAdmin(userPermissions: any[], userRoles?: any[], user?: IUser): boolean {
  // Use our enhanced admin detection if user object is available
  if (user) {
    return isUserAdmin(user);
  }

  // Fallback to legacy detection for backward compatibility
  // Method 1: Check user roles for admin indicators
  if (userRoles && userRoles.length > 0) {
    const adminRoles = ['director', 'super admin', 'superadmin', 'administrator', 'admin', 'super_admin', 'system_admin'];
    const hasAdminRole = userRoles.some(role => {
      // Handle string roles
      if (typeof role === 'string' && role) {
        return adminRoles.some(adminRole =>
          role.toLowerCase().includes(adminRole.toLowerCase())
        );
      }
      // Handle role objects with name property (new structure)
      if (typeof role === 'object' && role && (role as any).name) {
        const roleName = (role as any).name;
        if (typeof roleName === 'string') {
          return adminRoles.some(adminRole =>
            roleName.toLowerCase().includes(adminRole.toLowerCase())
          );
        }
      }
      // Handle role objects with id property (fallback)
      if (typeof role === 'object' && role && (role as any).id) {
        const roleId = (role as any).id;
        if (typeof roleId === 'string') {
          return adminRoles.some(adminRole =>
            roleId.toLowerCase().includes(adminRole.toLowerCase())
          );
        }
      }
      return false;
    });
    if (hasAdminRole) return true;
  }

  // Method 2: Check for admin/superuser permissions
  const hasAdminPermissions = userPermissions.some(p =>
    p.module === 'admin' ||
    p.module === 'superuser' ||
    p.module === 'users' && p.permissions?.some((perm: any) =>
      perm.codename === 'is_superuser' ||
      perm.codename === 'can_view_all' ||
      perm.codename === 'superuser_access' ||
      perm.codename === 'view_user' // Users module access is usually admin-level
    )
  );

  // Method 3: Check if user has permissions across all major modules (likely super admin)
  const majorModules = ['admin', 'finance', 'hr', 'programs', 'procurements', 'users'];
  const hasAllModules = majorModules.every(module =>
    userPermissions.some(p => p.module === module)
  );

  // Method 4: Check if user has a very high number of permissions (super admin pattern)
  const hasHighPermissionCount = userPermissions.length >= 5; // Arbitrary threshold

  return hasAdminPermissions || hasAllModules || hasHighPermissionCount;
}

/**
 * Enhanced permission check with position-role integration
 * @param userPermissions - Array of user's permissions from API
 * @param requiredPermissions - Array of required permission sets
 * @param userRoles - Array of user's roles (optional, for super admin check)
 * @param user - Full user object (optional, for enhanced permission checking)
 * @returns boolean - true if user has access
 */
export function hasPermission(
  userPermissions: any[],
  requiredPermissions?: PermissionRequirement[],
  userRoles?: any[],
  user?: IUser
): boolean {
  // Super admin bypass - super admins can see everything
  if (isSuperAdmin(userPermissions, userRoles, user)) {
    return true;
  }

  // If no permissions required, item is visible to all authenticated users
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // If we have the full user object, try enhanced permission checking first
  if (user) {
    // Check if this is a simplified UI permission
    const uiPermissions = calculateUIPermissions(user);
    const menuPermissions = calculateMenuPermissions(user);

    // Map some common permission requirements to our UI permissions
    for (const requirement of requiredPermissions) {
      const { module, codenames } = requirement;

      // Check for module access patterns
      switch (module) {
        case 'hr':
          if (codenames.some(code => code.includes('view')) &&
              uiPermissions.includes(UIPermissionCategory.HR_MODULE)) {
            return true;
          }
          if (codenames.some(code => code.includes('approve')) &&
              uiPermissions.includes(UIPermissionCategory.APPROVE_REQUESTS)) {
            return true;
          }
          break;

        case 'finance':
          if (codenames.some(code => code.includes('view')) &&
              uiPermissions.includes(UIPermissionCategory.FINANCE_MODULE)) {
            return true;
          }
          if (codenames.some(code => code.includes('authorize')) &&
              uiPermissions.includes(UIPermissionCategory.AUTHORIZE_REQUESTS)) {
            return true;
          }
          break;

        case 'approvals':
          if (codenames.some(code => code.includes('approve')) &&
              uiPermissions.includes(UIPermissionCategory.APPROVE_REQUESTS)) {
            return true;
          }
          if (codenames.some(code => code.includes('authorize')) &&
              uiPermissions.includes(UIPermissionCategory.AUTHORIZE_REQUESTS)) {
            return true;
          }
          if (codenames.some(code => code.includes('review')) &&
              uiPermissions.includes(UIPermissionCategory.REVIEW_REQUESTS)) {
            return true;
          }
          break;

        case 'procurements':
          if (uiPermissions.includes(UIPermissionCategory.PROCUREMENT_MODULE)) {
            return true;
          }
          break;

        case 'programs':
          if (uiPermissions.includes(UIPermissionCategory.PROGRAMS_MODULE)) {
            return true;
          }
          break;

        case 'projects':
          if (uiPermissions.includes(UIPermissionCategory.PROJECTS_MODULE)) {
            return true;
          }
          break;

        case 'config':
          if (uiPermissions.includes(UIPermissionCategory.CONFIG_MODULE)) {
            return true;
          }
          break;

        case 'admin':
          // Admin module typically requires administrative privileges
          if (isUserAdmin(user)) {
            return true;
          }
          break;
      }
    }
  }

  // Fallback to legacy permission checking
  return requiredPermissions.some(requirement => {
    // Find the module in user's permissions
    const userModulePerms = userPermissions.find(
      p => p.module === requirement.module
    );

    if (!userModulePerms) return false;

    // Extract codenames from user's permissions for this module
    const userCodenames = userModulePerms.permissions.map(
      (p: any) => p.codename
    );

    if (requirement.requireAll) {
      // AND logic - user must have ALL required codenames
      return requirement.codenames.every(codename =>
        userCodenames.includes(codename)
      );
    } else {
      // OR logic - user must have at least ONE required codename (default)
      return requirement.codenames.some(codename =>
        userCodenames.includes(codename)
      );
    }
  });
}

/**
 * Enhanced sidebar filtering with position-role integration
 * @param items - Array of sidebar items
 * @param userPermissions - User's permissions from API
 * @param userRoles - User's roles (optional, for super admin check)
 * @param user - Full user object (optional, for enhanced permission checking)
 * @returns Filtered array of sidebar items
 */
export function filterSidebarByPermissions(
  items: SidebarItem[],
  userPermissions: any[],
  userRoles?: any[],
  user?: IUser
): SidebarItem[] {
  return items
    .filter(item => hasPermission(userPermissions, item.permissions, userRoles, user))
    .map(item => {
      // If item has children, recursively filter them
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterSidebarByPermissions(
          item.children,
          userPermissions,
          userRoles,
          user
        );

        // Only include parent if it has visible children or has its own path
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
 * Enhanced global hub filtering with position-role integration
 * @param items - Array of global hub items
 * @param userPermissions - User's permissions from API
 * @param userRoles - User's roles (optional, for super admin check)
 * @param user - Full user object (optional, for enhanced permission checking)
 * @returns Filtered array of global hub items
 */
export function filterGlobalHubByPermissions(
  items: GlobalHubItem[],
  userPermissions: any[],
  userRoles?: any[],
  user?: IUser
): GlobalHubItem[] {
  return items.filter(item =>
    hasPermission(userPermissions, item.permissions, userRoles, user)
  );
}

/**
 * Group filtered global hub items by category
 * @param items - Array of filtered global hub items
 * @param categories - Category definitions
 * @returns Array of grouped categories with their items
 */
export function groupGlobalHubByCategory(
  items: GlobalHubItem[],
  categories: Record<string, { label: string; icon: React.ReactNode }>
) {
  return Object.entries(categories)
    .map(([categoryKey, categoryInfo]) => ({
      category: categoryKey,
      ...categoryInfo,
      items: items.filter(item => item.category === categoryKey)
    }))
    .filter(group => group.items.length > 0); // Only include categories with visible items
}

/**
 * Check if user has access to Global Hub feature
 * This checks for a special "can_view_global_hub" permission
 * @param userPermissions - User's permissions from API
 * @returns boolean
 */
export function hasGlobalHubAccess(userPermissions: any[]): boolean {
  const usersModule = userPermissions.find(p => p.module === "users");
  
  if (!usersModule) return false;
  
  return usersModule.permissions.some(
    (p: any) => p.codename === "can_view_global_hub"
  );
}

/**
 * Get all visible global hub categories for a user
 * @param userPermissions - User's permissions from API
 * @param globalHubItems - All global hub items
 * @returns Array of visible category keys
 */
export function getVisibleGlobalHubCategories(
  userPermissions: any[],
  globalHubItems: GlobalHubItem[]
): string[] {
  const filteredItems = filterGlobalHubByPermissions(globalHubItems, userPermissions);
  const visibleCategories = new Set(filteredItems.map(item => item.category));
  return Array.from(visibleCategories);
}

/**
 * Enhanced path access checking with position-role integration
 * @param path - The route path to check
 * @param allSidebarItems - All sidebar items (departmental + module links)
 * @param userPermissions - User's permissions
 * @param userRoles - User's roles (optional)
 * @param user - Full user object (optional, for enhanced permission checking)
 * @returns boolean
 */
export function canAccessPath(
  path: string,
  allSidebarItems: SidebarItem[],
  userPermissions: any[],
  userRoles?: any[],
  user?: IUser
): boolean {
  // Recursively search for the path in sidebar items
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

  if (!item) return false; // Path not found in sidebar

  return hasPermission(userPermissions, item.permissions, userRoles, user);
}

/**
 * Enhanced accessible paths retrieval with position-role integration
 * @param allSidebarItems - All sidebar items
 * @param userPermissions - User's permissions
 * @param userRoles - User's roles (optional)
 * @param user - Full user object (optional, for enhanced permission checking)
 * @returns Array of accessible paths
 */
export function getAccessiblePaths(
  allSidebarItems: SidebarItem[],
  userPermissions: any[],
  userRoles?: any[],
  user?: IUser
): string[] {
  const paths: string[] = [];

  const extractPaths = (items: SidebarItem[]) => {
    items.forEach(item => {
      if (hasPermission(userPermissions, item.permissions, userRoles, user)) {
        if (item.path) {
          paths.push(item.path);
        }
        if (item.children) {
          extractPaths(item.children);
        }
      }
    });
  };

  extractPaths(allSidebarItems);
  return paths;
}
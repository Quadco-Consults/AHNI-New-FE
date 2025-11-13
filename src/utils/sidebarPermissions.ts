import { SidebarItem, GlobalHubItem, PermissionRequirement } from './sidebarItems';

/**
 * Check if user has the required permissions
 * @param userPermissions - Array of user's permissions from API
 * @param requiredPermissions - Array of required permission sets
 * @returns boolean - true if user has access
 */
export function hasPermission(
  userPermissions: any[],
  requiredPermissions?: PermissionRequirement[]
): boolean {
  // If no permissions required, item is visible to all authenticated users
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // Check if user has at least one of the required permission sets (OR logic between sets)
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
 * Recursively filter sidebar items based on user permissions
 * @param items - Array of sidebar items
 * @param userPermissions - User's permissions from API
 * @returns Filtered array of sidebar items
 */
export function filterSidebarByPermissions(
  items: SidebarItem[],
  userPermissions: any[]
): SidebarItem[] {
  return items
    .filter(item => hasPermission(userPermissions, item.permissions))
    .map(item => {
      // If item has children, recursively filter them
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterSidebarByPermissions(
          item.children,
          userPermissions
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
 * Filter global hub items by user permissions
 * @param items - Array of global hub items
 * @param userPermissions - User's permissions from API
 * @returns Filtered array of global hub items
 */
export function filterGlobalHubByPermissions(
  items: GlobalHubItem[],
  userPermissions: any[]
): GlobalHubItem[] {
  return items.filter(item => 
    hasPermission(userPermissions, item.permissions)
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
 * Check if a specific path is accessible by the user
 * Useful for route guards and redirects
 * @param path - The route path to check
 * @param allSidebarItems - All sidebar items (departmental + module links)
 * @param userPermissions - User's permissions
 * @returns boolean
 */
export function canAccessPath(
  path: string,
  allSidebarItems: SidebarItem[],
  userPermissions: any[]
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
  
  return hasPermission(userPermissions, item.permissions);
}

/**
 * Get user's accessible routes for navigation
 * Returns flat array of all paths user can access
 * @param allSidebarItems - All sidebar items
 * @param userPermissions - User's permissions
 * @returns Array of accessible paths
 */
export function getAccessiblePaths(
  allSidebarItems: SidebarItem[],
  userPermissions: any[]
): string[] {
  const paths: string[] = [];
  
  const extractPaths = (items: SidebarItem[]) => {
    items.forEach(item => {
      if (hasPermission(userPermissions, item.permissions)) {
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
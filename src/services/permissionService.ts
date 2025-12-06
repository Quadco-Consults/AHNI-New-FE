/**
 * Unified Permission Service
 * Handles all permission checking logic in one place
 * Fixes navbar permission issues by providing single source of truth
 */

export interface NormalizedPermissions {
  permissions: Permission[];
  roles: Role[];
  isAdmin: boolean;
  isHydrated: boolean;
  userId: string;
}

export interface Permission {
  module: string;
  permissions: PermissionDetail[];
}

export interface PermissionDetail {
  id: number;
  name: string;
  codename: string;
}

export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
}

export interface PermissionRequirement {
  module: string;
  codenames: string[];
  requireAll?: boolean;
}

export class PermissionService {
  private static instance: PermissionService;

  static getInstance(): PermissionService {
    if (!this.instance) {
      this.instance = new PermissionService();
    }
    return this.instance;
  }

  /**
   * Normalize permissions from any source into standardized format
   */
  normalizePermissions(loginData: any): NormalizedPermissions {
    // Try multiple sources for permissions (this fixes the data source confusion)
    const permissions = this.extractPermissions(loginData);
    const roles = this.extractRoles(loginData);
    const user = loginData.user || loginData;

    const normalized: NormalizedPermissions = {
      permissions: this.flattenPermissions(permissions),
      roles: roles,
      isAdmin: this.checkAdminStatus(user, permissions, roles),
      isHydrated: true,
      userId: user?.id || ''
    };

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 PermissionService - Normalized permissions:', {
        userId: normalized.userId,
        permissionCount: normalized.permissions.length,
        roleCount: normalized.roles.length,
        isAdmin: normalized.isAdmin,
        sources: this.getDataSources(loginData)
      });
    }

    return normalized;
  }

  /**
   * Main permission checking method
   */
  hasPermission(
    normalizedPermissions: NormalizedPermissions,
    requirements: PermissionRequirement[]
  ): boolean {
    // Admin bypass - admins can access everything
    if (normalizedPermissions.isAdmin) {
      return true;
    }

    // If no requirements specified, allow access
    if (!requirements || requirements.length === 0) {
      return true;
    }

    // Check if user meets any of the requirements (OR logic between requirements)
    return requirements.some(requirement => {
      return this.checkSingleRequirement(normalizedPermissions, requirement);
    });
  }

  /**
   * Check if user has specific permission by codename
   */
  hasPermissionByCodename(
    normalizedPermissions: NormalizedPermissions,
    module: string,
    codename: string
  ): boolean {
    if (normalizedPermissions.isAdmin) {
      return true;
    }

    return normalizedPermissions.permissions.some(perm => {
      return perm.module === module &&
             perm.permissions.some(p => p.codename === codename);
    });
  }

  /**
   * Get all user's permission codenames for debugging
   */
  getUserPermissionCodenames(normalizedPermissions: NormalizedPermissions): string[] {
    return normalizedPermissions.permissions.flatMap(perm =>
      perm.permissions.map(p => `${perm.module}.${p.codename}`)
    );
  }

  private extractPermissions(loginData: any): any[] {
    // Try multiple sources in priority order
    const sources = [
      loginData.permissions,           // Redux root level
      loginData.user?.permissions,     // Redux nested
      loginData.data?.permissions,     // API response
      loginData.user_permissions,      // Django legacy
      []
    ];

    for (const source of sources) {
      if (Array.isArray(source) && source.length > 0) {
        return source;
      }
    }

    return [];
  }

  private extractRoles(loginData: any): Role[] {
    const sources = [
      loginData.roles,           // Redux root level
      loginData.user?.roles,     // Redux nested
      loginData.data?.roles,     // API response
      loginData.groups,          // Django legacy
      []
    ];

    for (const source of sources) {
      if (Array.isArray(source) && source.length > 0) {
        return source;
      }
    }

    return [];
  }

  private flattenPermissions(permissions: any[]): Permission[] {
    if (!Array.isArray(permissions)) {
      return [];
    }

    // Handle different permission formats
    return permissions.map(perm => {
      // If already in correct format
      if (perm.module && perm.permissions) {
        return perm;
      }

      // If it's a single permission object
      if (perm.codename && perm.content_type) {
        return {
          module: perm.content_type.app_label || 'unknown',
          permissions: [{
            id: perm.id,
            name: perm.name,
            codename: perm.codename
          }]
        };
      }

      // Default format
      return {
        module: perm.module || 'unknown',
        permissions: Array.isArray(perm.permissions) ? perm.permissions : []
      };
    }).filter(perm => perm.permissions.length > 0);
  }

  private checkAdminStatus(user: any, permissions: any[], roles: any[]): boolean {
    // Multiple ways to detect admin status
    const adminChecks = [
      // Django superuser flag
      user?.is_superuser === true,

      // Staff with admin permissions
      user?.is_staff === true && permissions.length > 10,

      // Role-based admin detection
      roles.some(role =>
        role.name?.toLowerCase().includes('admin') ||
        role.name?.toLowerCase().includes('director') ||
        role.name?.toLowerCase().includes('super')
      ),

      // High permission count (indicates admin)
      permissions.length > 50,

      // Admin module permissions
      permissions.some(perm =>
        perm.module === 'admin' ||
        perm.module === 'auth' ||
        (perm.permissions && perm.permissions.some((p: any) =>
          p.codename?.includes('admin') || p.codename?.includes('superuser')
        ))
      )
    ];

    return adminChecks.some(check => check);
  }

  private checkSingleRequirement(
    normalizedPermissions: NormalizedPermissions,
    requirement: PermissionRequirement
  ): boolean {
    // Special case: Check for superuser status
    if (requirement.module === 'superuser' && requirement.codenames.includes('is_superuser')) {
      return normalizedPermissions.isAdmin;
    }

    const modulePermissions = normalizedPermissions.permissions.find(
      perm => perm.module === requirement.module
    );

    if (!modulePermissions) {
      return false;
    }

    const userCodenames = modulePermissions.permissions.map(p => p.codename);

    if (requirement.requireAll) {
      // AND logic - user must have ALL required permissions
      return requirement.codenames.every(codename =>
        userCodenames.includes(codename)
      );
    } else {
      // OR logic - user needs ANY of the required permissions (default)
      return requirement.codenames.some(codename =>
        userCodenames.includes(codename)
      );
    }
  }

  private getDataSources(loginData: any): string[] {
    const sources = [];
    if (loginData.permissions) sources.push('root.permissions');
    if (loginData.user?.permissions) sources.push('user.permissions');
    if (loginData.roles) sources.push('root.roles');
    if (loginData.user?.roles) sources.push('user.roles');
    return sources;
  }
}

// Export singleton instance
export const permissionService = PermissionService.getInstance();
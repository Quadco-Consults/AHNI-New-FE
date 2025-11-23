/**
 * Enhanced Authentication Fix Utilities
 * Addresses permission and menu display issues
 */

import { IUser, IPermission } from '@/features/auth/types/auth';
import { IUser as UserProfileUser } from '@/features/auth/types/user';

// Debug utilities
export const debugPermissions = (user: any, permissions: any[], userRoles: any[]) => {
  console.log('🔍 PERMISSION DEBUG:', {
    timestamp: new Date().toISOString(),
    user: {
      id: user?.id,
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
      department: user?.department?.name,
      position: user?.position?.title,
      location: user?.location?.name,
      is_staff: user?.is_staff,
      is_superuser: user?.is_superuser
    },
    permissions: {
      count: permissions?.length || 0,
      modules: permissions?.map(p => ({
        module: p.module,
        permissionCount: p.permissions?.length || 0,
        codenames: p.permissions?.map((perm: any) => perm.codename) || []
      })) || []
    },
    roles: {
      count: userRoles?.length || 0,
      roleNames: userRoles?.map(r => typeof r === 'string' ? r : r?.name) || []
    }
  });
};

// Enhanced permission normalization
export const normalizeUserPermissions = (user: UserProfileUser | IUser | any, externalPermissions?: IPermission[], externalRoles?: any[]): {
  permissions: IPermission[];
  roles: any[];
  enhancedUser: IUser;
} => {
  // Handle different permission structures
  let permissions: IPermission[] = [];
  let roles: any[] = [];

  // Method 0: External permissions passed separately (from Redux root state)
  if (externalPermissions && Array.isArray(externalPermissions) && externalPermissions.length > 0) {
    permissions = externalPermissions;
    console.log('🔍 PERMISSIONS from external source (Redux root):', permissions.length, 'modules', permissions.map(p => p.module));
  }
  // Method 1: Direct permissions array (from auth/login)
  else if (user?.permissions && Array.isArray(user.permissions)) {
    permissions = user.permissions;
    console.log('🔍 PERMISSIONS from user.permissions:', permissions.length, 'modules', permissions.map(p => p.module));
  }

  // Method 2: User object permissions (from users/profile)
  if (!permissions.length && user?.data?.permissions && Array.isArray(user.data.permissions)) {
    permissions = user.data.permissions;
  }

  // Method 3: Legacy format conversion
  if (!permissions.length && user?.user_permissions) {
    // Convert Django user_permissions to our format
    const modules = new Map<string, any[]>();

    user.user_permissions.forEach((perm: any) => {
      const module = perm.content_type?.app_label || 'unknown';
      if (!modules.has(module)) {
        modules.set(module, []);
      }
      modules.get(module)!.push({
        id: perm.id,
        name: perm.name,
        codename: perm.codename
      });
    });

    permissions = Array.from(modules.entries()).map(([module, perms]) => ({
      module,
      permissions: perms
    }));
  }

  // Handle roles
  if (externalRoles && Array.isArray(externalRoles) && externalRoles.length > 0) {
    roles = externalRoles;
    console.log('🔍 ROLES from external source (Redux root):', roles.length, 'roles');
  } else if (user?.roles && Array.isArray(user.roles)) {
    roles = user.roles;
    console.log('🔍 ROLES from user.roles:', roles.length, 'roles');
  } else if (user?.data?.roles && Array.isArray(user.data.roles)) {
    roles = user.data.roles;
    console.log('🔍 ROLES from user.data.roles:', roles.length, 'roles');
  } else if (user?.groups && Array.isArray(user.groups)) {
    roles = user.groups.map((group: any) => ({
      id: group.id,
      name: group.name
    }));
    console.log('🔍 ROLES from user.groups:', roles.length, 'roles');
  }

  // Create enhanced user object
  const enhancedUser: IUser = {
    id: user?.id || user?.data?.id || '',
    email: user?.email || user?.data?.email || '',
    first_name: user?.first_name || user?.data?.first_name || '',
    last_name: user?.last_name || user?.data?.last_name || '',
    last_login: user?.last_login || user?.data?.last_login || '',
    department: user?.department || user?.data?.department,
    position: user?.position || user?.data?.position,
    location: user?.location || user?.data?.location,
    role: user?.role || user?.data?.role,
    supervisor: user?.supervisor || user?.data?.supervisor,
    data_access_level: user?.data_access_level || user?.data?.data_access_level || 'own',
    employment_type: user?.employment_type || user?.data?.employment_type,
    join_date: user?.join_date || user?.data?.join_date,
    profile_picture: user?.profile_picture || user?.data?.profile_picture,
    phone: user?.phone || user?.data?.phone || user?.mobile_number || user?.data?.mobile_number,
    bio: user?.bio || user?.data?.bio,
    is_active: user?.is_active || user?.data?.is_active,
    is_staff: user?.is_staff || user?.data?.is_staff,
    is_superuser: user?.is_superuser || user?.data?.is_superuser,
    user_type: user?.user_type || user?.data?.user_type,
    employee_id: user?.employee_id || user?.data?.employee_id || undefined,
    roles: roles,
    permissions: permissions
  };

  return { permissions, roles, enhancedUser };
};

// Enhanced super admin detection
export const isEnhancedSuperAdmin = (user: any, permissions: IPermission[], roles: any[]): boolean => {
  console.log('🔍 SUPER ADMIN CHECK:', {
    is_superuser: user?.is_superuser,
    is_staff: user?.is_staff,
    permissionCount: permissions.reduce((sum, p) => sum + (p.permissions?.length || 0), 0),
    modules: permissions.map(p => p.module)
  });

  // Method 1: Django superuser flag
  if (user?.is_superuser === true) {
    console.log('✅ Super admin detected via is_superuser flag');
    return true;
  }

  // Method 2: Staff + multiple admin permissions
  if (user?.is_staff === true) {
    const adminModules = ['users', 'authorization', 'admin', 'config'];
    const hasAdminPermissions = adminModules.some(module =>
      permissions.some(p => p.module === module)
    );

    console.log('🔍 Staff check:', {
      is_staff: user?.is_staff,
      adminModules,
      userModules: permissions.map(p => p.module),
      hasAdminPermissions
    });

    if (hasAdminPermissions) {
      console.log('✅ Super admin detected via staff status + admin permissions');
      return true;
    }
  }

  // Method 3: Role-based detection
  const adminRolePatterns = [
    'super admin', 'superadmin', 'super_admin', 'system_admin',
    'director', 'administrator', 'admin'
  ];

  const hasAdminRole = roles.some((role: any) => {
    const roleName = typeof role === 'string' ? role : role?.name || '';
    return adminRolePatterns.some(pattern =>
      roleName.toLowerCase().includes(pattern.toLowerCase())
    );
  });

  if (hasAdminRole) {
    console.log('✅ Super admin detected via role patterns');
    return true;
  }

  // Method 4: Permission breadth (high threshold)
  const totalPermissions = permissions.reduce((sum, p) => sum + (p.permissions?.length || 0), 0);
  console.log('🔍 Permission count check:', { totalPermissions, threshold: 50 });

  if (totalPermissions >= 50) {
    console.log('✅ Super admin detected via high permission count:', totalPermissions);
    return true;
  }

  console.log('❌ Not a super admin');
  return false;
};

// Enhanced permission checking
export const hasEnhancedPermission = (
  userPermissions: IPermission[],
  requiredPermissions: { module: string; codenames: string[]; requireAll?: boolean }[],
  user?: any,
  userRoles?: any[]
): boolean => {
  // Super admin bypass
  if (user && userRoles && isEnhancedSuperAdmin(user, userPermissions, userRoles)) {
    console.log('✅ Permission granted via super admin bypass');
    return true;
  }

  // If no permissions required, grant access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // Check each required permission set
  return requiredPermissions.some(requirement => {
    const userModulePerms = userPermissions.find(p => p.module === requirement.module);

    if (!userModulePerms || !userModulePerms.permissions) {
      return false;
    }

    const userCodenames = userModulePerms.permissions.map((p: any) => p.codename);

    if (requirement.requireAll) {
      // ALL required codenames must be present
      return requirement.codenames.every(codename => userCodenames.includes(codename));
    } else {
      // At least ONE required codename must be present
      return requirement.codenames.some(codename => userCodenames.includes(codename));
    }
  });
};
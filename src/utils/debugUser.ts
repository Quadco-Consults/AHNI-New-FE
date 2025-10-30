// Utility to debug current user permissions and data
import { getCurrentUser } from './auth';

export interface UserDebugInfo {
  user: any;
  hasUser: boolean;
  userType: string;
  assignedModules: string[];
  roles: any[];
  permissions: any[];
  email: string;
  isActive: boolean;
  permissionCodes: string[]; // Added: flat list of permission codes like "approvals.can_review"
  roleNames: string[]; // Added: list of role names
}

export const debugCurrentUser = (): UserDebugInfo => {
  const user = getCurrentUser();

  // Extract permission codes in the format "module.codename"
  const permissionCodes = user?.permissions
    ? user.permissions.flatMap((module: any) =>
        module.permissions?.map((perm: any) => `${module.module}.${perm.codename}`) || []
      )
    : [];

  // Extract role names
  const roleNames = user?.roles?.map((role: any) => role.name) || [];

  return {
    user,
    hasUser: !!user,
    userType: user?.user_type || 'Unknown',
    assignedModules: user?.assigned_modules || [],
    roles: user?.roles || [],
    permissions: user?.permissions || [],
    email: user?.email || 'Unknown',
    isActive: user?.is_active || false,
    permissionCodes,
    roleNames
  };
};

export const logUserDebugInfo = () => {
  const debugInfo = debugCurrentUser();

  console.log('=== USER DEBUG INFO ===');
  console.log('Has User:', debugInfo.hasUser);
  console.log('Email:', debugInfo.email);
  console.log('User Type:', debugInfo.userType);
  console.log('Is Active:', debugInfo.isActive);
  console.log('Assigned Modules:', debugInfo.assignedModules);
  console.log('Roles:', debugInfo.roles);
  console.log('Permissions:', debugInfo.permissions);
  console.log('Full User Object:', debugInfo.user);
  console.log('========================');

  return debugInfo;
};

// Helper to check if user has specific module access
export const hasModuleAccess = (module: string): boolean => {
  const user = getCurrentUser();
  return user?.assigned_modules?.includes(module) || false;
};

// Helper to check if user has specific permission using "module.codename" format
export const hasPermission = (module: string, codename: string): boolean => {
  const user = getCurrentUser();
  if (!user?.permissions) return false;

  // Extract permission codes and check if the specific permission exists
  const permissionCodes = user.permissions.flatMap((m: any) =>
    m.permissions?.map((perm: any) => `${m.module}.${perm.codename}`) || []
  );

  return permissionCodes.includes(`${module}.${codename}`);
};

// Helper to check permission using full permission code (e.g., "approvals.can_review")
export const hasPermissionCode = (permissionCode: string): boolean => {
  const user = getCurrentUser();
  if (!user?.permissions) return false;

  const permissionCodes = user.permissions.flatMap((module: any) =>
    module.permissions?.map((perm: any) => `${module.module}.${perm.codename}`) || []
  );

  return permissionCodes.includes(permissionCode);
};

// Global Hub specific permission checkers
export const hasGlobalHubAccess = (): boolean => {
  return hasPermissionCode("auth.can_view_global_hub");
};

export const canViewAllPurchaseRequests = (): boolean => {
  return hasPermissionCode("auth.can_view_all_purchase_requests");
};

export const canViewAllLeaveRequests = (): boolean => {
  return hasPermissionCode("auth.can_view_all_leave_requests");
};

export const canViewAllVehicleRequests = (): boolean => {
  return hasPermissionCode("auth.can_view_all_vehicle_requests");
};

export const canViewAllMaintenanceTickets = (): boolean => {
  return hasPermissionCode("auth.can_view_all_maintenance_tickets");
};

export const canViewAllTimesheets = (): boolean => {
  return hasPermissionCode("auth.can_view_all_timesheets");
};

export const canViewAllSupportTickets = (): boolean => {
  return hasPermissionCode("auth.can_view_all_support_tickets");
};

// Helper to check if user has any global hub permissions
export const hasAnyGlobalHubPermission = (): boolean => {
  // Admin users always have global hub access
  if (isAdminUser()) return true;

  // Check specific global hub permissions
  return hasGlobalHubAccess() ||
         canViewAllPurchaseRequests() ||
         canViewAllLeaveRequests() ||
         canViewAllVehicleRequests() ||
         canViewAllMaintenanceTickets() ||
         canViewAllTimesheets() ||
         canViewAllSupportTickets();
};

// Enhanced helper to check department-based access
export const hasDepartmentAccess = (department: string): boolean => {
  const user = getCurrentUser();

  // Check if user has assigned modules for this department
  if (!user?.assigned_modules || user.assigned_modules.length === 0) return false;

  // Map departments to their modules
  const departmentModules: { [key: string]: string[] } = {
    'admin': ['admin', 'adminapp'],
    'hr': ['hr'],
    'finance': ['finance'],
    'procurement': ['procurement'],
    'programs': ['programs'],
    'c_and_g': ['c_and_g'],
    'inventory': ['inventory'],
    'fleet': ['fleet'],
    'maintenance': ['maintenance']
  };

  const requiredModules = departmentModules[department] || [department];
  return requiredModules.some(module => user.assigned_modules.includes(module));
};

// Helper to check if user has role-based access within a department
export const hasRoleInDepartment = (department: string, roleType?: string): boolean => {
  const user = getCurrentUser();
  if (!user?.roles || user.roles.length === 0) return false;

  // Check if user has any role in the department
  return user.roles.some((role: any) => {
    const roleName = role.name?.toLowerCase() || '';
    const departmentMatch = roleName.includes(department.toLowerCase());

    if (roleType) {
      return departmentMatch && roleName.includes(roleType.toLowerCase());
    }
    return departmentMatch;
  });
};

// Helper to check if user is an admin (should see everything)
export const isAdminUser = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Check if user is staff or superuser (Django built-in admin flags)
  if (user.is_staff || user.is_superuser) return true;

  // Check if user has admin roles
  const roleNames = user?.roles?.map((role: any) => role.name?.toLowerCase()) || [];
  const adminRoleKeywords = ['admin', 'super', 'administrator', 'superuser'];

  return roleNames.some((roleName: string) =>
    adminRoleKeywords.some(keyword => roleName.includes(keyword))
  );
};

// Enhanced helper to check menu visibility based on department and permissions
export const canViewMenu = (menuConfig: {
  department: string;
  module: string;
  requiredPermissions?: string[];
  requiredRole?: string;
}): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // ADMIN BYPASS: Admin users can see everything
  if (isAdminUser()) {
    return true;
  }

  // For regular users, check specific permissions
  if (user.assigned_modules && user.assigned_modules.length > 0) {
    if (!hasModuleAccess(menuConfig.module)) return false;
  }

  // Check role if specified
  if (menuConfig.requiredRole && !hasRoleInDepartment(menuConfig.department, menuConfig.requiredRole)) {
    return false;
  }

  // Check specific permissions if required
  if (menuConfig.requiredPermissions && menuConfig.requiredPermissions.length > 0) {
    return menuConfig.requiredPermissions.some(permission => {
      // Handle both formats: "codename" and "module.codename"
      if (permission.includes('.')) {
        return hasPermissionCode(permission);
      } else {
        return hasPermission(menuConfig.module, permission);
      }
    });
  }

  // If no specific permissions required, check if user has any permissions for the module
  if (user?.permissions && user.permissions.length > 0) {
    const hasModulePermissions = user.permissions.some((perm: any) =>
      perm.module === menuConfig.module && perm.permissions && perm.permissions.length > 0
    );
    if (hasModulePermissions) return true;
  }

  // Fallback: if user has assigned_modules and no permission restrictions, allow access
  if (user.assigned_modules && user.assigned_modules.includes(menuConfig.module)) {
    return true;
  }

  return false;
};

// Export for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugUser = {
    logUserDebugInfo,
    debugCurrentUser,
    hasModuleAccess,
    hasPermission,
    hasPermissionCode,
    hasDepartmentAccess,
    hasRoleInDepartment,
    canViewMenu,
    isAdminUser,
    // Global Hub functions
    hasGlobalHubAccess,
    canViewAllPurchaseRequests,
    canViewAllLeaveRequests,
    canViewAllVehicleRequests,
    canViewAllMaintenanceTickets,
    canViewAllTimesheets,
    canViewAllSupportTickets,
    hasAnyGlobalHubPermission
  };
}
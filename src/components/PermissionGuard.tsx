'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  /** Single permission required to access the content */
  permission?: string;

  /** Array of permissions - user needs ANY of these (OR logic) */
  anyPermissions?: string[];

  /** Array of permissions - user needs ALL of these (AND logic) */
  allPermissions?: string[];

  /** Module required to access the content */
  module?: string;

  /** Array of modules - user needs access to ANY of these */
  anyModules?: string[];

  /** Custom access check function for complex logic */
  customCheck?: () => boolean;

  /** What to render when access is denied */
  fallback?: React.ReactNode;

  /** Where to redirect when access is denied */
  redirect?: string;

  /** Show loading state while checking permissions */
  loading?: React.ReactNode;

  /** Invert the logic - show content when user DOESN'T have permission */
  invert?: boolean;

  /** Children to render when access is granted */
  children: React.ReactNode;
}

/**
 * PermissionGuard - Protects components and routes based on user permissions
 *
 * Features:
 * - Single or multiple permission checking
 * - Module access checking
 * - Custom permission logic
 * - Automatic redirects
 * - Loading states
 * - Inverted logic for "hide if has permission" scenarios
 *
 * @example
 * // Basic permission check
 * <PermissionGuard permission="view_settings">
 *   <SettingsMenu />
 * </PermissionGuard>
 *
 * @example
 * // Module access check with redirect
 * <PermissionGuard module="hr" redirect="/dashboard">
 *   <HRDashboard />
 * </PermissionGuard>
 *
 * @example
 * // Multiple permissions (OR logic)
 * <PermissionGuard anyPermissions={["edit_user", "manage_user"]}>
 *   <UserEditForm />
 * </PermissionGuard>
 *
 * @example
 * // Complex custom logic
 * <PermissionGuard
 *   customCheck={() => user?.department === 'IT' && hasPermission('admin')}
 *   fallback={<div>IT Admin access required</div>}
 * >
 *   <SystemSettings />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  anyPermissions,
  allPermissions,
  module,
  anyModules,
  customCheck,
  fallback = null,
  redirect,
  loading = null,
  invert = false,
  children
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    hasPermission,
    hasModule,
    hasAnyPermission,
    hasAllPermissions,
    isAuthenticated,
    user
  } = usePermissions();

  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Calculate access permission
  const hasAccess = useMemo(() => {
    // If not authenticated, deny access
    if (!isAuthenticated) return false;

    let accessGranted = true;

    // Check single permission
    if (permission) {
      accessGranted = accessGranted && hasPermission(permission);
    }

    // Check any permissions (OR logic)
    if (anyPermissions && anyPermissions.length > 0) {
      accessGranted = accessGranted && hasAnyPermission(anyPermissions);
    }

    // Check all permissions (AND logic)
    if (allPermissions && allPermissions.length > 0) {
      accessGranted = accessGranted && hasAllPermissions(allPermissions);
    }

    // Check single module
    if (module) {
      accessGranted = accessGranted && hasModule(module);
    }

    // Check any modules (OR logic)
    if (anyModules && anyModules.length > 0) {
      accessGranted = accessGranted && anyModules.some(mod => hasModule(mod));
    }

    // Check custom logic
    if (customCheck) {
      accessGranted = accessGranted && customCheck();
    }

    // Invert logic if requested
    return invert ? !accessGranted : accessGranted;
  }, [
    isAuthenticated,
    permission,
    anyPermissions,
    allPermissions,
    module,
    anyModules,
    customCheck,
    invert,
    hasPermission,
    hasModule,
    hasAnyPermission,
    hasAllPermissions
  ]);

  // Handle redirects
  useEffect(() => {
    if (isHydrated && !hasAccess && redirect && isAuthenticated) {
      router.push(redirect);
    }
  }, [isHydrated, hasAccess, redirect, router, isAuthenticated]);

  // Show loading state during hydration or while user data is being fetched
  if (!isHydrated || (!user && isAuthenticated)) {
    return <>{loading || <div>Loading permissions...</div>}</>;
  }

  // If not authenticated at all, deny access
  if (!isAuthenticated) {
    if (redirect) {
      router.push(redirect);
      return null;
    }
    return <>{fallback}</>;
  }

  // If access denied and redirect is specified, show nothing (redirect will happen)
  if (!hasAccess && redirect) {
    return null;
  }

  // If access denied, show fallback
  if (!hasAccess) {
    return <>{fallback}</>;
  }

  // Access granted, render children
  return <>{children}</>;
};

/**
 * Higher-order component version of PermissionGuard
 * Useful for wrapping entire page components
 */
export const withPermissionGuard = (
  Component: React.ComponentType<any>,
  guardProps: Omit<PermissionGuardProps, 'children'>
) => {
  const WrappedComponent = (props: any) => (
    <PermissionGuard {...guardProps}>
      <Component {...props} />
    </PermissionGuard>
  );

  WrappedComponent.displayName = `withPermissionGuard(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Hook for imperative permission checking
 * Use when you need to check permissions in event handlers or effects
 */
export const usePermissionGuard = () => {
  const permissions = usePermissions();

  const checkAccess = (guardProps: Omit<PermissionGuardProps, 'children' | 'fallback' | 'redirect' | 'loading'>) => {
    const {
      permission,
      anyPermissions,
      allPermissions,
      module,
      anyModules,
      customCheck,
      invert = false
    } = guardProps;

    if (!permissions.isAuthenticated) return false;

    let accessGranted = true;

    if (permission) {
      accessGranted = accessGranted && permissions.hasPermission(permission);
    }

    if (anyPermissions && anyPermissions.length > 0) {
      accessGranted = accessGranted && permissions.hasAnyPermission(anyPermissions);
    }

    if (allPermissions && allPermissions.length > 0) {
      accessGranted = accessGranted && permissions.hasAllPermissions(allPermissions);
    }

    if (module) {
      accessGranted = accessGranted && permissions.hasModule(module);
    }

    if (anyModules && anyModules.length > 0) {
      accessGranted = accessGranted && anyModules.some(mod => permissions.hasModule(mod));
    }

    if (customCheck) {
      accessGranted = accessGranted && customCheck();
    }

    return invert ? !accessGranted : accessGranted;
  };

  return { checkAccess, ...permissions };
};

export default PermissionGuard;
'use client';

import React from 'react';
import { useGetUserProfile } from '@/features/auth/controllers/userController';
import { UIPermissionCategory, hasUIPermission, hasAnyUIPermission, isUserAdmin } from '@/utils/positionRolePermissions';
import { IUser } from '@/features/auth/types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: UIPermissionCategory;
  permissions?: UIPermissionCategory[];
  requireAll?: boolean;
  roles?: string[];
  adminOnly?: boolean;
  fallback?: React.ReactNode;
  user?: IUser; // Optional user prop for testing or when user is already available
}

/**
 * PermissionGate component for hiding/showing UI elements based on user permissions
 *
 * Usage examples:
 *
 * // Hide approve button for Admin Officer
 * <PermissionGate permission={UIPermissionCategory.APPROVE_REQUESTS}>
 *   <button>Approve Request</button>
 * </PermissionGate>
 *
 * // Show HR menu only if user has HR access
 * <PermissionGate permission={UIPermissionCategory.HR_MODULE}>
 *   <HRMenuItem />
 * </PermissionGate>
 *
 * // Show if user has ANY of the approval permissions
 * <PermissionGate permissions={[UIPermissionCategory.APPROVE_REQUESTS, UIPermissionCategory.AUTHORIZE_REQUESTS]}>
 *   <ApprovalPanel />
 * </PermissionGate>
 *
 * // Show only for admins
 * <PermissionGate adminOnly>
 *   <AdminOnlyFeature />
 * </PermissionGate>
 *
 * // Show fallback content when permission denied
 * <PermissionGate
 *   permission={UIPermissionCategory.APPROVE_REQUESTS}
 *   fallback={<div>You don't have permission to approve requests</div>}
 * >
 *   <ApproveButton />
 * </PermissionGate>
 */
export default function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  roles,
  adminOnly = false,
  fallback = null,
  user: propUser
}: PermissionGateProps) {
  const { data: profileData } = useGetUserProfile();

  // Use provided user or fetch from profile
  const user = propUser || profileData?.data?.user;

  // If no user data available, don't show content
  if (!user) {
    return <>{fallback}</>;
  }

  // Check admin-only access
  if (adminOnly) {
    const userIsAdmin = isUserAdmin(user);
    if (!userIsAdmin) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Check role-based access
  if (roles && roles.length > 0) {
    const userRoles = user.roles?.map(r => r.name) || [];
    const hasRole = roles.some(requiredRole =>
      userRoles.some(userRole =>
        userRole.toLowerCase().includes(requiredRole.toLowerCase())
      )
    );
    if (!hasRole) {
      return <>{fallback}</>;
    }
  }

  // Check single permission
  if (permission) {
    const hasAccess = hasUIPermission(user, permission);
    if (!hasAccess) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll
      ? permissions.every(perm => hasUIPermission(user, perm))
      : hasAnyUIPermission(user, permissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // If no specific permission requirements, show content
  return <>{children}</>;
}
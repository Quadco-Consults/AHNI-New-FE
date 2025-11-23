'use client';

import { useGetUserProfile } from '@/features/auth/controllers/userController';
import {
  UIPermissionCategory,
  calculateUIPermissions,
  calculateMenuPermissions,
  analyzeUserPosition,
  isUserAdmin,
  hasUIPermission,
  hasAnyUIPermission,
  hasAllUIPermissions,
  getUserRoleNames
} from '@/utils/positionRolePermissions';
import { IUser } from '@/features/auth/types/auth';
import { useMemo } from 'react';

/**
 * Custom hook for accessing user permissions throughout the app
 *
 * Usage:
 *
 * const {
 *   user,
 *   isAdmin,
 *   menuPermissions,
 *   positionInfo,
 *   hasPermission,
 *   canApprove,
 *   canAuthorize
 * } = usePermissions();
 *
 * if (canApprove) {
 *   // Show approve button
 * }
 */
export function usePermissions() {
  const { data: profileData, isLoading } = useGetUserProfile();
  const user = profileData?.data;

  const permissions = useMemo(() => {
    if (!user) {
      return {
        user: null,
        isLoading,
        isAdmin: false,
        uiPermissions: [],
        menuPermissions: {
          showHRMenu: false,
          showFinanceMenu: false,
          showApprovalsMenu: false,
          showProcurementMenu: false,
          showProjectsMenu: false,
          showConfigMenu: false,
          showApproveButton: false,
          showAuthorizeButton: false,
          showReviewButton: false,
        },
        positionInfo: {
          name: 'Unknown',
          isLocationSpecific: false,
          isDepartmentSpecific: false,
          canApprove: false,
          canAuthorize: false,
          canReview: false,
        },
        roleNames: [],
        hasPermission: () => false,
        hasAnyPermission: () => false,
        hasAllPermissions: () => false,
        canApprove: false,
        canAuthorize: false,
        canReview: false,
        canManageEmployees: false,
        canManageExpenses: false,
        canAccessHR: false,
        canAccessFinance: false,
        canAccessApprovals: false,
      };
    }

    const uiPermissions = calculateUIPermissions(user);
    const menuPermissions = calculateMenuPermissions(user);
    const positionInfo = analyzeUserPosition(user);
    const roleNames = getUserRoleNames(user);
    const userIsAdmin = isUserAdmin(user);

    return {
      user,
      isLoading,
      isAdmin: userIsAdmin,
      uiPermissions,
      menuPermissions,
      positionInfo,
      roleNames,
      hasPermission: (permission: UIPermissionCategory) => hasUIPermission(user, permission),
      hasAnyPermission: (permissions: UIPermissionCategory[]) => hasAnyUIPermission(user, permissions),
      hasAllPermissions: (permissions: UIPermissionCategory[]) => hasAllUIPermissions(user, permissions),

      // Convenience getters for common permissions
      canApprove: uiPermissions.includes(UIPermissionCategory.APPROVE_REQUESTS),
      canAuthorize: uiPermissions.includes(UIPermissionCategory.AUTHORIZE_REQUESTS),
      canReview: uiPermissions.includes(UIPermissionCategory.REVIEW_REQUESTS),
      canManageEmployees: uiPermissions.includes(UIPermissionCategory.MANAGE_EMPLOYEES),
      canManageExpenses: uiPermissions.includes(UIPermissionCategory.MANAGE_EXPENSES),
      canAccessHR: uiPermissions.includes(UIPermissionCategory.HR_MODULE),
      canAccessFinance: uiPermissions.includes(UIPermissionCategory.FINANCE_MODULE),
      canAccessApprovals: uiPermissions.includes(UIPermissionCategory.APPROVALS_MODULE),
    };
  }, [user, isLoading]);

  return permissions;
}

/**
 * Hook specifically for menu/navigation permissions
 */
export function useMenuPermissions() {
  const { menuPermissions, isLoading } = usePermissions();
  return { menuPermissions, isLoading };
}

/**
 * Hook for checking specific permission
 */
export function useHasPermission(permission: UIPermissionCategory) {
  const { hasPermission, isLoading } = usePermissions();
  return { hasPermission: hasPermission(permission), isLoading };
}

/**
 * Hook for checking multiple permissions
 */
export function useHasAnyPermission(permissions: UIPermissionCategory[]) {
  const { hasAnyPermission, isLoading } = usePermissions();
  return { hasPermission: hasAnyPermission(permissions), isLoading };
}

/**
 * Hook for admin status
 */
export function useIsAdmin() {
  const { isAdmin, isLoading } = usePermissions();
  return { isAdmin, isLoading };
}

/**
 * Hook for position information
 */
export function usePositionInfo() {
  const { positionInfo, isLoading } = usePermissions();
  return { positionInfo, isLoading };
}

/**
 * Hook for approval permissions specifically
 */
export function useApprovalPermissions() {
  const { canApprove, canAuthorize, canReview, isLoading } = usePermissions();
  return {
    canApprove,
    canAuthorize,
    canReview,
    hasAnyApprovalPermission: canApprove || canAuthorize || canReview,
    isLoading
  };
}
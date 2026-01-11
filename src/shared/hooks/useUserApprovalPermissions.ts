import { useMemo } from "react";
import { useAppSelector } from "./useStore";
import { ApprovalPermissions } from "@/features/auth/types/permission";

/**
 * Hook to get current user's approval permissions
 *
 * Returns approval permissions based on user's assigned role(s):
 * - can_review: User can review requests
 * - can_authorize: User can authorize requests
 * - can_approve: User can give final approval
 * - canPerformAnyApproval: True if user has any approval permission
 * - is_super_admin: True if user is a super admin
 * - canOverrideApproval: True if user can override approvals (super admin)
 *
 * @example
 * const { can_review, can_authorize, can_approve, canOverrideApproval } = useUserApprovalPermissions();
 *
 * if (can_approve || canOverrideApproval) {
 *   // Show approval button
 * }
 */
export function useUserApprovalPermissions(): ApprovalPermissions & {
  canPerformAnyApproval: boolean;
  is_super_admin: boolean;
  canOverrideApproval: boolean;
} {
  // Get current user from redux store
  const currentUser = useAppSelector((state) => state.auth.user);

  const approvalPermissions = useMemo(() => {
    // No user logged in
    if (!currentUser) {
      return {
        can_review: false,
        can_authorize: false,
        can_approve: false,
        is_super_admin: false,
        canOverrideApproval: false,
      };
    }

    // Check if user is super admin
    const isSuperAdmin = currentUser.is_superuser === true;

    // Initialize base permissions
    let basePermissions = {
      can_review: false,
      can_authorize: false,
      can_approve: false,
    };

    // Check regular permissions if user has them
    if (currentUser.permissions && currentUser.permissions.length > 0) {
      const approvalModule = currentUser.permissions.find(p => p.module === 'approvals');

      if (approvalModule && approvalModule.permissions) {
        basePermissions = {
          can_review: approvalModule.permissions.some(p => p.codename === 'can_review'),
          can_authorize: approvalModule.permissions.some(p => p.codename === 'can_authorize'),
          can_approve: approvalModule.permissions.some(p => p.codename === 'can_approve'),
        };
      }
    }

    return {
      ...basePermissions,
      is_super_admin: isSuperAdmin,
      canOverrideApproval: isSuperAdmin, // Super admins can override approvals
    };
  }, [currentUser]);

  return {
    ...approvalPermissions,
    canPerformAnyApproval:
      approvalPermissions.can_review ||
      approvalPermissions.can_authorize ||
      approvalPermissions.can_approve ||
      approvalPermissions.canOverrideApproval, // Include override capability
  };
}

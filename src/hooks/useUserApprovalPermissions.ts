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
 *
 * @example
 * const { can_review, can_authorize, can_approve } = useUserApprovalPermissions();
 *
 * if (can_approve) {
 *   // Show approval button
 * }
 */
export function useUserApprovalPermissions(): ApprovalPermissions & {
  canPerformAnyApproval: boolean;
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
      };
    }

    // Check if user has permissions (from all roles combined)
    // permissions is an array of Permission (module grouped format)
    if (!currentUser.permissions || currentUser.permissions.length === 0) {
      return {
        can_review: false,
        can_authorize: false,
        can_approve: false,
      };
    }

    // Find the approvals module in user's permissions
    const approvalModule = currentUser.permissions.find(p => p.module === 'approvals');

    if (!approvalModule || !approvalModule.permissions) {
      return {
        can_review: false,
        can_authorize: false,
        can_approve: false,
      };
    }

    return {
      can_review: approvalModule.permissions.some(p => p.codename === 'can_review'),
      can_authorize: approvalModule.permissions.some(p => p.codename === 'can_authorize'),
      can_approve: approvalModule.permissions.some(p => p.codename === 'can_approve'),
    };
  }, [currentUser]);

  return {
    ...approvalPermissions,
    canPerformAnyApproval:
      approvalPermissions.can_review ||
      approvalPermissions.can_authorize ||
      approvalPermissions.can_approve,
  };
}

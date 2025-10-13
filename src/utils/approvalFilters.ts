import type { IUser } from "@/features/auth/types/user";
import { getApprovalPermissions } from "@/features/auth/types/permission";

/**
 * Filter users who have the "can_review" permission
 *
 * @param users - Array of users to filter
 * @returns Users with review permission
 *
 * @example
 * const reviewers = filterUsersWithReviewPermission(allUsers);
 */
export function filterUsersWithReviewPermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.roles || user.roles.length === 0) return false;

    // Check if user's permissions include can_review
    // The user.permissions array is grouped by module
    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm => perm.codename === 'can_review');
      }
    }

    return false;
  });
}

/**
 * Filter users who have the "can_authorize" permission
 *
 * @param users - Array of users to filter
 * @returns Users with authorize permission
 *
 * @example
 * const authorizers = filterUsersWithAuthorizePermission(allUsers);
 */
export function filterUsersWithAuthorizePermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.roles || user.roles.length === 0) return false;

    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm => perm.codename === 'can_authorize');
      }
    }

    return false;
  });
}

/**
 * Filter users who have the "can_approve" permission
 *
 * @param users - Array of users to filter
 * @returns Users with approve permission
 *
 * @example
 * const approvers = filterUsersWithApprovePermission(allUsers);
 */
export function filterUsersWithApprovePermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.roles || user.roles.length === 0) return false;

    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm => perm.codename === 'can_approve');
      }
    }

    return false;
  });
}

/**
 * Get reviewer options for dropdowns
 *
 * @param users - Array of all users
 * @returns Array of options with label and value
 *
 * @example
 * const reviewerOptions = getReviewerOptions(allUsers);
 * <FormSelect options={reviewerOptions} />
 */
export function getReviewerOptions(users: IUser[]): Array<{ label: string; value: string }> {
  return filterUsersWithReviewPermission(users).map(user => ({
    label: getUserDisplayLabel(user),
    value: user.id,
  }));
}

/**
 * Get authorizer options for dropdowns
 *
 * @param users - Array of all users
 * @returns Array of options with label and value
 *
 * @example
 * const authorizerOptions = getAuthorizerOptions(allUsers);
 * <FormSelect options={authorizerOptions} />
 */
export function getAuthorizerOptions(users: IUser[]): Array<{ label: string; value: string }> {
  return filterUsersWithAuthorizePermission(users).map(user => ({
    label: getUserDisplayLabel(user),
    value: user.id,
  }));
}

/**
 * Get approver options for dropdowns
 *
 * @param users - Array of all users
 * @returns Array of options with label and value
 *
 * @example
 * const approverOptions = getApproverOptions(allUsers);
 * <FormSelect options={approverOptions} />
 */
export function getApproverOptions(users: IUser[]): Array<{ label: string; value: string }> {
  return filterUsersWithApprovePermission(users).map(user => ({
    label: getUserDisplayLabel(user),
    value: user.id,
  }));
}

/**
 * Get display label for user in dropdowns
 * Includes name and email for clarity
 *
 * @param user - User object
 * @returns Formatted display label
 *
 * @example
 * getUserDisplayLabel(user) // "John Doe (john@example.com)"
 */
export function getUserDisplayLabel(user: IUser): string {
  const fullName = user.full_name ||
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    'Unknown User';

  const email = user.email ? ` (${user.email})` : '';

  return `${fullName}${email}`;
}

/**
 * Filter users who have ANY approval permission
 * Useful for showing all potential approvers
 *
 * @param users - Array of users to filter
 * @returns Users with any approval permission
 *
 * @example
 * const approvers = filterUsersWithAnyApprovalPermission(allUsers);
 */
export function filterUsersWithAnyApprovalPermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.roles || user.roles.length === 0) return false;

    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm =>
          perm.codename === 'can_review' ||
          perm.codename === 'can_authorize' ||
          perm.codename === 'can_approve'
        );
      }
    }

    return false;
  });
}

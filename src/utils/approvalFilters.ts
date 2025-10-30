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
  const filteredUsers = users.filter(user => {
    // Check approval_permissions object from API
    if ((user as any).approval_permissions?.can_review === true) {
      return true;
    }

    // Fallback: Check if user's permissions include can_review (old structure)
    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm => perm.codename === 'can_review');
      }
    }

    return false;
  });

  // FALLBACK: If no users have approval permissions, return all AHNI staff
  // This ensures the approval workflow doesn't break while permissions are being set up
  if (filteredUsers.length === 0) {
    console.warn('⚠️  No users found with can_review permission. Falling back to all AHNI staff.');
    return users.filter(user =>
      user.user_type === 'AHNI_Staff' ||
      user.user_type === 'ahni_staff' ||
      (user as any).is_staff === true
    );
  }

  return filteredUsers;
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
  const filteredUsers = users.filter(user => {
    // Check approval_permissions object from API
    if ((user as any).approval_permissions?.can_authorize === true) {
      return true;
    }

    // Fallback: Check if user's permissions include can_authorize (old structure)
    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm => perm.codename === 'can_authorize');
      }
    }

    return false;
  });

  // FALLBACK: If no users have approval permissions, return all AHNI staff
  // This ensures the approval workflow doesn't break while permissions are being set up
  if (filteredUsers.length === 0) {
    console.warn('⚠️  No users found with can_authorize permission. Falling back to all AHNI staff.');
    return users.filter(user =>
      user.user_type === 'AHNI_Staff' ||
      user.user_type === 'ahni_staff' ||
      (user as any).is_staff === true
    );
  }

  return filteredUsers;
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
  const filteredUsers = users.filter(user => {
    // Check approval_permissions object from API
    if ((user as any).approval_permissions?.can_approve === true) {
      return true;
    }

    // Fallback: Check if user's permissions include can_approve (old structure)
    if (user.permissions && user.permissions.length > 0) {
      const approvalModule = user.permissions.find(p => p.module === 'approvals');
      if (approvalModule && approvalModule.permissions) {
        return approvalModule.permissions.some(perm => perm.codename === 'can_approve');
      }
    }

    return false;
  });

  // FALLBACK: If no users have approval permissions, return all AHNI staff
  // This ensures the approval workflow doesn't break while permissions are being set up
  if (filteredUsers.length === 0) {
    console.warn('⚠️  No users found with can_approve permission. Falling back to all AHNI staff.');
    return users.filter(user =>
      user.user_type === 'AHNI_Staff' ||
      user.user_type === 'ahni_staff' ||
      (user as any).is_staff === true
    );
  }

  return filteredUsers;
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
    // Check approval_permissions object from API
    const approvalPerms = (user as any).approval_permissions;
    if (approvalPerms?.can_review === true ||
        approvalPerms?.can_authorize === true ||
        approvalPerms?.can_approve === true) {
      return true;
    }

    // Fallback: Check if user's permissions include any approval permission (old structure)
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

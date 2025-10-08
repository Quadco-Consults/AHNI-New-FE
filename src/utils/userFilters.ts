/**
 * User Filter Utilities
 *
 * Helper functions to filter users based on their roles and types
 */

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type?: string;
  is_staff?: boolean;
  organization?: string;
  company?: string;
  [key: string]: any;
}

/**
 * Filter to get only AHNI staff members (exclude vendors, consultants, external users)
 *
 * @param users - Array of users to filter
 * @returns Array of AHNI staff only
 *
 * @example
 * const { data: allUsers } = useGetAllUsers();
 * const ahniStaff = filterAhniStaffOnly(allUsers?.results || []);
 */
export function filterAhniStaffOnly(users: IUser[]): IUser[] {
  return users.filter((user) => {
    const userType = user?.user_type?.toUpperCase()?.trim() || '';

    // Exclude vendors and external users (explicit exclusion only)
    const isExcluded =
      userType === 'VENDOR' ||
      userType === 'CONSULTANT' ||
      userType === 'EXTERNAL' ||
      userType === 'SUPPLIER' ||
      userType === 'CONTRACTOR';

    // If explicitly excluded, don't include
    if (isExcluded) {
      return false;
    }

    // Include everyone else (STAFF, ADMIN, SUPERADMIN, or users without type)
    // This is more lenient - we only exclude known vendor types
    return true;
  });
}

/**
 * Filter to get only vendors (exclude AHNI staff)
 *
 * @param users - Array of users to filter
 * @returns Array of vendors only
 */
export function filterVendorsOnly(users: IUser[]): IUser[] {
  return users.filter((user) => {
    const userType = user?.user_type?.toUpperCase() || '';
    return (
      userType === 'VENDOR' ||
      userType === 'SUPPLIER' ||
      userType === 'CONTRACTOR'
    );
  });
}

/**
 * Filter to get only consultants (exclude AHNI staff and vendors)
 *
 * @param users - Array of users to filter
 * @returns Array of consultants only
 */
export function filterConsultantsOnly(users: IUser[]): IUser[] {
  return users.filter((user) => {
    const userType = user?.user_type?.toUpperCase() || '';
    return (
      userType === 'CONSULTANT' ||
      userType === 'EXTERNAL'
    );
  });
}

/**
 * Get user display name (handles object vs string names)
 *
 * @param user - User object
 * @returns Full name string
 */
export function getUserDisplayName(user: IUser): string {
  const firstName = typeof user?.first_name === 'object'
    ? (user?.first_name as any)?.name || 'Unknown'
    : user?.first_name || 'Unknown';

  const lastName = typeof user?.last_name === 'object'
    ? (user?.last_name as any)?.name || ''
    : user?.last_name || '';

  return `${firstName} ${lastName}`.trim();
}

/**
 * Get user designation (handles object vs string designation)
 *
 * @param user - User object
 * @returns Designation string
 */
export function getUserDesignation(user: IUser): string {
  if (typeof user?.designation === 'object' && user?.designation !== null) {
    return (user?.designation as any)?.name ||
           (user?.designation as any)?.title ||
           'N/A';
  }

  if (user?.designation) {
    return user.designation;
  }

  if (typeof user?.position === 'object' && user?.position !== null) {
    return (user?.position as any)?.name ||
           (user?.position as any)?.title ||
           'N/A';
  }

  return user?.position || 'N/A';
}

/**
 * Get user department (handles object vs string department)
 *
 * @param user - User object
 * @returns Department string
 */
export function getUserDepartment(user: IUser): string {
  if (typeof user?.department === 'object' && user?.department !== null) {
    return (user?.department as any)?.name ||
           (user?.department as any)?.title ||
           'N/A';
  }

  return user?.department || 'N/A';
}

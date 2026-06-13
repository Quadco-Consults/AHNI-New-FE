/**
 * Program Admin Utility Hook
 *
 * This hook provides Program Admin detection and capabilities
 * using existing endpoints with enhanced permission logic.
 *
 * Works seamlessly with your current API without requiring new endpoints!
 */

import { useUnifiedPermissions } from './useUnifiedPermissions';
import { useMemo } from 'react';

interface ProgramAdminCapabilities {
  // Core Detection
  isProgramAdmin: boolean;

  // Access Levels
  canManageAllPrograms: boolean;
  canApproveHighValue: boolean;
  canOverrideStandard: boolean;
  canViewCrossPrograms: boolean;

  // Financial Limits
  financialApprovalLimit: number;
  canApproveAmount: (amount: number) => boolean;

  // Administrative Functions
  canAssignProgramOfficers: boolean;
  canModifyWorkPlans: boolean;
  canViewAllFundRequests: boolean;
  canGenerateReports: boolean;

  // Program Admin Level
  adminLevel: 'none' | 'junior' | 'senior' | 'executive';
}

export const useProgramAdmin = (): ProgramAdminCapabilities => {
  const {
    user,
    isAdmin,
    hasPermission,
    normalizedPermissions,
  } = useUnifiedPermissions();

  const capabilities = useMemo((): ProgramAdminCapabilities => {
    // Core Program Admin Detection
    const isProgramAdmin = detectProgramAdmin();

    function detectProgramAdmin(): boolean {
      if (!user) return false;

      // Method 1: Direct position title detection
      const position = user.position?.title;
      if (position === 'Program Admin' ||
          position === 'Program Manager' ||
          position === 'Senior Program Officer') {
        return true;
      }

      // Method 2: Department + Role combination
      const department = user.department?.name;
      const hasProgAdminRole = user.roles?.some((role: any) =>
        role.name?.toLowerCase().includes('program admin') ||
        role.name?.toLowerCase().includes('program manager')
      );

      if (department === 'Programs' && hasProgAdminRole) {
        return true;
      }

      // Method 3: Permission pattern detection (enhanced permissions)
      const programPermissions = normalizedPermissions?.permissions?.filter(
        perm => perm.module === 'programs'
      ) || [];

      const adminPermissions = [
        'add_workplan', 'change_workplan', 'delete_workplan',
        'approve_fundrequest', 'authorize_fundrequest',
        'view_all_programs', 'manage_program_staff'
      ];

      const hasAdminPermissions = adminPermissions.some(perm =>
        programPermissions.some(p =>
          p.permissions.some(detail => detail.codename === perm)
        )
      );

      // Must be in Programs department with admin permissions
      return department === 'Programs' && hasAdminPermissions;
    }

    // Determine admin level
    function getAdminLevel(): 'none' | 'junior' | 'senior' | 'executive' {
      if (!isProgramAdmin) return 'none';

      const position = user?.position?.title?.toLowerCase() || '';

      if (position.includes('executive') || position.includes('director')) {
        return 'executive';
      } else if (position.includes('senior') || position.includes('manager')) {
        return 'senior';
      } else {
        return 'junior';
      }
    }

    // Calculate financial approval limit based on admin level
    function getFinancialLimit(): number {
      const adminLevel = getAdminLevel();
      const baseLimits = {
        none: 0,
        junior: 25000,    // $25K
        senior: 100000,   // $100K
        executive: 500000 // $500K
      };

      return baseLimits[adminLevel];
    }

    const adminLevel = getAdminLevel();
    const financialApprovalLimit = getFinancialLimit();

    return {
      // Core Detection
      isProgramAdmin,

      // Access Levels
      canManageAllPrograms: isProgramAdmin && adminLevel !== 'none',
      canApproveHighValue: isProgramAdmin && (adminLevel === 'senior' || adminLevel === 'executive'),
      canOverrideStandard: isProgramAdmin && adminLevel !== 'none',
      canViewCrossPrograms: isProgramAdmin,

      // Financial Limits
      financialApprovalLimit,
      canApproveAmount: (amount: number) => isProgramAdmin && amount <= financialApprovalLimit,

      // Administrative Functions
      canAssignProgramOfficers: isProgramAdmin && (adminLevel === 'senior' || adminLevel === 'executive'),
      canModifyWorkPlans: isProgramAdmin,
      canViewAllFundRequests: isProgramAdmin,
      canGenerateReports: isProgramAdmin,

      // Admin Level
      adminLevel,
    };
  }, [user, normalizedPermissions, hasPermission]);

  return capabilities;
};

/**
 * Usage Examples with Existing Endpoints:
 *
 * // 1. Enhanced Work Plan Access
 * const { isProgramAdmin, canModifyWorkPlans } = useProgramAdmin();
 * const { data: workPlans } = useGetWorkPlans({
 *   // Same endpoint, but Program Admin sees all work plans
 *   includeAll: isProgramAdmin
 * });
 *
 * // 2. Fund Request with Admin View
 * const { data: fundRequests } = useGetFundRequests({
 *   // Same endpoint, enhanced permissions applied automatically
 *   page: 1,
 *   size: 20
 * });
 *
 * // 3. Conditional UI based on Program Admin status
 * {isProgramAdmin && (
 *   <button onClick={handleAdminAction}>
 *     Admin Override
 *   </button>
 * )}
 *
 * // 4. Financial approval checks
 * const canApprove = canApproveAmount(fundRequest.amount);
 *
 * // 5. Admin-level reporting
 * {canGenerateReports && (
 *   <ProgramAdminReports />
 * )}
 */

// Additional utility for checking Program Admin in components
export const isProgramAdminUser = (user: any): boolean => {
  if (!user) return false;

  const position = user.position?.title;
  const department = user.department?.name;

  return (
    position === 'Program Admin' ||
    position === 'Program Manager' ||
    position === 'Senior Program Officer' ||
    (department === 'Programs' &&
     user.roles?.some((role: any) =>
       role.name?.toLowerCase().includes('program admin')
     ))
  );
};

// Quick check for enhanced permissions in existing components
export const hasEnhancedProgramAccess = (user: any, normalizedPermissions: any): boolean => {
  if (!user || !normalizedPermissions) return false;

  const isProgramAdmin = isProgramAdminUser(user);
  const isInPrograms = user.department?.name === 'Programs';

  return isProgramAdmin || (isInPrograms && user.roles?.length > 0);
};
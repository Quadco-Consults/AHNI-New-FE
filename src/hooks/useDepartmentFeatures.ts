import { useAppSelector } from '@/store/hooks';
import { authSelector } from '@/store/auth/authSlice';
import { useMemo, useRef } from 'react';

/**
 * Hook for department-based conditional rendering and feature management
 * Provides utilities to check user department and enable department-specific features
 */
export const useDepartmentFeatures = () => {
  const { user } = useAppSelector(authSelector);
  const debugLoggedRef = useRef(false);

  // Get user department from multiple possible locations
  const getUserDepartment = (): string | null => {
    return (
      user?.employee?.department?.name ||
      user?.department?.name ||
      null
    );
  };

  const userDepartment = getUserDepartment();

  // Debug department detection in development (only log once per user change)
  const userKey = user?.id || user?.email;
  if (process.env.NODE_ENV === 'development' && userDepartment && userKey && !debugLoggedRef.current) {
    console.log('🏢 Department Features Debug:', {
      userDepartment,
      employeeDepartment: user?.employee?.department?.name,
      directDepartment: user?.department?.name,
      hasEmployeeStructure: !!user?.employee
    });
    debugLoggedRef.current = true;
  }

  // Department checks - be more flexible with department name matching (case-insensitive)
  const userDepartmentLower = userDepartment?.toLowerCase() || '';
  const isProgramsDepartment = userDepartmentLower === 'programs';
  const isContractsGrantsDepartment = userDepartmentLower === 'c ang g' || userDepartmentLower === 'c&g' ||
    userDepartmentLower === 'contracts and grants' || userDepartmentLower.includes('contract');
  const isHRDepartment = userDepartmentLower === 'hr' || userDepartmentLower === 'human resources';
  const isFinanceDepartment = userDepartmentLower === 'finance';
  const isAdminDepartment = userDepartmentLower === 'admin' || userDepartmentLower === 'administration';
  const isProcurementDepartment = userDepartmentLower === 'procurement';

  // Enhanced email and position-based detection for departmental officers and managers
  const userEmail = user?.email?.toLowerCase() || '';
  const isCGOfficer = userEmail.includes('cgofficer') || userEmail.includes('contract');
  const isProgramsOfficer = userEmail.includes('programs') || userEmail.includes('program');
  const isHROfficer = userEmail.includes('hr') || userEmail.includes('human') || userEmail.includes('hrmanager');
  const isFinanceOfficer = userEmail.includes('finance') || userEmail.includes('financemanager') || userEmail.includes('financeofficer');
  const isAdminOfficer = userEmail.includes('admin');
  const isProcurementOfficer = userEmail.includes('procurement');

  // Enhanced position-based detection for departmental roles
  const userPosition = user?.position?.name || user?.position?.title || '';
  const userPositionLower = userPosition.toLowerCase();
  const isFinancePosition = userPositionLower.includes('finance');
  const isHRPosition = userPositionLower.includes('hr') ||
                     userPositionLower.includes('human resources') ||
                     userPositionLower.includes('human resource');
  const isAdminPosition = userPositionLower.includes('admin') && !userPositionLower.includes('superadmin');
  const isProcurementPosition = userPositionLower.includes('procurement');
  const isProgramsPosition = userPositionLower.includes('program');

  // HR debug removed temporarily to fix scoping issue

  // Feature access checks - more permissive for departmental officers (memoized)
  const canAccessProgramsFeatures = useMemo(() =>
    isProgramsDepartment || isProgramsOfficer || isProgramsPosition || user?.is_superuser || user?.is_staff,
    [isProgramsDepartment, isProgramsOfficer, isProgramsPosition, user?.is_superuser, user?.is_staff]
  );

  const canAccessContractsGrantsFeatures = useMemo(() =>
    isContractsGrantsDepartment || isCGOfficer || user?.is_superuser || user?.is_staff,
    [isContractsGrantsDepartment, isCGOfficer, user?.is_superuser, user?.is_staff]
  );

  const canAccessHRFeatures = useMemo(() =>
    isHRDepartment || isHROfficer || isHRPosition || user?.is_superuser || user?.is_staff,
    [isHRDepartment, isHROfficer, isHRPosition, user?.is_superuser, user?.is_staff]
  );

  const canAccessFinanceFeatures = useMemo(() =>
    isFinanceDepartment || isFinanceOfficer || isFinancePosition || user?.is_superuser || user?.is_staff,
    [isFinanceDepartment, isFinanceOfficer, isFinancePosition, user?.is_superuser, user?.is_staff]
  );

  const canAccessAdminFeatures = useMemo(() =>
    isAdminDepartment || isAdminOfficer || isAdminPosition || user?.is_superuser || user?.is_staff,
    [isAdminDepartment, isAdminOfficer, isAdminPosition, user?.is_superuser, user?.is_staff]
  );

  const canAccessProcurementFeatures = useMemo(() =>
    isProcurementDepartment || isProcurementOfficer || isProcurementPosition || user?.is_superuser || user?.is_staff,
    [isProcurementDepartment, isProcurementOfficer, isProcurementPosition, user?.is_superuser, user?.is_staff]
  );

  // Temporary HR debug for troubleshooting - placed after all feature access definitions
  if (process.env.NODE_ENV === 'development' && userEmail.includes('hr') && userKey) {
    console.log('🏢 HR Manager Debug:', {
      email: userEmail,
      isHROfficer,
      position: userPosition,
      isHRPosition,
      department: userDepartment,
      isHRDepartment,
      canAccessHRFeatures,
      hasHRPermissions: user?.permissions?.some((p: any) => p.module === 'hr') || false
    });
  }

  // Universal features (available to all departments)
  const canAccessLeaveManagement = true;
  const canAccessItemRequisition = true;
  const canAccessTravelExpense = true;

  // Department-specific feature sets
  const getDepartmentFeatures = () => {
    const features = {
      programs: canAccessProgramsFeatures,
      contractsGrants: canAccessContractsGrantsFeatures,
      hr: canAccessHRFeatures,
      finance: canAccessFinanceFeatures,
      admin: canAccessAdminFeatures,
      procurement: canAccessProcurementFeatures,
      leave: canAccessLeaveManagement,
      itemRequisition: canAccessItemRequisition,
      travelExpense: canAccessTravelExpense,
    };

    return features;
  };

  // Get department color/theme
  const getDepartmentTheme = () => {
    const themes: { [key: string]: { primary: string; secondary: string; icon: string } } = {
      'PROGRAMS': { primary: '#3B82F6', secondary: '#EFF6FF', icon: '📋' },
      'C ANG G': { primary: '#10B981', secondary: '#ECFDF5', icon: '📄' },
      'HR': { primary: '#F59E0B', secondary: '#FFFBEB', icon: '👥' },
      'FINANCE': { primary: '#EF4444', secondary: '#FEF2F2', icon: '💰' },
      'ADMIN': { primary: '#8B5CF6', secondary: '#F5F3FF', icon: '⚙️' },
      'PROCUREMENT': { primary: '#06B6D4', secondary: '#F0F9FF', icon: '🛒' },
    };

    return userDepartment ? themes[userDepartment] : themes['ADMIN'];
  };

  // Check if user has employee profile set up
  const hasEmployeeProfile = !!(
    user?.employee?.department ||
    user?.department ||
    user?.employee_id
  );

  // Get department-specific dashboard widgets
  const getDepartmentDashboardWidgets = () => {
    const widgets = [];

    if (canAccessLeaveManagement) {
      widgets.push({ name: 'leave-dashboard', title: 'Leave Management', priority: 1 });
    }

    if (canAccessItemRequisition) {
      widgets.push({ name: 'item-requisition', title: 'Item Requisition', priority: 2 });
    }

    if (canAccessProgramsFeatures) {
      widgets.push({ name: 'programs-dashboard', title: 'Programs Dashboard', priority: 3 });
    }

    if (canAccessContractsGrantsFeatures) {
      widgets.push({ name: 'contracts-grants', title: 'Contracts & Grants', priority: 4 });
    }

    if (canAccessProcurementFeatures) {
      widgets.push({ name: 'procurement-dashboard', title: 'Procurement Dashboard', priority: 5 });
    }

    if (canAccessFinanceFeatures) {
      widgets.push({ name: 'finance-dashboard', title: 'Finance Dashboard', priority: 6 });
    }

    return widgets.sort((a, b) => a.priority - b.priority);
  };

  return {
    userDepartment,
    hasEmployeeProfile,

    // Department checks
    isProgramsDepartment,
    isContractsGrantsDepartment,
    isHRDepartment,
    isFinanceDepartment,
    isAdminDepartment,
    isProcurementDepartment,

    // Feature access
    canAccessProgramsFeatures,
    canAccessContractsGrantsFeatures,
    canAccessHRFeatures,
    canAccessFinanceFeatures,
    canAccessAdminFeatures,
    canAccessProcurementFeatures,
    canAccessLeaveManagement,
    canAccessItemRequisition,
    canAccessTravelExpense,

    // Utility functions
    getDepartmentFeatures,
    getDepartmentTheme,
    getDepartmentDashboardWidgets,
  };
};
import { useAppSelector } from '@/store/hooks';
import { authSelector } from '@/store/auth/authSlice';

/**
 * Hook for department-based conditional rendering and feature management
 * Provides utilities to check user department and enable department-specific features
 */
export const useDepartmentFeatures = () => {
  const { user } = useAppSelector(authSelector);

  // Get user department from multiple possible locations
  const getUserDepartment = (): string | null => {
    return (
      user?.employee?.department?.name ||
      user?.department?.name ||
      null
    );
  };

  const userDepartment = getUserDepartment();

  // Debug department detection in development
  if (process.env.NODE_ENV === 'development' && userDepartment) {
    console.log('🏢 Department Features Debug:', {
      userDepartment,
      employeeDepartment: user?.employee?.department?.name,
      directDepartment: user?.department?.name,
      hasEmployeeStructure: !!user?.employee
    });
  }

  // Department checks - be more flexible with department name matching
  const isProgramsDepartment = userDepartment === 'PROGRAMS' || userDepartment === 'Programs';
  const isContractsGrantsDepartment = userDepartment === 'C ANG G' || userDepartment === 'C&G' ||
    userDepartment === 'CONTRACTS AND GRANTS' || userDepartment === 'Contracts and Grants' ||
    userDepartment?.toLowerCase().includes('contract');
  const isHRDepartment = userDepartment === 'HR' || userDepartment === 'Human Resources';
  const isFinanceDepartment = userDepartment === 'FINANCE' || userDepartment === 'Finance';
  const isAdminDepartment = userDepartment === 'ADMIN' || userDepartment === 'Administration';
  const isProcurementDepartment = userDepartment === 'PROCUREMENT' || userDepartment === 'Procurement';

  // Temporary email-based detection for departmental officers
  const userEmail = user?.email?.toLowerCase() || '';
  const isCGOfficer = userEmail.includes('cgofficer') || userEmail.includes('contract');
  const isProgramsOfficer = userEmail.includes('programs') || userEmail.includes('program');
  const isHROfficer = userEmail.includes('hr') || userEmail.includes('human');
  const isFinanceOfficer = userEmail.includes('finance');
  const isAdminOfficer = userEmail.includes('admin');
  const isProcurementOfficer = userEmail.includes('procurement');

  // Feature access checks - more permissive for departmental officers
  const canAccessProgramsFeatures = isProgramsDepartment || isProgramsOfficer || user?.is_superuser || user?.is_staff;
  const canAccessContractsGrantsFeatures = isContractsGrantsDepartment || isCGOfficer || user?.is_superuser || user?.is_staff;
  const canAccessHRFeatures = isHRDepartment || isHROfficer || user?.is_superuser || user?.is_staff;
  const canAccessFinanceFeatures = isFinanceDepartment || isFinanceOfficer || user?.is_superuser || user?.is_staff;
  const canAccessAdminFeatures = isAdminDepartment || isAdminOfficer || user?.is_superuser || user?.is_staff;
  const canAccessProcurementFeatures = isProcurementDepartment || isProcurementOfficer || user?.is_superuser || user?.is_staff;

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
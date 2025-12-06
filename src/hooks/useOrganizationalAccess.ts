import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { IUser, IPermission } from '../features/auth/types/auth';

type AccessScope = 'own' | 'department' | 'location' | 'global';

interface IOrganizationalContext {
  user: IUser;
  hierarchy: {
    supervisor: IUser | null;
    peers: IUser[];
    direct_reports: IUser[];
    department_head: IUser | null;
    location_head: IUser | null;
  };
  access_levels: {
    can_view_department_data: boolean;
    can_view_location_data: boolean;
    can_view_global_data: boolean;
    can_approve_department_requests: boolean;
    can_authorize_financial: boolean;
    financial_approval_limit: number;
  };
}

/**
 * Comprehensive organizational access control hook
 * Handles department, role, position, location-based permissions
 */
export function useOrganizationalAccess() {
  const authState = useAppSelector((state) => state.auth);
  const { user, isAuthenticated, loading } = authState;

  return useMemo(() => {
    if (!isAuthenticated || loading || !user) {
      return {
        // Default empty state
        hasAccess: () => false,
        canViewModule: () => false,
        canCreateInModule: () => false,
        canEditInModule: () => false,
        canApproveInModule: () => false,
        canAuthorizeInModule: () => false,
        getDashboardConfig: () => null,
        getMenuStructure: () => ({ department_menus: [], global_hub_items: [], quick_actions: [] }),
        getAccessibleLocations: () => [],
        getAccessibleDepartments: () => [],
        isAuthenticated: false,
        loading: true,
        user: null,
        organizationalContext: null
      };
    }

    // Use user directly with organizational fields from backend
    const orgUser = user as IUser;

    // Core access checking function
    const hasAccess = (module: string, action: string, scope: AccessScope = 'own'): boolean => {
      // System admin bypass
      if (orgUser.is_superuser) {
        return true;
      }

      // Get permissions from user (from backend login response)
      const userPermissions = authState.permissions || orgUser.permissions || [];

      // Check module permissions
      const modulePerms = userPermissions.find(p => p.module === module);
      if (!modulePerms) return false;

      // Check specific action permission
      const actionCodename = `${action}_${module.toLowerCase().replace('s', '')}` ||
                            `${action}_${module.toLowerCase()}`;

      const hasActionPerm = modulePerms.permissions.some(p =>
        p.codename === actionCodename ||
        p.codename.includes(action)
      );

      if (!hasActionPerm) return false;

      // Scope-based access control
      switch (scope) {
        case 'own':
          return true; // Can always access own data if has permission

        case 'department':
          // Can access department data if same department or is department head
          return orgUser.department?.id === orgUser.department?.id ||
                 orgUser.position?.level === 'manager' ||
                 orgUser.position?.level === 'director';

        case 'location':
          // Can access location data if same location or is location head
          return orgUser.location?.id === orgUser.location?.id ||
                 orgUser.position?.level === 'director' ||
                 orgUser.position?.level === 'executive';

        case 'global':
          // Can access global data only if executive level or has global permissions
          return orgUser.position?.level === 'executive' ||
                 orgUser.is_superuser ||
                 orgUser.data_access_level === 'global';

        default:
          return false;
      }
    };

    // Module-specific access functions
    const canViewModule = (module: string, scope: AccessScope = 'department'): boolean => {
      return hasAccess(module, 'view', scope);
    };

    const canCreateInModule = (module: string): boolean => {
      return hasAccess(module, 'add', 'own');
    };

    const canEditInModule = (module: string, scope: AccessScope = 'own'): boolean => {
      return hasAccess(module, 'change', scope);
    };

    const canApproveInModule = (module: string, scope: AccessScope = 'department'): boolean => {
      return (orgUser.position?.can_approve || false) &&
             hasAccess(module, 'approve', scope);
    };

    const canAuthorizeInModule = (module: string, scope: AccessScope = 'department'): boolean => {
      return (orgUser.position?.can_authorize || false) &&
             hasAccess(module, 'authorize', scope);
    };

    // Dashboard configuration based on department and role
    const getDashboardConfig = () => {
      const department = orgUser.department?.code || 'default';
      const positionLevel = orgUser.position?.level || 'staff';

      // Default dashboard configs (would come from backend)
      const dashboardConfigs = {
        'PROG': {
          staff: 'program_officer_dashboard',
          supervisor: 'program_supervisor_dashboard',
          manager: 'program_manager_dashboard',
          director: 'program_director_dashboard'
        },
        'HR': {
          staff: 'hr_staff_dashboard',
          supervisor: 'hr_supervisor_dashboard',
          manager: 'hr_manager_dashboard',
          director: 'hr_director_dashboard'
        },
        'FIN': {
          staff: 'finance_analyst_dashboard',
          supervisor: 'finance_supervisor_dashboard',
          manager: 'finance_manager_dashboard',
          director: 'finance_director_dashboard'
        },
        'PROC': {
          staff: 'procurement_officer_dashboard',
          supervisor: 'procurement_supervisor_dashboard',
          manager: 'procurement_manager_dashboard',
          director: 'procurement_director_dashboard'
        },
        'default': {
          staff: 'general_staff_dashboard',
          supervisor: 'general_supervisor_dashboard',
          manager: 'general_manager_dashboard',
          director: 'general_director_dashboard',
          executive: 'executive_dashboard'
        }
      };

      return dashboardConfigs[department]?.[positionLevel] ||
             dashboardConfigs.default[positionLevel] ||
             dashboardConfigs.default.staff;
    };

    // Menu structure based on department and position
    const getMenuStructure = () => {
      const department = orgUser.department?.code || 'default';
      const positionLevel = orgUser.position?.level || 'staff';
      const isAdmin = orgUser.is_superuser || positionLevel === 'executive';

      // Department-specific menus
      const departmentMenus = [];

      // Programs Department
      if (department === 'PROG' || isAdmin) {
        departmentMenus.push({
          id: 'programs',
          title: 'Programs',
          icon: 'FolderOpen',
          department: 'PROG',
          position_levels: ['staff', 'supervisor', 'manager', 'director'],
          children: [
            { id: 'workplans', title: 'Workplans', path: '/programs/workplans', permissions_required: [{ module: 'programs', permissions: [{ codename: 'view_workplan' }] }] },
            { id: 'fund-requests', title: 'Fund Requests', path: '/programs/fund-requests', permissions_required: [{ module: 'programs', permissions: [{ codename: 'view_fundrequest' }] }] },
            { id: 'site-visits', title: 'Site Visits', path: '/programs/site-visits', permissions_required: [{ module: 'programs', permissions: [{ codename: 'view_sitevisit' }] }] }
          ]
        });
      }

      // HR Department
      if (department === 'HR' || isAdmin) {
        departmentMenus.push({
          id: 'hr',
          title: 'Human Resources',
          icon: 'Users',
          department: 'HR',
          position_levels: ['staff', 'supervisor', 'manager', 'director'],
          children: [
            { id: 'leave-requests', title: 'Leave Management', path: '/hr/leave-requests', permissions_required: [{ module: 'hr', permissions: [{ codename: 'view_leaverequest' }] }] },
            { id: 'timesheet', title: 'Timesheet', path: '/hr/timesheet', permissions_required: [{ module: 'hr', permissions: [{ codename: 'view_timesheet' }] }] },
            { id: 'recruitment', title: 'Recruitment', path: '/hr/recruitment', permissions_required: [{ module: 'hr', permissions: [{ codename: 'view_jobapplication' }] }] }
          ]
        });
      }

      // Finance Department
      if (department === 'FIN' || isAdmin) {
        departmentMenus.push({
          id: 'finance',
          title: 'Finance',
          icon: 'DollarSign',
          department: 'FIN',
          position_levels: ['staff', 'supervisor', 'manager', 'director'],
          children: [
            { id: 'expense-reports', title: 'Expense Reports', path: '/finance/expense-reports', permissions_required: [{ module: 'finance', permissions: [{ codename: 'view_expensereport' }] }] },
            { id: 'budget-management', title: 'Budget Management', path: '/finance/budget', permissions_required: [{ module: 'finance', permissions: [{ codename: 'view_budget' }] }] },
            { id: 'financial-reports', title: 'Financial Reports', path: '/finance/reports', permissions_required: [{ module: 'finance', permissions: [{ codename: 'view_financialreport' }] }] }
          ]
        });
      }

      // Procurement Department
      if (department === 'PROC' || isAdmin) {
        departmentMenus.push({
          id: 'procurement',
          title: 'Procurement',
          icon: 'ShoppingCart',
          department: 'PROC',
          position_levels: ['staff', 'supervisor', 'manager', 'director'],
          children: [
            { id: 'purchase-requests', title: 'Purchase Requests', path: '/procurement/purchase-requests', permissions_required: [{ module: 'procurements', permissions: [{ codename: 'view_purchaserequest' }] }] },
            { id: 'vendor-management', title: 'Vendor Management', path: '/procurement/vendors', permissions_required: [{ module: 'procurements', permissions: [{ codename: 'view_vendor' }] }] },
            { id: 'procurement-plans', title: 'Procurement Plans', path: '/procurement/plans', permissions_required: [{ module: 'procurements', permissions: [{ codename: 'view_procurementplan' }] }] }
          ]
        });
      }

      // Global Hub Items (accessible to ALL departments and ALL position levels)
      const globalHubItems = [
        // Communication & Collaboration
        {
          id: 'announcements',
          title: 'Announcements',
          description: 'Company-wide announcements and news',
          icon: 'Megaphone',
          path: '/global/announcements',
          category: 'communication',
          available_to: { all_departments: true, universal_access: true }
        },
        {
          id: 'directory',
          title: 'Staff Directory',
          description: 'Find colleagues and contact information',
          icon: 'Book',
          path: '/global/directory',
          category: 'communication',
          available_to: { all_departments: true, universal_access: true }
        },
        {
          id: 'help-desk',
          title: 'Help Desk',
          description: 'IT support and technical assistance',
          icon: 'HelpCircle',
          path: '/global/help-desk',
          category: 'administrative',
          available_to: { all_departments: true, universal_access: true }
        },

        // Reporting & Analytics (NOW UNIVERSAL!)
        {
          id: 'reports',
          title: 'Global Reports',
          description: 'Organization-wide reports and analytics',
          icon: 'BarChart',
          path: '/global/reports',
          category: 'reporting',
          available_to: { all_departments: true, universal_access: true }
        },
        {
          id: 'executive-dashboard',
          title: 'Executive Dashboard',
          description: 'High-level organizational metrics',
          icon: 'Layout',
          path: '/global/executive-dashboard',
          category: 'reporting',
          available_to: { all_departments: true, universal_access: true }
        },

        // Administrative
        {
          id: 'document-center',
          title: 'Document Center',
          description: 'Policies, procedures, and templates',
          icon: 'FileText',
          path: '/global/documents',
          category: 'administrative',
          available_to: { all_departments: true, universal_access: true }
        },
        {
          id: 'training',
          title: 'Training Center',
          description: 'Professional development and training',
          icon: 'GraduationCap',
          path: '/global/training',
          category: 'administrative',
          available_to: { all_departments: true, universal_access: true }
        },

        // Additional Global Features
        {
          id: 'calendar',
          title: 'Organization Calendar',
          description: 'Events, meetings, and important dates',
          icon: 'Calendar',
          path: '/global/calendar',
          category: 'communication',
          available_to: { all_departments: true, universal_access: true }
        },
        {
          id: 'resources',
          title: 'Resource Library',
          description: 'Shared templates, guides, and resources',
          icon: 'Archive',
          path: '/global/resources',
          category: 'administrative',
          available_to: { all_departments: true, universal_access: true }
        },
        {
          id: 'feedback',
          title: 'Feedback & Suggestions',
          description: 'Submit ideas and feedback to leadership',
          icon: 'MessageSquare',
          path: '/global/feedback',
          category: 'communication',
          available_to: { all_departments: true, universal_access: true }
        }
      ];

      // Admin menus (only for system admins)
      const adminMenus = isAdmin ? [
        {
          id: 'administration',
          title: 'Administration',
          icon: 'Settings',
          position_levels: ['executive'],
          children: [
            { id: 'user-management', title: 'User Management', path: '/admin/users', permissions_required: [{ module: 'users', permissions: [{ codename: 'view_user' }] }] },
            { id: 'role-management', title: 'Role Management', path: '/admin/roles', permissions_required: [{ module: 'auth', permissions: [{ codename: 'view_role' }] }] },
            { id: 'system-config', title: 'System Configuration', path: '/admin/config', permissions_required: [{ module: 'config', permissions: [{ codename: 'view_configuration' }] }] }
          ]
        }
      ] : [];

      return {
        department_menus: departmentMenus,
        global_hub_items: globalHubItems.filter(item =>
          item.available_to.all_departments && (
            item.available_to.universal_access === true ||
            (item.available_to.position_levels && item.available_to.position_levels.includes(positionLevel))
          )
        ),
        quick_actions: getQuickActionsForUser(),
        admin_menus: adminMenus
      };
    };

    // Quick actions based on department and permissions
    const getQuickActionsForUser = () => {
      const actions = [];
      const department = orgUser.department?.code || 'default';

      // Department-specific quick actions
      if (department === 'PROG') {
        if (canCreateInModule('programs')) {
          actions.push(
            { id: 'create-workplan', title: 'Create Workplan', description: 'Start a new program workplan', icon: 'Plus', path: '/programs/workplans/create', department: 'PROG' },
            { id: 'create-fund-request', title: 'Fund Request', description: 'Request project funding', icon: 'DollarSign', path: '/programs/fund-requests/create', department: 'PROG' }
          );
        }
      }

      if (department === 'HR') {
        if (canCreateInModule('hr')) {
          actions.push(
            { id: 'leave-request', title: 'Leave Request', description: 'Apply for time off', icon: 'Calendar', path: '/hr/leave-requests/create', department: 'HR' },
            { id: 'timesheet-entry', title: 'Timesheet', description: 'Record work hours', icon: 'Clock', path: '/hr/timesheet/create', department: 'HR' }
          );
        }
      }

      // Universal quick actions (available to all)
      actions.push(
        { id: 'update-profile', title: 'Update Profile', description: 'Edit your profile information', icon: 'User', path: '/profile/edit' },
        { id: 'help-center', title: 'Get Help', description: 'Access support resources', icon: 'HelpCircle', path: '/help' }
      );

      return actions;
    };

    // Accessible locations based on user's position and department
    const getAccessibleLocations = () => {
      if (orgUser.is_superuser || orgUser.position?.level === 'executive') {
        return 'all'; // All locations
      }
      if (orgUser.position?.level === 'director') {
        return 'region'; // Regional access
      }
      return 'location'; // Only current location
    };

    // Accessible departments based on user's position
    const getAccessibleDepartments = () => {
      if (orgUser.is_superuser || orgUser.position?.level === 'executive') {
        return 'all'; // All departments
      }
      if (orgUser.position?.level === 'director') {
        return 'multiple'; // Can see some other departments
      }
      return 'own'; // Only own department
    };

    // Organizational context for hierarchy-based features
    const organizationalContext: IOrganizationalContext = {
      user: orgUser,
      hierarchy: {
        supervisor: orgUser.supervisor || null,
        peers: [],
        direct_reports: [],
        department_head: null,
        location_head: null
      },
      access_levels: {
        can_view_department_data: canViewModule('any', 'department'),
        can_view_location_data: canViewModule('any', 'location'),
        can_view_global_data: canViewModule('any', 'global'),
        can_approve_department_requests: canApproveInModule('any', 'department'),
        can_authorize_financial: canAuthorizeInModule('finance'),
        financial_approval_limit: orgUser.position?.financial_approval_limit || 0
      }
    };

    return {
      // Core access functions
      hasAccess,
      canViewModule,
      canCreateInModule,
      canEditInModule,
      canApproveInModule,
      canAuthorizeInModule,

      // Configuration functions
      getDashboardConfig,
      getMenuStructure,
      getAccessibleLocations,
      getAccessibleDepartments,

      // State
      isAuthenticated: true,
      loading: false,
      user: orgUser,
      organizationalContext
    };

  }, [user, isAuthenticated, loading]);
}
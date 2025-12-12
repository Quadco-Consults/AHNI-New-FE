/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import logoSvg from "@/assets/svgs/logo-bg.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowLeft, Menu } from 'lucide-react';
import { Icon } from "@iconify/react";
import { cn } from "lib/utils";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

import DashboardIcon from "components/icons/sidebar-icons/DashboardIcon";
import ProjectsIcon from "components/icons/sidebar-icons/ProjectsIcon";

import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { 
  departmentalLinks, 
  globalHubLinks, 
  moduleLinks,
  globalHubCategories,
  SidebarItem 
} from "@/utils/sidebarItems";
import {
  groupGlobalHubByCategory
} from "@/utils/sidebarPermissions";
// UNIFIED IMPORTS - New single permission system
import { useUnifiedPermissions } from "@/hooks/useUnifiedPermissions";
import { useDepartmentFeatures } from "@/hooks/useDepartmentFeatures";
import { useAppSelector } from "@/store/hooks";

type SidebarProps = {
  sidebarWidth: boolean;
  setSidebarWidth: any;
};

const Sidebar = ({ sidebarWidth, setSidebarWidth }: SidebarProps) => {
  // UNIFIED PERMISSION SYSTEM - Single source of truth
  const {
    hasPermission,
    isAdmin,
    isLoading: permissionsLoading,
    user
  } = useUnifiedPermissions();

  const authState = useAppSelector(state => state.auth);
  const pathname = usePathname();

  // Get permission count from auth state for more permissive filtering
  const permissionCount = authState.permissions?.length || 0;

  // Department-based features
  const {
    userDepartment,
    hasEmployeeProfile,
    canAccessProgramsFeatures,
    canAccessContractsGrantsFeatures,
    canAccessHRFeatures,
    canAccessFinanceFeatures,
    canAccessAdminFeatures,
    canAccessProcurementFeatures,
    getDepartmentFeatures,
    getDepartmentTheme
  } = useDepartmentFeatures();

  // Debug permission state (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 UNIFIED SIDEBAR - ERP User Lifecycle:', {
      isAuthenticated: authState.isAuthenticated,
      isAdmin: isAdmin,
      isLoading: permissionsLoading,
      hasUser: !!user,
      workflow: 'Create User → Global Hub Access → Role Assignment → Departmental Menus',
      approach: 'Universal Global Hub + Role-based Departmental Access'
    });
  }

  // State for collapsible sections
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<null | number>(null);
  const [showDepartmentalMenu, setShowDepartmentalMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedSubIndex, setSelectedSubIndex] = useState<null | number>(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showGlobalHubMenu, setShowGlobalHubMenu] = useState(false);
  const [selectedGlobalHubCategory, setSelectedGlobalHubCategory] = useState<string | null>(null);
  const [showGlobalHubSection, setShowGlobalHubSection] = useState(true);

  // Hydration state management
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Department-based access mapping using new hook
  const getDepartmentAccess = () => {
    const features = getDepartmentFeatures();
    const accessMap: string[] = [];

    if (features.programs) accessMap.push('Programs');
    if (features.contractsGrants) accessMap.push('C&G');
    if (features.hr) accessMap.push('HR');
    if (features.finance) accessMap.push('Finance');
    if (features.admin) accessMap.push('Admin');
    if (features.procurement) accessMap.push('Procurement Management');

    // UNIVERSAL ACCESS - All authenticated AHNI employees get access to all Global Hub categories
    // This includes both organizational and departmental Global Hub items
    if (user && authState.isAuthenticated) {
      accessMap.push('Global Hub');
      accessMap.push('Communication');
      accessMap.push('Organization');
      accessMap.push('Programs & Planning');
      accessMap.push('Procurement & Purchasing');
      accessMap.push('Inventory Management');
      accessMap.push('Fleet & Transport');
      accessMap.push('Maintenance');
      accessMap.push('Financial Services');
      accessMap.push('Contracts & Reports');
      accessMap.push('Staff Self-Service');
      accessMap.push('Support');
    }

    if (features.leave) accessMap.push('Leave Management');
    if (features.itemRequisition) accessMap.push('Item Requisition');
    if (features.travelExpense) accessMap.push('Travel Expense');

    return accessMap;
  };

  // Helper function to check if we're in a department hierarchy for any officer role
  const isInDepartmentHierarchy = (parentDepartment?: string, userPosition?: string): boolean => {
    if (!parentDepartment || !userPosition) return false;

    // Define department hierarchies for each officer type
    const departmentHierarchies: Record<string, { mainDepartment: string; subDepartments: string[] }> = {
      'Program Officer': {
        mainDepartment: 'Programs',
        subDepartments: ['Plans', 'Stakeholder Management', 'Adhoc Management', 'Fund Request', 'Reports']
      },
      'Program Admin': {
        mainDepartment: 'Programs',
        subDepartments: ['Plans', 'Stakeholder Management', 'Adhoc Management', 'Fund Request', 'Reports']
      },
      'HR Officer': {
        mainDepartment: 'HR',
        subDepartments: [
          'Employee Management', 'Leave Management', 'Performance Management', 'Training & Development',
          'Recruitment', 'Employee compensation & benefits', 'Separation Management', 'Grievance Management',
          'Timesheet Management', 'Compliance & Audit', 'Employee Relations', 'HR Reports'
        ]
      },
      'HR Manager': {
        mainDepartment: 'HR',
        subDepartments: [
          'Employee Management', 'Leave Management', 'Performance Management', 'Training & Development',
          'Recruitment', 'Employee compensation & benefits', 'Separation Management', 'Grievance Management',
          'Timesheet Management', 'Compliance & Audit', 'Employee Relations', 'HR Reports'
        ]
      },
      'Procurement Officer': {
        mainDepartment: 'Procurement Management',
        subDepartments: ['Purchase Requests', 'Vendor Management', 'Contract Management', 'Procurement Tracker', 'Asset Management']
      },
      'Admin Officer': {
        mainDepartment: 'Admin',
        subDepartments: ['Asset Management', 'Store Management', 'Vehicle Management', 'Facility Management', 'Travel Management']
      },
      'Finance Officer': {
        mainDepartment: 'Finance',
        subDepartments: [
          'Budget Management', 'Expense Management', 'Financial Reporting', 'Audit', 'Accounts',
          'Financial Classifications', 'Chart of Accounts', 'Bank Accounts', 'Journal Entries',
          'Financial Reports', 'Bank Reconciliation', 'Expense Tracking', 'Budget Reports', 'Petty Cash'
        ]
      },
      'Finance Manager': {
        mainDepartment: 'Finance',
        subDepartments: [
          'Budget Management', 'Expense Management', 'Financial Reporting', 'Audit', 'Accounts',
          'Financial Classifications', 'Chart of Accounts', 'Bank Accounts', 'Journal Entries',
          'Financial Reports', 'Bank Reconciliation', 'Integration Dashboard', 'Financial Analysis',
          'QuickBooks Settings', 'QuickBooks Sync', 'Customer Management', 'Invoicing & Billing',
          'Sales Orders', 'Accounts Receivable', 'Tax Management', 'Accounts Payable',
          'Fixed Assets', 'Expense Tracking', 'Budget Reports', 'Petty Cash', 'Travel Reconciliation'
        ]
      }
    };

    const hierarchy = departmentHierarchies[userPosition];
    if (!hierarchy) return false;

    // Check if it's the direct department or a sub-department
    if (parentDepartment === hierarchy.mainDepartment) return true;
    return hierarchy.subDepartments.includes(parentDepartment);
  };

  // Enhanced menu filtering function with department-based safety layer
  const filterMenuItems = (items: SidebarItem[], isChild: boolean = false, parentDepartment?: string): SidebarItem[] => {
    return items.filter(item => {
      // Get user's allowed departments based on their department and role
      const allowedDepartments = getDepartmentAccess();

      // Show employee profile warning if needed
      if (!hasEmployeeProfile && process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Employee profile not set up - limited menu access');
      }

      // Department-based filtering logic
      let departmentBasedAccess = false;

      if (isChild && parentDepartment) {
        // SUPERUSER OVERRIDE: Admins get access to everything
        if (isAdmin || user?.is_superuser) {
          departmentBasedAccess = true;
        } else {
          // For child items, check if parent department is allowed OR if we're in department hierarchy
          const directParentAllowed = allowedDepartments.includes(parentDepartment);
          const departmentHierarchyAllowed = isInDepartmentHierarchy(parentDepartment, user?.position?.title || '');

          // Enhanced logic for nested children (children of children)
          // Check if this is a nested child under the user's department
          const isNestedCGChild = (parentDepartment === 'Contract Management' || parentDepartment === 'Sub Grants' ||
            parentDepartment === 'Closeout') && canAccessContractsGrantsFeatures;
          const isNestedProgramsChild = (parentDepartment === 'Plans' || parentDepartment === 'Stakeholder Management' ||
            parentDepartment === 'Fund Request' || parentDepartment === 'Adhoc Management') && canAccessProgramsFeatures;
          const isNestedProcurementChild = (parentDepartment === 'Purchase Request' || parentDepartment === 'Vendor Management') && canAccessProcurementFeatures;
          // Enhanced nested finance child check - includes ALL 22 finance submenu items
          const financeSubmenus = [
            'Financial Classifications', 'Chart of Accounts', 'Bank Accounts', 'Journal Entries',
            'Financial Reports', 'Bank Reconciliation', 'Integration Dashboard', 'Financial Analysis',
            'QuickBooks Settings', 'QuickBooks Sync', 'Customer Management', 'Invoicing & Billing',
            'Sales Orders', 'Accounts Receivable', 'Tax Management', 'Accounts Payable',
            'Fixed Assets', 'Expense Tracking', 'Budget Reports', 'Petty Cash', 'Travel Reconciliation'
          ];
          const isNestedFinanceChild = (financeSubmenus.includes(parentDepartment) || parentDepartment === 'Finance') && canAccessFinanceFeatures;

          // Enhanced nested HR child check - includes ALL HR sub-sections
          const hrSubmenus = [
            'Employee Management', 'Leave Management', 'Performance Management', 'Training & Development',
            'Recruitment', 'Employee compensation & benefits', 'Separation Management', 'Grievance Management',
            'Timesheet Management', 'Compliance & Audit', 'Employee Relations', 'HR Reports'
          ];
          const isNestedHRChild = (hrSubmenus.includes(parentDepartment) || parentDepartment === 'HR') && canAccessHRFeatures;

          departmentBasedAccess = allowedDepartments.length === 0 || directParentAllowed || departmentHierarchyAllowed ||
            isNestedCGChild || isNestedProgramsChild || isNestedProcurementChild || isNestedFinanceChild || isNestedHRChild;
        }
      } else {
        // SUPERUSER OVERRIDE: Admins get access to everything
        if (isAdmin || user?.is_superuser) {
          departmentBasedAccess = true;
        } else {
          // For top-level items, check if this department is allowed
          // Be more permissive if user is authenticated but has low permissions (common for departmental officers)
          departmentBasedAccess = allowedDepartments.length === 0 || allowedDepartments.includes(item.name) ||
            (authState.isAuthenticated && (allowedDepartments.includes('Global Hub') || userDepartment)) ||
            // Special finance user override - email-based finance users should access Finance department
            (item.name === 'Finance' && user?.email?.toLowerCase().includes('finance')) ||
            // Special HR user override - email-based HR users should access HR department
            (item.name === 'HR' && user?.email?.toLowerCase().includes('hr')) ||
            // TEMPORARY DEBUG: Force HR access for testing
            (item.name === 'HR');
        }
      }

      // Permission-based access - be more permissive for departmental officers with 0 permissions
      // Also handle case when permissions are still loading
      const permissionBasedAccess =
        // SUPERUSER OVERRIDE: Admins get access to everything
        (isAdmin || user?.is_superuser) ||
        // No specific permissions required
        (!item.permissions || item.permissions.length === 0) ||
        // User has required permissions
        hasPermission(item.permissions) ||
        // REMOVED: Zero permissions should not grant full access
        // (authState.isAuthenticated && permissionCount === 0) ||
        // Special finance user override - email-based finance users should access Finance module
        (item.name === 'Finance' && user?.email?.toLowerCase().includes('finance')) ||
        // Special HR user override - email-based HR users should access HR module
        (item.name === 'HR' && user?.email?.toLowerCase().includes('hr')) ||
        // REMOVED: These forced HR overrides granted access to all users
        // (item.name === 'HR') ||
        // (item.name?.includes('Employee Management')) ||
        // (item.name?.includes('Recruitment')) ||
        // (item.name?.includes('Performance Management')) ||
        // (item.name?.includes('Timesheet Management')) ||
        // (item.name?.includes('compensation')) ||
        // If permissions are still loading but user is authenticated, be more permissive
        (permissionsLoading && authState.isAuthenticated && user);

      // Get user position for department hierarchy checks
      const userPosition = user?.position?.title || '';

      // Special handling for Department Officers - if they can access their department hierarchy,
      // they should see the main functional sub-menus even if specific permissions are missing
      let adjustedPermissionAccess = permissionBasedAccess;

      // SUPERUSER OVERRIDE: Admins get access to everything
      if (isAdmin || user?.is_superuser || user?.is_staff) {
        adjustedPermissionAccess = true;
      } else if (isChild && isInDepartmentHierarchy(parentDepartment, userPosition)) {
        // For department hierarchy (including sub-departments), be more permissive for department officers
        const isDepartmentOfficer = ['Program Officer', 'Program Admin', 'HR Officer', 'HR Manager', 'Procurement Officer', 'Admin Officer', 'Finance Officer', 'Finance Manager'].includes(userPosition);
        if (isDepartmentOfficer) {
          adjustedPermissionAccess = true; // Allow access to all department sub-menus and their children
        }
      }

      // Enhanced child menu access for departmental officers with their own department
      if (isChild && parentDepartment) {
        // SUPERUSER OVERRIDE: Admins get access to everything (already handled above, but keeping for clarity)
        if (!(isAdmin || user?.is_superuser)) {
          // Check if this is the user's own department
          const isOwnDepartment = (parentDepartment === 'C&G' && canAccessContractsGrantsFeatures) ||
            (parentDepartment === 'Programs' && canAccessProgramsFeatures) ||
            (parentDepartment === 'HR' && canAccessHRFeatures) ||
            (parentDepartment === 'Finance' && canAccessFinanceFeatures) ||
            (parentDepartment === 'Admin' && canAccessAdminFeatures) ||
            (parentDepartment === 'Procurement Management' && canAccessProcurementFeatures);

          // More permissive logic for departmental officers - remove permission count restriction
          if (isOwnDepartment) {
            adjustedPermissionAccess = true; // Allow all child items for department officers in their own department
          }

          // Special Finance department override - be even more permissive for Finance users
          if (parentDepartment === 'Finance' && (canAccessFinanceFeatures || user?.email?.toLowerCase().includes('finance'))) {
            adjustedPermissionAccess = true;
          }

          // Special HR department override - be even more permissive for HR users and managers
          const hrSubmenus = [
            'Employee Management', 'Leave Management', 'Performance Management', 'Training & Development',
            'Recruitment', 'Compensation & Benefits', 'Separation Management', 'Grievance Management',
            'Timesheet Management', 'Compliance & Audit', 'Employee Relations', 'HR Reports'
          ];
          if ((parentDepartment === 'HR' || hrSubmenus.includes(parentDepartment)) && (canAccessHRFeatures || user?.email?.toLowerCase().includes('hr'))) {
            adjustedPermissionAccess = true;
          }

          // TEMPORARY DEBUG: Force HR child access for testing
          if (parentDepartment === 'HR' || hrSubmenus.includes(parentDepartment)) {
            adjustedPermissionAccess = true;
          }
        }
      }

      // Combined access: Must pass BOTH department and permission checks
      const finalAccess = departmentBasedAccess && adjustedPermissionAccess;

      // Debug individual permission checks
      if (process.env.NODE_ENV === 'development') {
        const isImportantItem = item.name.includes('Global') || item.name.includes('C&G') ||
          item.name === 'Communication' || item.name === 'Organization' ||
          item.name === 'Programs' || item.name === 'C ANG G' ||
          item.name === 'Finance' || item.name === 'Settings' ||
          item.name === 'Access Management'; // Add Settings/Access Management to debug

        if (isImportantItem || !finalAccess || isChild) {
          console.log(`🔍 ENHANCED Department Check: "${item.name}"`, {
          isChild: isChild,
          parentDepartment: parentDepartment,
          userPosition: userPosition,
          allowedDepartments: allowedDepartments,
          departmentBasedAccess: departmentBasedAccess,
          directParentAllowed: isChild && parentDepartment ? allowedDepartments.includes(parentDepartment) : 'N/A',
          departmentHierarchyAllowed: isChild && parentDepartment ? isInDepartmentHierarchy(parentDepartment, userPosition) : 'N/A',
          permissionBasedAccess: permissionBasedAccess,
          adjustedPermissionAccess: adjustedPermissionAccess,
          finalAccess: finalAccess,
          departmentOfficerOverride: isChild && isInDepartmentHierarchy(parentDepartment, userPosition) && ['Program Officer', 'Program Admin', 'HR Officer', 'HR Manager', 'Procurement Officer', 'Admin Officer', 'Finance Officer', 'Finance Manager'].includes(userPosition),
          departmentHierarchyCheck: isInDepartmentHierarchy(parentDepartment, userPosition),
          // Finance-specific debugging
          isFinanceItem: item.name === 'Finance',
          userEmailContainsFinance: user?.email?.toLowerCase().includes('finance'),
          canAccessFinanceFeatures: canAccessFinanceFeatures,
          financeEmailOverride: item.name === 'Finance' && user?.email?.toLowerCase().includes('finance'),
          reason: !departmentBasedAccess
            ? `Role "${userPosition}" not allowed for ${isChild ? 'parent department' : 'department'} "${isChild ? parentDepartment : item.name}"`
            : !adjustedPermissionAccess
            ? 'User lacks required permissions (after adjustment)'
            : 'Both role and permissions allow access'
        });
        }
      }

      return finalAccess;
    }).map(item => {
      const filteredChildren = item.children ? filterMenuItems(item.children, true, item.name) : undefined;

      // Debug logging for Finance menu children specifically
      if (process.env.NODE_ENV === 'development' && item.name === 'Finance') {
        console.log('🏦 FINANCE CHILDREN FILTERING DEBUG:', {
          originalChildrenCount: item.children?.length || 0,
          filteredChildrenCount: filteredChildren?.length || 0,
          originalChildren: item.children?.map(c => c.name) || [],
          filteredChildren: filteredChildren?.map(c => c.name) || [],
          userEmail: user?.email,
          canAccessFinanceFeatures: canAccessFinanceFeatures
        });
      }

      // Debug logging for Settings menu children specifically
      if (process.env.NODE_ENV === 'development' && (item.name === 'Settings' || item.name === 'Access Management')) {
        console.log(`⚙️ SETTINGS CHILDREN FILTERING DEBUG: "${item.name}"`, {
          originalChildrenCount: item.children?.length || 0,
          filteredChildrenCount: filteredChildren?.length || 0,
          originalChildren: item.children?.map(c => c.name) || [],
          filteredChildren: filteredChildren?.map(c => c.name) || [],
          userEmail: user?.email,
          isAdmin: isAdmin,
          userIsSuperuser: user?.is_superuser,
          userIsStaff: user?.is_staff,
          willBeRemoved: item.children && filteredChildren?.length === 0,
          itemPermissions: item.permissions || 'none'
        });
      }

      return {
        ...item,
        children: filteredChildren
      };
    }).filter(item => {
      // Keep items that either have no children or have visible children
      return !item.children || item.children.length > 0;
    });
  };

  // UNIFIED FILTERING - Single permission system
  const filteredDepartmentalLinks = useMemo(() => {
    // Enhanced debugging for authentication state
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 DEPARTMENTAL LINKS FILTERING:', {
        isHydrated,
        permissionsLoading,
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!user,
        userEmail: user?.email,
        userPosition: user?.position?.name || user?.position?.title,
        userDepartment: userDepartment,
        canAccessFinanceFeatures: canAccessFinanceFeatures,
        willShowDepartmentalLinks: isHydrated && !permissionsLoading && authState.isAuthenticated
      });
    }

    // More permissive loading logic - if user is authenticated and hydrated,
    // allow department links to show even if permissions are still loading
    const hasBasicAuth = authState.isAuthenticated && !!user;
    const canShowLinks = isHydrated && hasBasicAuth;

    if (!canShowLinks) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ DEPARTMENTAL LINKS BLOCKED:', {
          reason: !isHydrated ? 'Not hydrated' :
                  !authState.isAuthenticated ? 'Not authenticated' :
                  !user ? 'No user data' :
                  'Unknown',
          isHydrated,
          permissionsLoading,
          isAuthenticated: authState.isAuthenticated,
          hasUser: !!user
        });
      }
      return [];
    }

    // First filter by department - users should only see their own department unless admin
    const departmentFiltered = departmentalLinks.filter(item => {
      // Admins can see all departments
      if (isAdmin || user?.is_superuser) {
        return true;
      }

      // Map user's department to departmental sections
      const userDept = userDepartment?.toUpperCase() || user?.department?.name?.toUpperCase();

      // Department mapping
      const departmentMapping = {
        'PROGRAMS': ['Programs'],
        'PROCUREMENT': ['Procurement Management'],
        'HR': ['HR'],
        'HUMAN RESOURCES': ['HR'],
        'FINANCE': ['Finance'],
        'CONTRACT & GRANTS': ['C&G'],
        'CONTRACTS & GRANTS': ['C&G'],
        'ADMIN': ['Admin'],
        'ADMINISTRATION': ['Admin']
      };

      const allowedDepartments = departmentMapping[userDept] || [];

      // Allow if item matches user's department
      return allowedDepartments.includes(item.name);
    });

    // Then apply permission filtering
    const filtered = filterMenuItems(departmentFiltered);

    // Debug logging (development only) - Check departmental filtering
    if (process.env.NODE_ENV === 'development') {
      console.log('🏢 DEPARTMENTAL FILTERING Debug:', {
        userType: isAdmin ? 'Admin' : 'Regular User',
        userPosition: user?.position?.title,
        userDepartment: userDepartment,
        backendDepartment: user?.department?.name,
        originalDepartments: departmentalLinks.map(item => item.name),
        departmentFilteredDepartments: departmentFiltered.map(item => item.name),
        finalFilteredDepartments: filtered.map(item => item.name),
        departmentAccessRule: 'Department Officers should see only their assigned department menu',
        detailedResults: filtered.map(item => ({
          name: item.name,
          hasChildren: !!item.children,
          childrenCount: item.children?.length || 0
        }))
      });
    }

    return filtered;
  }, [
    isHydrated,
    permissionsLoading,
    authState.isAuthenticated,
    departmentalLinks,
    hasPermission,
    userDepartment,
    canAccessContractsGrantsFeatures,
    canAccessProgramsFeatures,
    canAccessHRFeatures,
    canAccessFinanceFeatures,
    canAccessAdminFeatures,
    canAccessProcurementFeatures
  ]);

  const filteredModuleLinks = useMemo(() => {
    const hasBasicAuth = authState.isAuthenticated && !!user;
    const canShowLinks = isHydrated && hasBasicAuth;

    if (!canShowLinks) {
      return [];
    }

    const filtered = filterMenuItems(moduleLinks);

    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 UNIFIED Module Links Filtering:', {
        originalCount: moduleLinks.length,
        filteredCount: filtered.length,
        isAdmin: isAdmin,
        filteredItems: filtered.map(item => item.name),
        userEmail: user?.email,
        userIsSuperuser: user?.is_superuser,
        userIsStaff: user?.is_staff,
        permissionCount: authState.permissions?.length || 0,
        settingsMenuVisible: filtered.some(item => item.name === 'Settings'),
        accessManagementPermissions: {
          hasViewUser: hasPermission([{ module: "users", codenames: ["view_user"], requireAll: false }]),
          hasChangeUser: hasPermission([{ module: "users", codenames: ["change_user"], requireAll: false }]),
          hasViewRole: hasPermission([{ module: "authorization", codenames: ["view_role"], requireAll: false }]),
          hasViewPermission: hasPermission([{ module: "authorization", codenames: ["view_permission"], requireAll: false }])
        }
      });
    }

    return filtered;
  }, [isHydrated, permissionsLoading, authState.isAuthenticated, moduleLinks, hasPermission, isAdmin]);

  const filteredGlobalHubItems = useMemo(() => {
    const hasBasicAuth = authState.isAuthenticated && !!user;
    const canShowLinks = isHydrated && hasBasicAuth;

    if (!canShowLinks) {
      return [];
    }

    // UNIVERSAL GLOBAL HUB - All authenticated users get Global Hub access immediately
    // This implements proper ERP user lifecycle: Create User → Global Hub → Role Assignment → Departmental Access
    const mapped = globalHubLinks.map(item => ({
      ...item,
      // Convert GlobalHubItem to match expected format
      permissions: item.permissions || undefined
    }));

    const filtered = mapped.filter(item => {
      // UNIVERSAL GLOBAL HUB ACCESS: All Global Hub items are accessible to ALL AHNI employees
      // regardless of department, role, or permissions for cross-departmental requests
      return true; // Show all Global Hub items to all authenticated AHNI employees
    });

    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 UNIVERSAL GLOBAL HUB - All AHNI Employees:', {
        policy: 'ALL Global Hub items accessible to ALL authenticated AHNI employees for cross-departmental requests',
        originalCount: globalHubLinks.length,
        totalVisibleItems: filtered.length,
        accessLevel: 'Universal - No restrictions based on department or role',
        userType: isAdmin ? 'Admin' : 'Regular Employee',
        allItemsVisible: filtered.length === globalHubLinks.length
      });
    }

    return filtered;
  }, [isHydrated, permissionsLoading, authState.isAuthenticated, globalHubLinks, hasPermission]);

  const groupedGlobalHubMenu = useMemo(
    () => groupGlobalHubByCategory(filteredGlobalHubItems, globalHubCategories),
    [filteredGlobalHubItems]
  );

  const userHasGlobalHubAccess = useMemo(() => {
    const hasBasicAuth = authState.isAuthenticated && !!user;

    if (!isHydrated) return false;

    // Global Hub access is universal for all authenticated users
    return hasBasicAuth;
  }, [isHydrated, authState.isAuthenticated, user]);

  // Render nested sidebar items recursively
  const renderSidebarItem = (
    item: SidebarItem,
    index: number,
    isSubItem: boolean = false,
    level: number = 0
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && pathname?.startsWith(item.path);
    const paddingLeft = level === 0 ? "pl-2" : level === 1 ? "pl-14" : "pl-20";

    return (
      <div key={index} className="w-full">
        {/* Item header/link */}
        <div
          onClick={() => {
            if (hasChildren) {
              if (level === 0) {
                setShowDepartmentalMenu(!showDepartmentalMenu);
                setSelectedLinkIndex(index);
              } else {
                setShowSubMenu(!showSubMenu);
                setSelectedSubIndex(index);
              }
            }
          }}
          className={cn(
            "flex w-full items-center justify-between gap-3 py-2 text-sm font-bold hover:cursor-pointer",
            paddingLeft,
            isActive && "text-primary",
            !isActive && "hover:text-primary"
          )}
        >
          {item.path && !hasChildren ? (
            <Link href={item.path} className="flex w-full items-center justify-between gap-3">
              <div className="flex w-[85%] items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  {item.name}
                </h4>
              </div>
            </Link>
          ) : (
            <>
              <div className="flex w-[85%] items-center gap-2">
                {!isSubItem && item.icon && <span>{item.icon}</span>}
                {isSubItem && (
                  <span
                    className={cn(
                      "aspect-square w-2 rounded-full border",
                      isActive 
                        ? "bg-amber-400 border-amber-400" 
                        : "bg-black hover:bg-amber-400"
                    )}
                  ></span>
                )}
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden",
                    isSubItem && isActive && "text-amber-400"
                  )}
                >
                  {item.name}
                </h4>
              </div>
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "h-5 w-5 -rotate-90 transition duration-200",
                    level === 0 && showDepartmentalMenu && selectedLinkIndex === index && "rotate-0",
                    level === 1 && showSubMenu && selectedSubIndex === index && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>

        {/* Children */}
        {hasChildren && (
          <motion.ul
            animate={
              (level === 0 && showDepartmentalMenu && selectedLinkIndex === index) ||
              (level === 1 && showSubMenu && selectedSubIndex === index)
                ? { height: "fit-content" }
                : { height: 0 }
            }
            className="h-0 overflow-hidden list-none"
          >
            {item.children!.map((child, childIndex) =>
              renderSidebarItem(child, childIndex, true, level + 1)
            )}
          </motion.ul>
        )}
      </div>
    );
  };

  // State for nested settings menu
  const [selectedSettingsSubIndex, setSelectedSettingsSubIndex] = useState<null | number>(null);
  const [showSettingsSubMenu, setShowSettingsSubMenu] = useState(false);

  // Render settings items with support for deep nesting
  const renderSettingsItem = (item: SidebarItem, index: number, level: number = 0, parentIndex?: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && pathname?.startsWith(item.path);
    const paddingLeft = level === 0 ? "px-2" : level === 1 ? "pl-14" : "pl-20";

    // Handle state management for different levels
    const isExpanded = level === 0
      ? showSettingsMenu && selectedLinkIndex === index
      : showSettingsSubMenu && selectedSettingsSubIndex === index;

    const handleClick = () => {
      if (hasChildren) {
        if (level === 0) {
          setShowSettingsMenu(!showSettingsMenu);
          setSelectedLinkIndex(index);
        } else {
          setShowSettingsSubMenu(!showSettingsSubMenu);
          setSelectedSettingsSubIndex(index);
        }
      }
    };

    return (
      <div key={index} className="w-full">
        <div
          onClick={handleClick}
          className={cn(
            "hover:text-primary flex w-full items-center justify-between gap-3 py-2 text-sm font-bold hover:cursor-pointer",
            paddingLeft,
            isActive && "text-primary"
          )}
        >
          {item.path && !hasChildren ? (
            <Link href={item.path} className="flex w-full items-center justify-between gap-3">
              <div className="flex w-[85%] items-center gap-2">
                {level === 0 && <span>{item.icon}</span>}
                {level > 0 && (
                  <span
                    className={cn(
                      "aspect-square w-2 rounded-full border",
                      isActive
                        ? "bg-amber-400 border-amber-400"
                        : "bg-black hover:bg-amber-400"
                    )}
                  ></span>
                )}
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  {item.name}
                </h4>
              </div>
            </Link>
          ) : (
            <>
              <div className="flex w-[85%] items-center gap-2">
                {level === 0 && <span>{item.icon}</span>}
                {level > 0 && (
                  <span
                    className={cn(
                      "aspect-square w-2 rounded-full border",
                      isActive
                        ? "bg-amber-400 border-amber-400"
                        : "bg-black hover:bg-amber-400"
                    )}
                  ></span>
                )}
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  {item.name}
                </h4>
              </div>
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "h-5 w-5 -rotate-90 transition duration-200",
                    isExpanded && "rotate-0"
                  )}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>

        {hasChildren && (
          <motion.ul
            animate={
              isExpanded
                ? { height: "fit-content" }
                : { height: 0 }
            }
            className="h-0 overflow-hidden list-none"
          >
            {item.children!.map((child, childIndex) =>
              renderSettingsItem(child, childIndex, level + 1, index)
            )}
          </motion.ul>
        )}
      </div>
    );
  };

  // Show loading skeleton during hydration
  if (!isHydrated) {
    return (
      <aside
        className={cn(
          "bg-background fixed inset-0 z-[20] min-h-screen overflow-auto pb-[4rem] duration-200",
          sidebarWidth === false ? "w-[19%]" : "w-[5%]"
        )}
      >
        <section className="flex flex-col w-full gap-2">
          {/* Logo section - always show */}
          <div className="relative h-[5rem] overflow-hidden">
            <div
              className={cn(
                "bg-background z-20 mx-auto duration-200",
                sidebarWidth === false ? "w-[100%]" : "w-[0%]"
              )}
            >
              <img
                src={logoSvg.src}
                alt="logo"
                className={cn(
                  "mx-auto h-[4rem] w-auto pt-2",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              />
            </div>
            <IconButton
              icon="solar:sidebar-minimalistic-line-duotone"
              onClick={() => setSidebarWidth(!sidebarWidth)}
              className={cn(
                "text-foreground/80 absolute bottom-2 z-30 scale-75",
                sidebarWidth === false ? "right-2" : "right-1"
              )}
            />
          </div>

          {/* Loading skeleton */}
          <div className="px-4 space-y-2">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          </div>
        </section>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "bg-background fixed inset-0 z-[20] min-h-screen overflow-auto pb-[4rem] duration-200",
        sidebarWidth === false ? "w-[19%]" : "w-[5%]"
      )}
    >
      <section className="flex flex-col w-full gap-2">
        {/* Logo and collapse button */}
        <div className="relative h-[5rem] overflow-hidden">
          <div
            className={cn(
              "bg-background z-20 mx-auto duration-200",
              sidebarWidth === false ? "w-[100%]" : "w-[0%]"
            )}
          >
            <img
              src={logoSvg.src}
              alt="logo"
              className="object-cover w-24 mx-auto"
            />
            <IconButton
              onClick={() => setSidebarWidth(!sidebarWidth)}
              className={cn(
                "hover:text-primary absolute right-0 top-5 z-40 shadow-sm",
                sidebarWidth && "right-3 rotate-180 duration-200"
              )}
            >
              <ArrowLeft size={16} />
            </IconButton>
          </div>
        </div>

        <div className="px-2 pt-5 space-y-6">
          {/* Dashboard button - always visible */}
          <Link
            href="/dashboard"
            className={cn(
              "flex w-full items-center justify-start gap-3 rounded-lg p-3",
              pathname === "/dashboard"
                ? "bg-primary text-white hover:opacity-70"
                : "bg-inherit hover:bg-primary hover:text-white"
            )}
          >
            <DashboardIcon />
            <h4
              className={cn(
                "font-semibold duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              Dashboard
            </h4>
          </Link>

          {/* Departmental Hub - Show when user has role/department assignments */}
          {filteredDepartmentalLinks.length > 0 && (
            <div>
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                DEPARTMENTAL HUB
              </h4>

              {/* Projects - show based on role assignments */}
              <Link
                href="/dashboard/projects"
                className={cn(
                  "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                  pathname?.startsWith("/dashboard/projects") && "text-primary"
                )}
              >
                <div className="flex w-[85%] items-center gap-2">
                  <ProjectsIcon />
                  <h4
                    className={cn(
                      "w-[100%] truncate font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    Projects
                  </h4>
                </div>
              </Link>

              {/* Filtered departmental links */}
              {filteredDepartmentalLinks.map((link, index) =>
                renderSidebarItem(link, index)
              )}
            </div>
          )}

          {/* Settings/Modules */}
          {filteredModuleLinks.length > 0 && (
            <div>
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                SETTINGS
              </h4>

              {filteredModuleLinks.map((link, index) =>
                renderSettingsItem(link, index, 0)
              )}

              {/* Audit Log - only show to users with admin permissions */}
              {hasPermission([
                {
                  module: "admin",
                  codenames: ["view_auditlog"],
                  requireAll: false
                }
              ]) && (
                <Link
                  href="/dashboard/audit-log"
                  className={cn(
                    "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                    pathname?.startsWith("/dashboard/audit-log") && "text-primary"
                  )}
                >
                  <div className="flex w-[85%] items-center gap-2">
                    <ProjectsIcon />
                    <h4
                      className={cn(
                        "w-[100%] truncate font-medium",
                        sidebarWidth === false ? "block" : "hidden"
                      )}
                    >
                      Audit Log
                    </h4>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Global Hub - only show if user has access */}
          {userHasGlobalHubAccess && groupedGlobalHubMenu.length > 0 && (
            <div>
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                GLOBAL HUB
              </h4>

              <div className="space-y-1">
                {groupedGlobalHubMenu.map((category) => (
                  <div key={category.category}>
                    {/* Category Header */}
                    <div
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                        "text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/10"
                      )}
                      onClick={() => {
                        if (
                          selectedGlobalHubCategory === category.category &&
                          showGlobalHubMenu
                        ) {
                          setShowGlobalHubMenu(false);
                          setSelectedGlobalHubCategory(null);
                        } else {
                          setShowGlobalHubMenu(true);
                          setSelectedGlobalHubCategory(category.category);
                        }
                      }}
                    >
                      <div className="flex w-full items-center gap-3">
                        <span className="flex-shrink-0">{category.icon}</span>
                        <h4
                          className={cn(
                            "w-[100%] truncate font-medium",
                            sidebarWidth === false ? "block" : "hidden"
                          )}
                        >
                          {category.label}
                        </h4>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 -rotate-90 transition duration-200",
                          showGlobalHubMenu &&
                            selectedGlobalHubCategory === category.category &&
                            "rotate-0"
                        )}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Category Items */}
                    <motion.ul
                      animate={
                        showGlobalHubMenu &&
                        selectedGlobalHubCategory === category.category
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pl-6 pt-1">
                        {category.items.map((item, itemIndex) => {
                          const isActive =
                            item.path && pathname?.startsWith(item.path);
                          return (
                            <Link
                              key={itemIndex}
                              href={item.path || "#"}
                              className={cn(
                                "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/10"
                              )}
                            >
                              <span
                                className={cn(
                                  "bg-gray-400 hover:bg-primary aspect-square w-2 rounded-full border",
                                  isActive && "bg-primary border-primary"
                                )}
                              ></span>
                              <h6
                                className={cn(
                                  "truncate transition-all duration-200",
                                  sidebarWidth === false ? "block" : "hidden"
                                )}
                              >
                                {item.label}
                              </h6>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;

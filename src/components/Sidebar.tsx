/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import logoSvg from "@/assets/svgs/logo-bg.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
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

    // Always allow access to universal features and Global Hub
    accessMap.push('Communication');
    accessMap.push('Organization');
    accessMap.push('Programs & Planning');

    if (features.leave) accessMap.push('Leave Management');
    if (features.itemRequisition) accessMap.push('Item Requisition');
    if (features.travelExpense) accessMap.push('Travel Expense');

    // If user has any authentication, ensure they can see Global Hub items
    if (user && authState.isAuthenticated) {
      accessMap.push('Global Hub');
    }

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
        subDepartments: ['Employee Management', 'Leave Management', 'Performance Management', 'Training & Development', 'Recruitment', 'Compensation & Benefits']
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
        subDepartments: ['Budget Management', 'Expense Management', 'Financial Reporting', 'Audit', 'Accounts']
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

        departmentBasedAccess = allowedDepartments.length === 0 || directParentAllowed || departmentHierarchyAllowed ||
          isNestedCGChild || isNestedProgramsChild || isNestedProcurementChild;
      } else {
        // For top-level items, check if this department is allowed
        // Be more permissive if user is authenticated but has low permissions (common for departmental officers)
        departmentBasedAccess = allowedDepartments.length === 0 || allowedDepartments.includes(item.name) ||
          (authState.isAuthenticated && (allowedDepartments.includes('Global Hub') || userDepartment));
      }

      // Permission-based access - be more permissive for departmental officers with 0 permissions
      const permissionBasedAccess = !item.permissions || item.permissions.length === 0
        ? true
        : hasPermission(item.permissions) ||
          // Allow access if user is authenticated and has 0 permissions (common for departmental officers)
          (authState.isAuthenticated && (permissionCount === 0 || user?.is_staff));

      // Get user position for department hierarchy checks
      const userPosition = user?.position?.title || '';

      // Special handling for Department Officers - if they can access their department hierarchy,
      // they should see the main functional sub-menus even if specific permissions are missing
      let adjustedPermissionAccess = permissionBasedAccess;
      if (isChild && isInDepartmentHierarchy(parentDepartment, userPosition)) {
        // For department hierarchy (including sub-departments), be more permissive for department officers
        const isDepartmentOfficer = ['Program Officer', 'Program Admin', 'HR Officer', 'Procurement Officer', 'Admin Officer', 'Finance Officer'].includes(userPosition);
        if (isDepartmentOfficer) {
          adjustedPermissionAccess = true; // Allow access to all department sub-menus and their children
        }
      }

      // Enhanced child menu access for departmental officers with their own department
      if (isChild && parentDepartment) {
        // Check if this is the user's own department
        const isOwnDepartment = (parentDepartment === 'C&G' && canAccessContractsGrantsFeatures) ||
          (parentDepartment === 'Programs' && canAccessProgramsFeatures) ||
          (parentDepartment === 'HR' && canAccessHRFeatures) ||
          (parentDepartment === 'Finance' && canAccessFinanceFeatures) ||
          (parentDepartment === 'Admin' && canAccessAdminFeatures) ||
          (parentDepartment === 'Procurement Management' && canAccessProcurementFeatures);

        if (isOwnDepartment && permissionCount === 0) {
          adjustedPermissionAccess = true; // Allow all child items for department officers in their own department
        }
      }

      // Combined access: Must pass BOTH department and permission checks
      const finalAccess = departmentBasedAccess && adjustedPermissionAccess;

      // Debug individual permission checks
      if (process.env.NODE_ENV === 'development') {
        const isImportantItem = item.name.includes('Global') || item.name.includes('C&G') ||
          item.name === 'Communication' || item.name === 'Organization' ||
          item.name === 'Programs' || item.name === 'C ANG G';

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
          departmentOfficerOverride: isChild && isInDepartmentHierarchy(parentDepartment, userPosition) && ['Program Officer', 'Program Admin', 'HR Officer', 'Procurement Officer', 'Admin Officer', 'Finance Officer'].includes(userPosition),
          departmentHierarchyCheck: isInDepartmentHierarchy(parentDepartment, userPosition),
          reason: !departmentBasedAccess
            ? `Role "${userPosition}" not allowed for ${isChild ? 'parent department' : 'department'} "${isChild ? parentDepartment : item.name}"`
            : !adjustedPermissionAccess
            ? 'User lacks required permissions (after adjustment)'
            : 'Both role and permissions allow access'
        });
        }
      }

      return finalAccess;
    }).map(item => ({
      ...item,
      children: item.children ? filterMenuItems(item.children, true, item.name) : undefined
    })).filter(item => {
      // Keep items that either have no children or have visible children
      return !item.children || item.children.length > 0;
    });
  };

  // UNIFIED FILTERING - Single permission system
  const filteredDepartmentalLinks = useMemo(() => {
    // Wait for hydration and authentication
    if (!isHydrated || permissionsLoading || !authState.isAuthenticated) {
      return [];
    }

    const filtered = filterMenuItems(departmentalLinks);

    // Debug logging (development only) - Check departmental filtering
    if (process.env.NODE_ENV === 'development') {
      console.log('🏢 DEPARTMENTAL FILTERING Debug:', {
        userType: isAdmin ? 'Admin' : 'Regular User',
        userPosition: user?.position?.title,
        originalDepartments: departmentalLinks.map(item => item.name),
        filteredDepartments: filtered.map(item => item.name),
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
    if (!isHydrated || permissionsLoading || !authState.isAuthenticated) {
      return [];
    }

    const filtered = filterMenuItems(moduleLinks);

    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 UNIFIED Module Links Filtering:', {
        originalCount: moduleLinks.length,
        filteredCount: filtered.length,
        isAdmin: isAdmin,
        filteredItems: filtered.map(item => item.name)
      });
    }

    return filtered;
  }, [isHydrated, permissionsLoading, authState.isAuthenticated, moduleLinks, hasPermission, isAdmin]);

  const filteredGlobalHubItems = useMemo(() => {
    if (!isHydrated || permissionsLoading || !authState.isAuthenticated) {
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
      // UNIVERSAL ACCESS: Items with no permissions - always show to all authenticated users
      if (!item.permissions) return true;

      // ROLE-BASED ACCESS: Items with permissions - show based on actual role assignments
      return hasPermission(item.permissions);
    });

    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 UNIVERSAL GLOBAL HUB - ERP User Lifecycle:', {
        userAuthenticatedFlow: 'New User → Global Hub → Role Assignment → Departmental Menus',
        originalCount: globalHubLinks.length,
        universalItemsCount: mapped.filter(item => !item.permissions).length,
        roleBasedItemsCount: filtered.length - mapped.filter(item => !item.permissions).length,
        totalVisibleItems: filtered.length,
        userType: isAdmin ? 'Admin' : 'Regular User',
        sampleUniversalItems: mapped.filter(item => !item.permissions).slice(0, 3).map(item => item.label)
      });
    }

    return filtered;
  }, [isHydrated, permissionsLoading, authState.isAuthenticated, globalHubLinks, hasPermission]);

  const groupedGlobalHubMenu = useMemo(
    () => groupGlobalHubByCategory(filteredGlobalHubItems, globalHubCategories),
    [filteredGlobalHubItems]
  );

  const userHasGlobalHubAccess = useMemo(() => {
    if (!isHydrated || permissionsLoading) return false;

    // Global Hub access is universal for all authenticated users
    return authState.isAuthenticated;
  }, [isHydrated, permissionsLoading, authState.isAuthenticated]);

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

  // Render settings items (similar logic)
  const renderSettingsItem = (item: SidebarItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && pathname?.startsWith(item.path);

    return (
      <div key={index} className="w-full">
        <div
          onClick={() => {
            if (hasChildren) {
              setShowSettingsMenu(!showSettingsMenu);
              setSelectedLinkIndex(index);
            }
          }}
          className={cn(
            "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
            isActive && "text-primary"
          )}
        >
          {item.path && !hasChildren ? (
            <Link href={item.path} className="flex w-full items-center justify-between gap-3">
              <div className="flex w-[85%] items-center gap-2">
                <span>{item.icon}</span>
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
                <span>{item.icon}</span>
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
                    showSettingsMenu && selectedLinkIndex === index && "rotate-0"
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
              showSettingsMenu && selectedLinkIndex === index
                ? { height: "fit-content" }
                : { height: 0 }
            }
            className="h-0 overflow-hidden list-none pl-14"
          >
            {item.children!.map((child, childIndex) => (
              <Link
                key={childIndex}
                href={child.path || "#"}
                className={cn(
                  "",
                  child.path && pathname?.startsWith(child.path) && "text-amber-400"
                )}
              >
                <li
                  className={cn(
                    "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                    child.path && pathname?.startsWith(child.path) && "text-amber-400"
                  )}
                >
                  <span
                    className={cn(
                      "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                      child.path &&
                        pathname?.startsWith(child.path) &&
                        "bg-amber-400 border-amber-400 hover:bg-amber-400"
                    )}
                  ></span>
                  <h6 className="py-2">{child.name}</h6>
                </li>
              </Link>
            ))}
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
              <Icon icon="ph:arrow-left-duotone" fontSize={15} />
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
                renderSettingsItem(link, index)
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

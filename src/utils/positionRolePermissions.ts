import { IUser, IRole, IPermission } from '@/features/auth/types/auth';

/**
 * Enhanced permission utilities for AHNI position-role system
 * Designed to work with the new backend position-role mapping
 */

/**
 * UI Permission categories for simplified frontend logic
 * Based on our backend implementation discussion
 */
export enum UIPermissionCategory {
    // Module Access
    HR_MODULE = 'can_access_hr_module',
    FINANCE_MODULE = 'can_access_finance_module',
    APPROVALS_MODULE = 'can_access_approvals_module',
    PROCUREMENT_MODULE = 'can_access_procurement_module',
    PROJECTS_MODULE = 'can_access_projects_module',
    PROGRAMS_MODULE = 'can_access_programs_module',
    CONFIG_MODULE = 'can_access_config_module',

    // Functional Access
    APPROVE_REQUESTS = 'can_approve_requests',
    AUTHORIZE_REQUESTS = 'can_authorize_requests',
    REVIEW_REQUESTS = 'can_review_requests',

    // Management Access
    MANAGE_EMPLOYEES = 'can_manage_employees',
    MANAGE_EXPENSES = 'can_manage_expenses',
    MANAGE_PROCUREMENT = 'can_manage_procurement',
    MANAGE_CONTRACTS = 'can_manage_contracts',

    // View Access (for Admin Officer type roles)
    VIEW_HR_DETAILS = 'can_view_hr_details',
    VIEW_FINANCE_DETAILS = 'can_view_finance_details',
}

/**
 * Calculate simplified UI permissions from user's detailed permissions
 * This mirrors the backend ui_permissions property we discussed
 */
export function calculateUIPermissions(user: IUser): string[] {
    if (!user.permissions) return [];

    const uiPerms = new Set<string>();
    const detailedPerms = getUserPermissionCodenames(user);

    // Module access logic
    const moduleMapping = {
        'hr': UIPermissionCategory.HR_MODULE,
        'finance': UIPermissionCategory.FINANCE_MODULE,
        'approvals': UIPermissionCategory.APPROVALS_MODULE,
        'procurements': UIPermissionCategory.PROCUREMENT_MODULE,
        'projects': UIPermissionCategory.PROJECTS_MODULE,
        'programs': UIPermissionCategory.PROGRAMS_MODULE,
        'config': UIPermissionCategory.CONFIG_MODULE,
    };

    // Check module access
    Object.entries(moduleMapping).forEach(([modulePrefix, uiPerm]) => {
        if (detailedPerms.some(perm => perm.startsWith(modulePrefix + '.'))) {
            uiPerms.add(uiPerm);
        }
    });

    // Specific functional permissions
    if (detailedPerms.includes('approvals.can_approve')) {
        uiPerms.add(UIPermissionCategory.APPROVE_REQUESTS);
    }
    if (detailedPerms.includes('approvals.can_authorize')) {
        uiPerms.add(UIPermissionCategory.AUTHORIZE_REQUESTS);
    }
    if (detailedPerms.includes('approvals.can_review')) {
        uiPerms.add(UIPermissionCategory.REVIEW_REQUESTS);
    }

    // Management permissions (create/edit capabilities)
    const managementMappings = [
        {
            perms: ['hr.add_employee', 'hr.change_employee'],
            ui: UIPermissionCategory.MANAGE_EMPLOYEES
        },
        {
            perms: ['finance.add_expense', 'finance.change_expense'],
            ui: UIPermissionCategory.MANAGE_EXPENSES
        },
        {
            perms: ['procurements.add_procurement', 'procurements.change_procurement'],
            ui: UIPermissionCategory.MANAGE_PROCUREMENT
        }
    ];

    managementMappings.forEach(({ perms, ui }) => {
        if (perms.some(perm => detailedPerms.includes(perm))) {
            uiPerms.add(ui);
        }
    });

    // View permissions (for Admin Officer who can view but not approve)
    const viewMappings = [
        {
            perms: ['hr.view_employee'],
            ui: UIPermissionCategory.VIEW_HR_DETAILS
        },
        {
            perms: ['finance.view_expense'],
            ui: UIPermissionCategory.VIEW_FINANCE_DETAILS
        }
    ];

    viewMappings.forEach(({ perms, ui }) => {
        if (perms.some(perm => detailedPerms.includes(perm))) {
            uiPerms.add(ui);
        }
    });

    return Array.from(uiPerms);
}

/**
 * Get all permission codenames for a user in 'module.codename' format
 */
export function getUserPermissionCodenames(user: IUser): string[] {
    if (!user.permissions) return [];

    const codenames: string[] = [];
    user.permissions.forEach(modulePermission => {
        modulePermission.permissions.forEach(permission => {
            codenames.push(`${modulePermission.module}.${permission.codename}`);
        });
    });
    return codenames;
}

/**
 * Check if user has specific UI permission
 */
export function hasUIPermission(user: IUser, permission: UIPermissionCategory): boolean {
    const uiPermissions = calculateUIPermissions(user);
    return uiPermissions.includes(permission);
}

/**
 * Check if user has any of the specified UI permissions (OR logic)
 */
export function hasAnyUIPermission(user: IUser, permissions: UIPermissionCategory[]): boolean {
    const uiPermissions = calculateUIPermissions(user);
    return permissions.some(permission => uiPermissions.includes(permission));
}

/**
 * Check if user has all of the specified UI permissions (AND logic)
 */
export function hasAllUIPermissions(user: IUser, permissions: UIPermissionCategory[]): boolean {
    const uiPermissions = calculateUIPermissions(user);
    return permissions.every(permission => uiPermissions.includes(permission));
}

/**
 * Get user's role names
 */
export function getUserRoleNames(user: IUser): string[] {
    if (!user.roles) return [];
    return user.roles.map(role => role.name);
}

/**
 * Check if user has specific role
 */
export function hasRole(user: IUser, roleName: string): boolean {
    const roleNames = getUserRoleNames(user);
    return roleNames.some(name => name.toLowerCase().includes(roleName.toLowerCase()));
}

/**
 * Enhanced admin detection that works with our position-role system
 */
export function isUserAdmin(user: IUser): boolean {
    // Check superuser flag
    if (user.is_superuser) return true;

    // Check role names for admin indicators
    const roleNames = getUserRoleNames(user);
    const adminRoles = ['director', 'admin', 'manager'];

    const hasAdminRole = roleNames.some(roleName =>
        adminRoles.some(adminKeyword =>
            roleName.toLowerCase().includes(adminKeyword)
        )
    );

    if (hasAdminRole) return true;

    // Check for admin-level permissions
    const permissionCodenames = getUserPermissionCodenames(user);
    const hasAdminPermissions = permissionCodenames.some(perm =>
        perm.includes('can_approve') ||
        perm.includes('can_authorize') ||
        perm.includes('delete_') ||
        perm.includes('users.') ||
        perm.includes('authorization.')
    );

    return hasAdminPermissions;
}

/**
 * Position-specific logic
 */
export interface PositionInfo {
    name: string;
    isLocationSpecific: boolean;
    isDepartmentSpecific: boolean;
    canApprove: boolean;
    canAuthorize: boolean;
    canReview: boolean;
}

/**
 * Analyze user's position-based capabilities
 */
export function analyzeUserPosition(user: IUser): PositionInfo {
    const uiPermissions = calculateUIPermissions(user);
    const roleNames = getUserRoleNames(user);

    // Try to infer position from role names
    let positionName = 'Unknown';
    if (roleNames.length > 0) {
        // Take the most specific role (not generic ones like "Approver Role")
        const specificRole = roleNames.find(name =>
            !name.includes('Approver') &&
            !name.includes('Reviewer') &&
            !name.includes('Authorizer')
        );
        positionName = specificRole || roleNames[0];
        // Clean up role name to get position (remove "Role" suffix)
        positionName = positionName.replace(/\s*Role\s*$/i, '');
    }

    return {
        name: positionName,
        isLocationSpecific: !isUserAdmin(user), // Admins are typically not location-specific
        isDepartmentSpecific: !isUserAdmin(user), // Admins are typically not department-specific
        canApprove: uiPermissions.includes(UIPermissionCategory.APPROVE_REQUESTS),
        canAuthorize: uiPermissions.includes(UIPermissionCategory.AUTHORIZE_REQUESTS),
        canReview: uiPermissions.includes(UIPermissionCategory.REVIEW_REQUESTS),
    };
}

/**
 * Menu display utilities
 */
export interface MenuPermissions {
    showHRMenu: boolean;
    showFinanceMenu: boolean;
    showApprovalsMenu: boolean;
    showProcurementMenu: boolean;
    showProjectsMenu: boolean;
    showConfigMenu: boolean;
    showApproveButton: boolean;
    showAuthorizeButton: boolean;
    showReviewButton: boolean;
}

/**
 * Calculate what menus and buttons to show for a user
 */
export function calculateMenuPermissions(user: IUser): MenuPermissions {
    const uiPermissions = calculateUIPermissions(user);

    return {
        showHRMenu: uiPermissions.includes(UIPermissionCategory.HR_MODULE),
        showFinanceMenu: uiPermissions.includes(UIPermissionCategory.FINANCE_MODULE),
        showApprovalsMenu: uiPermissions.includes(UIPermissionCategory.APPROVALS_MODULE),
        showProcurementMenu: uiPermissions.includes(UIPermissionCategory.PROCUREMENT_MODULE),
        showProjectsMenu: uiPermissions.includes(UIPermissionCategory.PROJECTS_MODULE),
        showConfigMenu: uiPermissions.includes(UIPermissionCategory.CONFIG_MODULE),
        showApproveButton: uiPermissions.includes(UIPermissionCategory.APPROVE_REQUESTS),
        showAuthorizeButton: uiPermissions.includes(UIPermissionCategory.AUTHORIZE_REQUESTS),
        showReviewButton: uiPermissions.includes(UIPermissionCategory.REVIEW_REQUESTS),
    };
}

/**
 * React hook for easy permission checking in components
 */
export function useUserPermissions(user: IUser | null) {
    if (!user) {
        return {
            uiPermissions: [],
            menuPermissions: {
                showHRMenu: false,
                showFinanceMenu: false,
                showApprovalsMenu: false,
                showProcurementMenu: false,
                showProjectsMenu: false,
                showConfigMenu: false,
                showApproveButton: false,
                showAuthorizeButton: false,
                showReviewButton: false,
            },
            positionInfo: {
                name: 'Unknown',
                isLocationSpecific: false,
                isDepartmentSpecific: false,
                canApprove: false,
                canAuthorize: false,
                canReview: false,
            },
            isAdmin: false,
            hasUIPermission: () => false,
            hasAnyUIPermission: () => false,
            hasAllUIPermissions: () => false,
        };
    }

    const uiPermissions = calculateUIPermissions(user);
    const menuPermissions = calculateMenuPermissions(user);
    const positionInfo = analyzeUserPosition(user);
    const isAdmin = isUserAdmin(user);

    return {
        uiPermissions,
        menuPermissions,
        positionInfo,
        isAdmin,
        hasUIPermission: (permission: UIPermissionCategory) => hasUIPermission(user, permission),
        hasAnyUIPermission: (permissions: UIPermissionCategory[]) => hasAnyUIPermission(user, permissions),
        hasAllUIPermissions: (permissions: UIPermissionCategory[]) => hasAllUIPermissions(user, permissions),
    };
}

/**
 * Utility functions for common permission scenarios
 */

/**
 * Check if user is an Admin Officer (can create/view but not approve/authorize/review)
 * This demonstrates the Admin Officer example from the user's requirements
 */
export function isAdminOfficer(user: IUser): boolean {
    const uiPermissions = calculateUIPermissions(user);
    const positionInfo = analyzeUserPosition(user);

    // Admin Officer criteria:
    // 1. Has module access (can view)
    // 2. Does NOT have approval permissions
    // 3. Position name might contain "Admin Officer"
    const hasModuleAccess = uiPermissions.some(perm =>
        perm.includes('can_access_') || perm.includes('can_view_')
    );

    const hasApprovalPermissions = positionInfo.canApprove || positionInfo.canAuthorize || positionInfo.canReview;

    return hasModuleAccess && !hasApprovalPermissions;
}

/**
 * Get user's access level description for debugging/display
 */
export function getUserAccessDescription(user: IUser): string {
    const positionInfo = analyzeUserPosition(user);
    const uiPermissions = calculateUIPermissions(user);

    if (isUserAdmin(user)) {
        return 'Administrator - Full access to all modules and features';
    }

    if (isAdminOfficer(user)) {
        return 'Admin Officer - Can create and view data but cannot approve, authorize, or review';
    }

    const capabilities: string[] = [];
    if (positionInfo.canApprove) capabilities.push('approve');
    if (positionInfo.canAuthorize) capabilities.push('authorize');
    if (positionInfo.canReview) capabilities.push('review');

    const modules = uiPermissions
        .filter(perm => perm.includes('_module'))
        .map(perm => perm.replace('can_access_', '').replace('_module', ''))
        .map(module => module.toUpperCase());

    let description = `${positionInfo.name} - Access to ${modules.join(', ')} modules`;
    if (capabilities.length > 0) {
        description += ` with ${capabilities.join(', ')} permissions`;
    }

    return description;
}

/**
 * Check if user should see approval-related UI elements
 * Perfect for hiding approval buttons from Admin Officers
 */
export function shouldShowApprovalUI(user: IUser): boolean {
    const positionInfo = analyzeUserPosition(user);
    return positionInfo.canApprove || positionInfo.canAuthorize || positionInfo.canReview;
}

/**
 * Check if user has management-level permissions
 * Useful for showing/hiding management features
 */
export function isManagerLevel(user: IUser): boolean {
    const uiPermissions = calculateUIPermissions(user);
    return uiPermissions.some(perm =>
        perm === UIPermissionCategory.MANAGE_EMPLOYEES ||
        perm === UIPermissionCategory.MANAGE_EXPENSES ||
        perm === UIPermissionCategory.MANAGE_PROCUREMENT ||
        perm === UIPermissionCategory.APPROVE_REQUESTS ||
        perm === UIPermissionCategory.AUTHORIZE_REQUESTS
    );
}

/**
 * Get filtered module list for user
 * Returns only modules the user has access to
 */
export function getAccessibleModules(user: IUser): string[] {
    const uiPermissions = calculateUIPermissions(user);
    const modules: string[] = [];

    if (uiPermissions.includes(UIPermissionCategory.HR_MODULE)) modules.push('HR');
    if (uiPermissions.includes(UIPermissionCategory.FINANCE_MODULE)) modules.push('Finance');
    if (uiPermissions.includes(UIPermissionCategory.PROCUREMENT_MODULE)) modules.push('Procurement');
    if (uiPermissions.includes(UIPermissionCategory.PROGRAMS_MODULE)) modules.push('Programs');
    if (uiPermissions.includes(UIPermissionCategory.PROJECTS_MODULE)) modules.push('Projects');
    if (uiPermissions.includes(UIPermissionCategory.CONFIG_MODULE)) modules.push('Configuration');
    if (uiPermissions.includes(UIPermissionCategory.APPROVALS_MODULE)) modules.push('Approvals');

    return modules;
}
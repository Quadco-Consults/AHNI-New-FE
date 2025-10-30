/**
 * Core Permission Constants for AHNI ERP System
 *
 * This file defines all permission constants used throughout the application.
 * These constants should match the permission codenames in your backend system.
 */

// ========================================
// CORE DASHBOARD PERMISSIONS
// ========================================

export const DASHBOARD_PERMISSIONS = {
  /** Access to main dashboard */
  ACCESS_DASHBOARD: 'access_dashboard',
} as const;

// ========================================
// NAVIGATION PERMISSIONS
// ========================================

export const NAVIGATION_PERMISSIONS = {
  // Global Hub Access
  /** Access to Global Hub menu section */
  VIEW_GLOBAL_HUB: 'view_global_hub',

  // Global Hub - Procurement
  /** Access to procurement request forms in Global Hub */
  VIEW_PROCUREMENT_REQUESTS: 'view_procurement_requests',
  /** Create purchase requests */
  CREATE_PURCHASE_REQUESTS: 'create_purchase_requests',
  /** Access item requisition forms */
  VIEW_ITEM_REQUISITION: 'view_item_requisition',
  /** Create item requisitions */
  CREATE_ITEM_REQUISITION: 'create_item_requisition',

  // Global Hub - Fleet Management
  /** Access to fleet request forms */
  VIEW_FLEET_REQUESTS: 'view_fleet_requests',
  /** Create vehicle requests */
  CREATE_VEHICLE_REQUESTS: 'create_vehicle_requests',
  /** Create fuel requests */
  CREATE_FUEL_REQUESTS: 'create_fuel_requests',

  // Global Hub - Maintenance
  /** Access to maintenance request forms */
  VIEW_MAINTENANCE_REQUESTS: 'view_maintenance_requests',
  /** Create facility maintenance requests */
  CREATE_FACILITY_MAINTENANCE: 'create_facility_maintenance',
  /** Create asset maintenance requests */
  CREATE_ASSET_MAINTENANCE: 'create_asset_maintenance',

  // Global Hub - Financial
  /** Access to financial request forms */
  VIEW_FINANCIAL_REQUESTS: 'view_financial_requests',
  /** Create payment requests */
  CREATE_PAYMENT_REQUESTS: 'create_payment_requests',
  /** Create expense authorization requests */
  CREATE_EXPENSE_AUTHORIZATION: 'create_expense_authorization',
  /** Create travel expense reports */
  CREATE_TRAVEL_EXPENSES: 'create_travel_expenses',

  // Global Hub - Contracts
  /** Access to contract request forms */
  VIEW_CONTRACT_REQUESTS: 'view_contract_requests',
  /** Create contract requests */
  CREATE_CONTRACT_REQUESTS: 'create_contract_requests',
  /** Submit consultancy reports */
  CREATE_CONSULTANCY_REPORTS: 'create_consultancy_reports',

  // Global Hub - HR
  /** Access to HR self-service forms */
  VIEW_HR_SELF_SERVICE: 'view_hr_self_service',
  /** Access personal timesheet */
  VIEW_MY_TIMESHEET: 'view_my_timesheet',
  /** Submit timesheet entries */
  SUBMIT_TIMESHEET: 'submit_timesheet',
  /** Apply for leave */
  APPLY_FOR_LEAVE: 'apply_for_leave',
  /** View personal leave dashboard */
  VIEW_MY_LEAVE_DASHBOARD: 'view_my_leave_dashboard',
  /** Create adhoc staff requisitions */
  CREATE_ADHOC_STAFF_REQUISITION: 'create_adhoc_staff_requisition',

  // Support
  /** Access to support/help features */
  VIEW_SUPPORT: 'view_support',
} as const;

// ========================================
// MODULE ACCESS PERMISSIONS
// ========================================

export const MODULE_PERMISSIONS = {
  // Core Modules
  /** Access to HR Department module */
  ACCESS_HR_MODULE: 'access_hr_module',
  /** Access to Finance module */
  ACCESS_FINANCE_MODULE: 'access_finance_module',
  /** Access to Procurement module */
  ACCESS_PROCUREMENT_MODULE: 'access_procurement_module',
  /** Access to Admin module */
  ACCESS_ADMIN_MODULE: 'access_admin_module',
  /** Access to Programs module */
  ACCESS_PROGRAMS_MODULE: 'access_programs_module',
  /** Access to Contracts & Grants module */
  ACCESS_CONTRACTS_MODULE: 'access_contracts_module',
} as const;

// ========================================
// SETTINGS & ADMINISTRATION PERMISSIONS
// ========================================

export const SETTINGS_PERMISSIONS = {
  /** Access to settings menu */
  VIEW_SETTINGS_MENU: 'view_settings_menu',
  /** Manage system settings */
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',

  // User Management
  /** View user list */
  VIEW_USERS: 'view_users',
  /** Create new users */
  CREATE_USERS: 'create_users',
  /** Edit user information */
  EDIT_USERS: 'edit_users',
  /** Delete users */
  DELETE_USERS: 'delete_users',
  /** Activate/deactivate users */
  MANAGE_USER_STATUS: 'manage_user_status',

  // Role Management
  /** View roles */
  VIEW_ROLES: 'view_roles',
  /** Create new roles */
  CREATE_ROLES: 'create_roles',
  /** Edit roles */
  EDIT_ROLES: 'edit_roles',
  /** Delete roles */
  DELETE_ROLES: 'delete_roles',
  /** Assign roles to users */
  ASSIGN_ROLES: 'assign_roles',

  // Permission Management
  /** View permissions */
  VIEW_PERMISSIONS: 'view_permissions',
  /** Manage permissions */
  MANAGE_PERMISSIONS: 'manage_permissions',
  /** Assign permissions to roles */
  ASSIGN_PERMISSIONS: 'assign_permissions',

  // System Administration
  /** Full system administration access */
  SYSTEM_ADMIN: 'system_admin',
  /** View system logs */
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  /** Manage system configuration */
  MANAGE_SYSTEM_CONFIG: 'manage_system_config',
} as const;

// ========================================
// DATA OPERATION PERMISSIONS
// ========================================

export const DATA_PERMISSIONS = {
  // Basic CRUD Operations
  /** Create new records */
  CREATE_RECORDS: 'create_records',
  /** View records */
  VIEW_RECORDS: 'view_records',
  /** Edit existing records */
  EDIT_RECORDS: 'edit_records',
  /** Delete records */
  DELETE_RECORDS: 'delete_records',

  // Data Scope Permissions
  /** View all records across organization */
  VIEW_ALL_RECORDS: 'view_all_records',
  /** View only own records */
  VIEW_OWN_RECORDS: 'view_own_records',
  /** View department records */
  VIEW_DEPARTMENT_RECORDS: 'view_department_records',
  /** View team records */
  VIEW_TEAM_RECORDS: 'view_team_records',

  // Specific Data Types
  /** Access to employee data */
  VIEW_EMPLOYEE_DATA: 'view_employee_data',
  /** Access to financial data */
  VIEW_FINANCIAL_DATA: 'view_financial_data',
  /** Access to sensitive data */
  VIEW_SENSITIVE_DATA: 'view_sensitive_data',
  /** Export data to files */
  EXPORT_DATA: 'export_data',
  /** Import data from files */
  IMPORT_DATA: 'import_data',
} as const;

// ========================================
// WORKFLOW & APPROVAL PERMISSIONS
// ========================================

export const WORKFLOW_PERMISSIONS = {
  // Submission Permissions
  /** Submit requests for approval */
  SUBMIT_FOR_APPROVAL: 'submit_for_approval',
  /** Submit on behalf of others */
  SUBMIT_FOR_OTHERS: 'submit_for_others',

  // Approval Workflow Permissions
  /** Review submitted requests */
  REVIEW_REQUESTS: 'can_review',
  /** Authorize requests (middle approval) */
  AUTHORIZE_REQUESTS: 'can_authorize',
  /** Final approval of requests */
  APPROVE_REQUESTS: 'can_approve',
  /** Reject requests */
  REJECT_REQUESTS: 'reject_requests',

  // Workflow Management
  /** Manage approval workflows */
  MANAGE_WORKFLOWS: 'manage_workflows',
  /** Override approval requirements */
  OVERRIDE_APPROVALS: 'override_approvals',
  /** View approval history */
  VIEW_APPROVAL_HISTORY: 'view_approval_history',
} as const;

// ========================================
// MODULE-SPECIFIC PERMISSIONS
// ========================================

// HR Module Permissions
export const HR_PERMISSIONS = {
  // Employee Management
  /** View all employee records */
  VIEW_ALL_EMPLOYEES: 'hr_view_all_employees',
  /** Edit employee data */
  EDIT_EMPLOYEE_DATA: 'hr_edit_employee_data',
  /** Manage employee onboarding */
  MANAGE_ONBOARDING: 'hr_manage_onboarding',
  /** Manage employee termination */
  MANAGE_TERMINATION: 'hr_manage_termination',

  // Payroll & Benefits
  /** View payroll information */
  VIEW_PAYROLL: 'hr_view_payroll',
  /** Process payroll */
  PROCESS_PAYROLL: 'hr_process_payroll',
  /** Manage benefits */
  MANAGE_BENEFITS: 'hr_manage_benefits',

  // Leave Management
  /** View all leave requests */
  VIEW_ALL_LEAVE_REQUESTS: 'hr_view_all_leave_requests',
  /** Approve leave requests */
  APPROVE_LEAVE_REQUESTS: 'hr_approve_leave_requests',
  /** Manage leave policies */
  MANAGE_LEAVE_POLICIES: 'hr_manage_leave_policies',

  // Performance Management
  /** View performance reviews */
  VIEW_PERFORMANCE_REVIEWS: 'hr_view_performance_reviews',
  /** Manage performance cycles */
  MANAGE_PERFORMANCE_CYCLES: 'hr_manage_performance_cycles',

  // Recruitment
  /** Manage job postings */
  MANAGE_JOB_POSTINGS: 'hr_manage_job_postings',
  /** View candidate applications */
  VIEW_APPLICATIONS: 'hr_view_applications',
  /** Conduct interviews */
  CONDUCT_INTERVIEWS: 'hr_conduct_interviews',
} as const;

// Finance Module Permissions
export const FINANCE_PERMISSIONS = {
  // Budget Management
  /** View budgets */
  VIEW_BUDGETS: 'finance_view_budgets',
  /** Create/edit budgets */
  MANAGE_BUDGETS: 'finance_manage_budgets',
  /** Approve budget allocations */
  APPROVE_BUDGETS: 'finance_approve_budgets',

  // Expense Management
  /** View all expenses */
  VIEW_ALL_EXPENSES: 'finance_view_all_expenses',
  /** Process expense reports */
  PROCESS_EXPENSES: 'finance_process_expenses',
  /** Approve expense payments */
  APPROVE_EXPENSE_PAYMENTS: 'finance_approve_expense_payments',

  // Payment Processing
  /** Process payments */
  PROCESS_PAYMENTS: 'finance_process_payments',
  /** Approve payments */
  APPROVE_PAYMENTS: 'finance_approve_payments',
  /** View payment history */
  VIEW_PAYMENT_HISTORY: 'finance_view_payment_history',

  // Financial Reporting
  /** Generate financial reports */
  GENERATE_FINANCIAL_REPORTS: 'finance_generate_reports',
  /** View profit & loss */
  VIEW_PL_REPORTS: 'finance_view_pl_reports',
  /** View balance sheet */
  VIEW_BALANCE_SHEET: 'finance_view_balance_sheet',

  // Accounting
  /** Manage chart of accounts */
  MANAGE_CHART_OF_ACCOUNTS: 'finance_manage_chart_accounts',
  /** Process journal entries */
  PROCESS_JOURNAL_ENTRIES: 'finance_process_journal_entries',
  /** Manage tax settings */
  MANAGE_TAX_SETTINGS: 'finance_manage_tax_settings',
} as const;

// Procurement Module Permissions
export const PROCUREMENT_PERMISSIONS = {
  // Purchase Requests
  /** View all purchase requests */
  VIEW_ALL_PURCHASE_REQUESTS: 'procurement_view_all_requests',
  /** Approve purchase requests */
  APPROVE_PURCHASE_REQUESTS: 'procurement_approve_requests',

  // Vendor Management
  /** View vendors */
  VIEW_VENDORS: 'procurement_view_vendors',
  /** Manage vendor information */
  MANAGE_VENDORS: 'procurement_manage_vendors',
  /** Evaluate vendor performance */
  EVALUATE_VENDORS: 'procurement_evaluate_vendors',

  // Purchase Orders
  /** Create purchase orders */
  CREATE_PURCHASE_ORDERS: 'procurement_create_po',
  /** Approve purchase orders */
  APPROVE_PURCHASE_ORDERS: 'procurement_approve_po',
  /** Manage purchase order workflow */
  MANAGE_PO_WORKFLOW: 'procurement_manage_po_workflow',

  // Inventory Management
  /** View inventory */
  VIEW_INVENTORY: 'procurement_view_inventory',
  /** Manage inventory */
  MANAGE_INVENTORY: 'procurement_manage_inventory',
  /** Conduct inventory audits */
  CONDUCT_INVENTORY_AUDITS: 'procurement_conduct_audits',
} as const;

// ========================================
// PERMISSION GROUPS
// ========================================

/** All core permissions grouped by category */
export const ALL_PERMISSIONS = {
  DASHBOARD: DASHBOARD_PERMISSIONS,
  NAVIGATION: NAVIGATION_PERMISSIONS,
  MODULES: MODULE_PERMISSIONS,
  SETTINGS: SETTINGS_PERMISSIONS,
  DATA: DATA_PERMISSIONS,
  WORKFLOW: WORKFLOW_PERMISSIONS,
  HR: HR_PERMISSIONS,
  FINANCE: FINANCE_PERMISSIONS,
  PROCUREMENT: PROCUREMENT_PERMISSIONS,
} as const;

/** Flat array of all permission values for easy iteration */
export const ALL_PERMISSION_VALUES = [
  ...Object.values(DASHBOARD_PERMISSIONS),
  ...Object.values(NAVIGATION_PERMISSIONS),
  ...Object.values(MODULE_PERMISSIONS),
  ...Object.values(SETTINGS_PERMISSIONS),
  ...Object.values(DATA_PERMISSIONS),
  ...Object.values(WORKFLOW_PERMISSIONS),
  ...Object.values(HR_PERMISSIONS),
  ...Object.values(FINANCE_PERMISSIONS),
  ...Object.values(PROCUREMENT_PERMISSIONS),
] as const;

// ========================================
// PERMISSION COLLECTIONS
// ========================================

/** Permissions typically assigned to regular employees */
export const EMPLOYEE_PERMISSIONS = [
  DASHBOARD_PERMISSIONS.ACCESS_DASHBOARD,
  NAVIGATION_PERMISSIONS.VIEW_GLOBAL_HUB,
  NAVIGATION_PERMISSIONS.VIEW_PROCUREMENT_REQUESTS,
  NAVIGATION_PERMISSIONS.CREATE_PURCHASE_REQUESTS,
  NAVIGATION_PERMISSIONS.VIEW_HR_SELF_SERVICE,
  NAVIGATION_PERMISSIONS.VIEW_MY_TIMESHEET,
  NAVIGATION_PERMISSIONS.SUBMIT_TIMESHEET,
  NAVIGATION_PERMISSIONS.APPLY_FOR_LEAVE,
  NAVIGATION_PERMISSIONS.VIEW_MY_LEAVE_DASHBOARD,
  DATA_PERMISSIONS.VIEW_OWN_RECORDS,
  WORKFLOW_PERMISSIONS.SUBMIT_FOR_APPROVAL,
] as const;

/** Permissions typically assigned to managers */
export const MANAGER_PERMISSIONS = [
  ...EMPLOYEE_PERMISSIONS,
  DATA_PERMISSIONS.VIEW_TEAM_RECORDS,
  WORKFLOW_PERMISSIONS.REVIEW_REQUESTS,
  WORKFLOW_PERMISSIONS.AUTHORIZE_REQUESTS,
  DATA_PERMISSIONS.VIEW_DEPARTMENT_RECORDS,
] as const;

/** Permissions typically assigned to department heads */
export const DEPARTMENT_HEAD_PERMISSIONS = [
  ...MANAGER_PERMISSIONS,
  WORKFLOW_PERMISSIONS.APPROVE_REQUESTS,
  DATA_PERMISSIONS.VIEW_ALL_RECORDS,
  SETTINGS_PERMISSIONS.VIEW_USERS,
] as const;

/** Permissions for admin users */
export const ADMIN_PERMISSIONS = [
  ...ALL_PERMISSION_VALUES,
] as const;

// ========================================
// MODULE CODES
// ========================================

/** Module codes that correspond to assigned_modules field */
export const MODULE_CODES = {
  HR: 'hr',
  FINANCE: 'finance',
  PROCUREMENT: 'procurement',
  ADMIN: 'admin',
  PROGRAMS: 'programs',
  CONTRACTS: 'contracts',
  FLEET: 'fleet',
  MAINTENANCE: 'maintenance',
} as const;

/** Array of all module codes */
export const ALL_MODULE_CODES = Object.values(MODULE_CODES);

// ========================================
// TYPE EXPORTS
// ========================================

export type PermissionCode = typeof ALL_PERMISSION_VALUES[number];
export type ModuleCode = typeof ALL_MODULE_CODES[number];

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get all permissions for a specific module
 */
export const getModulePermissions = (moduleCode: ModuleCode): PermissionCode[] => {
  switch (moduleCode) {
    case MODULE_CODES.HR:
      return Object.values(HR_PERMISSIONS) as PermissionCode[];
    case MODULE_CODES.FINANCE:
      return Object.values(FINANCE_PERMISSIONS) as PermissionCode[];
    case MODULE_CODES.PROCUREMENT:
      return Object.values(PROCUREMENT_PERMISSIONS) as PermissionCode[];
    default:
      return [];
  }
};

/**
 * Get permission display name from permission code
 */
export const getPermissionDisplayName = (permissionCode: string): string => {
  // Convert snake_case to Title Case
  return permissionCode
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get module display name from module code
 */
export const getModuleDisplayName = (moduleCode: string): string => {
  const displayNames: Record<string, string> = {
    [MODULE_CODES.HR]: 'Human Resources',
    [MODULE_CODES.FINANCE]: 'Finance',
    [MODULE_CODES.PROCUREMENT]: 'Procurement',
    [MODULE_CODES.ADMIN]: 'Administration',
    [MODULE_CODES.PROGRAMS]: 'Programs',
    [MODULE_CODES.CONTRACTS]: 'Contracts & Grants',
    [MODULE_CODES.FLEET]: 'Fleet Management',
    [MODULE_CODES.MAINTENANCE]: 'Maintenance',
  };

  return displayNames[moduleCode] || moduleCode;
};

export default ALL_PERMISSIONS;
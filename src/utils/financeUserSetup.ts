/**
 * Finance User Setup Utility
 *
 * This file provides utilities for setting up finance users with proper roles and permissions.
 * Use this guide to configure finance manager and finance officer roles.
 */

export interface FinanceUserConfig {
  email: string;
  position: 'Finance Manager' | 'Finance Officer';
  department: 'Finance' | 'FINANCE';
  permissions: string[];
  roles: string[];
}

// Recommended permissions for finance users
export const FINANCE_PERMISSIONS = {
  // Basic finance module access
  VIEW_FINANCE: [
    'finance.view_budgetline',
    'finance.view_chartofaccounts',
    'finance.view_journalentry',
    'finance.view_bankreconcialiation',
    'finance.view_financialreport'
  ],

  // Finance Officer permissions (can view and create)
  FINANCE_OFFICER: [
    'finance.view_budgetline',
    'finance.add_budgetline',
    'finance.view_chartofaccounts',
    'finance.add_chartofaccounts',
    'finance.view_journalentry',
    'finance.add_journalentry'
  ],

  // Finance Manager permissions (full access)
  FINANCE_MANAGER: [
    'finance.view_budgetline',
    'finance.add_budgetline',
    'finance.change_budgetline',
    'finance.delete_budgetline',
    'finance.view_chartofaccounts',
    'finance.add_chartofaccounts',
    'finance.change_chartofaccounts',
    'finance.view_journalentry',
    'finance.add_journalentry',
    'finance.change_journalentry',
    'finance.view_bankreconcialiation',
    'finance.add_bankreconcialiation',
    'finance.change_bankreconcialiation',
    'finance.view_financialreport',
    'finance.view_integrationdashboard',
    'finance.view_financialanalysis'
  ]
};

// Sample configurations for common finance users
export const FINANCE_USER_CONFIGS: FinanceUserConfig[] = [
  {
    email: 'financemanager@ahni.test',
    position: 'Finance Manager',
    department: 'Finance',
    permissions: FINANCE_PERMISSIONS.FINANCE_MANAGER,
    roles: ['Finance Manager', 'Department Manager']
  },
  {
    email: 'financeofficer@ahni.test',
    position: 'Finance Officer',
    department: 'Finance',
    permissions: FINANCE_PERMISSIONS.FINANCE_OFFICER,
    roles: ['Finance Officer', 'Department Officer']
  }
];

/**
 * Helper function to check if a user should have finance access
 */
export function shouldUserHaveFinanceAccess(user: any): boolean {
  const email = user?.email?.toLowerCase() || '';
  const department = user?.department?.name || user?.employee?.department?.name || '';
  const position = user?.position?.name || user?.position?.title || '';

  // Email-based check
  if (email.includes('finance')) {
    return true;
  }

  // Department-based check
  if (department.toLowerCase() === 'finance') {
    return true;
  }

  // Position-based check
  if (position.toLowerCase().includes('finance')) {
    return true;
  }

  return false;
}

/**
 * Debug function to check finance user configuration
 */
export function debugFinanceUserAccess(user: any) {
  console.log('🏦 Finance User Debug:', {
    email: user?.email,
    hasFinanceEmail: user?.email?.toLowerCase().includes('finance'),
    department: user?.department?.name || user?.employee?.department?.name,
    position: user?.position?.name || user?.position?.title,
    permissions: user?.permissions?.length || 0,
    roles: user?.roles?.length || 0,
    shouldHaveAccess: shouldUserHaveFinanceAccess(user),
    financePermissions: user?.permissions?.filter((p: any) =>
      p.module === 'finance' || p.codename?.includes('finance')
    ).length || 0
  });
}

/**
 * Expected Django backend setup for finance users:
 *
 * 1. Create user with email containing "finance" (e.g., financemanager@ahni.test)
 * 2. Assign department: "Finance" or "FINANCE"
 * 3. Assign position: "Finance Manager" or "Finance Officer"
 * 4. Grant permissions based on role level
 * 5. Assign appropriate Django groups/roles
 *
 * Minimum required for menu visibility:
 * - Email contains "finance" OR
 * - Department is "Finance" OR
 * - Has any finance.* permission OR
 * - Position contains "finance"
 */
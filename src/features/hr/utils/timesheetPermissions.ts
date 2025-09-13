import { TimesheetSummary } from '../types/timesheet';

// User Role Types
export type UserRole = 'employee' | 'manager' | 'hr' | 'admin';

// Permission Types
export type Permission = 
  | 'create_timesheet'
  | 'read_own_timesheet' 
  | 'read_team_timesheet'
  | 'read_all_timesheet'
  | 'update_own_timesheet'
  | 'update_team_timesheet'
  | 'delete_own_timesheet'
  | 'delete_team_timesheet'
  | 'submit_timesheet'
  | 'approve_timesheet'
  | 'reject_timesheet'
  | 'export_timesheet'
  | 'view_reports'
  | 'manage_users';

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  managerId?: string;
  teamMemberIds?: string[];
}

// Role-based Permissions Matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  employee: [
    'create_timesheet',
    'read_own_timesheet',
    'update_own_timesheet',
    'delete_own_timesheet',
    'submit_timesheet'
  ],
  manager: [
    'create_timesheet',
    'read_own_timesheet',
    'read_team_timesheet',
    'update_own_timesheet',
    'delete_own_timesheet',
    'submit_timesheet',
    'approve_timesheet',
    'reject_timesheet',
    'export_timesheet',
    'view_reports'
  ],
  hr: [
    'create_timesheet',
    'read_own_timesheet',
    'read_all_timesheet',
    'update_own_timesheet',
    'delete_own_timesheet',
    'submit_timesheet',
    'approve_timesheet',
    'reject_timesheet',
    'export_timesheet',
    'view_reports'
  ],
  admin: [
    'create_timesheet',
    'read_own_timesheet',
    'read_team_timesheet',
    'read_all_timesheet',
    'update_own_timesheet',
    'update_team_timesheet',
    'delete_own_timesheet',
    'delete_team_timesheet',
    'submit_timesheet',
    'approve_timesheet',
    'reject_timesheet',
    'export_timesheet',
    'view_reports',
    'manage_users'
  ]
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole].includes(permission);
};

/**
 * Check if user owns the timesheet
 */
export const isTimesheetOwner = (userId: string, timesheet: TimesheetSummary): boolean => {
  return timesheet.employee.id === userId;
};

/**
 * Check if user can view timesheet
 */
export const canViewTimesheet = (
  user: User,
  timesheet: TimesheetSummary
): boolean => {
  const isOwner = isTimesheetOwner(user.id, timesheet);
  
  if (hasPermission(user.role, 'read_all_timesheet')) {
    return true; // HR and admin can see all
  }
  
  if (hasPermission(user.role, 'read_own_timesheet') && isOwner) {
    return true; // Own timesheet
  }
  
  if (hasPermission(user.role, 'read_team_timesheet')) {
    // Manager can see team member timesheets
    return user.teamMemberIds?.includes(timesheet.employee.id) ?? false;
  }
  
  return false;
};

/**
 * Check if user can edit timesheet
 */
export const canEditTimesheet = (
  user: User,
  timesheet: TimesheetSummary
): boolean => {
  const isOwner = isTimesheetOwner(user.id, timesheet);
  
  // Only draft and rejected timesheets can be edited
  if (!['draft', 'rejected'].includes(timesheet.status)) {
    return false;
  }
  
  // Admin can edit any timesheet
  if (user.role === 'admin') {
    return true;
  }
  
  // Users can edit their own timesheets
  if (hasPermission(user.role, 'update_own_timesheet') && isOwner) {
    return true;
  }
  
  // Managers can edit team member timesheets (if business rules allow)
  if (hasPermission(user.role, 'update_team_timesheet')) {
    return user.teamMemberIds?.includes(timesheet.employee.id) ?? false;
  }
  
  return false;
};

/**
 * Check if user can submit timesheet
 */
export const canSubmitTimesheet = (
  user: User,
  timesheet: TimesheetSummary
): boolean => {
  const isOwner = isTimesheetOwner(user.id, timesheet);
  
  return (
    hasPermission(user.role, 'submit_timesheet') &&
    isOwner &&
    timesheet.status === 'draft'
  );
};

/**
 * Check if user can approve timesheet
 */
export const canApproveTimesheet = (
  user: User,
  timesheet: TimesheetSummary
): boolean => {
  const isOwner = isTimesheetOwner(user.id, timesheet);
  
  // Can't approve own timesheet
  if (isOwner) {
    return false;
  }
  
  // Only submitted timesheets can be approved
  if (timesheet.status !== 'submitted') {
    return false;
  }
  
  // Check permission and team relationship
  if (hasPermission(user.role, 'approve_timesheet')) {
    // HR and admin can approve any timesheet
    if (user.role === 'hr' || user.role === 'admin') {
      return true;
    }
    
    // Managers can approve team member timesheets
    if (user.role === 'manager') {
      return user.teamMemberIds?.includes(timesheet.employee.id) ?? false;
    }
  }
  
  return false;
};

/**
 * Check if user can reject timesheet
 */
export const canRejectTimesheet = (
  user: User,
  timesheet: TimesheetSummary
): boolean => {
  // Same logic as approve
  return canApproveTimesheet(user, timesheet);
};

/**
 * Check if user can delete timesheet
 */
export const canDeleteTimesheet = (
  user: User,
  timesheet: TimesheetSummary
): boolean => {
  const isOwner = isTimesheetOwner(user.id, timesheet);
  
  // Only draft and rejected timesheets can be deleted
  if (!['draft', 'rejected'].includes(timesheet.status)) {
    return false;
  }
  
  // Admin can delete any timesheet
  if (user.role === 'admin') {
    return true;
  }
  
  // Users can delete their own timesheets
  if (hasPermission(user.role, 'delete_own_timesheet') && isOwner) {
    return true;
  }
  
  // Managers can delete team member timesheets
  if (hasPermission(user.role, 'delete_team_timesheet')) {
    return user.teamMemberIds?.includes(timesheet.employee.id) ?? false;
  }
  
  return false;
};

/**
 * Check if user can export timesheets
 */
export const canExportTimesheets = (user: User): boolean => {
  return hasPermission(user.role, 'export_timesheet');
};

/**
 * Check if user can view reports
 */
export const canViewReports = (user: User): boolean => {
  return hasPermission(user.role, 'view_reports');
};

/**
 * Get available actions for a timesheet
 */
export interface TimesheetAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export const getTimesheetActions = (
  user: User,
  timesheet: TimesheetSummary
): TimesheetAction[] => {
  const actions: TimesheetAction[] = [];
  
  // View action (always available if user can view)
  if (canViewTimesheet(user, timesheet)) {
    actions.push({
      id: 'view',
      label: 'View Details',
      icon: 'eye'
    });
  }
  
  // Edit action
  if (canEditTimesheet(user, timesheet)) {
    actions.push({
      id: 'edit',
      label: 'Edit',
      icon: 'edit'
    });
  }
  
  // Submit action
  if (canSubmitTimesheet(user, timesheet)) {
    actions.push({
      id: 'submit',
      label: 'Submit for Approval',
      icon: 'send',
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to submit this timesheet for approval?'
    });
  }
  
  // Approve action
  if (canApproveTimesheet(user, timesheet)) {
    actions.push({
      id: 'approve',
      label: 'Approve',
      icon: 'check',
      variant: 'default',
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to approve this timesheet?'
    });
  }
  
  // Reject action
  if (canRejectTimesheet(user, timesheet)) {
    actions.push({
      id: 'reject',
      label: 'Reject',
      icon: 'x',
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationMessage: 'Please provide a reason for rejecting this timesheet.'
    });
  }
  
  // Delete action
  if (canDeleteTimesheet(user, timesheet)) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to delete this timesheet? This action cannot be undone.'
    });
  }
  
  return actions;
};

/**
 * Filter timesheets based on user permissions
 */
export const filterTimesheetsByPermission = (
  user: User,
  timesheets: TimesheetSummary[]
): TimesheetSummary[] => {
  return timesheets.filter(timesheet => canViewTimesheet(user, timesheet));
};

/**
 * Check if user can create timesheet for a specific employee
 */
export const canCreateTimesheetForEmployee = (
  user: User,
  employeeId: string
): boolean => {
  // Admin can create for anyone
  if (user.role === 'admin') {
    return true;
  }
  
  // Users can create their own timesheets
  if (user.id === employeeId && hasPermission(user.role, 'create_timesheet')) {
    return true;
  }
  
  // Managers can create for team members (if business rules allow)
  if (user.role === 'manager') {
    return user.teamMemberIds?.includes(employeeId) ?? false;
  }
  
  return false;
};

/**
 * Get status badge styling based on role and ownership
 */
export const getStatusBadgeProps = (
  timesheet: TimesheetSummary,
  user: User
): { variant: string; className?: string; tooltip?: string } => {
  const isOwner = isTimesheetOwner(user.id, timesheet);
  
  const baseProps = {
    draft: { variant: 'secondary', tooltip: 'Timesheet is being edited' },
    submitted: { variant: 'default', tooltip: 'Waiting for approval' },
    approved: { variant: 'success', className: 'bg-green-100 text-green-800', tooltip: 'Approved by manager' },
    rejected: { variant: 'destructive', tooltip: 'Rejected - needs revision' }
  };
  
  const props = baseProps[timesheet.status];
  
  if (!isOwner && timesheet.status === 'submitted') {
    props.tooltip = 'Requires your approval';
  }
  
  return props;
};

/**
 * Mock current user (replace with actual auth context)
 */
export const getCurrentUser = (): User => {
  // This would typically come from your auth context/store
  return {
    id: 'current-user-id',
    name: 'Current User',
    email: 'user@company.com',
    role: 'manager', // Change this to test different roles
    department: 'Engineering',
    teamMemberIds: ['emp-001', 'emp-002', 'emp-003'] // Team members this user manages
  };
};
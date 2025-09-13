// Leave Management Types - OrangeHRM Style

// Leave Status Types
export type LeaveStatus = 
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'taken';

// Leave Type Definitions
export interface LeaveType {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  maxDaysPerYear: number;
  maxConsecutiveDays: number;
  allowCarryForward: boolean;
  carryForwardLimit?: number;
  requiresApproval: boolean;
  canApplyInAdvance: boolean;
  advanceNoticeDays: number;
  includesWeekends: boolean;
  includesHolidays: boolean;
  color: string;
  description?: string;
}

// Leave Balance
export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  leaveType: LeaveType;
  year: number;
  entitled: number;
  used: number;
  pending: number;
  scheduled: number;
  available: number;
  carriedForward: number;
  lastUpdated: string;
}

// Leave Request
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
    position: string;
    profileImage?: string;
  };
  leaveTypeId: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  duration: 'full_day' | 'half_day_morning' | 'half_day_afternoon' | 'custom';
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  approver?: {
    id: string;
    name: string;
  };
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  cancelledDate?: string;
  cancellationReason?: string;
  comments?: string;
  attachments?: LeaveAttachment[];
  workDaysCount: number;
  isEmergency: boolean;
  emergencyContactInfo?: string;
  handoverNotes?: string;
  backupPersonId?: string;
  backupPerson?: {
    id: string;
    name: string;
  };
}

// Leave Attachment
export interface LeaveAttachment {
  id: string;
  leaveRequestId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedDate: string;
}

// Leave Request Form Data
export interface LeaveRequestFormData {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  duration: 'full_day' | 'half_day_morning' | 'half_day_afternoon' | 'custom';
  customHours?: number;
  reason: string;
  isEmergency: boolean;
  emergencyContactInfo?: string;
  handoverNotes?: string;
  backupPersonId?: string;
  attachments?: File[];
}

// Leave Calendar Event
export interface LeaveCalendarEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  numberOfDays: number;
  duration: string;
}

// Leave Statistics
export interface LeaveStatistics {
  totalEmployees: number;
  onLeaveToday: number;
  pendingApprovals: number;
  upcomingLeaves: number;
  leavesByType: Array<{
    leaveType: string;
    count: number;
    percentage: number;
  }>;
  leavesByStatus: Array<{
    status: LeaveStatus;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    approved: number;
    pending: number;
    rejected: number;
  }>;
}

// Leave Policy
export interface LeavePolicy {
  id: string;
  name: string;
  description: string;
  applicableToAllEmployees: boolean;
  eligibleEmployeeIds?: string[];
  eligibleDepartments?: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  leaveTypes: Array<{
    leaveTypeId: string;
    entitlementDays: number;
    probationPeriodDays?: number;
  }>;
  rules: {
    maxConsecutiveDays?: number;
    minAdvanceNoticeDays?: number;
    blackoutPeriods?: Array<{
      startDate: string;
      endDate: string;
      reason: string;
    }>;
    requireManagerApproval: boolean;
    requireHRApproval: boolean;
    allowCarryForward: boolean;
    carryForwardLimit?: number;
  };
  isActive: boolean;
}

// Employee Leave Summary
export interface EmployeeLeaveSummary {
  employeeId: string;
  employee: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
    joiningDate: string;
  };
  currentYear: number;
  totalEntitled: number;
  totalUsed: number;
  totalPending: number;
  totalAvailable: number;
  balances: LeaveBalance[];
  recentRequests: LeaveRequest[];
  upcomingLeaves: LeaveRequest[];
}

// Leave Approval Workflow
export interface LeaveApprovalStep {
  id: string;
  stepNumber: number;
  approverRole: 'manager' | 'hr' | 'admin';
  approverId?: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvedDate?: string;
  comments?: string;
  isRequired: boolean;
}

export interface LeaveApprovalWorkflow {
  id: string;
  leaveRequestId: string;
  currentStep: number;
  totalSteps: number;
  status: 'in_progress' | 'completed' | 'rejected';
  steps: LeaveApprovalStep[];
  startedDate: string;
  completedDate?: string;
}

// Leave Report Filters
export interface LeaveReportFilters {
  employeeIds?: string[];
  departmentIds?: string[];
  leaveTypeIds?: string[];
  status?: LeaveStatus[];
  fromDate?: string;
  toDate?: string;
  includePending?: boolean;
  includeWeekends?: boolean;
}

// Leave Report Data
export interface LeaveReportData {
  employee: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
  };
  leaveType: string;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  status: LeaveStatus;
  appliedDate: string;
  approvedDate?: string;
  reason: string;
}

// Notification Types
export interface LeaveNotification {
  id: string;
  type: 'request_submitted' | 'request_approved' | 'request_rejected' | 'balance_low' | 'leave_reminder';
  recipientId: string;
  senderId?: string;
  leaveRequestId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdDate: string;
  actionRequired?: boolean;
  actionUrl?: string;
}

// Public Holiday
export interface PublicHoliday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
  applicableToAll: boolean;
  applicableCountries?: string[];
  applicableDepartments?: string[];
  description?: string;
  isActive: boolean;
}

// Leave Entitlement Rules
export interface LeaveEntitlementRule {
  id: string;
  name: string;
  leaveTypeId: string;
  employeeCriteria: {
    departments?: string[];
    positions?: string[];
    employmentTypes?: string[];
    minTenureMonths?: number;
  };
  entitlementCalculation: {
    type: 'fixed' | 'accrual' | 'tenure_based';
    baseAmount: number;
    accrualRate?: number; // days per month
    tenureBasedRules?: Array<{
      minMonths: number;
      maxMonths?: number;
      entitlementDays: number;
    }>;
  };
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
}

// Leave Dashboard Data
export interface LeaveDashboardData {
  myLeaveBalance: LeaveBalance[];
  myRecentRequests: LeaveRequest[];
  myUpcomingLeaves: LeaveRequest[];
  teamOnLeave?: Array<{
    employee: {
      id: string;
      name: string;
    };
    leaveType: string;
    fromDate: string;
    toDate: string;
  }>;
  pendingApprovals?: LeaveRequest[];
  leaveCalendarEvents: LeaveCalendarEvent[];
  statistics: LeaveStatistics;
  notifications: LeaveNotification[];
}
export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

// Blocked Date (weekends and leave days)
export type BlockedDate = {
  date: string; // ISO date (YYYY-MM-DD)
  reason: string; // "Weekend" | "On leave: [Leave Type]"
  type: "weekend" | "leave";
  leave_id?: string; // UUID if type is "leave"
};

// Timesheet Entry (matches backend structure)
export type TimesheetEntry = {
  id?: string; // UUID
  timesheet?: string; // UUID reference to parent timesheet

  // Project and Activity
  project: string; // UUID reference to Project
  project_name?: string; // Read-only

  // Hybrid Activity (either ActivityPlan OR custom text)
  activity_plan?: string; // UUID reference to ActivityPlan (optional)
  custom_activity?: string; // Custom text (optional)
  activity_name?: string; // Read-only (computed from activity_plan or custom_activity)
  activity_description?: string; // Read-only
  is_custom_activity?: boolean; // Read-only

  // Entry details
  date: string; // ISO date (YYYY-MM-DD)
  hours_worked: number; // Decimal (0.01 to 24.00)
  description?: string;

  // Audit
  created_datetime?: string;
  updated_datetime?: string;
};

// Full Timesheet Object (matches backend structure)
export type Timesheet = {
  id: string; // UUID
  employee: string; // UUID reference
  employee_detail?: {
    id: string;
    legal_firstname: string;
    legal_lastname: string;
    email: string;
    designation?: {
      id: string;
      name: string;
    };
  };

  // Period
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string; // ISO date (YYYY-MM-DD)

  // Status
  status: TimesheetStatus;
  is_submitted?: boolean; // Backwards compatibility
  is_approved?: boolean; // Backwards compatibility

  // Approval workflow
  approver?: {
    id: string;
    name: string;
    position?: string;
  };
  submitted_datetime?: string; // ISO datetime
  approved_by?: string; // UUID
  approved_datetime?: string; // ISO datetime
  rejection_reason?: string;

  // Entries
  entries: TimesheetEntry[];
  total_hours: number; // Decimal, auto-calculated

  // Dates info
  blocked_dates?: BlockedDate[];
  available_dates?: string[]; // ISO dates

  // Audit
  created_datetime?: string;
  updated_datetime?: string;
};

// Legacy TimesheetSummary for backwards compatibility
export type TimesheetSummary = Timesheet & {
  weekPeriod?: {
    startDate: string;
    endDate: string;
  };
  totalHours?: number;
  submittedDate?: string;
  approvedDate?: string;
};

// Create Timesheet Request
export type CreateTimesheetRequest = {
  start_date: string;
  end_date: string;
  entries: Omit<TimesheetEntry, 'id' | 'timesheet' | 'created_datetime' | 'updated_datetime' | 'project_name' | 'activity_name' | 'activity_description' | 'is_custom_activity'>[];
};

// Update Timesheet Request
export type UpdateTimesheetRequest = Partial<CreateTimesheetRequest>;

// Submit Timesheet Request
export type SubmitTimesheetRequest = {
  approver_id?: string; // Optional: Designate who should approve
};

// Approve Timesheet Request
export type ApproveTimesheetRequest = {
  comments?: string;
};

// Reject Timesheet Request
export type RejectTimesheetRequest = {
  reason: string; // Required
  comments?: string;
};

// Validation Response
export type TimesheetValidationResponse = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  total_hours: number;
};

// Blocked Dates Response
export type BlockedDatesResponse = {
  blocked_dates: BlockedDate[];
  available_dates: string[];
  timesheet_period: {
    start_date: string;
    end_date: string;
  };
};

// Dashboard Response
export type TimesheetDashboardResponse = {
  my_timesheets: Timesheet[];
  pending_approvals: Timesheet[];
  statistics: {
    submitted: number;
    approved: number;
    rejected: number;
  };
};

// Legacy type for compatibility
export type TimesheetResults = {
  employee: string;
  projects: string[];
  hours: string;
};

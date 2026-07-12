// ===========================
// ENUMS & STATUS TYPES
// ===========================

export type ChecklistStatus =
  | "staff_to_submit"
  | "awaiting_dept_clearance"
  | "awaiting_it_clearance"
  | "awaiting_finance_clearance"
  | "awaiting_hr_approval"
  | "awaiting_md_approval"
  | "fully_approved";

export type TerminalBenefitStatus =
  | "not_prepared"
  | "prepared"
  | "not_fully_signed"
  | "fully_signed";

export type PaymentStatus =
  | "not_submitted"
  | "submitted_to_finance"
  | "paid"
  | "payment_confirmed";

export type ExitMethod = "Voluntary Separation" | "End Of Project" | "Dismissal";

// ===========================
// USER TYPES
// ===========================

export interface UserBasic {
  id: string;
  name: string;
  email: string;
}

// ===========================
// CHECKLIST ITEM TYPES
// ===========================

export interface SeparationChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: "DEPARTMENTAL" | "IT" | "FINANCE" | "HR";
  is_completed: boolean;
  completed_by?: UserBasic;
  completed_at?: string;
  due_date?: string;
  is_mandatory: boolean;
  assigned_to?: UserBasic;
  notes?: string;
  order: number;
  requires_signature: boolean;
  approved_by?: UserBasic;
  approved_date?: string;
}

// ===========================
// EMPLOYEE SEPARATION TYPES
// ===========================

export interface SeparationManagement {
  id: string;
  employee: {
    id: string;
    employee_number?: string;
    legal_firstname: string;
    legal_lastname: string;
    full_name?: string;
    position?: {
      id: string;
      name: string;
    };
    grade?: string;
    location?: {
      id: string;
      name: string;
      state?: string;
    };
  };
  exit_method: ExitMethod;
  project?: {
    id: string;
    project_id?: string;
    title?: string;
    project_name?: string;
  };
  submit_date: string;
  exit_date: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";

  // Severance and Benefits
  severance_amount?: number;
  final_pay_amount?: number;
  unused_leave_days?: number;
  unused_leave_amount?: number;
  benefits_info?: string;
  payment_date?: string;

  // Evaluation and Feedback
  performance_rating?: string;
  evaluation_notes?: string;
  exit_feedback?: string;
  rehire_eligible?: boolean;

  // Additional fields
  reason_for_leaving?: string;
  notice_period?: number;
  handover_completed?: boolean;
  assets_returned?: boolean;
  clearance_status?: "Pending" | "In Progress" | "Completed";

  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// ===========================
// EXIT TRACKER TYPES
// ===========================

export interface ExitTrackerEmployee {
  id: string;
  employee_number: string;
  legal_firstname: string;
  legal_lastname: string;
  full_name: string;
  position: {
    id: string;
    name: string;
  } | null;
  grade: string | null;
  location: {
    id: string;
    name: string;
    state: string;
  } | null;
}

export interface ExitTrackerSeparation {
  id: string;
  employee: ExitTrackerEmployee;
  exit_method: string;
  project?: {
    id: string;
    project_id: string;
    title: string;
  };
  submit_date: string;
  exit_date: string;

  // Three Status Columns (matching Excel tracker)
  checklist_status: ChecklistStatus;
  checklist_status_display: string;
  terminal_benefit_status: TerminalBenefitStatus;
  terminal_benefit_status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;

  // HR Staff Assignment
  assigned_hr_staff?: UserBasic;

  // Terminal Benefits Breakdown (8 components)
  final_basic_salary: string;
  final_transportation: string;
  annual_bonus_13th: string;
  housing_allowance: string;
  miscellaneous: string;
  pension_contribution: string;
  annual_leave_balance_amount: string;
  gratuity_pay: string;
  severance_amount?: string;

  // Staff Obligations
  staff_owes_amount: string;
  staff_owes_notes?: string;

  // Computed Financial Fields
  total_terminal_benefits: string;
  net_amount_payable: string;

  // Department Clearances
  dept_cleared_by?: UserBasic;
  dept_cleared_date?: string;
  it_cleared_by?: UserBasic;
  it_cleared_date?: string;
  finance_cleared_by?: UserBasic;
  finance_cleared_date?: string;
  hr_cleared_by?: UserBasic;
  hr_cleared_date?: string;
  md_approved_by?: UserBasic;
  md_approved_date?: string;

  // Computed Progress Fields
  days_since_separation: number;
  current_bottleneck: string;
  is_fully_complete: boolean;

  // Checklist Items
  checklist_items?: SeparationChecklistItem[];

  // Metadata
  created_at?: string;
  updated_at?: string;
}

// ===========================
// API RESPONSE TYPES
// ===========================

export interface PaginatedSeparationResponse {
  status: boolean;
  message: string;
  data: {
    results: ExitTrackerSeparation[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export interface SeparationManagementCreate {
  employee: string; // UUID
  exit_method: string;
  project?: string; // UUID
  submit_date: string;
  exit_date: string;
  reason_for_leaving?: string;
  notice_period?: number;
}

export interface SeparationManagementUpdate {
  exit_method?: string;
  project?: string;
  submit_date?: string;
  exit_date?: string;
  status?: string;
  severance_amount?: number;
  final_pay_amount?: number;
  unused_leave_days?: number;
  unused_leave_amount?: number;
  benefits_info?: string;
  payment_date?: string;
  performance_rating?: string;
  evaluation_notes?: string;
  exit_feedback?: string;
  rehire_eligible?: boolean;
  reason_for_leaving?: string;
  notice_period?: number;
  handover_completed?: boolean;
  assets_returned?: boolean;
  clearance_status?: string;
}

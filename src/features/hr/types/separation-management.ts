export interface SeparationManagement {
  id: string;
  employee: {
    id: string;
    employee_number?: string;
    legal_firstname: string;
    legal_lastname: string;
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
  exit_method: "Voluntary Separation" | "End Of Project" | "Dismissal";
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

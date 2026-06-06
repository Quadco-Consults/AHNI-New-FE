/**
 * Payroll Payment Types
 *
 * For Finance module to process HR-approved payrolls.
 * Integrates HR payroll with Finance payment tracking and project cost allocation.
 */

export interface ProjectAllocation {
  project_id: string;
  project_code: string;
  project_name: string;
  allocated_amount: number;
  percentage: number;
}

export interface PendingPayroll {
  id: string;
  month: string; // Format: "2026-01"
  year: number;
  total_employees: number;
  total_gross_payment: number;
  total_deductions: number;
  total_net_payment: number;
  status: 'approved' | 'paid';
  created_by?: string;
  created_datetime: string;
  project_breakdown: ProjectAllocation[];
}

export interface PayrollDetails extends PendingPayroll {
  notes?: string;
  payment_date?: string;
  paid_by?: string;
  payment_reference?: string;
  bank_account?: {
    id: string;
    bank_name: string;
    account_number: string;
  };
  disbursement?: {
    id: string;
    disbursement_number: string;
  };
  records_sample: PayrollRecordSummary[];
  total_records: number;
}

export interface PayrollRecordSummary {
  employee_name: string;
  employee_number: string;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  project_allocations: Record<string, number>; // { "project_id": percentage }
}

export interface ProcessPayrollPaymentRequest {
  payment_date: string;
  bank_account_id: string;
  payment_reference: string;
}

export interface ProcessPayrollPaymentResponse {
  status: string;
  message: string;
  data: {
    disbursement_number: string;
    disbursement_id: string;
    amount: number;
    payment_date: string;
    payroll_batch_id: string;
    payroll_month: string;
  };
}

export interface PayrollPaymentSummary {
  pending_count: number;
  pending_value: number;
  paid_this_month_count: number;
  paid_this_month_value: number;
  by_project: Record<string, {
    employee_count: number;
    total_amount: number;
  }>;
}

// API Response
export interface PayrollPaymentResponse {
  status: string;
  message: string;
  data: PendingPayroll | PendingPayroll[] | PayrollDetails | PayrollPaymentSummary;
}

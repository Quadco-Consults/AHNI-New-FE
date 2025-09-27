export interface Employee {
  id: string;
  name: string;
  employee_id: string;
  position: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
  level: {
    id: string;
    name: string;
  };
  basic_salary: number;
  department?: string;
  email?: string;
}

export interface PayrollItem {
  employee_id: string;
  employee_name: string;
  basic_salary: number;
  allowances: {
    transport?: number;
    housing?: number;
    medical?: number;
    overtime?: number;
    bonus?: number;
  };
  deductions: {
    tax?: number;
    pension?: number;
    nhis?: number;
    loan?: number;
    other?: number;
  };
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
}

export interface PayrollGeneration {
  month: string;
  year: number;
  employees: string[]; // Array of employee IDs
  generated_by?: string;
}

export interface GeneratedPayroll {
  id: string;
  month: string;
  year: number;
  total_employees: number;
  total_gross_payment: number;
  total_deductions: number;
  total_net_payment: number;
  generated_at: string;
  generated_by: string;
  status: 'draft' | 'approved' | 'paid';
  payroll_items: PayrollItem[];
}

export interface PayrollSummary {
  total_employees: number;
  total_gross_payment: number;
  total_deductions: number;
  total_net_payment: number;
}
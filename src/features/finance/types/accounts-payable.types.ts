/**
 * Accounts Payable Types
 * TypeScript interfaces for vendor bills, payments, and expense reports
 */

// ==================== Vendor Bill Types ====================

export type VendorBillStatus =
  | "draft"
  | "pending"
  | "approved"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "disputed"
  | "cancelled";

export type PaymentMethod =
  | "bank_transfer"
  | "check"
  | "cash"
  | "wire_transfer"
  | "electronic"
  | "other";

export interface VendorBill {
  id: string;
  bill_number: string;
  vendor_invoice_number?: string;
  vendor: string; // UUID
  vendor_name?: string;
  vendor_details?: {
    id: string;
    company_name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  };
  purchase_order?: string; // UUID
  purchase_order_number?: string;
  project?: string; // UUID
  project_name?: string;
  bill_date: string; // ISO date
  due_date: string; // ISO date
  description?: string;
  subtotal: string; // Decimal as string
  tax_rate: string; // Decimal as string
  tax_amount: string; // Decimal as string
  total_amount: string; // Decimal as string
  paid_amount: string; // Decimal as string
  outstanding_amount: string; // Decimal as string
  status: VendorBillStatus;
  payment_terms?: string;
  notes?: string;
  vendor_invoice_document?: string; // File URL
  receipt_document?: string; // File URL
  submitted_by?: string; // User UUID
  submitted_by_name?: string;
  submitted_datetime?: string; // ISO datetime
  approved_by?: string; // User UUID
  approved_by_name?: string;
  approved_datetime?: string; // ISO datetime
  approval_notes?: string;
  journal_entry?: string; // UUID
  recovery_invoice?: string; // UUID
  recovery_invoice_number?: string;
  is_overdue?: boolean;
  days_overdue?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface VendorBillLine {
  id?: string;
  bill?: string; // UUID
  line_number: number;
  description: string;
  quantity: string; // Decimal as string
  unit_price: string; // Decimal as string
  line_total: string; // Decimal as string
  purchase_order_item?: string; // UUID
  expense_account?: string; // UUID
  expense_account_name?: string;
}

// ==================== Vendor Payment Types ====================

export interface VendorPayment {
  id: string;
  payment_number: string;
  vendor: string; // UUID
  vendor_name?: string;
  vendor_bill: string; // UUID
  bill_number?: string;
  payment_date: string; // ISO date
  amount: string; // Decimal as string
  payment_method: PaymentMethod;
  reference_number?: string;
  bank_account?: string; // UUID
  bank_account_name?: string;
  notes?: string;
  approved_by?: string; // User UUID
  approved_by_name?: string;
  approved_datetime?: string; // ISO datetime
  journal_entry?: string; // UUID
  created_by?: string; // User UUID
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

// ==================== Expense Report Types ====================

export type ExpenseReportStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "reimbursed"
  | "rejected";

export type ExpenseType =
  | "travel"
  | "accommodation"
  | "meals"
  | "transportation"
  | "office_supplies"
  | "communication"
  | "training"
  | "other";

export interface ExpenseReport {
  id: string;
  report_number: string;
  employee: string; // User UUID
  employee_name?: string;
  project?: string; // UUID
  project_name?: string;
  report_date: string; // ISO date
  description: string;
  total_amount: string; // Decimal as string
  status: ExpenseReportStatus;
  submitted_datetime?: string; // ISO datetime
  approved_by?: string; // User UUID
  approved_by_name?: string;
  approved_datetime?: string; // ISO datetime
  reimbursed_datetime?: string; // ISO datetime
  journal_entry?: string; // UUID
  created_at: string;
  updated_at: string;
}

export interface ExpenseReportLine {
  id?: string;
  expense_report?: string; // UUID
  line_number: number;
  expense_date: string; // ISO date
  expense_type: ExpenseType;
  description: string;
  amount: string; // Decimal as string
  receipt_document?: string; // File URL
  expense_account?: string; // UUID
  expense_account_name?: string;
  recovery_invoice?: string; // UUID
  recovery_invoice_number?: string;
}

// ==================== Vendor Types ====================

export interface Vendor {
  id: string;
  company_name: string;
  vendor_number?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_terms?: string;
  status: "active" | "inactive";
  total_owed?: string; // Decimal as string
  created_at: string;
}

// ==================== Filter Types ====================

export interface VendorBillFilters {
  status?: VendorBillStatus | "all";
  vendor?: string; // UUID
  project?: string; // UUID
  purchase_order?: string; // UUID
  date_from?: string; // ISO date
  date_to?: string; // ISO date
  due_date_from?: string; // ISO date
  due_date_to?: string; // ISO date
  overdue_only?: boolean;
  has_recovery_invoice?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface VendorPaymentFilters {
  vendor?: string; // UUID
  bill?: string; // UUID
  payment_method?: PaymentMethod;
  date_from?: string; // ISO date
  date_to?: string; // ISO date
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ExpenseReportFilters {
  employee?: string; // User UUID
  project?: string; // UUID
  status?: ExpenseReportStatus | "all";
  date_from?: string; // ISO date
  date_to?: string; // ISO date
  search?: string;
  page?: number;
  page_size?: number;
}

// ==================== API Response Types ====================

export interface VendorBillListResponse {
  status: string;
  message: string;
  data: VendorBill[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    pages: number;
  };
}

export interface VendorBillDetailResponse {
  status: string;
  message: string;
  data: VendorBill & {
    lines: VendorBillLine[];
    payments: VendorPayment[];
  };
}

export interface VendorPaymentListResponse {
  status: string;
  message: string;
  data: VendorPayment[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    pages: number;
  };
}

export interface ExpenseReportListResponse {
  status: string;
  message: string;
  data: ExpenseReport[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    pages: number;
  };
}

export interface VendorBillStats {
  total_bills: number;
  total_amount: string; // Decimal as string
  total_paid: string; // Decimal as string
  total_outstanding: string; // Decimal as string
  overdue_bills: number;
  overdue_amount: string; // Decimal as string
  bills_by_status: {
    draft: number;
    pending: number;
    approved: number;
    paid: number;
    partially_paid: number;
    overdue: number;
    disputed: number;
    cancelled: number;
  };
}

// ==================== Input Types ====================

export interface CreateVendorBillInput {
  vendor: string; // UUID
  purchase_order?: string; // UUID
  project?: string; // UUID
  bill_date: string; // ISO date
  due_date: string; // ISO date
  vendor_invoice_number?: string;
  description?: string;
  payment_terms?: string;
  notes?: string;
  tax_rate?: string; // Decimal as string
  vendor_invoice_document?: File;
  receipt_document?: File;
  lines: Omit<VendorBillLine, "id" | "bill">[];
}

export interface UpdateVendorBillInput extends Partial<CreateVendorBillInput> {
  id: string;
}

export interface CreateVendorPaymentInput {
  vendor: string; // UUID
  vendor_bill: string; // UUID
  payment_date: string; // ISO date
  amount: string; // Decimal as string
  payment_method: PaymentMethod;
  reference_number?: string;
  bank_account?: string; // UUID
  notes?: string;
}

export interface UpdateVendorPaymentInput extends Partial<CreateVendorPaymentInput> {
  id: string;
}

export interface CreateExpenseReportInput {
  employee: string; // User UUID
  project?: string; // UUID
  report_date: string; // ISO date
  description: string;
  lines: Omit<ExpenseReportLine, "id" | "expense_report">[];
}

export interface UpdateExpenseReportInput extends Partial<CreateExpenseReportInput> {
  id: string;
}

// ==================== Action Input Types ====================

export interface SubmitBillForApprovalInput {
  id: string;
}

export interface ApproveBillInput {
  id: string;
  approval_notes?: string;
}

export interface RejectBillInput {
  id: string;
  rejection_notes: string;
}

export interface VoidBillInput {
  id: string;
  void_reason: string;
}

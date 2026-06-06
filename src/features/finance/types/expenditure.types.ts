/**
 * Expenditure (Recorded Expense) Types
 * Types for actual expenses recorded in accounting books
 */

export interface Expenditure {
  id: string;
  expenditure_number: string;

  // Basic Information
  title: string;
  description: string;
  expenditure_category: ExpenditureCategory;

  // Financial Details
  amount: number;
  currency: string;

  // Transaction Details
  transaction_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  receipt_number?: string;

  // Vendor/Payee Information
  payee_name: string;
  payee_type: PayeeType;
  vendor_id?: string;
  employee_id?: string;

  // Allocation
  budget_line_item?: {
    id: string;
    name: string;
    code: string;
  };
  project?: {
    id: string;
    title: string;
    project_id: string;
  };
  department?: string;
  cost_center?: string;

  // Accounting
  account?: {
    id: string;
    name: string;
    account_number: string;
    account_type: string;
  };
  chart_of_account_id?: string;

  // QuickBooks Integration
  quickbooks_expense_id?: string;
  quickbooks_sync_status: QuickBooksSyncStatus;
  last_synced_at?: string;
  sync_error?: string;

  // Linked Records
  obligation?: {
    id: string;
    obligation_number: string;
  };
  disbursement?: {
    id: string;
    disbursement_number: string;
  };
  petty_cash_request?: {
    id: string;
    request_number: string;
  };

  // Status and Workflow
  status: ExpenditureStatus;
  approval_status: ApprovalStatus;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: {
    id: string;
    name: string;
    email: string;
  };
  rejection_reason?: string;
  posted_at?: string;
  posted_by?: {
    id: string;
    name: string;
  };

  // Tax Information
  is_taxable: boolean;
  tax_rate?: number;
  tax_amount?: number;
  withholding_tax?: number;

  // Documents
  notes?: string;
  attachments?: ExpenditureAttachment[];

  // Audit Trail
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
  created_datetime: string;
  updated_datetime: string;
  voided_at?: string;
  voided_by?: {
    id: string;
    name: string;
  };
  void_reason?: string;
}

export interface ExpenditureAttachment {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by?: {
    id: string;
    name: string;
  };
}

export type ExpenditureCategory =
  | 'office_supplies'
  | 'utilities'
  | 'travel'
  | 'accommodation'
  | 'meals'
  | 'transportation'
  | 'professional_services'
  | 'equipment'
  | 'software'
  | 'training'
  | 'marketing'
  | 'rent'
  | 'salaries'
  | 'benefits'
  | 'insurance'
  | 'taxes'
  | 'miscellaneous'
  | 'other';

export type PaymentMethod =
  | 'cash'
  | 'check'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'mobile_money'
  | 'other';

export type PayeeType =
  | 'vendor'
  | 'employee'
  | 'contractor'
  | 'government'
  | 'other';

export type ExpenditureStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'posted'
  | 'rejected'
  | 'voided';

export type ApprovalStatus =
  | 'not_submitted'
  | 'pending'
  | 'approved'
  | 'rejected';

export type QuickBooksSyncStatus =
  | 'not_synced'
  | 'pending_sync'
  | 'synced'
  | 'sync_failed';

export interface CreateExpenditureRequest {
  title: string;
  description: string;
  expenditure_category: ExpenditureCategory;
  amount: number;
  currency?: string;
  transaction_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  receipt_number?: string;
  payee_name: string;
  payee_type: PayeeType;
  vendor_id?: string;
  employee_id?: string;
  budget_line_item?: string; // budget line item ID
  project?: string; // project ID
  department?: string;
  cost_center?: string;
  chart_of_account_id?: string;
  obligation?: string; // obligation ID
  disbursement?: string; // disbursement ID
  is_taxable?: boolean;
  tax_rate?: number;
  notes?: string;
  attachments?: File[];
}

export interface UpdateExpenditureRequest {
  title?: string;
  description?: string;
  expenditure_category?: ExpenditureCategory;
  amount?: number;
  transaction_date?: string;
  payment_method?: PaymentMethod;
  reference_number?: string;
  receipt_number?: string;
  payee_name?: string;
  payee_type?: PayeeType;
  budget_line_item?: string;
  project?: string;
  department?: string;
  cost_center?: string;
  chart_of_account_id?: string;
  is_taxable?: boolean;
  tax_rate?: number;
  notes?: string;
}

export interface ApproveExpenditureRequest {
  action: 'approve' | 'reject';
  comments?: string;
}

export interface PostExpenditureRequest {
  posting_date?: string;
  notes?: string;
}

export interface VoidExpenditureRequest {
  void_reason: string;
}

export interface SyncToQuickBooksRequest {
  expenditure_ids?: string[];
  sync_all?: boolean;
}

export interface ExpenditureFilters {
  status?: ExpenditureStatus;
  expenditure_category?: ExpenditureCategory;
  approval_status?: ApprovalStatus;
  payment_method?: PaymentMethod;
  payee_type?: PayeeType;
  project?: string;
  budget_line_item?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  quickbooks_sync_status?: QuickBooksSyncStatus;
  page?: number;
  size?: number;
}

export interface ExpenditureSummary {
  total_expenditures: number;
  total_amount: number;
  by_status: {
    draft: number;
    pending_approval: number;
    approved: number;
    posted: number;
    rejected: number;
    voided: number;
  };
  by_category: {
    office_supplies: number;
    utilities: number;
    travel: number;
    accommodation: number;
    meals: number;
    transportation: number;
    professional_services: number;
    equipment: number;
    software: number;
    training: number;
    marketing: number;
    rent: number;
    salaries: number;
    benefits: number;
    insurance: number;
    taxes: number;
    miscellaneous: number;
    other: number;
  };
  by_payment_method: {
    cash: number;
    check: number;
    bank_transfer: number;
    credit_card: number;
    debit_card: number;
    mobile_money: number;
    other: number;
  };
  total_tax_amount: number;
  pending_approval_amount: number;
  posted_amount: number;
  quickbooks_synced_count: number;
  quickbooks_pending_sync_count: number;
}

export interface ExpenditureMetadata {
  expenditure_categories: Array<{ value: ExpenditureCategory; label: string }>;
  payment_methods: Array<{ value: PaymentMethod; label: string }>;
  payee_types: Array<{ value: PayeeType; label: string }>;
  projects: Array<{ id: string; title: string; project_id: string }>;
  budget_line_items: Array<{ id: string; name: string; code: string; available_budget: number }>;
  chart_of_accounts: Array<{ id: string; name: string; account_number: string; account_type: string }>;
  departments: string[];
  cost_centers: string[];
}

export interface ExpenditureApiResponse<T = any> {
  status: string;
  message?: string;
  data: T;
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  filters?: ExpenditureFilters;
  include_attachments?: boolean;
}

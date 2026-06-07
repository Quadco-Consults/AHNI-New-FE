/**
 * Payment Disbursement Types
 *
 * Tracks when money ACTUALLY leaves the bank account.
 * Links approved Payment Requests and Payroll Batches to bank transactions.
 */

export type PaymentType =
  | 'PAYMENT_REQUEST'
  | 'PAYROLL'
  | 'VENDOR'
  | 'PETTY_CASH'
  | 'HONOUR_CERTIFICATE'
  | 'OTHER';

export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'CHEQUE'
  | 'CASH'
  | 'MOBILE_MONEY'
  | 'DIRECT_DEBIT'
  | 'WIRE_TRANSFER';

export type DisbursementStatus =
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED'
  | 'CANCELLED';

export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';

export interface PaymentDisbursement {
  id: string;
  disbursement_number: string;
  payment_type: PaymentType;
  payment_type_display: string;

  // Source links
  payment_request?: string; // UUID
  payroll_batch?: string; // UUID
  honour_certificate?: string; // UUID

  // Payment details
  payment_date: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  total_amount: number;
  currency: Currency;

  // Status
  status: DisbursementStatus;
  status_display: string;

  // Bank details
  bank_account: string; // UUID
  bank_account_name?: string;
  bank_account_number?: string;
  payment_reference: string;

  // Processing info
  processed_by?: string; // UUID
  processed_by_name?: string;
  bank_confirmation_date?: string;
  confirmed_by?: string; // UUID
  confirmed_by_name?: string;

  // Project link
  project?: string; // UUID
  project_id?: string;
  project_name?: string;

  // Accounting
  journal_entry?: string; // UUID

  // Metadata
  notes?: string;
  failure_reason?: string;
  source_description: string;

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
  created_by?: string;
}

export interface PaymentDisbursementDetails extends PaymentDisbursement {
  bank_account_details?: {
    id: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    current_balance: number;
  };

  processed_by_details?: {
    id: string;
    name: string;
    email: string;
  };

  confirmed_by_details?: {
    id: string;
    name: string;
    email: string;
  };

  project_details?: {
    id: string;
    project_id: string;
    title: string;
    donor: string;
  };

  payment_request_details?: {
    id: string;
    payment_reason: string;
    total_amount: number;
    status: string;
  };

  payroll_batch_details?: {
    id: string;
    month: string;
    total_employees: number;
    total_net_payment: number;
  };
}

export interface CreatePaymentDisbursement {
  // Source (one required)
  payment_request_id?: string;
  payroll_batch_id?: string;

  // Payment details
  payment_date: string;
  payment_method: PaymentMethod;
  bank_account_id: string;
  chart_account_id: string; // Chart of Account for expense allocation
  payment_reference: string;
  total_amount: number;
  currency?: Currency;

  // Optional
  project_id?: string;
  notes?: string;
}

export interface UpdateDisbursementStatus {
  status: DisbursementStatus;
  bank_confirmation_date?: string;
  failure_reason?: string;
  notes?: string;
}

export interface DisbursementStatistics {
  total_count: number;
  total_amount: number;
  this_month_count: number;
  this_month_amount: number;
  by_status: Record<DisbursementStatus, {
    count: number;
    amount: number;
  }>;
  by_type: Record<PaymentType, {
    count: number;
    amount: number;
  }>;
}

export interface PendingPaymentRequest {
  id: string;
  payment_type: string;
  payment_date: string;
  payment_reason: string;
  total_amount: number;
  requested_by?: string;
  status: string;
  created_datetime: string;
  items_count: number;

  // Project & Fund Allocation
  project?: {
    id: string;
    project_id: string;
    title: string;
    donor?: string;
  };
  fund_source?: string;
  budget_line?: {
    id: string;
    code: string;
    name: string;
  };

  // Payment Items
  items?: Array<{
    id?: string;
    description: string;
    amount: number;
    recipient?: string;
  }>;
}

// Filters
export interface PaymentDisbursementFilters {
  status?: DisbursementStatus;
  payment_type?: PaymentType;
  payment_date_from?: string;
  payment_date_to?: string;
  project_id?: string;
  bank_account?: string;
  search?: string;
}

// API Response
export interface PaymentDisbursementResponse {
  status: string;
  message: string;
  data: PaymentDisbursement | PaymentDisbursement[];
  pagination?: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

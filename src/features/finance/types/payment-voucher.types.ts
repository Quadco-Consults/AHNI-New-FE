/**
 * Payment Voucher Types
 *
 * Payment Voucher (PV) - Official payment document generated after processing a payment request.
 * This is the Finance department's record of actual payment made.
 */

export type PaymentMethod =
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "CASH"
  | "MOBILE_MONEY";

export type PaymentVoucherStatus = "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";

export interface PaymentVoucherLineItem {
  id: string;
  line_number: number;
  account_code?: string;
  description: string;
  amount: number;
  is_deduction: boolean;
  created_datetime: string;
}

export interface PaymentVoucher {
  id: string;
  pv_number: string;

  // Links
  payment_request: string; // UUID
  payment_request_id?: string;
  payment_disbursement?: string; // UUID

  // Payment details
  payment_date: string;
  payment_method: PaymentMethod;
  payment_method_display: string;

  // Bank/Payment details
  bank_account: string; // UUID
  bank_account_name?: string;
  bank_account_number?: string;
  payment_reference: string;
  cheque_number?: string;

  // Amounts
  gross_amount: number;
  total_wht: number;
  total_vat: number;
  total_paye: number;
  total_pension: number;
  total_nhis: number;
  net_amount: number;
  total_deductions: number;

  // Project & Budget
  project?: string; // UUID
  project_id?: string;
  project_name?: string;
  budget_line?: string; // UUID
  chart_account: string; // UUID

  // Template fields (matching AHNI PV format)
  fco?: string; // Fund/Cost Object code
  activity_code?: string; // Budget line activity code
  currency: string; // Payment currency (default: NGN)
  amount_in_words?: string; // Net amount in words

  // Status and Approval
  status: PaymentVoucherStatus;
  status_display: string;

  // Approval tracking
  prepared_by?: string; // UUID
  prepared_by_name?: string;
  reviewed_by?: string; // UUID
  approved_by?: string; // UUID

  // Signature dates
  prepared_date?: string;
  reviewed_date?: string;
  authorised_date?: string;
  approved_date?: string;

  // Payee information
  payee_name: string;
  payee_bank?: string;
  payee_account_number?: string;
  payment_description: string;
  notes?: string;

  // Accounting
  journal_entry?: string; // UUID

  // Cancellation
  cancelled_date?: string;
  cancellation_reason?: string;

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
}

export interface PaymentVoucherDetails extends PaymentVoucher {
  // Line items for multi-line PV support
  line_items?: PaymentVoucherLineItem[];

  bank_account_details?: {
    id: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    current_balance: number;
  };

  prepared_by_details?: {
    id: string;
    name: string;
    email: string;
  };

  reviewed_by_details?: {
    id: string;
    name: string;
    email: string;
  };

  approved_by_details?: {
    id: string;
    name: string;
    email: string;
  };

  project_details?: {
    id: string;
    project_id: string;
    title: string;
    donor?: string;
  };

  chart_account_details?: {
    id: string;
    account_code: string;
    account_name: string;
    account_type: string;
  };

  budget_line_details?: {
    id: string;
    name: string;
    code: string;
  };

  payment_request_details?: {
    id: string;
    payment_reason: string;
    total_amount: number;
    gross_amount: number;
    net_amount: number;
    status: string;
    requested_by?: string;
  };

  payment_disbursement_details?: {
    id: string;
    disbursement_number: string;
    payment_date: string;
    total_amount: number;
    status: string;
  };
}

export interface CreatePaymentVoucher {
  // Required fields
  payment_request_id: string;
  payment_date: string;
  payment_method: PaymentMethod;
  bank_account_id: string;
  payment_reference: string;
  chart_account_id: string;

  // Amount fields
  gross_amount: number;
  total_wht?: number;
  total_vat?: number;
  total_paye?: number;
  total_pension?: number;
  total_nhis?: number;
  net_amount: number;

  // Payee information
  payee_name: string;
  payee_bank?: string;
  payee_account_number?: string;
  payment_description: string;

  // Template fields (FCO, Activity Code, etc.)
  fco?: string;
  activity_code?: string;
  currency?: string;

  // Line items for multi-line PV (optional)
  line_items?: Array<{
    line_number: number;
    account_code?: string;
    description: string;
    amount: number;
    is_deduction: boolean;
  }>;

  // Optional fields
  project_id?: string;
  budget_line_id?: string;
  payment_disbursement_id?: string;
  cheque_number?: string;
  notes?: string;
}

export interface UpdatePaymentVoucher {
  payment_date?: string;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  cheque_number?: string;
  notes?: string;
}

export interface UpdatePaymentVoucherStatus {
  status: PaymentVoucherStatus;
  notes?: string;
}

export interface CancelPaymentVoucher {
  cancellation_reason: string;
}

export interface PaymentVoucherStatistics {
  total_count: number;
  total_gross_amount: number;
  total_net_amount: number;
  total_deductions: number;
  this_month_count: number;
  this_month_amount: number;
  by_status: {
    [key: string]: {
      count: number;
      net_amount: number;
    };
  };
  by_payment_method: {
    [key: string]: {
      count: number;
      net_amount: number;
    };
  };
  deductions_breakdown: {
    total_wht: number;
    total_vat: number;
    total_paye: number;
    total_pension: number;
    total_nhis: number;
  };
}

export interface PaymentVoucherFilters {
  status?: PaymentVoucherStatus;
  payment_method?: PaymentMethod;
  payment_date_from?: string;
  payment_date_to?: string;
  project_id?: string;
  payment_request_id?: string;
  search?: string;
}

export interface PaymentVoucherResponse {
  status: string;
  message?: string;
  data: PaymentVoucher[] | PaymentVoucher | PaymentVoucherDetails;
  pagination?: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

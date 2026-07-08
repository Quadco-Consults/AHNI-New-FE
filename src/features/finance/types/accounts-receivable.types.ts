/**
 * Accounts Receivable Types
 * TypeScript interfaces for AR models, customers, invoices, payments, and collection management
 */

// ==================== Customer Types ====================

export type CustomerType = "individual" | "organization" | "government" | "ngo";

export interface Customer {
  id: string;
  customer_code: string;
  customer_name: string;
  customer_type: CustomerType;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  payment_terms: number;
  credit_limit: string;
  tax_id: string;
  is_active: boolean;
  total_outstanding?: string;
  overdue_amount?: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface CreateCustomerInput {
  customer_name: string;
  customer_type: CustomerType;
  contact_person?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  payment_terms?: number;
  credit_limit?: string;
  tax_id?: string;
  is_active?: boolean;
}

// ==================== Invoice Types ====================

export type InvoiceType = "project_invoice" | "adhoc_invoice" | "expense_recovery";
export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface InvoiceLine {
  id: string;
  line_number: number;
  description: string;
  quantity: string;
  unit_price: string;
  line_total: string;
  item?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer: string;
  customer_name?: string;
  project?: string;
  invoice_type: InvoiceType;
  invoice_date: string;
  due_date: string;
  description: string;
  subtotal: string;
  tax_rate: string;
  tax_amount: string;
  total_amount: string;
  paid_amount: string;
  outstanding_amount: string;
  status: InvoiceStatus;
  payment_terms: number;
  notes: string;
  is_overdue?: boolean;
  days_overdue?: number;
  lines?: InvoiceLine[];
  created_datetime: string;
  updated_datetime: string;
}

export interface CreateInvoiceInput {
  customer: string;
  project?: string;
  invoice_type: InvoiceType;
  invoice_date: string;
  due_date: string;
  description?: string;
  tax_rate?: string;
  payment_terms?: number;
  notes?: string;
  lines: {
    line_number: number;
    description: string;
    quantity: string;
    unit_price: string;
    item?: string;
  }[];
}

// ==================== Accounts Receivable Types ====================

export type ARStatus = "current" | "overdue" | "paid" | "partially_paid" | "written_off" | "disputed";
export type AgingBucket = "current" | "past_due_30" | "past_due_60" | "past_due_90" | "past_due_120";
export type CollectionStatus =
  | "not_started"
  | "first_notice_sent"
  | "second_notice_sent"
  | "final_notice_sent"
  | "in_negotiation"
  | "payment_plan_active"
  | "legal_action"
  | "resolved";

export interface AccountsReceivable {
  id: string;
  customer: string;
  customer_name?: string;
  invoice: string;
  invoice_number?: string;
  transaction_type: string;
  transaction_date: string;
  due_date: string;
  original_amount: string;
  current_balance: string;
  amount_paid: string;
  amount_due: string;
  aging_bucket: AgingBucket;
  days_outstanding: number;
  status: ARStatus;
  payment_terms: number;
  currency: string;
  collection_status: CollectionStatus;
  collection_notes: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
  assigned_collector?: string;
  assigned_collector_name?: string;
  is_overdue?: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface ARSummary {
  total_outstanding: string;
  total_overdue: string;
  current: string;
  past_due_30: string;
  past_due_60: string;
  past_due_90: string;
  past_due_120: string;
  total_customers: number;
  average_days_outstanding: number;
  total_receivables: number;
}

// ==================== Payment Types ====================

export type PaymentMethod =
  | "cash"
  | "check"
  | "bank_transfer"
  | "credit_card"
  | "mobile_money"
  | "other";

export interface CustomerPayment {
  id: string;
  payment_number: string;
  customer: string;
  customer_name?: string;
  invoice: string;
  invoice_number?: string;
  payment_date: string;
  amount: string;
  payment_method: PaymentMethod;
  reference_number: string;
  notes: string;
  journal_entry?: string;
  recorded_by: string;
  recorded_by_name?: string;
  created_datetime: string;
}

export interface RecordPaymentInput {
  accounts_receivable_id: string;
  payment_date: string;
  amount: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

// ==================== Collection Activity Types ====================

export type ActivityType =
  | "phone_call"
  | "email"
  | "letter"
  | "visit"
  | "promise_to_pay"
  | "dispute_resolution"
  | "legal_notice";

export interface CollectionActivity {
  id: string;
  accounts_receivable: string;
  activity_date: string;
  activity_type: ActivityType;
  notes: string;
  promise_to_pay_date?: string;
  promise_amount?: string;
  performed_by: string;
  performed_by_name?: string;
  created_datetime: string;
}

export interface CreateCollectionActivityInput {
  accounts_receivable: string;
  activity_date: string;
  activity_type: ActivityType;
  notes: string;
  promise_to_pay_date?: string;
  promise_amount?: string;
}

// ==================== Dunning Letter Types ====================

export type LetterType = "first_notice" | "second_notice" | "final_notice" | "legal_notice";
export type DeliveryMethod = "email" | "mail" | "both";

export interface DunningLetter {
  id: string;
  accounts_receivable: string;
  letter_type: LetterType;
  sent_date: string;
  delivery_method: DeliveryMethod;
  recipient_email: string;
  recipient_address: string;
  content: string;
  sent_by: string;
  sent_by_name?: string;
  created_datetime: string;
}

export interface SendReminderInput {
  template_type: LetterType;
  delivery_method: DeliveryMethod;
  custom_message?: string;
}

// ==================== Credit Memo Types ====================

export type CreditMemoStatus = "open" | "applied" | "closed";

export interface CreditMemo {
  id: string;
  memo_number: string;
  customer: string;
  customer_name?: string;
  invoice?: string;
  invoice_number?: string;
  memo_date: string;
  credit_amount: string;
  amount_applied: string;
  amount_remaining: string;
  reason: string;
  description: string;
  status: CreditMemoStatus;
  journal_entry?: string;
  created_by: string;
  created_by_name?: string;
  created_datetime: string;
}

export interface CreateCreditMemoInput {
  customer: string;
  invoice?: string;
  memo_date: string;
  credit_amount: string;
  reason: string;
  description?: string;
}

// ==================== Payment Plan Types ====================

export type PaymentPlanStatus = "active" | "completed" | "defaulted" | "cancelled";
export type InstallmentFrequency = "weekly" | "bi_weekly" | "monthly" | "quarterly";

export interface PaymentPlan {
  id: string;
  accounts_receivable: string;
  plan_number: string;
  start_date: string;
  total_amount: string;
  down_payment: string;
  installment_amount: string;
  number_of_installments: number;
  frequency: InstallmentFrequency;
  interest_rate: string;
  late_fee_amount: string;
  grace_period_days: number;
  status: PaymentPlanStatus;
  notes: string;
  created_by: string;
  created_by_name?: string;
  created_datetime: string;
}

export interface CreatePaymentPlanInput {
  accounts_receivable: string;
  start_date: string;
  total_amount: string;
  down_payment?: string;
  installment_amount: string;
  number_of_installments: number;
  frequency: InstallmentFrequency;
  interest_rate?: string;
  late_fee_amount?: string;
  grace_period_days?: number;
  notes?: string;
}

// ==================== Action Input Types ====================

export interface UpdateCollectionStatusInput {
  collection_status: CollectionStatus;
  collection_notes?: string;
  next_follow_up_date?: string;
}

export interface WriteOffInput {
  ar_id: string;
  write_off_amount: string;
  write_off_reason: string;
  write_off_date: string;
}

// ==================== Filter Types ====================

export interface ARFilters {
  customer_id?: string;
  status?: ARStatus | "all";
  aging_bucket?: AgingBucket | "all";
  collection_status?: CollectionStatus | "all";
  date_from?: string;
  date_to?: string;
  amount_min?: string;
  amount_max?: string;
  overdue_only?: boolean;
  assigned_collector?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface CustomerFilters {
  customer_type?: CustomerType | "all";
  is_active?: boolean;
  has_overdue?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface InvoiceFilters {
  customer_id?: string;
  project_id?: string;
  invoice_type?: InvoiceType | "all";
  status?: InvoiceStatus | "all";
  overdue_only?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface PaymentFilters {
  customer_id?: string;
  invoice_id?: string;
  payment_method?: PaymentMethod | "all";
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

// ==================== Response Types ====================

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface ARListResponse {
  data: AccountsReceivable[];
  message: string;
  pagination: PaginationMeta;
}

export interface ARDetailResponse {
  data: AccountsReceivable;
  message: string;
}

export interface ARSummaryResponse {
  data: ARSummary;
  message: string;
}

export interface CustomerListResponse {
  data: Customer[];
  message: string;
  pagination: PaginationMeta;
}

export interface CustomerDetailResponse {
  data: Customer;
  message: string;
}

export interface InvoiceListResponse {
  data: Invoice[];
  message: string;
  pagination: PaginationMeta;
}

export interface InvoiceDetailResponse {
  data: Invoice;
  message: string;
}

export interface PaymentListResponse {
  data: CustomerPayment[];
  message: string;
  pagination: PaginationMeta;
}

export interface PaymentDetailResponse {
  data: CustomerPayment;
  message: string;
}

export interface CollectionActivityListResponse {
  data: CollectionActivity[];
  message: string;
  pagination?: PaginationMeta;
}

export interface DunningLetterListResponse {
  data: DunningLetter[];
  message: string;
  pagination?: PaginationMeta;
}

export interface CreditMemoListResponse {
  data: CreditMemo[];
  message: string;
  pagination?: PaginationMeta;
}

export interface PaymentPlanListResponse {
  data: PaymentPlan[];
  message: string;
  pagination?: PaginationMeta;
}

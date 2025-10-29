export interface AccountsReceivable {
  id: string;
  customer_id: string;
  customer_name: string;
  invoice_id?: string;
  invoice_number?: string;
  transaction_type: ARTransactionType;
  transaction_date: string;
  due_date: string;

  // Financial Information
  original_amount: number;
  current_balance: number;
  amount_paid: number;
  amount_due: number;

  // Aging Information
  aging_bucket: AgingBucket;
  days_outstanding: number;

  // Status and Terms
  status: ARStatus;
  payment_terms: string;
  currency: string;

  // Collection Information
  collection_status: CollectionStatus;
  last_contact_date?: string;
  next_follow_up_date?: string;
  collection_notes?: string;
  assigned_collector?: string;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type ARTransactionType =
  | 'INVOICE'
  | 'CREDIT_MEMO'
  | 'PAYMENT'
  | 'ADJUSTMENT'
  | 'REFUND'
  | 'WRITE_OFF';

export type ARStatus =
  | 'OPEN'
  | 'PAID'
  | 'PARTIAL'
  | 'OVERDUE'
  | 'DISPUTED'
  | 'WRITTEN_OFF'
  | 'CANCELLED';

export type AgingBucket =
  | 'CURRENT'      // 0-30 days
  | 'PAST_DUE_30'  // 31-60 days
  | 'PAST_DUE_60'  // 61-90 days
  | 'PAST_DUE_90'  // 91-120 days
  | 'PAST_DUE_120'; // 120+ days

export type CollectionStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'FIRST_NOTICE_SENT'
  | 'SECOND_NOTICE_SENT'
  | 'FINAL_NOTICE_SENT'
  | 'PAYMENT_PLAN'
  | 'LEGAL_ACTION'
  | 'COLLECTION_AGENCY'
  | 'RESOLVED';

export interface ARPayment {
  id: string;
  ar_id: string;
  customer_id: string;
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  check_number?: string;
  deposit_date?: string;
  bank_account?: string;
  notes?: string;

  // Allocation to invoices
  allocations: PaymentAllocation[];

  // Status
  status: PaymentStatus;
  created_at: string;
  created_by: string;
}

export interface PaymentAllocation {
  invoice_id: string;
  invoice_number: string;
  allocated_amount: number;
  original_invoice_amount: number;
  remaining_balance: number;
}

export type PaymentMethod =
  | 'CASH'
  | 'CHECK'
  | 'CREDIT_CARD'
  | 'ACH'
  | 'WIRE_TRANSFER'
  | 'PAYPAL'
  | 'STRIPE'
  | 'OTHER';

export type PaymentStatus =
  | 'PENDING'
  | 'CLEARED'
  | 'BOUNCED'
  | 'REVERSED'
  | 'CANCELLED';

export interface ARStatement {
  id: string;
  customer_id: string;
  customer_name: string;
  statement_date: string;
  statement_period_start: string;
  statement_period_end: string;

  // Balance Information
  beginning_balance: number;
  ending_balance: number;
  total_charges: number;
  total_payments: number;
  total_adjustments: number;

  // Aging Summary
  current_amount: number;
  past_due_30: number;
  past_due_60: number;
  past_due_90: number;
  past_due_120: number;

  // Statement Details
  line_items: ARStatementLineItem[];

  // Delivery Information
  email_sent: boolean;
  email_sent_date?: string;
  print_sent: boolean;
  print_sent_date?: string;

  created_at: string;
  created_by: string;
}

export interface ARStatementLineItem {
  transaction_date: string;
  transaction_type: ARTransactionType;
  description: string;
  reference_number?: string;
  charges: number;
  payments: number;
  balance: number;
}

export interface CollectionActivity {
  id: string;
  customer_id: string;
  ar_id?: string;
  activity_type: CollectionActivityType;
  activity_date: string;
  description: string;
  notes?: string;
  next_follow_up_date?: string;
  assigned_to: string;
  status: CollectionActivityStatus;

  // Contact Information
  contact_method?: ContactMethod;
  contact_person?: string;
  phone_number?: string;
  email_address?: string;

  created_at: string;
  created_by: string;
}

export type CollectionActivityType =
  | 'PHONE_CALL'
  | 'EMAIL'
  | 'LETTER'
  | 'IN_PERSON'
  | 'LEGAL_NOTICE'
  | 'PAYMENT_PLAN'
  | 'SETTLEMENT'
  | 'WRITE_OFF';

export type CollectionActivityStatus =
  | 'PLANNED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export type ContactMethod =
  | 'PHONE'
  | 'EMAIL'
  | 'MAIL'
  | 'FAX'
  | 'IN_PERSON'
  | 'TEXT_MESSAGE';

export interface ARSummary {
  total_outstanding: number;
  total_overdue: number;

  // Aging Summary
  current: number;
  past_due_30: number;
  past_due_60: number;
  past_due_90: number;
  past_due_120: number;

  // Statistics
  total_customers_with_balance: number;
  average_days_to_pay: number;
  collection_effectiveness: number; // Percentage

  // Top customers by outstanding amount
  top_customers: {
    customer_id: string;
    customer_name: string;
    outstanding_amount: number;
    days_outstanding: number;
  }[];

  // Collection metrics
  collection_metrics: {
    calls_made: number;
    emails_sent: number;
    payments_received: number;
    promises_to_pay: number;
    disputes_resolved: number;
  };
}

export interface CreditMemo {
  id: string;
  credit_memo_number: string;
  customer_id: string;
  customer_name: string;
  invoice_id?: string;
  invoice_number?: string;

  // Financial Information
  credit_amount: number;
  applied_amount: number;
  unapplied_amount: number;

  // Details
  credit_date: string;
  reason: CreditReason;
  description: string;
  line_items: CreditMemoLineItem[];

  // Status
  status: CreditMemoStatus;
  approved_by?: string;
  approval_date?: string;

  created_at: string;
  created_by: string;
}

export interface CreditMemoLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  reason?: string;
}

export type CreditReason =
  | 'DEFECTIVE_PRODUCT'
  | 'BILLING_ERROR'
  | 'RETURN'
  | 'DISCOUNT'
  | 'PROMOTIONAL'
  | 'GOODWILL'
  | 'OTHER';

export type CreditMemoStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'APPLIED'
  | 'CANCELLED';

export interface ARFilters {
  customer_id?: string;
  status?: ARStatus[];
  aging_bucket?: AgingBucket[];
  collection_status?: CollectionStatus[];
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  overdue_only?: boolean;
  assigned_collector?: string;
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: 'due_date' | 'amount_due' | 'days_outstanding' | 'customer_name';
  sort_order?: 'asc' | 'desc';
}

export interface PaymentFormData {
  customer_id: string;
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  check_number?: string;
  bank_account?: string;
  notes?: string;
  allocations: {
    invoice_id: string;
    allocated_amount: number;
  }[];
}

export interface CollectionActivityFormData {
  customer_id: string;
  ar_id?: string;
  activity_type: CollectionActivityType;
  activity_date: string;
  description: string;
  notes?: string;
  next_follow_up_date?: string;
  contact_method?: ContactMethod;
  contact_person?: string;
  phone_number?: string;
  email_address?: string;
}

export interface WriteOffData {
  ar_id: string;
  write_off_amount: number;
  reason: string;
  approval_required: boolean;
  approved_by?: string;
  notes?: string;
}

export interface PaymentPlan {
  id: string;
  customer_id: string;
  ar_id: string;
  total_amount: number;
  down_payment?: number;
  installment_amount: number;
  number_of_installments: number;
  frequency: PaymentFrequency;
  start_date: string;

  // Status
  status: PaymentPlanStatus;
  installments_completed: number;
  remaining_balance: number;

  // Terms
  interest_rate?: number;
  late_fee_amount?: number;
  grace_period_days?: number;

  created_at: string;
  created_by: string;
}

export type PaymentFrequency =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY';

export type PaymentPlanStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DEFAULTED'
  | 'CANCELLED';

export interface DunningLetter {
  id: string;
  customer_id: string;
  template_type: DunningLetterType;
  sent_date: string;
  delivery_method: 'EMAIL' | 'MAIL' | 'FAX';

  // Content
  subject: string;
  body: string;
  amount_due: number;
  due_date: string;

  // Status
  delivery_status: 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  opened?: boolean;
  opened_date?: string;

  created_at: string;
  created_by: string;
}

export type DunningLetterType =
  | 'FIRST_NOTICE'
  | 'SECOND_NOTICE'
  | 'FINAL_NOTICE'
  | 'DEMAND_LETTER'
  | 'LEGAL_NOTICE';
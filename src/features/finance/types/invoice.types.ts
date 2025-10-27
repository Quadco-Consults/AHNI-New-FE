export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;

  // Financial Information
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;

  // Status and Terms
  status: InvoiceStatus;
  payment_terms: string;
  currency: string;

  // Line Items
  line_items: InvoiceLineItem[];

  // Additional Information
  memo?: string;
  terms_conditions?: string;
  notes?: string;

  // Billing and Shipping
  billing_address: Address;
  shipping_address?: Address;

  // QuickBooks Integration
  quickbooks_id?: string;
  sync_token?: string;
  last_synced?: string;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface InvoiceLineItem {
  id?: string;
  item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  discount_amount?: number;
  tax_code?: string;
  tax_amount?: number;
  line_total: number;

  // Optional fields for service items
  hourly_rate?: number;
  hours_worked?: number;

  // Project/Department tracking
  project_id?: string;
  department_id?: string;
  class_id?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'SENT'
  | 'VIEWED'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE'
  | 'VOID'
  | 'CANCELLED';

export interface InvoiceFormData {
  customer_id: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  currency: string;
  line_items: InvoiceLineItem[];
  memo?: string;
  terms_conditions?: string;
  notes?: string;
  billing_address: Address;
  shipping_address?: Address;
  same_as_customer_address: boolean;
}

export interface InvoiceStats {
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  overdue_amount: number;
  draft_count: number;
  sent_count: number;
  paid_count: number;
  overdue_count: number;
  average_payment_time: number;
}

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

export type PaymentMethod =
  | 'CASH'
  | 'CHECK'
  | 'CREDIT_CARD'
  | 'BANK_TRANSFER'
  | 'ACH'
  | 'PAYPAL'
  | 'STRIPE'
  | 'OTHER';

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  template_data: {
    logo_url?: string;
    company_info: {
      name: string;
      address: Address;
      phone?: string;
      email?: string;
      website?: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    layout: 'standard' | 'modern' | 'minimalist' | 'professional';
    include_logo: boolean;
    include_terms: boolean;
    include_notes: boolean;
  };
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringInvoice {
  id: string;
  template_invoice_id: string;
  customer_id: string;
  frequency: RecurringFrequency;
  start_date: string;
  end_date?: string;
  next_invoice_date: string;
  is_active: boolean;
  created_invoices_count: number;
  last_generated_date?: string;
  created_at: string;
  updated_at: string;
}

export type RecurringFrequency =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'ANNUALLY';

export interface InvoiceFilters {
  customer_id?: string;
  status?: InvoiceStatus[];
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  payment_terms?: string;
  search?: string;
  overdue_only?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: 'invoice_date' | 'due_date' | 'total_amount' | 'customer_name';
  sort_order?: 'asc' | 'desc';
}

export interface BulkInvoiceAction {
  action: 'send' | 'mark_sent' | 'mark_paid' | 'void' | 'delete';
  invoice_ids: string[];
  metadata?: {
    payment_date?: string;
    payment_amount?: number;
    payment_method?: PaymentMethod;
    void_reason?: string;
  };
}

export interface InvoiceEmailData {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attach_pdf: boolean;
  send_copy_to_self: boolean;
}

export interface QuickBooksInvoiceSync {
  sync_status: 'pending' | 'synced' | 'error';
  last_sync_attempt: string;
  sync_error?: string;
  quickbooks_invoice_id?: string;
  quickbooks_url?: string;
}
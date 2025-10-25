export interface Customer {
  id: string;
  customer_number: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  display_name: string;
  customer_type: CustomerType;

  // Contact Information
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;

  // Address Information
  billing_address: Address;
  shipping_address?: Address;
  same_as_billing: boolean;

  // Financial Information
  payment_terms?: PaymentTerms;
  credit_limit?: number;
  tax_rate?: number;
  currency: string;
  price_level?: string;

  // Status and Settings
  is_active: boolean;
  is_taxable: boolean;
  send_statements: boolean;

  // QuickBooks Integration
  quickbooks_id?: string;
  sync_token?: string;
  last_synced?: string;

  // Metadata
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

export interface PaymentTerms {
  id: string;
  name: string;
  net_days: number;
  discount_days?: number;
  discount_percent?: number;
}

export interface CustomerFormData {
  customer_type: CustomerType;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  display_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  billing_address: Address;
  shipping_address?: Address;
  same_as_billing: boolean;
  payment_terms?: string;
  credit_limit?: number;
  tax_rate?: number;
  currency: string;
  is_active: boolean;
  is_taxable: boolean;
  send_statements: boolean;
  notes?: string;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  total_receivables: number;
  overdue_invoices: number;
  top_customers: {
    id: string;
    name: string;
    total_sales: number;
  }[];
}
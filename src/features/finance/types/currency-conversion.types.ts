/**
 * Currency Conversion Types
 * For USD → NGN currency conversions
 */

export interface CurrencyConversion {
  id: string;
  conversion_number: string;
  conversion_date: string;
  status: 'draft' | 'completed' | 'cancelled';

  // Accounts
  source_usd_account: string;
  source_usd_account_details?: {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
  };
  destination_ngn_account: string;
  destination_ngn_account_details?: {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
  };

  // Amounts and rates
  usd_amount: string;
  exchange_rate: string;
  system_exchange_rate?: string;
  ngn_equivalent: string;
  bank_charges: string;
  net_ngn_deposited: string;

  // Conversion details
  bank_or_bureau_name: string;
  bank_reference_number?: string;

  // Project allocation
  project?: string;
  project_details?: {
    id: string;
    title: string;
  };
  project_class?: string;
  donor_grant?: string;

  // Purpose and notes
  purpose?: string;
  notes?: string;
  receipt_attachment?: string;

  // Approval workflow
  reviewed_by?: string;
  reviewed_at?: string;
  approved_by?: string;
  approved_at?: string;

  // Accounting
  journal_entry?: string;
  journal_entry_details?: {
    id: string;
    entry_number: string;
    total_debit: string;
    total_credit: string;
  };

  // Metadata
  created_datetime: string;
  updated_datetime: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateCurrencyConversion {
  source_usd_account_id: string;
  destination_ngn_account_id: string;
  usd_amount: string;
  exchange_rate: string;
  bank_charges?: string;
  bank_or_bureau_name: string;
  bank_reference_number?: string;
  project_id?: string;
  project_class_id?: string;
  donor_grant?: string;
  purpose?: string;
  notes?: string;
  conversion_date?: string;
}

export interface CompleteCurrencyConversion {
  conversion_id: string;
}

export interface CurrencyConversionFilters {
  status?: 'draft' | 'completed' | 'cancelled';
  source_usd_account?: string;
  destination_ngn_account?: string;
  project?: string;
  conversion_date_after?: string;
  conversion_date_before?: string;
  page?: number;
  size?: number;
}

export interface ExchangeRateVariance {
  absolute: string;
  percentage: string;
  is_favorable: boolean;
}

export interface CurrencyConversionSummary {
  total_conversions: number;
  total_usd_converted: string;
  total_ngn_received: string;
  total_bank_charges: string;
  average_exchange_rate: string;
  completed_count: number;
  draft_count: number;
  cancelled_count: number;
}

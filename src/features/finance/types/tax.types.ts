// Tax Management Types

export type TaxCategory = 'WHT' | 'VAT' | 'PAYE' | 'OTHER';
export type RemittanceStatus = 'PENDING' | 'REMITTED';
export type RemittanceSubmissionStatus = 'PREPARED' | 'SUBMITTED' | 'PAID';

export interface TaxType {
  id: string;
  name: string;
  code: string;
  tax_category: TaxCategory;
  rate: string; // Decimal as string (e.g., "5.00")
  description?: string;
  is_active: boolean;
  applies_to_budget_lines?: string[]; // Array of budget line IDs
  created_at: string;
  updated_at: string;
}

export interface TaxAuthority {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxWithholding {
  id: string;
  payment_request: string; // Payment request ID
  tax_type: string | TaxType;
  tax_authority: string | TaxAuthority;
  gross_amount: string;
  tax_rate: string;
  tax_amount: string;
  withholding_date: string; // ISO date string
  remittance_status: RemittanceStatus;
  remittance?: string | TaxRemittance;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Read-only fields from serializer
  tax_type_name?: string;
  tax_authority_name?: string;
  payment_request_number?: string;
}

export interface TaxRemittance {
  id: string;
  remittance_number: string;
  tax_authority: string | TaxAuthority;
  tax_type: string | TaxType;
  period_from: string; // ISO date string
  period_to: string; // ISO date string
  total_amount: string;
  remittance_date?: string;
  payment_reference?: string;
  receipt_file?: string;
  status: RemittanceSubmissionStatus;
  created_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Read-only fields from serializer
  tax_authority_name?: string;
  tax_type_name?: string;
  created_by_name?: string;
  withholding_count?: number;
}

// Request/Response Types

export interface PrepareRemittanceRequest {
  tax_authority_id: string;
  tax_type_id: string;
  period_from: string;
  period_to: string;
}

export interface UpdateRemittanceStatusRequest {
  status: 'SUBMITTED' | 'PAID';
  remittance_date?: string;
  payment_reference?: string;
  receipt_file?: File;
}

export interface CalculateTaxRequest {
  gross_amount: string;
  tax_types: TaxTypeInfo[];
}

export interface TaxTypeInfo {
  tax_type_id: string;
  rate: string;
  category: TaxCategory;
}

export interface TaxCalculationResult {
  gross_amount: string;
  total_wht: string;
  total_vat: string;
  total_paye: string;
  total_tax: string;
  net_amount: string;
  tax_breakdown: TaxBreakdownItem[];
}

export interface TaxBreakdownItem {
  tax_type_id: string;
  category: TaxCategory;
  rate: string;
  amount: string;
}

export interface PendingWithholdingsQuery {
  tax_authority_id?: string;
  tax_type_id?: string;
  period_from?: string;
  period_to?: string;
}

export interface PendingWithholdingsSummary {
  withholdings: TaxWithholding[];
  summary: {
    total_amount: string;
    count: number;
  };
}

export interface TaxSummaryQuery {
  period_from: string;
  period_to: string;
  tax_category?: 'WHT' | 'VAT' | 'PAYE' | 'ALL';
}

export interface TaxSummaryReport {
  period: {
    from: string;
    to: string;
  };
  summary_by_type: TaxTypeSummary[];
  grand_totals: {
    total_withheld: string;
    total_remitted: string;
    total_pending: string;
    count: number;
  };
}

export interface TaxTypeSummary {
  tax_type_name: string;
  tax_category: TaxCategory;
  tax_rate: string;
  total_withheld: string;
  total_remitted: string;
  total_pending: string;
  count: number;
}

// Form Types

export interface TaxTypeFormData {
  name: string;
  code: string;
  tax_category: TaxCategory;
  rate: string;
  description?: string;
  is_active: boolean;
  applies_to_budget_lines?: string[];
}

export interface TaxAuthorityFormData {
  name: string;
  code: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_active: boolean;
}

// Filter/Query Types

export interface TaxTypeFilters {
  category?: TaxCategory;
  is_active?: boolean;
  search?: string;
}

export interface TaxAuthorityFilters {
  is_active?: boolean;
  search?: string;
}

export interface TaxWithholdingFilters {
  remittance_status?: RemittanceStatus;
  tax_type_id?: string;
  tax_authority_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface TaxRemittanceFilters {
  status?: RemittanceSubmissionStatus;
  tax_authority_id?: string;
  tax_type_id?: string;
}

// Table Column Types (for data tables)

export interface TaxTypeTableRow extends TaxType {
  actions?: React.ReactNode;
}

export interface TaxAuthorityTableRow extends TaxAuthority {
  actions?: React.ReactNode;
}

export interface TaxWithholdingTableRow extends TaxWithholding {
  actions?: React.ReactNode;
}

export interface TaxRemittanceTableRow extends TaxRemittance {
  actions?: React.ReactNode;
}

// Utility Types

export interface TaxSuggestion {
  tax_type_id: string;
  name: string;
  code: string;
  category: TaxCategory;
  rate: string;
  suggested: boolean;
  reason: string;
}

// Constants

export const TAX_CATEGORIES: { value: TaxCategory; label: string }[] = [
  { value: 'WHT', label: 'Withholding Tax' },
  { value: 'VAT', label: 'Value Added Tax' },
  { value: 'PAYE', label: 'Pay As You Earn' },
  { value: 'OTHER', label: 'Other Tax' },
];

export const REMITTANCE_STATUSES: {
  value: RemittanceSubmissionStatus;
  label: string;
  color: 'default' | 'warning' | 'success';
}[] = [
  { value: 'PREPARED', label: 'Prepared', color: 'default' },
  { value: 'SUBMITTED', label: 'Submitted', color: 'warning' },
  { value: 'PAID', label: 'Paid', color: 'success' },
];

export const WITHHOLDING_STATUSES: {
  value: RemittanceStatus;
  label: string;
  color: 'warning' | 'success';
}[] = [
  { value: 'PENDING', label: 'Pending Remittance', color: 'warning' },
  { value: 'REMITTED', label: 'Remitted', color: 'success' },
];

/**
 * Bank Reconciliation Types
 *
 * TypeScript types for bank account management and reconciliation.
 */

// ===== BANK ACCOUNT TYPES =====

export type BankAccountType =
  | 'checking'
  | 'savings'
  | 'money_market'
  | 'credit_line'
  | 'other';

export interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  masked_account_number: string;
  account_type: BankAccountType;
  routing_number?: string;
  currency: string;
  opening_balance: number;
  current_balance: number;
  reconciled_balance: number;
  book_balance: number;
  unreconciled_difference: number;
  last_reconciled_date?: string;
  is_active: boolean;
  is_default: boolean;
  chart_account_name?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  online_banking_url?: string;
  created_datetime: string;
  modified_datetime: string;
}

export interface CreateBankAccount {
  account_name: string;
  bank_name: string;
  account_number: string;
  account_type: BankAccountType;
  routing_number?: string;
  currency?: string;
  opening_balance?: number;
  current_balance?: number;
  chart_account_id: string;
  is_active?: boolean;
  is_default?: boolean;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  online_banking_url?: string;
  online_banking_username?: string;
}

// ===== BANK STATEMENT TYPES =====

export interface BankStatement {
  id: string;
  bank_account: string;
  bank_account_name: string;
  statement_date: string;
  beginning_balance: number;
  ending_balance: number;
  statement_period_start: string;
  statement_period_end: string;
  total_deposits: number;
  total_withdrawals: number;
  is_reconciled: boolean;
  reconciled_by?: string;
  reconciled_by_name?: string;
  reconciled_datetime?: string;
  reconciliation_notes?: string;
  statement_file?: string;
  created_datetime: string;
  modified_datetime: string;
}

export interface CreateBankStatement {
  bank_account_id: string;
  statement_date: string;
  beginning_balance: number;
  ending_balance: number;
  statement_period_start: string;
  statement_period_end: string;
  statement_file?: File;
}

// ===== BANK TRANSACTION TYPES =====

export type BankTransactionType = 'debit' | 'credit';

export type BankTransactionStatus =
  | 'unreconciled'
  | 'reconciled'
  | 'cleared'
  | 'outstanding';

export interface BankTransaction {
  id: string;
  bank_account: string;
  bank_account_name: string;
  bank_statement: string;
  transaction_date: string;
  transaction_type: BankTransactionType;
  amount: number;
  description: string;
  reference_number?: string;
  payee_payer?: string;
  status: BankTransactionStatus;
  matched_journal_entry?: string;
  reconciled_by?: string;
  reconciled_by_name?: string;
  reconciled_datetime?: string;
  reconciliation_notes?: string;
  match_confidence?: number;
  created_datetime: string;
  modified_datetime: string;
}

export interface CreateBankTransaction {
  bank_account_id: string;
  bank_statement_id: string;
  transaction_date: string;
  transaction_type: BankTransactionType;
  amount: number;
  description: string;
  reference_number?: string;
  payee_payer?: string;
}

export interface ReconcileTransaction {
  journal_entry_id?: string;
  notes?: string;
}

// ===== BANK RECONCILIATION TYPES =====

export interface BankReconciliation {
  id: string;
  bank_account: string;
  bank_account_name: string;
  bank_statement: string;
  statement_date: string;
  reconciliation_date: string;
  statement_ending_balance: number;
  book_balance: number;
  reconciled_balance: number;
  outstanding_deposits: number;
  outstanding_checks: number;
  bank_adjustments: number;
  book_adjustments: number;
  is_balanced: boolean;
  difference: number;
  completed_by?: string;
  completed_by_name?: string;
  completed_datetime?: string;
  notes?: string;
  created_datetime: string;
  modified_datetime: string;
}

export interface BankReconciliationDetails extends BankReconciliation {
  bank_account_details: {
    id: string;
    account_name: string;
    bank_name: string;
  };
  statement_details: {
    id: string;
    statement_date: string;
    beginning_balance: string;
    ending_balance: string;
  };
}

export interface CreateBankReconciliation {
  bank_account_id: string;
  bank_statement_id: string;
  reconciliation_date: string;
  statement_ending_balance: number;
  book_balance: number;
  outstanding_deposits?: number;
  outstanding_checks?: number;
  bank_adjustments?: number;
  book_adjustments?: number;
  notes?: string;
}

export interface CompleteBankReconciliation {
  notes?: string;
}

// ===== OUTSTANDING CHECK TYPES =====

export interface OutstandingCheck {
  id: string;
  bank_account: string;
  bank_account_name: string;
  check_number: string;
  check_date: string;
  payee: string;
  amount: number;
  description?: string;
  journal_entry?: string;
  is_cleared: boolean;
  cleared_date?: string;
  void_date?: string;
  is_void: boolean;
}

export interface CreateOutstandingCheck {
  bank_account_id: string;
  check_number: string;
  check_date: string;
  payee: string;
  amount: number;
  description?: string;
  journal_entry_id?: string;
}

export interface ClearOutstandingCheck {
  cleared_date?: string;
}

// ===== FILTERS =====

export interface BankAccountFilters {
  is_active?: boolean;
  currency?: string;
}

export interface BankStatementFilters {
  bank_account_id?: string;
  is_reconciled?: boolean;
}

export interface BankTransactionFilters {
  bank_account_id?: string;
  bank_statement_id?: string;
  status?: BankTransactionStatus;
}

export interface BankReconciliationFilters {
  bank_account_id?: string;
  is_balanced?: boolean;
}

export interface OutstandingCheckFilters {
  bank_account_id?: string;
  is_cleared?: boolean;
  is_void?: boolean;
}

// ===== API RESPONSES =====

export interface BankReconciliationResponse {
  status: string;
  message: string;
  data: BankAccount | BankStatement | BankTransaction | BankReconciliation | OutstandingCheck;
}

export interface BankReconciliationListResponse<T> {
  status: string;
  data: T[];
  pagination?: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

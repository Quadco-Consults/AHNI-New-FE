// Accounting Core Types - Enhanced for QuickBooks Compatibility
export interface ChartOfAccount {
  id: string;
  account_code: string;
  account_name: string;
  account_type: AccountType;

  // QuickBooks-specific fields
  quickbooks_account_type?: QuickBooksAccountType;
  account_sub_type?: QuickBooksAccountSubType;
  classification?: QuickBooksClassification;
  currency_ref?: string;
  tax_code_ref?: string;
  fully_qualified_name?: string;

  parent_account?: string | ChartOfAccount;
  budget_line?: string;
  description?: string;
  is_active: boolean;
  is_header: boolean;
  balance: number;

  // QuickBooks metadata
  sync_token?: string;
  domain?: string;
  sparse?: boolean;
  quickbooks_id?: string;
  last_synced?: string;

  created_at: string;
  updated_at: string;
}

// Account Types - Basic
export type AccountType =
  | 'ASSETS'
  | 'LIABILITIES'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSES';

// QuickBooks Account Types (more specific)
export type QuickBooksAccountType =
  | 'Bank'
  | 'Other Current Asset'
  | 'Accounts Receivable'
  | 'Fixed Asset'
  | 'Other Asset'
  | 'Equity'
  | 'Expense'
  | 'Other Expense'
  | 'Cost of Goods Sold'
  | 'Accounts Payable'
  | 'Credit Card'
  | 'Long Term Liability'
  | 'Other Current Liability'
  | 'Income'
  | 'Other Income';

// QuickBooks Account SubTypes
export type QuickBooksAccountSubType =
  // Assets
  | 'CashOnHand' | 'Checking' | 'Savings' | 'MoneyMarket'
  | 'AccountsReceivable' | 'AllowanceForBadDebts'
  | 'DevelopmentCosts' | 'EmployeeCashAdvances'
  | 'Inventory' | 'Investment_MortgageRealEstateLoans'
  | 'Investment_Other' | 'Investment_TaxExemptSecurities'
  | 'Investment_USGovernmentObligations' | 'LoansToOfficers'
  | 'LoansToOthers' | 'LoansToStockholders' | 'PrepaidExpenses'
  | 'Retainage' | 'UndepositedFunds' | 'OtherCurrentAssets'
  | 'Buildings' | 'DepreciableEquipment' | 'Furniture' | 'Land'
  | 'Vehicles' | 'AccumulatedDepreciation' | 'OtherFixedAssets'
  // Liabilities
  | 'AccountsPayable' | 'CreditCard' | 'NotesPayable'
  | 'LineOfCredit' | 'LongTermLiability' | 'OtherCurrentLiabilities'
  | 'PayrollLiabilities' | 'SalesTaxPayable' | 'TrustAccountsLiabilities'
  // Equity
  | 'OpeningBalanceEquity' | 'PartnersEquity' | 'RetainedEarnings'
  | 'AccumulatedAdjustment' | 'OwnersEquity' | 'PaidInCapitalOrSurplus'
  | 'EstimatedTaxes' | 'TreasuryStock'
  // Revenue
  | 'SalesOfProductIncome' | 'ServiceFeeIncome' | 'DiscountsRefundsGiven'
  | 'UnappliedCashPaymentIncome' | 'OtherPrimaryIncome'
  // Expenses
  | 'AdvertisingPromotional' | 'BadDebts' | 'BankCharges'
  | 'CharitableContributions' | 'CommissionsAndFees' | 'Entertainment'
  | 'EquipmentRental' | 'Insurance' | 'InterestPaid' | 'LegalProfessionalFees'
  | 'OfficeExpenses' | 'Payroll' | 'Rent' | 'RepairMaintenance'
  | 'Supplies' | 'Travel' | 'Utilities' | 'OtherBusinessExpenses'
  | 'CostOfLaborCos' | 'CostOfSales' | 'EquipmentRentalCos' | 'OtherCostsOfServiceCos'
  | 'ShippingFreightDeliveryCos' | 'SuppliesMaterialsCogs';

// QuickBooks Classifications
export type QuickBooksClassification =
  | 'Asset'
  | 'Liability'
  | 'Equity'
  | 'Revenue'
  | 'Expense';

export interface JournalEntry {
  id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  reference_number?: string;
  status: JournalEntryStatus;
  total_debit: number;
  total_credit: number;

  // QuickBooks-specific fields
  doc_number?: string;
  adjustment?: boolean;
  txn_type?: 'JournalEntry';
  private_note?: string;
  exchange_rate?: number;
  currency_ref?: string;
  txn_tax_detail?: TaxDetail;

  created_by: string;
  approved_by?: string;
  posted_by?: string;
  posted_date?: string;
  source_module?: string;
  source_transaction_id?: string;
  line_items: JournalEntryLine[];

  // QuickBooks metadata
  sync_token?: string;
  domain?: string;
  sparse?: boolean;
  quickbooks_id?: string;
  last_synced?: string;

  created_at: string;
  updated_at: string;
}

export type JournalEntryStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'POSTED'
  | 'REJECTED';

export interface JournalEntryLine {
  id: string;
  journal_entry: string;
  account: string | ChartOfAccount;
  description?: string;
  debit_amount: number;
  credit_amount: number;

  // QuickBooks-specific fields
  posting_type?: 'Debit' | 'Credit';
  entity_ref?: QuickBooksReference;
  class_ref?: QuickBooksReference;
  department_ref?: QuickBooksReference;
  tax_applicable_on?: string;
  tax_code_ref?: QuickBooksReference;
  billing_status?: 'Billable' | 'NotBillable' | 'HasBeenBilled';

  project?: string;
  department?: string;
  line_number: number;
}

// QuickBooks Reference Interface
export interface QuickBooksReference {
  value: string;
  name?: string;
}

// Tax Detail Interface
export interface TaxDetail {
  txn_tax_code_ref?: QuickBooksReference;
  total_tax?: number;
  tax_lines?: TaxLine[];
}

export interface TaxLine {
  amount: number;
  detail_type: 'TaxLineDetail';
  tax_line_detail: {
    tax_rate_ref: QuickBooksReference;
    percent_based: boolean;
    tax_percent?: number;
    net_amount_taxable?: number;
  };
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: BankAccountType;
  currency: string;
  current_balance: number;
  gl_account: string | ChartOfAccount;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BankAccountType =
  | 'CHECKING'
  | 'SAVINGS'
  | 'MONEY_MARKET'
  | 'CREDIT_LINE';

export interface BankStatement {
  id: string;
  bank_account: string | BankAccount;
  statement_date: string;
  beginning_balance: number;
  ending_balance: number;
  statement_file?: string;
  is_reconciled: boolean;
  reconciled_by?: string;
  reconciled_date?: string;
  transactions: BankTransaction[];
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  bank_statement: string;
  transaction_date: string;
  description: string;
  reference_number?: string;
  debit_amount: number;
  credit_amount: number;
  running_balance: number;
  is_matched: boolean;
  matched_journal_entry?: string;
  line_number: number;
}

// Form data types
export interface JournalEntryFormData {
  entry_date: string;
  description: string;
  reference_number?: string;
  line_items: JournalEntryLineFormData[];
}

export interface JournalEntryLineFormData {
  account: string;
  description?: string;
  debit_amount: number;
  credit_amount: number;
  project?: string;
  department?: string;
}

export interface ChartOfAccountFormData {
  account_code: string;
  account_name: string;
  account_type: AccountType;

  // QuickBooks fields
  quickbooks_account_type?: QuickBooksAccountType;
  account_sub_type?: QuickBooksAccountSubType;
  classification?: QuickBooksClassification;
  currency_ref?: string;
  tax_code_ref?: string;

  parent_account?: string;
  budget_line?: string;
  description?: string;
  is_active: boolean;
  is_header: boolean;
}

export interface BankAccountFormData {
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: BankAccountType;
  currency: string;
  gl_account: string;
  is_active: boolean;
}
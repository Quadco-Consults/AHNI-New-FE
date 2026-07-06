/**
 * Fund Transfer Types
 * For internal fund transfers between bank accounts
 */

export interface FundTransfer {
  success: boolean;
  transfer_reference: string;
  from_account: {
    id: string;
    account_name: string;
    account_number: string;
  };
  to_account: {
    id: string;
    account_name: string;
    account_number: string;
  };
  amount: string;
  currency: string;
  transfer_date: string;
  new_from_balance: string;
  new_to_balance: string;
  journal_entry_id?: string;
}

export interface CreateFundTransfer {
  from_account_id: string;
  to_account_id: string;
  amount: string;
  description?: string;
  reference?: string;
  transfer_date?: string;
  project_id?: string;
}

export interface LocationDistribution {
  account_id: string;
  amount: string;
}

export interface CreateFundDistribution {
  main_account_id: string;
  distributions: LocationDistribution[];
  description?: string;
  reference?: string;
  project_id?: string;
}

export interface FundDistributionResult {
  success: boolean;
  total_distributed: string;
  currency: string;
  locations_count: number;
  main_account_new_balance: string;
  transfers: FundTransfer[];
}

export interface TransferHistoryItem {
  date: string;
  reference: string;
  description: string;
  amount: string;
  journal_entry_id: string;
}

export interface TransferHistory {
  account: {
    id: string;
    account_name: string;
    account_number: string;
    currency: string;
    current_balance: string;
  };
  inflows: TransferHistoryItem[];
  outflows: TransferHistoryItem[];
  total_inflows: string;
  total_outflows: string;
  net_flow: string;
}

export interface ProjectAccounts {
  project: {
    id: string;
    name: string;
  };
  usd_account?: {
    id: string;
    account_name: string;
    account_number: string;
    currency: string;
    current_balance: string;
  };
  main_ngn_account?: {
    id: string;
    account_name: string;
    account_number: string;
    currency: string;
    current_balance: string;
  };
  location_accounts: Array<{
    id: string;
    account_name: string;
    account_number: string;
    currency: string;
    current_balance: string;
    location?: {
      id: string;
      name: string;
      state: string;
    };
  }>;
}

export interface TransferHistoryFilters {
  account_id: string;
  start_date?: string;
  end_date?: string;
}

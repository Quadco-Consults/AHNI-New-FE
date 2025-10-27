import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interface
interface FinanceApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

// QuickBooks-Compatible Report Types

// Basic line item interface
export interface LineItem {
  account_name: string;
  account_code?: string;
  amount: number;
  percentage_of_total?: number;
}

// Enhanced Trial Balance
export interface TrialBalance {
  report_date: string;
  as_of_date: string;
  account_code: string;
  account_name: string;
  account_type: string;
  account_sub_type?: string;
  parent_account?: string;
  debit_balance: number;
  credit_balance: number;
  net_balance: number;

  // Comparative data
  beginning_balance?: number;
  period_activity?: number;
  ytd_balance?: number;
  is_sub_account?: boolean;
  level?: number;  // Hierarchy level
}

// Enhanced Income Statement (Profit & Loss)
export interface IncomeStatement {
  period_start: string;
  period_end: string;
  basis?: 'Accrual' | 'Cash';

  // Income section
  income: {
    operating_income: LineItem[];
    other_income: LineItem[];
    total_income: number;
  };

  // Cost of Goods Sold (if applicable)
  cost_of_goods_sold?: {
    items: LineItem[];
    total_cogs: number;
  };

  // Calculated fields
  gross_profit?: number;
  gross_profit_margin?: number;

  // Expenses section
  expenses: {
    operating_expenses: LineItem[];
    other_expenses: LineItem[];
    total_expenses: number;
  };

  // Final calculations
  net_operating_income: number;
  net_income: number;
  net_income_margin?: number;

  // Class/Department breakdown if applicable
  class_breakdown?: Record<string, IncomeStatement>;
}

// Enhanced Balance Sheet
export interface BalanceSheet {
  as_of_date: string;
  basis?: 'Accrual' | 'Cash';

  assets: {
    current_assets: {
      cash_and_cash_equivalents: LineItem[];
      accounts_receivable: LineItem[];
      inventory: LineItem[];
      prepaid_expenses: LineItem[];
      other_current_assets: LineItem[];
      total_current_assets: number;
    };
    fixed_assets: {
      property_plant_equipment: LineItem[];
      accumulated_depreciation: LineItem[];
      net_fixed_assets: number;
    };
    other_assets: LineItem[];
    total_assets: number;
  };

  liabilities: {
    current_liabilities: {
      accounts_payable: LineItem[];
      credit_cards: LineItem[];
      accrued_liabilities: LineItem[];
      short_term_debt: LineItem[];
      other_current_liabilities: LineItem[];
      total_current_liabilities: number;
    };
    long_term_liabilities: {
      notes_payable: LineItem[];
      mortgages_payable: LineItem[];
      other_long_term_liabilities: LineItem[];
      total_long_term_liabilities: number;
    };
    total_liabilities: number;
  };

  equity: {
    retained_earnings: number;
    current_year_earnings: number;
    capital_stock: LineItem[];
    additional_paid_in_capital: LineItem[];
    other_equity: LineItem[];
    total_equity: number;
  };

  // Validation
  total_liabilities_and_equity: number;
  balanced: boolean;  // Should equal total_assets
}

// Enhanced Cash Flow Statement
export interface CashFlowStatement {
  period_start: string;
  period_end: string;
  method?: 'Direct' | 'Indirect';  // QB typically uses Indirect

  beginning_cash_balance: number;

  operating_activities: {
    // Indirect method starts with net income
    net_income: number;
    adjustments: {
      depreciation_amortization: number;
      changes_in_working_capital: LineItem[];
      other_adjustments: LineItem[];
    };
    items: LineItem[];
    total: number;
  };

  investing_activities: {
    items: LineItem[];
    total: number;
  };

  financing_activities: {
    items: LineItem[];
    total: number;
  };

  net_cash_flow: number;
  ending_cash_balance: number;

  // Reconciliation section
  cash_reconciliation?: {
    beginning_balance: number;
    net_change: number;
    ending_balance: number;
  };
}

export interface GeneralLedger {
  account_code: string;
  account_name: string;
  transactions: {
    date: string;
    description: string;
    reference: string;
    debit: number;
    credit: number;
    balance: number;
  }[];
  opening_balance: number;
  closing_balance: number;
}

// Report Filters
export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  account_type?: string;
  department?: string;
  project?: string;
}

// ===== TRIAL BALANCE =====

export const useGetTrialBalance = (filters?: ReportFilters) => {
  return useQuery<FinanceApiResponse<TrialBalance[]>>({
    queryKey: ["trial-balance", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);
        if (filters?.account_type) params.append('account_type', filters.account_type);

        const response = await AxiosWithToken.get(`/api/finance/reports/trial-balance/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch trial balance: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== INCOME STATEMENT =====

export const useGetIncomeStatement = (filters?: ReportFilters) => {
  return useQuery<FinanceApiResponse<IncomeStatement>>({
    queryKey: ["income-statement", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);
        if (filters?.department) params.append('department', filters.department);
        if (filters?.project) params.append('project', filters.project);

        const response = await AxiosWithToken.get(`/api/finance/reports/income-statement/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch income statement: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== BALANCE SHEET =====

export const useGetBalanceSheet = (filters?: ReportFilters) => {
  return useQuery<FinanceApiResponse<BalanceSheet>>({
    queryKey: ["balance-sheet", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.date_to) params.append('as_of_date', filters.date_to);
        if (filters?.department) params.append('department', filters.department);

        const response = await AxiosWithToken.get(`/api/finance/reports/balance-sheet/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch balance sheet: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== CASH FLOW STATEMENT =====

export const useGetCashFlowStatement = (filters?: ReportFilters) => {
  return useQuery<FinanceApiResponse<CashFlowStatement>>({
    queryKey: ["cash-flow-statement", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);

        const response = await AxiosWithToken.get(`/api/finance/reports/cash-flow-statement/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch cash flow statement: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== GENERAL LEDGER =====

export const useGetGeneralLedger = (accountId: string, filters?: ReportFilters) => {
  return useQuery<FinanceApiResponse<GeneralLedger>>({
    queryKey: ["general-ledger", accountId, filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);

        const response = await AxiosWithToken.get(`/api/finance/reports/general-ledger/${accountId}/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch general ledger: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!accountId,
    refetchOnWindowFocus: false,
  });
};
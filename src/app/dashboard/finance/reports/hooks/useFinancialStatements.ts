import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";
import { format } from "date-fns";

export interface FinancialStatementParams {
  as_of_date?: Date;
  start_date?: Date;
  end_date?: Date;
  project_id?: string;
  include_inactive?: boolean;
}

export interface BalanceSheetAccount {
  account_code: string;
  account_name: string;
  balance: number;
  formatted: string;
}

export interface BalanceSheetSection {
  type: string;
  accounts: BalanceSheetAccount[];
}

export interface BalanceSheet {
  statement_name: string;
  as_of_date: string;
  currency: string;
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  is_balanced: boolean;
}

export interface IncomeStatementAccount {
  account_code: string;
  account_name: string;
  amount: number;
  formatted: string;
}

export interface IncomeStatementSection {
  type: string;
  accounts: IncomeStatementAccount[];
}

export interface IncomeStatement {
  statement_name: string;
  period: string;
  currency: string;
  revenue: IncomeStatementSection;
  expenses: IncomeStatementSection;
  total_revenue: number;
  total_expenses: number;
  net_surplus: number;
}

export const useBalanceSheet = (params?: FinancialStatementParams) => {
  return useQuery({
    queryKey: ["balance-sheet", params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};

      if (params?.as_of_date) {
        queryParams.as_of_date = format(params.as_of_date, "yyyy-MM-dd");
      }
      if (params?.project_id) {
        queryParams.project_id = params.project_id;
      }

      const response = await axiosInstance.get<BalanceSheet>(
        "/finance/financial-statements/balance-sheet/",
        { params: queryParams }
      );

      return response.data;
    },
  });
};

export const useIncomeStatement = (params?: FinancialStatementParams) => {
  return useQuery({
    queryKey: ["income-statement", params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};

      if (params?.start_date) {
        queryParams.start_date = format(params.start_date, "yyyy-MM-dd");
      }
      if (params?.end_date) {
        queryParams.end_date = format(params.end_date, "yyyy-MM-dd");
      }
      if (params?.project_id) {
        queryParams.project_id = params.project_id;
      }

      const response = await axiosInstance.get<IncomeStatement>(
        "/finance/financial-statements/income-statement/",
        { params: queryParams }
      );

      return response.data;
    },
  });
};

export const useCompleteFinancialStatements = (
  params?: FinancialStatementParams
) => {
  return useQuery({
    queryKey: ["complete-financial-statements", params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};

      if (params?.as_of_date) {
        queryParams.as_of_date = format(params.as_of_date, "yyyy-MM-dd");
      }
      if (params?.start_date) {
        queryParams.start_date = format(params.start_date, "yyyy-MM-dd");
      }
      if (params?.end_date) {
        queryParams.end_date = format(params.end_date, "yyyy-MM-dd");
      }
      if (params?.project_id) {
        queryParams.project_id = params.project_id;
      }

      const response = await axiosInstance.get<{
        balance_sheet: BalanceSheet;
        income_statement: IncomeStatement;
      }>("/finance/financial-statements/complete/", { params: queryParams });

      return response.data;
    },
  });
};

// Trial Balance Types
export interface TrialBalanceAccount {
  account_code: string;
  account_name: string;
  account_type: string;
  debit_balance: number;
  credit_balance: number;
  is_active: boolean;
}

export interface TrialBalance {
  as_of_date: string;
  project: string | null;
  accounts: TrialBalanceAccount[];
  total_debits: number;
  total_credits: number;
  is_balanced: boolean;
  difference: number;
}

export interface TrialBalanceResponse {
  status: boolean;
  message: string;
  data: TrialBalance;
}

export const useTrialBalance = (params?: FinancialStatementParams) => {
  return useQuery({
    queryKey: ["trial-balance", params],
    queryFn: async () => {
      try {
        const queryParams: Record<string, string> = {};

        if (params?.as_of_date) {
          queryParams.date_to = format(params.as_of_date, "yyyy-MM-dd");
        }
        if (params?.project_id) {
          queryParams.project_id = params.project_id;
        }
        if (params?.include_inactive !== undefined) {
          queryParams.include_inactive = params.include_inactive.toString();
        }

        console.log("🔍 Trial Balance Request:", {
          url: "/finance/reports/trial-balance/",
          params: queryParams,
        });

        const response = await axiosInstance.get<TrialBalanceResponse>(
          "/finance/reports/trial-balance/",
          { params: queryParams }
        );

        console.log("✅ Trial Balance Response:", response.data);

        return response.data.data;
      } catch (error: any) {
        console.error("❌ Trial Balance Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          fullError: error,
        });

        // Re-throw with more details
        const errorMessage = error.response?.data?.message || error.message || "Failed to load trial balance";
        throw new Error(errorMessage);
      }
    },
  });
};

// General Ledger Types
export interface GeneralLedgerTransaction {
  date: string;
  reference: string;
  account_code: string;
  account_name: string;
  description: string;
  debit: number;
  credit: number;
  running_balance: number;
}

export interface GeneralLedger {
  account_code?: string;
  account_name?: string;
  start_date: string;
  end_date: string;
  transactions: GeneralLedgerTransaction[];
  opening_balance: number;
  closing_balance: number;
  total_debits: number;
  total_credits: number;
}

export interface GeneralLedgerResponse {
  status: boolean;
  message: string;
  data: GeneralLedger;
}

export interface GeneralLedgerParams extends FinancialStatementParams {
  account_id?: string;
}

export const useGeneralLedger = (params?: GeneralLedgerParams) => {
  return useQuery({
    queryKey: ["general-ledger", params],
    queryFn: async () => {
      try {
        const queryParams: Record<string, string> = {};

        if (params?.start_date) {
          queryParams.date_from = format(params.start_date, "yyyy-MM-dd");
        }
        if (params?.end_date) {
          queryParams.date_to = format(params.end_date, "yyyy-MM-dd");
        }
        if (params?.account_id) {
          queryParams.account_id = params.account_id;
        }
        if (params?.project_id) {
          queryParams.project_id = params.project_id;
        }

        console.log("🔍 General Ledger Request:", {
          url: "/finance/reports/general-ledger/",
          params: queryParams,
        });

        const response = await axiosInstance.get<GeneralLedgerResponse>(
          "/finance/reports/general-ledger/",
          { params: queryParams }
        );

        console.log("✅ General Ledger Response:", response.data);

        return response.data.data;
      } catch (error: any) {
        console.error("❌ General Ledger Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          fullError: error,
        });

        const errorMessage = error.response?.data?.message || error.message || "Failed to load general ledger";
        throw new Error(errorMessage);
      }
    },
  });
};

// Cash Flow Statement Types
export interface CashFlowActivity {
  description: string;
  amount: number;
  formatted: string;
}

export interface CashFlowSection {
  activities: CashFlowActivity[];
  total: number;
}

export interface CashFlowStatement {
  statement_name: string;
  period: string;
  currency: string;
  operating_activities: CashFlowSection;
  investing_activities: CashFlowSection;
  financing_activities: CashFlowSection;
  opening_cash: number;
  closing_cash: number;
  net_change: number;
}

export interface CashFlowResponse {
  status: boolean;
  message: string;
  data: CashFlowStatement;
}

export const useCashFlowStatement = (params?: FinancialStatementParams) => {
  return useQuery({
    queryKey: ["cash-flow-statement", params],
    queryFn: async () => {
      try {
        const queryParams: Record<string, string> = {};

        if (params?.start_date) {
          queryParams.start_date = format(params.start_date, "yyyy-MM-dd");
        }
        if (params?.end_date) {
          queryParams.end_date = format(params.end_date, "yyyy-MM-dd");
        }
        if (params?.project_id) {
          queryParams.project_id = params.project_id;
        }

        console.log("🔍 Cash Flow Request:", {
          url: "/finance/reports/cash-flow/",
          params: queryParams,
        });

        const response = await axiosInstance.get<CashFlowResponse>(
          "/finance/reports/cash-flow/",
          { params: queryParams }
        );

        console.log("✅ Cash Flow Response:", response.data);

        return response.data.data;
      } catch (error: any) {
        console.error("❌ Cash Flow Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          fullError: error,
        });

        const errorMessage = error.response?.data?.message || error.message || "Failed to load cash flow statement";
        throw new Error(errorMessage);
      }
    },
  });
};

// Budget Variance Types
export interface BudgetVarianceAccount {
  account_code: string;
  account_name: string;
  budgeted_amount: number;
  actual_amount: number;
  variance: number;
  variance_percent: number;
  is_favorable: boolean;
}

export interface BudgetVariance {
  period: string;
  start_date: string;
  end_date: string;
  accounts: BudgetVarianceAccount[];
  total_budget: number;
  total_actual: number;
  total_variance: number;
  variance_percent: number;
}

export interface BudgetVarianceResponse {
  status: boolean;
  message: string;
  data: BudgetVariance;
}

export interface BudgetVarianceParams extends FinancialStatementParams {
  period_type?: "monthly" | "quarterly" | "annual";
}

export const useBudgetVariance = (params?: BudgetVarianceParams) => {
  return useQuery({
    queryKey: ["budget-variance", params],
    queryFn: async () => {
      try {
        const queryParams: Record<string, string> = {};

        if (params?.start_date) {
          queryParams.start_date = format(params.start_date, "yyyy-MM-dd");
        }
        if (params?.end_date) {
          queryParams.end_date = format(params.end_date, "yyyy-MM-dd");
        }
        if (params?.project_id) {
          queryParams.project_id = params.project_id;
        }
        if (params?.period_type) {
          queryParams.period_type = params.period_type;
        }

        console.log("🔍 Budget Variance Request:", {
          url: "/finance/reports/budget-variance/",
          params: queryParams,
        });

        const response = await axiosInstance.get<BudgetVarianceResponse>(
          "/finance/reports/budget-variance/",
          { params: queryParams }
        );

        console.log("✅ Budget Variance Response:", response.data);

        return response.data.data;
      } catch (error: any) {
        console.error("❌ Budget Variance Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          fullError: error,
        });

        const errorMessage = error.response?.data?.message || error.message || "Failed to load budget variance";
        throw new Error(errorMessage);
      }
    },
  });
};

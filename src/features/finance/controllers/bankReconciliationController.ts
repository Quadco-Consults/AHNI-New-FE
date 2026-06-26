/**
 * Bank Reconciliation Controller
 *
 * React Query hooks for bank account management and reconciliation.
 */

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  BankAccount,
  BankStatement,
  BankTransaction,
  BankReconciliation,
  BankReconciliationDetails,
  OutstandingCheck,
  CreateBankAccount,
  CreateBankStatement,
  CreateBankTransaction,
  ReconcileTransaction,
  CreateBankReconciliation,
  CompleteBankReconciliation,
  CreateOutstandingCheck,
  ClearOutstandingCheck,
  BankAccountFilters,
  BankStatementFilters,
  BankTransactionFilters,
  BankReconciliationFilters,
  OutstandingCheckFilters,
} from "../types/bank-reconciliation.types";

const BASE_URL = "/finance/";

// ===== BANK ACCOUNT HOOKS =====

/**
 * Get all bank accounts
 */
export const useGetBankAccounts = (filters?: BankAccountFilters) => {
  return useQuery<{ status: string; data: BankAccount[] }>({
    queryKey: ["bank-accounts", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}bank-accounts/`, {
          params: filters,
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single bank account
 */
export const useGetBankAccount = (id: string, enabled: boolean = true) => {
  return useQuery<{ status: string; data: BankAccount }>({
    queryKey: ["bank-account", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-accounts/${id}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create bank account
 */
export const useCreateBankAccount = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankAccount },
    Error,
    CreateBankAccount
  >({
    endpoint: `${BASE_URL}bank-accounts/`,
    queryKey: ["bank-accounts"],
    isAuth: true,
    method: "POST",
  });

  const createBankAccount = async (accountData: CreateBankAccount) => {
    try {
      console.log("Creating bank account:", accountData);
      await callApi({ data: accountData });
    } catch (err) {
      console.error("Error creating bank account:", err);
      throw err;
    }
  };

  return {
    createBankAccount,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Set bank account as default
 */
export const useSetDefaultBankAccount = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankAccount },
    Error,
    Record<string, never>
  >({
    endpoint: "",
    queryKey: ["bank-accounts"],
    isAuth: true,
    method: "POST",
  });

  const setDefaultAccount = async (accountId: string) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}bank-accounts/${accountId}/set_default/`,
        data: {},
      });
    } catch (err) {
      console.error("Error setting default account:", err);
      throw err;
    }
  };

  return {
    setDefaultAccount,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== BANK STATEMENT HOOKS =====

/**
 * Get all bank statements
 */
export const useGetBankStatements = (filters?: BankStatementFilters) => {
  return useQuery<{ status: string; data: BankStatement[] }>({
    queryKey: ["bank-statements", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-statements/`,
          { params: filters }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single bank statement
 */
export const useGetBankStatement = (id: string, enabled: boolean = true) => {
  return useQuery<{ status: string; data: BankStatement }>({
    queryKey: ["bank-statement", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-statements/${id}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create bank statement
 */
export const useCreateBankStatement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankStatement },
    Error,
    CreateBankStatement
  >({
    endpoint: `${BASE_URL}bank-statements/`,
    queryKey: ["bank-statements"],
    isAuth: true,
    method: "POST",
  });

  const createBankStatement = async (statementData: CreateBankStatement) => {
    try {
      console.log("Creating bank statement:", statementData);
      await callApi({ data: statementData });
    } catch (err) {
      console.error("Error creating bank statement:", err);
      throw err;
    }
  };

  return {
    createBankStatement,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Import transactions from bank statement file
 */
export const useImportBankStatementTransactions = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    {
      status: string;
      message: string;
      data: {
        statement_id: string;
        total_transactions: number;
        auto_matched: number;
        suggested_matches: number;
        unmatched: number;
        metadata: any;
        transactions: BankTransaction[];
      };
    },
    Error,
    FormData
  >({
    endpoint: "",
    queryKey: ["bank-statements", "bank-transactions"],
    isAuth: true,
    method: "POST",
  });

  const importTransactions = async (statementId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await callApi({
        endpoint: `${BASE_URL}bank-statements/${statementId}/import_transactions/`,
        data: formData,
      });
    } catch (err) {
      console.error("Error importing transactions:", err);
      throw err;
    }
  };

  return {
    importTransactions,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== BANK TRANSACTION HOOKS =====

/**
 * Get all bank transactions
 */
export const useGetBankTransactions = (filters?: BankTransactionFilters) => {
  return useQuery<{ status: string; data: BankTransaction[] }>({
    queryKey: ["bank-transactions", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-transactions/`,
          { params: filters }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single bank transaction
 */
export const useGetBankTransaction = (id: string, enabled: boolean = true) => {
  return useQuery<{ status: string; data: BankTransaction }>({
    queryKey: ["bank-transaction", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-transactions/${id}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create bank transaction
 */
export const useCreateBankTransaction = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankTransaction },
    Error,
    CreateBankTransaction
  >({
    endpoint: `${BASE_URL}bank-transactions/`,
    queryKey: ["bank-transactions"],
    isAuth: true,
    method: "POST",
  });

  const createBankTransaction = async (
    transactionData: CreateBankTransaction
  ) => {
    try {
      console.log("Creating bank transaction:", transactionData);
      await callApi({ data: transactionData });
    } catch (err) {
      console.error("Error creating bank transaction:", err);
      throw err;
    }
  };

  return {
    createBankTransaction,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Reconcile bank transaction
 */
export const useReconcileTransaction = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankTransaction },
    Error,
    ReconcileTransaction
  >({
    endpoint: "",
    queryKey: ["bank-transactions"],
    isAuth: true,
    method: "POST",
  });

  const reconcileTransaction = async (
    transactionId: string,
    reconcileData: ReconcileTransaction
  ) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}bank-transactions/${transactionId}/reconcile/`,
        data: reconcileData,
      });
    } catch (err) {
      console.error("Error reconciling transaction:", err);
      throw err;
    }
  };

  return {
    reconcileTransaction,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Clear bank transaction
 */
export const useClearTransaction = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankTransaction },
    Error,
    { notes?: string }
  >({
    endpoint: "",
    queryKey: ["bank-transactions"],
    isAuth: true,
    method: "POST",
  });

  const clearTransaction = async (transactionId: string, notes?: string) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}bank-transactions/${transactionId}/clear/`,
        data: { notes },
      });
    } catch (err) {
      console.error("Error clearing transaction:", err);
      throw err;
    }
  };

  return {
    clearTransaction,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== BANK RECONCILIATION HOOKS =====

/**
 * Get all bank reconciliations
 */
export const useGetBankReconciliations = (
  filters?: BankReconciliationFilters
) => {
  return useQuery<{ status: string; data: BankReconciliation[] }>({
    queryKey: ["bank-reconciliations", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-reconciliations/`,
          { params: filters }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single bank reconciliation
 */
export const useGetBankReconciliation = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<{ status: string; data: BankReconciliationDetails }>({
    queryKey: ["bank-reconciliation", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}bank-reconciliations/${id}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create bank reconciliation
 */
export const useCreateBankReconciliation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankReconciliation },
    Error,
    CreateBankReconciliation
  >({
    endpoint: `${BASE_URL}bank-reconciliations/`,
    queryKey: ["bank-reconciliations"],
    isAuth: true,
    method: "POST",
  });

  const createBankReconciliation = async (
    reconciliationData: CreateBankReconciliation
  ) => {
    try {
      console.log("Creating bank reconciliation:", reconciliationData);
      await callApi({ data: reconciliationData });
    } catch (err) {
      console.error("Error creating bank reconciliation:", err);
      throw err;
    }
  };

  return {
    createBankReconciliation,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Complete bank reconciliation
 */
export const useCompleteBankReconciliation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankReconciliation },
    Error,
    CompleteBankReconciliation
  >({
    endpoint: "",
    queryKey: ["bank-reconciliations"],
    isAuth: true,
    method: "POST",
  });

  const completeReconciliation = async (
    reconciliationId: string,
    completeData: CompleteBankReconciliation
  ) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}bank-reconciliations/${reconciliationId}/complete/`,
        data: completeData,
      });
    } catch (err) {
      console.error("Error completing reconciliation:", err);
      throw err;
    }
  };

  return {
    completeReconciliation,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Recalculate bank reconciliation
 */
export const useRecalculateReconciliation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: BankReconciliation },
    Error,
    Record<string, never>
  >({
    endpoint: "",
    queryKey: ["bank-reconciliations"],
    isAuth: true,
    method: "POST",
  });

  const recalculateReconciliation = async (reconciliationId: string) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}bank-reconciliations/${reconciliationId}/recalculate/`,
        data: {},
      });
    } catch (err) {
      console.error("Error recalculating reconciliation:", err);
      throw err;
    }
  };

  return {
    recalculateReconciliation,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== OUTSTANDING CHECK HOOKS =====

/**
 * Get all outstanding checks
 */
export const useGetOutstandingChecks = (filters?: OutstandingCheckFilters) => {
  return useQuery<{ status: string; data: OutstandingCheck[] }>({
    queryKey: ["outstanding-checks", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}outstanding-checks/`,
          { params: filters }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Create outstanding check
 */
export const useCreateOutstandingCheck = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: OutstandingCheck },
    Error,
    CreateOutstandingCheck
  >({
    endpoint: `${BASE_URL}outstanding-checks/`,
    queryKey: ["outstanding-checks"],
    isAuth: true,
    method: "POST",
  });

  const createOutstandingCheck = async (checkData: CreateOutstandingCheck) => {
    try {
      console.log("Creating outstanding check:", checkData);
      await callApi({ data: checkData });
    } catch (err) {
      console.error("Error creating outstanding check:", err);
      throw err;
    }
  };

  return {
    createOutstandingCheck,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Clear outstanding check
 */
export const useClearOutstandingCheck = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: OutstandingCheck },
    Error,
    ClearOutstandingCheck
  >({
    endpoint: "",
    queryKey: ["outstanding-checks"],
    isAuth: true,
    method: "POST",
  });

  const clearCheck = async (
    checkId: string,
    clearData: ClearOutstandingCheck
  ) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}outstanding-checks/${checkId}/clear/`,
        data: clearData,
      });
    } catch (err) {
      console.error("Error clearing check:", err);
      throw err;
    }
  };

  return {
    clearCheck,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Void outstanding check
 */
export const useVoidOutstandingCheck = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: OutstandingCheck },
    Error,
    { void_date?: string }
  >({
    endpoint: "",
    queryKey: ["outstanding-checks"],
    isAuth: true,
    method: "POST",
  });

  const voidCheck = async (checkId: string, void_date?: string) => {
    try {
      await callApi({
        endpoint: `${BASE_URL}outstanding-checks/${checkId}/void/`,
        data: { void_date },
      });
    } catch (err) {
      console.error("Error voiding check:", err);
      throw err;
    }
  };

  return {
    voidCheck,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== HELPER FUNCTIONS =====

/**
 * Format currency amount
 */
export const formatBankCurrency = (
  amount: number,
  currency: string = "NGN"
): string => {
  const currencySymbol = currency === "NGN" ? "₦" : "$";
  return `${currencySymbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Get status badge color for transactions
 */
export const getTransactionStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "reconciled":
      return "success";
    case "cleared":
      return "success";
    case "outstanding":
      return "warning";
    case "unreconciled":
    default:
      return "default";
  }
};

/**
 * Get status badge color for reconciliations
 */
export const getReconciliationStatusColor = (
  is_balanced: boolean
): "success" | "destructive" => {
  return is_balanced ? "success" : "destructive";
};

/**
 * Format account number for display
 */
export const formatAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length > 4) {
    return `****${accountNumber.slice(-4)}`;
  }
  return accountNumber;
};

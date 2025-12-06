import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ChartOfAccount,
  JournalEntry,
  BankAccount,
  ChartOfAccountFormData,
  JournalEntryFormData,
  BankAccountFormData,
  AccountType
} from "../types/accounting.types";

// API Response interface
interface FinanceApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// ===== CHART OF ACCOUNTS =====

export const useGetChartOfAccounts = (filters?: {
  account_type?: AccountType;
  is_active?: boolean;
  search?: string;
  parent_account?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<ChartOfAccount[]>>({
    queryKey: ["chart-of-accounts", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.account_type) params.append('account_type', filters.account_type);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.parent_account) params.append('parent_account', filters.parent_account);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        // Use the actual backend API endpoint
        const response = await AxiosWithToken.get(`finance/charts-of-accounts/?${params.toString()}`);

        // Debug logging
        console.log("Chart of Accounts API Response:", response.data);

        // Transform the response data - backend returns data under 'results' with different field names
        if (response.data && response.data.data && response.data.data.results && Array.isArray(response.data.data.results)) {
          const transformedData = {
            ...response.data,
            data: response.data.data.results.map((account: any) => ({
              ...account,
              // Map backend fields to frontend expected fields
              account_name: account.name || account.account_name || '',
              account_code: account.code || account.account_code || '',
              // Add missing required fields with defaults
              account_type: account.account_type || 'ASSETS',
              is_active: account.is_active !== undefined ? account.is_active : true,
              is_header: account.is_header !== undefined ? account.is_header : false,
              balance: account.balance || 0,
              // Keep all original fields
              id: account.id,
              description: account.description || '',
              created_at: account.created_datetime || account.created_at,
              updated_at: account.updated_datetime || account.updated_at
            }))
          };
          console.log("Transformed Chart of Accounts Data:", transformedData);
          return transformedData;
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Chart of Accounts fetch error:", error);
        throw new Error("Failed to fetch chart of accounts: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleChartOfAccount = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<ChartOfAccount>>({
    queryKey: ["chart-of-account", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/charts-of-accounts/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch chart of account: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateChartOfAccount = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<ChartOfAccount>,
    Error,
    ChartOfAccountFormData
  >({
    endpoint: "finance/charts-of-accounts/",
    queryKey: ["chart-of-accounts"],
    isAuth: true,
    method: "POST",
  });

  const createChartOfAccount = async (data: ChartOfAccountFormData) => {
    try {
      // Transform field names for the API
      const apiData = {
        ...data,
        name: data.account_name,
        code: data.account_code,
        // Remove frontend field names since API expects different names
        account_name: undefined,
        account_code: undefined
      };

      const result = await callApi(apiData);
      queryClient.invalidateQueries({ queryKey: ["chart-of-accounts"] });
      return result;
    } catch (error) {
      console.error("Chart of account creation error:", error);
      throw error;
    }
  };

  return { createChartOfAccount, data, isLoading, isSuccess, error };
};

export const useUpdateChartOfAccount = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<ChartOfAccount>,
    Error,
    Partial<ChartOfAccountFormData>
  >({
    endpoint: `finance/charts-of-accounts/${id}/`,
    queryKey: ["chart-of-accounts"],
    isAuth: true,
    method: "PATCH",
  });

  const updateChartOfAccount = async (data: Partial<ChartOfAccountFormData>) => {
    try {
      // Transform field names for the API
      const apiData = {
        ...data,
        // Transform account_name to name if present
        ...(data.account_name && { name: data.account_name }),
        // Transform account_code to code if present
        ...(data.account_code && { code: data.account_code }),
        // Remove frontend field names since API expects different names
        account_name: undefined,
        account_code: undefined
      };

      const result = await callApi(apiData);
      queryClient.invalidateQueries({ queryKey: ["chart-of-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["chart-of-account", id] });
      return result;
    } catch (error) {
      console.error("Chart of account update error:", error);
      throw error;
    }
  };

  return { updateChartOfAccount, data, isLoading, isSuccess, error };
};

export const useDeleteChartOfAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`finance/charts-of-accounts/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete chart of account: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chart-of-accounts"] });
    },
  });
};

// ===== JOURNAL ENTRIES =====

export const useGetJournalEntries = (filters?: {
  entry_type?: string;
  is_posted?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<JournalEntry>>>({
    queryKey: ["journal-entries", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.entry_type) params.append('entry_type', filters.entry_type);
        if (filters?.is_posted !== undefined) params.append('is_posted', filters.is_posted.toString());
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`finance/journal-entries/?${params.toString()}`);

        // Debug logging
        console.log("Journal Entries API Response:", response.data);

        // Transform response to match expected structure
        if (response.data && response.data.data) {
          // Check if it's paginated response
          if (Array.isArray(response.data.data.results)) {
            return {
              ...response.data,
              data: {
                count: response.data.data.pagination?.total || response.data.data.results.length,
                next: response.data.data.pagination?.next,
                previous: response.data.data.pagination?.previous,
                results: response.data.data.results
              }
            };
          }
          // If it's a direct array
          else if (Array.isArray(response.data.data)) {
            return {
              ...response.data,
              data: {
                count: response.data.data.length,
                next: null,
                previous: null,
                results: response.data.data
              }
            };
          }
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;

        // Check for 404 - endpoint not implemented
        if (axiosError.response?.status === 404) {
          console.warn("Journal entries endpoint not found (404) - feature may not be implemented yet");
          throw new Error("Journal entries feature is currently being implemented. Please check back later.");
        }

        throw new Error("Failed to fetch journal entries: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
    // Add error handling to prevent infinite loading
    retry: false,
  });
};

interface JournalEntryApiPayload {
  entry_date: string;
  description: string;
  reference?: string;
  lines: {
    account: string;
    description: string;
    debit_amount: number;
    credit_amount: number;
    line_number: number;
    project?: string;
    department?: string;
  }[];
}

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<JournalEntry>,
    Error,
    JournalEntryApiPayload
  >({
    endpoint: "finance/journal-entries/",
    queryKey: ["journal-entries"],
    isAuth: true,
    method: "POST",
  });

  const createJournalEntry = async (data: JournalEntryFormData) => {
    try {
      // Transform line items for API
      const transformedLines = data.line_items.map((line, index) => ({
        account: line.account,
        description: line.description || "",
        debit_amount: Number(line.debit_amount) || 0,
        credit_amount: Number(line.credit_amount) || 0,
        line_number: index + 1,
        ...(line.project && { project: line.project }),
        ...(line.department && { department: line.department }),
      }));

      const apiData = {
        entry_date: data.entry_date,
        description: data.description,
        reference: data.reference_number,
        lines: transformedLines,
      };

      console.log("Creating journal entry with lines:", JSON.stringify(apiData, null, 2));

      const result = await callApi(apiData);
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      return result;
    } catch (error) {
      console.error("Journal entry creation error:", error);
      throw error;
    }
  };

  return { createJournalEntry, data, isLoading, isSuccess, error };
};

// Get single journal entry
export const useGetSingleJournalEntry = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<JournalEntry>>({
    queryKey: ["journal-entry", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/journal-entries/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch journal entry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Update journal entry
export const useUpdateJournalEntry = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<JournalEntry>,
    Error,
    Partial<JournalEntryFormData>
  >({
    endpoint: `finance/journal-entries/${id}/`,
    queryKey: ["journal-entries"],
    isAuth: true,
    method: "PATCH",
  });

  const updateJournalEntry = async (data: Partial<JournalEntryFormData>) => {
    try {
      // Transform field names and structure for the API
      let transformedLines;
      if (data.line_items) {
        transformedLines = data.line_items.map((line, index) => ({
          ...line,
          line_number: index + 1,
          // For updates, journal_entry field will be set by backend if needed
          // Ensure amounts are numbers
          debit_amount: Number(line.debit_amount) || 0,
          credit_amount: Number(line.credit_amount) || 0,
        }));
      }

      const apiData = {
        ...data,
        // Transform line_items to lines if present
        ...(transformedLines && { lines: transformedLines }),
        // Remove frontend field names since API expects different names
        line_items: undefined
      };

      const result = await callApi(apiData);
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entry", id] });
      return result;
    } catch (error) {
      console.error("Journal entry update error:", error);
      throw error;
    }
  };

  return { updateJournalEntry, data, isLoading, isSuccess, error };
};

// Delete journal entry
export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`finance/journal-entries/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete journal entry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
};

// Post journal entry
export const usePostJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.post(`finance/journal-entries/${id}/post_entry/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to post journal entry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
};

// Unpost journal entry
export const useUnpostJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.post(`finance/journal-entries/${id}/unpost_entry/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to unpost journal entry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
};

// Get journal entry statistics
export const useGetJournalEntryStats = () => {
  return useQuery<FinanceApiResponse<{
    total_entries: number;
    posted_entries: number;
    draft_entries: number;
    total_debit_amount: number;
    total_credit_amount: number;
    entries_this_month: number;
  }>>({
    queryKey: ["journal-entry-stats"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("finance/journal-entries/stats/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;

        // Check for 404 - endpoint not implemented
        if (axiosError.response?.status === 404) {
          console.warn("Journal entry stats endpoint not found (404) - feature may not be implemented yet");
          throw new Error("Journal entry statistics feature is currently being implemented. Please check back later.");
        }

        throw new Error("Failed to fetch journal entry statistics: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
    retry: false, // Don't retry on error to prevent infinite loading
  });
};

// Direct API function for programmatic journal entry creation (used by integration service)
export const createJournalEntryAPI = async (data: JournalEntryFormData): Promise<{
  success: boolean;
  data?: JournalEntry;
  message?: string;
}> => {
  try {
    const response = await AxiosWithToken.post("finance/journal-entries/", data);
    return {
      success: true,
      data: response.data.data,
      message: "Journal entry created successfully"
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      message: `Failed to create journal entry: ${(axiosError.response?.data as any)?.message || axiosError.message}`
    };
  }
};

// ===== BANK ACCOUNTS =====

export const useGetBankAccounts = (filters?: {
  is_active?: boolean;
  account_type?: string;
  search?: string;
}) => {
  return useQuery<FinanceApiResponse<BankAccount[]>>({
    queryKey: ["bank-accounts", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.account_type) params.append('account_type', filters.account_type);
        if (filters?.search) params.append('search', filters.search);

        const response = await AxiosWithToken.get(`finance/bank-accounts/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch bank accounts: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<BankAccount>,
    Error,
    BankAccountFormData
  >({
    endpoint: "finance/bank-accounts/",
    queryKey: ["bank-accounts"],
    isAuth: true,
    method: "POST",
  });

  const createBankAccount = async (data: BankAccountFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      return result;
    } catch (error) {
      console.error("Bank account creation error:", error);
      throw error;
    }
  };

  return { createBankAccount, data, isLoading, isSuccess, error };
};

export const useUpdateBankAccount = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<BankAccount>,
    Error,
    BankAccountFormData
  >({
    endpoint: `finance/bank-accounts/${id}/`,
    queryKey: ["bank-accounts"],
    isAuth: true,
    method: "PATCH",
  });

  const updateBankAccount = async (data: BankAccountFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      return result;
    } catch (error) {
      console.error("Bank account update error:", error);
      throw error;
    }
  };

  return { updateBankAccount, data, isLoading, isSuccess, error };
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<any>,
    Error,
    Record<string, never>
  >({
    endpoint: "finance/bank-accounts/",
    queryKey: ["bank-accounts"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteBankAccount = async (id: string) => {
    try {
      const result = await callApi({} as Record<string, never>, `finance/bank-accounts/${id}/`);
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      return result;
    } catch (error) {
      console.error("Bank account delete error:", error);
      throw error;
    }
  };

  return { deleteBankAccount, data, isLoading, isSuccess, error };
};
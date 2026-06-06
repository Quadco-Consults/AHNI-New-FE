import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  Expenditure,
  CreateExpenditureRequest,
  UpdateExpenditureRequest,
  ApproveExpenditureRequest,
  PostExpenditureRequest,
  VoidExpenditureRequest,
  SyncToQuickBooksRequest,
  ExpenditureFilters,
  ExpenditureSummary,
  ExpenditureMetadata,
  ExpenditureApiResponse,
  ExportOptions
} from "../types/expenditure.types";

const BASE_URL = "/finance/expenditures/";

// ===== EXPENDITURE CRUD OPERATIONS =====

/**
 * Get all expenditures with filtering
 */
export const useGetExpenditures = (filters?: ExpenditureFilters & { page?: number; size?: number }) => {
  return useQuery<ExpenditureApiResponse<Expenditure[]>>({
    queryKey: ["expenditures", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page: filters?.page || 1,
            size: filters?.size || 20,
            ...filters
          }
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single expenditure
 */
export const useGetExpenditure = (id: string, enabled: boolean = true) => {
  return useQuery<ExpenditureApiResponse<Expenditure>>({
    queryKey: ["expenditure", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create expenditure
 */
export const useCreateExpenditure = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ExpenditureApiResponse<Expenditure>,
    Error,
    CreateExpenditureRequest
  >({
    endpoint: BASE_URL,
    queryKey: ["expenditures"],
    isAuth: true,
    method: "POST",
  });

  const createExpenditure = async (expenditureData: CreateExpenditureRequest) => {
    try {
      console.log("Creating expenditure:", expenditureData);

      // Prepare form data if attachments are included
      const formData = new FormData();

      // Add all expenditure fields
      Object.entries(expenditureData).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value)) {
          // Handle file attachments
          value.forEach((file: File) => {
            formData.append('attachments', file);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await callApi(expenditureData);
      console.log("Expenditure created:", result);
      return result;
    } catch (error) {
      console.error("Expenditure creation error:", error);
      throw error;
    }
  };

  return { createExpenditure, data, isLoading, isSuccess, error };
};

/**
 * Update expenditure
 */
export const useUpdateExpenditure = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ExpenditureApiResponse<Expenditure>,
    Error,
    UpdateExpenditureRequest
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["expenditures", "expenditure"],
    isAuth: true,
    method: "PATCH",
  });

  const updateExpenditure = async (expenditureData: UpdateExpenditureRequest) => {
    try {
      console.log("Updating expenditure:", id, expenditureData);
      const result = await callApi(expenditureData);
      console.log("Expenditure updated:", result);
      return result;
    } catch (error) {
      console.error("Expenditure update error:", error);
      throw error;
    }
  };

  return { updateExpenditure, data, isLoading, isSuccess, error };
};

/**
 * Delete expenditure
 */
export const useDeleteExpenditure = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ExpenditureApiResponse<null>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["expenditures"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteExpenditure = async () => {
    try {
      console.log("Deleting expenditure:", id);
      const result = await callApi();
      console.log("Expenditure deleted");
      return result;
    } catch (error) {
      console.error("Expenditure deletion error:", error);
      throw error;
    }
  };

  return { deleteExpenditure, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW OPERATIONS =====

/**
 * Submit expenditure for approval
 */
export const useSubmitExpenditure = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ExpenditureApiResponse<Expenditure>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["expenditures", "expenditure"],
    isAuth: true,
    method: "POST",
  });

  const submitForApproval = async () => {
    try {
      console.log("Submitting expenditure for approval:", id);
      const result = await callApi();
      console.log("Expenditure submitted for approval");
      return result;
    } catch (error) {
      console.error("Expenditure submission error:", error);
      throw error;
    }
  };

  return { submitForApproval, isLoading, isSuccess, error };
};

/**
 * Approve/Reject expenditure
 */
export const useApproveExpenditure = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ExpenditureApiResponse<Expenditure>,
    Error,
    ApproveExpenditureRequest
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["expenditures", "expenditure"],
    isAuth: true,
    method: "POST",
  });

  const processApproval = async (approvalData: ApproveExpenditureRequest) => {
    try {
      console.log("Processing approval for expenditure:", id, approvalData);
      const result = await callApi(approvalData);
      console.log("Expenditure approval processed:", result);
      return result;
    } catch (error) {
      console.error("Expenditure approval error:", error);
      throw error;
    }
  };

  return { processApproval, isLoading, isSuccess, error };
};

// ===== POSTING OPERATIONS =====

/**
 * Post expenditure (record in accounting books)
 */
export const usePostExpenditure = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ExpenditureApiResponse<Expenditure>,
    Error,
    PostExpenditureRequest
  >({
    endpoint: `${BASE_URL}${id}/post/`,
    queryKey: ["expenditures", "expenditure"],
    isAuth: true,
    method: "POST",
  });

  const postExpenditure = async (postData?: PostExpenditureRequest) => {
    try {
      console.log("Posting expenditure:", id, postData);
      const result = await callApi(postData || {});
      console.log("Expenditure posted successfully");
      return result;
    } catch (error) {
      console.error("Expenditure posting error:", error);
      throw error;
    }
  };

  return { postExpenditure, isLoading, isSuccess, error };
};

/**
 * Void expenditure
 */
export const useVoidExpenditure = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ExpenditureApiResponse<Expenditure>,
    Error,
    VoidExpenditureRequest
  >({
    endpoint: `${BASE_URL}${id}/void/`,
    queryKey: ["expenditures", "expenditure"],
    isAuth: true,
    method: "POST",
  });

  const voidExpenditure = async (voidData: VoidExpenditureRequest) => {
    try {
      console.log("Voiding expenditure:", id, voidData);
      const result = await callApi(voidData);
      console.log("Expenditure voided successfully");
      return result;
    } catch (error) {
      console.error("Expenditure void error:", error);
      throw error;
    }
  };

  return { voidExpenditure, isLoading, isSuccess, error };
};

// ===== QUICKBOOKS SYNC OPERATIONS =====

/**
 * Sync expenditure to QuickBooks
 */
export const useSyncToQuickBooks = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ExpenditureApiResponse<{ synced_count: number; failed_count: number; errors?: string[] }>,
    Error,
    SyncToQuickBooksRequest
  >({
    endpoint: `${BASE_URL}sync-to-quickbooks/`,
    queryKey: ["expenditures"],
    isAuth: true,
    method: "POST",
  });

  const syncToQuickBooks = async (syncData: SyncToQuickBooksRequest) => {
    try {
      console.log("Syncing expenditures to QuickBooks:", syncData);
      const result = await callApi(syncData);
      console.log("QuickBooks sync completed:", result);
      return result;
    } catch (error) {
      console.error("QuickBooks sync error:", error);
      throw error;
    }
  };

  return { syncToQuickBooks, isLoading, isSuccess, error };
};

// ===== MY PENDING APPROVALS =====

/**
 * Get expenditures pending my approval
 */
export const useGetMyPendingExpenditureApprovals = (enabled: boolean = true) => {
  return useQuery<ExpenditureApiResponse<Expenditure[]>>({
    queryKey: ["my-pending-expenditure-approvals"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my-pending-approvals/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: true,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// ===== REPORTING AND ANALYTICS =====

/**
 * Get summary statistics
 */
export const useGetExpenditureSummary = (filters?: ExpenditureFilters) => {
  return useQuery<ExpenditureApiResponse<ExpenditureSummary>>({
    queryKey: ["expenditure-summary", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}summary/`, {
          params: filters
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== EXPORT AND DOWNLOAD =====

/**
 * Export expenditures to Excel/PDF
 */
export const useExportExpenditures = () => {
  const exportExpenditures = async (options: ExportOptions) => {
    try {
      console.log("Exporting expenditures:", options);
      const response = await AxiosWithToken.post(`${BASE_URL}export/`, options, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `expenditures-${timestamp}.${options.format}`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("Export completed successfully");
      return true;
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  };

  return { exportExpenditures };
};

// ===== METADATA =====

/**
 * Get metadata for expenditures (categories, payment methods, etc.)
 */
export const useGetExpenditureMetadata = () => {
  return useQuery<ExpenditureApiResponse<ExpenditureMetadata>>({
    queryKey: ["expenditure-metadata"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}metadata/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });
};

// ===== HELPER FUNCTIONS =====

/**
 * Get status badge color
 */
export const getExpenditureStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" | "secondary" => {
  switch (status) {
    case "draft":
      return "default";
    case "pending_approval":
      return "warning";
    case "approved":
      return "success";
    case "posted":
      return "success";
    case "rejected":
      return "destructive";
    case "voided":
      return "secondary";
    default:
      return "default";
  }
};

/**
 * Get QuickBooks sync status badge color
 */
export const getQuickBooksSyncStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "not_synced":
      return "default";
    case "pending_sync":
      return "warning";
    case "synced":
      return "success";
    case "sync_failed":
      return "destructive";
    default:
      return "default";
  }
};

/**
 * Format expenditure category label
 */
export const formatExpenditureCategory = (category: string): string => {
  const categories: Record<string, string> = {
    office_supplies: "Office Supplies",
    utilities: "Utilities",
    travel: "Travel",
    accommodation: "Accommodation",
    meals: "Meals & Entertainment",
    transportation: "Transportation",
    professional_services: "Professional Services",
    equipment: "Equipment",
    software: "Software & Licenses",
    training: "Training & Development",
    marketing: "Marketing & Advertising",
    rent: "Rent & Lease",
    salaries: "Salaries & Wages",
    benefits: "Employee Benefits",
    insurance: "Insurance",
    taxes: "Taxes & Fees",
    miscellaneous: "Miscellaneous",
    other: "Other",
  };
  return categories[category] || category;
};

/**
 * Format payment method label
 */
export const formatPaymentMethod = (method: string): string => {
  const methods: Record<string, string> = {
    cash: "Cash",
    check: "Check",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    mobile_money: "Mobile Money",
    other: "Other",
  };
  return methods[method] || method;
};

/**
 * Format payee type label
 */
export const formatPayeeType = (type: string): string => {
  const types: Record<string, string> = {
    vendor: "Vendor",
    employee: "Employee",
    contractor: "Contractor",
    government: "Government Agency",
    other: "Other",
  };
  return types[type] || type;
};

/**
 * Format currency amount
 */
export const formatCurrencyAmount = (
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
 * Get approval status badge color
 */
export const getApprovalStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "not_submitted":
      return "default";
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
};

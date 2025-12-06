import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { useState } from "react";
import {
  ITravelExpensePaginatedData,
  ITravelExpenseSingleData,
  TEmployeeTERFormData,
  ITravelReconciliation,
} from "@/features/admin/types/travel-expense";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// Filter parameters interface
interface EmployeeTravelExpenseFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/hr/travel-expenses/";

// ===== EMPLOYEE TRAVEL EXPENSE HOOKS =====

// Get Employee's Travel Expenses (Paginated)
export const useGetEmployeeTravelExpenses = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: EmployeeTravelExpenseFilterParams) => {
  return useQuery<PaginatedResponse<ITravelExpensePaginatedData>>({
    queryKey: ["employeeTravelExpenses", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Employee Travel Expense
export const useGetSingleEmployeeTravelExpense = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<ITravelExpenseSingleData>>({
    queryKey: ["employeeTravelExpense", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Get Employee's Site Visits (for TER creation)
export const useGetEmployeeSiteVisits = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["employeeSiteVisits"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/site-visits/my-visits/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Create Employee Travel Expense
export const useCreateEmployeeTravelExpense = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ITravelExpenseSingleData,
    Error,
    TEmployeeTERFormData | FormData
  >({
    endpoint: BASE_URL,
    queryKey: ["employeeTravelExpenses"],
    isAuth: true,
    method: "POST",
    contentType: null, // Let axios handle FormData properly
  });

  const createEmployeeTravelExpense = async (details: TEmployeeTERFormData | FormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee travel expense create error:", error);
      throw error;
    }
  };

  return { createEmployeeTravelExpense, data, isLoading, isSuccess, error };
};

// Update Employee Travel Expense
export const useUpdateEmployeeTravelExpense = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ITravelExpenseSingleData,
    Error,
    TEmployeeTERFormData | FormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employeeTravelExpenses", "employeeTravelExpense"],
    isAuth: true,
    method: "PATCH",
    contentType: null,
  });

  const updateEmployeeTravelExpense = async (body: TEmployeeTERFormData | FormData) => {
    try {
      const result = await callApi(body);
      return result;
    } catch (error) {
      console.error("Employee travel expense update error:", error);
      throw error;
    }
  };

  return { updateEmployeeTravelExpense, data, isLoading, isSuccess, error };
};

// ===== RECONCILIATION HOOKS =====

// Get Travel Expense Reconciliation
export const useGetTravelReconciliation = (
  travelExpenseId: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<ITravelReconciliation>>({
    queryKey: ["travelReconciliation", travelExpenseId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${travelExpenseId}/reconciliation/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          // Return empty reconciliation data if none exists yet
          return {
            status: true,
            message: "No reconciliation data found",
            data: null
          } as any;
        }
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!travelExpenseId,
    refetchOnWindowFocus: false,
  });
};

// Calculate Reconciliation
export const useCalculateReconciliation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ITravelReconciliation | null>(null);

  const calculateReconciliation = async (travelExpenseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${travelExpenseId}/calculate-reconciliation/`
      );
      setData(response.data.data);
      return response.data;
    } catch (error) {
      console.error("Reconciliation calculation error:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { calculateReconciliation, data, isLoading, error };
};

// Process Reimbursement/Retirement with Documents
export const useProcessReconciliation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ITravelReconciliation | null>(null);

  const processReconciliation = async ({
    travelExpenseId,
    action,
    notes,
    reimbursementInvoice,
    retirementReceipt,
    supportingDocuments,
    documentDescriptions,
  }: {
    travelExpenseId: string;
    action: "approve" | "request_reimbursement" | "request_retirement";
    notes?: string;
    reimbursementInvoice?: File;
    retirementReceipt?: File;
    supportingDocuments?: File[];
    documentDescriptions?: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("action", action);

      if (notes) {
        formData.append("notes", notes);
      }

      // Add reimbursement invoice for reimbursement requests
      if (reimbursementInvoice && action === "request_reimbursement") {
        formData.append("reimbursement_invoice", reimbursementInvoice);
      }

      // Add retirement receipt for retirement requests
      if (retirementReceipt && action === "request_retirement") {
        formData.append("retirement_receipt", retirementReceipt);
      }

      // Add supporting documents
      if (supportingDocuments && supportingDocuments.length > 0) {
        supportingDocuments.forEach((doc, index) => {
          formData.append(`supporting_documents`, doc);
          if (documentDescriptions?.[index]) {
            formData.append(`document_descriptions`, documentDescriptions[index]);
          }
        });
      }

      const response = await AxiosWithToken.post(
        `${BASE_URL}${travelExpenseId}/process-reconciliation/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setData(response.data.data);
      return response.data;
    } catch (error) {
      console.error("Reconciliation processing error:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { processReconciliation, data, isLoading, error };
};

// Upload Reconciliation Documents (separate endpoint for additional documents)
export const useUploadReconciliationDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadDocuments = async ({
    reconciliationId,
    documents,
    documentTypes,
    descriptions,
  }: {
    reconciliationId: string;
    documents: File[];
    documentTypes: Array<"INVOICE" | "RECEIPT" | "BANK_STATEMENT" | "OTHER">;
    descriptions?: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();

      documents.forEach((doc, index) => {
        formData.append(`documents`, doc);
        formData.append(`document_types`, documentTypes[index]);
        if (descriptions?.[index]) {
          formData.append(`descriptions`, descriptions[index]);
        }
      });

      const response = await AxiosWithToken.post(
        `/hr/travel-reconciliation/${reconciliationId}/upload-documents/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Document upload error:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadDocuments, isLoading, error };
};

// ===== UTILITY FUNCTIONS =====

// Calculate actual total from activities
export const calculateActualTotal = (activities: any[]) => {
  return activities.reduce((total, activity) => {
    const airportTaxi = parseFloat(activity.airport_taxi_fee || 0);
    const registration = parseFloat(activity.registration_fee || 0);
    const interCityTaxi = parseFloat(activity.inter_city_taxi_fee || 0);
    const others = parseFloat(activity.others || 0);
    return total + airportTaxi + registration + interCityTaxi + others;
  }, 0);
};

// Calculate reconciliation difference
export const calculateReconciliationDifference = (
  budgetedTotal: number,
  actualTotal: number
) => {
  return actualTotal - budgetedTotal; // Positive = needs reimbursement, Negative = needs retirement
};

// Determine reconciliation type
export const getReconciliationType = (difference: number): "REIMBURSEMENT" | "RETIREMENT" => {
  return difference > 0 ? "REIMBURSEMENT" : "RETIREMENT";
};

// Format reconciliation summary
export const formatReconciliationSummary = (reconciliation: ITravelReconciliation | null) => {
  if (!reconciliation) return null;

  const isReimbursement = reconciliation.reconciliation_type === "REIMBURSEMENT";
  const amount = Math.abs(reconciliation.reconciliation_amount);

  return {
    type: reconciliation.reconciliation_type,
    amount,
    message: isReimbursement
      ? `Employee is owed ₦${amount.toLocaleString()} reimbursement`
      : `Employee should return ₦${amount.toLocaleString()} to AHNI`,
    status: reconciliation.reconciliation_status,
  };
};

// Legacy exports for backward compatibility
export const useGetEmployeeTravelExpensesQuery = useGetEmployeeTravelExpenses;
export const useGetSingleEmployeeTravelExpenseQuery = useGetSingleEmployeeTravelExpense;
export const useCreateEmployeeTravelExpenseMutation = useCreateEmployeeTravelExpense;
export const useUpdateEmployeeTravelExpenseMutation = useUpdateEmployeeTravelExpense;
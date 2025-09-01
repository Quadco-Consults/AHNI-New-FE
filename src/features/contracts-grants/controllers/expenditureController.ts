import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IExpenditurePaginatedData,
  IExpenditureSingleData,
  TExpenditureFormData,
} from "../types/grants";

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

// Filter parameters interface (with grantId requirement)
interface ExpenditureFilterParams {
  grantId: string;
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

// ===== EXPENDITURE HOOKS =====

// Get All Expenditures (Paginated) - for a specific grant
export const useGetAllExpenditures = ({
  grantId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: ExpenditureFilterParams) => {
  return useQuery<PaginatedResponse<IExpenditurePaginatedData>>({
    queryKey: ["expenditures", grantId, page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/projects/${grantId}/expenditures/`, {
          params: {
            page,
            size,
            ...(search && { search }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        
        // Handle specific backend errors
        if (errorData?.message?.includes("unsupported operand type")) {
          throw new Error("Backend calculation error: Data type mismatch in financial calculations. Please contact support.");
        }
        
        throw new Error("API Error: " + (errorData?.message || axiosError.message || "Unknown error"));
      }
    },
    enabled: enabled && !!grantId,
    refetchOnWindowFocus: false,
  });
};

// Create Expenditure for a specific grant
export const useCreateExpenditure = (grantId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IExpenditureSingleData,
    Error,
    TExpenditureFormData
  >({
    endpoint: `/projects/${grantId}/expenditures/`,
    queryKey: ["expenditures", grantId],
    isAuth: true,
    method: "POST",
  });

  const createExpenditure = async (details: TExpenditureFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Expenditure create error:", error);
    }
  };

  return { createExpenditure, data, isLoading, isSuccess, error };
};

// Update Expenditure for a specific grant
export const useUpdateExpenditure = (grantId: string, expenditureId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IExpenditurePaginatedData,
    Error,
    TExpenditureFormData
  >({
    endpoint: `/projects/${grantId}/expenditures/${expenditureId}/`,
    queryKey: ["expenditures", grantId],
    isAuth: true,
    method: "PUT",
  });

  const updateExpenditure = async (details: TExpenditureFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Expenditure update error:", error);
    }
  };

  return { updateExpenditure, data, isLoading, isSuccess, error };
};

// Delete Expenditure for a specific grant
export const useDeleteExpenditure = (grantId: string, expenditureId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IExpenditurePaginatedData,
    Error,
    Record<string, never>
  >({
    endpoint: `/projects/${grantId}/expenditures/${expenditureId}/`,
    queryKey: ["expenditures", grantId],
    isAuth: true,
    method: "DELETE",
  });

  const deleteExpenditure = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Expenditure delete error:", error);
    }
  };

  return { deleteExpenditure, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllExpendituresQuery = useGetAllExpenditures;
export const useCreateExpenditureMutation = useCreateExpenditure;
export const useModifyExpenditureMutation = useUpdateExpenditure;
export const useDeleteExpenditureMutation = useDeleteExpenditure;

// Missing named export
export const useModifyExpenditure = useUpdateExpenditure;
import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { useState } from "react";
import {
  ITravelExpensePaginatedData,
  ITravelExpenseSingleData,
  TTravelExpenseFormData,
} from "../types/travel-expense";

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
interface TravelExpenseFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/reports/travel-expenses/";

// ===== TRAVEL EXPENSE HOOKS =====

// Get All Travel Expenses (Paginated)
export const useGetAllTravelExpenses = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TravelExpenseFilterParams) => {
  return useQuery<PaginatedResponse<ITravelExpensePaginatedData>>({
    queryKey: ["travelExpenses", page, size, search, status],
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

// Get Single Travel Expense
export const useGetSingleTravelExpense = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<ITravelExpenseSingleData>>({
    queryKey: ["travelExpense", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Travel Expense
export const useCreateTravelExpense = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ITravelExpenseSingleData,
    Error,
    TTravelExpenseFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["travelExpenses"],
    isAuth: true,
    method: "POST",
  });

  const createTravelExpense = async (details: TTravelExpenseFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Travel expense create error:", error);
    }
  };

  return { createTravelExpense, data, isLoading, isSuccess, error };
};

// Modify Travel Expense (Full Update)
export const useModifyTravelExpense = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ITravelExpenseSingleData,
    Error,
    { id: string; body: TTravelExpenseFormData }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["travelExpenses", "travelExpense"],
    isAuth: true,
    method: "PUT",
  });

  const modifyTravelExpense = async (body: TTravelExpenseFormData) => {
    try {
      await callApi(body);
    } catch (error) {
      console.error("Travel expense modify error:", error);
    }
  };

  return { modifyTravelExpense, data, isLoading, isSuccess, error };
};

// Delete Travel Expense
export const useDeleteTravelExpense = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ITravelExpenseSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["travelExpenses"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteTravelExpense = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Travel expense delete error:", error);
    }
  };

  return { deleteTravelExpense, data, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW HOOKS =====

interface ApprovalRequest {
  comments: string;
}

// Review Travel Expense (First level approval)
export const useReviewTravelExpense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ITravelExpenseSingleData | null>(null);

  const reviewTravelExpense = async ({
    id,
    body,
  }: {
    id: string;
    body: ApprovalRequest;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${id}/review/`,
        body
      );
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Travel expense review error:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { reviewTravelExpense, data, isLoading, error };
};

// Authorize Travel Expense (Second level approval)
export const useAuthorizeTravelExpense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ITravelExpenseSingleData | null>(null);

  const authorizeTravelExpense = async ({
    id,
    body,
  }: {
    id: string;
    body: ApprovalRequest;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${id}/authorize/`,
        body
      );
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Travel expense authorize error:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { authorizeTravelExpense, data, isLoading, error };
};

// Approve Travel Expense (Final level approval)
export const useApproveTravelExpense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ITravelExpenseSingleData | null>(null);

  const approveTravelExpense = async ({
    id,
    body,
  }: {
    id: string;
    body: ApprovalRequest;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${id}/approve/`,
        body
      );
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Travel expense approve error:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { approveTravelExpense, data, isLoading, error };
};

// Legacy exports for backward compatibility
export const useGetAllTravelExpensesQuery = useGetAllTravelExpenses;
export const useGetSingleTravelExpenseQuery = useGetSingleTravelExpense;
export const useCreateTravelExpenseMutation = useCreateTravelExpense;
export const useModifyTravelExpenseMutation = useModifyTravelExpense;
export const useDeleteTravelExpenseMutation = useDeleteTravelExpense;

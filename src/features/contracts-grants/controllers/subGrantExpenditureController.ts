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
    paginator?: {
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
interface SubGrantExpenditureFilterParams {
  subGrantId: string;  // Changed from awardId to subGrantId
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/sub-grants/";  // Changed from sub-grant-awards to sub-grants

// ===== SUB-GRANT EXPENDITURE HOOKS =====

// Get All Expenditures for a specific sub-grant
export const useGetAllSubGrantExpenditures = ({
  subGrantId,  // Changed parameter name
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: SubGrantExpenditureFilterParams) => {
  return useQuery<PaginatedResponse<IExpenditurePaginatedData>>({
    queryKey: ["subGrantExpenditures", subGrantId, page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${subGrantId}/expenditures/`,  // Use subGrantId
          {
            params: {
              page,
              size,
              ...(search && { search }),
            },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!subGrantId,  // Check subGrantId
    refetchOnWindowFocus: false,
  });
};

// Create Expenditure for a specific sub-grant
export const useCreateSubGrantExpenditure = (subGrantId: string) => {  // Changed parameter
  const { callApi, isLoading, isSuccess, error, data} = useApiManager<
    IExpenditureSingleData,
    Error,
    TExpenditureFormData
  >({
    endpoint: `${BASE_URL}${subGrantId}/expenditures/`,  // Use subGrantId
    queryKey: ["subGrantExpenditures", "subGrants"],
    isAuth: true,
    method: "POST",
  });

  const createExpenditure = async (details: TExpenditureFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub-grant expenditure create error:", error);
    }
  };

  return { createExpenditure, data, isLoading, isSuccess, error };
};

// Update Expenditure for a specific sub-grant
export const useUpdateSubGrantExpenditure = (
  subGrantId: string,  // Changed from awardId
  expenditureId: string
) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IExpenditureSingleData,
    Error,
    TExpenditureFormData
  >({
    endpoint: `${BASE_URL}${subGrantId}/expenditures/${expenditureId}/`,  // Use subGrantId
    queryKey: ["subGrantExpenditures", "subGrants"],
    isAuth: true,
    method: "PUT",
  });

  const updateExpenditure = async (details: TExpenditureFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub-grant expenditure update error:", error);
    }
  };

  return { updateExpenditure, data, isLoading, isSuccess, error };
};

// Delete Expenditure for a specific sub-grant
export const useDeleteSubGrantExpenditure = (
  subGrantId: string,  // Changed from awardId
  expenditureId: string
) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IExpenditureSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${subGrantId}/expenditures/${expenditureId}/`,  // Use subGrantId
    queryKey: ["subGrantExpenditures", "subGrants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteExpenditure = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Sub-grant expenditure delete error:", error);
    }
  };

  return { deleteExpenditure, data, isLoading, isSuccess, error };
};

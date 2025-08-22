import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TFundRequestPaginatedResponse,
  TFundRequestResponseData,
} from "../types/fund-request";
import { TFundRequestFormValues } from "definations/program-validator";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface FundRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  project: string;
  enabled?: boolean;
}

const BASE_URL = "/programs/fund-requests/";

// ===== FUND REQUEST HOOKS =====

// Get All Fund Requests (Paginated)
export const useGetAllFundRequests = ({
  page = 1,
  size = 20,
  search = "",
  project,
  enabled = true,
}: FundRequestFilterParams) => {
  return useQuery<TFundRequestPaginatedResponse>({
    queryKey: ["fund-requests", page, size, search, project],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            project,
            ...(search && { search }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!project,
    refetchOnWindowFocus: false,
  });
};

// Get Single Fund Request
export const useGetSingleFundRequest = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<TFundRequestResponseData>>({
    queryKey: ["fund-request", id],
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

// Create Fund Request
export const useCreateFundRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    TFundRequestFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "POST",
  });

  const createFundRequest = async (details: TFundRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fund request create error:", error);
    }
  };

  return { createFundRequest, data, isLoading, isSuccess, error };
};

// Delete Fund Request
export const useDeleteFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFundRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Fund request delete error:", error);
    }
  };

  return { deleteFundRequest, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllFundRequestsQuery = useGetAllFundRequests;
export const useGetSingleFundRequestQuery = useGetSingleFundRequest;
export const useCreateFundRequestMutation = useCreateFundRequest;
export const useDeleteFundRequestMutation = useDeleteFundRequest;
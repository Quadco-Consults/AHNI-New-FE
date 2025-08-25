import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IConsultancyReportPaginatedData,
  IConsultancyReportSingleData,
  TConsultancyReportFormData,
} from "../types/contract-management/consultancy-report";

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
interface ConsultancyReportFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/consultancy/reports/"; // From original service

// ===== CONSULTANCY REPORT HOOKS =====

// Get All Consultancy Reports (Paginated)
export const useGetAllConsultancyReports = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: ConsultancyReportFilterParams) => {
  return useQuery<PaginatedResponse<IConsultancyReportPaginatedData>>({
    queryKey: ["consultancyReports", page, size, search, status],
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
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Consultancy Report
export const useGetSingleConsultancyReport = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IConsultancyReportSingleData>>({
    queryKey: ["consultancyReport", id],
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

// Create Consultancy Report
export const useCreateConsultancyReport = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyReportSingleData,
    Error,
    TConsultancyReportFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["consultancyReports"],
    isAuth: true,
    method: "POST",
  });

  const createConsultancyReport = async (details: TConsultancyReportFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultancy report create error:", error);
    }
  };

  return { createConsultancyReport, data, isLoading, isSuccess, error };
};

// Update Consultancy Report
export const useUpdateConsultancyReport = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyReportSingleData,
    Error,
    TConsultancyReportFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultancyReports", "consultancyReport"],
    isAuth: true,
    method: "PUT",
  });

  const updateConsultancyReport = async (details: TConsultancyReportFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultancy report update error:", error);
    }
  };

  return { updateConsultancyReport, data, isLoading, isSuccess, error };
};

// Delete Consultancy Report
export const useDeleteConsultancyReport = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyReportSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultancyReports"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteConsultancyReport = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Consultancy report delete error:", error);
    }
  };

  return { deleteConsultancyReport, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllConsultancyReportsQuery = useGetAllConsultancyReports;
export const useGetSingleConsultancyReportQuery = useGetSingleConsultancyReport;
export const useCreateConsultancyReportMutation = useCreateConsultancyReport;
export const useModifyConsultancyReportMutation = useUpdateConsultancyReport;
export const useDeleteConsultancyReportMutation = useDeleteConsultancyReport;

// Missing named export
export const useModifyConsultancyReport = useUpdateConsultancyReport;
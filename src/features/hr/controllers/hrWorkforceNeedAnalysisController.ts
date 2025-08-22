import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { WorkforceNeedAnalysis } from "../types/hr-workforce-need-analysis";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface WorkforceNeedAnalysisFilterParams {
  search?: string;
  location?: string;
  position?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/employees/workforce/need-analysis/";

// ===== WORKFORCE NEED ANALYSIS HOOKS =====

// Get Workforce Need Analysis
export const useGetWorkforceNeedAnalysis = ({
  search = "",
  location = "",
  position = "",
  page = 1,
  size = 20,
  enabled = true,
}: WorkforceNeedAnalysisFilterParams = {}) => {
  return useQuery<ApiResponse<WorkforceNeedAnalysis[]>>({
    queryKey: ["workforce-need-analysis", search, location, position, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(location && { location }),
            ...(position && { position }),
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

// Get Single Workforce Need Analysis
export const useGetWorkforceNeedAnalysisId = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<WorkforceNeedAnalysis>>({
    queryKey: ["workforce-need-analysis-single", id],
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

// Create Workforce Need Analysis
export const useCreateWorkforceNeedAnalysis = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceNeedAnalysis,
    Error,
    Partial<WorkforceNeedAnalysis>
  >({
    endpoint: BASE_URL,
    queryKey: ["workforce-need-analysis"],
    isAuth: true,
    method: "POST",
  });

  const createWorkforceNeedAnalysis = async (details: Partial<WorkforceNeedAnalysis>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce need analysis create error:", error);
    }
  };

  return { createWorkforceNeedAnalysis, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateWorkforceNeedAnalysisMutation = useCreateWorkforceNeedAnalysis;
export const useGetWorkforceNeedAnalysisIdQuery = useGetWorkforceNeedAnalysisId;
export const useGetWorkforceNeedAnalysisQuery = useGetWorkforceNeedAnalysis;
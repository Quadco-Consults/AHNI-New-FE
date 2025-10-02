import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { PerformanceAssesment, PerformanceAssesmentModel } from "../types/performance-assesment";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface PerformanceAssessmentFilterParams {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/performance/assessments/";

// ===== PERFORMANCE ASSESSMENT HOOKS =====

// Get Performance Assessments
export const useGetPerformanceAssesments = ({
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: PerformanceAssessmentFilterParams = {}) => {
  return useQuery<ApiResponse<PerformanceAssesment[]>>({
    queryKey: ["performance-assessments", search, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
          },
        });
        console.log("Raw API Response:", response.data);

        // Handle multiple possible response structures
        let results: PerformanceAssesment[] = [];

        if (Array.isArray(response.data?.data?.results)) {
          // Backend returns nested structure: data.data.results
          results = response.data.data.results;
        } else if (Array.isArray(response.data?.data)) {
          // Backend returns: data.data as array
          results = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Backend returns array directly
          results = response.data;
        }

        console.log("Extracted results:", results);
        console.log("Results count:", results.length);

        return {
          status: response.data?.status ?? true,
          message: response.data?.message ?? "Success",
          data: results,
        };
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Performance assessments fetch error:", axiosError);
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Performance Assessment
export const useGetPerformanceAssesment = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PerformanceAssesmentModel>>({
    queryKey: ["performance-assessment", id],
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

// Create Performance Assessment
export const useCreatePerformanceAssesment = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PerformanceAssesment,
    Error,
    Partial<PerformanceAssesment>
  >({
    endpoint: BASE_URL,
    queryKey: "performance-assessments",
    isAuth: true,
    method: "POST",
  });

  const createPerformanceAssesment = async (details: Partial<PerformanceAssesment>) => {
    try {
      const response = await callApi(details);
      console.log("Create response:", response);
      return response;
    } catch (error) {
      console.error("Performance assessment create error:", error);
      throw error;
    }
  };

  return { createPerformanceAssesment, data, isLoading, isSuccess, error };
};

// Update Performance Assessment
export const useUpdatePerformanceAssesment = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PerformanceAssesment,
    Error,
    Partial<PerformanceAssesment>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["performance-assessments", "performance-assessment"],
    isAuth: true,
    method: "PUT",
  });

  const updatePerformanceAssesment = async (details: Partial<PerformanceAssesment>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Performance assessment update error:", error);
    }
  };

  return { updatePerformanceAssesment, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreatePerformanceAssesmentMutation = useCreatePerformanceAssesment;
export const useGetPerformanceAssesmentQuery = useGetPerformanceAssesment;
export const useGetPerformanceAssesmentsQuery = useGetPerformanceAssesments;
export const useUpdatePerformanceAssesmentMutation = useUpdatePerformanceAssesment;
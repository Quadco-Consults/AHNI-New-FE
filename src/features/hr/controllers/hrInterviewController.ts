import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Interview } from "../types/interview";

// Interface for creating interview schedule
interface CreateInterviewData {
  application: string;
  interview_type: string;
  interviewers: string[];
  start_date: string;
  end_date: string;
}

// API Response interface
interface ApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

// Filter parameters interface
interface InterviewFilterParams {
  status?: string;
  search?: string;
  id?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/jobs/interviews/";

// ===== INTERVIEW HOOKS =====

// Get Interviews
export const useGetInterviews = ({
  status = "",
  search = "",
  id = "",
  page = 1,
  size = 20,
  enabled = true,
}: InterviewFilterParams = {}) => {
  return useQuery<ApiResponse<Interview[]>>({
    queryKey: ["interviews", status, search, id, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(id && { advertisement: id }),
            ...(status && { status }),
            ...(search && { search }),
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

// Get Single Interview
export const useGetInterview = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Interview>>({
    queryKey: ["interview", id],
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

// Create Interview
export const useCreateInterview = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any, // Response type - we'll use any for now
    Error,
    CreateInterviewData
  >({
    endpoint: BASE_URL,
    queryKey: ["interviews"],
    isAuth: true,
    method: "POST",
  });

  const createInterview = async (details: CreateInterviewData) => {
    try {
      console.log("API Manager: Sending request to:", BASE_URL);
      console.log("API Manager: Request data:", details);
      const result = await callApi(details);
      console.log("API Manager: Response:", result);
      return result;
    } catch (error) {
      console.error("Interview create error:", error);
      throw error; // Re-throw the error so it can be caught by the component
    }
  };

  return { createInterview, data, isLoading, isSuccess, error };
};

// Update Interview (for conducting/evaluating)
export const useUpdateInterview = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any, // Response type
    Error,
    any // Update data type
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["interviews", "interview"],
    isAuth: true,
    method: "PATCH",
  });

  const updateInterview = async (details: any) => {
    try {
      console.log("API Manager: Updating interview:", id);
      console.log("API Manager: Update data:", details);
      const result = await callApi(details);
      console.log("API Manager: Update response:", result);
      return result;
    } catch (error) {
      console.error("Interview update error:", error);
      throw error;
    }
  };

  return { updateInterview, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateInterviewMutation = useCreateInterview;
export const useGetInterviewQuery = useGetInterview;
export const useGetInterviewsQuery = useGetInterviews;
export const useUpdateInterviewMutation = useUpdateInterview;
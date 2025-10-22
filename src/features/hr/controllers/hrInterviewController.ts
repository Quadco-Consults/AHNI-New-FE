import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Interview, InterviewScore, InterviewSchedule } from "../types/interview";

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

// ===== MULTI-SCORER INTERVIEW HOOKS =====

// Submit Individual Interview Score
export const useSubmitInterviewScore = (interviewId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<InterviewScore>,
    Error,
    Partial<InterviewScore>
  >({
    endpoint: `${BASE_URL}${interviewId}/scores/`,
    queryKey: ["interviews", "interview-scores"],
    isAuth: true,
    method: "POST",
  });

  const submitScore = async (scoreData: Partial<InterviewScore>) => {
    try {
      console.log("Submitting interview score for interview:", interviewId);
      console.log("Score data:", scoreData);
      const result = await callApi(scoreData);
      console.log("Score submission response:", result);
      return result;
    } catch (error) {
      console.error("Interview score submission error:", error);
      throw error;
    }
  };

  return { submitScore, data, isLoading, isSuccess, error };
};

// Get All Scores for an Interview
export const useGetInterviewScores = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<InterviewScore[]>>({
    queryKey: ["interview-scores", interviewId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${interviewId}/scores/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!interviewId,
    refetchOnWindowFocus: false,
  });
};

// Get My Pending Interviews (as interviewer)
export const useGetMyPendingInterviews = (enabled: boolean = true) => {
  return useQuery<ApiResponse<InterviewSchedule[]>>({
    queryKey: ["my-pending-interviews"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my-pending/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: true,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// Get My Score for a Specific Interview
export const useGetMyInterviewScore = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<InterviewScore>>({
    queryKey: ["my-interview-score", interviewId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${interviewId}/my-score/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        // Return null if score doesn't exist yet (404)
        if (axiosError.response?.status === 404) {
          return { status: 'success', message: 'No score yet', data: null } as any;
        }
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!interviewId,
    refetchOnWindowFocus: false,
  });
};

// Update My Interview Score
export const useUpdateInterviewScore = (interviewId: string, scoreId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<InterviewScore>,
    Error,
    Partial<InterviewScore>
  >({
    endpoint: `${BASE_URL}${interviewId}/scores/${scoreId}/`,
    queryKey: ["interviews", "interview-scores"],
    isAuth: true,
    method: "PATCH",
  });

  const updateScore = async (scoreData: Partial<InterviewScore>) => {
    try {
      console.log("Updating interview score:", scoreId);
      console.log("Update data:", scoreData);
      const result = await callApi(scoreData);
      console.log("Score update response:", result);
      return result;
    } catch (error) {
      console.error("Interview score update error:", error);
      throw error;
    }
  };

  return { updateScore, data, isLoading, isSuccess, error };
};

// Get Interview Statistics/Summary
export const useGetInterviewSummary = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<{
    total_interviewers: number;
    completed_evaluations: number;
    pending_evaluations: number;
    average_scores: Interview['average_scores'];
    completion_percentage: number;
  }>>({
    queryKey: ["interview-summary", interviewId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${interviewId}/summary/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!interviewId,
    refetchOnWindowFocus: false,
  });
};

// Legacy exports for backward compatibility
export const useCreateInterviewMutation = useCreateInterview;
export const useGetInterviewQuery = useGetInterview;
export const useGetInterviewsQuery = useGetInterviews;
export const useUpdateInterviewMutation = useUpdateInterview;
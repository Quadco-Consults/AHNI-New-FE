import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  AdhocInterviewScore,
  AdhocInterviewSchedule
} from "../types/adhoc-management";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

const BASE_URL = "/programs/adhoc/interviews/";

// ===== MULTI-SCORER ADHOC INTERVIEW HOOKS =====

// Submit Individual Interview Score
export const useSubmitAdhocInterviewScore = (interviewId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<AdhocInterviewScore>,
    Error,
    Partial<AdhocInterviewScore>
  >({
    endpoint: `${BASE_URL}${interviewId}/scores/`,
    queryKey: ["adhoc-interviews", "adhoc-interview-scores"],
    isAuth: true,
    method: "POST",
  });

  const submitScore = async (scoreData: Partial<AdhocInterviewScore>) => {
    try {
      console.log("Submitting adhoc interview score for interview:", interviewId);
      console.log("Score data:", scoreData);
      const result = await callApi(scoreData);
      console.log("Score submission response:", result);
      return result;
    } catch (error) {
      console.error("Adhoc interview score submission error:", error);
      throw error;
    }
  };

  return { submitScore, data, isLoading, isSuccess, error };
};

// Get All Scores for an AdHoc Interview
export const useGetAdhocInterviewScores = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<AdhocInterviewScore[]>>({
    queryKey: ["adhoc-interview-scores", interviewId],
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

// Get My Pending AdHoc Interviews (as interviewer)
export const useGetMyPendingAdhocInterviews = (enabled: boolean = true) => {
  return useQuery<ApiResponse<AdhocInterviewSchedule[]>>({
    queryKey: ["my-pending-adhoc-interviews"],
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

// Get My Score for a Specific AdHoc Interview
export const useGetMyAdhocInterviewScore = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<AdhocInterviewScore>>({
    queryKey: ["my-adhoc-interview-score", interviewId],
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

// Update My AdHoc Interview Score
export const useUpdateAdhocInterviewScore = (interviewId: string, scoreId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<AdhocInterviewScore>,
    Error,
    Partial<AdhocInterviewScore>
  >({
    endpoint: `${BASE_URL}${interviewId}/scores/${scoreId}/`,
    queryKey: ["adhoc-interviews", "adhoc-interview-scores"],
    isAuth: true,
    method: "PATCH",
  });

  const updateScore = async (scoreData: Partial<AdhocInterviewScore>) => {
    try {
      console.log("Updating adhoc interview score:", scoreId);
      console.log("Update data:", scoreData);
      const result = await callApi(scoreData);
      console.log("Score update response:", result);
      return result;
    } catch (error) {
      console.error("Adhoc interview score update error:", error);
      throw error;
    }
  };

  return { updateScore, data, isLoading, isSuccess, error };
};

// Get AdHoc Interview Statistics/Summary
export const useGetAdhocInterviewSummary = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<{
    total_interviewers: number;
    completed_evaluations: number;
    pending_evaluations: number;
    average_scores: {
      relevant_experience: number;
      project_management: number;
      recent_experience: number;
      comparable_projects: number;
      communication_skills: number;
      technical_skill: number;
      relevant_qualification: number;
      academic_credentials: number;
      timeline_management: number;
      toolset_framework: number;
      total: number;
      percentage: number;
    };
    completion_percentage: number;
  }>>({
    queryKey: ["adhoc-interview-summary", interviewId],
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

// Get All AdHoc Interviews (for a specific adhoc management program)
export const useGetAllAdhocInterviews = (adhocId?: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<AdhocInterviewSchedule[]>>({
    queryKey: ["adhoc-interviews", adhocId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: adhocId ? { adhoc_management: adhocId } : undefined,
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

// Create AdHoc Interview
export const useCreateAdhocInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interviewData: Partial<AdhocInterviewSchedule>) => {
      try {
        console.log("Creating AdHoc interview with data:", interviewData);
        const response = await AxiosWithToken.post(BASE_URL, interviewData);
        console.log("AdHoc interview creation response:", response.data);
        return response.data;
      } catch (error) {
        console.error("AdHoc interview creation error:", error);
        const axiosError = error as AxiosError;
        throw new Error((axiosError.response?.data as any)?.message || "Failed to create interview");
      }
    },
    onSuccess: () => {
      // Invalidate pending interviews query to refetch
      queryClient.invalidateQueries({ queryKey: ["my-pending-adhoc-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["adhoc-interviews"] });
    },
  });
};

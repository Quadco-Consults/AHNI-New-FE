import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ConsultancyInterviewScore,
  ConsultancyInterviewSchedule
} from "../types/contract-management/consultancy-management/consultancy-application";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

const BASE_URL = "/contract-grants/consultancy/interviews/";

// Interview creation interface
interface CreateConsultancyInterviewData {
  applicant: string;
  interview_type: string;
  committee_members: string[];
  date: string;
  location?: string;
}

// ===== CONSULTANCY INTERVIEW CREATION & MANAGEMENT =====

// Create Individual or Committee Interview
export const useCreateConsultancyInterview = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<ConsultancyInterviewSchedule>,
    Error,
    CreateConsultancyInterviewData
  >({
    endpoint: BASE_URL,
    queryKey: ["consultancy-interviews"],
    isAuth: true,
    method: "POST",
  });

  const createInterview = async (details: CreateConsultancyInterviewData) => {
    try {
      console.log("Creating consultancy interview:", details);
      const result = await callApi(details);
      console.log("Interview creation response:", result);
      return result;
    } catch (error) {
      console.error("Consultancy interview creation error:", error);
      throw error;
    }
  };

  return { createInterview, data, isLoading, isSuccess, error };
};

// Bulk Create Interviews
export const useBulkCreateConsultancyInterviews = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<ConsultancyInterviewSchedule[]>,
    Error,
    {
      applicants: string[];
      interview_type: string;
      committee_members: string[];
      date: string;
      location?: string;
    }
  >({
    endpoint: `${BASE_URL}bulk-create/`,
    queryKey: ["consultancy-interviews"],
    isAuth: true,
    method: "POST",
  });

  const bulkCreateInterviews = async (details: {
    applicants: string[];
    interview_type: string;
    committee_members: string[];
    date: string;
    location?: string;
  }) => {
    try {
      console.log("Bulk creating consultancy interviews:", details);
      const result = await callApi(details);
      console.log("Bulk interview creation response:", result);
      return result;
    } catch (error) {
      console.error("Bulk consultancy interview creation error:", error);
      throw error;
    }
  };

  return { bulkCreateInterviews, data, isLoading, isSuccess, error };
};

// Get Single Consultancy Interview
export const useGetSingleConsultancyInterview = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ConsultancyInterviewSchedule>>({
    queryKey: ["consultancy-interview", interviewId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${interviewId}/`);
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

// ===== MULTI-SCORER CONSULTANCY INTERVIEW HOOKS =====

// Submit Individual Interview Score
export const useSubmitConsultancyInterviewScore = (interviewId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<ConsultancyInterviewScore>,
    Error,
    Partial<ConsultancyInterviewScore>
  >({
    endpoint: `${BASE_URL}${interviewId}/scores/`,
    queryKey: ["consultancy-interviews", "consultancy-interview-scores"],
    isAuth: true,
    method: "POST",
  });

  const submitScore = async (scoreData: Partial<ConsultancyInterviewScore>) => {
    try {
      console.log("Submitting consultancy interview score for interview:", interviewId);
      console.log("Score data:", scoreData);
      const result = await callApi(scoreData);
      console.log("Score submission response:", result);
      return result;
    } catch (error) {
      console.error("Consultancy interview score submission error:", error);
      throw error;
    }
  };

  return { submitScore, data, isLoading, isSuccess, error };
};

// Get All Scores for a Consultancy Interview
export const useGetConsultancyInterviewScores = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ConsultancyInterviewScore[]>>({
    queryKey: ["consultancy-interview-scores", interviewId],
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

// Get My Pending Consultancy Interviews (as interviewer)
export const useGetMyPendingConsultancyInterviews = (enabled: boolean = true) => {
  return useQuery<ApiResponse<ConsultancyInterviewSchedule[]>>({
    queryKey: ["my-pending-consultancy-interviews"],
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

// Get My Score for a Specific Consultancy Interview
export const useGetMyConsultancyInterviewScore = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ConsultancyInterviewScore>>({
    queryKey: ["my-consultancy-interview-score", interviewId],
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

// Update My Consultancy Interview Score
export const useUpdateConsultancyInterviewScore = (interviewId: string, scoreId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<ConsultancyInterviewScore>,
    Error,
    Partial<ConsultancyInterviewScore>
  >({
    endpoint: `${BASE_URL}${interviewId}/scores/${scoreId}/`,
    queryKey: ["consultancy-interviews", "consultancy-interview-scores"],
    isAuth: true,
    method: "PATCH",
  });

  const updateScore = async (scoreData: Partial<ConsultancyInterviewScore>) => {
    try {
      console.log("Updating consultancy interview score:", scoreId);
      console.log("Update data:", scoreData);
      const result = await callApi(scoreData);
      console.log("Score update response:", result);
      return result;
    } catch (error) {
      console.error("Consultancy interview score update error:", error);
      throw error;
    }
  };

  return { updateScore, data, isLoading, isSuccess, error };
};

// Get Consultancy Interview Statistics/Summary
export const useGetConsultancyInterviewSummary = (interviewId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<{
    total_interviewers: number;
    completed_evaluations: number;
    pending_evaluations: number;
    average_scores: {
      similar_work_experience: number;
      project_management_knowledge: number;
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
    queryKey: ["consultancy-interview-summary", interviewId],
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

// Get All Consultancy Interviews (for a specific consultancy)
export const useGetAllConsultancyInterviews = (consultancyId?: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ConsultancyInterviewSchedule[]>>({
    queryKey: ["consultancy-interviews", consultancyId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/contract-grants/consultancy/applicant-interviews/", {
          params: consultancyId ? { consultancy: consultancyId } : undefined,
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

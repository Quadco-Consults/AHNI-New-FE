import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { CbaApprovalSchema, CbaSchema } from "definitions/procurement-validator";
import {
  CbaData,
  CbaResponse,
  CbaResultsData,
  CbaSubmitPayload,
  CbaAnalysisSubmissionPayload,
  CbaDocument,
  CbaEvaluationPayload,
  CbaScoreCalculation,
} from "../types/cba";
import { TPaginatedResponse, TRequest, TResponse } from "definitions/index";

const BASE_URL = "procurements/cba/";

// ===== CBA HOOKS =====

// Get All CBAs
export const useGetAllCbas = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<CbaData>>({
    queryKey: ["cbas", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Single CBA
export const useGetSingleCba = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<CbaResultsData>>({
    queryKey: ["cba", id],
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

// Create CBA
export const useCreateCba = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    z.infer<typeof CbaSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["cbas"],
    isAuth: true,
    method: "POST",
  });

  const createCba = async (details: z.infer<typeof CbaSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA create error:", error);
    }
  };

  return { createCba, data, isLoading, isSuccess, error };
};

// Submit CBA
export const useSubmitCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    CbaSubmitPayload
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["cbas"],
    isAuth: true,
    method: "POST",
  });

  const submitCba = async (details: CbaSubmitPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA submit error:", error);
    }
  };

  return { submitCba, data, isLoading, isSuccess, error };
};

// Approve CBA
export const useApproveCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    z.infer<typeof CbaApprovalSchema>
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["cbas"],
    isAuth: true,
    method: "POST",
  });

  const approveCba = async (details: z.infer<typeof CbaApprovalSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA approve error:", error);
    }
  };

  return { approveCba, data, isLoading, isSuccess, error };
};

// Update CBA (Full Update)
export const useUpdateCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "PUT",
  });

  const updateCba = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA update error:", error);
    }
  };

  return { updateCba, data, isLoading, isSuccess, error };
};

// Modify CBA (Partial Update)
export const useModifyCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyCba = async (details: any) => {
    try {
      console.log("📤 PATCH CBA Request:", details);
      const result = await callApi(details);
      console.log("✅ PATCH CBA Response:", result);
      return result;
    } catch (error) {
      console.error("❌ CBA modify error:", error);
      throw error;
    }
  };

  return { modifyCba, data, isLoading, isSuccess, error };
};

// Delete CBA
export const useDeleteCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["cbas"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCba = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("CBA delete error:", error);
    }
  };

  return { deleteCba, data, isLoading, isSuccess, error };
};

// CBA Analysis Submission
export const useCbaAnalysisSubmission = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    CbaAnalysisSubmissionPayload
  >({
    endpoint: "procurements/cba-analysis-submission/",
    queryKey: ["cbas"],
    isAuth: true,
    method: "POST",
  });

  const submitCbaAnalysis = async (details: CbaAnalysisSubmissionPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA analysis submission error:", error);
    }
  };

  return { submitCbaAnalysis, data, isLoading, isSuccess, error };
};

// Generate CBA Report/Document
export const useGenerateCbaReport = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<CbaDocument>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/generate-report/`,
    queryKey: ["cbas", "cba-report"],
    isAuth: true,
    method: "GET",
  });

  const generateCbaReport = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("CBA report generation error:", error);
    }
  };

  return { generateCbaReport, data, isLoading, isSuccess, error };
};

// CBA Evaluation and Scoring
export const useCbaEvaluation = (cbaId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<CbaScoreCalculation[]>,
    Error,
    CbaEvaluationPayload
  >({
    endpoint: `${BASE_URL}${cbaId}/evaluate/`,
    queryKey: ["cbas", "cba-evaluation"],
    isAuth: true,
    method: "POST",
  });

  const evaluateCba = async (details: CbaEvaluationPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA evaluation error:", error);
    }
  };

  return { evaluateCba, data, isLoading, isSuccess, error };
};

// Calculate CBA Scores
export const useCalculateCbaScores = (cbaId: string) => {
  return useQuery<TResponse<CbaScoreCalculation[]>>({
    queryKey: ["cba-scores", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${cbaId}/scores/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// Get Price Responsiveness Ranking
export const usePriceResponsivenessRanking = (cbaId: string) => {
  return useQuery<TResponse<{
    first_most_responsive: string;
    second_most_responsive: string;
    third_most_responsive: string;
    no_bid?: string;
  }>>({
    queryKey: ["price-responsiveness", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${cbaId}/price-ranking/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// Get CBA Analysis Results
export const useGetCbaAnalysisResults = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<any>>({
    queryKey: ["cba-analysis-results", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/procurements/cba-analysis-submission/?cba_id=${cbaId}`);
        console.log("📊 CBA Analysis Results API Response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ CBA Analysis Results API Error:", axiosError);

        // If it's a 404, 405, or no results, return null instead of throwing
        if (axiosError.response?.status === 404 ||
            axiosError.response?.status === 405 ||
            (axiosError.response?.data as any)?.message?.includes("not found")) {
          console.log("🔄 CBA Analysis endpoint not ready, returning empty result");
          return { data: null };
        }

        throw new Error("Sorry: " + ((axiosError.response?.data as any)?.message || "Failed to fetch analysis results"));
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry if analysis doesn't exist yet
  });
};

// ===== 3-LEVEL SIGNATURE WORKFLOW HOOKS =====

// Submit CBA for Review
export const useSubmitCbaForReview = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/submit_for_review/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "POST",
  });

  const submitForReview = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("CBA submit for review error:", error);
      throw error;
    }
  };

  return { submitForReview, data, isLoading, isSuccess, error };
};

// Review CBA
export const useReviewCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    { signature: string; comments?: string }
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "POST",
  });

  const reviewCba = async (details: { signature: string; comments?: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA review error:", error);
      throw error;
    }
  };

  return { reviewCba, data, isLoading, isSuccess, error };
};

// Authorise CBA
export const useAuthoriseCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    { signature: string; comments?: string }
  >({
    endpoint: `${BASE_URL}${id}/authorise/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "POST",
  });

  const authoriseCba = async (details: { signature: string; comments?: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA authorise error:", error);
      throw error;
    }
  };

  return { authoriseCba, data, isLoading, isSuccess, error };
};

// Get Signature Status
export const useGetSignatureStatus = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<{
    reviewers: {
      total: number;
      signed: number;
      pending: number;
      users: Array<{ id: string; name: string; has_signed: boolean }>;
    };
    authorisers: {
      total: number;
      signed: number;
      pending: number;
      users: Array<{ id: string; name: string; has_signed: boolean }>;
    };
    approvers: {
      total: number;
      signed: number;
      pending: number;
      users: Array<{ id: string; name: string; has_signed: boolean }>;
    };
    current_stage: "review" | "authorise" | "approve" | "completed";
    can_proceed: boolean;
  }>>({
    queryKey: ["cba-signature-status", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${cbaId}/signature_status/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// Get Workflow Status
export const useGetWorkflowStatus = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<{
    current_step: number;
    total_steps: number;
    step_name: string;
    can_user_act: boolean;
    action_type: "review" | "authorise" | "approve" | null;
    is_completed: boolean;
  }>>({
    queryKey: ["cba-workflow-status", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${cbaId}/workflow_status/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// Reject at Review Stage
export const useReviewRejectCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/review-reject/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "POST",
  });

  const reviewRejectCba = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA review reject error:", error);
      throw error;
    }
  };

  return { reviewRejectCba, data, isLoading, isSuccess, error };
};

// Reject at Authorisation Stage
export const useAuthoriseRejectCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/authorise-reject/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "POST",
  });

  const authoriseRejectCba = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA authorise reject error:", error);
      throw error;
    }
  };

  return { authoriseRejectCba, data, isLoading, isSuccess, error };
};

// Reject at Approval Stage
export const useApproveRejectCba = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CbaResponse,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/approve-reject/`,
    queryKey: ["cbas", "cba"],
    isAuth: true,
    method: "POST",
  });

  const approveRejectCba = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA approve reject error:", error);
      throw error;
    }
  };

  return { approveRejectCba, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetCbaListQuery = useGetAllCbas;
export const useGetCbaQuery = useGetSingleCba;
export const useCreateCbaMutation = useCreateCba;
export const useCreateSubmitCbaMutation = useSubmitCba;
export const useCreateApprovalCbaMutation = useApproveCba;
export const useUpdateCbaMutation = useUpdateCba;
export const useModifyCbaMutation = useModifyCba;
export const useDeleteCbaMutation = useDeleteCba;

// Default export for backward compatibility
const CbaAPI = {
  useGetAllCbas,
  useGetSingleCba,
  useCreateCba,
  useSubmitCba,
  useApproveCba,
  useUpdateCba,
  useModifyCba,
  useDeleteCba,
  useCbaAnalysisSubmission,
  useGenerateCbaReport,
  useCbaEvaluation,
  useCalculateCbaScores,
  usePriceResponsivenessRanking,
  useGetCbaAnalysisResults,
  // Signature workflow hooks
  useSubmitCbaForReview,
  useReviewCba,
  useAuthoriseCba,
  useGetSignatureStatus,
  useGetWorkflowStatus,
  // Rejection hooks
  useReviewRejectCba,
  useAuthoriseRejectCba,
  useApproveRejectCba,
  // Legacy exports
  useGetCbaListQuery,
  useGetCbaQuery,
  useCreateCbaMutation,
  useCreateSubmitCbaMutation,
  useCreateApprovalCbaMutation,
  useUpdateCbaMutation,
  useModifyCbaMutation,
  useDeleteCbaMutation,
};

export default CbaAPI;
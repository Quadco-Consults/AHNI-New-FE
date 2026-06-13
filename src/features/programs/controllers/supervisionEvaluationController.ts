import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ISupervisionEvaluation,
  IEvaluationResponse,
  ICreateSupervisionEvaluationRequest,
  IUpdateEvaluationResponseRequest,
  ICompleteEvaluationRequest,
  IEvaluationTemplate,
  IEvaluationDashboardData,
  ISupervisionEvaluationListParams,
  SupervisionEvaluationStatus,
} from "../types/supervision-evaluation";
import { TPaginatedResponse, TResponse } from "definitions/index";

// Base URLs for API endpoints
// Separate endpoints: create evaluation vs submit reviews
const SUPERVISION_EVALUATION_BASE_URL = "programs/supervision-evaluations/";  // For listing and managing evaluation records
const SUPERVISION_EVALUATION_CREATE_URL = "programs/supervision-evaluations/";  // For creating evaluation records
const SUPERVISION_EVALUATION_REVIEW_URL = "programs/plans/supportive-supervision/"; // For submitting reviews
const EVALUATION_RESPONSE_BASE_URL = "programs/evaluation-responses/";
// Note: evaluation-templates endpoint may not exist - keeping for compatibility but will handle gracefully
const EVALUATION_TEMPLATE_BASE_URL = "programs/evaluation-templates/";

// ===== SUPERVISION EVALUATION ENDPOINTS =====

// Get All Supervision Evaluations
export const useGetAllSupervisionEvaluations = (params: ISupervisionEvaluationListParams = {}) => {
  const {
    page = 1,
    page_size = 20,
    search = "",
    status = "",
    location_id = "",
    facility_id = "",
    evaluator_id = "",
    evaluation_date_from = "",
    evaluation_date_to = "",
    category_id = "",
    overall_score_min,
    overall_score_max,
  } = params;

  return useQuery<TPaginatedResponse<ISupervisionEvaluation>>({
    queryKey: [
      "supervision-evaluations",
      page,
      page_size,
      search,
      status,
      location_id,
      facility_id,
      evaluator_id,
      evaluation_date_from,
      evaluation_date_to,
      category_id,
      overall_score_min,
      overall_score_max,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(SUPERVISION_EVALUATION_BASE_URL, {
          params: {
            page,
            page_size,
            search,
            status,
            location_id,
            facility_id,
            evaluator_id,
            evaluation_date_from,
            evaluation_date_to,
            category_id,
            overall_score_min,
            overall_score_max,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Single Supervision Evaluation
// Note: Backend blacklists "retrieve" action, so response is not wrapped in TResponse
export const useGetSingleSupervisionEvaluation = (id: string, enabled: boolean = true) => {
  return useQuery<ISupervisionEvaluation>({
    queryKey: ["supervision-evaluation", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SUPERVISION_EVALUATION_BASE_URL}${id}/`);
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

// Get Evaluations by Site Visit
export const useGetEvaluationsBySiteVisit = (siteVisitId: string, enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<ISupervisionEvaluation>>({
    queryKey: ["evaluations-by-site-visit", siteVisitId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${SUPERVISION_EVALUATION_BASE_URL}by-site-visit/${siteVisitId}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!siteVisitId,
    refetchOnWindowFocus: false,
  });
};

// Get My Evaluations (as evaluator)
export const useGetMyEvaluations = (params: {
  page?: number;
  page_size?: number;
  status?: SupervisionEvaluationStatus | string;
} = {}) => {
  const { page = 1, page_size = 20, status = "" } = params;

  return useQuery<TPaginatedResponse<ISupervisionEvaluation>>({
    queryKey: ["my-evaluations", page, page_size, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SUPERVISION_EVALUATION_BASE_URL}my-evaluations/`, {
          params: { page, page_size, status },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Create Supervision Evaluation
export const useCreateSupervisionEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateSupervisionEvaluationRequest): Promise<TResponse<ISupervisionEvaluation>> => {
      try {
        // Step 1: Create the evaluation record first
        const evaluationPayload = {
          site_visit: data.site_visit_id, // Backend expects 'site_visit', not 'site_visit_id'
          planned_visit_id: data.planned_visit_id || null,
          title: data.title,
          description: data.description,
          purpose: data.description || data.title || "Supervision evaluation", // Backend requires purpose field
          evaluation_date: data.evaluation_date,
          selected_categories: data.selected_categories,
          selected_criteria: data.selected_criteria
        };

        console.log("🔄 Step 1: Creating evaluation record with payload:", evaluationPayload);
        console.log("🔍 Payload inspection:", {
          hasSelectedCategories: !!evaluationPayload.selected_categories,
          categoriesCount: evaluationPayload.selected_categories?.length || 0,
          categoriesArray: evaluationPayload.selected_categories,
          hasSelectedCriteria: !!evaluationPayload.selected_criteria,
          criteriaCount: evaluationPayload.selected_criteria?.length || 0,
          criteriaArray: evaluationPayload.selected_criteria
        });

        const response = await AxiosWithToken.post(SUPERVISION_EVALUATION_CREATE_URL, evaluationPayload);

        console.log("✅ Step 1 Complete: Evaluation record created:", response.data);
        console.log("🔍 Response categories/criteria check:", {
          responseHasCategories: !!response.data?.data?.categories,
          responseCategoriesLength: response.data?.data?.categories?.length || 0,
          responseHasCriteria: !!response.data?.data?.criteria,
          responseCriteriaLength: response.data?.data?.criteria?.length || 0,
          responseCategories: response.data?.data?.categories,
          responseCriteria: response.data?.data?.criteria
        });

        // TODO: Step 2 would be to submit reviews using the review endpoint if needed
        // For now, just return the created evaluation

        return response.data;
      } catch (error: any) {
        console.error("Supervision evaluation creation error:", error);
        console.error("❌ Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url
        });

        // Note: 404 error handling removed since endpoint is now implemented

        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create supervision evaluation"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["my-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation-dashboard"] });
    },
  });
};

// Update Supervision Evaluation
export const useUpdateSupervisionEvaluation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ISupervisionEvaluation>) => {
      try {
        const response = await AxiosWithToken.put(`${SUPERVISION_EVALUATION_BASE_URL}${id}/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Supervision evaluation update error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update supervision evaluation"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation-dashboard"] });
    },
  });
};

// Complete Supervision Evaluation
export const useCompleteSupervisionEvaluation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICompleteEvaluationRequest) => {
      try {
        const response = await AxiosWithToken.post(
          `${SUPERVISION_EVALUATION_BASE_URL}${id}/complete/`,
          data
        );
        return response.data;
      } catch (error: any) {
        console.error("Supervision evaluation completion error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to complete supervision evaluation"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["planned-visits"] });
    },
  });
};

// Delete Supervision Evaluation
export const useDeleteSupervisionEvaluation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.delete(`${SUPERVISION_EVALUATION_BASE_URL}${id}/`);
        return response.data;
      } catch (error: any) {
        console.error("Supervision evaluation delete error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete supervision evaluation"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["my-evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation-dashboard"] });
    },
  });
};

// ===== EVALUATION RESPONSE ENDPOINTS =====

// Get Evaluation Responses
export const useGetEvaluationResponses = (evaluationId: string, enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<IEvaluationResponse>>({
    queryKey: ["evaluation-responses", evaluationId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(EVALUATION_RESPONSE_BASE_URL, {
          params: { evaluation_id: evaluationId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!evaluationId,
    refetchOnWindowFocus: false,
  });
};

// Update Evaluation Response
export const useUpdateEvaluationResponse = (evaluationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IUpdateEvaluationResponseRequest) => {
      try {
        const formData = new FormData();

        // Ensure evaluation_id is included
        formData.append('evaluation_id', evaluationId);

        // Append basic fields
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'evidence_files' && value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Append files if any
        if (data.evidence_files && data.evidence_files.length > 0) {
          data.evidence_files.forEach((file, index) => {
            formData.append(`evidence_files`, file);
          });
        }

        console.log("🚀 API Request Details:", {
          endpoint: `${EVALUATION_RESPONSE_BASE_URL}update-response/`,
          evaluationId,
          formDataEntries: Array.from(formData.entries())
        });

        const response = await AxiosWithToken.post(
          `${EVALUATION_RESPONSE_BASE_URL}update-response/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Evaluation response update error:", error);
        console.error("🔍 Detailed error info:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update evaluation response"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-responses", evaluationId] });
      queryClient.invalidateQueries({ queryKey: ["supervision-evaluation", evaluationId] });
    },
  });
};

// ===== EVALUATION TEMPLATE ENDPOINTS =====

// Get Evaluation Templates
export const useGetEvaluationTemplates = () => {
  return useQuery<TPaginatedResponse<IEvaluationTemplate>>({
    queryKey: ["evaluation-templates"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(EVALUATION_TEMPLATE_BASE_URL);
        console.log("📊 Templates API Response:", response.data);

        // Handle different possible response structures
        if (response.data?.data?.results) {
          return response.data.data;
        } else if (response.data?.results) {
          return response.data;
        } else {
          return { results: [], pagination: { total: 0, page: 1, pages: 1, per_page: 20 } };
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.warn("Templates endpoint not available:", axiosError.response?.status);

        // Return empty results if templates endpoint doesn't exist (404)
        if (axiosError.response?.status === 404) {
          return { results: [], pagination: { total: 0, page: 1, pages: 1, per_page: 20 } };
        }

        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Single Evaluation Template
export const useGetSingleEvaluationTemplate = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IEvaluationTemplate>>({
    queryKey: ["evaluation-template", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${EVALUATION_TEMPLATE_BASE_URL}${id}/`);
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

// ===== DASHBOARD AND ANALYTICS ENDPOINTS =====

// Get Evaluation Dashboard Data
export const useGetEvaluationDashboard = (params: {
  location_id?: string;
  facility_id?: string;
  date_from?: string;
  date_to?: string;
} = {}) => {
  return useQuery<TResponse<IEvaluationDashboardData>>({
    queryKey: ["evaluation-dashboard", params],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SUPERVISION_EVALUATION_BASE_URL}dashboard/`, {
          params,
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Generate Evaluation Report
export const useGenerateEvaluationReport = () => {
  return useMutation({
    mutationFn: async (data: {
      evaluation_ids?: string[];
      location_id?: string;
      facility_id?: string;
      date_from?: string;
      date_to?: string;
      format: 'PDF' | 'EXCEL';
    }) => {
      try {
        const response = await AxiosWithToken.post(
          `${SUPERVISION_EVALUATION_BASE_URL}generate-report/`,
          data,
          {
            responseType: 'blob',
          }
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const fileExtension = data.format === 'PDF' ? 'pdf' : 'xlsx';
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `supervision-evaluation-report-${timestamp}.${fileExtension}`);

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (error: any) {
        console.error("Report generation error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to generate evaluation report"
        );
      }
    },
  });
};

// Alias for backward compatibility
export const useGetSupervisionEvaluationById = useGetSingleSupervisionEvaluation;
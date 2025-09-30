import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IPreAwardAssessment,
  IAssessmentSummary,
  TAssessmentFormData,
  TAssessmentCreateUpdateFormData,
  IAssessmentWorkflow,
  TTechnicalCapacityFormData,
  TFinancialPATFormData,
} from "../types/contract-management/sub-grant/assessment";
import { PreAwardQuestionData } from "@/features/modules/types/cg";

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
interface AssessmentFilterParams {
  page?: number;
  size?: number;
  search?: string;
  submission?: string;
  status?: string;
  assessor?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/sub-grants/assessments/";

// ===== ASSESSMENT CRITERIA HOOKS =====

// Get Assessment Criteria (using existing pre-award questions)
export const useGetAssessmentCriteria = (enabled: boolean = true) => {
  return useQuery<{status: boolean; data: PreAwardQuestionData[]}>({
    queryKey: ["assessmentCriteria"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/contracts-grants/pre-award-questions/");
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

// ===== ASSESSMENT HOOKS =====

// Get All Assessments (Paginated)
export const useGetAllAssessments = ({
  page = 1,
  size = 20,
  search = "",
  submission = "",
  status = "",
  assessor = "",
  enabled = true,
}: AssessmentFilterParams) => {
  return useQuery<PaginatedResponse<IAssessmentSummary>>({
    queryKey: ["assessments", page, size, search, submission, status, assessor],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(submission && { submission }),
            ...(status && { status }),
            ...(assessor && { assessor }),
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

// Get Single Assessment
export const useGetSingleAssessment = (assessmentId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IPreAwardAssessment>>({
    queryKey: ["assessment", assessmentId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${assessmentId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!assessmentId,
    refetchOnWindowFocus: false,
  });
};

// Get Assessment by Submission
export const useGetAssessmentBySubmission = (submissionId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IPreAwardAssessment>>({
    queryKey: ["assessmentBySubmission", submissionId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}by-submission/${submissionId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!submissionId,
    refetchOnWindowFocus: false,
  });
};

// Create Assessment
export const useCreateAssessment = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPreAwardAssessment,
    Error,
    TAssessmentCreateUpdateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["assessments"],
    isAuth: true,
    method: "POST",
  });

  const createAssessment = async (details: TAssessmentCreateUpdateFormData) => {
    try {
      return await callApi(details);
    } catch (error) {
      console.error("Assessment create error:", error);
      throw error;
    }
  };

  return { createAssessment, data, isLoading, isSuccess, error };
};

// Update Assessment
export const useUpdateAssessment = (assessmentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPreAwardAssessment,
    Error,
    TAssessmentFormData
  >({
    endpoint: `${BASE_URL}${assessmentId}/`,
    queryKey: ["assessments", "assessment"],
    isAuth: true,
    method: "PUT",
  });

  const updateAssessment = async (details: TAssessmentFormData) => {
    try {
      return await callApi(details);
    } catch (error) {
      console.error("Assessment update error:", error);
      throw error;
    }
  };

  return { updateAssessment, data, isLoading, isSuccess, error };
};

// Submit Assessment
export const useSubmitAssessment = (assessmentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPreAwardAssessment,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${assessmentId}/submit/`,
    queryKey: ["assessments"],
    isAuth: true,
    method: "POST",
  });

  const submitAssessment = async () => {
    try {
      return await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Assessment submit error:", error);
      throw error;
    }
  };

  return { submitAssessment, data, isLoading, isSuccess, error };
};

// Delete Assessment
export const useDeleteAssessment = (assessmentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPreAwardAssessment,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${assessmentId}/`,
    queryKey: ["assessments"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssessment = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Assessment delete error:", error);
    }
  };

  return { deleteAssessment, data, isLoading, isSuccess, error };
};

// ===== WORKFLOW MANAGEMENT HOOKS =====

// Get Assessment Workflow
export const useGetAssessmentWorkflow = (assessmentId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IAssessmentWorkflow>>({
    queryKey: ["assessmentWorkflow", assessmentId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${assessmentId}/workflow/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!assessmentId,
    refetchOnWindowFocus: false,
  });
};

// Update Workflow Step
export const useUpdateWorkflowStep = (assessmentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAssessmentWorkflow,
    Error,
    { step: number; status: string; comments?: string }
  >({
    endpoint: `${BASE_URL}${assessmentId}/workflow/update-step/`,
    queryKey: ["assessmentWorkflow"],
    isAuth: true,
    method: "POST",
  });

  const updateWorkflowStep = async (stepData: { step: number; status: string; comments?: string }) => {
    try {
      return await callApi(stepData);
    } catch (error) {
      console.error("Workflow step update error:", error);
      throw error;
    }
  };

  return { updateWorkflowStep, data, isLoading, isSuccess, error };
};

// ===== TECHNICAL CAPACITY ASSESSMENT HOOKS =====

// Create/Update Technical Capacity Assessment
export const useCreateUpdateTechnicalCapacity = (submissionId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPreAwardAssessment,
    Error,
    TTechnicalCapacityFormData
  >({
    endpoint: `/contract-grants/sub-grants/submissions/${submissionId}/technical-capacity-assessment/`,
    queryKey: ["technicalCapacityAssessment"],
    isAuth: true,
    method: "POST",
  });

  const saveTechnicalCapacity = async (details: TTechnicalCapacityFormData) => {
    try {
      return await callApi(details);
    } catch (error) {
      console.error("Technical capacity assessment error:", error);
      throw error;
    }
  };

  return { saveTechnicalCapacity, data, isLoading, isSuccess, error };
};

// ===== FINANCIAL PAT ASSESSMENT HOOKS =====

// Create/Update Financial PAT Assessment
export const useCreateUpdateFinancialPAT = (submissionId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPreAwardAssessment,
    Error,
    TFinancialPATFormData
  >({
    endpoint: `/contract-grants/sub-grants/submissions/${submissionId}/financial-pat-assessment/`,
    queryKey: ["financialPATAssessment"],
    isAuth: true,
    method: "POST",
  });

  const saveFinancialPAT = async (details: TFinancialPATFormData) => {
    try {
      return await callApi(details);
    } catch (error) {
      console.error("Financial PAT assessment error:", error);
      throw error;
    }
  };

  return { saveFinancialPAT, data, isLoading, isSuccess, error };
};

// Calculate PAT Risk Rating
export const useCalculatePATRating = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { overall_rating: any },
    Error,
    { pat_sections: any[] }
  >({
    endpoint: `/contract-grants/sub-grants/assessments/calculate-pat-rating/`,
    queryKey: ["patRatingCalculation"],
    isAuth: true,
    method: "POST",
  });

  const calculateRating = async (patSections: any[]) => {
    try {
      return await callApi({ pat_sections: patSections });
    } catch (error) {
      console.error("PAT rating calculation error:", error);
      throw error;
    }
  };

  return { calculateRating, data, isLoading, isSuccess, error };
};

// ===== ASSESSMENT TEMPLATES AND CONFIGURATIONS =====

// Get Assessment Template
export const useGetAssessmentTemplate = (assessmentType: "TECHNICAL_CAPACITY" | "FINANCIAL_PAT", enabled: boolean = true) => {
  return useQuery<ApiResponse<any>>({
    queryKey: ["assessmentTemplate", assessmentType],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}templates/${assessmentType.toLowerCase()}/`);
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

// Export Assessment to PDF
export const useExportAssessmentToPDF = (assessmentId: string) => {
  const exportToPDF = async () => {
    try {
      const response = await AxiosWithToken.get(`${BASE_URL}${assessmentId}/export-pdf/`, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pre-award-assessment-${assessmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return blob;
    } catch (error) {
      console.error("Assessment export error:", error);
      throw error;
    }
  };

  return { exportToPDF };
};
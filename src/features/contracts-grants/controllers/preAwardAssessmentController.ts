import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

const BASE_URL = "/contract-grants/award/assessments/";

// ===== TYPES =====

interface AssessmentData {
  rating_scale: {
    na: number;
    low: number;
    med: number;
    high: number;
  };
  forms: Array<{
    category_name: string;
    category_description?: string;
    questions: Array<{
      question: string;
      answer: {
        text: string;
        rating_type: string;
        boolean: boolean;
      };
      requires_explanation?: boolean;
    }>;
  }>;
}

interface Assessment {
  id: string;
  submission: string | any;
  assessment_data: AssessmentData;
  total_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "EXTREMELY_HIGH";
  status: "DRAFT" | "COMPLETED";
  assessed_by?: any;
  assessed_date?: string;
  created_datetime: string;
  updated_datetime: string;
}

interface AssessedSubmission {
  rank: number;
  submission: any;
  assessment: Assessment;
  score: number;
  risk_level: string;
}

interface CreateAssessmentPayload {
  assessment_submission: string;
  partner: string;
  assessment_data: AssessmentData;
}

interface AssessmentFilterParams {
  page?: number;
  size?: number;
  search?: string;
  submission?: string;
  enabled?: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
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

// ===== GET ALL ASSESSMENTS =====

export const useGetAllAssessments = ({
  page = 1,
  size = 20,
  search = "",
  submission = "",
  enabled = true,
}: AssessmentFilterParams) => {
  return useQuery<PaginatedResponse<Assessment>>({
    queryKey: ["preAwardAssessments", page, size, search, submission],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(submission && { submission }),
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

// ===== GET SINGLE ASSESSMENT =====

export const useGetSingleAssessment = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Assessment>>({
    queryKey: ["preAwardAssessment", id],
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

// ===== START ASSESSMENT (Recommended) =====

export const useStartAssessment = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Assessment,
    Error,
    { submission: string; partner?: string }
  >({
    endpoint: `${BASE_URL}start/`,
    queryKey: ["preAwardAssessments"],
    isAuth: true,
    method: "POST",
  });

  const startAssessment = async (submissionId: string, partnerId?: string) => {
    try {
      return await callApi({
        submission: submissionId,
        ...(partnerId && { partner: partnerId })
      });
    } catch (error) {
      console.error("Start assessment error:", error);
      throw error;
    }
  };

  return { startAssessment, data, isLoading, isSuccess, error };
};

// ===== CREATE ASSESSMENT =====

export const useCreateAssessment = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Assessment,
    Error,
    CreateAssessmentPayload
  >({
    endpoint: BASE_URL,
    queryKey: ["preAwardAssessments"],
    isAuth: true,
    method: "POST",
  });

  const createAssessment = async (payload: CreateAssessmentPayload) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Create assessment error:", error);
      throw error;
    }
  };

  return { createAssessment, data, isLoading, isSuccess, error };
};

// ===== UPDATE ASSESSMENT =====

export const useUpdateAssessment = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Assessment,
    Error,
    Partial<CreateAssessmentPayload>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["preAwardAssessments", "preAwardAssessment", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateAssessment = async (payload: Partial<CreateAssessmentPayload>) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Update assessment error:", error);
      throw error;
    }
  };

  return { updateAssessment, data, isLoading, isSuccess, error };
};

// ===== DELETE ASSESSMENT =====

export const useDeleteAssessment = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["preAwardAssessments"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssessment = async () => {
    try {
      return await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Delete assessment error:", error);
      throw error;
    }
  };

  return { deleteAssessment, data, isLoading, isSuccess, error };
};

// ===== GET ASSESSED SUBMISSIONS (RANKED) =====

export const useGetAssessedSubmissions = (
  subGrantId: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<AssessedSubmission[]>>({
    queryKey: ["assessedSubmissions", subGrantId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}assessed-submissions/`,
          {
            params: { sub_grant: subGrantId },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

// Legacy exports for backward compatibility
export const useGetAssessmentsListQuery = useGetAllAssessments;
export const useGetAssessmentQuery = useGetSingleAssessment;
export const useCreateAssessmentMutation = useCreateAssessment;

// Default export
const PreAwardAssessmentAPI = {
  useGetAllAssessments,
  useGetSingleAssessment,
  useStartAssessment,
  useCreateAssessment,
  useUpdateAssessment,
  useDeleteAssessment,
  useGetAssessedSubmissions,
  useGetAssessmentsListQuery,
  useGetAssessmentQuery,
  useCreateAssessmentMutation,
};

export default PreAwardAssessmentAPI;

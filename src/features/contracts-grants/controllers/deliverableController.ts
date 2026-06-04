import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IDeliverable,
  IDeliverableDetailed,
  IDeliverablesListResponse,
  IDeliverableOverviewResponse,
  IDeliverableSubmissionDetailed,
  ISubmissionsListResponse,
  IConsultantsListResponse,
  TDeliverableFormData,
  TDeliverableReviewFormData,
} from "../types/contract-management/deliverable";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface DeliverableFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  consultant?: string;
  enabled?: boolean;
}

interface SubmissionFilterParams {
  page?: number;
  size?: number;
  review_status?: string;
  enabled?: boolean;
}

const BASE_URL = "contract-grants/deliverables/";

// ===== SUPERVISOR DELIVERABLE HOOKS =====

// Get All Deliverables (Paginated)
export const useGetAllDeliverables = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  consultant = "",
  enabled = true,
}: DeliverableFilterParams) => {
  return useQuery<IDeliverablesListResponse>({
    queryKey: ["deliverables", page, size, search, status, consultant],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(consultant && { consultant }),
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

// Get Single Deliverable
export const useGetSingleDeliverable = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IDeliverableDetailed>>({
    queryKey: ["deliverable", id],
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

// Get Deliverables Overview
export const useGetDeliverablesOverview = (enabled: boolean = true) => {
  return useQuery<IDeliverableOverviewResponse>({
    queryKey: ["deliverables", "overview"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}overview/`);
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

// Get All Submissions
export const useGetAllSubmissions = ({
  page = 1,
  size = 20,
  review_status = "",
  enabled = true,
}: SubmissionFilterParams) => {
  return useQuery<ISubmissionsListResponse>({
    queryKey: ["deliverable-submissions", page, size, review_status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}submissions/`, {
          params: {
            page,
            size,
            ...(review_status && { review_status }),
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

// Get My Consultants
export const useGetMyConsultants = (enabled: boolean = true) => {
  return useQuery<IConsultantsListResponse>({
    queryKey: ["my-consultants"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my_consultants/`);
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

// Create Deliverable
export const useCreateDeliverable = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeliverable,
    Error,
    TDeliverableFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["deliverables"],
    isAuth: true,
    method: "POST",
  });

  const createDeliverable = async (details: TDeliverableFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Deliverable create error:", error);
    }
  };

  return { createDeliverable, data, isLoading, isSuccess, error };
};

// Update Deliverable
export const useUpdateDeliverable = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeliverable,
    Error,
    Partial<TDeliverableFormData>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["deliverables", "deliverable"],
    isAuth: true,
    method: "PATCH",
  });

  const updateDeliverable = async (details: Partial<TDeliverableFormData>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Deliverable update error:", error);
    }
  };

  return { updateDeliverable, data, isLoading, isSuccess, error };
};

// Delete Deliverable
export const useDeleteDeliverable = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeliverable,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["deliverables"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDeliverable = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Deliverable delete error:", error);
    }
  };

  return { deleteDeliverable, data, isLoading, isSuccess, error };
};

// Review Submission
export const useReviewSubmission = (submissionId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<IDeliverableSubmissionDetailed>,
    Error,
    TDeliverableReviewFormData
  >({
    endpoint: `${BASE_URL}submissions/${submissionId}/review/`,
    queryKey: ["deliverable-submissions", "deliverables"],
    isAuth: true,
    method: "POST",
  });

  const reviewSubmission = async (details: TDeliverableReviewFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Submission review error:", error);
      throw error;
    }
  };

  return { reviewSubmission, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllDeliverablesQuery = useGetAllDeliverables;
export const useGetSingleDeliverableQuery = useGetSingleDeliverable;
export const useCreateDeliverableMutation = useCreateDeliverable;
export const useUpdateDeliverableMutation = useUpdateDeliverable;
export const useDeleteDeliverableMutation = useDeleteDeliverable;

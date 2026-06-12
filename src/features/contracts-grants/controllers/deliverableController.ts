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

// Get Consultant Locations
export const useGetConsultantLocations = (enabled: boolean = true) => {
  return useQuery<ApiResponse<Array<{id: string; name: string; has_clusters: boolean}>>>({
    queryKey: ["consultant-locations"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}locations/`);
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

// Get Clusters for a Location
export const useGetClustersForLocation = (locationId?: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Array<{id: string; name: string; code: string}>>>({
    queryKey: ["consultant-clusters", locationId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}clusters/`, {
          params: { location: locationId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!locationId,
    refetchOnWindowFocus: false,
  });
};

// Get My Consultants
export const useGetMyConsultants = (locationId?: string, clusterId?: string, enabled: boolean = true) => {
  return useQuery<IConsultantsListResponse>({
    queryKey: ["my-consultants", locationId, clusterId],
    queryFn: async () => {
      try {
        // Don't send empty location/cluster params - fetch all consultants instead
        const params: any = {};
        // Only add params if they have actual values (not empty strings)
        if (clusterId && clusterId.trim()) {
          params.cluster = clusterId;
        } else if (locationId && locationId.trim()) {
          params.location = locationId;
        }
        // If no params, fetch all consultants

        const response = await AxiosWithToken.get(`${BASE_URL}my_consultants/`, { params });
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

// Get My Facilitators
export const useGetMyFacilitators = (locationId?: string, clusterId?: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Array<{
    id: string;
    title: string;
    grade_level: string;
    status: string;
    commencement_date: string | null;
    end_date: string | null;
    locations: Array<{id: string; name: string}>;
    cluster: {id: string; name: string; code: string} | null;
  }>>>({
    queryKey: ["my-facilitators", locationId, clusterId],
    queryFn: async () => {
      try {
        const params: any = {};
        if (clusterId) {
          params.cluster = clusterId;
        } else if (locationId) {
          params.location = locationId;
        }

        const response = await AxiosWithToken.get(`${BASE_URL}my_facilitators/`, { params });
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

// Get My Adhoc Staff
export const useGetMyAdhocStaff = (locationId?: string, clusterId?: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Array<{
    id: number;
    name: string;
    email: string;
    designation: string;
    assignment_location: string;
    start_date: string | null;
    end_date: string | null;
    cluster: {id: string; name: string; code: string} | null;
    location: {id: string; name: string} | null;
  }>>>({
    queryKey: ["my-adhoc-staff", locationId, clusterId],
    queryFn: async () => {
      try {
        const params: any = {};
        if (clusterId) {
          params.cluster = clusterId;
        } else if (locationId) {
          params.location = locationId;
        }

        const response = await AxiosWithToken.get(`${BASE_URL}my_adhoc_staff/`, { params });
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

// ===== CONSULTANT/STAFF DELIVERABLE HOOKS =====

// Get My Deliverables (assigned to me)
export const useGetMyDeliverables = (enabled: boolean = true) => {
  return useQuery<IDeliverablesListResponse>({
    queryKey: ["my-deliverables"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my_deliverables/`);
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

// Submit Deliverable
export const useSubmitDeliverable = (deliverableId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<IDeliverableSubmissionDetailed>,
    Error,
    FormData
  >({
    endpoint: `${BASE_URL}${deliverableId}/submit/`,
    queryKey: ["my-deliverables", "deliverable-submissions"],
    isAuth: true,
    method: "POST",
  });

  const submitDeliverable = async (formData: FormData) => {
    try {
      await callApi(formData);
    } catch (error) {
      console.error("Deliverable submission error:", error);
      throw error;
    }
  };

  return { submitDeliverable, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllDeliverablesQuery = useGetAllDeliverables;
export const useGetSingleDeliverableQuery = useGetSingleDeliverable;
export const useCreateDeliverableMutation = useCreateDeliverable;
export const useUpdateDeliverableMutation = useUpdateDeliverable;
export const useDeleteDeliverableMutation = useDeleteDeliverable;

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IContractRequestPaginatedData,
  IContractRequestSingleData,
  TContractRequestFormData,
} from "../types/contract-management/contract-request";

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
interface ContractRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/contract-requests/"; // From original service
const INTERVIEW_BASE_URL = "/contract-grants/consultancy/applicant-interviews/bulk-create/";

// ===== CONTRACT REQUEST HOOKS =====

// Get All Contract Requests (Paginated)
export const useGetAllContractRequests = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: ContractRequestFilterParams) => {
  return useQuery<PaginatedResponse<IContractRequestPaginatedData>>({
    queryKey: ["contractRequests", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
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

// Get Single Contract Request
export const useGetSingleContractRequest = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IContractRequestSingleData>>({
    queryKey: ["contractRequest", id],
    queryFn: async () => {
      try {
        console.log(`Fetching contract request from: ${BASE_URL}${id}`);
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
        console.log("Contract request response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Contract request fetch error:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: `${BASE_URL}${id}`
        });

        // Provide more specific error messages
        if (axiosError.response?.status === 404) {
          throw new Error("Contract request not found. It may have been deleted or the ID is incorrect.");
        } else if (axiosError.response?.status === 403) {
          throw new Error("You don't have permission to view this contract request.");
        } else if (axiosError.response?.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        } else {
          throw new Error("Sorry: " + ((axiosError.response?.data as any)?.message || axiosError.message || "Unknown error occurred"));
        }
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Contract Request
export const useCreateContractRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    TContractRequestFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["contractRequests"],
    isAuth: true,
    method: "POST",
  });

  const createContractRequest = async (details: TContractRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Contract request create error:", error);
    }
  };

  return { createContractRequest, data, isLoading, isSuccess, error };
};

// Create Contract Interview
export const useCreateContractInterview = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    TContractRequestFormData
  >({
    endpoint: INTERVIEW_BASE_URL,
    queryKey: ["contractRequests"],
    isAuth: true,
    method: "POST",
  });

  const createContractInterview = async (details: TContractRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Contract interview create error:", error);
    }
  };

  return { createContractInterview, data, isLoading, isSuccess, error };
};

// Update Contract Request
export const useUpdateContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    TContractRequestFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "PUT",
  });

  const updateContractRequest = async (details: TContractRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Contract request update error:", error);
    }
  };

  return { updateContractRequest, data, isLoading, isSuccess, error };
};

// Update Contract Interview
export const useUpdateContractInterview = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    TContractRequestFormData
  >({
    endpoint: `${INTERVIEW_BASE_URL}${id}/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "PUT",
  });

  const updateContractInterview = async (details: TContractRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Contract interview update error:", error);
    }
  };

  return { updateContractInterview, data, isLoading, isSuccess, error };
};

// Update Contract Status
export const useUpdateContractStatus = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    TContractRequestFormData
  >({
    endpoint: `/contract-grants/consultancy/applicants/${id}/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "PATCH",
  });

  const updateContractStatus = async (details: TContractRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Contract status update error:", error);
    }
  };

  return { updateContractStatus, data, isLoading, isSuccess, error };
};

// Delete Contract Request
export const useDeleteContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["contractRequests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteContractRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Contract request delete error:", error);
    }
  };

  return { deleteContractRequest, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllContractRequestsQuery = useGetAllContractRequests;
export const useGetSingleContractRequestQuery = useGetSingleContractRequest;
export const useCreateContractRequestMutation = useCreateContractRequest;
export const useModifyContractRequestMutation = useUpdateContractRequest;
export const useDeleteContractRequestMutation = useDeleteContractRequest;
export const useCreateContractInterviewMutation = useCreateContractInterview;
export const useModifyContractInterviewMutation = useUpdateContractInterview;
export const useModifyContractStatusMutation = useUpdateContractStatus;

// Missing named exports
export const useModifyContractStatus = useUpdateContractStatus;
export const useModifyContractRequest = useUpdateContractRequest;

// ===== APPROVAL WORKFLOW HOOKS =====

// Submit Contract Request (DRAFT → SUBMITTED)
export const useSubmitContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const submitContractRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Contract request submit error:", error);
    }
  };

  return { submitContractRequest, data, isLoading, isSuccess, error };
};

// Review Contract Request (SUBMITTED → UNDER_REVIEW)
export const useReviewContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const reviewContractRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Contract request review error:", error);
    }
  };

  return { reviewContractRequest, data, isLoading, isSuccess, error };
};

// Complete Review of Contract Request (UNDER_REVIEW → REVIEWED)
export const useCompleteReviewContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/complete_review/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const completeReviewContractRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Contract request complete review error:", error);
    }
  };

  return { completeReviewContractRequest, data, isLoading, isSuccess, error };
};

// Authorize Contract Request (REVIEWED → AUTHORIZED)
export const useAuthorizeContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const authorizeContractRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Contract request authorize error:", error);
    }
  };

  return { authorizeContractRequest, data, isLoading, isSuccess, error };
};

// Approve Contract Request (AUTHORIZED → APPROVED)
export const useApproveContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const approveContractRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Contract request approve error:", error);
    }
  };

  return { approveContractRequest, data, isLoading, isSuccess, error };
};

// Reject Contract Request (ANY → REJECTED) - Requires comment
interface RejectContractRequestPayload {
  comment: string;
}

export const useRejectContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    RejectContractRequestPayload
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const rejectContractRequest = async (comment: string) => {
    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request reject error:", error);
    }
  };

  return { rejectContractRequest, data, isLoading, isSuccess, error };
};
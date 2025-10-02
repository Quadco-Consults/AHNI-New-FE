import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PurchaseRequestResponse,
  PurchaseRequestResultsData,
} from "../types/purchase-request";
import { z } from "zod";
import { PurchaseRequestSchema } from "../types/procurement-validator";

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
interface PurchaseRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/procurements/purchase-request/";

// ===== PURCHASE REQUEST HOOKS =====

// Get All Purchase Requests (Paginated)
export const useGetPurchaseRequests = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: PurchaseRequestFilterParams) => {
  return useQuery<PaginatedResponse<PurchaseRequestResultsData>>({
    queryKey: ["purchase-requests", page, size, search, status],
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
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Purchase Request List (Non-paginated)
export const useGetPurchaseRequestList = (enabled: boolean = true) => {
  return useQuery<ApiResponse<PurchaseRequestResultsData[]>>({
    queryKey: ["purchase-request-list"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Purchase Request
export const useGetPurchaseRequest = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PurchaseRequestResultsData>>({
    queryKey: ["purchase-request", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`, {
          params: {
            expand: 'requested_by,reviewed_by,authorized_by,approved_by',
            include_user_details: true,
            populate: 'users'
          }
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Purchase Request
export const useCreatePurchaseRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PurchaseRequestResponse,
    Error,
    z.infer<typeof PurchaseRequestSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["purchase-requests", "purchase-request-list"],
    isAuth: true,
    method: "POST",
  });

  const createPurchaseRequest = async (
    details: z.infer<typeof PurchaseRequestSchema>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Purchase request create error:", error);
    }
  };

  return { createPurchaseRequest, data, isLoading, isSuccess, error };
};

// Update Purchase Request (Full Update)
export const useUpdatePurchaseRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PurchaseRequestResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: [
      "purchase-requests",
      "purchase-request-list",
      "purchase-request",
    ],
    isAuth: true,
    method: "PUT",
  });

  const updatePurchaseRequest = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Purchase request update error:", error);
    }
  };

  return { updatePurchaseRequest, data, isLoading, isSuccess, error };
};

// Modify Purchase Request (Partial Update)
export const useModifyPurchaseRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PurchaseRequestResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: [
      "purchase-requests",
      "purchase-request-list",
      "purchase-request",
    ],
    isAuth: true,
    method: "PATCH",
  });

  const modifyPurchaseRequest = async (details: any) => {
    try {
      // Debug logging to catch problematic action values
      console.log(`🔧 ModifyPurchaseRequest called with:`, details);

      // Check if there's an action field and validate it
      if (details && typeof details === 'object' && 'action' in details) {
        const action = details.action;
        console.log(`🎯 Action field detected:`, action, `(type: ${typeof action})`);

        // Validate action is not None or invalid
        if (action === "None" || action === null || action === undefined || action === "") {
          console.error(`❌ Invalid action detected in modifyPurchaseRequest:`, action);
          throw new Error(`Invalid action value: "${action}". This would cause a backend error.`);
        }

        // If it's a workflow action, ensure it's one of the valid values
        const validActions = ["review", "authorise", "approve"];
        if (validActions.includes(action)) {
          console.log(`✅ Valid workflow action: ${action}`);
        } else {
          console.warn(`⚠️ Non-workflow action: ${action} - this might be a field update`);
        }
      } else {
        console.log(`📝 Non-action update (field modification):`, details);
      }

      await callApi(details);
    } catch (error) {
      console.error("Purchase request modify error:", error);
      throw error; // Re-throw to ensure errors are properly handled
    }
  };

  return { modifyPurchaseRequest, data, isLoading, isSuccess, error };
};

// Delete Purchase Request
export const useDeletePurchaseRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["purchase-requests", "purchase-request-list"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePurchaseRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Purchase request delete error:", error);
    }
  };

  return { deletePurchaseRequest, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetPurchaseRequestsQuery = useGetPurchaseRequests;
export const useGetPurchaseRequestListQuery = useGetPurchaseRequestList;
export const useGetPurchaseRequestQuery = useGetPurchaseRequest;
export const useCreatePurchaseRequestMutation = useCreatePurchaseRequest;
export const useUpdatePurchaseRequestMutation = useUpdatePurchaseRequest;
export const useModifyPurchaseRequestMutation = useModifyPurchaseRequest;
export const useDeletePurchaseRequestMutation = useDeletePurchaseRequest;

// Missing named export
export const useGetPurchaseRequestById = useGetPurchaseRequest;

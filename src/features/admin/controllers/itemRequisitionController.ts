import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TItemRequisitionFormValues,
  TItemRequisitionPaginatedData,
  TItemRequisitionSingleData,
} from "../types/inventory-management/item-requisition";

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
interface ItemRequisitionFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/inventory/item-requisitions/";

// ===== ITEM REQUISITION HOOKS =====

// Get All Item Requisitions (Paginated)
export const useGetAllItemRequisitions = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: ItemRequisitionFilterParams) => {
  return useQuery<PaginatedResponse<TItemRequisitionPaginatedData>>({
    queryKey: ["itemRequisitions", page, size, search, status],
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

// Get Single Item Requisition
export const useGetSingleItemRequisition = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<TItemRequisitionSingleData>>({
    queryKey: ["itemRequisition", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Item Requisition
export const useCreateItemRequisition = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemRequisitionSingleData,
    Error,
    TItemRequisitionFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["itemRequisitions"],
    isAuth: true,
    method: "POST",
  });

  const createItemRequisition = async (details: TItemRequisitionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Item requisition create error:", error);
    }
  };

  return { createItemRequisition, data, isLoading, isSuccess, error };
};

// Edit Item Requisition (Full Update)
export const useEditItemRequisition = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemRequisitionSingleData,
    Error,
    TItemRequisitionFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["itemRequisitions", "itemRequisition"],
    isAuth: true,
    method: "PUT",
  });

  const editItemRequisition = async (details: TItemRequisitionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Item requisition edit error:", error);
    }
  };

  return { editItemRequisition, data, isLoading, isSuccess, error };
};

// Approve Item Requisition
export const useApproveItemRequisition = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemRequisitionSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["itemRequisitions", "itemRequisition"],
    isAuth: true,
    method: "POST",
  });

  const approveItemRequisition = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Item requisition approve error:", error);
    }
  };

  return { approveItemRequisition, data, isLoading, isSuccess, error };
};

// Reject Item Requisition
export const useRejectItemRequisition = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemRequisitionSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["itemRequisitions", "itemRequisition"],
    isAuth: true,
    method: "POST",
  });

  const rejectItemRequisition = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Item requisition reject error:", error);
    }
  };

  return { rejectItemRequisition, data, isLoading, isSuccess, error };
};

// Issue Item Requisition
export const useIssueItemRequisition = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemRequisitionSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/issue/`,
    queryKey: ["itemRequisitions", "itemRequisition"],
    isAuth: true,
    method: "POST",
  });

  const issueItemRequisition = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Item requisition issue error:", error);
    }
  };

  return { issueItemRequisition, data, isLoading, isSuccess, error };
};

// Delete Item Requisition
export const useDeleteItemRequisition = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemRequisitionSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["itemRequisitions"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteItemRequisition = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Item requisition delete error:", error);
    }
  };

  return { deleteItemRequisition, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllItemRequisitionsQuery = useGetAllItemRequisitions;
export const useGetSingleItemRequisitionQuery = useGetSingleItemRequisition;
export const useCreateItemRequisitionMutation = useCreateItemRequisition;
export const useEditItemRequisitionMutation = useEditItemRequisition;
export const useApproveItemRequisitionMutation = useApproveItemRequisition;
export const useRejectItemRequisitionMutation = useRejectItemRequisition;
export const useIssueItemRequisitionMutation = useIssueItemRequisition;
export const useDeleteItemRequisitionMutation = useDeleteItemRequisition;

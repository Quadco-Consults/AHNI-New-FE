import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  IAdhocRequisitionPaginatedData,
  IAdhocRequisitionSingleData,
  IAdhocRequisitionPayload,
  IAdhocRequisitionFilterParams,
  IRequisitionApprovalPayload,
} from "@/types/adhoc-requisition";

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

const BASE_URL = "/adhoc-requisitions/"; // Update this to match your backend endpoint

// ===== QUERY HOOKS =====

// Get All Adhoc Requisitions (Paginated)
export const useGetAllAdhocRequisitions = ({
  page = 1,
  size = 20,
  search = "",
  staff_type,
  status,
  priority,
  department,
  date_from,
  date_to,
  enabled = true,
}: IAdhocRequisitionFilterParams) => {
  return useQuery<PaginatedResponse<IAdhocRequisitionPaginatedData>>({
    queryKey: [
      "adhocRequisitions",
      page,
      size,
      search,
      staff_type,
      status,
      priority,
      department,
      date_from,
      date_to,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(staff_type && { staff_type }),
            ...(status && { status }),
            ...(priority && { priority }),
            ...(department && { department }),
            ...(date_from && { date_from }),
            ...(date_to && { date_to }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch requisitions: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Adhoc Requisition
export const useGetSingleAdhocRequisition = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IAdhocRequisitionSingleData>>({
    queryKey: ["adhocRequisition", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch requisition: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get My Requisitions (Created by current user)
export const useGetMyAdhocRequisitions = ({
  page = 1,
  size = 20,
  enabled = true,
}: {
  page?: number;
  size?: number;
  enabled?: boolean;
}) => {
  return useQuery<PaginatedResponse<IAdhocRequisitionPaginatedData>>({
    queryKey: ["myAdhocRequisitions", page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my-requisitions/`, {
          params: { page, size },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch my requisitions: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Pending Approvals (For current user)
export const useGetPendingApprovals = ({
  page = 1,
  size = 20,
  enabled = true,
}: {
  page?: number;
  size?: number;
  enabled?: boolean;
}) => {
  return useQuery<PaginatedResponse<IAdhocRequisitionPaginatedData>>({
    queryKey: ["pendingAdhocApprovals", page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}pending-approvals/`, {
          params: { page, size },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch pending approvals: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// ===== MUTATION HOOKS =====

// Create Adhoc Requisition
export const useCreateAdhocRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IAdhocRequisitionPayload) => {
      const response = await AxiosWithToken.post(BASE_URL, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["myAdhocRequisitions"] });
      toast.success(data.message || "Requisition created successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to create requisition";
      toast.error(errorMessage);
    },
  });
};

// Update Adhoc Requisition
export const useUpdateAdhocRequisition = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<IAdhocRequisitionPayload>) => {
      const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      queryClient.invalidateQueries({ queryKey: ["myAdhocRequisitions"] });
      toast.success(data.message || "Requisition updated successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to update requisition";
      toast.error(errorMessage);
    },
  });
};

// Delete Adhoc Requisition
export const useDeleteAdhocRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`${BASE_URL}${id}/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["myAdhocRequisitions"] });
      toast.success(data.message || "Requisition deleted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to delete requisition";
      toast.error(errorMessage);
    },
  });
};

// ===== APPROVAL ACTIONS =====

// Review Requisition
export const useReviewRequisition = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRequisitionApprovalPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/review/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      queryClient.invalidateQueries({ queryKey: ["pendingAdhocApprovals"] });
      toast.success(data.message || "Requisition reviewed successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to review requisition";
      toast.error(errorMessage);
    },
  });
};

// Authorize Requisition
export const useAuthorizeRequisition = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRequisitionApprovalPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/authorize/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      queryClient.invalidateQueries({ queryKey: ["pendingAdhocApprovals"] });
      toast.success(data.message || "Requisition authorized successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to authorize requisition";
      toast.error(errorMessage);
    },
  });
};

// Approve Requisition
export const useApproveRequisition = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRequisitionApprovalPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/approve/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      queryClient.invalidateQueries({ queryKey: ["pendingAdhocApprovals"] });
      toast.success(data.message || "Requisition approved successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to approve requisition";
      toast.error(errorMessage);
    },
  });
};

// Reject Requisition
export const useRejectRequisition = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRequisitionApprovalPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/reject/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      queryClient.invalidateQueries({ queryKey: ["pendingAdhocApprovals"] });
      toast.success(data.message || "Requisition rejected");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to reject requisition";
      toast.error(errorMessage);
    },
  });
};

// Submit Requisition for Approval (DRAFT → PENDING_APPROVAL)
export const useSubmitRequisition = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("🚀 Submitting requisition:", id);
      // Try POST /submit/ endpoint first
      try {
        console.log("📡 Trying POST endpoint:", `${BASE_URL}${id}/submit/`);
        const response = await AxiosWithToken.post(`${BASE_URL}${id}/submit/`);
        console.log("✅ Submit response (POST):", response.data);
        return response.data;
      } catch (postError: any) {
        // If POST /submit/ doesn't exist (404), fallback to PATCH with status change
        if (postError.response?.status === 404 || postError.response?.status === 405) {
          console.log("⚠️ POST /submit/ not found, using PATCH fallback");
          console.log("📡 Trying PATCH endpoint:", `${BASE_URL}${id}/`);
          const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, {
            status: "PENDING_APPROVAL"
          });
          console.log("✅ Submit response (PATCH):", response.data);
          return response.data;
        }
        throw postError;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      queryClient.invalidateQueries({ queryKey: ["myAdhocRequisitions"] });
      toast.success(data.message || "Requisition submitted for approval!");
    },
    onError: (error: AxiosError) => {
      console.error("❌ Submit error:", error);
      console.error("📊 Error response:", error.response?.data);
      console.error("🔢 Status code:", error.response?.status);
      const errorMessage =
        (error.response?.data as any)?.message ||
        (error.response?.data as any)?.error ||
        error.message ||
        "Failed to submit requisition";
      toast.error(errorMessage);
    },
  });
};

// Convert to Advertisement
export const useConvertToAdvertisement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/convert_to_advertisement/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocRequisitions"] });
      queryClient.invalidateQueries({ queryKey: ["adhocRequisition", id] });
      toast.success(data.message || "Requisition converted to job advertisement!");
    },
    onError: (error: AxiosError) => {
      console.error("❌ Convert to advertisement error:", error);
      console.error("📊 Error response:", error.response?.data);
      const errorData = error.response?.data as any;
      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        "Failed to convert requisition";

      // Check for specific backend errors
      if (errorMessage.includes("has no attribute 'department'")) {
        toast.error("Backend error: The backend is using the wrong field name. Please contact the backend team to fix this issue.");
      } else {
        toast.error(errorMessage);
      }
    },
  });
};
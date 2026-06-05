import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  ApprovalThresholdData,
  ApprovalThresholdDetailData,
  ApprovalThresholdFormValues,
  ThresholdValidationRequest,
  ThresholdInfoRequest
} from "../../types/config";
import {
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllApprovalThresholdsManager = ({
  page = 1,
  size = 20,
  search = "",
  transaction_type = "",
  location_id = "",
  is_active = "",
  approval_level = "",
  enabled = true
}: FilterParams & {
  transaction_type?: string;
  location_id?: string;
  is_active?: string;
  approval_level?: string;
  enabled?: boolean;
} = {}) => {
  return useQuery<TPaginatedResponse<ApprovalThresholdData>>({
    queryKey: ["approval-thresholds", page, size, search, transaction_type, location_id, is_active, approval_level],
    queryFn: async () => {
      const params: any = { page, size };
      if (search) params.search = search;
      if (transaction_type) params.transaction_type = transaction_type;
      if (location_id) params.location_id = location_id;
      if (is_active) params.is_active = is_active;
      if (approval_level) params.approval_level = approval_level;

      const response = await AxiosWithToken.get("/config/approval-thresholds/", { params });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get single threshold
export const useGetApprovalThresholdDetail = (id: string, enabled = true) => {
  return useQuery<{ data: ApprovalThresholdDetailData }>({
    queryKey: ["approval-threshold", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/config/approval-thresholds/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateApprovalThresholdManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApprovalThresholdDetailData,
    Error,
    ApprovalThresholdFormValues
  >({
    endpoint: "config/approval-thresholds/",
    queryKey: ["approval-thresholds"],
    isAuth: true,
    method: "POST",
  });

  const createThreshold = async (details: ApprovalThresholdFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Approval threshold creation error:", error);
      throw error;
    }
  };

  return { createThreshold, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateApprovalThresholdManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApprovalThresholdDetailData,
    Error,
    ApprovalThresholdFormValues
  >({
    endpoint: "config/approval-thresholds/",
    queryKey: ["approval-thresholds"],
    isAuth: true,
    method: "PUT",
  });

  const updateThreshold = async (id: string, details: ApprovalThresholdFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/config/approval-thresholds/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Approval threshold update error:", error);
      throw error;
    }
  };

  return { updateThreshold, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteApprovalThresholdManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApprovalThresholdData,
    Error,
    Record<string, never>
  >({
    endpoint: "config/approval-thresholds/",
    queryKey: ["approval-thresholds"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteThreshold = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/approval-thresholds/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Approval threshold delete error:", error);
      throw error;
    }
  };

  return { deleteThreshold, data, isLoading, isSuccess, error };
};

// Custom Actions
export const useValidateThresholdCoverage = () => {
  const validateCoverage = async (request: ThresholdValidationRequest) => {
    try {
      const response = await AxiosWithToken.post('/config/approval-thresholds/validate_coverage/', request);
      return response.data;
    } catch (error) {
      console.error("Threshold validation error:", error);
      throw error;
    }
  };

  return { validateCoverage };
};

export const useGetThresholdForAmount = () => {
  const getThresholdForAmount = async (request: ThresholdInfoRequest) => {
    try {
      const response = await AxiosWithToken.post('/config/approval-thresholds/get_threshold_for_amount/', request);
      return response.data;
    } catch (error) {
      console.error("Get threshold error:", error);
      throw error;
    }
  };

  return { getThresholdForAmount };
};

export const useGetThresholdStatistics = (enabled = true) => {
  return useQuery({
    queryKey: ["approval-threshold-statistics"],
    queryFn: async () => {
      const response = await AxiosWithToken.get('/config/approval-thresholds/statistics/');
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const useBulkStatusChange = () => {
  const bulkStatusChange = async (threshold_ids: string[], is_active: boolean) => {
    try {
      const response = await AxiosWithToken.post('/config/approval-thresholds/bulk_status_change/', {
        threshold_ids,
        is_active
      });
      return response.data;
    } catch (error) {
      console.error("Bulk status change error:", error);
      throw error;
    }
  };

  return { bulkStatusChange };
};

// Backward compatibility exports
export const useGetAllApprovalThresholdsQuery = useGetAllApprovalThresholdsManager;
export const useGetAllApprovalThresholds = useGetAllApprovalThresholdsManager;

export const useAddApprovalThresholdMutation = () => {
  const { createThreshold, data, isLoading, isSuccess, error } = CreateApprovalThresholdManager();
  return [createThreshold, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateApprovalThresholdMutation = () => {
  const { updateThreshold, data, isLoading, isSuccess, error } = UpdateApprovalThresholdManager();
  return [
    (params: { id: string; body: ApprovalThresholdFormValues }) => updateThreshold(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteApprovalThresholdMutation = () => {
  const { deleteThreshold, data, isLoading, isSuccess, error } = DeleteApprovalThresholdManager();
  return [deleteThreshold, { data, isLoading, isSuccess, error }] as const;
};

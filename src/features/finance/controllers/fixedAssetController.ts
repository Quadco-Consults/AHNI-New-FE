import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";
import {
  FixedAsset,
  FixedAssetListResponse,
  FixedAssetFilters,
  FixedAssetStats,
  FixedAssetCreateInput,
  FixedAssetUpdateInput,
  FixedAssetDisposeInput,
  DepreciationScheduleResponse,
  DepreciationRun,
  RunDepreciationInput,
  RunDepreciationResponse,
  DepreciationSchedule,
} from "../types/fixed-assets.types";

const BASE_URL = "/finance/fixed-assets";
const DEPRECIATION_URL = "/finance/depreciation";

// ==================== Fixed Assets ====================

/**
 * Get list of fixed assets with optional filters
 */
export const useGetFixedAssets = (filters: FixedAssetFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.status && filters.status !== "all") params.append("status", filters.status);
  if (filters.location) params.append("location", filters.location);
  if (filters.project) params.append("project", filters.project);
  if (filters.donor) params.append("donor", filters.donor);
  if (filters.currency && filters.currency !== "all") params.append("currency", filters.currency);
  if (typeof filters.auto_depreciate === "boolean") params.append("auto_depreciate", String(filters.auto_depreciate));
  if (filters.page) params.append("page", String(filters.page));
  if (filters.page_size) params.append("page_size", String(filters.page_size));

  return useQuery<FixedAssetListResponse>({
    queryKey: ["fixed-assets", filters],
    queryFn: async () => {
      const response = await axiosInstance.get(`${BASE_URL}/?${params.toString()}`);
      return response.data;
    },
  });
};

/**
 * Get a single fixed asset by ID
 */
export const useGetFixedAsset = (id: string | null) => {
  return useQuery<FixedAsset>({
    queryKey: ["fixed-asset", id],
    queryFn: async () => {
      if (!id) throw new Error("Asset ID is required");
      const response = await axiosInstance.get(`${BASE_URL}/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get fixed asset statistics
 */
export const useGetFixedAssetStats = () => {
  return useQuery<FixedAssetStats>({
    queryKey: ["fixed-asset-stats"],
    queryFn: async () => {
      const response = await axiosInstance.get(`${BASE_URL}/stats/summary/`);
      return response.data;
    },
  });
};

/**
 * Create a new fixed asset
 */
export const useCreateFixedAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FixedAssetCreateInput) => {
      const response = await axiosInstance.post(BASE_URL + "/", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fixed-assets"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset-stats"] });
      toast.success(data.message || "Fixed asset created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.errors || "Failed to create fixed asset";
      toast.error(typeof message === "string" ? message : JSON.stringify(message));
    },
  });
};

/**
 * Update a fixed asset
 */
export const useUpdateFixedAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FixedAssetUpdateInput }) => {
      const response = await axiosInstance.patch(`${BASE_URL}/${id}/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fixed-assets"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset-stats"] });
      toast.success(data.message || "Fixed asset updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.errors || "Failed to update fixed asset";
      toast.error(typeof message === "string" ? message : JSON.stringify(message));
    },
  });
};

/**
 * Delete (soft delete) a fixed asset
 */
export const useDeleteFixedAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`${BASE_URL}/${id}/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fixed-assets"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset-stats"] });
      toast.success(data.message || "Fixed asset deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to delete fixed asset";
      toast.error(message);
    },
  });
};

/**
 * Dispose a fixed asset
 */
export const useDisposeFixedAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FixedAssetDisposeInput }) => {
      const response = await axiosInstance.post(`${BASE_URL}/${id}/dispose/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fixed-assets"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset-stats"] });
      toast.success(data.message || "Fixed asset disposed successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to dispose fixed asset";
      toast.error(message);
    },
  });
};

// ==================== Depreciation Schedule ====================

/**
 * Get depreciation schedule for a fixed asset
 */
export const useGetDepreciationSchedule = (assetId: string | null) => {
  return useQuery<DepreciationScheduleResponse>({
    queryKey: ["depreciation-schedule", assetId],
    queryFn: async () => {
      if (!assetId) throw new Error("Asset ID is required");
      const response = await axiosInstance.get(`${BASE_URL}/${assetId}/depreciation-schedule/`);
      return response.data;
    },
    enabled: !!assetId,
  });
};

/**
 * Post a depreciation schedule to journal
 */
export const usePostDepreciationSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await axiosInstance.post(`${DEPRECIATION_URL}/schedules/${scheduleId}/post/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["depreciation-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["depreciation-runs"] });
      toast.success(data.message || "Depreciation posted to journal successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to post depreciation";
      toast.error(message);
    },
  });
};

// ==================== Depreciation Runs ====================

/**
 * Get list of depreciation runs
 */
export const useGetDepreciationRuns = (filters: { year?: number; month?: number; page?: number; page_size?: number } = {}) => {
  const params = new URLSearchParams();

  if (filters.year) params.append("year", String(filters.year));
  if (filters.month) params.append("month", String(filters.month));
  if (filters.page) params.append("page", String(filters.page));
  if (filters.page_size) params.append("page_size", String(filters.page_size));

  return useQuery<{
    count: number;
    next: string | null;
    previous: string | null;
    results: DepreciationRun[];
  }>({
    queryKey: ["depreciation-runs", filters],
    queryFn: async () => {
      const response = await axiosInstance.get(`${DEPRECIATION_URL}/runs/?${params.toString()}`);
      return response.data;
    },
  });
};

/**
 * Get a single depreciation run by ID
 */
export const useGetDepreciationRun = (id: string | null) => {
  return useQuery<{
    run: DepreciationRun;
    schedules: DepreciationSchedule[];
  }>({
    queryKey: ["depreciation-run", id],
    queryFn: async () => {
      if (!id) throw new Error("Run ID is required");
      const response = await axiosInstance.get(`${DEPRECIATION_URL}/runs/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Run monthly depreciation
 */
export const useRunDepreciation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RunDepreciationInput = {}) => {
      const response = await axiosInstance.post(`${DEPRECIATION_URL}/run/`, data);
      return response.data as RunDepreciationResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["depreciation-runs"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-assets"] });
      queryClient.invalidateQueries({ queryKey: ["fixed-asset-stats"] });
      toast.success(data.message || "Depreciation run completed successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to run depreciation";
      toast.error(message);
    },
  });
};

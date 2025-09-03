import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// Asset History interfaces
export interface AssetHistoryData {
  id: string;
  asset_id: string;
  date: string;
  description: string;
  status: string;
  remark: string;
  action_type: "MOVEMENT" | "DISPOSAL" | "ASSIGNMENT" | "MAINTENANCE" | "OTHER";
  from_location?: {
    id: string;
    name: string;
  };
  to_location?: {
    id: string;
    name: string;
  };
  from_assignee?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  to_assignee?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_datetime: string;
  updated_datetime: string;
  created_by: string;
  updated_by: string;
}

// API Response interfaces
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {
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
interface AssetHistoryFilterParams {
  page?: number;
  size?: number;
  search?: string;
  asset_id?: string;
  action_type?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/inventory/assets/history/";

// ===== ASSET HISTORY HOOKS =====

// Get Asset History by Asset ID
export const useGetAssetHistory = ({
  asset_id,
  page = 1,
  size = 20,
  search = "",
  action_type = "",
  enabled = true,
}: AssetHistoryFilterParams & { asset_id: string }) => {
  return useQuery<PaginatedResponse<AssetHistoryData>>({
    queryKey: ["assetHistory", asset_id, page, size, search, action_type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            asset_id,
            page,
            size,
            ...(search && { search }),
            ...(action_type && { action_type }),
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
    enabled: enabled && !!asset_id,
    refetchOnWindowFocus: false,
  });
};

// Get All Asset History (for admin overview)
export const useGetAllAssetHistory = ({
  page = 1,
  size = 20,
  search = "",
  action_type = "",
  enabled = true,
}: AssetHistoryFilterParams) => {
  return useQuery<PaginatedResponse<AssetHistoryData>>({
    queryKey: ["allAssetHistory", page, size, search, action_type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(action_type && { action_type }),
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

// Legacy exports for backward compatibility
export const useGetAssetHistoryQuery = useGetAssetHistory;
export const useGetAllAssetHistoryQuery = useGetAllAssetHistory;
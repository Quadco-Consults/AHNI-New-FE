import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { ProcurementTrackerResults } from "../types/procurementPlan";
import { TBasePaginatedResponse } from "definations/auth/auth";
import { TRequest } from "definations/index";

const BASE_URL = "/procurements/procurement-tracker/";

// ===== PROCUREMENT TRACKER HOOKS =====

// Get All Procurement Trackers
export const useGetAllProcurementTrackers = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
  item_type,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TBasePaginatedResponse<ProcurementTrackerResults[]>>({
    queryKey: ["procurement-trackers", page, size, search, status, item_type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status, item_type },
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
export const useGetProcurementTrackersQuery = useGetAllProcurementTrackers;

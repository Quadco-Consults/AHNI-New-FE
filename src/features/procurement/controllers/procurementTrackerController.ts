import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { ProcurementTrackerResults } from "../types/procurementPlan";
import { TPaginatedResponse } from "definations/index";
import { TRequest } from "definations/index";

const BASE_URL = "procurements/procurement-tracker/";

// Get All Procurement Trackers
export const useGetAllProcurementTrackers = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
  item_type = "",
  service_status = "",
  services_only = "false",
  year = "",
}: TRequest & {
  enabled?: boolean;
  item_type?: string;
  service_status?: string;
  services_only?: string;
  year?: string;
}) => {
  return useQuery<TPaginatedResponse<ProcurementTrackerResults>>({
    queryKey: ["procurement-trackers", page, size, search, status, item_type, service_status, services_only, year],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            search,
            status,
            item_type,
            service_status,
            services_only,
            year
          },
        });

        // Transform the response to match expected structure
        // API returns: { data: { results: [...], pagination: {...} } }
        // Frontend expects: { results: [...], pagination: {...} }
        const apiData = response.data;

        if (apiData?.data) {
          return {
            results: apiData.data.results || [],
            pagination: apiData.data.pagination || {}
          };
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Procurement Tracker API Error:", axiosError);

        if (axiosError.response?.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }

        throw new Error(
          "Failed to load procurement tracker data: " +
          ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Legacy export for backward compatibility
export const useGetProcurementTrackersQuery = useGetAllProcurementTrackers;
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { ProcurementTrackerResults } from "../types/procurementPlan";
import { TBasePaginatedResponse } from "definations/auth/auth";
import { TRequest } from "definations/index";

const BASE_URL = "/procurements/procurement-tracker/";

// ===== PROCUREMENT TRACKER HOOKS =====

// Get All Procurement Trackers with comprehensive filtering
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
  return useQuery<TBasePaginatedResponse<ProcurementTrackerResults[]>>({
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
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Procurement Tracker API Error:", axiosError.response?.data);
        
        // If it's a serialization error, try alternative approach
        if (axiosError.response?.status === 500) {
          console.warn("Backend serialization error detected. Using fallback data structure.");
          // Return empty results structure to prevent complete failure
          return {
            status: "error",
            message: "Backend data serialization issue - some fields may be missing",
            data: {
              results: [],
              count: 0,
              pagination: {
                page: 1,
                size: size,
                total: 0
              }
            }
          };
        }
        
        throw new Error(
          "API Error: " + ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Legacy exports for backward compatibility
export const useGetProcurementTrackersQuery = useGetAllProcurementTrackers;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { ProcurementTrackerResults } from "../types/procurementPlan";
import { TPaginatedResponse } from "definations/index";
import { TRequest } from "definations/index";
import { handleApiError, createErrorContext } from "@/utils/errorHandlers";
import { useDepartmentFeatures } from "@/hooks/useDepartmentFeatures";
import { toast } from "sonner";

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

        console.log('🔍 Procurement Tracker API Response:', {
          resultsCount: response.data?.data?.results?.length || 0,
          totalCount: response.data?.data?.pagination?.count || 0,
          search: search,
          hasData: !!response.data?.data
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

        // Create error context for better handling
        const errorContext = createErrorContext(
          'fetch procurement tracker data',
          'PROCUREMENT',
          'Procurement Tracker'
        );

        // Use enhanced error handling
        handleApiError(axiosError, errorContext);

        // Still throw for React Query error boundary
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

// Update Procurement Tracker Remarks (works for both PR items and PO items)
export const useUpdateProcurementTrackerRemarks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      sourceType,
      remarks
    }: {
      itemId: string;
      sourceType: "pr_item" | "po_item";
      remarks: string
    }) => {
      const response = await AxiosWithToken.patch(
        `procurements/procurement-tracker/update-remarks/`,
        {
          item_id: itemId,
          source_type: sourceType,
          remarks: remarks
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch procurement tracker data
      queryClient.invalidateQueries({ queryKey: ["procurement-trackers"] });
      toast.success("Remarks updated successfully");
    },
    onError: (error: AxiosError) => {
      console.error("Failed to update remarks:", error);
      toast.error("Failed to update remarks. Please try again.");
    },
  });
};
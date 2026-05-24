import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IConsultancyReportPaginatedData,
  IConsultancyReportSingleData,
} from "@/features/contracts-grants/types/contract-management/consultancy-report";

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
interface ConsultantReportFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

// Note: Consultant portal uses the same consultancy reports API as the main app
// We filter on the frontend to show only the logged-in consultant's reports
const BASE_URL = "contract-grants/consultancy/reports/";

// Get All Consultant Reports (Paginated and filtered for current consultant)
export const useGetConsultantReports = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: ConsultantReportFilterParams) => {
  return useQuery<PaginatedResponse<IConsultancyReportPaginatedData>>({
    queryKey: ["consultantReports", page, size, search, status],
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
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Consultant Report
export const useGetSingleConsultantReport = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IConsultancyReportSingleData>>({
    queryKey: ["consultantReport", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get Report Statistics for Consultant
export const useGetConsultantReportStatistics = (consultantEmail: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["consultantReportStatistics", consultantEmail],
    queryFn: async () => {
      try {
        // Fetch all reports and calculate stats on frontend
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page: 1,
            size: 1000, // Get all reports for stats calculation
          },
        });

        // Filter reports for this consultant (by matching email in consultant field)
        const allReports = response.data?.data?.results || [];
        // Note: Filtering will be done in the component based on consultant mapping

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!consultantEmail,
    refetchOnWindowFocus: false,
  });
};

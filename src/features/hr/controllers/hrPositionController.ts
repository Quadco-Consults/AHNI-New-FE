import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { HrGradeResults } from "../types/hr-grades";
import { HrGradeFormValues } from "../types/hr-validator";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

// Paginated Response interface
interface TPaginatedResponse<T> {
  number_of_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    next_page_number: number | null;
    previous: string | null;
    previous_page_number: number | null;
  };
}

// Request interface
interface TRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  category?: string;
}

// Filter parameters interface
interface HrPositionFilterParams extends TRequest {
  enabled?: boolean;
}

const BASE_URL = "/hr/hr-positions/";

// ===== HR POSITION HOOKS =====

// Get HR Positions (Paginated)
export const useGetHrPositions = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  category = "",
  enabled = true,
}: HrPositionFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<HrGradeResults[]>>>({
    queryKey: ["hr-positions", page, size, search, status, category],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(category && { category }),
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

// Get HR Position List (Simple list)
export const useGetHrPositionList = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<HrGradeResults[]>>({
    queryKey: ["hr-position-list"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
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

// Get Single HR Position
export const useGetHrPosition = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<HrGradeResults>>({
    queryKey: ["hr-position", id],
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

// Create HR Position
export const useCreateHrPosition = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrGradeResults,
    Error,
    HrGradeFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["hr-positions"],
    isAuth: true,
    method: "POST",
  });

  const createHrPosition = async (details: HrGradeFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR position create error:", error);
    }
  };

  return { createHrPosition, data, isLoading, isSuccess, error };
};

// Update HR Position
export const useUpdateHrPosition = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrGradeResults,
    Error,
    { name: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["hr-positions", "hr-position"],
    isAuth: true,
    method: "PUT",
  });

  const updateHrPosition = async (details: { name: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR position update error:", error);
    }
  };

  return { updateHrPosition, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateHrPositionMutation = useCreateHrPosition;
export const useGetHrPositionListQuery = useGetHrPositionList;
export const useGetHrPositionQuery = useGetHrPosition;
export const useGetHrPositionsQuery = useGetHrPositions;
export const useUpdateHrPositionMutation = useUpdateHrPosition;
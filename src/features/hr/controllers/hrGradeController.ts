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
interface HrGradeFilterParams extends TRequest {
  enabled?: boolean;
}

const BASE_URL = "/hr/hr-grades/";

// ===== HR GRADE HOOKS =====

// Get HR Grades (Paginated)
export const useGetHrGrades = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  category = "",
  enabled = true,
}: HrGradeFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<HrGradeResults[]>>>({
    queryKey: ["hr-grades", page, size, search, status, category],
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

// Get HR Grade List (Simple list)
export const useGetHrGradeList = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<HrGradeResults[]>>({
    queryKey: ["hr-grade-list"],
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

// Get Single HR Grade
export const useGetHrGrade = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<HrGradeResults>>({
    queryKey: ["hr-grade", id],
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

// Create HR Grade
export const useCreateHrGrade = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrGradeResults,
    Error,
    HrGradeFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["hr-grades"],
    isAuth: true,
    method: "POST",
  });

  const createHrGrade = async (details: HrGradeFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR grade create error:", error);
    }
  };

  return { createHrGrade, data, isLoading, isSuccess, error };
};

// Update HR Grade
export const useUpdateHrGrade = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrGradeResults,
    Error,
    { name: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["hr-grades", "hr-grade"],
    isAuth: true,
    method: "PUT",
  });

  const updateHrGrade = async (details: { name: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR grade update error:", error);
    }
  };

  return { updateHrGrade, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateHrGradeMutation = useCreateHrGrade;
export const useGetHrGradeListQuery = useGetHrGradeList;
export const useGetHrGradeQuery = useGetHrGrade;
export const useGetHrGradesQuery = useGetHrGrades;
export const useUpdateHrGradeMutation = useUpdateHrGrade;
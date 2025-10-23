import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Competency, DEFAULT_COMPETENCIES } from "@/features/hr/types/competency";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Paginated Response interface
interface PaginatedResponse<T> {
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  results: T[];
}

const BASE_URL = "hr/performance/competencies/";

// ===== COMPETENCIES HOOKS =====

// Get All Competencies
export const useGetCompetencies = ({
  search = "",
  page = 1,
  size = 100,
  enabled = true,
  active = true,
}: {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
  active?: boolean;
} = {}) => {
  return useQuery<ApiResponse<PaginatedResponse<Competency>>>({
    queryKey: ["competencies", search, page, size, active],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(active !== undefined && { active }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Competencies API Error:", axiosError.response?.data);

        // If backend doesn't have competencies endpoint yet, return default competencies
        if (axiosError.response?.status === 404 || axiosError.response?.status === 500) {
          console.warn("Competencies endpoint not available, using default competencies");
          return {
            status: true,
            message: "Using default competencies",
            data: {
              pagination: {
                count: DEFAULT_COMPETENCIES.length,
                next: null,
                previous: null,
              },
              results: DEFAULT_COMPETENCIES.map((comp, index) => ({
                ...comp,
                id: `default-${index}`,
              })) as Competency[],
            },
          };
        }

        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Competency
export const useGetCompetency = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Competency>>({
    queryKey: ["competency", id],
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

// Get Competencies by Job Title
export const useGetCompetenciesByJobTitle = (jobTitle: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PaginatedResponse<Competency>>>({
    queryKey: ["competencies-by-job", jobTitle],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            job_title: jobTitle,
            active: true,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;

        // Fallback to default competencies
        if (axiosError.response?.status === 404 || axiosError.response?.status === 500) {
          console.warn("Job-specific competencies not available, using defaults");
          return {
            status: true,
            message: "Using default competencies",
            data: {
              pagination: {
                count: DEFAULT_COMPETENCIES.length,
                next: null,
                previous: null,
              },
              results: DEFAULT_COMPETENCIES.map((comp, index) => ({
                ...comp,
                id: `default-${index}`,
              })) as Competency[],
            },
          };
        }

        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!jobTitle,
    refetchOnWindowFocus: false,
  });
};

// Create Competency
export const useCreateCompetency = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Competency,
    Error,
    Omit<Competency, 'id' | 'created_datetime' | 'updated_datetime'>
  >({
    endpoint: BASE_URL,
    queryKey: ["competencies"],
    isAuth: true,
    method: "POST",
  });

  const createCompetency = async (details: Omit<Competency, 'id' | 'created_datetime' | 'updated_datetime'>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Competency create error:", error);
      throw error;
    }
  };

  return { createCompetency, data, isLoading, isSuccess, error };
};

// Update Competency
export const useUpdateCompetency = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Competency,
    Error,
    Partial<Competency>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["competencies", "competency"],
    isAuth: true,
    method: "PUT",
  });

  const updateCompetency = async (details: Partial<Competency>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Competency update error:", error);
      throw error;
    }
  };

  return { updateCompetency, data, isLoading, isSuccess, error };
};

// Delete Competency
export const useDeleteCompetency = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["competencies", "competency"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCompetency = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Competency delete error:", error);
      throw error;
    }
  };

  return { deleteCompetency, data, isLoading, isSuccess, error };
};

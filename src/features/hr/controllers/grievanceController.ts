import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { GrievianceManagement } from "../types/grieviance-management";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface GrievanceFilterParams {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/grievances/complaints/";

// ===== GRIEVANCE MANAGEMENT HOOKS =====

// Get All Grievances
export const useGetGrievances = ({
  status = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: GrievanceFilterParams) => {
  return useQuery<ApiResponse<GrievianceManagement[]>>({
    queryKey: ["grievances", page, size, status, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(status && { status }),
            ...(search && { search }),
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

// Get Single Grievance
export const useGetGrievance = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<GrievianceManagement>>({
    queryKey: ["grievance", id],
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

// Create Grievance
export const useCreateGrievance = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagement,
    Error,
    Partial<GrievianceManagement> | FormData
  >({
    endpoint: BASE_URL,
    queryKey: ["grievances"],
    isAuth: true,
    method: "POST",
    contentType: null, // This allows FormData uploads with proper multipart/form-data headers
  });

  const createGrievance = async (details: Partial<GrievianceManagement> | FormData) => {
    try {
      await callApi(details as any);
    } catch (error) {
      console.error("Grievance create error:", error);
    }
  };

  return { createGrievance, data, isLoading, isSuccess, error };
};

// Update Grievance (Full Update)
export const useUpdateGrievance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagement,
    Error,
    Partial<GrievianceManagement>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grievances", "grievance"],
    isAuth: true,
    method: "PUT",
  });

  const updateGrievance = async (details: Partial<GrievianceManagement>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grievance update error:", error);
    }
  };

  return { updateGrievance, data, isLoading, isSuccess, error };
};

// Patch Grievance (Partial Update)
export const usePatchGrievance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagement,
    Error,
    Partial<GrievianceManagement>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grievances", "grievance"],
    isAuth: true,
    method: "PATCH",
  });

  const patchGrievance = async (details: Partial<GrievianceManagement>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grievance patch error:", error);
    }
  };

  return { patchGrievance, data, isLoading, isSuccess, error };
};

// Delete Grievance
export const useDeleteGrievance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagement,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grievances"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteGrievance = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Grievance delete error:", error);
    }
  };

  return { deleteGrievance, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetGrievianceManagementsQuery = useGetGrievances;
export const useGetGrievianceManagementQuery = useGetGrievance;
export const useCreateGrievianceManagementMutation = useCreateGrievance;
export const useUpdateGrievianceManagementMutation = useUpdateGrievance;
export const usePatchGrievianceManagementMutation = usePatchGrievance;
export const useDeleteGrievianceManagementMutation = useDeleteGrievance;

// Missing named export
export const useGetGrievianceManagement = useGetGrievances;
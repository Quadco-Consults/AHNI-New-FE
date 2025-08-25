import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { LeavePackage } from "../types/leave-package";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface LeavePackageFilterParams {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/leave-package/";

// ===== LEAVE PACKAGE HOOKS =====

// Get Leave Packages
export const useGetLeavePackages = ({
  status = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: LeavePackageFilterParams = {}) => {
  return useQuery<ApiResponse<LeavePackage[]>>({
    queryKey: ["leave-packages", status, search, page, size],
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

// Get Single Leave Package
export const useGetLeavePackage = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<LeavePackage>>({
    queryKey: ["leave-package", id],
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

// Create Leave Package
export const useCreateLeavePackage = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeavePackage,
    Error,
    Partial<LeavePackage>
  >({
    endpoint: BASE_URL,
    queryKey: ["leave-packages"],
    isAuth: true,
    method: "POST",
  });

  const createLeavePackage = async (details: Partial<LeavePackage>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave package create error:", error);
    }
  };

  return { createLeavePackage, data, isLoading, isSuccess, error };
};

// Update Leave Package
export const useUpdateLeavePackage = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeavePackage,
    Error,
    Partial<LeavePackage>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["leave-packages", "leave-package"],
    isAuth: true,
    method: "PUT",
  });

  const updateLeavePackage = async (details: Partial<LeavePackage>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave package update error:", error);
    }
  };

  return { updateLeavePackage, data, isLoading, isSuccess, error };
};

// Patch Leave Package
export const usePatchLeavePackage = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeavePackage,
    Error,
    Partial<LeavePackage>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["leave-packages", "leave-package"],
    isAuth: true,
    method: "PATCH",
  });

  const patchLeavePackage = async (details: Partial<LeavePackage>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave package patch error:", error);
    }
  };

  return { patchLeavePackage, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetLeavePackagesQuery = useGetLeavePackages;
export const useGetLeavePackageQuery = useGetLeavePackage;
export const useCreateLeavePackageMutation = useCreateLeavePackage;
export const useUpdateLeavePackageMutation = useUpdateLeavePackage;
export const usePatchLeavePackageMutation = usePatchLeavePackage;
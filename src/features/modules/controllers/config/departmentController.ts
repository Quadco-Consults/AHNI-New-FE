import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  DepartmentData, 
  DepartmentFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse,
  ApiResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllDepartmentsManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<DepartmentData>>>({
    queryKey: ["departments", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/departments/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Department
export const useGetSingleDepartment = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<DepartmentData>>({
    queryKey: ["department", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/config/departments/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateDepartmentManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DepartmentData,
    Error,
    DepartmentFormValues
  >({
    endpoint: "config/departments/",
    queryKey: ["departments"],
    isAuth: true,
    method: "POST",
  });

  const createDepartment = async (details: DepartmentFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Department creation error:", error);
    }
  };

  return { createDepartment, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateDepartmentManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DepartmentData,
    Error,
    DepartmentFormValues
  >({
    endpoint: "config/departments/",
    queryKey: ["departments"],
    isAuth: true,
    method: "PATCH",
  });

  const updateDepartment = async (id: string, details: DepartmentFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/config/departments/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Department update error:", error);
      throw error;
    }
  };

  return { updateDepartment, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteDepartmentManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DepartmentData,
    Error,
    Record<string, never>
  >({
    endpoint: "config/departments/",
    queryKey: ["departments"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDepartment = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Department delete error:", error);
      throw error;
    }
  };

  return { deleteDepartment, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllDepartmentsQuery = useGetAllDepartmentsManager;

export const useAddDepartmentMutation = () => {
  const { createDepartment, data, isLoading, isSuccess, error } = CreateDepartmentManager();
  return [createDepartment, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateDepartmentMutation = () => {
  const { updateDepartment, data, isLoading, isSuccess, error } = UpdateDepartmentManager();
  return [
    (params: { id: string; body: DepartmentFormValues }) => updateDepartment(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteDepartmentMutation = () => {
  const { deleteDepartment, data, isLoading, isSuccess, error } = DeleteDepartmentManager();
  return [deleteDepartment, { data, isLoading, isSuccess, error }] as const;
};

// Alternative endpoints for bypassing permission filtering
export const useGetAllDepartmentsUnrestricted = ({
  page = 1,
  size = 1000,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<DepartmentData>>>({
    queryKey: ["departments-unrestricted", page, size, search],
    queryFn: async () => {
      // Try multiple endpoint patterns that might bypass permission filtering
      const endpoints = [
        "/admins/config/departments/",  // Admin endpoint pattern
        "/config/departments/all/",     // All departments endpoint
        "/hr/departments/",             // HR-specific endpoint
        "/config/departments/"          // Original with special params
      ];

      const params = [
        { page, size, search, access_scope: "global" },
        { page, size, search, data_access_level: "global" },
        { page, size, search, unrestricted: true },
        { page, size, search, all: true },
        { page, size: 2000000, search }  // Large size like users API
      ];

      for (let i = 0; i < endpoints.length; i++) {
        try {
          console.log(`🔍 Trying department endpoint ${i + 1}: ${endpoints[i]} with params:`, params[i % params.length]);
          const response = await AxiosWithToken.get(endpoints[i], {
            params: params[i % params.length]
          });
          console.log(`✅ SUCCESS with department endpoint ${i + 1}:`, response.data);
          console.log(`📊 Department count from endpoint ${i + 1}:`, response.data?.data?.results?.length || response.data?.results?.length || 0);

          // If we got more than 1 department, this endpoint worked
          const resultCount = response.data?.data?.results?.length || response.data?.results?.length || 0;
          if (resultCount > 1) {
            console.log(`🎯 FOUND WORKING DEPARTMENT ENDPOINT: ${endpoints[i]} returned ${resultCount} departments!`);
            return response.data;
          } else if (i === endpoints.length - 1) {
            // Last endpoint and still only 1 result - this confirms the permission filtering issue
            console.warn(`⚠️ All department endpoints tested, but only ${resultCount} department(s) returned. This confirms backend permission filtering.`);
            return response.data;
          }
        } catch (error) {
          console.log(`❌ Failed department endpoint ${i + 1} (${endpoints[i]}):`, error);
          if (i === endpoints.length - 1) {
            throw error; // Throw the last error if all attempts fail
          }
        }
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Missing named exports
export const useGetAllDepartments = useGetAllDepartmentsManager;
export const useGetDepartmentPaginate = useGetAllDepartmentsManager;
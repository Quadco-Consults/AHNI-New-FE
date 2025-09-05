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

// CREATE Operations (Mutations)
export const CreateDepartmentManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DepartmentData,
    Error,
    DepartmentFormValues
  >({
    endpoint: "/config/departments/",
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
    endpoint: "/config/departments/",
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
    endpoint: "/config/departments/",
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

// Missing named exports
export const useGetAllDepartments = useGetAllDepartmentsManager;
export const useGetDepartmentPaginate = useGetAllDepartmentsManager;
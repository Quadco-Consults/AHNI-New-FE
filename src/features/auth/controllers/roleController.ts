import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { IRole, Permission } from "../types/permission";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

interface TRolePermission {
  id: string;
  name: string;
  permissions: {
    module: string;
    permissions: { codename: string; id: number; name: string }[];
  }[];
}

// ===== ROLE & PERMISSION HOOKS =====

// Get All Roles (Paginated)
export const useGetAllRoles = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IRole>>({
    queryKey: ["roles", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/roles/", {
          params: { page, size, search },
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

// Get Single Role
export const useGetSingleRole = (roleId: string, enabled: boolean = true) => {
  return useQuery<TResponse<TRolePermission>>({
    queryKey: ["role", roleId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/roles/${roleId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!roleId,
    refetchOnWindowFocus: false,
  });
};

// Get All Permissions
export const useGetAllPermissions = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TResponse<Permission[]>>({
    queryKey: ["permissions", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/permissions/", {
          params: { page, size, search },
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

// Get Permissions by Role
export const useGetPermissionsByRole = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<Permission[]>>({
    queryKey: ["role-permissions", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/permissions/${id}/`);
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

// Create Role
export const useCreateRole = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IRole,
    Error,
    { name: string }
  >({
    endpoint: "/roles/",
    queryKey: ["roles"],
    isAuth: true,
    method: "POST",
  });

  const createRole = async (details: { name: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Role create error:", error);
    }
  };

  return { createRole, data, isLoading, isSuccess, error };
};

// Update Role
export const useUpdateRole = (roleId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    { name: string; permissions: number[] }
  >({
    endpoint: `/roles/${roleId}/`,
    queryKey: ["roles", "role"],
    isAuth: true,
    method: "PUT",
  });

  const updateRole = async (details: { name: string; permissions: number[] }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Role update error:", error);
    }
  };

  return { updateRole, data, isLoading, isSuccess, error };
};

// Add Permission to Role
export const useAddPermissionToRole = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { items: string[] }
  >({
    endpoint: `/auth/roles/${id}/assign_permission/`,
    queryKey: ["permissions"],
    isAuth: true,
    method: "POST",
  });

  const addPermissionToRole = async (details: { items: string[] }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Add permission to role error:", error);
    }
  };

  return { addPermissionToRole, data, isLoading, isSuccess, error };
};

// Delete Role
export const useDeleteRole = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Record<string, never>
  >({
    endpoint: `/roles/${id}/`,
    queryKey: ["roles"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteRole = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Role delete error:", error);
    }
  };

  return { deleteRole, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllRolesQuery = useGetAllRoles;
export const useGetSingleRoleQuery = useGetSingleRole;
export const useGetAllPermissionsQuery = useGetAllPermissions;
export const useGetPermissionsByRoleQuery = useGetPermissionsByRole;
export const useCreateRoleMutation = useCreateRole;
export const useUpdateRoleMutation = useUpdateRole;
export const useAddPermissionToRoleMutation = useAddPermissionToRole;
export const useDeleteRoleMutation = useDeleteRole;

// Additional missing exports
export const useGetAllPermissionsManager = useGetAllPermissions;
export const useUpdateRoleManager = useUpdateRole;
export const useGetSingleRoleManager = useGetSingleRole;
export const useGetAllRolesManager = useGetAllRoles;
export const useAddUserToRoleManager = useAddPermissionToRole;
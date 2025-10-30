import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { IRole, Permission, IPermission } from "../types/permission";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// ===== ENHANCED ROLE CONTROLLER (Works with existing backend) =====

/**
 * Enhanced role controller that provides advanced functionality
 * while using your existing backend endpoints
 */

// Get roles with enhanced functionality (uses existing endpoint)
export const useGetRolesEnhanced = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IRole>>({
    queryKey: ["roles-enhanced", page, size, search],
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

// Get permissions grouped by module (simulated from existing data)
export const useGetPermissionsGrouped = ({
  roleId = "",
  enabled = true,
}: { roleId?: string; enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["permissions-grouped", roleId],
    queryFn: async () => {
      try {
        // Use existing permissions endpoint
        const response = await AxiosWithToken.get("/permissions/", {
          params: { size: 1000 }, // Get all permissions
        });

        const permissions = response.data?.data || response.data || [];

        // Group permissions by module (client-side grouping)
        const grouped: { [key: string]: any } = {};

        permissions.forEach((perm: any) => {
          const module = perm.module || 'general';
          if (!grouped[module]) {
            grouped[module] = {
              module,
              permissions: []
            };
          }
          grouped[module].permissions.push(perm);
        });

        // If roleId is provided, mark which permissions are assigned
        if (roleId) {
          try {
            const roleResponse = await AxiosWithToken.get(`/roles/${roleId}/`);
            const rolePermissions = roleResponse.data?.data?.permissions || [];

            // Mark assigned permissions
            Object.values(grouped).forEach((moduleGroup: any) => {
              moduleGroup.permissions.forEach((perm: any) => {
                perm.is_assigned = rolePermissions.some((rp: any) =>
                  rp.permissions?.some((p: any) => p.id === perm.id)
                );
              });
            });
          } catch (error) {
            console.warn("Could not fetch role permissions:", error);
          }
        }

        return Object.values(grouped);
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Enhanced permission assignment (uses existing endpoint with batch processing)
export const useAssignPermissionsToRoleEnhanced = (roleId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { items: string[] }
  >({
    endpoint: `/auth/roles/${roleId}/assign_permission/`,
    queryKey: ["roles", "permissions"],
    isAuth: true,
    method: "POST",
  });

  const assignPermissions = async (permissionIds: number[]) => {
    try {
      // Convert numbers to strings for existing API
      const items = permissionIds.map(id => String(id));
      await callApi({ items });
    } catch (error) {
      console.error("Assign permissions error:", error);
      throw error;
    }
  };

  const assignPermissionsBatch = async (permissionIds: number[]) => {
    try {
      // For now, we'll use the existing single endpoint
      // In future, backend can support batch operations
      const items = permissionIds.map(id => String(id));
      await callApi({ items });
    } catch (error) {
      console.error("Batch assign permissions error:", error);
      throw error;
    }
  };

  return {
    assignPermissions,
    assignPermissionsBatch,
    data,
    isLoading,
    isSuccess,
    error
  };
};

// Simulate user-role functionality (can be enhanced when backend supports it)
export const useGetUsersWithRolesSimulated = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["users-roles-simulated", page, size, search],
    queryFn: async () => {
      try {
        // For now, return mock data structure
        // Replace this when your backend supports user-role endpoints
        return {
          data: {
            results: [
              {
                id: 1,
                email: "admin@mail.com",
                first_name: "Admin",
                last_name: "User",
                department: "IT",
                is_active: true,
                roles: []
              }
            ],
            count: 1,
            next: null,
            previous: null
          }
        };
      } catch (error) {
        console.error("Get users with roles error:", error);
        return { data: { results: [], count: 0 } };
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Bulk operations (simulated for now)
export const useBulkRoleOperationsEnhanced = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error,
    any
  >({
    endpoint: "roles/",
    queryKey: ["roles"],
    isAuth: true,
    method: "DELETE",
  });

  const bulkDeleteRoles = async (roleIds: string[]) => {
    try {
      // For now, delete one by one using existing endpoint
      // Backend can later support bulk operations
      for (const roleId of roleIds) {
        await AxiosWithToken.delete(`/roles/${roleId}/`);
      }
    } catch (error) {
      console.error("Bulk delete roles error:", error);
      throw error;
    }
  };

  const bulkActivateRoles = async (roleIds: string[]) => {
    // Placeholder - implement when backend supports role activation
    console.log("Bulk activate roles:", roleIds);
  };

  const bulkDeactivateRoles = async (roleIds: string[]) => {
    // Placeholder - implement when backend supports role deactivation
    console.log("Bulk deactivate roles:", roleIds);
  };

  return {
    bulkDeleteRoles,
    bulkActivateRoles,
    bulkDeactivateRoles,
    isLoading,
    isSuccess,
    error
  };
};

// Create role with enhanced features (uses existing endpoint)
export const useCreateRoleEnhanced = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IRole,
    Error,
    { name: string; permission_ids?: number[] }
  >({
    endpoint: "roles/",
    queryKey: ["roles"],
    isAuth: true,
    method: "POST",
  });

  const createRole = async (details: { name: string }) => {
    try {
      await callApi({ name: details.name });
    } catch (error) {
      console.error("Role create error:", error);
      throw error;
    }
  };

  const createRoleWithPermissions = async (details: { name: string; permission_ids?: number[] }) => {
    try {
      // Create role first
      const roleResponse = await callApi({ name: details.name });

      // If permissions are provided, assign them
      if (details.permission_ids && details.permission_ids.length > 0 && roleResponse.data) {
        const roleId = roleResponse.data.id;
        const items = details.permission_ids.map(id => String(id));

        // Assign permissions using existing endpoint
        await AxiosWithToken.post(`/auth/roles/${roleId}/assign_permission/`, { items });
      }

      return roleResponse;
    } catch (error) {
      console.error("Create role with permissions error:", error);
      throw error;
    }
  };

  return {
    createRole,
    createRoleWithPermissions,
    data,
    isLoading,
    isSuccess,
    error
  };
};

// Helper function to refresh user permissions (works with existing auth system)
export const useRefreshUserPermissions = () => {
  const refreshPermissions = async () => {
    try {
      // This would call your user profile endpoint to get fresh permissions
      const response = await AxiosWithToken.get("/auth/user/profile/");

      // Update localStorage with fresh user data
      if (response.data?.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));

        // Dispatch event for real-time updates
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('userDataUpdated', {
            detail: response.data.data
          }));
        }
      }

      return response.data?.data;
    } catch (error) {
      console.error("Refresh user permissions error:", error);
      return null;
    }
  };

  return { refreshPermissions };
};
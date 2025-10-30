import useApiManager from "@/constants/mainController";

// ===== ROLE MANAGEMENT TYPES =====

export interface IRole {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: {
    module: string;
    permissions: {
      id: number;
      name: string;
      codename: string;
      description?: string;
    }[];
  }[];
  users_count?: number;
}

export interface IRoleCreateRequest {
  name: string;
  description?: string;
  is_active?: boolean;
  permission_ids?: number[];
}

export interface IRoleUpdateRequest extends Partial<IRoleCreateRequest> {
  id: number;
}

export interface IPermissionModule {
  module: string;
  permissions: {
    id: number;
    name: string;
    codename: string;
    description?: string;
    is_assigned?: boolean;
  }[];
}

export interface IUserRoleAssignment {
  user_id: number;
  role_ids: number[];
}

// ===== ROLE MANAGEMENT HOOKS =====

// Get all roles
export const useGetRoles = () => {
  const { callApi, isLoading, data, error } = useApiManager<IRole[], Error>(
    {
      endpoint: "admin/roles/",
      isAuth: true,
      method: "GET",
      showSuccessToast: false,
    }
  );

  const getRoles = async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    is_active?: boolean;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

      const endpoint = queryParams.toString() ?
        `admin/roles/?${queryParams.toString()}` :
        "admin/roles/";

      return await callApi(undefined, endpoint);
    } catch (error) {
      console.error("Get roles error:", error);
      throw error;
    }
  };

  return { getRoles, data, isLoading, error };
};

// Get single role by ID
export const useGetRole = () => {
  const { callApi, isLoading, data, error } = useApiManager<IRole, Error>(
    {
      endpoint: "admin/roles/",
      isAuth: true,
      method: "GET",
      showSuccessToast: false,
    }
  );

  const getRole = async (roleId: number) => {
    try {
      return await callApi(undefined, `admin/roles/${roleId}/`);
    } catch (error) {
      console.error("Get role error:", error);
      throw error;
    }
  };

  return { getRole, data, isLoading, error };
};

// Create new role
export const useCreateRole = () => {
  const { callApi, isLoading, isSuccess, data, error } = useApiManager<
    IRole,
    Error,
    IRoleCreateRequest
  >({
    endpoint: "admin/roles/",
    isAuth: true,
    method: "POST",
    showSuccessToast: true,
    successMessage: "Role created successfully",
  });

  const createRole = async (roleData: IRoleCreateRequest) => {
    try {
      return await callApi(roleData);
    } catch (error) {
      console.error("Create role error:", error);
      throw error;
    }
  };

  return { createRole, data, isLoading, isSuccess, error };
};

// Update existing role
export const useUpdateRole = () => {
  const { callApi, isLoading, isSuccess, data, error } = useApiManager<
    IRole,
    Error,
    Omit<IRoleUpdateRequest, 'id'>
  >({
    endpoint: "admin/roles/",
    isAuth: true,
    method: "PUT",
    showSuccessToast: true,
    successMessage: "Role updated successfully",
  });

  const updateRole = async (roleData: IRoleUpdateRequest) => {
    try {
      const { id, ...updateData } = roleData;
      return await callApi(updateData, `admin/roles/${id}/`);
    } catch (error) {
      console.error("Update role error:", error);
      throw error;
    }
  };

  return { updateRole, data, isLoading, isSuccess, error };
};

// Delete role
export const useDeleteRole = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error
  >({
    endpoint: "admin/roles/",
    isAuth: true,
    method: "DELETE",
    showSuccessToast: true,
    successMessage: "Role deleted successfully",
  });

  const deleteRole = async (roleId: number) => {
    try {
      return await callApi(undefined, `admin/roles/${roleId}/`);
    } catch (error) {
      console.error("Delete role error:", error);
      throw error;
    }
  };

  return { deleteRole, isLoading, isSuccess, error };
};

// Get all available permissions grouped by module
export const useGetPermissions = () => {
  const { callApi, isLoading, data, error } = useApiManager<IPermissionModule[], Error>(
    {
      endpoint: "admin/permissions/",
      isAuth: true,
      method: "GET",
      showSuccessToast: false,
    }
  );

  const getPermissions = async (roleId?: number) => {
    try {
      const endpoint = roleId ?
        `admin/permissions/?role_id=${roleId}` :
        "admin/permissions/";
      return await callApi(undefined, endpoint);
    } catch (error) {
      console.error("Get permissions error:", error);
      throw error;
    }
  };

  return { getPermissions, data, isLoading, error };
};

// Assign permissions to role
export const useAssignPermissions = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error,
    { permission_ids: number[] }
  >({
    endpoint: "admin/roles/",
    isAuth: true,
    method: "POST",
    showSuccessToast: true,
    successMessage: "Permissions assigned successfully",
  });

  const assignPermissions = async (roleId: number, permissionIds: number[]) => {
    try {
      return await callApi(
        { permission_ids: permissionIds },
        `admin/roles/${roleId}/permissions/`
      );
    } catch (error) {
      console.error("Assign permissions error:", error);
      throw error;
    }
  };

  return { assignPermissions, isLoading, isSuccess, error };
};

// Remove permissions from role
export const useRemovePermissions = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error,
    { permission_ids: number[] }
  >({
    endpoint: "admin/roles/",
    isAuth: true,
    method: "DELETE",
    showSuccessToast: true,
    successMessage: "Permissions removed successfully",
  });

  const removePermissions = async (roleId: number, permissionIds: number[]) => {
    try {
      return await callApi(
        { permission_ids: permissionIds },
        `admin/roles/${roleId}/permissions/`
      );
    } catch (error) {
      console.error("Remove permissions error:", error);
      throw error;
    }
  };

  return { removePermissions, isLoading, isSuccess, error };
};

// Assign users to role
export const useAssignUsersToRole = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error,
    { user_ids: number[] }
  >({
    endpoint: "admin/roles/",
    isAuth: true,
    method: "POST",
    showSuccessToast: true,
    successMessage: "Users assigned to role successfully",
  });

  const assignUsersToRole = async (roleId: number, userIds: number[]) => {
    try {
      return await callApi(
        { user_ids: userIds },
        `admin/roles/${roleId}/users/`
      );
    } catch (error) {
      console.error("Assign users to role error:", error);
      throw error;
    }
  };

  return { assignUsersToRole, isLoading, isSuccess, error };
};

// Assign roles to user
export const useAssignRolesToUser = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error,
    IUserRoleAssignment
  >({
    endpoint: "admin/users/",
    isAuth: true,
    method: "POST",
    showSuccessToast: true,
    successMessage: "Roles assigned to user successfully",
  });

  const assignRolesToUser = async (userId: number, roleIds: number[]) => {
    try {
      return await callApi(
        { user_id: userId, role_ids: roleIds },
        `admin/users/${userId}/roles/`
      );
    } catch (error) {
      console.error("Assign roles to user error:", error);
      throw error;
    }
  };

  return { assignRolesToUser, isLoading, isSuccess, error };
};

// Get users with their roles
export const useGetUsersWithRoles = () => {
  const { callApi, isLoading, data, error } = useApiManager<any[], Error>(
    {
      endpoint: "admin/users/",
      isAuth: true,
      method: "GET",
      showSuccessToast: false,
    }
  );

  const getUsersWithRoles = async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role_id?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.role_id) queryParams.append('role_id', params.role_id.toString());

      const endpoint = queryParams.toString() ?
        `admin/users/roles/?${queryParams.toString()}` :
        "admin/users/roles/";

      return await callApi(undefined, endpoint);
    } catch (error) {
      console.error("Get users with roles error:", error);
      throw error;
    }
  };

  return { getUsersWithRoles, data, isLoading, error };
};

// Bulk role operations
export const useBulkRoleOperations = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    any,
    Error,
    any
  >({
    endpoint: "admin/roles/bulk/",
    isAuth: true,
    method: "POST",
    showSuccessToast: true,
    successMessage: "Bulk operation completed successfully",
  });

  const bulkActivateRoles = async (roleIds: number[]) => {
    try {
      return await callApi({
        action: 'activate',
        role_ids: roleIds
      });
    } catch (error) {
      console.error("Bulk activate roles error:", error);
      throw error;
    }
  };

  const bulkDeactivateRoles = async (roleIds: number[]) => {
    try {
      return await callApi({
        action: 'deactivate',
        role_ids: roleIds
      });
    } catch (error) {
      console.error("Bulk deactivate roles error:", error);
      throw error;
    }
  };

  const bulkDeleteRoles = async (roleIds: number[]) => {
    try {
      return await callApi({
        action: 'delete',
        role_ids: roleIds
      });
    } catch (error) {
      console.error("Bulk delete roles error:", error);
      throw error;
    }
  };

  return {
    bulkActivateRoles,
    bulkDeactivateRoles,
    bulkDeleteRoles,
    isLoading,
    isSuccess,
    error
  };
};

// Legacy exports for backward compatibility
export const useGetRolesMutation = useGetRoles;
export const useCreateRoleMutation = useCreateRole;
export const useUpdateRoleMutation = useUpdateRole;
export const useDeleteRoleMutation = useDeleteRole;
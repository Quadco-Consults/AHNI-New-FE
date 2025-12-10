import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IUser,
  TCreateUserFormValues,
  TUpdateUserFormValues,
} from "../types/user";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// ===== USER HOOKS =====

// Get Current User
export const useGetCurrentUser = () => {
  return useQuery<TResponse<IUser>>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("auth/me/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get All Users (Paginated)
export const useGetAllUsers = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  user_type = "",
  enabled = true,
}: TRequest & { user_type?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IUser>>({
    queryKey: ["users", page, size, search, status, user_type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("users/", {
          params: { page, size, search, status, user_type },
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

// Get Single User
export const useGetSingleUser = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IUser>>({
    queryKey: ["user", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`users/${id}/`);
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

// Get User Profile
export const useGetUserProfile = (enabled: boolean = true) => {
  // Use token as unique identifier to prevent cross-user cache pollution
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return useQuery<TResponse<IUser>>({
    queryKey: ["user-profile", token], // Make query key user-specific
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("users/profile/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!token, // Only enable if we have a token
    refetchOnWindowFocus: false,
  });
};

// Create User
export const useCreateUser = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IUser,
    Error,
    TCreateUserFormValues
  >({
    endpoint: "users/",
    queryKey: ["users"],
    isAuth: true,
    method: "POST",
  });

  const createUser = async (details: TCreateUserFormValues) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("User create error:", error);
      throw error;
    }
  };

  return { createUser, data, isLoading, isSuccess, error };
};

// Update User
export const useUpdateUser = (id: string) => {
  // Create API managers for both JSON and FormData uploads
  const jsonApi = useApiManager<IUser, Error, TUpdateUserFormValues>({
    endpoint: `users/${id}/`,
    queryKey: ["users", "user", "user-profile"],
    isAuth: true,
    method: "PATCH",
    contentType: "application/json",
  });

  const formDataApi = useApiManager<IUser, Error, FormData>({
    endpoint: `users/${id}/`,
    queryKey: ["users", "user", "user-profile"],
    isAuth: true,
    method: "PATCH",
    contentType: null, // This allows multipart/form-data for file uploads
  });

  const updateUser = async (details: TUpdateUserFormValues | FormData) => {
    try {
      // Log the data being sent for debugging
      console.log("🔍 UpdateUser - Data being sent:", {
        dataType: details instanceof FormData ? 'FormData' : 'JSON',
        data: details instanceof FormData ? 'FormData (cannot stringify)' : JSON.stringify(details, null, 2)
      });

      // Use appropriate API manager based on data type
      if (details instanceof FormData) {
        console.log("🔍 UpdateUser - Using FormData API for file upload");
        console.log("🔍 FormData API state:", {
          isLoading: formDataApi.isLoading,
          isSuccess: formDataApi.isSuccess,
          error: formDataApi.error
        });

        // Reset the mutation state if it's in error state
        if (formDataApi.error) {
          console.log("🔄 Resetting FormData API error state before new call");
          formDataApi.mutation.reset();
        }

        await formDataApi.callApi(details);
      } else {
        // Validate that we're not sending empty or malformed JSON
        const jsonString = JSON.stringify(details);
        if (!jsonString || jsonString.trim() === '' || jsonString === 'null' || jsonString === 'undefined') {
          throw new Error('Invalid data: Cannot send empty or malformed JSON');
        }
        console.log("🔍 UpdateUser - Using JSON API for profile update");
        console.log("🔍 JSON API state:", {
          isLoading: jsonApi.isLoading,
          isSuccess: jsonApi.isSuccess,
          error: jsonApi.error
        });
        console.log("🔍 About to call jsonApi.callApi with:", details);

        // Reset the mutation state if it's in error state
        if (jsonApi.error) {
          console.log("🔄 Resetting JSON API error state before new call");
          jsonApi.mutation.reset();
        }

        await jsonApi.callApi(details);
        console.log("🔍 JSON API call completed");
      }
    } catch (error) {
      console.error("User update error:", error);
      throw error;
    }
  };

  // Return combined state from both APIs (prioritize FormData API when active)
  const isLoading = formDataApi.isLoading || jsonApi.isLoading;
  const isSuccess = formDataApi.isSuccess || jsonApi.isSuccess;
  const error = formDataApi.error || jsonApi.error;
  const data = formDataApi.data || jsonApi.data;

  return { updateUser, data, isLoading, isSuccess, error };
};

// Add User to Role
export const useAddUserToRole = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { roles: string[] }
  >({
    endpoint: `users/${id}/roles/`,
    queryKey: ["users"],
    isAuth: true,
    method: "POST",
  });

  const addUserToRole = async (details: { roles: string[] }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Add user to role error:", error);
      throw error;
    }
  };

  return { addUserToRole, data, isLoading, isSuccess, error };
};

// Activate User
export const useActivateUser = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IUser,
    Error,
    Record<string, never>
  >({
    endpoint: `users/${id}/activate/`,
    queryKey: ["users"],
    isAuth: true,
    method: "POST",
  });

  const activateUser = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("User activate error:", error);
    }
  };

  return { activateUser, data, isLoading, isSuccess, error };
};

// Deactivate User
export const useDeactivateUser = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IUser,
    Error,
    Record<string, never>
  >({
    endpoint: `users/${id}/deactivate/`,
    queryKey: ["users"],
    isAuth: true,
    method: "POST",
  });

  const deactivateUser = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("User deactivate error:", error);
    }
  };

  return { deactivateUser, data, isLoading, isSuccess, error };
};

// ===== APPROVAL-SPECIFIC USER HOOKS =====

// Get Users with Review Permission
export const useGetReviewers = ({
  page = 1,
  size = 2000000, // Get all reviewers by default
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<IUser>>({
    queryKey: ["reviewers", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("users/reviewers/", {
          params: { page, size, search },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Users with Authorize Permission
export const useGetAuthorizers = ({
  page = 1,
  size = 2000000, // Get all authorizers by default
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<IUser>>({
    queryKey: ["authorizers", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("users/authorizers/", {
          params: { page, size, search },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Users with Approve Permission
export const useGetApprovers = ({
  page = 1,
  size = 2000000, // Get all approvers by default
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<IUser>>({
    queryKey: ["approvers", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("users/approvers/", {
          params: { page, size, search },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Legacy exports for backward compatibility
export const useGetAllUsersQuery = useGetAllUsers;
export const useGetSingleUserQuery = useGetSingleUser;
export const useLazyGetSingleUserQuery = useGetSingleUser; // Note: lazy queries work differently in TanStack Query
export const useGetUserProfileQuery = useGetUserProfile;
export const useCreateUserMutation = useCreateUser;
export const useUpdateUserMutation = useUpdateUser;
export const useAddUserToRoleMutation = useAddUserToRole;
export const useActivateUserMutation = useActivateUser;
export const useDeactivateUserMutation = useDeactivateUser;

// Missing named exports
export const useAddUserToRoleManager = useAddUserToRole;
export const useGetSingleUserManager = useGetSingleUser;
export const useGetAllUsersManager = useGetAllUsers;

// Approval-specific exports
export const useGetReviewersQuery = useGetReviewers;
export const useGetAuthorizersQuery = useGetAuthorizers;
export const useGetApproversQuery = useGetApprovers;
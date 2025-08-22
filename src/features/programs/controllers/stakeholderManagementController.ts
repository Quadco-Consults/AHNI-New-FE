import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  StakeholderManagementData,
  StakeholderManagementProps,
  StakeholderManagementResponse,
  StakeholderMgtProjectsData,
} from "../types/stakeholder-management";
import { StakeholderManagementSchema, StakeholderMappingSchema } from "definations/program-validator";
import { z } from "zod";

const BASE_URL = "/programs/stakeholder-mgts/";

// ===== STAKEHOLDER MANAGEMENT HOOKS =====

// Get All Stakeholder Managements
export const useGetStakeholderManagements = (enabled: boolean = true) => {
  return useQuery<StakeholderManagementData>({
    queryKey: ["stakeholder-managements"],
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

// Get Stakeholder Management Projects
export const useGetStakeholderMgtProjects = (enabled: boolean = true) => {
  return useQuery<StakeholderMgtProjectsData[]>({
    queryKey: ["stakeholder-mgt-projects"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}project-stakeholders/`);
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

// Get Single Stakeholder Management
export const useGetStakeholderManagement = (id: string, enabled: boolean = true) => {
  return useQuery<StakeholderManagementProps>({
    queryKey: ["stakeholder-management", id],
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

// Create Stakeholder Management
export const useCreateStakeholderManagement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderManagementResponse,
    Error,
    z.infer<typeof StakeholderManagementSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["stakeholder-managements"],
    isAuth: true,
    method: "POST",
  });

  const createStakeholderManagement = async (details: z.infer<typeof StakeholderManagementSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Stakeholder management create error:", error);
    }
  };

  return { createStakeholderManagement, data, isLoading, isSuccess, error };
};

// Create Stakeholder Mapping
export const useCreateStakeholderMapping = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderManagementResponse,
    Error,
    z.infer<typeof StakeholderMappingSchema>
  >({
    endpoint: `${BASE_URL}project-mapping/`,
    queryKey: ["stakeholder-managements"],
    isAuth: true,
    method: "POST",
  });

  const createStakeholderMapping = async (details: z.infer<typeof StakeholderMappingSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Stakeholder mapping create error:", error);
    }
  };

  return { createStakeholderMapping, data, isLoading, isSuccess, error };
};

// Update Stakeholder Management
export const useUpdateStakeholderManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderManagementResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stakeholder-managements"],
    isAuth: true,
    method: "PUT",
  });

  const updateStakeholderManagement = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Stakeholder management update error:", error);
    }
  };

  return { updateStakeholderManagement, data, isLoading, isSuccess, error };
};

// Modify Stakeholder Management (PATCH)
export const useModifyStakeholderManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderManagementResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stakeholder-managements"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyStakeholderManagement = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Stakeholder management modify error:", error);
    }
  };

  return { modifyStakeholderManagement, data, isLoading, isSuccess, error };
};

// Delete Stakeholder Management
export const useDeleteStakeholderManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stakeholder-managements"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteStakeholderManagement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Stakeholder management delete error:", error);
    }
  };

  return { deleteStakeholderManagement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetStakeholderManagementsQuery = useGetStakeholderManagements;
export const useGetStakeholderMgtProjectsQuery = useGetStakeholderMgtProjects;
export const useGetStakeholderManagementQuery = useGetStakeholderManagement;
export const useCreateStakeholderManagementMutation = useCreateStakeholderManagement;
export const useCreateStakeholderMappingMutation = useCreateStakeholderMapping;
export const useUpdateStakeholderManagementMutation = useUpdateStakeholderManagement;
export const useModifyStakeholderManagementMutation = useModifyStakeholderManagement;
export const useDeleteStakeholderManagementMutation = useDeleteStakeholderManagement;
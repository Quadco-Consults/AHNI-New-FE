import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  StakeholderData,
  StakeholderResultsData,
  StakeholderResponse,
} from "../types/stakeholder";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TStakeholderRegisterFormValues } from "definations/program-validator";

const BASE_URL = "/programs/stakeholders/";

// ===== STAKEHOLDER REGISTER HOOKS =====

// Get All Stakeholder Registers
export const useGetAllStakeholderRegister = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<StakeholderResultsData>>({
    queryKey: ["stakeholder-registers", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
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

// Get Single Stakeholder Register
export const useGetSingleStakeholderRegister = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<StakeholderResultsData>>({
    queryKey: ["stakeholder-register", id],
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

// Create Stakeholder Register
export const useCreateStakeholderRegister = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderResultsData,
    Error,
    TStakeholderRegisterFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["stakeholder-registers"],
    isAuth: true,
    method: "POST",
  });

  const createStakeholderRegister = async (details: TStakeholderRegisterFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Stakeholder register create error:", error);
    }
  };

  return { createStakeholderRegister, data, isLoading, isSuccess, error };
};

// Edit Stakeholder Register
export const useEditStakeholderRegister = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderResultsData,
    Error,
    TStakeholderRegisterFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stakeholder-registers", "stakeholder-register"],
    isAuth: true,
    method: "PUT",
  });

  const editStakeholderRegister = async (details: TStakeholderRegisterFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Stakeholder register edit error:", error);
    }
  };

  return { editStakeholderRegister, data, isLoading, isSuccess, error };
};

// Delete Stakeholder Register
export const useDeleteStakeholderRegister = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StakeholderResultsData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stakeholder-registers"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteStakeholderRegister = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Stakeholder register delete error:", error);
    }
  };

  return { deleteStakeholderRegister, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateStakeholderRegisterMutation = useCreateStakeholderRegister;
export const useGetAllStakeholderRegisterQuery = useGetAllStakeholderRegister;
export const useGetSingleStakeholderRegisterQuery = useGetSingleStakeholderRegister;
export const useEditStakeholderRegisterMutation = useEditStakeholderRegister;
export const useDeleteStakeholderRegisterMutation = useDeleteStakeholderRegister;
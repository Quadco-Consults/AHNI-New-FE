import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { PayGroup } from "../types/pay-group";
import { TPaginatedResponse } from "definations/index";

const BASE_URL = "/hr/employee-benefits/pay-groups/";

// ===== PAY GROUP HOOKS =====

// Get All Pay Groups
export const useGetPayGroups = (enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<PayGroup>>({
    queryKey: ["pay-groups"],
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

// Create Pay Group
export const useCreatePayGroup = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PayGroup,
    Error,
    Partial<PayGroup>
  >({
    endpoint: BASE_URL,
    queryKey: ["pay-groups"],
    isAuth: true,
    method: "POST",
  });

  const createPayGroup = async (details: Partial<PayGroup>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Pay group create error:", error);
    }
  };

  return { createPayGroup, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetPayGroupsQuery = useGetPayGroups;
export const useCreatePayGroupMutation = useCreatePayGroup;
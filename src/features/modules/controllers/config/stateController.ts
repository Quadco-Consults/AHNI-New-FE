import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

const BASE_URL = "/config/states/";

// ===== STATE HOOKS =====

// Get States
export const useGetStates = (enabled: boolean = true) => {
  return useQuery<string[]>({
    queryKey: ["states"],
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

// Maintain legacy exports for backward compatibility
export const useGetStatesQuery = useGetStates;
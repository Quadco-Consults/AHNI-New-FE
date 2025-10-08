import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  SolicitationCriteriaResultsData,
} from "../types/solicitation-criteria";
import { TRequest } from "definations/index";

const BASE_URL = "procurements/solicitation-evaluation-criteria/";

// ===== SOLICITATION EVALUATION CRITERIA HOOKS =====

// Get Solicitation Criteria List (for dropdown/selection)
export const useGetSolicitationCriteriaList = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery<SolicitationCriteriaResultsData[]>({
    queryKey: ["solicitation-criteria-list"],
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

// Legacy exports for backward compatibility
export const useGetSolicitationCriteriaListQuery = useGetSolicitationCriteriaList;
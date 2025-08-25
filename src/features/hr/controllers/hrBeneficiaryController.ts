import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { HrBeneficiaryResults } from "../types/hr-beneficiary";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface HrBeneficiaryFilterParams {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/employees/beneficiaries/";

// ===== HR BENEFICIARY HOOKS =====

// Get All HR Beneficiaries
export const useGetHrBeneficiaries = ({
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: HrBeneficiaryFilterParams) => {
  return useQuery<ApiResponse<{ results: HrBeneficiaryResults[] }>>({
    queryKey: ["hr-beneficiaries", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
          },
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

// Get HR Beneficiary List (simplified)
export const useGetHrBeneficiaryList = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<HrBeneficiaryResults[]>>({
    queryKey: ["hr-beneficiary-list"],
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

// Get Single HR Beneficiary
export const useGetHrBeneficiary = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<HrBeneficiaryResults>>({
    queryKey: ["hr-beneficiary", id],
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

// Create HR Beneficiary
export const useCreateHrBeneficiary = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrBeneficiaryResults,
    Error,
    Partial<HrBeneficiaryResults>
  >({
    endpoint: BASE_URL,
    queryKey: ["hr-beneficiaries"],
    isAuth: true,
    method: "POST",
  });

  const createHrBeneficiary = async (details: Partial<HrBeneficiaryResults>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR beneficiary create error:", error);
    }
  };

  return { createHrBeneficiary, data, isLoading, isSuccess, error };
};

// Update HR Beneficiary
export const useUpdateHrBeneficiary = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrBeneficiaryResults,
    Error,
    Partial<HrBeneficiaryResults>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["hr-beneficiaries", "hr-beneficiary"],
    isAuth: true,
    method: "PUT",
  });

  const updateHrBeneficiary = async (details: Partial<HrBeneficiaryResults>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR beneficiary update error:", error);
    }
  };

  return { updateHrBeneficiary, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetHrBeneficiariesQuery = useGetHrBeneficiaries;
export const useGetHrBeneficiaryListQuery = useGetHrBeneficiaryList;
export const useGetHrBeneficiaryQuery = useGetHrBeneficiary;
export const useCreateHrBeneficiaryMutation = useCreateHrBeneficiary;
export const useUpdateHrBeneficiaryMutation = useUpdateHrBeneficiary;
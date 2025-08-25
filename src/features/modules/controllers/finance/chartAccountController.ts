import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  ChartAccountData, 
  ChartAccountFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllChartAccountsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<ChartAccountData>>({
    queryKey: ["chart-accounts", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/charts-of-accounts/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateChartAccountManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ChartAccountData,
    Error,
    ChartAccountFormValues
  >({
    endpoint: "/finance/charts-of-accounts/",
    queryKey: ["chart-accounts"],
    isAuth: true,
    method: "POST",
  });

  const createChartAccount = async (details: ChartAccountFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Chart account creation error:", error);
    }
  };

  return { createChartAccount, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateChartAccountManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ChartAccountData,
    Error,
    ChartAccountFormValues
  >({
    endpoint: "/finance/charts-of-accounts/",
    queryKey: ["chart-accounts"],
    isAuth: true,
    method: "PUT",
  });

  const updateChartAccount = async (id: string, details: ChartAccountFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/charts-of-accounts/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Chart account update error:", error);
      throw error;
    }
  };

  return { updateChartAccount, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteChartAccountManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ChartAccountData,
    Error,
    Record<string, never>
  >({
    endpoint: "/finance/charts-of-accounts/",
    queryKey: ["chart-accounts"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteChartAccount = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/charts-of-accounts/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Chart account delete error:", error);
      throw error;
    }
  };

  return { deleteChartAccount, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllChartAccountsQuery = useGetAllChartAccountsManager;

export const useAddChartAccountMutation = () => {
  const { createChartAccount, data, isLoading, isSuccess, error } = CreateChartAccountManager();
  return [createChartAccount, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateChartAccountMutation = () => {
  const { updateChartAccount, data, isLoading, isSuccess, error } = UpdateChartAccountManager();
  return [
    (params: { id: number; body: ChartAccountFormValues }) => updateChartAccount(params.id.toString(), params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteChartAccountMutation = () => {
  const { deleteChartAccount, data, isLoading, isSuccess, error } = DeleteChartAccountManager();
  return [deleteChartAccount, { data, isLoading, isSuccess, error }] as const;
};
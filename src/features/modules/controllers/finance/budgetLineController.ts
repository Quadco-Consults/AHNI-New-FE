import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  BudgetLineData, 
  BudgetLineFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllBudgetLinesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<BudgetLineData>>({
    queryKey: ["budget-lines", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/budget-lines/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Budget Line
export const useGetSingleBudgetLineManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<BudgetLineData>>({
    queryKey: ["budget-line", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/finance/budget-lines/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateBudgetLineManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    BudgetLineData,
    Error,
    BudgetLineFormValues
  >({
    endpoint: "/finance/budget-lines/",
    queryKey: ["budget-lines"],
    isAuth: true,
    method: "POST",
  });

  const createBudgetLine = async (details: BudgetLineFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Budget line creation error:", error);
    }
  };

  return { createBudgetLine, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateBudgetLineManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    BudgetLineData,
    Error,
    BudgetLineFormValues
  >({
    endpoint: "/finance/budget-lines/",
    queryKey: ["budget-lines", "budget-line"],
    isAuth: true,
    method: "PUT",
  });

  const updateBudgetLine = async (id: string, details: BudgetLineFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/budget-lines/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Budget line update error:", error);
      throw error;
    }
  };

  return { updateBudgetLine, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteBudgetLineManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    BudgetLineData,
    Error,
    Record<string, never>
  >({
    endpoint: "/finance/budget-lines/",
    queryKey: ["budget-lines"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteBudgetLine = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/budget-lines/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Budget line delete error:", error);
      throw error;
    }
  };

  return { deleteBudgetLine, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllBudgetLines = useGetAllBudgetLinesManager;
export const useGetAllBudgetLinesQuery = useGetAllBudgetLinesManager;
export const useGetSingleBudgetLineQuery = useGetSingleBudgetLineManager;

export const useAddBudgetLineMutation = () => {
  const { createBudgetLine, data, isLoading, isSuccess, error } = CreateBudgetLineManager();
  return [createBudgetLine, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateBudgetLineMutation = () => {
  const { updateBudgetLine, data, isLoading, isSuccess, error } = UpdateBudgetLineManager();
  return [
    (params: { id: number; body: BudgetLineFormValues }) => updateBudgetLine(params.id.toString(), params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteBudgetLineMutation = () => {
  const { deleteBudgetLine, data, isLoading, isSuccess, error } = DeleteBudgetLineManager();
  return [deleteBudgetLine, { data, isLoading, isSuccess, error }] as const;
};

// Missing named export
export const useGetSingleBudgetLine = useGetSingleBudgetLineManager;
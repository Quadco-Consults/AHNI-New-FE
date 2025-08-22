import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  CostGroupingData, 
  CostGroupingFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllCostGroupingsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<CostGroupingData>>({
    queryKey: ["cost-groupings", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/cost-groupings/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateCostGroupingManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostGroupingData,
    Error,
    CostGroupingFormValues
  >({
    endpoint: "/finance/cost-groupings/",
    queryKey: ["cost-groupings"],
    isAuth: true,
    method: "POST",
  });

  const createCostGrouping = async (details: CostGroupingFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Cost grouping creation error:", error);
    }
  };

  return { createCostGrouping, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateCostGroupingManager = () => {
  const updateCostGrouping = async (id: string, details: CostGroupingFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/cost-groupings/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Cost grouping update error:", error);
      throw error;
    }
  };

  return { updateCostGrouping };
};

// DELETE Operations (Mutations)
export const DeleteCostGroupingManager = () => {
  const deleteCostGrouping = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/cost-groupings/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Cost grouping delete error:", error);
      throw error;
    }
  };

  return { deleteCostGrouping };
};

// Backward compatibility exports - RTK Query style
export const useGetAllCostGroupingsQuery = useGetAllCostGroupingsManager;

export const useAddCostGroupingMutation = () => {
  const { createCostGrouping, data, isLoading, isSuccess, error } = CreateCostGroupingManager();
  return [createCostGrouping, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateCostGroupingMutation = () => {
  const { updateCostGrouping } = UpdateCostGroupingManager();
  return [
    (params: { id: number; body: CostGroupingFormValues }) => updateCostGrouping(params.id.toString(), params.body),
    { isLoading: false, isSuccess: false, error: null }
  ] as const;
};

export const useDeleteCostGroupingMutation = () => {
  const { deleteCostGrouping } = DeleteCostGroupingManager();
  return [deleteCostGrouping, { isLoading: false, isSuccess: false, error: null }] as const;
};
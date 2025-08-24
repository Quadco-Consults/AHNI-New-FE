import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  CostInputData, 
  CostInputFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

export const useGetAllCostInputsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<CostInputData>>({
    queryKey: ["cost-inputs", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/cost-inputs/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Cost Input
export const useGetSingleCostInputManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<CostInputData>>({
    queryKey: ["cost-input", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/finance/cost-inputs/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const CreateCostInputManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostInputData,
    Error,
    CostInputFormValues
  >({
    endpoint: "/finance/cost-inputs/",
    queryKey: ["cost-inputs"],
    isAuth: true,
    method: "POST",
  });

  const createCostInput = async (details: CostInputFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Cost input creation error:", error);
    }
  };

  return { createCostInput, data, isLoading, isSuccess, error };
};

export const UpdateCostInputManager = () => {
  const updateCostInput = async (id: string, details: CostInputFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/cost-inputs/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Cost input update error:", error);
      throw error;
    }
  };

  return { updateCostInput };
};

export const DeleteCostInputManager = () => {
  const deleteCostInput = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/cost-inputs/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Cost input delete error:", error);
      throw error;
    }
  };

  return { deleteCostInput };
};

// Backward compatibility exports
export const useGetAllCostInputs = useGetAllCostInputsManager;
export const useGetAllCostInputsQuery = useGetAllCostInputsManager;

export const useAddCostInputMutation = () => {
  const { createCostInput, data, isLoading, isSuccess, error } = CreateCostInputManager();
  return [createCostInput, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateCostInputMutation = () => {
  const { updateCostInput } = UpdateCostInputManager();
  return [(params: { id: number; body: CostInputFormValues }) => updateCostInput(params.id.toString(), params.body), { isLoading: false }] as const;
};

export const useDeleteCostInputMutation = () => {
  const { deleteCostInput } = DeleteCostInputManager();
  return [deleteCostInput, { isLoading: false }] as const;
};

// Missing named export
export const useGetSingleCostInput = useGetSingleCostInputManager;
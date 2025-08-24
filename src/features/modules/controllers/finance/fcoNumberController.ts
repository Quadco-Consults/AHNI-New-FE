import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  FCONumberData, 
  FCONumberFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

export const useGetAllFCONumbersManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<FCONumberData>>({
    queryKey: ["fco-numbers", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/fco-numbers/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single FCO Number
export const useGetSingleFCONumberManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<FCONumberData>>({
    queryKey: ["fco-number", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/finance/fco-numbers/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const CreateFCONumberManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FCONumberData,
    Error,
    FCONumberFormValues
  >({
    endpoint: "/finance/fco-numbers/",
    queryKey: ["fco-numbers"],
    isAuth: true,
    method: "POST",
  });

  const createFCONumber = async (details: FCONumberFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("FCO Number creation error:", error);
    }
  };

  return { createFCONumber, data, isLoading, isSuccess, error };
};

export const UpdateFCONumberManager = () => {
  const updateFCONumber = async (id: string, details: FCONumberFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/fco-numbers/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("FCO Number update error:", error);
      throw error;
    }
  };

  return { updateFCONumber };
};

export const DeleteFCONumberManager = () => {
  const deleteFCONumber = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/fco-numbers/${id}/`);
      return response.data;
    } catch (error) {
      console.error("FCO Number delete error:", error);
      throw error;
    }
  };

  return { deleteFCONumber };
};

// Backward compatibility exports
export const useGetAllFCONumbers = useGetAllFCONumbersManager;
export const useGetAllFCONumbersQuery = useGetAllFCONumbersManager;

export const useAddFCONumberMutation = () => {
  const { createFCONumber, data, isLoading, isSuccess, error } = CreateFCONumberManager();
  return [createFCONumber, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateFCONumberMutation = () => {
  const { updateFCONumber } = UpdateFCONumberManager();
  return [(params: { id: number; body: FCONumberFormValues }) => updateFCONumber(params.id.toString(), params.body), { isLoading: false }] as const;
};

export const useDeleteFCONumberMutation = () => {
  const { deleteFCONumber } = DeleteFCONumberManager();
  return [deleteFCONumber, { isLoading: false }] as const;
};

// Missing named export
export const useGetSingleFCONumber = useGetSingleFCONumberManager;
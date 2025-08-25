import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  LotData, 
  LotFormValues 
} from "../../types/procurement";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllLotsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<LotData>>({
    queryKey: ["lots", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/lots/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateLotManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LotData,
    Error,
    LotFormValues
  >({
    endpoint: "/procurements/lots/",
    queryKey: ["lots"],
    isAuth: true,
    method: "POST",
  });

  const createLot = async (details: LotFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Lot creation error:", error);
    }
  };

  return { createLot, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateLotManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LotData,
    Error,
    LotFormValues
  >({
    endpoint: "/procurements/lots/",
    queryKey: ["lots"],
    isAuth: true,
    method: "PATCH",
  });

  const updateLot = async (id: string, details: LotFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/procurements/lots/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Lot update error:", error);
      throw error;
    }
  };

  return { updateLot, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteLotManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LotData,
    Error,
    Record<string, never>
  >({
    endpoint: "/procurements/lots/",
    queryKey: ["lots"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLot = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/procurements/lots/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lot delete error:", error);
      throw error;
    }
  };

  return { deleteLot, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllLotsQuery = useGetAllLotsManager;
export const useGetAllLots = useGetAllLotsManager;

export const useAddLotMutation = () => {
  const { createLot, data, isLoading, isSuccess, error } = CreateLotManager();
  return [createLot, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateLotMutation = () => {
  const { updateLot, data, isLoading, isSuccess, error } = UpdateLotManager();
  return [
    (params: { id: string; body: LotFormValues }) => updateLot(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteLotMutation = () => {
  const { deleteLot, data, isLoading, isSuccess, error } = DeleteLotManager();
  return [deleteLot, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteLot = () => {
  const { deleteLot, data, isLoading, isSuccess, error } = DeleteLotManager();
  return [deleteLot, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports
export const useAddLot = CreateLotManager;
export const useUpdateLot = UpdateLotManager;
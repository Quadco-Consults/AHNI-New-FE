import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  EOIData,
  EOIResponse,
  EOIResultsData,
} from "../types/eoi";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/eoi/";

// ===== EOI HOOKS =====

// Get All EOIs
export const useGetAllEois = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<EOIData>>({
    queryKey: ["eois", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Single EOI
export const useGetSingleEoi = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<EOIResultsData>>({
    queryKey: ["eoi", id],
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

// Create EOI
export const useCreateEoi = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EOIResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["eois"],
    isAuth: true,
    method: "POST",
    contentType: null, // This allows multipart/form-data for file uploads
  });

  const createEoi = async (details: any) => {
    try {
      console.log("Creating EOI with data:", details);
      console.log("Is FormData?", details instanceof FormData);
      if (details instanceof FormData) {
        console.log("FormData entries in controller:");
        for (let [key, value] of details.entries()) {
          console.log(key, value);
        }
      }
      await callApi(details);
    } catch (error) {
      console.error("EOI create error:", error);
    }
  };

  return { createEoi, data, isLoading, isSuccess, error };
};

// Update EOI (Full Update)
export const useUpdateEoi = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EOIResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["eois", "eoi"],
    isAuth: true,
    method: "PUT",
  });

  const updateEoi = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("EOI update error:", error);
    }
  };

  return { updateEoi, data, isLoading, isSuccess, error };
};

// Modify EOI (Partial Update)
export const useModifyEoi = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EOIResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["eois", "eoi"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyEoi = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("EOI modify error:", error);
    }
  };

  return { modifyEoi, data, isLoading, isSuccess, error };
};

// Delete EOI
export const useDeleteEoi = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["eois"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteEoi = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("EOI delete error:", error);
    }
  };

  return { deleteEoi, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetEoisQuery = useGetAllEois;
export const useGetEoiQuery = useGetSingleEoi;
export const useCreateEoiMutation = useCreateEoi;
export const useUpdateEoiMutation = useUpdateEoi;
export const useModifyEoiMutation = useModifyEoi;
export const useDeleteEoiMutation = useDeleteEoi;

// Default API object export
const EoiAPI = {
  useGetAllEois,
  useGetSingleEoi,
  useCreateEoi,
  useUpdateEoi,
  useModifyEoi,
  useDeleteEoi,
  // Legacy naming for component compatibility
  useGetEoi: useGetSingleEoi,
  useGetEois: useGetAllEois,
};

export default EoiAPI;
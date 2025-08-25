import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  SampleMemoResultsData,
  SampleMemoResponse,
} from "../types/sample-memo";
import { TResponse } from "definations/index";

const BASE_URL = "/procurements/purchase-request-memo/";

// ===== PURCHASE SAMPLE REQUEST HOOKS =====

// Get Single Activity Memo
export const useGetActivityMemo = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<SampleMemoResultsData>>({
    queryKey: ["activity-memo", id],
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

// Create Activity Memo
export const useCreateActivityMemo = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SampleMemoResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["activity-memos"],
    isAuth: true,
    method: "POST",
  });

  const createActivityMemo = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity memo create error:", error);
    }
  };

  return { createActivityMemo, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetActivityMemoQuery = useGetActivityMemo;
export const useCreateActivityMemoMutation = useCreateActivityMemo;

// Default export for backward compatibility
const PurchaseRequestAPI = {
  useGetActivityMemo,
  useCreateActivityMemo,
  useGetActivityMemoQuery,
  useCreateActivityMemoMutation,
};

export default PurchaseRequestAPI;
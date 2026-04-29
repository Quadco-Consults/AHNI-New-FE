import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IRFPData,
  RFPResponse,
} from "../types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "procurements/rfps/";

// ===== RFP HOOKS =====

// Get All RFPs
export const useGetAllRFPs = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  tender_type = "",
  enabled = true,
}: TRequest & { tender_type?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IRFPData>>({
    queryKey: ["rfps", page, size, search, status, tender_type],
    queryFn: async () => {
      try {
        const params: any = { page, size, search };
        if (status) params.status = status;
        if (tender_type) params.tender_type = tender_type;

        const response = await AxiosWithToken.get(BASE_URL, { params });
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

// Get Single RFP
export const useGetSingleRFP = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IRFPData>>({
    queryKey: ["rfp", id],
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

// Create RFP
export const useCreateRFP = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPResponse,
    Error,
    Partial<IRFPData>
  >({
    endpoint: BASE_URL,
    queryKey: ["rfps"],
    isAuth: true,
    method: "POST",
  });

  const createRFP = async (details: Partial<IRFPData>) => {
    try {
      console.log("🌐 Creating RFP:", details);
      const res = await callApi(details);
      console.log("✅ RFP Created:", res);
      return res;
    } catch (error) {
      console.error("❌ RFP create error:", error);
      throw error;
    }
  };

  return { createRFP, data, isLoading, isSuccess, error };
};

// Update RFP (Full Update)
export const useUpdateRFP = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPResponse,
    Error,
    Partial<IRFPData>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfps", id],
    isAuth: true,
    method: "PUT",
  });

  const updateRFP = async (details: Partial<IRFPData>) => {
    try {
      console.log("🔄 Updating RFP:", id, details);
      const res = await callApi(details);
      console.log("✅ RFP Updated:", res);
      return res;
    } catch (error) {
      console.error("❌ RFP update error:", error);
      throw error;
    }
  };

  return { updateRFP, data, isLoading, isSuccess, error };
};

// Modify RFP (Partial Update)
export const useModifyRFP = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPResponse,
    Error,
    Partial<IRFPData>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfps", id],
    isAuth: true,
    method: "PATCH",
  });

  const modifyRFP = async (details: Partial<IRFPData>) => {
    try {
      console.log("🔧 Modifying RFP:", id, details);
      const res = await callApi(details);
      console.log("✅ RFP Modified:", res);
      return res;
    } catch (error) {
      console.error("❌ RFP modify error:", error);
      throw error;
    }
  };

  return { modifyRFP, data, isLoading, isSuccess, error };
};

// Publish RFP (DRAFT → PUBLISHED)
export const usePublishRFP = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPResponse,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfps", id],
    isAuth: true,
    method: "PATCH",
  });

  const publishRFP = async () => {
    try {
      console.log("📢 Publishing RFP:", id);
      const res = await callApi({ action: "publish" });
      console.log("✅ RFP Published:", res);
      return res;
    } catch (error) {
      console.error("❌ RFP publish error:", error);
      throw error;
    }
  };

  return { publishRFP, data, isLoading, isSuccess, error };
};

// Close RFP (PUBLISHED → CLOSED)
export const useCloseRFP = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPResponse,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfps", id],
    isAuth: true,
    method: "PATCH",
  });

  const closeRFP = async () => {
    try {
      console.log("🔒 Closing RFP:", id);
      const res = await callApi({ action: "close" });
      console.log("✅ RFP Closed:", res);
      return res;
    } catch (error) {
      console.error("❌ RFP close error:", error);
      throw error;
    }
  };

  return { closeRFP, data, isLoading, isSuccess, error };
};

// Delete RFP
export const useDeleteRFP = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfps"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteRFP = async () => {
    try {
      console.log("🗑️ Deleting RFP:", id);
      await callApi({} as Record<string, never>);
      console.log("✅ RFP Deleted");
    } catch (error) {
      console.error("❌ RFP delete error:", error);
      throw error;
    }
  };

  return { deleteRFP, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllRFPsQuery = useGetAllRFPs;
export const useGetSingleRFPQuery = useGetSingleRFP;
export const useCreateRFPMutation = useCreateRFP;
export const useUpdateRFPMutation = useUpdateRFP;
export const useModifyRFPMutation = useModifyRFP;
export const useDeleteRFPMutation = useDeleteRFP;

// Default export
const RFPController = {
  useGetAllRFPs,
  useGetSingleRFP,
  useCreateRFP,
  useUpdateRFP,
  useModifyRFP,
  usePublishRFP,
  useCloseRFP,
  useDeleteRFP,
  // Legacy
  useGetAllRFPsQuery,
  useGetSingleRFPQuery,
  useCreateRFPMutation,
  useUpdateRFPMutation,
  useModifyRFPMutation,
  useDeleteRFPMutation,
};

export default RFPController;

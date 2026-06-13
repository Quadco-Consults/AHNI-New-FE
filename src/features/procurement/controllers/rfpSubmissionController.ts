import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IRFPVendorSubmission,
  RFPVendorSubmissionResponse,
} from "../types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definitions/index";

const BASE_URL = "procurements/rfp-submissions/";

// ===== RFP VENDOR SUBMISSION HOOKS =====

// Get All Vendor Submissions
export const useGetAllVendorSubmissions = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  rfp_id = "",
  enabled = true,
}: TRequest & { rfp_id?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IRFPVendorSubmission>>({
    queryKey: ["rfp-submissions", page, size, search, status, rfp_id],
    queryFn: async () => {
      try {
        const params: any = { page, size, search };
        if (status) params.status = status;
        if (rfp_id) params.rfp_id = rfp_id;

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

// Get Submissions by RFP ID
export const useGetSubmissionsByRFP = (rfp_id: string, enabled: boolean = true) => {
  return useGetAllVendorSubmissions({
    page: 1,
    size: 100,
    search: "",
    status: "",
    rfp_id,
    enabled: enabled && !!rfp_id,
  });
};

// Get Single Vendor Submission
export const useGetSingleVendorSubmission = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IRFPVendorSubmission>>({
    queryKey: ["rfp-submission", id],
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

// Create Vendor Submission
export const useCreateVendorSubmission = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPVendorSubmissionResponse,
    Error,
    Partial<IRFPVendorSubmission>
  >({
    endpoint: BASE_URL,
    queryKey: ["rfp-submissions"],
    isAuth: true,
    method: "POST",
  });

  const createSubmission = async (details: Partial<IRFPVendorSubmission>) => {
    try {
      console.log("🌐 Creating Vendor Submission:", details);
      const res = await callApi(details);
      console.log("✅ Submission Created:", res);
      return res;
    } catch (error) {
      console.error("❌ Submission create error:", error);
      throw error;
    }
  };

  return { createSubmission, data, isLoading, isSuccess, error };
};

// Update Vendor Submission (Full Update)
export const useUpdateVendorSubmission = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPVendorSubmissionResponse,
    Error,
    Partial<IRFPVendorSubmission>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfp-submissions", id],
    isAuth: true,
    method: "PUT",
  });

  const updateSubmission = async (details: Partial<IRFPVendorSubmission>) => {
    try {
      console.log("🔄 Updating Submission:", id, details);
      const res = await callApi(details);
      console.log("✅ Submission Updated:", res);
      return res;
    } catch (error) {
      console.error("❌ Submission update error:", error);
      throw error;
    }
  };

  return { updateSubmission, data, isLoading, isSuccess, error };
};

// Modify Vendor Submission (Partial Update)
export const useModifyVendorSubmission = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPVendorSubmissionResponse,
    Error,
    Partial<IRFPVendorSubmission>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfp-submissions", id],
    isAuth: true,
    method: "PATCH",
  });

  const modifySubmission = async (details: Partial<IRFPVendorSubmission>) => {
    try {
      console.log("🔧 Modifying Submission:", id, details);
      const res = await callApi(details);
      console.log("✅ Submission Modified:", res);
      return res;
    } catch (error) {
      console.error("❌ Submission modify error:", error);
      throw error;
    }
  };

  return { modifySubmission, data, isLoading, isSuccess, error };
};

// Submit Vendor Submission (DRAFT → SUBMITTED)
export const useSubmitVendorSubmission = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPVendorSubmissionResponse,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["rfp-submissions", id],
    isAuth: true,
    method: "POST",
  });

  const submitSubmission = async () => {
    try {
      console.log("📤 Submitting Vendor Submission:", id);
      const res = await callApi({} as Record<string, never>);
      console.log("✅ Submission Submitted:", res);
      return res;
    } catch (error) {
      console.error("❌ Submission submit error:", error);
      throw error;
    }
  };

  return { submitSubmission, data, isLoading, isSuccess, error };
};

// Accept Vendor Submission (SUBMITTED → ACCEPTED)
export const useAcceptVendorSubmission = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPVendorSubmissionResponse,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfp-submissions", id],
    isAuth: true,
    method: "PATCH",
  });

  const acceptSubmission = async () => {
    try {
      console.log("✅ Accepting Submission:", id);
      const res = await callApi({ action: "accept" });
      console.log("✅ Submission Accepted:", res);
      return res;
    } catch (error) {
      console.error("❌ Submission accept error:", error);
      throw error;
    }
  };

  return { acceptSubmission, data, isLoading, isSuccess, error };
};

// Reject Vendor Submission (SUBMITTED → REJECTED)
export const useRejectVendorSubmission = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFPVendorSubmissionResponse,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfp-submissions", id],
    isAuth: true,
    method: "PATCH",
  });

  const rejectSubmission = async () => {
    try {
      console.log("❌ Rejecting Submission:", id);
      const res = await callApi({ action: "reject" });
      console.log("✅ Submission Rejected:", res);
      return res;
    } catch (error) {
      console.error("❌ Submission reject error:", error);
      throw error;
    }
  };

  return { rejectSubmission, data, isLoading, isSuccess, error };
};

// Delete Vendor Submission (DRAFT only)
export const useDeleteVendorSubmission = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfp-submissions"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSubmission = async () => {
    try {
      console.log("🗑️ Deleting Submission:", id);
      await callApi({} as Record<string, never>);
      console.log("✅ Submission Deleted");
    } catch (error) {
      console.error("❌ Submission delete error:", error);
      throw error;
    }
  };

  return { deleteSubmission, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllVendorSubmissionsQuery = useGetAllVendorSubmissions;
export const useGetSingleVendorSubmissionQuery = useGetSingleVendorSubmission;
export const useCreateVendorSubmissionMutation = useCreateVendorSubmission;
export const useUpdateVendorSubmissionMutation = useUpdateVendorSubmission;
export const useModifyVendorSubmissionMutation = useModifyVendorSubmission;
export const useDeleteVendorSubmissionMutation = useDeleteVendorSubmission;

// Default export
const RFPSubmissionController = {
  useGetAllVendorSubmissions,
  useGetSubmissionsByRFP,
  useGetSingleVendorSubmission,
  useCreateVendorSubmission,
  useUpdateVendorSubmission,
  useModifyVendorSubmission,
  useSubmitVendorSubmission,
  useAcceptVendorSubmission,
  useRejectVendorSubmission,
  useDeleteVendorSubmission,
  // Legacy
  useGetAllVendorSubmissionsQuery,
  useGetSingleVendorSubmissionQuery,
  useCreateVendorSubmissionMutation,
  useUpdateVendorSubmissionMutation,
  useModifyVendorSubmissionMutation,
  useDeleteVendorSubmissionMutation,
};

export default RFPSubmissionController;

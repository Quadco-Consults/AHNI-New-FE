import useApiManager from "@/constants/mainController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

const BASE_URL = "/procurements/purchase-request-memo";

// ===== ACTIVITY MEMO APPROVAL HOOKS =====

// Submit memo for review (DRAFT → PENDING)
export const useSubmitActivityMemo = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}/${id}/submit/`,
    queryKey: ["activity-memos", "activity-memo"],
    isAuth: true,
    method: "POST",
  });

  const submitActivityMemo = async () => {
    try {
      console.log(`Submitting activity memo ${id} for review...`);
      await callApi({} as Record<string, never>);
      return true;
    } catch (error) {
      console.error("Activity memo submit error:", error);
      throw error;
    }
  };

  return { submitActivityMemo, data, isLoading, isSuccess, error };
};

// Review memo (PENDING → REVIEWED)
export const useReviewActivityMemo = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}/${id}/review/`,
    queryKey: ["activity-memos", "activity-memo"],
    isAuth: true,
    method: "POST",
  });

  const reviewActivityMemo = async () => {
    try {
      console.log(`Reviewing activity memo ${id}...`);
      await callApi({} as Record<string, never>);
      return true;
    } catch (error) {
      console.error("Activity memo review error:", error);
      throw error;
    }
  };

  return { reviewActivityMemo, data, isLoading, isSuccess, error };
};

// Approve memo (REVIEWED → APPROVED)
export const useApproveActivityMemo = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}/${id}/approve/`,
    queryKey: ["activity-memos", "activity-memo"],
    isAuth: true,
    method: "POST",
  });

  const approveActivityMemo = async () => {
    try {
      console.log(`Approving activity memo ${id}...`);
      await callApi({} as Record<string, never>);
      return true;
    } catch (error) {
      console.error("Activity memo approve error:", error);
      throw error;
    }
  };

  return { approveActivityMemo, data, isLoading, isSuccess, error };
};

// Reject memo (Any stage → REJECTED)
export const useRejectActivityMemo = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    { reason: string }
  >({
    endpoint: `${BASE_URL}/${id}/reject/`,
    queryKey: ["activity-memos", "activity-memo"],
    isAuth: true,
    method: "POST",
  });

  const rejectActivityMemo = async (reason: string) => {
    try {
      console.log(`Rejecting activity memo ${id} with reason: ${reason}`);
      await callApi({ reason });
      return true;
    } catch (error) {
      console.error("Activity memo reject error:", error);
      throw error;
    }
  };

  return { rejectActivityMemo, data, isLoading, isSuccess, error };
};

// Direct API functions for use in components
export const ActivityMemoApprovalAPI = {
  // Submit memo for review
  submit: async (memoId: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Submitting activity memo ${memoId} for review...`);
      const response = await AxiosWithToken.post(`${BASE_URL}/${memoId}/submit/`);

      console.log(`✅ Submit response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Activity memo submitted successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Submit error:`, error);

      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        (axiosError.response?.data as any)?.detail ||
        (axiosError.response?.data as any)?.error ||
        axiosError.message ||
        "Unknown error occurred";

      throw new Error(`Submit failed: ${errorMessage}`);
    }
  },

  // Review memo
  review: async (memoId: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Reviewing activity memo ${memoId}...`);
      const response = await AxiosWithToken.post(`${BASE_URL}/${memoId}/review/`);

      console.log(`✅ Review response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Activity memo reviewed successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Review error:`, error);

      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        (axiosError.response?.data as any)?.detail ||
        (axiosError.response?.data as any)?.error ||
        axiosError.message ||
        "Unknown error occurred";

      throw new Error(`Review failed: ${errorMessage}`);
    }
  },

  // Approve memo
  approve: async (memoId: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Approving activity memo ${memoId}...`);
      const response = await AxiosWithToken.post(`${BASE_URL}/${memoId}/approve/`);

      console.log(`✅ Approve response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Activity memo approved successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Approve error:`, error);

      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        (axiosError.response?.data as any)?.detail ||
        (axiosError.response?.data as any)?.error ||
        axiosError.message ||
        "Unknown error occurred";

      throw new Error(`Approval failed: ${errorMessage}`);
    }
  },

  // Reject memo
  reject: async (memoId: string, reason: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Rejecting activity memo ${memoId} with reason: ${reason}`);
      const response = await AxiosWithToken.post(`${BASE_URL}/${memoId}/reject/`, {
        reason
      });

      console.log(`✅ Reject response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Activity memo rejected successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Reject error:`, error);

      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        (axiosError.response?.data as any)?.detail ||
        (axiosError.response?.data as any)?.error ||
        axiosError.message ||
        "Unknown error occurred";

      throw new Error(`Rejection failed: ${errorMessage}`);
    }
  }
};
import useApiManager from "@/constants/mainController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

const BASE_URL = "/procurements/purchase-request";

// ===== PURCHASE REQUEST APPROVAL HOOKS =====

// Review purchase request (PENDING → REVIEWED)
export const useReviewPurchaseRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}/${id}/`,
    queryKey: ["purchase-requests", "purchase-request"],
    isAuth: true,
    method: "PATCH",
  });

  const reviewPurchaseRequest = async () => {
    try {
      console.log(`Reviewing purchase request ${id}...`);
      await callApi({ action: "review" });
      return true;
    } catch (error) {
      console.error("Purchase request review error:", error);
      throw error;
    }
  };

  return { reviewPurchaseRequest, data, isLoading, isSuccess, error };
};

// Authorize purchase request (REVIEWED → AUTHORISED)
export const useAuthorizePurchaseRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}/${id}/`,
    queryKey: ["purchase-requests", "purchase-request"],
    isAuth: true,
    method: "PATCH",
  });

  const authorizePurchaseRequest = async () => {
    try {
      console.log(`Authorizing purchase request ${id}...`);
      await callApi({ action: "authorise" });
      return true;
    } catch (error) {
      console.error("Purchase request authorize error:", error);
      throw error;
    }
  };

  return { authorizePurchaseRequest, data, isLoading, isSuccess, error };
};

// Approve purchase request (AUTHORISED → APPROVED)
export const useApprovePurchaseRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    { action: string }
  >({
    endpoint: `${BASE_URL}/${id}/`,
    queryKey: ["purchase-requests", "purchase-request"],
    isAuth: true,
    method: "PATCH",
  });

  const approvePurchaseRequest = async () => {
    try {
      console.log(`Approving purchase request ${id}...`);
      await callApi({ action: "approve" });
      return true;
    } catch (error) {
      console.error("Purchase request approve error:", error);
      throw error;
    }
  };

  return { approvePurchaseRequest, data, isLoading, isSuccess, error };
};

// Direct API functions for use in components
export const PurchaseRequestApprovalAPI = {
  // Review purchase request
  review: async (requestId: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Reviewing purchase request ${requestId}...`);
      const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, {
        action: "review"
      });

      console.log(`✅ Review response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Purchase request reviewed successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Review error:`, error);

      const errorData = axiosError.response?.data as any;
      let errorMessage = errorData?.message || errorData?.detail || errorData?.error || axiosError.message || "Unknown error occurred";

      // Handle specific error cases
      if (errorMessage.includes("Invalid action") || errorMessage.includes("current status")) {
        if (errorMessage.includes("'Reviewed'")) {
          errorMessage = "This purchase request has already been reviewed. No further review action is needed.";
        } else if (errorMessage.includes("'Authorized'")) {
          errorMessage = "This purchase request has already been authorized. Review stage is complete.";
        } else if (errorMessage.includes("'Approved'")) {
          errorMessage = "This purchase request has already been approved. All approval stages are complete.";
        } else {
          errorMessage = `Cannot perform review action: ${errorMessage}`;
        }
      }

      throw new Error(errorMessage);
    }
  },

  // Authorize purchase request
  authorize: async (requestId: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Authorizing purchase request ${requestId}...`);
      const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, {
        action: "authorize"
      });

      console.log(`✅ Authorize response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Purchase request authorized successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Authorize error:`, error);

      const errorData = axiosError.response?.data as any;
      let errorMessage = errorData?.message || errorData?.detail || errorData?.error || axiosError.message || "Unknown error occurred";

      // Handle specific error cases
      if (errorMessage.includes("Invalid action") || errorMessage.includes("current status")) {
        if (errorMessage.includes("'Authorized'") || errorMessage.includes("'Authorised'")) {
          errorMessage = "This purchase request has already been authorized. No further authorization action is needed.";
        } else if (errorMessage.includes("'Approved'")) {
          errorMessage = "This purchase request has already been approved. Authorization stage is complete.";
        } else if (errorMessage.includes("'Pending'") || errorMessage.includes("not reviewed")) {
          errorMessage = "This purchase request must be reviewed before it can be authorized.";
        } else {
          errorMessage = `Cannot perform authorization action: ${errorMessage}`;
        }
      }

      throw new Error(errorMessage);
    }
  },

  // Approve purchase request
  approve: async (requestId: string): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 Approving purchase request ${requestId}...`);
      const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, {
        action: "approve"
      });

      console.log(`✅ Approve response:`, response.data);

      // Handle different response formats
      if (response.data) {
        return {
          status: true,
          message: "Purchase request approved successfully",
          data: response.data
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Approve error:`, error);

      const errorData = axiosError.response?.data as any;
      let errorMessage = errorData?.message || errorData?.detail || errorData?.error || axiosError.message || "Unknown error occurred";

      // Handle specific error cases
      if (errorMessage.includes("Invalid action") || errorMessage.includes("current status")) {
        if (errorMessage.includes("'Approved'")) {
          errorMessage = "This purchase request has already been approved. No further approval action is needed.";
        } else if (errorMessage.includes("'Pending'") || errorMessage.includes("not authorized")) {
          errorMessage = "This purchase request must be authorized before it can be approved.";
        } else if (errorMessage.includes("not reviewed")) {
          errorMessage = "This purchase request must be reviewed and authorized before it can be approved.";
        } else {
          errorMessage = `Cannot perform approval action: ${errorMessage}`;
        }
      }

      throw new Error(errorMessage);
    }
  }
};
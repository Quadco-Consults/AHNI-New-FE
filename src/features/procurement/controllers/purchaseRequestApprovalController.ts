import useApiManager from "@/constants/mainController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

const BASE_URL = "procurements/purchase-request";

// Add new endpoint for approval info
export const getApprovalInfo = async (requestId: string): Promise<any> => {
  try {
    console.log(`🔍 Fetching approval info for request ${requestId}...`);
    const response = await AxiosWithToken.get(`${BASE_URL}/${requestId}/approval_info/`);
    console.log(`✅ Approval info response:`, response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`❌ Error fetching approval info:`, error);

    // If the endpoint doesn't exist, return null to indicate fallback should be used
    if (axiosError.response?.status === 404) {
      console.warn(`⚠️ approval_info endpoint not found for request ${requestId}`);
      return null;
    }
    throw error;
  }
};

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

      // Validate ID is provided
      if (!id || id.trim() === '') {
        throw new Error("Purchase request ID is required for review");
      }

      const action = "review";
      // Validate action is not None or invalid
      if (!action || action === "None" || action === "null" || action === "undefined") {
        throw new Error(`Invalid action value: ${action}. Expected 'review'.`);
      }

      await callApi({ action });
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

      // Validate request ID
      if (!requestId || requestId.trim() === '') {
        throw new Error("Request ID is required");
      }

      const action = "review";

      // Validate action is not None or invalid
      if (!action || action === "None" || action === "null" || action === "undefined") {
        throw new Error(`Invalid action value: ${action}. Expected 'review'.`);
      }

      // Try multiple payload formats to see which one works
      const payload = { action: "review" };
      const payloadString = JSON.stringify({ action: "review" });

      console.log(`📤 Sending review payload to ${BASE_URL}/${requestId}/:`);
      console.log(`📤 Payload object:`, payload);
      console.log(`📤 Payload stringified:`, payloadString);
      console.log(`📤 Action value:`, payload.action, `(type: ${typeof payload.action})`);
      console.log(`📤 Full URL:`, `${BASE_URL}/${requestId}/`);

      console.log(`🌐 About to send PATCH request with JSON object...`);
      // Send as plain object (axios will stringify it)
      const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(err => {
        console.error(`🔥 PATCH request failed immediately:`, err);
        console.error(`🔥 Error response:`, err.response?.data);
        console.error(`🔥 Error status:`, err.response?.status);
        throw err;
      });
      console.log(`🌐 PATCH request completed`);

      console.log(`✅ Review response full:`, response);
      console.log(`✅ Review response.data:`, response.data);
      console.log(`✅ Review response.status:`, response.status);
      console.log(`✅ Review response data type:`, typeof response.data);
      console.log(`✅ Review response data keys:`, Object.keys(response.data || {}));

      // Handle different response formats
      if (response.data) {
        const result = {
          status: true,
          message: "Purchase request reviewed successfully",
          data: response.data
        };
        console.log(`✅ Returning success result:`, result);
        return result;
      }

      console.log(`✅ Returning raw response.data:`, response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Review error:`, error);
      console.error(`❌ Error response status:`, axiosError.response?.status);
      console.error(`❌ Error response headers:`, axiosError.response?.headers);
      console.error(`❌ Error response data (raw):`, axiosError.response?.data);
      console.error(`❌ Error response data (stringified):`, JSON.stringify(axiosError.response?.data, null, 2));
      console.error(`❌ Error config URL:`, axiosError.config?.url);
      console.error(`❌ Error config method:`, axiosError.config?.method);
      console.error(`❌ Error config data:`, axiosError.config?.data);

      const errorData = axiosError.response?.data as any;
      let errorMessage = errorData?.message || errorData?.detail || errorData?.error || axiosError.message || "Unknown error occurred";

      console.error(`❌ Extracted error message:`, errorMessage);

      // Handle specific error cases
      if (errorMessage.includes("Invalid action") || errorMessage.includes("current status")) {
        if (errorMessage.includes("'Reviewed'") || errorMessage.includes("Reviewed")) {
          errorMessage = "This purchase request has already been reviewed. No further review action is needed.";
        } else if (errorMessage.includes("'Authorized'") || errorMessage.includes("Authorized")) {
          errorMessage = "This purchase request has already been authorized. Review stage is complete.";
        } else if (errorMessage.includes("'Approved'") || errorMessage.includes("Approved")) {
          errorMessage = "This purchase request has already been approved. All approval stages are complete.";
        } else if (errorMessage.includes("'None'") || errorMessage.includes("None")) {
          errorMessage = "Invalid action sent to server. Please refresh the page and try again.";
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

      // Validate request ID
      if (!requestId || requestId.trim() === '') {
        throw new Error("Request ID is required");
      }

      const action = "authorise";

      // Validate action is not None or invalid
      if (!action || action === "None" || action === "null" || action === "undefined") {
        throw new Error(`Invalid action value: ${action}. Expected 'authorise'.`);
      }

      const payload = { action };
      console.log(`📤 Sending authorize payload:`, payload);

      const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, payload);

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
        if (errorMessage.includes("'Authorized'") || errorMessage.includes("'Authorised'") || errorMessage.includes("Authorized") || errorMessage.includes("Authorised")) {
          errorMessage = "This purchase request has already been authorized. No further authorization action is needed.";
        } else if (errorMessage.includes("'Approved'") || errorMessage.includes("Approved")) {
          errorMessage = "This purchase request has already been approved. Authorization stage is complete.";
        } else if (errorMessage.includes("'Pending'") || errorMessage.includes("not reviewed") || errorMessage.includes("Pending")) {
          errorMessage = "This purchase request must be reviewed before it can be authorized.";
        } else if (errorMessage.includes("'None'") || errorMessage.includes("None")) {
          errorMessage = "Invalid action sent to server. Please refresh the page and try again.";
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

      // Validate request ID
      if (!requestId || requestId.trim() === '') {
        throw new Error("Request ID is required");
      }

      const action = "approve";

      // Validate action is not None or invalid
      if (!action || action === "None" || action === "null" || action === "undefined") {
        throw new Error(`Invalid action value: ${action}. Expected 'approve'.`);
      }

      const payload = { action };
      console.log(`📤 Sending approve payload:`, payload);

      const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, payload);

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
        if (errorMessage.includes("'Approved'") || errorMessage.includes("Approved")) {
          errorMessage = "This purchase request has already been approved. No further approval action is needed.";
        } else if (errorMessage.includes("'Pending'") || errorMessage.includes("not authorized") || errorMessage.includes("Pending")) {
          errorMessage = "This purchase request must be authorized before it can be approved.";
        } else if (errorMessage.includes("not reviewed")) {
          errorMessage = "This purchase request must be reviewed and authorized before it can be approved.";
        } else if (errorMessage.includes("'None'") || errorMessage.includes("None")) {
          errorMessage = "Invalid action sent to server. Please refresh the page and try again.";
        } else {
          errorMessage = `Cannot perform approval action: ${errorMessage}`;
        }
      }

      throw new Error(errorMessage);
    }
  }
};
// Fallback approval system for when the new API endpoints are not available
import { toast } from "sonner";

export interface FallbackApprovalOptions {
  purchaseRequestId: string;
  currentUser: any;
  modifyPurchaseRequest: (data: any) => Promise<any>;
  onSuccess: () => void;
}

export const fallbackPurchaseRequestApproval = {
  // Fallback review approval
  review: async (options: FallbackApprovalOptions) => {
    const { purchaseRequestId, currentUser, modifyPurchaseRequest, onSuccess } = options;

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentUserId = currentUser?.data?.id;

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const updateData = {
        reviewed_by: currentUserId,
        reviewed_date: currentDate,
        review_status: 'approved'
      };

      console.log("🔄 Fallback review update:", updateData);
      await modifyPurchaseRequest(updateData);

      toast.success("Purchase request reviewed successfully!");
      onSuccess();
      return { status: true, message: "Review completed successfully" };

    } catch (error: any) {
      console.error("❌ Fallback review error:", error);
      const errorMessage = error?.message || "Failed to review purchase request";
      toast.error(`Review failed: ${errorMessage}`);
      throw error;
    }
  },

  // Fallback authorization approval
  authorize: async (options: FallbackApprovalOptions) => {
    const { purchaseRequestId, currentUser, modifyPurchaseRequest, onSuccess } = options;

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentUserId = currentUser?.data?.id;

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const updateData = {
        authorized_by: currentUserId,
        authorized_date: currentDate,
        authorization_status: 'approved'
      };

      console.log("🔄 Fallback authorize update:", updateData);
      await modifyPurchaseRequest(updateData);

      toast.success("Purchase request authorized successfully!");
      onSuccess();
      return { status: true, message: "Authorization completed successfully" };

    } catch (error: any) {
      console.error("❌ Fallback authorize error:", error);
      const errorMessage = error?.message || "Failed to authorize purchase request";
      toast.error(`Authorization failed: ${errorMessage}`);
      throw error;
    }
  },

  // Fallback final approval
  approve: async (options: FallbackApprovalOptions) => {
    const { purchaseRequestId, currentUser, modifyPurchaseRequest, onSuccess } = options;

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentUserId = currentUser?.data?.id;

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const updateData = {
        approved_by: currentUserId,
        approved_date: currentDate,
        approval_status: 'approved',
        status: 'approved' // Update overall status
      };

      console.log("🔄 Fallback approve update:", updateData);
      await modifyPurchaseRequest(updateData);

      toast.success("Purchase request approved successfully!");
      onSuccess();
      return { status: true, message: "Approval completed successfully" };

    } catch (error: any) {
      console.error("❌ Fallback approve error:", error);
      const errorMessage = error?.message || "Failed to approve purchase request";
      toast.error(`Approval failed: ${errorMessage}`);
      throw error;
    }
  }
};

// Helper function to check if the new API endpoints are available
export const checkApiEndpointAvailability = async (endpoint: string): Promise<boolean> => {
  try {
    // This is a simple check - in a real implementation you might want to
    // make a HEAD request or check API documentation
    return true; // Assume endpoints are available for now
  } catch {
    return false;
  }
};

// Enhanced approval function that tries new API first, then falls back
export const performApprovalWithFallback = async (
  action: 'review' | 'authorize' | 'approve',
  options: FallbackApprovalOptions & {
    newApiFunction?: () => Promise<any>;
    fallbackFunction: (options: FallbackApprovalOptions) => Promise<any>;
  }
) => {
  const { newApiFunction, fallbackFunction, ...fallbackOptions } = options;

  // Try the new API first if provided
  if (newApiFunction) {
    try {
      console.log(`🚀 Attempting new API for ${action}...`);
      const result = await newApiFunction();

      if (result && result.status !== false) {
        console.log(`✅ New API ${action} successful:`, result);
        options.onSuccess();
        return result;
      } else {
        throw new Error(result?.message || "New API returned failure status");
      }
    } catch (error: any) {
      console.warn(`⚠️ New API ${action} failed, falling back to legacy method:`, error.message);

      // Fall back to the legacy method
      try {
        return await fallbackFunction(fallbackOptions);
      } catch (fallbackError) {
        console.error(`❌ Fallback ${action} also failed:`, fallbackError);
        throw fallbackError;
      }
    }
  } else {
    // Only use fallback method
    return await fallbackFunction(fallbackOptions);
  }
};
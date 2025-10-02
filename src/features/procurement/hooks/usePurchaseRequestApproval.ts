import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosWithToken from '@/constants/api_management/MyHttpHelperWithToken';
import { ApprovalInfo, ApprovalAction, ApprovalResponse } from '../types/approval';
import { toast } from 'sonner';

const BASE_URL = '/procurements/purchase-request';

// Get auth token - this should match your existing auth system
const getAuthToken = () => {
  // Implement based on your existing auth system
  return localStorage.getItem('authToken') || '';
};

export const usePurchaseRequestApproval = (requestId: number | string) => {
  const queryClient = useQueryClient();

  // Get approval info from the new backend endpoint
  const {
    data: approvalInfo,
    isLoading: isLoadingInfo,
    error: infoError,
    refetch: refetchApprovalInfo
  } = useQuery<ApprovalInfo>({
    queryKey: ['purchase-request-approval', requestId],
    queryFn: async () => {
      try {
        console.log(`🔍 Fetching approval info for request ${requestId}...`);
        const response = await AxiosWithToken.get(`${BASE_URL}/${requestId}/approval_info/`);
        console.log(`✅ Approval info response:`, response.data);

        // Handle different response formats
        if (response.data?.data) {
          return response.data.data;
        }
        return response.data;
      } catch (error: any) {
        console.error(`❌ Error fetching approval info:`, error);

        // If the approval_info endpoint doesn't exist yet, fallback to constructing from purchase request data
        if (error.response?.status === 404) {
          console.warn(`⚠️ approval_info endpoint not found, using fallback logic`);
          return constructApprovalInfoFromPurchaseRequest(requestId);
        }
        throw error;
      }
    },
    enabled: !!requestId,
    staleTime: 30000, // Cache for 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry if it's a 404 (endpoint doesn't exist)
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    }
  });

  // Fallback function to construct approval info from existing purchase request data
  const constructApprovalInfoFromPurchaseRequest = async (requestId: number | string): Promise<ApprovalInfo> => {
    try {
      const response = await AxiosWithToken.get(`${BASE_URL}/${requestId}/`);
      const prData = response.data?.data || response.data;

      return {
        current_status: prData.status as any,
        next_action_required: getNextActionFromStatus(prData.status),
        current_user_permissions: {
          can_review: true, // Default permissions - should be improved
          can_authorize: true,
          can_approve: true,
        },
        memo_approvers: {
          reviewers: [],
          authorizers: [],
          approver: null,
        },
        memo_id: prData.request_memo?.id || null,
      };
    } catch (error) {
      console.error(`❌ Error constructing fallback approval info:`, error);
      throw error;
    }
  };

  // Helper function to determine next action from status
  const getNextActionFromStatus = (status: string): ApprovalAction | null => {
    switch (status) {
      case 'Pending': return 'review';
      case 'Reviewed': return 'authorise';
      case 'Authorised': return 'approve';
      case 'Approved': return null;
      default: return null;
    }
  };

  // Perform approval action using the existing working API
  const approvalMutation = useMutation({
    mutationFn: async (action: ApprovalAction): Promise<ApprovalResponse> => {
      try {
        console.log(`🚀 Performing ${action} action for request ${requestId}...`);

        // Validate action
        if (!action || action === 'None' || action === null || action === undefined) {
          throw new Error(`Invalid action value: "${action}". Expected 'review', 'authorise', or 'approve'.`);
        }

        const payload = { action };
        console.log(`📤 Sending approval payload:`, payload);

        const response = await AxiosWithToken.patch(`${BASE_URL}/${requestId}/`, payload);

        console.log(`✅ ${action} action successful:`, response.data);

        // Handle different response formats
        if (response.data?.detail) {
          return { detail: response.data.detail };
        } else if (response.data?.message) {
          return { detail: response.data.message };
        } else {
          return { detail: `Purchase request ${action}d successfully!` };
        }
      } catch (error: any) {
        console.error(`❌ ${action} action failed:`, error);

        const errorData = error.response?.data;
        let errorMessage = errorData?.detail || errorData?.message || errorData?.error || error.message || 'Unknown error occurred';

        // Handle specific error cases with better messages
        if (errorMessage.includes('Invalid action') || errorMessage.includes('current status')) {
          if (errorMessage.includes('Reviewed')) {
            errorMessage = 'This purchase request has already been reviewed. Use "Authorize" action instead.';
          } else if (errorMessage.includes('Authorised')) {
            errorMessage = 'This purchase request has already been authorized. Use "Approve" action instead.';
          } else if (errorMessage.includes('Approved')) {
            errorMessage = 'This purchase request has already been fully approved.';
          } else if (errorMessage.includes('None')) {
            errorMessage = 'Invalid action sent to server. Please refresh the page and try again.';
          }
        }

        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, action) => {
      toast.success(data.detail || `Purchase request ${action}d successfully!`);

      // Refresh both approval info and purchase request data
      queryClient.invalidateQueries({ queryKey: ['purchase-request-approval', requestId] });
      queryClient.invalidateQueries({ queryKey: ['purchase-request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
    },
    onError: (error: any) => {
      console.error('Approval mutation error:', error);
      toast.error(error.message || 'Approval action failed');
    }
  });

  return {
    // Data
    approvalInfo,
    isLoadingInfo,
    infoError: infoError?.message,

    // Actions
    performApproval: approvalMutation.mutate,
    isPerformingApproval: approvalMutation.isPending,
    approvalError: approvalMutation.error?.message,

    // Utils
    refetchApprovalInfo,

    // Derived state
    canPerformAnyAction: approvalInfo?.next_action_required && (
      (approvalInfo.next_action_required === 'review' && approvalInfo.current_user_permissions.can_review) ||
      (approvalInfo.next_action_required === 'authorise' && approvalInfo.current_user_permissions.can_authorize) ||
      (approvalInfo.next_action_required === 'approve' && approvalInfo.current_user_permissions.can_approve)
    ),

    isWorkflowComplete: approvalInfo?.current_status === 'Approved',
  };
};
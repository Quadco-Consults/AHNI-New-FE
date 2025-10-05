/**
 * Contract Request Approval Workflow Permission Utilities
 *
 * This file contains helper functions to check if a user has permission
 * to perform approval workflow actions based on:
 * - Current contract request status
 * - User assignment (reviewer, authorizer, approver)
 * - Current user ID
 */

import { IContractRequestSingleData } from "../types/contract-management/contract-request";

/**
 * Contract Request Status Constants
 */
export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REVIEWED: 'REVIEWED',
  AUTHORIZED: 'AUTHORIZED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ContractStatus = typeof CONTRACT_STATUS[keyof typeof CONTRACT_STATUS];

/**
 * Check if user can submit a contract request
 * Requirements: Status must be DRAFT
 */
export const canSubmitContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  return contractRequest.status === CONTRACT_STATUS.DRAFT;
};

/**
 * Check if user can review a contract request
 * Requirements:
 * - Status must be SUBMITTED
 * - Current user must be the assigned reviewer
 */
export const canReviewContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  if (contractRequest.status !== CONTRACT_STATUS.SUBMITTED) {
    return false;
  }

  // Check if current user is the assigned reviewer
  if (!currentUserId || !contractRequest.current_reviewer_detail?.id) {
    return false;
  }

  return contractRequest.current_reviewer_detail.id === currentUserId;
};

/**
 * Check if user can complete review of a contract request
 * Requirements:
 * - Status must be UNDER_REVIEW
 * - Current user must be the reviewer OR current_reviewer
 */
export const canCompleteReviewContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  if (contractRequest.status !== CONTRACT_STATUS.UNDER_REVIEW) {
    return false;
  }

  // Check if current user is the assigned reviewer
  if (!currentUserId || !contractRequest.current_reviewer_detail?.id) {
    return false;
  }

  return contractRequest.current_reviewer_detail.id === currentUserId;
};

/**
 * Check if user can authorize a contract request
 * Requirements:
 * - Status must be REVIEWED
 * - Current user must be the assigned authorizer
 */
export const canAuthorizeContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  if (contractRequest.status !== CONTRACT_STATUS.REVIEWED) {
    return false;
  }

  // Check if current user is the assigned authorizer
  if (!currentUserId || !contractRequest.authorizer_detail?.id) {
    return false;
  }

  return contractRequest.authorizer_detail.id === currentUserId;
};

/**
 * Check if user can approve a contract request
 * Requirements:
 * - Status must be AUTHORIZED
 * - Current user must be the assigned approver
 */
export const canApproveContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  if (contractRequest.status !== CONTRACT_STATUS.AUTHORIZED) {
    return false;
  }

  // Check if current user is the assigned approver
  if (!currentUserId || !contractRequest.approver_detail?.id) {
    return false;
  }

  return contractRequest.approver_detail.id === currentUserId;
};

/**
 * Check if user can reject a contract request
 * Requirements:
 * - Status must NOT be APPROVED or REJECTED
 * - User must be involved in the approval workflow (reviewer, authorizer, or approver)
 */
export const canRejectContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  // Cannot reject if already approved or rejected
  if (
    contractRequest.status === CONTRACT_STATUS.APPROVED ||
    contractRequest.status === CONTRACT_STATUS.REJECTED
  ) {
    return false;
  }

  if (!currentUserId) {
    return false;
  }

  // User can reject if they are the reviewer, authorizer, or approver
  const isReviewer = contractRequest.current_reviewer_detail?.id === currentUserId;
  const isAuthorizer = contractRequest.authorizer_detail?.id === currentUserId;
  const isApprover = contractRequest.approver_detail?.id === currentUserId;

  return isReviewer || isAuthorizer || isApprover;
};

/**
 * Get the next available action for a contract request
 * Returns the action that the current user can perform, or null if none
 */
export const getNextAvailableAction = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): 'submit' | 'review' | 'complete_review' | 'authorize' | 'approve' | 'reject' | null => {
  if (canSubmitContractRequest(contractRequest, currentUserId)) {
    return 'submit';
  }
  if (canReviewContractRequest(contractRequest, currentUserId)) {
    return 'review';
  }
  if (canCompleteReviewContractRequest(contractRequest, currentUserId)) {
    return 'complete_review';
  }
  if (canAuthorizeContractRequest(contractRequest, currentUserId)) {
    return 'authorize';
  }
  if (canApproveContractRequest(contractRequest, currentUserId)) {
    return 'approve';
  }
  if (canRejectContractRequest(contractRequest, currentUserId)) {
    return 'reject';
  }
  return null;
};

/**
 * Get user-friendly action label
 */
export const getActionLabel = (
  action: 'submit' | 'review' | 'complete_review' | 'authorize' | 'approve' | 'reject'
): string => {
  const labels = {
    submit: 'Submit for Review',
    review: 'Start Review',
    complete_review: 'Complete Review',
    authorize: 'Authorize',
    approve: 'Approve',
    reject: 'Reject',
  };
  return labels[action];
};

/**
 * Get status badge color for UI
 */
export const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    [CONTRACT_STATUS.DRAFT]: 'gray',
    [CONTRACT_STATUS.SUBMITTED]: 'blue',
    [CONTRACT_STATUS.UNDER_REVIEW]: 'yellow',
    [CONTRACT_STATUS.REVIEWED]: 'purple',
    [CONTRACT_STATUS.AUTHORIZED]: 'indigo',
    [CONTRACT_STATUS.APPROVED]: 'green',
    [CONTRACT_STATUS.REJECTED]: 'red',
  };
  return colors[status] || 'gray';
};

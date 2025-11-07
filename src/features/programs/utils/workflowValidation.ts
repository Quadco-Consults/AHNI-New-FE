import { getCurrentUser } from "@/utils/auth";
import { AnnualPlanStatus, IAnnualSupervisionPlan } from "../types/annual-supervision-plan";

export interface WorkflowValidationResult {
  isValid: boolean;
  message?: string;
  requiresAssignment?: boolean;
  missingAssignments?: string[];
}

export interface WorkflowPermissionResult {
  canPerformAction: boolean;
  message?: string;
  userRole?: string;
}

/**
 * Validates if all required workflow assignments are in place for status transitions
 */
export const validateWorkflowAssignments = (
  plan: IAnnualSupervisionPlan,
  targetStatus: AnnualPlanStatus
): WorkflowValidationResult => {
  const missingAssignments: string[] = [];

  // Full workflow validation with complete backend status support
  switch (targetStatus) {
    case AnnualPlanStatus.UNDER_REVIEW:
      if (!plan.reviewer_id) {
        missingAssignments.push("Reviewer");
      }
      break;

    case AnnualPlanStatus.UNDER_AUTHORIZATION:
      if (!plan.reviewer_id) {
        missingAssignments.push("Reviewer");
      }
      if (!plan.authorizer_id) {
        missingAssignments.push("Authorizer");
      }
      break;

    case AnnualPlanStatus.UNDER_APPROVAL:
      if (!plan.reviewer_id) {
        missingAssignments.push("Reviewer");
      }
      if (!plan.authorizer_id) {
        missingAssignments.push("Authorizer");
      }
      if (!plan.approver_id) {
        missingAssignments.push("Approver");
      }
      break;

    case AnnualPlanStatus.ACTIVE:
      // For activation, all approvals must be complete
      if (plan.status !== AnnualPlanStatus.APPROVED) {
        return {
          isValid: false,
          message: "Plan must be approved before activation",
          requiresAssignment: false
        };
      }
      break;

    default:
      // For other status transitions, no special validation required
      break;
  }

  if (missingAssignments.length > 0) {
    return {
      isValid: false,
      message: `Please assign the following roles before proceeding: ${missingAssignments.join(", ")}`,
      requiresAssignment: true,
      missingAssignments
    };
  }

  return { isValid: true };
};

/**
 * Checks if the current user has permission to perform a specific workflow action
 */
export const checkWorkflowPermission = (
  plan: IAnnualSupervisionPlan,
  action: 'review' | 'authorize' | 'approve' | 'submit'
): WorkflowPermissionResult => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return {
      canPerformAction: false,
      message: "User authentication required"
    };
  }

  const userId = currentUser.id;

  switch (action) {
    case 'review':
      if (plan.status !== AnnualPlanStatus.UNDER_REVIEW) {
        return {
          canPerformAction: false,
          message: "Plan is not in review status"
        };
      }
      if (plan.reviewer_id && plan.reviewer_id !== userId) {
        return {
          canPerformAction: false,
          message: "Only the assigned reviewer can perform this action",
          userRole: 'reviewer'
        };
      }
      break;

    case 'authorize':
      if (plan.status !== AnnualPlanStatus.UNDER_AUTHORIZATION) {
        return {
          canPerformAction: false,
          message: "Plan is not in authorization status"
        };
      }
      if (plan.authorizer_id && plan.authorizer_id !== userId) {
        return {
          canPerformAction: false,
          message: "Only the assigned authorizer can perform this action",
          userRole: 'authorizer'
        };
      }
      break;

    case 'approve':
      if (plan.status !== AnnualPlanStatus.UNDER_APPROVAL) {
        return {
          canPerformAction: false,
          message: "Plan is not in approval status"
        };
      }
      if (plan.approver_id && plan.approver_id !== userId) {
        return {
          canPerformAction: false,
          message: "Only the assigned approver can perform this action",
          userRole: 'approver'
        };
      }
      break;

    case 'submit':
      // Anyone can submit for the next stage (plan creator, admin, etc.)
      // Additional business logic can be added here if needed
      break;

    default:
      return {
        canPerformAction: false,
        message: "Unknown action type"
      };
  }

  return { canPerformAction: true };
};

/**
 * Backend-compatible status mapping
 * Maps frontend enum to backend status values
 */
const getBackendCompatibleStatus = (status: AnnualPlanStatus): string => {
  // Map frontend statuses to exact backend status values
  const statusMap: Record<AnnualPlanStatus, string> = {
    [AnnualPlanStatus.DRAFT]: "DRAFT",
    [AnnualPlanStatus.UPLOADED]: "SUBMITTED", // Backend might use SUBMITTED instead of UPLOADED
    [AnnualPlanStatus.UNDER_REVIEW]: "UNDER_REVIEW",
    [AnnualPlanStatus.REVIEWED]: "REVIEWED",
    [AnnualPlanStatus.UNDER_AUTHORIZATION]: "UNDER_AUTHORIZATION",
    [AnnualPlanStatus.AUTHORIZED]: "AUTHORIZED",
    [AnnualPlanStatus.UNDER_APPROVAL]: "UNDER_APPROVAL",
    [AnnualPlanStatus.APPROVED]: "APPROVED",
    [AnnualPlanStatus.ACTIVE]: "ACTIVE", // Backend now supports ACTIVE!
    [AnnualPlanStatus.COMPLETED]: "COMPLETED"
  };

  return statusMap[status] || status;
};

/**
 * Gets the next logical status based on current status and action
 * Adapted to use only backend-supported status values while maintaining workflow logic
 */
export const getNextWorkflowStatus = (
  currentStatus: AnnualPlanStatus,
  action: 'submit_review' | 'approve_review' | 'reject_review' |
          'submit_authorization' | 'approve_authorization' | 'reject_authorization' |
          'submit_approval' | 'approve_approval' | 'reject_approval' | 'activate'
): string => {

  // Log the attempted transition for debugging
  console.log(`🔄 Workflow transition: ${action} from ${currentStatus}`);

  // Now using the complete backend-supported workflow statuses!
  switch (action) {
    case 'submit_review':
      return "UNDER_REVIEW";

    case 'approve_review':
      // Now backend supports REVIEWED! 🎉
      return "REVIEWED";

    case 'reject_review':
      return "DRAFT";

    case 'submit_authorization':
      return "UNDER_AUTHORIZATION";

    case 'approve_authorization':
      // Now backend supports AUTHORIZED! 🎉
      return "AUTHORIZED";

    case 'reject_authorization':
      return "REVIEWED"; // Back to reviewed status

    case 'submit_approval':
      return "UNDER_APPROVAL";

    case 'approve_approval':
      return "APPROVED";

    case 'reject_approval':
      return "AUTHORIZED"; // Back to authorized status

    case 'activate':
      // Backend now supports ACTIVE! 🎉
      return "ACTIVE";

    default:
      return getBackendCompatibleStatus(currentStatus);
  }
};

/**
 * Validates if a status transition is allowed based on current status
 */
export const isValidStatusTransition = (
  fromStatus: AnnualPlanStatus,
  toStatus: AnnualPlanStatus
): boolean => {
  // Define valid transitions
  const validTransitions: Record<AnnualPlanStatus, AnnualPlanStatus[]> = {
    [AnnualPlanStatus.DRAFT]: [AnnualPlanStatus.UPLOADED, AnnualPlanStatus.UNDER_REVIEW],
    [AnnualPlanStatus.UPLOADED]: [AnnualPlanStatus.UNDER_REVIEW, AnnualPlanStatus.DRAFT],
    [AnnualPlanStatus.UNDER_REVIEW]: [AnnualPlanStatus.REVIEWED, AnnualPlanStatus.DRAFT],
    [AnnualPlanStatus.REVIEWED]: [AnnualPlanStatus.UNDER_AUTHORIZATION, AnnualPlanStatus.UNDER_REVIEW],
    [AnnualPlanStatus.UNDER_AUTHORIZATION]: [AnnualPlanStatus.AUTHORIZED, AnnualPlanStatus.REVIEWED],
    [AnnualPlanStatus.AUTHORIZED]: [AnnualPlanStatus.UNDER_APPROVAL, AnnualPlanStatus.UNDER_AUTHORIZATION],
    [AnnualPlanStatus.UNDER_APPROVAL]: [AnnualPlanStatus.APPROVED, AnnualPlanStatus.AUTHORIZED],
    [AnnualPlanStatus.APPROVED]: [AnnualPlanStatus.ACTIVE],
    [AnnualPlanStatus.ACTIVE]: [AnnualPlanStatus.COMPLETED],
    [AnnualPlanStatus.COMPLETED]: [] // No transitions from completed
  };

  return validTransitions[fromStatus]?.includes(toStatus) || false;
};

/**
 * Gets user-friendly messages for workflow actions
 */
export const getWorkflowActionMessage = (
  action: string,
  planTitle: string,
  validation?: WorkflowValidationResult
): string => {
  if (validation && !validation.isValid) {
    return validation.message || "Action cannot be performed";
  }

  switch (action) {
    case 'submit_review':
      return `Submit "${planTitle}" for review? This will notify the assigned reviewer.`;
    case 'approve_review':
      return `Approve the review for "${planTitle}"? This will move it to the authorization stage.`;
    case 'reject_review':
      return `Reject the review for "${planTitle}"? This will send it back to draft status.`;
    case 'submit_authorization':
      return `Submit "${planTitle}" for authorization? This will notify the assigned authorizer.`;
    case 'approve_authorization':
      return `Authorize "${planTitle}"? This will move it to the approval stage.`;
    case 'reject_authorization':
      return `Reject the authorization for "${planTitle}"? This will send it back to the reviewed status.`;
    case 'submit_approval':
      return `Submit "${planTitle}" for final approval? This will notify the assigned approver.`;
    case 'approve_approval':
      return `Give final approval for "${planTitle}"? This will complete the approval process.`;
    case 'reject_approval':
      return `Reject the final approval for "${planTitle}"? This will send it back to the authorized status.`;
    case 'activate':
      return `Activate "${planTitle}"? This will make it available for site visit creation.`;
    default:
      return `Perform action on "${planTitle}"?`;
  }
};
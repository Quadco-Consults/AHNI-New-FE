// Utility functions for purchase request approval workflow

export type ApprovalStep = 'submitted' | 'review' | 'authorization' | 'approval' | 'completed';
export type ApprovalStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export interface WorkflowStep {
  id: ApprovalStep;
  name: string;
  description: string;
  order: number;
  required: boolean;
}

export interface ApprovalState {
  currentStep: ApprovalStep;
  overallStatus: ApprovalStatus;
  canUserApprove: boolean;
  nextStep?: ApprovalStep;
  progress: number;
}

// Define the standard approval workflow
export const APPROVAL_WORKFLOW: WorkflowStep[] = [
  {
    id: 'submitted',
    name: 'Submitted',
    description: 'Purchase request has been submitted',
    order: 1,
    required: true
  },
  {
    id: 'review',
    name: 'Review',
    description: 'Initial review and validation',
    order: 2,
    required: true
  },
  {
    id: 'authorization',
    name: 'Authorization',
    description: 'Budget and authority verification',
    order: 3,
    required: true
  },
  {
    id: 'approval',
    name: 'Final Approval',
    description: 'Final sign-off and approval',
    order: 4,
    required: true
  },
  {
    id: 'completed',
    name: 'Completed',
    description: 'All approvals completed',
    order: 5,
    required: false
  }
];

/**
 * Determines the current approval state based on purchase request data
 */
export function getApprovalState(purchaseRequestData: any, currentUser: any): ApprovalState {
  const data = purchaseRequestData?.data;

  if (!data) {
    return {
      currentStep: 'submitted',
      overallStatus: 'pending',
      canUserApprove: false,
      progress: 0
    };
  }

  // Check completion status
  if (data.status === 'rejected' || data.approval_status === 'rejected' ||
      data.authorization_status === 'rejected' || data.review_status === 'rejected') {
    return {
      currentStep: 'completed',
      overallStatus: 'rejected',
      canUserApprove: false,
      progress: 100
    };
  }

  if (data.status === 'approved' && data.approved_by && data.approved_date) {
    return {
      currentStep: 'completed',
      overallStatus: 'approved',
      canUserApprove: false,
      progress: 100
    };
  }

  // Determine current step and next actions
  let currentStep: ApprovalStep;
  let nextStep: ApprovalStep | undefined;
  let progress: number;
  let canUserApprove = false;

  if (!data.reviewed_by && !data.reviewed_date) {
    currentStep = 'review';
    nextStep = 'authorization';
    progress = 25;
    canUserApprove = true; // In real implementation, check user roles
  } else if (!data.authorized_by && !data.authorized_date) {
    currentStep = 'authorization';
    nextStep = 'approval';
    progress = 50;
    canUserApprove = true; // In real implementation, check user roles
  } else if (!data.approved_by && !data.approved_date) {
    currentStep = 'approval';
    nextStep = 'completed';
    progress = 75;
    canUserApprove = true; // In real implementation, check user roles
  } else {
    currentStep = 'completed';
    progress = 100;
  }

  return {
    currentStep,
    overallStatus: 'pending',
    canUserApprove,
    nextStep,
    progress
  };
}

/**
 * Gets the next required action for the current user
 */
export function getNextAction(approvalState: ApprovalState): string | null {
  if (!approvalState.canUserApprove || approvalState.overallStatus !== 'pending') {
    return null;
  }

  switch (approvalState.currentStep) {
    case 'review':
      return 'Review and approve this purchase request';
    case 'authorization':
      return 'Authorize the budget and expenditure';
    case 'approval':
      return 'Provide final approval for processing';
    default:
      return null;
  }
}

/**
 * Checks if a user can perform a specific approval action
 */
export function canUserPerformAction(
  purchaseRequestData: any,
  currentUser: any,
  actionType: 'review' | 'authorize' | 'approve'
): boolean {
  const data = purchaseRequestData?.data;
  const userId = currentUser?.data?.id;

  if (!data || !userId) return false;

  // Check if action is already completed
  switch (actionType) {
    case 'review':
      if (data.reviewed_by || data.review_status === 'approved' || data.review_status === 'rejected') {
        return false;
      }
      break;
    case 'authorize':
      if (data.authorized_by || data.authorization_status === 'approved' || data.authorization_status === 'rejected') {
        return false;
      }
      // Can only authorize after review is complete
      if (!data.reviewed_by || data.review_status !== 'approved') {
        return false;
      }
      break;
    case 'approve':
      if (data.approved_by || data.approval_status === 'approved' || data.approval_status === 'rejected') {
        return false;
      }
      // Can only approve after authorization is complete
      if (!data.authorized_by || data.authorization_status !== 'approved') {
        return false;
      }
      break;
  }

  // In a real implementation, you would check user roles and permissions here
  // For now, we'll allow any authenticated user to perform any action
  return true;
}

/**
 * Gets time-based alerts for overdue requests
 */
export function getTimeBasedAlerts(purchaseRequestData: any): string[] {
  const alerts: string[] = [];
  const data = purchaseRequestData?.data;

  if (!data) return alerts;

  const createdDate = new Date(data.created_at || data.requested_date);
  const now = new Date();
  const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  // Check for overdue conditions
  if (daysSinceCreated > 7 && data.status !== 'approved' && data.status !== 'rejected') {
    alerts.push(`This request has been pending for ${daysSinceCreated} days`);
  }

  if (!data.reviewed_by && daysSinceCreated > 3) {
    alerts.push('Review is overdue (3+ days since submission)');
  }

  if (data.reviewed_by && !data.authorized_by && daysSinceCreated > 5) {
    alerts.push('Authorization is overdue (pending since review completion)');
  }

  if (data.authorized_by && !data.approved_by && daysSinceCreated > 7) {
    alerts.push('Final approval is overdue (pending since authorization)');
  }

  return alerts;
}

/**
 * Calculates approval workflow statistics
 */
export function getWorkflowStats(purchaseRequestData: any): {
  totalSteps: number;
  completedSteps: number;
  currentStepIndex: number;
  estimatedCompletion: string;
} {
  const data = purchaseRequestData?.data;
  const totalSteps = APPROVAL_WORKFLOW.filter(step => step.required).length;

  if (!data) {
    return {
      totalSteps,
      completedSteps: 0,
      currentStepIndex: 0,
      estimatedCompletion: 'Unknown'
    };
  }

  let completedSteps = 1; // Submitted is always completed
  let currentStepIndex = 1;

  if (data.reviewed_by) {
    completedSteps++;
    currentStepIndex = 2;
  }
  if (data.authorized_by) {
    completedSteps++;
    currentStepIndex = 3;
  }
  if (data.approved_by) {
    completedSteps++;
    currentStepIndex = 4;
  }

  // Estimate completion time based on average processing times
  const remainingSteps = totalSteps - completedSteps;
  const avgDaysPerStep = 2; // Configurable business rule
  const estimatedDays = remainingSteps * avgDaysPerStep;

  const estimatedCompletion = estimatedDays === 0
    ? 'Completed'
    : `${estimatedDays} days`;

  return {
    totalSteps,
    completedSteps,
    currentStepIndex,
    estimatedCompletion
  };
}
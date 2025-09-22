"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, AlertTriangle } from "lucide-react";
import { useModifyPurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { PurchaseRequestApprovalAPI } from "@/features/procurement/controllers/purchaseRequestApprovalController";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";
import { fallbackPurchaseRequestApproval, performApprovalWithFallback } from "@/features/procurement/utils/approvalFallback";
import {
  getApprovalState,
  getNextAction,
  getTimeBasedAlerts,
  getWorkflowStats,
  canUserPerformAction,
  APPROVAL_WORKFLOW
} from "../../utils/approvalWorkflowUtils";

interface ApprovalStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  assigneeField: string;
  dateField: string;
  statusField: string;
  order: number;
}

interface ApprovalWorkflowProps {
  purchaseRequestData: any;
  activityMemoData?: any;
  currentUser: any;
  purchaseRequestId: string;
  onStatusUpdate: () => void;
}

const ApprovalWorkflow = ({
  purchaseRequestData,
  activityMemoData,
  currentUser,
  purchaseRequestId,
  onStatusUpdate
}: ApprovalWorkflowProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  const { modifyPurchaseRequest, isLoading: isModifying } = useModifyPurchaseRequest(purchaseRequestId);

  // Define the approval workflow steps
  const approvalSteps: ApprovalStep[] = [
    // Activity Memo approval (if exists)
    ...(activityMemoData?.data ? [{
      id: 'activity_memo',
      title: 'Activity Memo Approval',
      description: 'Approve the activity memo before proceeding with purchase request',
      status: getActivityMemoStatus(),
      assigneeField: 'memo_approved_by',
      dateField: 'memo_approved_date',
      statusField: 'memo_status',
      order: 1
    } as ApprovalStep] : []),
    {
      id: 'review',
      title: 'Purchase Request Review',
      description: 'Initial review and validation of the purchase request',
      status: getStepStatus('review'),
      assigneeField: 'reviewed_by',
      dateField: 'reviewed_date',
      statusField: 'review_status',
      order: activityMemoData?.data ? 2 : 1
    },
    {
      id: 'authorization',
      title: 'Authorization',
      description: 'Budget and authority verification',
      status: getStepStatus('authorization'),
      assigneeField: 'authorized_by',
      dateField: 'authorized_date',
      statusField: 'authorization_status',
      order: activityMemoData?.data ? 3 : 2
    },
    {
      id: 'approval',
      title: 'Final Approval',
      description: 'Final sign-off and approval for processing',
      status: getStepStatus('approval'),
      assigneeField: 'approved_by',
      dateField: 'approved_date',
      statusField: 'approval_status',
      order: activityMemoData?.data ? 4 : 3
    }
  ];

  // Function to get activity memo status
  function getActivityMemoStatus(): 'pending' | 'approved' | 'rejected' | 'in_progress' {
    const memoData = activityMemoData?.data;
    if (!memoData) return 'pending';

    const memoStatus = memoData.status?.toLowerCase();

    if (memoStatus === 'approved') return 'approved';
    if (memoStatus === 'rejected') return 'rejected';
    if (memoStatus === 'pending' || memoStatus === 'draft') return 'pending';
    if (memoStatus === 'under_review' || memoStatus === 'reviewed') return 'in_progress';

    return 'pending';
  }

  function getStepStatus(stepType: string): 'pending' | 'approved' | 'rejected' | 'in_progress' {
    const data = purchaseRequestData?.data;
    if (!data) return 'pending';

    // Check the main status field for overall status indicators
    const mainStatus = data.status?.toLowerCase();

    switch (stepType) {
      case 'review':
        // Check if already reviewed based on main status or specific fields
        if (data.review_status === 'rejected' || mainStatus === 'rejected') return 'rejected';
        // If the whole request is approved, all steps are complete
        if (mainStatus === 'approved') return 'approved';
        if (data.reviewed_by && data.reviewed_date) return 'approved';
        if (mainStatus === 'reviewed' || mainStatus === 'under_review' || mainStatus === 'authorized' || mainStatus === 'authorised') return 'approved';
        if (data.review_status === 'in_progress') return 'in_progress';
        return 'pending';

      case 'authorization':
        if (data.authorization_status === 'rejected') return 'rejected';
        // If the whole request is approved, all steps are complete
        if (mainStatus === 'approved') return 'approved';
        if (data.authorized_by && data.authorized_date) return 'approved';
        // Handle both American and British spelling
        if (mainStatus === 'authorized' || mainStatus === 'authorised') return 'approved';
        if (data.authorization_status === 'in_progress') return 'in_progress';
        // Only available after review
        const reviewCompleted = data.reviewed_by || mainStatus === 'reviewed' || mainStatus === 'under_review';
        return reviewCompleted ? 'pending' : 'pending';

      case 'approval':
        if (data.approval_status === 'rejected') return 'rejected';
        if (data.approved_by && data.approved_date) return 'approved';
        if (mainStatus === 'approved') return 'approved';
        if (data.approval_status === 'in_progress') return 'in_progress';
        // Only available after authorization (handle both spellings)
        const authCompleted = data.authorized_by || mainStatus === 'authorized' || mainStatus === 'authorised';
        return authCompleted ? 'pending' : 'pending';

      default:
        return 'pending';
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'pending': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      'approved': 'Approved',
      'rejected': 'Rejected',
      'in_progress': 'In Progress',
      'pending': 'Pending'
    };

    return (
      <Badge className={`px-2 py-1 text-xs font-medium rounded-full border ${variants[status as keyof typeof variants]}`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const canUserActOnStep = (step: ApprovalStep): boolean => {
    const data = purchaseRequestData?.data;
    if (!data || !currentUser?.data?.id) return false;

    // Check if step is available for action
    if (step.status === 'approved' || step.status === 'rejected') return false;

    // Check workflow order - can only act on current step
    const previousStep = approvalSteps.find(s => s.order === step.order - 1);
    if (previousStep && previousStep.status !== 'approved') return false;

    // Additional check: don't allow actions if the main status indicates this step is already done
    const mainStatus = data.status?.toLowerCase();
    if (step.id === 'review' && (mainStatus === 'reviewed' || mainStatus === 'under_review' || mainStatus === 'authorized' || mainStatus === 'authorised' || mainStatus === 'approved')) {
      return false;
    }
    if (step.id === 'authorization' && (mainStatus === 'authorized' || mainStatus === 'authorised' || mainStatus === 'approved')) {
      return false;
    }
    if (step.id === 'approval' && mainStatus === 'approved') {
      return false;
    }

    // For now, any authenticated user can act on any step
    // In a real system, you'd check user roles/permissions here
    return true;
  };

  const handleStepAction = async (step: ApprovalStep, action: 'approve' | 'reject') => {
    if (!currentUser?.data?.id) {
      toast.error("User not authenticated");
      return;
    }

    // Double-check if action should be allowed
    const data = purchaseRequestData?.data;
    if (!canUserActOnStep(step)) {
      const friendlyMessage = data?.status?.toLowerCase() === 'approved'
        ? `This purchase request has been fully approved. No further actions are needed.`
        : `Cannot ${action} this step. The purchase request status is "${data?.status}".`;
      toast.error(friendlyMessage);
      return;
    }

    setIsProcessing(true);
    setProcessingStep(step.id);

    try {
      if (action === 'approve') {
        // Use the enhanced approval system with fallback
        const fallbackOptions = {
          purchaseRequestId,
          currentUser,
          modifyPurchaseRequest,
          onSuccess: onStatusUpdate
        };

        switch (step.id) {
          case 'activity_memo':
            // Handle activity memo approval
            if (activityMemoData?.data?.id) {
              try {
                const result = await ActivityMemoApprovalAPI.approve(activityMemoData.data.id);
                toast.success("Activity memo approved successfully!");
                onStatusUpdate();
              } catch (error: any) {
                toast.error(`Failed to approve activity memo: ${error.message || 'Unknown error'}`);
              }
            } else {
              toast.error("No activity memo found to approve");
            }
            break;
          case 'review':
            await performApprovalWithFallback('review', {
              ...fallbackOptions,
              newApiFunction: () => PurchaseRequestApprovalAPI.review(purchaseRequestId),
              fallbackFunction: fallbackPurchaseRequestApproval.review
            });
            break;
          case 'authorization':
            await performApprovalWithFallback('authorize', {
              ...fallbackOptions,
              newApiFunction: () => PurchaseRequestApprovalAPI.authorize(purchaseRequestId),
              fallbackFunction: fallbackPurchaseRequestApproval.authorize
            });
            break;
          case 'approval':
            await performApprovalWithFallback('approve', {
              ...fallbackOptions,
              newApiFunction: () => PurchaseRequestApprovalAPI.approve(purchaseRequestId),
              fallbackFunction: fallbackPurchaseRequestApproval.approve
            });
            break;
          default:
            throw new Error('Unknown approval step');
        }

        // Success message is handled by the fallback system

      } else {
        // Handle rejection based on step type
        if (step.id === 'activity_memo') {
          // Handle activity memo rejection
          if (activityMemoData?.data?.id) {
            try {
              const result = await ActivityMemoApprovalAPI.reject(activityMemoData.data.id, "Rejected by user");
              toast.success("Activity memo rejected!");
              onStatusUpdate();
            } catch (error: any) {
              toast.error(`Failed to reject activity memo: ${error.message || 'Unknown error'}`);
            }
          } else {
            toast.error("No activity memo found to reject");
          }
        } else {
          // For purchase request rejection, use the legacy approach
          const currentDate = new Date().toISOString().split('T')[0];
          const currentUserId = currentUser.data.id;

          let updateData: any = {};
          updateData[step.assigneeField] = currentUserId;
          updateData[step.dateField] = currentDate;
          updateData[step.statusField] = 'rejected';
          updateData.status = 'rejected';

          console.log("Sending rejection update:", updateData);
          await modifyPurchaseRequest(updateData);

          toast.success(`Purchase request rejected at ${step.title} stage!`);

          // Call the callback to refresh data
          onStatusUpdate();
        }
      }

    } catch (error: any) {
      console.error("Approval error:", error);
      // Error message is handled by the fallback system or toast.error above
      if (action === 'reject') {
        toast.error(`Failed to ${action} at ${step.title} stage: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const getAssigneeName = (step: ApprovalStep): string => {
    const data = purchaseRequestData?.data;
    if (!data) return 'N/A';

    const assignee = data[step.assigneeField];
    if (!assignee) return 'Not assigned';

    if (typeof assignee === 'object' && assignee.first_name && assignee.last_name) {
      return `${assignee.first_name} ${assignee.last_name}`;
    }

    return assignee.name || assignee.toString() || 'N/A';
  };

  const getStepDate = (step: ApprovalStep): string => {
    const data = purchaseRequestData?.data;
    return data?.[step.dateField] || 'N/A';
  };

  const isStepActive = (step: ApprovalStep): boolean => {
    const previousStep = approvalSteps.find(s => s.order === step.order - 1);
    if (!previousStep) return step.order === 1; // First step is always potentially active
    return previousStep.status === 'approved' && step.status === 'pending';
  };

  // Get enhanced workflow information
  const approvalState = getApprovalState(purchaseRequestData, currentUser);
  const nextAction = getNextAction(approvalState);
  const timeAlerts = getTimeBasedAlerts(purchaseRequestData);
  const workflowStats = getWorkflowStats(purchaseRequestData);

  // Check if the entire workflow is complete
  const isWorkflowComplete = purchaseRequestData?.data?.status?.toLowerCase() === 'approved';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
        <div className="text-sm text-gray-500">
          Request ID: {purchaseRequestData?.data?.ref_number || purchaseRequestId}
        </div>
      </div>

      {/* Show completion banner if workflow is done */}
      {isWorkflowComplete && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Workflow Complete
              </p>
              <p className="text-sm text-green-700 mt-1">
                This purchase request has been fully approved and all workflow steps are complete.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${approvalState.progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress: {workflowStats.completedSteps}/{workflowStats.totalSteps} steps</span>
        <span>Est. completion: {workflowStats.estimatedCompletion}</span>
      </div>

      {/* Time-based Alerts */}
      {timeAlerts.length > 0 && (
        <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Attention Required</h4>
              <ul className="mt-2 text-sm text-orange-700 space-y-1">
                {timeAlerts.map((alert, index) => (
                  <li key={index}>• {alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Next Action */}
      {nextAction && (
        <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="font-medium text-blue-800">Action Required</h4>
              <p className="text-sm text-blue-700 mt-1">{nextAction}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {approvalSteps.map((step, index) => (
          <Card key={step.id} className={`p-4 border-l-4 ${
            isStepActive(step) ? 'border-l-blue-500 bg-blue-50' :
            step.status === 'approved' ? 'border-l-green-500 bg-green-50' :
            step.status === 'rejected' ? 'border-l-red-500 bg-red-50' :
            'border-l-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {step.order}. {step.title}
                    </h4>
                    {getStatusBadge(step.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Assignee:</span>
                      <span className="font-medium">{getAssigneeName(step)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{getStepDate(step)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{step.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {canUserActOnStep(step) && step.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  <Button
                    onClick={() => handleStepAction(step, 'approve')}
                    disabled={isProcessing || isModifying}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingStep === step.id && isProcessing ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleStepAction(step, 'reject')}
                    disabled={isProcessing || isModifying}
                    size="sm"
                    variant="destructive"
                  >
                    {processingStep === step.id && isProcessing ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>

            {/* Show connection line to next step */}
            {index < approvalSteps.length - 1 && (
              <div className="ml-6 mt-4 border-l-2 border-gray-200 h-6"></div>
            )}
          </Card>
        ))}
      </div>

      {/* Overall Status Summary */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Overall Status</h4>
            <p className="text-sm text-gray-600 mt-1">
              Current stage: {
                approvalSteps.find(s => isStepActive(s))?.title ||
                (purchaseRequestData?.data?.status === 'approved' ? 'Completed' : 'Pending')
              }
            </p>
          </div>
          <div className="text-right">
            {getStatusBadge(
              purchaseRequestData?.data?.status === 'approved' ? 'approved' :
              purchaseRequestData?.data?.status === 'rejected' ? 'rejected' :
              approvalSteps.some(s => s.status === 'in_progress') ? 'in_progress' : 'pending'
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApprovalWorkflow;
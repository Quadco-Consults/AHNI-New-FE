"use client";

import React from 'react';
import { AlertCircle, CheckCircle, Clock, User, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { Card } from 'components/ui/card';
import { usePurchaseRequestApproval } from '../../hooks/usePurchaseRequestApproval';
import { ApprovalInfo, User as ApprovalUser, ApprovalAction } from '../../types/approval';

interface ApprovalFlowProps {
  requestId: number | string;
  currentUser: any; // Use your existing user type
  onStatusUpdate?: () => void;
  urgentAlert?: {
    daysPending: number;
    daysOverdue: number;
    message: string;
  };
}

interface ApprovalTimelineProps {
  approvalInfo: ApprovalInfo;
}

// Timeline component showing approval steps
const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ approvalInfo }) => {
  const steps = [
    {
      name: 'Review',
      status: 'Pending',
      approvers: approvalInfo.memo_approvers.reviewers,
      completed: ['Reviewed', 'Authorised', 'Approved'].includes(approvalInfo.current_status),
      current: approvalInfo.current_status === 'Pending'
    },
    {
      name: 'Authorize',
      status: 'Reviewed',
      approvers: approvalInfo.memo_approvers.authorizers,
      completed: ['Authorised', 'Approved'].includes(approvalInfo.current_status),
      current: approvalInfo.current_status === 'Reviewed'
    },
    {
      name: 'Approve',
      status: 'Authorised',
      approvers: approvalInfo.memo_approvers.approver ? [approvalInfo.memo_approvers.approver] : [],
      completed: approvalInfo.current_status === 'Approved',
      current: approvalInfo.current_status === 'Authorised'
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Approval Steps</h4>

      {steps.map((step, index) => (
        <div key={step.name} className="flex items-start">
          <div className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${step.completed
                ? 'bg-green-500 text-white'
                : step.current
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }
            `}>
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : step.current ? (
                <Clock className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className={`
                w-px h-8 mt-2
                ${step.completed ? 'bg-green-300' : 'bg-gray-200'}
              `} />
            )}
          </div>

          <div className="ml-4 flex-1">
            <div className="font-medium text-gray-900">{step.name}</div>
            <div className="text-sm text-gray-500">
              {step.approvers.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {step.approvers.map((approver) => (
                    <span
                      key={approver.id}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      <User className="w-3 h-3 mr-1" />
                      {approver.first_name} {approver.last_name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">Any authorized user</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ApprovalFlow: React.FC<ApprovalFlowProps> = ({
  requestId,
  currentUser,
  onStatusUpdate,
  urgentAlert
}) => {
  const {
    approvalInfo,
    isLoadingInfo,
    performApproval,
    isPerformingApproval,
    approvalError,
    canPerformAnyAction,
    isWorkflowComplete,
    refetchApprovalInfo
  } = usePurchaseRequestApproval(requestId);

  // Handle status updates
  const handleStatusUpdate = () => {
    refetchApprovalInfo();
    onStatusUpdate?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Authorised': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionButton = () => {
    if (!approvalInfo) return null;

    const { current_user_permissions, next_action_required } = approvalInfo;

    if (isWorkflowComplete) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          Fully Approved
        </div>
      );
    }

    if (!next_action_required) {
      return (
        <div className="flex items-center text-gray-500">
          <Clock className="w-5 h-5 mr-2" />
          Workflow Complete
        </div>
      );
    }

    const canPerformAction =
      (next_action_required === 'review' && current_user_permissions.can_review) ||
      (next_action_required === 'authorise' && current_user_permissions.can_authorize) ||
      (next_action_required === 'approve' && current_user_permissions.can_approve);

    if (!canPerformAction) {
      return (
        <div className="flex items-center text-gray-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          Waiting for {getApproverList(next_action_required)}
        </div>
      );
    }

    return (
      <Button
        onClick={() => {
          performApproval(next_action_required, {
            onSuccess: handleStatusUpdate
          });
        }}
        disabled={isPerformingApproval}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isPerformingApproval ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            {next_action_required === 'review' && 'Review'}
            {next_action_required === 'authorise' && 'Authorize'}
            {next_action_required === 'approve' && 'Approve'}
          </>
        )}
      </Button>
    );
  };

  const getApproverList = (action: string) => {
    if (!approvalInfo) return 'authorized users';

    const { memo_approvers } = approvalInfo;

    switch (action) {
      case 'review':
        return memo_approvers.reviewers.length > 0
          ? memo_approvers.reviewers.map(u => `${u.first_name} ${u.last_name}`).join(', ')
          : 'any authorized user';
      case 'authorise':
        return memo_approvers.authorizers.length > 0
          ? memo_approvers.authorizers.map(u => `${u.first_name} ${u.last_name}`).join(', ')
          : 'any authorized user';
      case 'approve':
        return memo_approvers.approver
          ? `${memo_approvers.approver.first_name} ${memo_approvers.approver.last_name}`
          : 'any authorized user';
      default:
        return 'authorized users';
    }
  };

  if (isLoadingInfo) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!approvalInfo) {
    return (
      <Card className="p-6">
        <div className="flex items-center text-red-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          Failed to load approval information
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Urgent Alert Banner */}
      {urgentAlert && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold">Urgent: Approval Overdue</h4>
              <p className="text-red-700 text-sm mt-1">{urgentAlert.message}</p>
              <div className="flex items-center mt-2 space-x-4 text-xs text-red-600">
                <span>• Pending: {urgentAlert.daysPending} days</span>
                <span>• Overdue: {urgentAlert.daysOverdue} days</span>
              </div>
            </div>
            {canPerformAnyAction && (
              <div className="ml-4">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    const action = approvalInfo?.next_action_required;
                    if (action) {
                      performApproval(action, { onSuccess: handleStatusUpdate });
                    }
                  }}
                  disabled={isPerformingApproval}
                >
                  {isPerformingApproval ? 'Processing...' : 'Take Action Now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Approval Workflow
        {urgentAlert && (
          <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">
            URGENT
          </Badge>
        )}
      </h3>

      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700 mr-3">Current Status:</span>
          <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(approvalInfo.current_status)}`}>
            {approvalInfo.current_status}
          </Badge>
        </div>
      </div>

      {/* Error Display */}
      {approvalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{approvalError}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mb-6">
        {getActionButton()}
      </div>

      {/* Approval Timeline */}
      <ApprovalTimeline approvalInfo={approvalInfo} />

      {/* Memo Information */}
      {approvalInfo.memo_id && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center text-blue-800">
            <FileText className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Associated with Memo ID: {approvalInfo.memo_id}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ApprovalFlow;
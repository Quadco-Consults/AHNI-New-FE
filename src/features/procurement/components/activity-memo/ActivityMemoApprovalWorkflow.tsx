"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, AlertTriangle, ArrowRight } from "lucide-react";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";

interface ActivityMemoApprovalWorkflowProps {
  activityMemoData: any;
  currentUser: any;
  activityMemoId: string;
  onStatusUpdate: () => void;
}

interface MemoApprovalStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  order: number;
}

const ActivityMemoApprovalWorkflow = ({
  activityMemoData,
  currentUser,
  activityMemoId,
  onStatusUpdate
}: ActivityMemoApprovalWorkflowProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  // Define the activity memo approval workflow steps
  const getMemoApprovalSteps = (): MemoApprovalStep[] => {
    const data = activityMemoData?.data;
    if (!data) return [];

    return [
      {
        id: 'draft',
        title: 'Draft Created',
        description: 'Activity memo has been created and saved as draft',
        status: 'approved', // Always completed since we have the memo
        order: 1
      },
      {
        id: 'submit',
        title: 'Submit for Review',
        description: 'Submit the memo for review and approval',
        status: data.status === 'DRAFT' ? 'pending' : 'approved',
        order: 2
      },
      {
        id: 'review',
        title: 'Review',
        description: 'Initial review and validation of the activity memo',
        status: getStepStatus('review', data),
        order: 3
      },
      {
        id: 'approve',
        title: 'Final Approval',
        description: 'Final approval for the activity memo',
        status: getStepStatus('approve', data),
        order: 4
      }
    ];
  };

  function getStepStatus(stepType: string, data: any): 'pending' | 'approved' | 'rejected' | 'in_progress' {
    switch (stepType) {
      case 'review':
        if (data.status === 'REJECTED') return 'rejected';
        if (data.status === 'REVIEWED' || data.status === 'APPROVED') return 'approved';
        if (data.status === 'PENDING') return 'pending';
        return 'pending';

      case 'approve':
        if (data.status === 'REJECTED') return 'rejected';
        if (data.status === 'APPROVED') return 'approved';
        if (data.status === 'REVIEWED') return 'pending';
        return 'pending';

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

  const canUserActOnStep = (step: MemoApprovalStep): boolean => {
    const data = activityMemoData?.data;
    if (!data || !currentUser?.data?.id) return false;

    const userId = currentUser.data.id;

    // Check if step is available for action
    if (step.status === 'approved' || step.status === 'rejected') return false;

    switch (step.id) {
      case 'submit':
        return data.status === 'DRAFT' && data.created_by === userId;
      case 'review':
        return data.status === 'PENDING' && data.reviewed_by?.includes(userId);
      case 'approve':
        return data.status === 'REVIEWED' && data.approved_by === userId;
      default:
        return false;
    }
  };

  const handleStepAction = async (step: MemoApprovalStep, action: 'approve' | 'reject') => {
    if (!currentUser?.data?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(step.id);

    try {
      let actionText = '';

      switch (step.id) {
        case 'submit':
          await ActivityMemoApprovalAPI.submit(activityMemoId);
          actionText = 'submitted for review';
          break;
        case 'review':
          if (action === 'approve') {
            await ActivityMemoApprovalAPI.review(activityMemoId);
            actionText = 'reviewed and approved';
          } else {
            const reason = prompt('Please provide a reason for rejection:');
            if (!reason?.trim()) {
              toast.error('Rejection reason is required');
              return;
            }
            await ActivityMemoApprovalAPI.reject(activityMemoId, reason);
            actionText = 'rejected';
          }
          break;
        case 'approve':
          if (action === 'approve') {
            await ActivityMemoApprovalAPI.approve(activityMemoId);
            actionText = 'approved';
          } else {
            const reason = prompt('Please provide a reason for rejection:');
            if (!reason?.trim()) {
              toast.error('Rejection reason is required');
              return;
            }
            await ActivityMemoApprovalAPI.reject(activityMemoId, reason);
            actionText = 'rejected';
          }
          break;
        default:
          throw new Error('Unknown approval step');
      }

      toast.success(`Activity memo ${actionText} successfully!`);

      // Call the callback to refresh data
      onStatusUpdate();

    } catch (error: any) {
      console.error("Approval error:", error);
      toast.error(`Failed to ${action} at ${step.title} stage: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const approvalSteps = getMemoApprovalSteps();
  const data = activityMemoData?.data;

  // Calculate progress
  const completedSteps = approvalSteps.filter(s => s.status === 'approved').length;
  const totalSteps = approvalSteps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Activity Memo Approval Workflow</h3>
        <div className="text-sm text-gray-500">
          Memo ID: {activityMemoId}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress: {completedSteps}/{totalSteps} steps</span>
        <span>Status: {data?.status || 'Unknown'}</span>
      </div>

      {/* Current Status Alert */}
      {data?.status && (
        <Card className={`p-4 border-l-4 ${
          data.status === 'APPROVED' ? 'border-l-green-500 bg-green-50' :
          data.status === 'REJECTED' ? 'border-l-red-500 bg-red-50' :
          data.status === 'PENDING' ? 'border-l-yellow-500 bg-yellow-50' :
          data.status === 'REVIEWED' ? 'border-l-blue-500 bg-blue-50' :
          'border-l-gray-500 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            {data.status === 'APPROVED' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {data.status === 'REJECTED' && <XCircle className="w-5 h-5 text-red-500" />}
            {(data.status === 'PENDING' || data.status === 'REVIEWED') && <Clock className="w-5 h-5 text-blue-500" />}
            {data.status === 'DRAFT' && <FileText className="w-5 h-5 text-gray-500" />}

            <div>
              <h4 className={`font-medium ${
                data.status === 'APPROVED' ? 'text-green-800' :
                data.status === 'REJECTED' ? 'text-red-800' :
                data.status === 'PENDING' ? 'text-yellow-800' :
                data.status === 'REVIEWED' ? 'text-blue-800' :
                'text-gray-800'
              }`}>
                Current Status: {data.status}
              </h4>
              <p className={`text-sm mt-1 ${
                data.status === 'APPROVED' ? 'text-green-700' :
                data.status === 'REJECTED' ? 'text-red-700' :
                data.status === 'PENDING' ? 'text-yellow-700' :
                data.status === 'REVIEWED' ? 'text-blue-700' :
                'text-gray-700'
              }`}>
                {data.status === 'DRAFT' && 'Activity memo is saved as draft and ready for submission'}
                {data.status === 'PENDING' && 'Activity memo is pending review'}
                {data.status === 'REVIEWED' && 'Activity memo has been reviewed and is pending final approval'}
                {data.status === 'APPROVED' && 'Activity memo has been fully approved'}
                {data.status === 'REJECTED' && 'Activity memo has been rejected'}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {approvalSteps.map((step, index) => (
          <Card key={step.id} className={`p-4 border-l-4 ${
            step.status === 'approved' ? 'border-l-green-500 bg-green-50' :
            step.status === 'rejected' ? 'border-l-red-500 bg-red-50' :
            step.status === 'pending' && canUserActOnStep(step) ? 'border-l-blue-500 bg-blue-50' :
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
                </div>
              </div>

              {canUserActOnStep(step) && step.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  {step.id === 'submit' ? (
                    <Button
                      onClick={() => handleStepAction(step, 'approve')}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {processingStep === step.id && isProcessing ? 'Processing...' : 'Submit'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleStepAction(step, 'approve')}
                        disabled={isProcessing}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processingStep === step.id && isProcessing ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleStepAction(step, 'reject')}
                        disabled={isProcessing}
                        size="sm"
                        variant="destructive"
                      >
                        {processingStep === step.id && isProcessing ? 'Processing...' : 'Reject'}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Show connection line to next step */}
            {index < approvalSteps.length - 1 && (
              <div className="ml-6 mt-4 flex items-center text-gray-400">
                <div className="border-l-2 border-gray-200 h-6 mr-3"></div>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Overall Status Summary */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Overall Progress</h4>
            <p className="text-sm text-gray-600 mt-1">
              Subject: {data?.subject || 'No subject'}
            </p>
            <p className="text-sm text-gray-600">
              Requested Date: {data?.requested_date || 'No date'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActivityMemoApprovalWorkflow;
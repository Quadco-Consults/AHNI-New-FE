"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, FileText, ArrowRight, MessageSquare } from "lucide-react";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";
import { Textarea } from "components/ui/textarea";

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
  const [showCommentBox, setShowCommentBox] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  // Define the activity memo approval workflow steps
  const getMemoApprovalSteps = (): MemoApprovalStep[] => {
    const data = activityMemoData?.data;
    if (!data) return [];

    // If status is undefined, treat as DRAFT
    const memoStatus = data.status || 'DRAFT';

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
        description: 'Submit the memo to reviewer for initial review',
        status: memoStatus === 'DRAFT' ? 'pending' : 'approved',
        order: 2
      },
      {
        id: 'review',
        title: 'Reviewer Approval',
        description: 'Reviewer validates and approves the activity memo',
        status: getStepStatus('review', { ...data, status: memoStatus }),
        order: 3
      },
      {
        id: 'authorize',
        title: 'Authorizer Approval',
        description: 'Authorizer reviews and authorizes the activity memo',
        status: getStepStatus('authorize', { ...data, status: memoStatus }),
        order: 4
      },
      {
        id: 'approve',
        title: 'Final Approval',
        description: 'Approver provides final approval for the activity memo',
        status: getStepStatus('approve', { ...data, status: memoStatus }),
        order: 5
      }
    ];
  };

  function getStepStatus(stepType: string, data: any): 'pending' | 'approved' | 'rejected' | 'in_progress' {
    switch (stepType) {
      case 'review':
        if (data.status === 'REJECTED') return 'rejected';
        if (data.status === 'REVIEWED' || data.status === 'AUTHORISED' || data.status === 'APPROVED') return 'approved';
        if (data.status === 'PENDING' || data.status === 'SUBMITTED') return 'pending';
        return 'pending';

      case 'authorize':
        if (data.status === 'REJECTED') return 'rejected';
        if (data.status === 'AUTHORISED' || data.status === 'APPROVED') return 'approved';
        if (data.status === 'REVIEWED') return 'pending';
        return 'pending';

      case 'approve':
        if (data.status === 'REJECTED') return 'rejected';
        if (data.status === 'APPROVED') return 'approved';
        if (data.status === 'AUTHORISED') return 'pending';
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
    const memoStatus = data.status || 'DRAFT';

    // Get user IDs from *_details fields (backend returns data in detail objects)
    const creatorId = data.created_by_details?.user_id || data.created_by;
    const approverId = data.approved_by_details?.user_id || data.approved_by;
    const reviewerIds = data.reviewed_by_details?.map((r: any) => r.user_id) || data.reviewed_by || [];
    const authorizerIds = data.authorised_by_details?.map((a: any) => a.user_id) || data.authorised_by || [];

    // Check if step is available for action
    if (step.status === 'approved' || step.status === 'rejected') return false;

    switch (step.id) {
      case 'submit':
        // Allow creator to submit if status is DRAFT
        return (memoStatus === 'DRAFT') && (creatorId === userId);
      case 'review':
        // Allow if status is PENDING/SUBMITTED and user is in reviewers list
        return (memoStatus === 'PENDING' || memoStatus === 'SUBMITTED') && Array.isArray(reviewerIds) && reviewerIds.includes(userId);
      case 'authorize':
        // Allow if status is REVIEWED and user is in authorizers list
        return memoStatus === 'REVIEWED' && Array.isArray(authorizerIds) && authorizerIds.includes(userId);
      case 'approve':
        // Allow if status is AUTHORISED and user matches approver
        return memoStatus === 'AUTHORISED' && approverId === userId;
      default:
        return false;
    }
  };

  const handleStepAction = async (step: MemoApprovalStep, action: 'approve' | 'reject') => {
    if (!currentUser?.data?.id) {
      toast.error("User not authenticated");
      return;
    }

    // For rejection, check if comment is provided
    if (action === 'reject' && !comment.trim()) {
      toast.error('Please provide a reason for rejection');
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
            await ActivityMemoApprovalAPI.reject(activityMemoId, comment);
            actionText = 'rejected';
          }
          break;
        case 'authorize':
          if (action === 'approve') {
            await ActivityMemoApprovalAPI.authorize(activityMemoId);
            actionText = 'authorized';
          } else {
            await ActivityMemoApprovalAPI.reject(activityMemoId, comment);
            actionText = 'rejected';
          }
          break;
        case 'approve':
          if (action === 'approve') {
            await ActivityMemoApprovalAPI.approve(activityMemoId);
            actionText = 'approved';
          } else {
            await ActivityMemoApprovalAPI.reject(activityMemoId, comment);
            actionText = 'rejected';
          }
          break;
        default:
          throw new Error('Unknown approval step');
      }

      toast.success(`Activity memo ${actionText} successfully!`);

      // Reset comment and close comment box
      setComment('');
      setShowCommentBox(null);

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
        <span>Status: {data?.status || 'DRAFT'}</span>
      </div>

      {/* Current Status Alert */}
      {data && (
        <Card className={`p-4 border-l-4 ${
          (data.status || 'DRAFT') === 'APPROVED' ? 'border-l-green-500 bg-green-50' :
          (data.status || 'DRAFT') === 'REJECTED' ? 'border-l-red-500 bg-red-50' :
          ((data.status || 'DRAFT') === 'PENDING' || (data.status || 'DRAFT') === 'SUBMITTED') ? 'border-l-yellow-500 bg-yellow-50' :
          (data.status || 'DRAFT') === 'REVIEWED' ? 'border-l-blue-500 bg-blue-50' :
          (data.status || 'DRAFT') === 'AUTHORISED' ? 'border-l-purple-500 bg-purple-50' :
          'border-l-gray-500 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            {(data.status || 'DRAFT') === 'APPROVED' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {(data.status || 'DRAFT') === 'REJECTED' && <XCircle className="w-5 h-5 text-red-500" />}
            {((data.status || 'DRAFT') === 'PENDING' || (data.status || 'DRAFT') === 'SUBMITTED' || (data.status || 'DRAFT') === 'REVIEWED' || (data.status || 'DRAFT') === 'AUTHORISED') && <Clock className="w-5 h-5 text-blue-500" />}
            {(data.status || 'DRAFT') === 'DRAFT' && <FileText className="w-5 h-5 text-gray-500" />}

            <div>
              <h4 className={`font-medium ${
                (data.status || 'DRAFT') === 'APPROVED' ? 'text-green-800' :
                (data.status || 'DRAFT') === 'REJECTED' ? 'text-red-800' :
                (data.status || 'DRAFT') === 'PENDING' ? 'text-yellow-800' :
                (data.status || 'DRAFT') === 'REVIEWED' ? 'text-blue-800' :
                (data.status || 'DRAFT') === 'AUTHORISED' ? 'text-purple-800' :
                'text-gray-800'
              }`}>
                Current Status: {data.status || 'DRAFT'}
              </h4>
              <p className={`text-sm mt-1 ${
                (data.status || 'DRAFT') === 'APPROVED' ? 'text-green-700' :
                (data.status || 'DRAFT') === 'REJECTED' ? 'text-red-700' :
                ((data.status || 'DRAFT') === 'PENDING' || (data.status || 'DRAFT') === 'SUBMITTED') ? 'text-yellow-700' :
                (data.status || 'DRAFT') === 'REVIEWED' ? 'text-blue-700' :
                (data.status || 'DRAFT') === 'AUTHORISED' ? 'text-purple-700' :
                'text-gray-700'
              }`}>
                {(data.status || 'DRAFT') === 'DRAFT' && 'Activity memo is saved as draft and ready for submission'}
                {((data.status || 'DRAFT') === 'PENDING' || (data.status || 'DRAFT') === 'SUBMITTED') && 'Activity memo is pending review by reviewer'}
                {(data.status || 'DRAFT') === 'REVIEWED' && 'Activity memo has been reviewed and is pending authorization'}
                {(data.status || 'DRAFT') === 'AUTHORISED' && 'Activity memo has been authorized and is pending final approval'}
                {(data.status || 'DRAFT') === 'APPROVED' && 'Activity memo has been fully approved'}
                {(data.status || 'DRAFT') === 'REJECTED' && 'Activity memo has been rejected'}
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
                <div className="flex items-center space-x-2 ml-4">
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
                        onClick={() => setShowCommentBox(showCommentBox === step.id ? null : step.id)}
                        disabled={isProcessing}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {showCommentBox === step.id ? 'Hide' : 'Comment'}
                      </Button>
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
                        disabled={isProcessing || !comment.trim()}
                        size="sm"
                        variant="destructive"
                        title={!comment.trim() ? 'Please add a comment before rejecting' : ''}
                      >
                        {processingStep === step.id && isProcessing ? 'Processing...' : 'Reject'}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Comment Box */}
            {canUserActOnStep(step) && showCommentBox === step.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Add Comments/Notes {step.id !== 'submit' && <span className="text-red-500">(Required for rejection)</span>}
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comments, feedback, or reason for rejection..."
                    className="min-h-[100px] resize-none"
                    disabled={isProcessing}
                  />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{comment.length} characters</span>
                    {comment.trim() && (
                      <Button
                        onClick={() => setComment('')}
                        size="sm"
                        variant="ghost"
                        className="h-auto py-1"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

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
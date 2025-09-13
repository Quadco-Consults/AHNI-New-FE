"use client";

import React, { useState, useEffect } from "react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Textarea } from "components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare,
  CalendarDays,
  ArrowRight,
  FileText,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { LeaveRequest, type LeaveApprovalWorkflow, LeaveApprovalStep } from "../../types/leave";
import { leaveService } from "../../services/leaveService";

interface LeaveApprovalWorkflowProps {
  leaveRequest: LeaveRequest;
  workflow?: LeaveApprovalWorkflow;
  userRole: 'employee' | 'manager' | 'hr' | 'admin';
  canApprove?: boolean;
  onApprove?: (comments?: string) => void;
  onReject?: (reason: string) => void;
}


const LeaveApprovalWorkflow: React.FC<LeaveApprovalWorkflowProps> = ({
  leaveRequest,
  workflow,
  userRole,
  canApprove = false,
  onApprove,
  onReject
}) => {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowData, setWorkflowData] = useState<LeaveApprovalWorkflow | null>(workflow || null);
  const [loading, setLoading] = useState(!workflow);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user ID - replace with actual auth logic
  const currentUserId = "usr-001"; // This should come from your auth context
  
  // Load workflow data if not provided
  useEffect(() => {
    const loadWorkflow = async () => {
      if (workflow) {
        setWorkflowData(workflow);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await leaveService.getLeaveWorkflow(leaveRequest.id);
        if (response.success) {
          setWorkflowData(response.data);
        } else {
          setError('Failed to load workflow data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workflow');
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkflow();
  }, [leaveRequest.id, workflow]);

  // Get status configuration
  const getStepStatusConfig = (status: LeaveApprovalStep['status']) => {
    switch (status) {
      case 'approved':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          label: 'Approved' 
        };
      case 'rejected':
        return { 
          icon: XCircle, 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          label: 'Rejected' 
        };
      case 'pending':
        return { 
          icon: Clock, 
          color: 'text-amber-600', 
          bgColor: 'bg-amber-100',
          label: 'Pending' 
        };
      case 'skipped':
        return { 
          icon: ArrowRight, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-100',
          label: 'Skipped' 
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-gray-400', 
          bgColor: 'bg-gray-100',
          label: 'Pending' 
        };
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      if (onApprove) {
        await onApprove(approvalComments);
      } else {
        // Direct API call
        const response = await leaveService.approveLeaveRequest(leaveRequest.id, {
          approverId: currentUserId,
          comments: approvalComments
        });
        
        if (response.success) {
          // Reload workflow data
          const workflowResponse = await leaveService.getLeaveWorkflow(leaveRequest.id);
          if (workflowResponse.success) {
            setWorkflowData(workflowResponse.data);
          }
        }
      }
      setShowApprovalForm(false);
      setApprovalComments("");
    } catch (error) {
      console.error('Error approving leave:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (onReject) {
        await onReject(rejectionReason);
      } else {
        // Direct API call
        const response = await leaveService.rejectLeaveRequest(leaveRequest.id, {
          approverId: currentUserId,
          reason: rejectionReason
        });
        
        if (response.success) {
          // Reload workflow data
          const workflowResponse = await leaveService.getLeaveWorkflow(leaveRequest.id);
          if (workflowResponse.success) {
            setWorkflowData(workflowResponse.data);
          }
        }
      }
      setShowApprovalForm(false);
      setRejectionReason("");
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
          <span className="ml-2">Loading workflow...</span>
        </div>
      </Card>
    );
  }
  
  // Show error state
  if (error || !workflowData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-red-600">Failed to load workflow</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </Card>
    );
  }
  
  const currentStep = workflowData.steps.find(step => step.stepNumber === workflowData.currentStep);
  const canCurrentUserApprove = canApprove && currentStep?.status === 'pending' && 
    (currentStep?.approverRole === userRole || userRole === 'admin');

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Approval Workflow</h3>
          </div>
          <Badge 
            variant={workflowData.status === 'completed' ? 'default' : 'secondary'}
            className={workflowData.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          >
            {workflowData.status === 'in_progress' ? 'In Progress' : 
             workflowData.status === 'completed' ? 'Completed' : 'Rejected'}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">
              Step {workflowData.currentStep} of {workflowData.totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(workflowData.currentStep / workflowData.totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {workflowData.steps.map((step, index) => {
            const config = getStepStatusConfig(step.status);
            const IconComponent = config.icon;
            const isActive = step.stepNumber === workflowData.currentStep;
            const isCompleted = step.status === 'approved';
            // const isFuture = step.stepNumber > workflowData.currentStep;

            return (
              <div key={step.id} className={`relative ${index > 0 ? 'pt-4' : ''}`}>
                {/* Connector Line */}
                {index > 0 && (
                  <div className="absolute -top-2 left-6 w-0.5 h-6 bg-gray-200" />
                )}
                
                <div className={`flex items-start gap-4 p-4 rounded-lg border ${
                  isActive ? 'border-blue-200 bg-blue-50' : 
                  isCompleted ? 'border-green-200 bg-green-50' : 
                  'border-gray-200 bg-gray-50'
                }`}>
                  {/* Step Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${config.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${config.color}`} />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium capitalize">
                        {step.approverRole} Approval
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        Step {step.stepNumber}
                      </Badge>
                      {step.isRequired && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>

                    {step.approverName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{step.approverName}</span>
                      </div>
                    )}

                    {step.status === 'approved' && step.approvedDate && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Approved on {format(new Date(step.approvedDate), 'MMM dd, yyyy')}</span>
                      </div>
                    )}

                    {step.comments && (
                      <div className="bg-white border rounded p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">Comments</span>
                        </div>
                        <p className="text-gray-600">{step.comments}</p>
                      </div>
                    )}

                    {/* Current Step Actions */}
                    {isActive && canCurrentUserApprove && !showApprovalForm && (
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => setShowApprovalForm(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => setShowApprovalForm(true)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Step Status */}
                  <div className="flex flex-col items-end">
                    <Badge 
                      variant={step.status === 'approved' ? 'default' : 'secondary'}
                      className={step.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                 step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                 step.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Approval Form */}
        {showApprovalForm && canCurrentUserApprove && (
          <Card className="border-blue-200 bg-blue-50 p-4">
            <h4 className="font-medium mb-4">Review Leave Request</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                <Textarea
                  placeholder="Add any comments for the employee..."
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                <Textarea
                  placeholder="If rejecting, please provide a clear reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApprovalForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={isSubmitting}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Workflow Timeline */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>Started on {format(new Date(workflowData.startedDate), 'MMM dd, yyyy')}</span>
            {workflowData.completedDate && (
              <>
                <span>•</span>
                <span>Completed on {format(new Date(workflowData.completedDate), 'MMM dd, yyyy')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeaveApprovalWorkflow;
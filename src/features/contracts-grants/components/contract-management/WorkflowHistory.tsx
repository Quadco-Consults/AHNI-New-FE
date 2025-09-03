"use client";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Avatar, AvatarFallback, AvatarInitials } from "components/ui/avatar";
import { CheckCircle, XCircle, Clock, ArrowRight, MessageSquare } from "lucide-react";

interface WorkflowStep {
  id: string;
  action: string;
  status: "completed" | "current" | "pending";
  user?: {
    id: string;
    name: string;
    email: string;
  };
  timestamp?: string;
  comments?: string;
  decision?: "approve" | "reject" | "request_changes";
}

interface WorkflowHistoryProps {
  contractRequest: any;
  workflowSteps?: WorkflowStep[];
}

export default function WorkflowHistory({ contractRequest, workflowSteps }: WorkflowHistoryProps) {
  // Mock workflow steps - in real implementation, this would come from API
  const defaultSteps: WorkflowStep[] = [
    {
      id: "1",
      action: "Request Submitted",
      status: "completed",
      user: {
        id: contractRequest.created_by?.id,
        name: contractRequest.created_by?.full_name || "System User",
        email: contractRequest.created_by?.email || "",
      },
      timestamp: contractRequest.created_datetime,
      decision: "approve",
    },
    {
      id: "2", 
      action: "Review Stage",
      status: contractRequest.status === "DRAFT" ? "pending" : 
             contractRequest.status === "SUBMITTED" || contractRequest.status === "UNDER_REVIEW" ? "current" : "completed",
      user: contractRequest.current_reviewer_detail ? {
        id: contractRequest.current_reviewer_detail.id,
        name: `${contractRequest.current_reviewer_detail.first_name} ${contractRequest.current_reviewer_detail.last_name}`,
        email: contractRequest.current_reviewer_detail.email || "",
      } : undefined,
      timestamp: contractRequest.status === "REVIEWED" ? contractRequest.updated_datetime : undefined,
      comments: contractRequest.status === "REVIEWED" ? "Review completed - all criteria satisfied" : undefined,
      decision: contractRequest.status === "REVIEWED" ? "approve" : undefined,
    },
    {
      id: "3",
      action: "Authorization Stage", 
      status: contractRequest.status === "REVIEWED" ? "current" :
             contractRequest.status === "AUTHORIZED" ? "completed" : "pending",
      user: contractRequest.authorizer_detail ? {
        id: contractRequest.authorizer_detail.id,
        name: `${contractRequest.authorizer_detail.first_name} ${contractRequest.authorizer_detail.last_name}`,
        email: contractRequest.authorizer_detail.email || "",
      } : undefined,
      timestamp: contractRequest.status === "AUTHORIZED" ? contractRequest.updated_datetime : undefined,
      decision: contractRequest.status === "AUTHORIZED" ? "approve" : undefined,
    },
    {
      id: "4",
      action: "Final Approval",
      status: contractRequest.status === "AUTHORIZED" ? "current" :
             contractRequest.status === "APPROVED" ? "completed" : "pending",
      user: contractRequest.approver_detail ? {
        id: contractRequest.approver_detail.id,
        name: `${contractRequest.approver_detail.first_name} ${contractRequest.approver_detail.last_name}`,
        email: contractRequest.approver_detail.email || "",
      } : undefined,
      timestamp: contractRequest.status === "APPROVED" ? contractRequest.updated_datetime : undefined,
      decision: contractRequest.status === "APPROVED" ? "approve" : undefined,
    },
  ];

  const steps = workflowSteps || defaultSteps;

  const getStepIcon = (step: WorkflowStep) => {
    if (step.status === "completed") {
      return step.decision === "reject" ? 
        <XCircle className="h-5 w-5 text-red-500" /> : 
        <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (step.status === "current") {
      return <Clock className="h-5 w-5 text-blue-500" />;
    }
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  const getStepColor = (step: WorkflowStep) => {
    if (step.status === "completed") {
      return step.decision === "reject" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50";
    }
    if (step.status === "current") {
      return "border-blue-200 bg-blue-50";
    }
    return "border-gray-200 bg-gray-50";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Workflow Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 z-0" />
              )}
              
              {/* Step Container */}
              <div className={`relative flex gap-4 p-4 rounded-lg border ${getStepColor(step)} z-10`}>
                {/* Step Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step)}
                </div>

                {/* Step Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{step.action}</h3>
                      {step.user && (
                        <p className="text-sm text-gray-600">
                          Assigned to: {step.user.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {step.status === "completed" && (
                        <Badge 
                          variant={step.decision === "reject" ? "destructive" : "default"}
                          className="mb-1"
                        >
                          {step.decision === "approve" ? "Approved" : 
                           step.decision === "reject" ? "Rejected" : 
                           step.decision === "request_changes" ? "Changes Requested" : 
                           "Completed"}
                        </Badge>
                      )}
                      {step.status === "current" && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                          In Progress
                        </Badge>
                      )}
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(step.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  {step.comments && (
                    <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-200">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{step.comments}</p>
                      </div>
                    </div>
                  )}

                  {/* Waiting State */}
                  {step.status === "current" && !step.user && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        ⏳ Waiting for user assignment
                      </p>
                    </div>
                  )}

                  {/* Next Steps */}
                  {step.status === "current" && step.user && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-700">
                        📋 Action required from {step.user.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Current Status: <strong>{contractRequest.status_display || contractRequest.status}</strong>
            </span>
            <span className="text-gray-600">
              Last Updated: {formatDate(contractRequest.updated_datetime)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
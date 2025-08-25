"use client";

import React from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

interface WorkflowStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  description: string;
  canAction?: boolean;
  actionLabel?: string;
  actionType?: "review" | "admin_approve" | "manager_approve" | "reject";
}

interface FundRequestWorkflowStatusProps {
  fundRequestId: string;
  currentStatus: string;
  canReview?: boolean;
  canAdminApprove?: boolean;
  canManagerApprove?: boolean;
  canReject?: boolean;
}

const FundRequestWorkflowStatus: React.FC<FundRequestWorkflowStatusProps> = ({
  fundRequestId,
  currentStatus,
  canReview = false,
  canAdminApprove = false,
  canManagerApprove = false,
  canReject = false
}) => {
  const dispatch = useAppDispatch();

  const getStepStatus = (stepStatus: string): "pending" | "in_progress" | "completed" | "rejected" => {
    switch (currentStatus) {
      case "PENDING":
        return stepStatus === "review" ? "in_progress" : "pending";
      case "REVIEWED":
        if (stepStatus === "review") return "completed";
        return stepStatus === "admin_approve" ? "in_progress" : "pending";
      case "ADMIN_APPROVED":
        if (["review", "admin_approve"].includes(stepStatus)) return "completed";
        return stepStatus === "manager_approve" ? "in_progress" : "pending";
      case "MANAGER_APPROVED":
        return ["review", "admin_approve", "manager_approve"].includes(stepStatus) 
          ? "completed" 
          : "pending";
      case "REJECTED":
        return "rejected";
      default:
        return "pending";
    }
  };

  const workflowSteps: WorkflowStep[] = [
    {
      id: "review",
      title: "Project Office Review",
      status: getStepStatus("review"),
      description: "Review by project office (changes PENDING → REVIEWED)",
      canAction: canReview && currentStatus === "PENDING",
      actionLabel: "Complete Review",
      actionType: "review"
    },
    {
      id: "admin_approve",
      title: "Project Head Office Authorization",
      status: getStepStatus("admin_approve"),
      description: "Authorization from project head office",
      canAction: canAdminApprove && currentStatus === "REVIEWED",
      actionLabel: "Authorize",
      actionType: "admin_approve"
    },
    {
      id: "manager_approve",
      title: "AHNI Head Office Review",
      status: getStepStatus("manager_approve"),
      description: "Final review by AHNI head office",
      canAction: canManagerApprove && currentStatus === "ADMIN_APPROVED",
      actionLabel: "Approve",
      actionType: "manager_approve"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleAction = (actionType: string) => {
    if (actionType === "reject") {
      dispatch(
        openDialog({
          type: DialogType.FundRequestReject,
          dialogProps: {
            fundRequestId,
            width: "max-w-md"
          }
        })
      );
    } else {
      dispatch(
        openDialog({
          type: DialogType.FundRequestApproval,
          dialogProps: {
            fundRequestId,
            actionType,
            width: "max-w-md"
          }
        })
      );
    }
  };

  const getCurrentStageDescription = () => {
    switch (currentStatus) {
      case "PENDING":
        return "Awaiting project office review";
      case "REVIEWED": 
        return "Awaiting project head office authorization";
      case "ADMIN_APPROVED":
        return "Awaiting AHNI head office final approval";
      case "MANAGER_APPROVED":
        return "Fund request fully approved";
      case "REJECTED":
        return "Fund request rejected";
      default:
        return "Unknown status";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Approval Workflow</h3>
          <p className="text-sm text-gray-600 mt-1">{getCurrentStageDescription()}</p>
        </div>
        <Badge className={getStatusColor(currentStatus.toLowerCase())}>
          {currentStatus.replace("_", " ")}
        </Badge>
      </div>

      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className={`font-medium ${
                    step.status === "in_progress" ? "text-blue-600" : ""
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {step.canAction && (
                  <Button
                    size="sm"
                    onClick={() => handleAction(step.actionType!)}
                    className="ml-4"
                  >
                    {step.actionLabel}
                  </Button>
                )}
              </div>
            </div>
            {index < workflowSteps.length - 1 && (
              <div className="absolute left-2 mt-8 w-0.5 h-8 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {canReject && currentStatus !== "REJECTED" && (
        <div className="mt-6 pt-4 border-t">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAction("reject")}
          >
            Reject Request
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FundRequestWorkflowStatus;
"use client";

import React, { useState } from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import {
  useReviewFundRequest,
  useApproveFundRequest,
  useFundRequestActions,
} from "@/features/programs/controllers/fundRequestController";

interface WorkflowStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  description: string;
  canAction?: boolean;
  actionLabel?: string;
  actionType?:
    | "review"
    | "LOCATION_REVIEWED"
    | "LOCATION_AUTHORIZED"
    | "HQ_REVIEWED"
    | "HQ_AUTHORIZED"
    | "HQ_APPROVED"
    | "reject";
}

interface FundRequestWorkflowStatusProps {
  fundRequestId: string;
  currentStatus: string;
  canReview?: boolean;
  canLocationReview?: boolean;
  canLocationAuthorize?: boolean;
  canStateReview?: boolean;
  canStateAuthorize?: boolean;
  canReject?: boolean;
}

const FundRequestWorkflowStatus: React.FC<FundRequestWorkflowStatusProps> = ({
  fundRequestId,
  currentStatus,
  canReview = false,
  canLocationReview = false,
  canLocationAuthorize = false,
  canStateReview = false,
  canStateAuthorize = false,
  canReject = false,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const form = useForm();

  // API hooks
  const { reviewFundRequest, isLoading: isReviewing } =
    useReviewFundRequest(fundRequestId);
  const { approveFundRequest, isLoading: isApproving } =
    useApproveFundRequest(fundRequestId);
  const { getAvailableActions } = useFundRequestActions(currentStatus);

  const getStepStatus = (
    stepStatus: string
  ): "pending" | "in_progress" | "completed" | "rejected" => {
    const statusOrder = [
      "PENDING",
      "LOCATION_REVIEWED",
      "LOCATION_AUTHORIZED",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus.toUpperCase());

    if (currentStatus === "REJECTED") return "rejected";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "in_progress";
    return "pending";
  };

  const workflowSteps: WorkflowStep[] = [
    {
      id: "PENDING",
      title: "Location Review",
      status: getStepStatus("PENDING"),
      description: "Review by location office",
      canAction: canLocationReview && currentStatus === "PENDING",
      actionLabel: "Location Review",
      actionType: "LOCATION_REVIEWED",
    },
    {
      id: "LOCATION_REVIEWED",
      title: "Location Authorization",
      status: getStepStatus("LOCATION_REVIEWED"),
      description: "Authorization from location office",
      canAction: canLocationAuthorize && currentStatus === "LOCATION_REVIEWED",
      actionLabel: "Location Authorize",
      actionType: "LOCATION_AUTHORIZED",
    },
    {
      id: "LOCATION_AUTHORIZED",
      title: "Ready for HQ Approval",
      status: getStepStatus("LOCATION_AUTHORIZED"),
      description: "Location approval complete - ready for project-level HQ approval",
      canAction: false,
      actionLabel: "",
      actionType: undefined,
    },
  ];

  const handleAction = async (actionType: string, formData?: any) => {
    try {
      if (actionType === "review") {
        await reviewFundRequest({ actionType: "REVIEWED", formData });
        toast.success("Review completed successfully");
      } else if (actionType === "reject") {
        if (!formData?.comments?.trim()) {
          toast.error("Please provide a reason for rejection");
          return;
        }
        await approveFundRequest("REJECTED", formData.comments);
        toast.success("Fund request rejected successfully");
      } else {
        // actionType is the actual status to set (e.g., "LOCATION_REVIEWED", "STATE_REVIEWED", etc.)
        await approveFundRequest(actionType, formData?.comments);
        toast.success(
          `Fund request ${actionType
            .replace("_", " ")
            .toLowerCase()} successfully`
        );
      }

      setActiveAction(null);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className='w-5 h-5 text-green-600' />;
      case "in_progress":
        return <Clock className='w-5 h-5 text-blue-600' />;
      case "rejected":
        return <XCircle className='w-5 h-5 text-red-600' />;
      default:
        return <AlertCircle className='w-5 h-5 text-gray-400' />;
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

  const getCurrentStageDescription = () => {
    switch (currentStatus) {
      case "PENDING":
        return "Awaiting location office review";
      case "LOCATION_REVIEWED":
        return "Awaiting location office authorization";
      case "LOCATION_AUTHORIZED":
        return "Location approval complete - ready for project-level HQ approval";
      case "HQ_REVIEWED":
        return "Under HQ review (project-level)";
      case "HQ_AUTHORIZED":
        return "HQ authorized (project-level)";
      case "HQ_APPROVED":
        return "Fund request fully approved";
      case "REJECTED":
        return "Fund request rejected";
      default:
        return "Unknown status";
    }
  };
  console.log({ step: workflowSteps });

  return (
    <Card className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h3 className='text-lg font-semibold'>Approval Workflow</h3>
          <p className='text-sm text-gray-600 mt-1'>
            {getCurrentStageDescription()}
          </p>
        </div>
        <Badge className={getStatusColor(currentStatus.toLowerCase())}>
          {currentStatus.replace("_", " ")}
        </Badge>
      </div>

      <div className='space-y-4'>
        {workflowSteps.map((step, index) => (
          <div key={step.id} className='flex items-center space-x-4'>
            <div className='flex-shrink-0'>{getStatusIcon(step.status)}</div>
            <div className='flex-1'>
              <div className='flex justify-between items-center'>
                <div>
                  <h4
                    className={`font-medium ${
                      step.status === "in_progress" ? "text-blue-600" : ""
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className='text-sm text-gray-600'>{step.description}</p>
                </div>
                {step.canAction && (
                  <>
                    {activeAction === step.actionType ? (
                      <div className='ml-4 space-y-2 min-w-[200px]'>
                        {/* {step.actionType !== "review" && ( */}
                        <FormProvider {...form}>
                          <FormTextArea
                            name='comments'
                            placeholder='Add comments (optional)'
                            className='text-xs'
                            rows={2}
                          />
                        </FormProvider>
                        {/* )} */}
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            onClick={() =>
                              handleAction(step.actionType!, form.getValues())
                            }
                            disabled={isReviewing || isApproving}
                            className='text-xs'
                          >
                            {isReviewing || isApproving
                              ? "Processing..."
                              : "Confirm"}
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => setActiveAction(null)}
                            className='text-xs'
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size='sm'
                        onClick={() => setActiveAction(step.actionType!)}
                        className='ml-4'
                      >
                        {step.actionLabel}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            {index < workflowSteps.length - 1 && (
              <div className='absolute left-2 mt-8 w-0.5 h-8 bg-gray-200' />
            )}
          </div>
        ))}
      </div>

      <div className='mt-6 pt-4 border-t'>
        {canReject &&
          currentStatus !== "REJECTED" &&
          currentStatus !== "HQ_APPROVED" && (
            <div className='space-y-3'>
              {activeAction === "reject" ? (
                <div className='space-y-2'>
                  <FormProvider {...form}>
                    <FormTextArea
                      name='comments'
                      placeholder='Please provide reason for rejection (required)'
                      rows={3}
                      required
                    />
                  </FormProvider>
                  <div className='flex gap-2'>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleAction("reject", form.getValues())}
                      disabled={isApproving}
                    >
                      {isApproving ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setActiveAction(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => setActiveAction("reject")}
                >
                  Reject Request
                </Button>
              )}
            </div>
          )}
      </div>
    </Card>
  );
};

export default FundRequestWorkflowStatus;

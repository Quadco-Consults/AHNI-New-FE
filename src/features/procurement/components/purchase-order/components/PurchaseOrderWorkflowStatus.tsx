"use client";

import React, { useState } from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, CreditCard, Handshake } from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import { useModifyPurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";

interface WorkflowStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  description: string;
  canAction?: boolean;
  actionLabel?: string;
  actionType?: "authorize" | "approve" | "agree" | "reject";
  icon?: React.ReactNode;
  approver?: string;
}

interface PurchaseOrderWorkflowStatusProps {
  purchaseOrderId: string;
  currentStatus: string;
  canAuthorize?: boolean;
  canApprove?: boolean;
  canAgree?: boolean;
  canReject?: boolean;
  authorizedBy?: string | { user_id: string; name: string };
  approvedBy?: string | { user_id: string; name: string };
  agreedBy?: string | { user_id: string; name: string };
}

const PurchaseOrderWorkflowStatus: React.FC<PurchaseOrderWorkflowStatusProps> = ({
  purchaseOrderId,
  currentStatus,
  canAuthorize = false,
  canApprove = false,
  canAgree = false,
  canReject = false,
  authorizedBy,
  approvedBy,
  agreedBy,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const form = useForm();


  // API hook
  const { modifyPurchaseOrder, isLoading } = useModifyPurchaseOrder(purchaseOrderId);

  // Helper function to extract name from user object or return string as-is
  const getApproverName = (approver?: string | { user_id: string; name: string }): string => {
    if (!approver) return "";
    if (typeof approver === "string") return approver;
    return approver.name || "";
  };

  const getStepStatus = (
    stepStatus: string
  ): "pending" | "in_progress" | "completed" | "rejected" => {
    const safeCurrentStatus = typeof currentStatus === 'string' ? currentStatus : 'PENDING';
    const statusOrder = [
      "PENDING",
      "AUTHORIZED",
      "APPROVED",
      "AGREED"
    ];
    const currentIndex = statusOrder.indexOf(safeCurrentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus.toUpperCase());

    if (safeCurrentStatus === "REJECTED") return "rejected";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "in_progress";
    return "pending";
  };

  const workflowSteps: WorkflowStep[] = [
    {
      id: "PENDING",
      title: "Financial Authorization",
      status: getStepStatus("PENDING"),
      description: "Authorization by Director of Finance",
      canAction: canAuthorize && currentStatus === "PENDING",
      actionLabel: "Authorize PO",
      actionType: "authorize",
      icon: <FileText className="w-5 h-5" />,
      approver: getApproverName(authorizedBy) || "Director of Finance",
    },
    {
      id: "AUTHORIZED",
      title: "Operational Approval",
      status: getStepStatus("AUTHORIZED"),
      description: "Approval by Director of Operations",
      canAction: canApprove && currentStatus === "AUTHORIZED",
      actionLabel: "Approve PO",
      actionType: "approve",
      icon: <CreditCard className="w-5 h-5" />,
      approver: getApproverName(approvedBy) || "Director of Operations",
    },
    {
      id: "APPROVED",
      title: "Vendor Agreement",
      status: getStepStatus("APPROVED"),
      description: "Agreement and acceptance by vendor",
      canAction: canAgree && currentStatus === "APPROVED",
      actionLabel: "Mark as Agreed",
      actionType: "agree",
      icon: <Handshake className="w-5 h-5" />,
      approver: getApproverName(agreedBy) || "Vendor",
    },
  ];

  const handleAction = async (actionType: string, formData?: any) => {
    try {
      const payload = {
        action: actionType,
        comments: formData?.comments || ""
      };

      await modifyPurchaseOrder(payload);

      const actionMessages = {
        authorize: "Purchase Order authorized successfully",
        approve: "Purchase Order approved successfully",
        agree: "Purchase Order agreement confirmed successfully",
        reject: "Purchase Order rejected successfully"
      };

      toast.success(actionMessages[actionType as keyof typeof actionMessages]);
      setActiveAction(null);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const getStatusIcon = (status: string, stepIcon?: React.ReactNode) => {
    switch (status) {
      case "completed":
        return <CheckCircle className='w-5 h-5 text-green-600' />;
      case "in_progress":
        return <Clock className='w-5 h-5 text-blue-600' />;
      case "rejected":
        return <XCircle className='w-5 h-5 text-red-600' />;
      default:
        return stepIcon ? (
          <div className="text-gray-400">{stepIcon}</div>
        ) : (
          <AlertCircle className='w-5 h-5 text-gray-400' />
        );
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
    const status = typeof currentStatus === 'string' ? currentStatus : 'UNKNOWN';
    switch (status) {
      case "PENDING":
        return "Awaiting financial authorization from Director of Finance";
      case "AUTHORIZED":
        return "Awaiting operational approval from Director of Operations";
      case "APPROVED":
        return "Awaiting vendor agreement and acceptance";
      case "AGREED":
        return "Purchase Order fully approved and agreed";
      case "REJECTED":
        return "Purchase Order has been rejected";
      default:
        return "Unknown status";
    }
  };

  return (
    <Card className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h3 className='text-lg font-semibold'>Purchase Order Approval Workflow</h3>
          <p className='text-sm text-gray-600 mt-1'>
            {getCurrentStageDescription()}
          </p>
        </div>
        <Badge className={getStatusColor(typeof currentStatus === 'string' ? currentStatus.toLowerCase() : 'pending')}>
          {typeof currentStatus === 'string' ? currentStatus.replace("_", " ") : 'Pending'}
        </Badge>
      </div>

      <div className='space-y-6'>
        {workflowSteps.map((step, index) => (
          <div key={step.id} className='relative'>
            <div className='flex items-start space-x-4'>
              <div className='flex-shrink-0 relative'>
                {getStatusIcon(step.status, step.icon)}
                {index < workflowSteps.length - 1 && (
                  <div className='absolute left-2.5 top-8 w-0.5 h-12 bg-gray-200' />
                )}
              </div>

              <div className='flex-1'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <h4
                      className={`font-medium ${
                        step.status === "in_progress" ? "text-blue-600" :
                        step.status === "completed" ? "text-green-600" :
                        step.status === "rejected" ? "text-red-600" : ""
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className='text-sm text-gray-600 mt-1'>{step.description}</p>
                    <p className='text-xs text-gray-500 mt-1'>
                      <span className="font-medium">Approver:</span> {typeof step.approver === 'string' ? step.approver : 'Unknown'}
                    </p>
                  </div>

                  {step.canAction && (
                    <div className="ml-4">
                      {activeAction === step.actionType ? (
                        <div className='space-y-3 min-w-[250px]'>
                          <FormProvider {...form}>
                            <FormTextArea
                              name='comments'
                              placeholder='Add comments (optional)'
                              className='text-sm'
                              rows={2}
                            />
                          </FormProvider>
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              onClick={() =>
                                handleAction(step.actionType!, form.getValues())
                              }
                              disabled={isLoading}
                              className='text-sm'
                            >
                              {isLoading ? "Processing..." : "Confirm"}
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => setActiveAction(null)}
                              className='text-sm'
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
                          variant={step.status === "in_progress" ? "default" : "outline"}
                        >
                          {step.actionLabel}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Section */}
      <div className='mt-6 pt-4 border-t'>
        {canReject &&
         currentStatus !== "REJECTED" &&
         currentStatus !== "AGREED" && (
          <div className='space-y-3'>
            {activeAction === "reject" ? (
              <div className='space-y-3'>
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Rejecting..." : "Confirm Rejection"}
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
                Reject Purchase Order
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PurchaseOrderWorkflowStatus;
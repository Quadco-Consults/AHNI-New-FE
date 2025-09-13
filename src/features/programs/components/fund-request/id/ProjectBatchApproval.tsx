"use client";

import React, { useState } from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Users,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import { LoadingSpinner } from "components/Loading";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";

interface ProjectBatchApprovalProps {
  projectId: string;
}

const ProjectBatchApproval: React.FC<ProjectBatchApprovalProps> = ({
  projectId,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const form = useForm();

  const { data: fundRequests, isLoading } = useGetAllFundRequests({
    project: projectId || "",
    enabled: !!projectId,
  });

  // Filter fund requests that are ready for HQ approval (LOCATION_AUTHORIZED or higher)
  const hqPendingRequests = React.useMemo(() => {
    return (
      fundRequests?.data?.results?.filter(
        (request: any) =>
          request.status === "LOCATION_AUTHORIZED" ||
          request.status === "HQ_REVIEWED" ||
          request.status === "HQ_AUTHORIZED"
      ) || []
    );
  }, [fundRequests?.data?.results]);

  // Group requests by status to determine batch status
  const batchStatus = React.useMemo((): string => {
    if (hqPendingRequests.length === 0) return "NO_REQUESTS";

    const statuses = hqPendingRequests.map((req: any) => req.status);
    const uniqueStatuses = [...new Set(statuses)];

    if (uniqueStatuses.length === 1) {
      return uniqueStatuses[0] as string;
    }

    // Mixed statuses - return the "lowest" status for batch processing
    if (statuses.includes("LOCATION_AUTHORIZED")) return "LOCATION_AUTHORIZED";
    if (statuses.includes("HQ_REVIEWED")) return "HQ_REVIEWED";
    return "HQ_AUTHORIZED";
  }, [hqPendingRequests]);

  // Calculate total amount for the batch
  const totalBatchAmount = hqPendingRequests.reduce(
    (sum: number, request: any) => sum + (request.total_amount || 0),
    0
  );

  // Real API actions using the batch approval endpoint
  const performBatchAction = async (status: string, comments?: string) => {
    if (hqPendingRequests.length === 0) {
      toast.error("No fund requests available for batch processing");
      return;
    }

    setIsProcessing(true);

    try {
      // Import the same AxiosWithToken used by the controller
      const AxiosWithToken = (
        await import("@/constants/api_management/MyHttpHelperWithToken")
      ).default;

      // First, get the actual batch ID from the backend
      // Search for batches that can be processed based on current action
      let batchStatus: string;
      switch (status) {
        case "HQ_REVIEWED":
          batchStatus = "PENDING_HQ_REVIEW";
          break;
        case "HQ_AUTHORIZED":
          batchStatus = "HQ_REVIEWED"; // Look for batches that have been reviewed and are ready for authorization
          break;
        case "HQ_APPROVED":
          batchStatus = "HQ_AUTHORIZED"; // Look for batches that have been authorized and are ready for approval
          break;
        case "REJECTED":
          // For rejection, we need to determine what stage we're rejecting at
          // This will be handled in the fallback logic
          batchStatus = "PENDING_HQ_REVIEW";
          break;
        default:
          batchStatus = "PENDING_HQ_REVIEW";
      }

      const batchesResponse = await AxiosWithToken.get(
        "/programs/fund-request-batches/",
        {
          params: {
            project: projectId,
            status: batchStatus,
          },
        }
      );

      const batches =
        batchesResponse.data?.data?.results ||
        batchesResponse.data?.results ||
        [];

      if (batches.length === 0) {
        // If no batches found with specific status, try to get any active batch for this project
        const fallbackResponse = await AxiosWithToken.get(
          "/programs/fund-request-batches/",
          {
            params: {
              project: projectId,
            },
          }
        );

        const fallbackBatches =
          fallbackResponse.data?.data?.results ||
          fallbackResponse.data?.results ||
          [];

        if (fallbackBatches.length === 0) {
          toast.error(
            `No batches found for this project that can be ${status
              .toLowerCase()
              .replace("_", " ")}`
          );
          return;
        }

        // Use the most recent batch
        batches.push(fallbackBatches[0]);
      }

      // Use the first batch (there should typically be only one per project/month/year)
      const batch = batches[0];
      const batchId = batch.id;

      // console.log('Batch approval request:', {
      //   batchId,
      //   batchData: batch,
      //   status,
      //   comments,
      //   requestCount: hqPendingRequests.length
      // });

      // Use the specific batch endpoint based on status
      let endpoint: string;
      let payload: any = { ...(comments && { comments }) };

      switch (status) {
        case "HQ_REVIEWED":
          endpoint = `/programs/fund-request-batches/${batchId}/hq-review/`;
          break;
        case "HQ_AUTHORIZED":
          endpoint = `/programs/fund-request-batches/${batchId}/hq-authorize/`;
          break;
        case "HQ_APPROVED":
          endpoint = `/programs/fund-request-batches/${batchId}/hq-approve/`;
          break;
        case "REJECTED":
          endpoint = `/programs/fund-request-batches/${batchId}/reject/`;
          payload = { comments: comments || "Rejected by HQ" }; // Comments required for rejection
          break;
        default:
          throw new Error(`Unsupported batch action: ${status}`);
      }

      await AxiosWithToken.post(endpoint, payload);

      const statusDisplayName = status.replace("_", " ").toLowerCase();
      toast.success(
        `Project batch ${statusDisplayName} successfully - ${hqPendingRequests.length} fund requests updated`
      );

      // Refresh the data by refetching
      window.location.reload(); // Simple refresh - could be optimized with proper data refetching
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process batch";
      toast.error(`Batch approval failed: ${errorMessage}`);
      console.error("Batch approval error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchAction = async (actionType: string, formData?: any) => {
    try {
      let status: string;

      switch (actionType) {
        case "hq_review":
          status = "HQ_REVIEWED";
          break;
        case "hq_authorize":
          status = "HQ_AUTHORIZED";
          break;
        case "hq_approve":
          status = "HQ_APPROVED";
          break;
        case "reject":
          if (!formData?.comments?.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
          }
          status = "REJECTED";
          break;
        default:
          toast.error("Invalid action type");
          return;
      }

      await performBatchAction(status, formData?.comments);
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
      case "HQ_APPROVED":
        return "bg-green-100 text-green-800";
      case "HQ_AUTHORIZED":
        return "bg-blue-100 text-blue-800";
      case "HQ_REVIEWED":
        return "bg-yellow-100 text-yellow-800";
      case "LOCATION_AUTHORIZED":
        return "bg-purple-100 text-purple-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getCurrentStageDescription = () => {
    switch (batchStatus) {
      case "LOCATION_AUTHORIZED":
      case "PENDING_HQ_REVIEW":
        return "Ready for HQ review - All locations have completed their approvals";
      case "HQ_REVIEWED":
        return "HQ review complete - Awaiting HQ authorization for the entire project";
      case "HQ_AUTHORIZED":
        return "HQ authorized - Awaiting final HQ approval for the entire project";
      case "HQ_APPROVED":
        return "Project fully approved - All fund requests approved";
      case "REJECTED":
        return "Project batch rejected";
      case "NO_REQUESTS":
        return "No fund requests requiring HQ approval";
      default:
        return `Current status: ${batchStatus}`;
    }
  };

  const canPerformAction = (actionType: string): boolean => {
    // This should be replaced with actual permission logic based on user role
    const isHQUser = true; // Mock permission check

    if (!isHQUser) return false;

    switch (actionType) {
      case "hq_review":
        // Can review when all locations are authorized (LOCATION_AUTHORIZED status)
        return (
          batchStatus === "LOCATION_AUTHORIZED" ||
          batchStatus === "PENDING_HQ_REVIEW"
        );
      case "hq_authorize":
        // Can authorize after HQ review is complete
        return batchStatus === "HQ_REVIEWED";
      case "hq_approve":
        // Can do final approval after HQ authorization
        return batchStatus === "HQ_AUTHORIZED";
      case "reject":
        // Can reject at any stage before final approval
        return [
          "LOCATION_AUTHORIZED",
          "PENDING_HQ_REVIEW",
          "HQ_REVIEWED",
          "HQ_AUTHORIZED",
        ].includes(batchStatus);
      default:
        return false;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (hqPendingRequests.length === 0) {
    return (
      <Card className='p-6'>
        <div className='text-center text-gray-500'>
          <AlertCircle className='w-12 h-12 mx-auto mb-4 text-gray-400' />
          <p className='text-lg font-medium mb-2'>No HQ Approvals Required</p>
          <p>
            All fund requests for this project are either pending location
            approval or already fully processed.
          </p>
        </div>
      </Card>
    );
  }

  const actionButtons = [
    {
      key: "hq_review",
      label: "HQ Review Project",
      actionType: "hq_review",
      variant: "default" as const,
    },
    {
      key: "hq_authorize",
      label: "HQ Authorize Project",
      actionType: "hq_authorize",
      variant: "default" as const,
    },
    {
      key: "hq_approve",
      label: "HQ Approve Project",
      actionType: "hq_approve",
      variant: "default" as const,
    },
  ];

  return (
    <Card className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h3 className='text-lg font-semibold'>Project-Level HQ Approval</h3>
          <p className='text-sm text-gray-600 mt-1'>
            {getCurrentStageDescription()}
          </p>
        </div>
        <Badge className={getStatusColor(batchStatus)}>
          {batchStatus.replace("_", " ")}
        </Badge>
      </div>

      {/* Project Batch Summary */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg'>
        <div className='flex items-center gap-2'>
          <Users className='w-5 h-5 text-blue-600' />
          <div>
            <p className='text-sm text-gray-600'>Total Locations</p>
            <p className='font-semibold'>{hqPendingRequests.length}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <MapPin className='w-5 h-5 text-green-600' />
          <div>
            <p className='text-sm text-gray-600'>Total Amount</p>
            <p className='font-semibold'>
              {hqPendingRequests[0]?.currency}{" "}
              {totalBatchAmount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {getStatusIcon(
            batchStatus === "HQ_APPROVED" ? "completed" : "in_progress"
          )}
          <div>
            <p className='text-sm text-gray-600'>Batch Status</p>
            <p className='font-semibold'>{batchStatus.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {/* Fund Requests in Batch */}
      <div className='mb-6'>
        <h4 className='font-medium mb-3'>Fund Requests in This Batch</h4>
        <div className='space-y-2'>
          {hqPendingRequests.map((request: any) => (
            <div
              key={request.id}
              className='flex justify-between items-center p-3 bg-white border rounded-lg'
            >
              <div className='flex items-center gap-3'>
                {getStatusIcon(
                  request.status === "HQ_APPROVED" ? "completed" : "in_progress"
                )}
                <div>
                  <p className='font-medium'>{request.location.name}</p>
                  <p className='text-sm text-gray-600'>
                    {request.month} - {request.uuid_code}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-medium'>
                  {request.currency} {request.total_amount?.toLocaleString()}
                </p>
                <Badge
                  variant='outline'
                  className={`text-xs ${getStatusColor(request.status)}`}
                >
                  {request.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-4'>
        {actionButtons.map((button) => {
          const canAction = canPerformAction(button.actionType);

          if (!canAction) return null;

          return (
            <div key={button.key}>
              {activeAction === button.actionType ? (
                <div className='space-y-3 p-4 border rounded-lg bg-gray-50'>
                  <FormProvider {...form}>
                    <FormTextArea
                      name='comments'
                      placeholder='Add comments (optional)'
                      rows={3}
                    />
                  </FormProvider>
                  <div className='flex gap-2'>
                    <Button
                      onClick={() =>
                        handleBatchAction(button.actionType, form.getValues())
                      }
                      disabled={isProcessing}
                      variant={button.variant}
                    >
                      {isProcessing ? "Processing..." : "Confirm"}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setActiveAction(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setActiveAction(button.actionType)}
                  variant={button.variant}
                  className='w-full'
                >
                  {button.label}
                </Button>
              )}
            </div>
          );
        })}

        {/* Reject Button */}
        {canPerformAction("reject") && (
          <div className='pt-4 border-t'>
            {activeAction === "reject" ? (
              <div className='space-y-3 p-4 border border-red-200 rounded-lg bg-red-50'>
                <p className='text-sm text-red-700 mb-2'>
                  <strong>Warning:</strong> This will reject the entire project
                  batch for all locations.
                </p>
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
                    onClick={() =>
                      handleBatchAction("reject", form.getValues())
                    }
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Rejecting..." : "Confirm Batch Rejection"}
                  </Button>
                  <Button
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
                onClick={() => setActiveAction("reject")}
                className='w-full'
              >
                Reject Entire Project Batch
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectBatchApproval;

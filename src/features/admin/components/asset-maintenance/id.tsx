"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Card } from "components/ui/card";
import { useParams } from "next/navigation";
import DescriptionCard from "components/DescriptionCard";
import {
  useGetSingleAssetMaintenanceQuery,
  useReviewAssetMaintenance,
  useAuthorizeAssetMaintenance,
  useApproveAssetMaintenance,
} from "@/features/admin/controllers/assetMaintenanceController";
import { LoadingSpinner } from "components/Loading";
import { Textarea } from "components/ui/textarea";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AssetMaintenanceDetailsPage() {
  const { id } = useParams();

  const [comments, setComments] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<
    "review" | "authorize" | "approve" | null
  >(null);

  const {
    data: assetMaintenance,
    isLoading,
    refetch,
  } = useGetSingleAssetMaintenanceQuery(id as string, !!id);

  const {
    reviewAssetMaintenance,
    isLoading: isReviewing,
    isSuccess: reviewSuccess,
  } = useReviewAssetMaintenance(id as string);

  const {
    authorizeAssetMaintenance,
    isLoading: isAuthorizing,
    isSuccess: authorizeSuccess,
  } = useAuthorizeAssetMaintenance(id as string);

  const {
    approveAssetMaintenance,
    isLoading: isApproving,
    isSuccess: approveSuccess,
  } = useApproveAssetMaintenance(id as string);

  const currentStatus = assetMaintenance?.data?.status;

  const handleApproval = async () => {
    if (!comments.trim()) {
      toast.error("Please enter approval comments");
      return;
    }

    try {
      const payload = { comments: comments.trim() };

      switch (approvalAction) {
        case "review":
          await reviewAssetMaintenance(payload);
          break;
        case "authorize":
          await authorizeAssetMaintenance(payload);
          break;
        case "approve":
          await approveAssetMaintenance(payload);
          break;
      }
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to process approval. Please try again.");
    }
  };

  const openApprovalForm = (action: "review" | "authorize" | "approve") => {
    setApprovalAction(action);
    setShowApprovalForm(true);
    setComments("");
  };

  const closeApprovalForm = () => {
    setShowApprovalForm(false);
    setApprovalAction(null);
    setComments("");
  };

  // Handle success for all approval actions
  useEffect(() => {
    if (reviewSuccess || authorizeSuccess || approveSuccess) {
      closeApprovalForm();
      refetch(); // Refresh data to show updated status
    }
  }, [reviewSuccess, authorizeSuccess, approveSuccess, refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Authorized":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextAction = () => {
    switch (currentStatus) {
      case "Pending":
        return {
          action: "review",
          label: "Review",
          color: "bg-blue-500 hover:bg-blue-600",
        };
      case "Reviewed":
        return {
          action: "authorize",
          label: "Authorize",
          color: "bg-purple-500 hover:bg-purple-600",
        };
      case "Authorized":
        return {
          action: "approve",
          label: "Approve",
          color: "bg-green-500 hover:bg-green-600",
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className='space-y-4'>
      <BackNavigation extraText='View Asset Maintenance Ticket' />
      <Card className='p-6 mx-auto space-y-5'>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          assetMaintenance && (
            <>
              {/* Status Badge */}
              <div className='flex justify-between items-center'>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    currentStatus || ""
                  )}`}
                >
                  Status: {currentStatus}
                </div>
                <div className='text-sm text-gray-500'>
                  Created:{" "}
                  {format(
                    new Date(assetMaintenance.data.created_datetime),
                    "dd-MMM-yyyy HH:mm"
                  )}
                </div>
              </div>

              {/* Main Details */}
              <div className='grid grid-cols-3 gap-5 mb-6'>
                <DescriptionCard
                  label='Name of Staff'
                  description={assetMaintenance?.data.staff_name}
                />

                <DescriptionCard
                  label='Department'
                  description={assetMaintenance?.data.department?.name}
                />

                <DescriptionCard
                  label='Location'
                  description={assetMaintenance?.data.location?.name}
                />

                <DescriptionCard
                  label='Asset'
                  description={assetMaintenance?.data.asset?.name}
                />

                <DescriptionCard
                  label='Maintenance Type'
                  description={assetMaintenance?.data.maintenance_type}
                />

                <DescriptionCard
                  label='Rate'
                  description={assetMaintenance?.data.rate}
                />

                <DescriptionCard
                  label='Cost Estimate'
                  description={assetMaintenance?.data.cost_estimate}
                />

                <DescriptionCard
                  label='Total Cost Estimate'
                  description={assetMaintenance?.data.total_cost_estimate}
                />

                <DescriptionCard
                  label='Updated'
                  description={
                    assetMaintenance?.data.updated_datetime
                      ? format(
                          new Date(assetMaintenance.data.updated_datetime),
                          "dd-MMM-yyyy"
                        )
                      : "N/A"
                  }
                />
              </div>

              <DescriptionCard
                label='Description Type'
                description={assetMaintenance?.data.description_type}
              />

              <DescriptionCard
                label='Description of Problem'
                description={assetMaintenance?.data.description}
              />

              <DescriptionCard
                label='Justification for Disposal'
                description={assetMaintenance?.data.disposal_justification}
              />

              {/* Approvals History */}
              {assetMaintenance?.data.approvals &&
                assetMaintenance.data.approvals.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-3'>
                      Approval History
                    </h3>
                    <div className='space-y-3'>
                      {assetMaintenance.data.approvals
                        .sort(
                          (a, b) =>
                            new Date(a.created_datetime).getTime() -
                            new Date(b.created_datetime).getTime()
                        )
                        .map((approval) => (
                          <div
                            key={approval.id}
                            className='bg-gray-50 p-4 rounded-lg border-l-4 border-l-blue-400'
                          >
                            <div className='flex justify-between items-start'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      approval.approval_level === "REVIEW"
                                        ? "bg-blue-100 text-blue-800"
                                        : approval.approval_level ===
                                          "AUTHORIZE"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {approval.approval_level}
                                  </span>
                                </div>

                                {approval.user && (
                                  <div className='text-sm text-gray-700 mb-1'>
                                    <span className='font-medium'>
                                      {approval.approval_level === "REVIEW"
                                        ? "Reviewed by:"
                                        : approval.approval_level ===
                                          "AUTHORIZE"
                                        ? "Authorized by:"
                                        : "Approved by:"}
                                    </span>{" "}
                                    {approval.user.full_name}
                                    {approval.user.email && (
                                      <span className='text-gray-500 ml-2'>
                                        ({approval.user.email})
                                      </span>
                                    )}
                                    {approval.user.employee_id && (
                                      <span className='text-gray-500 ml-1'>
                                        - ID: {approval.user.employee_id}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {approval.comments ? (
                                  <div className='mt-2'>
                                    <span className='text-sm font-medium text-gray-700'>
                                      Comments:
                                    </span>
                                    <p className='text-sm text-gray-600 mt-1 bg-white p-2 rounded border'>
                                      {approval.comments}
                                    </p>
                                  </div>
                                ) : (
                                  <p className='text-sm text-gray-500 italic'>
                                    No comments provided
                                  </p>
                                )}
                              </div>

                              <div className='text-right ml-4'>
                                <span className='text-xs text-gray-500'>
                                  {format(
                                    new Date(approval.created_datetime),
                                    "dd-MMM-yyyy"
                                  )}
                                </span>
                                <br />
                                <span className='text-xs text-gray-400'>
                                  {format(
                                    new Date(approval.created_datetime),
                                    "HH:mm"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Approval Actions */}
              {nextAction && (
                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-sm text-blue-700 mb-3'>
                    This ticket is ready for {nextAction.label.toLowerCase()}.
                  </p>
                  <Button
                    onClick={() => openApprovalForm(nextAction.action as any)}
                    className={`${nextAction.color} text-white`}
                  >
                    {nextAction.label} Ticket
                  </Button>
                </div>
              )}

              {/* Approval Form Modal */}
              {showApprovalForm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                  <Card className='p-6 w-96 max-w-md'>
                    <h3 className='text-lg font-semibold mb-4'>
                      {approvalAction === "review" && "Review Ticket"}
                      {approvalAction === "authorize" && "Authorize Ticket"}
                      {approvalAction === "approve" && "Approve Ticket"}
                    </h3>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Comments *
                        </label>
                        <Textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder='Enter your approval comments...'
                          rows={4}
                          className='w-full'
                        />
                      </div>

                      <div className='flex gap-3 justify-end'>
                        <Button
                          variant='outline'
                          onClick={closeApprovalForm}
                          disabled={isReviewing || isAuthorizing || isApproving}
                        >
                          Cancel
                        </Button>
                        <FormButton
                          onClick={handleApproval}
                          loading={isReviewing || isAuthorizing || isApproving}
                          disabled={!comments.trim()}
                          className={nextAction?.color}
                        >
                          Confirm {nextAction?.label}
                        </FormButton>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {currentStatus === "Approved" && (
                <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                  <p className='text-green-700 font-medium'>
                    ✅ This maintenance ticket has been fully approved and can
                    proceed to execution.
                  </p>
                </div>
              )}
            </>
          )
        )}
      </Card>
    </div>
  );
}

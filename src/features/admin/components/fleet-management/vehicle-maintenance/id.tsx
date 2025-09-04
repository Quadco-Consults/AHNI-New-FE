"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Card } from "components/ui/card";
import { useParams } from "next/navigation";
import DescriptionCard from "components/DescriptionCard";
import {
  useGetSingleVehicleMaintenanceQuery,
  useReviewVehicleMaintenance,
  useAuthorizeVehicleMaintenance,
  useApproveVehicleMaintenance,
} from "@/features/admin/controllers/vehicleMaintenanceController";
import { LoadingSpinner } from "components/Loading";
import { Textarea } from "components/ui/textarea";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ViewVehicleMaintenance() {
  const { id } = useParams();

  const [comments, setComments] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<
    "review" | "authorize" | "approve" | null
  >(null);

  const {
    data: vehicleMaintenance,
    isLoading,
    refetch,
  } = useGetSingleVehicleMaintenanceQuery(id as string, !!id);

  const {
    reviewVehicleMaintenance,
    isLoading: isReviewing,
    isSuccess: reviewSuccess,
  } = useReviewVehicleMaintenance(id as string);

  const {
    authorizeVehicleMaintenance,
    isLoading: isAuthorizing,
    isSuccess: authorizeSuccess,
  } = useAuthorizeVehicleMaintenance(id as string);

  const {
    approveVehicleMaintenance,
    isLoading: isApproving,
    isSuccess: approveSuccess,
  } = useApproveVehicleMaintenance(id as string);

  const currentStatus = vehicleMaintenance?.data?.status;

  const handleApproval = async () => {
    if (!comments.trim()) {
      toast.error("Please enter approval comments");
      return;
    }

    try {
      const payload = { comments: comments.trim() };

      switch (approvalAction) {
        case "review":
          await reviewVehicleMaintenance(payload);
          break;
        case "authorize":
          await authorizeVehicleMaintenance(payload);
          break;
        case "approve":
          await approveVehicleMaintenance(payload);
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
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "AUTHORIZED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextAction = () => {
    switch (currentStatus) {
      case "PENDING":
        return {
          action: "review",
          label: "Review",
          color: "bg-blue-500 hover:bg-blue-600",
        };
      case "REVIEWED":
        return {
          action: "authorize",
          label: "Authorize",
          color: "bg-purple-500 hover:bg-purple-600",
        };
      case "AUTHORIZED":
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
      <BackNavigation extraText='View Vehicle Maintenance Ticket' />
      <Card className='p-6 mx-auto space-y-5'>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          vehicleMaintenance && (
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
                    new Date(vehicleMaintenance.data.created_datetime),
                    "dd-MMM-yyyy HH:mm"
                  )}
                </div>
              </div>

              {/* Main Details */}
              <div className='grid grid-cols-3 gap-5 mb-6'>
                <DescriptionCard
                  label='Asset'
                  description={vehicleMaintenance?.data.asset.name}
                />

                <DescriptionCard
                  label='Maintenance Type'
                  description={vehicleMaintenance?.data.maintenance_type}
                />

                <DescriptionCard
                  label='FCO Number'
                  description={vehicleMaintenance?.data.fco.name}
                />

                <DescriptionCard
                  label='Cost Estimate'
                  description={`N${vehicleMaintenance?.data.cost_estimate}`}
                />

                <DescriptionCard
                  label='Created By'
                  description={vehicleMaintenance?.data.created_by || "N/A"}
                />

                <DescriptionCard
                  label='Updated'
                  description={
                    vehicleMaintenance?.data.updated_datetime
                      ? format(
                          new Date(vehicleMaintenance.data.updated_datetime),
                          "dd-MMM-yyyy"
                        )
                      : "N/A"
                  }
                />
              </div>

              <DescriptionCard
                label='Description'
                description={vehicleMaintenance?.data.description}
              />

              {/* Approvals History */}
              {vehicleMaintenance?.data.approvals &&
                vehicleMaintenance.data.approvals.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-3'>
                      Approval History
                    </h3>
                    <div className='space-y-3'>
                      {vehicleMaintenance.data.approvals.map((approval) => (
                        <div
                          key={approval.id}
                          className='bg-gray-50 p-4 rounded-lg'
                        >
                          <div className='flex justify-between items-start'>
                            <div>
                              <span className='font-medium'>
                                {approval.approval_level}
                              </span>
                              {approval.comments && (
                                <p className='text-sm text-gray-600 mt-1'>
                                  {approval.comments}
                                </p>
                              )}
                            </div>
                            <span className='text-xs text-gray-500'>
                              {format(
                                new Date(approval.created_datetime),
                                "dd-MMM-yyyy HH:mm"
                              )}
                            </span>
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

              {currentStatus === "APPROVED" && (
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

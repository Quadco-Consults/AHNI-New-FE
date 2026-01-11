"use client";

import BackNavigation from "@/components/atoms/BackNavigation";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import DescriptionCard from "@/components/DescriptionCard";
import {
  useGetSingleVehicleMaintenanceQuery,
  useReviewVehicleMaintenance,
  useAuthorizeVehicleMaintenance,
  useApproveVehicleMaintenance,
} from "@/features/admin/controllers/vehicleMaintenanceController";
import { LoadingSpinner } from "@/components/Loading";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormButton from "@/components/FormButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ViewVehicleMaintenance() {
  const { id } = useParams() as { id: string };

  const [comments, setComments] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<
    "review" | "authorize" | "approve" | null
  >(null);

  // Helper function to safely render user information
  const renderUserInfo = (user: any): string => {
    if (!user) return "N/A";
    if (typeof user === 'string') return user;
    if (typeof user === 'object') {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim()
        || user.fullName || user.full_name || "N/A";
    }
    return "N/A";
  };

  // Helper function to safely render object or string values
  const renderValue = (value: any, fallback: string = "N/A"): string => {
    if (!value) return fallback;
    if (typeof value === 'object') {
      return value?.name || value?.title || fallback;
    }
    return String(value);
  };

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

              {/* Enhanced Workflow Section */}
              <div className='mt-6'>
                <h3 className='text-lg font-bold text-blue-800 mb-4'>
                  Approval Workflow
                </h3>

                {/* Reviewer Section */}
                {vehicleMaintenance?.data.reviewer && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-md font-bold text-blue-800 mb-3">👤 Reviewer Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Name</p>
                        <p className="text-base">{renderUserInfo(vehicleMaintenance.data.reviewer)}</p>
                      </div>
                      {typeof vehicleMaintenance.data.reviewer === 'object' && (
                        <>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Email</p>
                            <p className="text-base">{vehicleMaintenance.data.reviewer.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Department</p>
                            <p className="text-base">{renderValue(vehicleMaintenance.data.reviewer.department)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Position</p>
                            <p className="text-base">{renderValue(vehicleMaintenance.data.reviewer.position) || renderValue(vehicleMaintenance.data.reviewer.designation)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Authorizer Section */}
                {vehicleMaintenance?.data.authorizer && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="text-md font-bold text-purple-800 mb-3">🔐 Authorizer Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Name</p>
                        <p className="text-base">{renderUserInfo(vehicleMaintenance.data.authorizer)}</p>
                      </div>
                      {typeof vehicleMaintenance.data.authorizer === 'object' && (
                        <>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Email</p>
                            <p className="text-base">{vehicleMaintenance.data.authorizer.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Department</p>
                            <p className="text-base">{renderValue(vehicleMaintenance.data.authorizer.department)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Position</p>
                            <p className="text-base">{renderValue(vehicleMaintenance.data.authorizer.position) || renderValue(vehicleMaintenance.data.authorizer.designation)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Approver Section */}
                {vehicleMaintenance?.data.approver && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-md font-bold text-green-800 mb-3">✅ Approver Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Name</p>
                        <p className="text-base">{renderUserInfo(vehicleMaintenance.data.approver)}</p>
                      </div>
                      {typeof vehicleMaintenance.data.approver === 'object' && (
                        <>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Email</p>
                            <p className="text-base">{vehicleMaintenance.data.approver.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Department</p>
                            <p className="text-base">{renderValue(vehicleMaintenance.data.approver.department)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Position</p>
                            <p className="text-base">{renderValue(vehicleMaintenance.data.approver.position) || renderValue(vehicleMaintenance.data.approver.designation)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Approval History */}
                {vehicleMaintenance?.data.approvals &&
                  vehicleMaintenance.data.approvals.length > 0 && (
                    <div className='mt-6'>
                      <h4 className='text-md font-bold text-gray-800 mb-3'>
                        📋 Approval History
                      </h4>
                      <div className='space-y-4'>
                        {vehicleMaintenance.data.approvals.map((approval) => {
                          // Determine the background color based on approval level
                          const getApprovalColor = (level: string) => {
                            switch (level?.toUpperCase()) {
                              case 'REVIEW':
                                return 'bg-blue-50 border-blue-200';
                              case 'AUTHORIZE':
                                return 'bg-purple-50 border-purple-200';
                              case 'APPROVE':
                                return 'bg-green-50 border-green-200';
                              default:
                                return 'bg-gray-50 border-gray-200';
                            }
                          };

                          const getApprovalTextColor = (level: string) => {
                            switch (level?.toUpperCase()) {
                              case 'REVIEW':
                                return 'text-blue-800';
                              case 'AUTHORIZE':
                                return 'text-purple-800';
                              case 'APPROVE':
                                return 'text-green-800';
                              default:
                                return 'text-gray-800';
                            }
                          };

                          // Get user details based on approval level
                          const getUserForApproval = (level: string) => {
                            switch (level?.toUpperCase()) {
                              case 'REVIEW':
                                return vehicleMaintenance?.data.reviewer;
                              case 'AUTHORIZE':
                                return vehicleMaintenance?.data.authorizer;
                              case 'APPROVE':
                                return vehicleMaintenance?.data.approver;
                              default:
                                return null;
                            }
                          };

                          const approvalUser = getUserForApproval(approval.approval_level);

                          return (
                            <div
                              key={approval.id}
                              className={`p-4 rounded-lg border ${getApprovalColor(approval.approval_level)}`}
                            >
                              <div className='flex justify-between items-start mb-3'>
                                <span className={`font-bold text-lg ${getApprovalTextColor(approval.approval_level)}`}>
                                  {approval.approval_level}
                                </span>
                                <span className='text-xs text-gray-500 bg-white px-3 py-1 rounded-full border'>
                                  {format(
                                    new Date(approval.created_datetime),
                                    "dd-MMM-yyyy HH:mm"
                                  )}
                                </span>
                              </div>

                              {/* User Details */}
                              {approvalUser && (
                                <div className="mb-3 p-3 bg-white rounded border">
                                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Approved By:</h5>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-600">Name</p>
                                      <p className="text-sm">{renderUserInfo(approvalUser)}</p>
                                    </div>
                                    {typeof approvalUser === 'object' && (
                                      <>
                                        <div>
                                          <p className="text-xs font-semibold text-gray-600">Email</p>
                                          <p className="text-sm">{approvalUser.email || "N/A"}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs font-semibold text-gray-600">Department</p>
                                          <p className="text-sm">{renderValue(approvalUser.department)}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs font-semibold text-gray-600">Position</p>
                                          <p className="text-sm">{renderValue(approvalUser.position) || renderValue(approvalUser.designation)}</p>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Comments */}
                              {approval.comments && (
                                <div className='mt-2'>
                                  <p className='text-sm font-semibold text-gray-600 mb-1'>Comments:</p>
                                  <p className='text-sm text-gray-700 bg-white p-3 rounded border'>
                                    {approval.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>

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

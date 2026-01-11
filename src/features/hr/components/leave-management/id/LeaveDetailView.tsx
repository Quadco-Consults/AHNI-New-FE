"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GoBack from "@/components/GoBack";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  MessageSquare,
  History,
  ArrowRight,
} from "lucide-react";
import {
  useGetLeaveRequest,
  useApproveLeaveRequest,
  useRejectLeaveRequest,
  useCancelLeaveRequest,
  useGetLeaveWorkflow,
} from "@/features/hr/controllers/leaveRequestController";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { normalizeLeaveRequestEmployee } from "../../../utils/normalizeLeaveData";
import { getCurrentUser } from "@/utils/auth";

interface LeaveDetailViewProps {
  id: string;
}

const LeaveDetailView: React.FC<LeaveDetailViewProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComments, setRejectComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch leave request data
  const { data: leaveRequestData, isLoading, error, refetch } = useGetLeaveRequest(id, !!id);
  const rawLeaveRequest = leaveRequestData?.data;

  // Normalize the employee data using shared utility
  const leaveRequest = React.useMemo(() => {
    return normalizeLeaveRequestEmployee(rawLeaveRequest);
  }, [rawLeaveRequest]);

  // Debug logging
  React.useEffect(() => {
    if (rawLeaveRequest) {
      console.log("=== LEAVE REQUEST DEBUG ===");
      console.log("Raw data:", JSON.stringify(rawLeaveRequest, null, 2));
      console.log("Employee field type:", typeof rawLeaveRequest.employee);
      console.log("Employee value:", rawLeaveRequest.employee);
      console.log("Normalized employee:", leaveRequest?.employee);
      console.log("==========================");
    }
  }, [rawLeaveRequest, leaveRequest]);

  // Fetch workflow - disabled for now as workflow endpoint returns 404
  // TODO: Enable when workflow feature is fully implemented on backend
  const { data: workflowData, error: workflowError } = useGetLeaveWorkflow(id, false); // Disabled
  const workflow = workflowData?.data;

  // Get current user for permission checks
  const currentUser = React.useMemo(() => getCurrentUser(), []);

  // Get the leave request status
  const status = leaveRequest?.status || "pending_approval";

  // Check if current user can approve this request
  const canApprove = React.useMemo(() => {
    if (status !== 'pending_approval') return false;
    if (!currentUser) return false;

    // User can approve if they are:
    // 1. Admin or HR role
    if (currentUser.is_admin || currentUser.is_superuser || currentUser.role === 'HR' || currentUser.role === 'Admin') {
      return true;
    }

    // 2. Designated approver for this request
    if (leaveRequest?.approver?.id === currentUser.id) {
      return true;
    }

    // 3. Current approver in workflow (multi-level approval)
    if (leaveRequest?.current_approver?.id === currentUser.id) {
      return true;
    }

    // 4. Employee's manager
    if (leaveRequest?.employee?.manager?.id === currentUser.id) {
      return true;
    }

    return false;
  }, [status, currentUser, leaveRequest]);

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      const response = await AxiosWithToken.post(`hr/leave-request/${id}/approve/`, {
        comments: approvalComments || undefined,
      });

      await queryClient.invalidateQueries({ queryKey: ["leave-request", id] });
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      // Check if this is a multi-level approval workflow
      if (response.data?.status) {
        toast.success(response.data.message || "Leave request approved successfully");

        // Show info if more approvals are needed (multi-level workflow)
        if (response.data.completed === false && response.data.next_approver) {
          const nextApproverName = response.data.next_approver.full_name ||
            `${response.data.next_approver.first_name} ${response.data.next_approver.last_name}`;
          toast.info(
            `Approved at your level. Awaiting approval from ${nextApproverName}`,
            { duration: 5000 }
          );
        } else if (response.data.completed === true) {
          toast.success("Leave request fully approved!", { duration: 5000 });
        }
      } else {
        toast.success("Leave request approved successfully");
      }

      setShowApproveDialog(false);
      setApprovalComments("");
      refetch();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to approve";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await AxiosWithToken.post(`hr/leave-request/${id}/reject/`, {
        reason: rejectReason.trim(),
      });

      await queryClient.invalidateQueries({ queryKey: ["leave-request", id] });
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      if (response.data?.status) {
        toast.success(response.data.message || "Leave request rejected");
      } else {
        toast.success("Leave request rejected");
      }

      setShowRejectDialog(false);
      setRejectReason("");
      setRejectComments("");
      refetch();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to reject";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this leave request?")) return;

    try {
      setIsProcessing(true);
      await AxiosWithToken.post(`hr/leave-request/${id}/cancel/`);

      await queryClient.invalidateQueries({ queryKey: ["leave-request", id] });
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      toast.success("Leave request cancelled");
      refetch();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to cancel";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);

      // Log leave request details for debugging
      console.log("=== LEAVE SUBMISSION DEBUG ===");
      console.log("Leave Request ID:", id);
      console.log("Leave Type:", leaveRequest?.leave_type);
      console.log("Status:", leaveRequest?.status);

      // Check if workflows exist for this leave type
      try {
        const workflowsResponse = await AxiosWithToken.get("hr/approval-workflows/");
        const workflows = workflowsResponse.data?.data?.results || workflowsResponse.data?.data || [];

        // The workflow API returns leave_type as a string ID, not an object
        // The leave request has leave_type as an object with id
        const leaveTypeId = typeof leaveRequest?.leave_type === 'object'
          ? leaveRequest?.leave_type?.id
          : leaveRequest?.leave_type;

        const matchingWorkflow = workflows.find((w: any) => {
          // Handle both string and object formats for workflow leave_type
          const workflowLeaveTypeId = typeof w.leave_type === 'object'
            ? w.leave_type?.id
            : w.leave_type;
          return workflowLeaveTypeId === leaveTypeId;
        });

        console.log("All workflows:", workflows);
        console.log("Leave type ID to match:", leaveTypeId);
        console.log("Matching workflow for this leave type:", matchingWorkflow);

        if (!matchingWorkflow) {
          const leaveTypeName = leaveRequest?.leave_type
            ? (typeof leaveRequest.leave_type.name === 'string'
                ? leaveRequest.leave_type.name
                : typeof leaveRequest.leave_type.name === 'object' && leaveRequest.leave_type.name?.name
                ? leaveRequest.leave_type.name.name
                : leaveRequest.leave_type.leave_type_name || 'Unknown Leave Type')
            : 'Unknown';
          toast.error(
            `No workflow found for leave type "${leaveTypeName}". Please create a workflow first.`,
            { duration: 5000 }
          );
          setIsProcessing(false);
          return;
        }

        // Validation: Check if approvers exist
        if (!matchingWorkflow.approvers || matchingWorkflow.approvers.length === 0) {
          const leaveTypeName = leaveRequest?.leave_type
            ? (typeof leaveRequest.leave_type.name === 'string'
                ? leaveRequest.leave_type.name
                : typeof leaveRequest.leave_type.name === 'object' && leaveRequest.leave_type.name?.name
                ? leaveRequest.leave_type.name.name
                : leaveRequest.leave_type.leave_type_name || 'Unknown Leave Type')
            : 'Unknown';
          toast.error(
            `The workflow for "${leaveTypeName}" has no approvers configured. Please add approvers to the workflow.`,
            { duration: 5000 }
          );
          setIsProcessing(false);
          return;
        }

        console.log("Workflow validation passed. Approvers:", matchingWorkflow.approvers);
      } catch (workflowCheckError) {
        console.error("Error checking workflows:", workflowCheckError);
      }
      console.log("==============================");

      await AxiosWithToken.post(`hr/leave-request/${id}/submit/`);

      await queryClient.invalidateQueries({ queryKey: ["leave-request", id] });
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      toast.success("Leave request submitted successfully");
      refetch();
    } catch (error: any) {
      console.error("Error submitting leave request:", error);
      console.error("Leave request data:", leaveRequest);
      console.error("Full error response:", error.response);

      const errorMessage = error.response?.data?.message || error.message || "Failed to submit";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitAndApprove = async () => {
    try {
      setIsProcessing(true);

      // First submit
      await AxiosWithToken.post(`hr/leave-request/${id}/submit/`);
      toast.success("Leave request submitted");

      // Then approve
      await AxiosWithToken.post(`hr/leave-request/${id}/approve/`, {
        comments: approvalComments,
      });

      await queryClient.invalidateQueries({ queryKey: ["leave-request", id] });
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      toast.success("Leave request submitted and approved successfully");
      setShowApproveDialog(false);
      setApprovalComments("");
      refetch();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit and approve";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading leave request...</span>
      </div>
    );
  }

  // Error state
  if (error || !leaveRequest) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Failed to load leave request</p>
          <p className="text-sm text-gray-600">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs: any = {
      draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
      pending_approval: { label: "Pending Approval", color: "bg-amber-100 text-amber-800", icon: Clock },
      approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
      cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: XCircle },
      taken: { label: "Taken", color: "bg-blue-100 text-blue-800", icon: Calendar },
    };
    return configs[status] || configs.draft;
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Request Details</h1>
          <p className="text-gray-600">Request ID: {id}</p>
        </div>
        <Badge className={cn("px-4 py-2", statusConfig.color)}>
          <StatusIcon className="w-4 h-4 mr-2" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Employee Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">
                  {leaveRequest.employee?.first_name} {leaveRequest.employee?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{leaveRequest.employee?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium">{leaveRequest.employee?.employee_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">
                  {(() => {
                    const dept = leaveRequest.employee?.department;
                    return dept
                      ? (typeof dept === 'string'
                          ? dept
                          : typeof dept === 'object' && dept?.name
                          ? dept.name
                          : 'Unknown Department')
                      : 'N/A';
                  })()}
                </p>
              </div>
            </div>
          </Card>

          {/* Leave Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Leave Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Leave Type</p>
                <p className="font-medium text-lg">
                  {(() => {
                    const leaveType = leaveRequest.leave_type;
                    return leaveType
                      ? (typeof leaveType.name === 'string'
                          ? leaveType.name
                          : typeof leaveType.name === 'object' && leaveType.name?.name
                          ? leaveType.name.name
                          : leaveType.leave_type_name || 'Unknown Leave Type')
                      : 'N/A';
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="font-medium text-lg">{leaveRequest.number_of_days || 0} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">From Date</p>
                <p className="font-medium">
                  {leaveRequest.from_date ? format(new Date(leaveRequest.from_date), "MMMM dd, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To Date</p>
                <p className="font-medium">
                  {leaveRequest.to_date ? format(new Date(leaveRequest.to_date), "MMMM dd, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration Type</p>
                <p className="font-medium capitalize">
                  {leaveRequest.duration?.replace(/_/g, " ") || "Full Day"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency Leave</p>
                <p className="font-medium">{leaveRequest.is_emergency ? "Yes" : "No"}</p>
              </div>
            </div>
          </Card>

          {/* Reason */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Reason for Leave</h3>
            </div>
            <p className="text-gray-700">{leaveRequest.reason || "No reason provided"}</p>
          </Card>

          {/* Rejection Reason */}
          {leaveRequest.rejection_reason && (
            <Card className="p-6 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Rejection Reason</h3>
              </div>
              <p className="text-red-700">{leaveRequest.rejection_reason}</p>
              {leaveRequest.comments && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-sm text-gray-600">Additional Comments:</p>
                  <p className="text-red-600">{leaveRequest.comments}</p>
                </div>
              )}
            </Card>
          )}

          {/* Workflow Steps */}
          {workflow && workflow.steps && workflow.steps.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Approval Workflow</h3>
              </div>
              <div className="space-y-3">
                {workflow.steps.map((step: any, index: number) => (
                  <div key={step.id || index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {step.status === "approved" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : step.status === "rejected" ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Step {step.step_number}: {step.approver_role}
                          </p>
                          {step.approver_name && (
                            <p className="text-sm text-gray-600">{step.approver_name}</p>
                          )}
                        </div>
                        <Badge
                          className={cn(
                            step.status === "approved" && "bg-green-100 text-green-800",
                            step.status === "rejected" && "bg-red-100 text-red-800",
                            step.status === "pending" && "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {step.status}
                        </Badge>
                      </div>
                      {step.comments && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{step.comments}"</p>
                      )}
                      {step.approved_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(step.approved_at), "MMM dd, yyyy 'at' hh:mm a")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              {leaveRequest.created_at && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(leaveRequest.created_at), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                </div>
              )}

              {leaveRequest.submitted_at && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(leaveRequest.submitted_at), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                </div>
              )}

              {leaveRequest.approved_at && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Approved</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(leaveRequest.approved_at), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                    {leaveRequest.approved_by && (
                      <p className="text-xs text-gray-500">By: {leaveRequest.approved_by}</p>
                    )}
                  </div>
                </div>
              )}

              {leaveRequest.rejected_at && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rejected</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(leaveRequest.rejected_at), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Actions for Draft Status */}
          {status === "draft" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Submit for Approval
                </Button>

                <Button variant="outline" className="w-full" onClick={handleCancel} disabled={isProcessing}>
                  Cancel Request
                </Button>
              </div>
            </Card>
          )}

          {/* Actions for Pending Approval Status */}
          {status === "pending_approval" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {canApprove ? (
                  <>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setShowApproveDialog(true)}
                      disabled={isProcessing}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Request
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setShowRejectDialog(true)}
                      disabled={isProcessing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Request
                    </Button>
                  </>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">Pending Approval</p>
                        <p className="text-xs text-amber-700 mt-1">
                          You don't have permission to approve this leave request.
                          {leaveRequest?.current_approver && (
                            <span className="block mt-1">
                              Current approver: {leaveRequest.current_approver.first_name} {leaveRequest.current_approver.last_name}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={handleCancel} disabled={isProcessing}>
                  Cancel Request
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {status === "draft" ? "Submit & Approve Leave Request" : "Approve Leave Request"}
            </DialogTitle>
            <DialogDescription>
              {status === "draft"
                ? "This will submit and immediately approve the leave request."
                : "You are about to approve this leave request. You can add optional comments below."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Employee:</span>
                  <span>
                    {leaveRequest.employee?.first_name} {leaveRequest.employee?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Leave Type:</span>
                  <span>
                    {(() => {
                      const leaveType = leaveRequest.leave_type;
                      return leaveType
                        ? (typeof leaveType.name === 'string'
                            ? leaveType.name
                            : typeof leaveType.name === 'object' && leaveType.name?.name
                            ? leaveType.name.name
                            : leaveType.leave_type_name || 'Unknown Leave Type')
                        : 'N/A';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{leaveRequest.number_of_days} days</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="approval-comments">Comments (Optional)</Label>
              <Textarea
                id="approval-comments"
                placeholder="Add any comments for the employee..."
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={status === "draft" ? handleSubmitAndApprove : handleApprove}
              disabled={isProcessing}
            >
              {isProcessing
                ? (status === "draft" ? "Submitting & Approving..." : "Approving...")
                : (status === "draft" ? "Submit & Approve" : "Approve Leave")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request. This will be communicated to the employee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Employee:</span>
                  <span>
                    {leaveRequest.employee?.first_name} {leaveRequest.employee?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Leave Type:</span>
                  <span>
                    {(() => {
                      const leaveType = leaveRequest.leave_type;
                      return leaveType
                        ? (typeof leaveType.name === 'string'
                            ? leaveType.name
                            : typeof leaveType.name === 'object' && leaveType.name?.name
                            ? leaveType.name.name
                            : leaveType.leave_type_name || 'Unknown Leave Type')
                        : 'N/A';
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="reject-reason">Reason for Rejection *</Label>
              <Textarea
                id="reject-reason"
                placeholder="e.g., Insufficient leave balance, Conflicting schedules..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="reject-comments">Additional Comments (Optional)</Label>
              <Textarea
                id="reject-comments"
                placeholder="Any additional information..."
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
                setRejectComments("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveDetailView;

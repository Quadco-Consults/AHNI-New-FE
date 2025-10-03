/* eslint-disable no-unused-vars */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import GoBack from "components/GoBack";
import { cn } from "lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import LeaveHistory from "./LeaveHistory";
import { Button } from "components/ui/button";
import { ChevronDown, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
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
} from "components/ui/dialog";
import { Textarea } from "components/ui/textarea";

const LeaveManagement: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const leaveRequestId = params?.id as string;

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComments, setRejectComments] = useState("");

  // Fetch leave request data
  const { data: leaveRequestData, isLoading, error, refetch } = useGetLeaveRequest(
    leaveRequestId,
    !!leaveRequestId
  );
  const leaveRequest = leaveRequestData?.data;

  // Fetch workflow
  const { data: workflowData } = useGetLeaveWorkflow(leaveRequestId, !!leaveRequestId);
  const workflow = workflowData?.data;

  // Mutations
  const { approveLeaveRequest, isLoading: isApproving } = useApproveLeaveRequest(leaveRequestId);
  const { rejectLeaveRequest, isLoading: isRejecting } = useRejectLeaveRequest(leaveRequestId);
  const { cancelLeaveRequest, isLoading: isCancelling } = useCancelLeaveRequest(leaveRequestId);

  const handleApprove = async () => {
    try {
      await approveLeaveRequest("Approved");
      toast.success("Leave request approved successfully");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectLeaveRequest(rejectReason, rejectComments);
      toast.success("Leave request rejected");
      setShowRejectDialog(false);
      setRejectReason("");
      setRejectComments("");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this leave request?")) return;

    try {
      await cancelLeaveRequest();
      toast.success("Leave request cancelled");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel");
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
        </div>
      </div>
    );
  }

  const status = leaveRequest.status || "pending";
  const TABS = [
    {
      label: "Leave Details",
      value: "details",
      // @ts-ignore
      children: (
        <>
          <div className='flex w-full'>
            <h3 className='text-2xl font-bold mb-5 text-start'>
              {leaveRequest.employee?.first_name} {leaveRequest.employee?.last_name}
            </h3>
          </div>

          <Card>
            <div className='grid grid-cols-2 gap-x-2 gap-y-8'>
              <section>
                <h4 className='font-bold mb-3 text-start'>Type</h4>
                <p className='text-sm'>{leaveRequest.leave_type?.name || 'N/A'}</p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>No of Days</h4>
                <p className='text-sm'>{leaveRequest.number_of_days || 0}</p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>Duration</h4>
                <p className='text-sm capitalize'>{leaveRequest.duration?.replace(/_/g, ' ') || 'Full Day'}</p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>From</h4>
                <p className='text-sm'>
                  {leaveRequest.from_date ? format(new Date(leaveRequest.from_date), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>To</h4>
                <p className='text-sm'>
                  {leaveRequest.to_date ? format(new Date(leaveRequest.to_date), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </section>

              <section>
                <h4 className='font-bold mb-3 text-start'>Applied Date</h4>
                <p className='text-sm'>
                  {leaveRequest.created_at ? format(new Date(leaveRequest.created_at), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </section>

              <section className='col-span-2'>
                <h4 className='font-bold mb-5 text-start'>Reason</h4>
                <p className='text-sm'>{leaveRequest.reason || 'No reason provided'}</p>
              </section>

              {leaveRequest.rejection_reason && (
                <section className='col-span-2'>
                  <h4 className='font-bold mb-3 text-start text-red-600'>Rejection Reason</h4>
                  <p className='text-sm text-red-600'>{leaveRequest.rejection_reason}</p>
                </section>
              )}
            </div>
          </Card>

          <Card className='mt-4'>
            <h4 className='font-bold mb-3 text-start'>Leave Approval Status</h4>
            <div className='w-full flex gap-2 align-center'>
              <Badge
                variant='default'
                className={cn(
                  "p-1 rounded-lg",
                  status === "approved"
                    ? "bg-green-200 text-green-500"
                    : status === "rejected"
                    ? "bg-red-200 text-red-500"
                    : status === "pending" || status === "submitted"
                    ? "bg-yellow-200 text-yellow-500"
                    : status === "cancelled"
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-200 text-blue-500"
                )}
              >
                {status}
              </Badge>

              {status !== "approved" && status !== "rejected" && status !== "cancelled" && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant='default'
                    className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                    onClick={handleApprove}
                    disabled={isApproving}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isApproving ? 'Approving...' : 'Approve'}
                  </Button>

                  <Button
                    variant='destructive'
                    className='flex items-center gap-2'
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isRejecting}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>

                  <Button
                    variant='outline'
                    className='flex items-center gap-2'
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    Cancel Request
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Workflow Steps */}
          {workflow && (
            <Card className='mt-4'>
              <h4 className='font-bold mb-3 text-start'>Approval Workflow</h4>
              <div className='space-y-3'>
                {workflow.steps?.map((step: any, index: number) => (
                  <div key={step.id || index} className='flex items-center gap-3 p-3 border rounded-lg'>
                    <div className='flex-1'>
                      <p className='font-medium'>Step {step.step_number}: {step.approver_role}</p>
                      {step.approver_name && <p className='text-sm text-gray-600'>{step.approver_name}</p>}
                      {step.comments && <p className='text-sm text-gray-600 italic'>"{step.comments}"</p>}
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
                ))}
              </div>
            </Card>
          )}
        </>
      ),
    },
    {
      label: "Leave History",
      value: "history",
      // @ts-ignore
      children: (
        <>
          <div className='flex w-full'>
            <h3 className='text-2xl font-bold mb-5 text-start'>
              {leaveRequest.employee?.first_name} {leaveRequest.employee?.last_name}
            </h3>
          </div>

          <LeaveHistory />
        </>
      ),
    },
  ];

  return (
    <div className='flex flex-col justify-center gap-y-[1rem]'>
      <div className='w-full flex gap-4 items-center mb-2'>
        <GoBack />
      </div>

      <Tabs defaultValue='details'>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className='px-6'>{tab.children}</Card>
          </TabsContent>
        ))}
      </Tabs>

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
            <div>
              <label className="text-sm font-medium">Reason *</label>
              <Textarea
                placeholder="e.g., Insufficient leave balance, Conflicting schedules..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Additional Comments (Optional)</label>
              <Textarea
                placeholder="Any additional information..."
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                className="mt-1"
                rows={3}
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;

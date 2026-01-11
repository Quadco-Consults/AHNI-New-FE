"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Bell,
  User,
  Calendar,
  ArrowRight,
  FileCheck,
  RotateCcw,
} from "lucide-react";

import {
  ApprovalType,
  ApprovalTypeLabels,
  ApprovalStatus,
  ApprovalStatusLabels,
  ISiteVisitApproval,
} from "@/features/programs/types/site-visit";

import {
  useGetSiteVisitApprovals,
  useApprovalAction,
  useQuickApprove,
  useQuickReject,
  useGetApprovalHistory,
  useSendApprovalReminder,
} from "@/features/programs/controllers/siteVisitController";

// Form validation schemas
const ApprovalActionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_REVISION']),
  comments: z.string().optional(),
  rejection_reason: z.string().optional(),
});

const QuickActionSchema = z.object({
  comments: z.string().optional(),
});

type ApprovalActionFormData = z.infer<typeof ApprovalActionSchema>;
type QuickActionFormData = z.infer<typeof QuickActionSchema>;

interface ApprovalWorkflowProps {
  siteVisitId: string;
  currentUserCanApprove?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

const ApprovalWorkflow = ({
  siteVisitId,
  currentUserCanApprove = false,
  onStatusChange,
}: ApprovalWorkflowProps) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ISiteVisitApproval | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise'>('approve');

  // Fetch approvals data
  const {
    data: approvalsData,
    isLoading: isApprovalsLoading,
    error: approvalsError,
  } = useGetSiteVisitApprovals(siteVisitId);

  const {
    data: historyData,
    isLoading: isHistoryLoading,
  } = useGetApprovalHistory(siteVisitId);

  // Mutations
  const approvalActionMutation = useApprovalAction(selectedApproval?.id || "");
  const quickApproveMutation = useQuickApprove(selectedApproval?.id || "");
  const quickRejectMutation = useQuickReject(selectedApproval?.id || "");
  const sendReminderMutation = useSendApprovalReminder(selectedApproval?.id || "");

  // Form setup
  const actionForm = useForm<ApprovalActionFormData>({
    resolver: zodResolver(ApprovalActionSchema),
    defaultValues: {
      action: 'APPROVE',
      comments: "",
      rejection_reason: "",
    },
  });

  const quickForm = useForm<QuickActionFormData>({
    resolver: zodResolver(QuickActionSchema),
    defaultValues: {
      comments: "",
    },
  });

  const approvals = approvalsData?.data?.results || [];
  const history = historyData?.data || [];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case ApprovalStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case ApprovalStatus.NEEDS_REVISION:
        return <RotateCcw className="h-5 w-5 text-orange-600" />;
      case ApprovalStatus.PENDING:
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadgeVariant = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return "default";
      case ApprovalStatus.REJECTED:
        return "destructive";
      case ApprovalStatus.NEEDS_REVISION:
        return "secondary";
      case ApprovalStatus.PENDING:
      default:
        return "outline";
    }
  };

  const getApprovalTypeColor = (type: ApprovalType) => {
    switch (type) {
      case ApprovalType.REVIEW:
        return "bg-blue-100 text-blue-800";
      case ApprovalType.AUTHORIZATION:
        return "bg-purple-100 text-purple-800";
      case ApprovalType.APPROVAL:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprovalAction = async (data: ApprovalActionFormData) => {
    if (!selectedApproval) return;

    try {
      await approvalActionMutation.mutateAsync({
        action: data.action,
        comments: data.comments,
        rejection_reason: data.action === 'REJECT' ? data.rejection_reason : undefined,
      });

      toast.success(`Approval ${data.action.toLowerCase()}d successfully`);
      setIsActionModalOpen(false);
      setSelectedApproval(null);
      actionForm.reset();

      if (onStatusChange) {
        onStatusChange(data.action);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process approval action");
    }
  };

  const handleQuickApprove = async (approval: ISiteVisitApproval) => {
    try {
      setSelectedApproval(approval);
      await quickApproveMutation.mutateAsync("Quick approval");
      toast.success("Approved successfully");
      setSelectedApproval(null);

      if (onStatusChange) {
        onStatusChange('APPROVED');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve");
      setSelectedApproval(null);
    }
  };

  const handleSendReminder = async (approval: ISiteVisitApproval) => {
    try {
      setSelectedApproval(approval);
      await sendReminderMutation.mutateAsync();
      toast.success("Reminder sent successfully");
      setSelectedApproval(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reminder");
      setSelectedApproval(null);
    }
  };

  const openActionModal = (approval: ISiteVisitApproval, action: 'approve' | 'reject' | 'revise') => {
    setSelectedApproval(approval);
    setActionType(action);
    actionForm.setValue('action', action.toUpperCase() as any);
    setIsActionModalOpen(true);
  };

  if (isApprovalsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (approvalsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
            <p>Error loading approval workflow</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Approval Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No approval workflow configured</p>
              <p className="text-sm mt-1">Approval workflow will be created when submitted</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvals.map((approval, index) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {/* Step Number */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {index + 1}
                    </div>

                    {/* Status Icon */}
                    {getStatusIcon(approval.status)}

                    {/* Approval Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge className={getApprovalTypeColor(approval.approval_type)}>
                          {ApprovalTypeLabels[approval.approval_type]}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(approval.status)}>
                          {ApprovalStatusLabels[approval.status]}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" />
                          <span>{approval.approver_name || `Approver ID: ${approval.approver}`}</span>
                        </div>

                        {approval.approval_date && (
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(approval.approval_date)}</span>
                          </div>
                        )}

                        {approval.days_pending && approval.status === ApprovalStatus.PENDING && (
                          <div className="text-orange-600 text-xs">
                            Pending for {approval.days_pending} days
                          </div>
                        )}
                      </div>

                      {/* Comments */}
                      {approval.comments && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <MessageSquare className="inline h-3 w-3 mr-1" />
                          {approval.comments}
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {approval.rejection_reason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <XCircle className="inline h-3 w-3 mr-1" />
                          <strong>Rejection Reason:</strong> {approval.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {approval.status === ApprovalStatus.PENDING && approval.is_pending && (
                      <>
                        {currentUserCanApprove && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleQuickApprove(approval)}
                              disabled={quickApproveMutation.isPending && selectedApproval?.id === approval.id}
                            >
                              {quickApproveMutation.isPending && selectedApproval?.id === approval.id ? (
                                <LoadingSpinner />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                              Quick Approve
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openActionModal(approval, 'reject')}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openActionModal(approval, 'revise')}
                            >
                              <RotateCcw className="h-4 w-4" />
                              Request Revision
                            </Button>
                          </>
                        )}

                        {!approval.reminder_sent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendReminder(approval)}
                            disabled={sendReminderMutation.isPending && selectedApproval?.id === approval.id}
                          >
                            {sendReminderMutation.isPending && selectedApproval?.id === approval.id ? (
                              <LoadingSpinner />
                            ) : (
                              <Bell className="h-4 w-4" />
                            )}
                            Send Reminder
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Workflow Progress */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Workflow Progress</h4>
                  <span className="text-sm text-gray-600">
                    {approvals.filter(a => a.status === ApprovalStatus.APPROVED).length} of {approvals.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(approvals.filter(a => a.status === ApprovalStatus.APPROVED).length / approvals.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Approval History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.approver_name}</span>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {ApprovalStatusLabels[item.status]}
                        </Badge>
                        <Badge className={getApprovalTypeColor(item.approval_type)}>
                          {ApprovalTypeLabels[item.approval_type]}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(item.approval_date || item.created_datetime)}
                      </div>
                      {item.comments && (
                        <div className="mt-1 text-sm">{item.comments}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approval Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Site Visit'}
              {actionType === 'reject' && 'Reject Site Visit'}
              {actionType === 'revise' && 'Request Revision'}
            </DialogTitle>
          </DialogHeader>
          <Form {...actionForm}>
            <form onSubmit={actionForm.handleSubmit(handleApprovalAction)} className="space-y-4">
              <FormField
                control={actionForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add comments about your decision..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {actionType === 'reject' && (
                <FormField
                  control={actionForm.control}
                  name="rejection_reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rejection Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide a reason for rejection..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsActionModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={approvalActionMutation.isPending}
                  variant={actionType === 'reject' ? 'destructive' : 'default'}
                >
                  {approvalActionMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' && 'Approve'}
                      {actionType === 'reject' && 'Reject'}
                      {actionType === 'revise' && 'Request Revision'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalWorkflow;
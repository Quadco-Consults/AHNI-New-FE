"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Search,
  Eye,
  Calendar,
  Users,
  FileText
} from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "components/ui/dialog";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import GoBack from "components/GoBack";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useGetLeaveRequests } from "../../controllers/leaveRequestController";
import { toast } from "sonner";
import { normalizeLeaveRequestEmployee } from "../../utils/normalizeLeaveData";
import { useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const LeaveApprovalDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComments, setRejectionComments] = useState("");

  // Fetch leave requests by status
  const { data: pendingData, isLoading: loadingPending } = useGetLeaveRequests({
    status: "pending_approval",
    search: searchTerm,
    page,
    size: pageSize,
  });

  const { data: approvedData, isLoading: loadingApproved } = useGetLeaveRequests({
    status: "approved",
    search: searchTerm,
    page,
    size: pageSize,
  });

  const { data: rejectedData, isLoading: loadingRejected } = useGetLeaveRequests({
    status: "rejected",
    search: searchTerm,
    page,
    size: pageSize,
  });

  const { data: allData, isLoading: loadingAll } = useGetLeaveRequests({
    search: searchTerm,
    page,
    size: pageSize,
  });

  // Debug logging
  React.useEffect(() => {
    if (pendingData) {
      console.log("Pending data response:", pendingData);
      console.log("Pending data keys:", Object.keys(pendingData));
    }
  }, [pendingData]);

  // Extract data - handle both array and paginated response
  const rawPendingRequests = Array.isArray(pendingData?.data)
    ? pendingData.data
    : Array.isArray(pendingData?.data?.results)
    ? pendingData.data.results
    : [];

  const rawApprovedRequests = Array.isArray(approvedData?.data)
    ? approvedData.data
    : Array.isArray(approvedData?.data?.results)
    ? approvedData.data.results
    : [];

  // Normalize employee data using shared utility
  const pendingRequests = rawPendingRequests.map(normalizeLeaveRequestEmployee);
  const approvedRequests = rawApprovedRequests.map(normalizeLeaveRequestEmployee);

  const rawRejectedRequests = Array.isArray(rejectedData?.data)
    ? rejectedData.data
    : Array.isArray(rejectedData?.data?.results)
    ? rejectedData.data.results
    : [];

  const rawAllRequests = Array.isArray(allData?.data)
    ? allData.data
    : Array.isArray(allData?.data?.results)
    ? allData.data.results
    : [];

  const rejectedRequests = rawRejectedRequests.map(normalizeLeaveRequestEmployee);
  const allRequests = rawAllRequests.map(normalizeLeaveRequestEmployee);

  // Additional debug logging
  React.useEffect(() => {
    console.log("Leave Approval Dashboard - Data counts:");
    console.log("Pending:", pendingRequests.length);
    console.log("Approved:", approvedRequests.length);
    console.log("Rejected:", rejectedRequests.length);
    console.log("All:", allRequests.length);
  }, [pendingRequests, approvedRequests, rejectedRequests, allRequests]);

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft', className: '' },
      pending_approval: { variant: 'default' as const, label: 'Pending', className: 'bg-amber-100 text-amber-800' },
      approved: { variant: 'default' as const, label: 'Approved', className: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', className: '' },
      cancelled: { variant: 'secondary' as const, label: 'Cancelled', className: '' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      header: "Employee",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.employee?.first_name} {row.original.employee?.last_name}
          </div>
          <div className="text-sm text-gray-500">{row.original.employee?.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: "Employee ID",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.employee?.employee_id || 'N/A'}
        </div>
      ),
    },
    {
      header: "Department",
      cell: ({ row }) => {
        const dept = row.original.employee?.department;
        const deptText = dept
          ? (typeof dept === 'string'
              ? dept
              : typeof dept === 'object' && dept?.name
              ? dept.name
              : 'Unknown Department')
          : 'N/A';

        return (
          <div className="text-sm">
            {deptText}
          </div>
        );
      },
    },
    {
      header: "Position",
      cell: ({ row }) => {
        const position = row.original.employee?.position || row.original.employee?.job_title;
        const positionText = position
          ? (typeof position === 'string'
              ? position
              : typeof position === 'object' && position?.name
              ? position.name
              : 'Unknown Position')
          : 'N/A';

        return (
          <div className="text-sm">
            {positionText}
          </div>
        );
      },
    },
    {
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.employee?.location || row.original.employee?.office_location || 'N/A'}
        </div>
      ),
    },
    {
      header: "Leave Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{row.original.leave_type?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: "Duration",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.from_date && row.original.to_date ? (
              <>
                {format(new Date(row.original.from_date), 'MMM dd')} - {format(new Date(row.original.to_date), 'MMM dd, yyyy')}
              </>
            ) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">{row.original.number_of_days || 0} days</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status || 'draft'} />,
    },
    {
      header: "Submitted",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.submitted_at ? format(new Date(row.original.submitted_at), 'MMM dd, yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/hr/leave-management/leave-list/${row.original.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status === 'pending_approval' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleQuickApprove(row.original)}
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleQuickReject(row.original)}
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleQuickApprove = (request: any) => {
    setSelectedRequest(request);
    setApprovalComments("");
    setApproveDialogOpen(true);
  };

  const handleQuickReject = (request: any) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectionComments("");
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest) return;

    try {
      // Call API directly using AxiosWithToken
      await AxiosWithToken.post(`hr/leave-request/${selectedRequest.id}/approve/`, {
        comments: approvalComments
      });

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      toast.success("Leave request approved successfully!");
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      setApprovalComments("");
    } catch (error: any) {
      console.error("Error approving leave:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to approve leave request";
      toast.error(errorMessage);
    }
  };

  const confirmReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      // Call API directly using AxiosWithToken
      await AxiosWithToken.post(`hr/leave-request/${selectedRequest.id}/reject/`, {
        reason: rejectionReason,
        comments: rejectionComments
      });

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      toast.success("Leave request rejected");
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      setRejectionComments("");
    } catch (error: any) {
      console.error("Error rejecting leave:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to reject leave request";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Approvals</h1>
          <p className="text-gray-600">Review, authorize, and approve employee leave requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-600">{pendingRequests.length}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">
                {approvedRequests.filter(req => {
                  const approvedDate = req.approved_at ? new Date(req.approved_at) : null;
                  const today = new Date();
                  return approvedDate &&
                    approvedDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Leave Today</p>
              <p className="text-2xl font-bold text-blue-600">
                {approvedRequests.filter(req => {
                  const today = new Date();
                  const fromDate = req.from_date ? new Date(req.from_date) : null;
                  const toDate = req.to_date ? new Date(req.to_date) : null;
                  return fromDate && toDate &&
                    fromDate <= today && today <= toDate;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Leaves</p>
              <p className="text-2xl font-bold text-purple-600">
                {approvedRequests.filter(req => {
                  const today = new Date();
                  const fromDate = req.from_date ? new Date(req.from_date) : null;
                  return fromDate && fromDate > today;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by employee name, leave type, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Requests ({allRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <DataTable
              data={pendingRequests}
              columns={columns}
              isLoading={loadingPending}
            />
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <DataTable
              data={approvedRequests}
              columns={columns}
              isLoading={loadingApproved}
            />
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <DataTable
              data={rejectedRequests}
              columns={columns}
              isLoading={loadingRejected}
            />
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <DataTable
              data={allRequests}
              columns={columns}
              isLoading={loadingAll}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent aria-describedby="approve-dialog-description">
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <p id="approve-dialog-description" className="text-sm text-gray-600">
              Confirm approval for this leave request
            </p>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Employee:</span>
                    <span className="text-sm">
                      {selectedRequest.employee?.first_name} {selectedRequest.employee?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Leave Type:</span>
                    <span className="text-sm">{selectedRequest.leave_type?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">
                      {selectedRequest.from_date && selectedRequest.to_date ? (
                        <>
                          {format(new Date(selectedRequest.from_date), 'MMM dd')} - {format(new Date(selectedRequest.to_date), 'MMM dd, yyyy')}
                          {' '}({selectedRequest.number_of_days || 0} days)
                        </>
                      ) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reason:</span>
                    <span className="text-sm text-right max-w-xs">{selectedRequest.reason || 'N/A'}</span>
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
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent aria-describedby="reject-dialog-description">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <p id="reject-dialog-description" className="text-sm text-gray-600">
              Provide a reason for rejecting this leave request
            </p>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Employee:</span>
                    <span className="text-sm">
                      {selectedRequest.employee?.first_name} {selectedRequest.employee?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Leave Type:</span>
                    <span className="text-sm">{selectedRequest.leave_type?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">
                      {selectedRequest.from_date && selectedRequest.to_date ? (
                        <>
                          {format(new Date(selectedRequest.from_date), 'MMM dd')} - {format(new Date(selectedRequest.to_date), 'MMM dd, yyyy')}
                          {' '}({selectedRequest.number_of_days || 0} days)
                        </>
                      ) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a clear reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rejection-comments">Additional Comments (Optional)</Label>
                <Textarea
                  id="rejection-comments"
                  placeholder="Add any additional comments..."
                  value={rejectionComments}
                  onChange={(e) => setRejectionComments(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReject}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveApprovalDashboard;

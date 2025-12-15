"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import DataTable from "components/Table/DataTable";
import Card from "components/Card";
import SearchIcon from "components/icons/SearchIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Timesheet } from "../../types/timesheet";
import { format } from "date-fns";
import {
  useGetTimesheets,
  useApproveTimesheet,
  useRejectTimesheet
} from "../../controllers/timesheetController";
import { toast } from "sonner";
import Modal from "react-modal";
import { Download, CheckCircle, XCircle, Eye } from "lucide-react";

const TimesheetStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, any> = {
    draft: "outline",
    submitted: "secondary",
    approved: "default",
    rejected: "destructive",
  };

  return (
    <Badge variant={variants[status] || "outline"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const TimesheetApprovals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  const [currentTimesheetId, setCurrentTimesheetId] = useState("");
  const [viewingTimesheet, setViewingTimesheet] = useState<Timesheet | null>(null);

  // Fetch timesheets - default to submitted for approval queue
  const { data: timesheetsData, isLoading, refetch } = useGetTimesheets({
    page: currentPage,
    page_size: 20,
    status: statusFilter === "all" ? undefined : (statusFilter as any),
    search: searchQuery,
    start_date: dateFromFilter || undefined,
    end_date: dateToFilter || undefined,
    enabled: true,
  });

  const timesheets = timesheetsData?.data?.results || [];
  const pagination = timesheetsData?.data?.pagination;

  // Debug logging
  console.log("Approvals page - filters:", { statusFilter, searchQuery, dateFromFilter, dateToFilter });
  console.log("Approvals page - timesheets data:", timesheetsData);
  console.log("Approvals page - timesheets count:", timesheets.length);

  // Hooks for approve/reject
  const { approveTimesheet, isLoading: isApproving } = useApproveTimesheet(currentTimesheetId);
  const { rejectTimesheet, isLoading: isRejecting } = useRejectTimesheet(currentTimesheetId);

  const handleBulkApprove = async () => {
    if (selectedTimesheets.length === 0) {
      toast.error("Please select timesheets to approve");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to approve ${selectedTimesheets.length} timesheet(s)?`
    );
    if (!confirmed) return;

    let successCount = 0;
    let failCount = 0;

    for (const id of selectedTimesheets) {
      setCurrentTimesheetId(id);
      try {
        await approveTimesheet();
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} timesheet(s) approved successfully`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} timesheet(s) failed to approve`);
    }

    setSelectedTimesheets([]);
    refetch();
  };

  const handleDownloadReport = () => {
    // Generate filename with current filters
    const filterSuffix = [
      statusFilter !== "all" ? statusFilter : "",
      dateFromFilter ? `from-${dateFromFilter}` : "",
      dateToFilter ? `to-${dateToFilter}` : "",
    ].filter(Boolean).join("_");

    const filename = `timesheet-report${filterSuffix ? `-${filterSuffix}` : ""}-${format(new Date(), "yyyy-MM-dd")}.csv`;

    // Create CSV content
    const headers = [
      "Employee Name",
      "Employee Email",
      "Period Start",
      "Period End",
      "Total Hours",
      "Entries Count",
      "Status",
      "Submitted Date",
      "Approver",
      "Approved Date",
      "Rejection Reason"
    ];

    const rows = timesheets.map((timesheet) => {
      const employee = timesheet.employee_detail;
      return [
        `${employee?.legal_firstname || ""} ${employee?.legal_lastname || ""}`,
        employee?.email || "",
        timesheet.start_date,
        timesheet.end_date,
        timesheet.total_hours || 0,
        timesheet.entries?.length || 0,
        timesheet.status,
        timesheet.submitted_datetime ? format(new Date(timesheet.submitted_datetime), "yyyy-MM-dd HH:mm") : "",
        timesheet.approver?.name || "",
        timesheet.approved_datetime ? format(new Date(timesheet.approved_datetime), "yyyy-MM-dd HH:mm") : "",
        timesheet.rejection_reason || ""
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Report downloaded: ${filename}`);
  };

  const handleViewTimesheet = (timesheet: Timesheet) => {
    setViewingTimesheet(timesheet);
    setCurrentTimesheetId(timesheet.id);
    setIsViewModalOpen(true);
  };

  const handleApproveFromModal = async () => {
    if (!currentTimesheetId) return;

    try {
      await approveTimesheet(approvalComments || undefined);
      toast.success("Timesheet approved successfully");
      setIsViewModalOpen(false);
      setViewingTimesheet(null);
      setApprovalComments("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve timesheet");
    }
  };

  const handleRejectFromModal = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectTimesheet(rejectionReason);
      toast.success("Timesheet rejected");
      setIsViewModalOpen(false);
      setIsRejectModalOpen(false);
      setViewingTimesheet(null);
      setRejectionReason("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject timesheet");
    }
  };

  const columns: ColumnDef<Timesheet>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedTimesheets(timesheets.map(t => t.id));
            } else {
              setSelectedTimesheets([]);
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedTimesheets.includes(row.original.id)}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedTimesheets([...selectedTimesheets, row.original.id]);
            } else {
              setSelectedTimesheets(selectedTimesheets.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    },
    {
      header: "Employee",
      cell: ({ row }) => {
        const employee = row.original.employee_detail;
        return (
          <div>
            <div className="font-medium">
              {employee?.legal_firstname} {employee?.legal_lastname}
            </div>
            <div className="text-sm text-gray-500">{employee?.email || "N/A"}</div>
          </div>
        );
      },
    },
    {
      header: "Period",
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.start_date), "MMM dd")} -{" "}
          {format(new Date(row.original.end_date), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      header: "Entries",
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="font-medium">{row.original.entries?.length || 0} entries</div>
          <div className="text-gray-500">
            {row.original.entries?.length > 0
              ? `${new Set(row.original.entries.map(e => e.project)).size} projects`
              : "No entries"}
          </div>
        </div>
      ),
    },
    {
      header: "Total Hours",
      cell: ({ row }) => {
        const hours = parseFloat(row.original.total_hours as any) || 0;
        return <div className="font-medium">{hours.toFixed(2)}h</div>;
      },
    },
    {
      header: "Status",
      cell: ({ row }) => <TimesheetStatusBadge status={row.original.status} />,
    },
    {
      header: "Submitted",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.submitted_datetime
            ? format(new Date(row.original.submitted_datetime), "MMM dd, yyyy")
            : "Not submitted"}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewTimesheet(row.original)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timesheet Approvals</h2>
          <p className="text-sm text-gray-600">Review and approve employee timesheets</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-start gap-2 flex-wrap">
          <span className="flex items-center px-2 py-2 border rounded-lg min-w-[250px]">
            <SearchIcon />
            <input
              placeholder="Search by employee name"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 h-6 border-none bg-none focus:outline-none outline-none w-full"
            />
          </span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Period:</label>
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
              placeholder="From"
            />
            <span className="text-sm text-gray-500">to</span>
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
              placeholder="To"
            />
          </div>
          {(dateFromFilter || dateToFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateFromFilter("");
                setDateToFilter("");
              }}
            >
              Clear Dates
            </Button>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          {selectedTimesheets.length > 0 && (
            <Button onClick={handleBulkApprove} disabled={isApproving}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Selected ({selectedTimesheets.length})
            </Button>
          )}
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {selectedTimesheets.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            {selectedTimesheets.length} timesheet(s) selected
          </p>
        </div>
      )}

      {!isLoading && timesheets.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-lg font-medium text-gray-900">No timesheets found</p>
            <p className="text-sm text-gray-600 mt-2">
              {statusFilter === "submitted"
                ? "No timesheets have been submitted for approval yet."
                : `No timesheets with status "${statusFilter}".`}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Try adjusting your filters or check back later.
            </p>
          </div>
        </Card>
      )}

      {timesheets.length > 0 && (
        <Card>
          <DataTable
            data={timesheets}
            columns={columns}
            isLoading={isLoading}
            pagination={
              pagination
                ? {
                    total: pagination.count,
                    pageSize: pagination.page_size,
                    onChange: setCurrentPage,
                  }
                : undefined
            }
          />
        </Card>
      )}

      {/* View Timesheet Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => {
          setIsViewModalOpen(false);
          setViewingTimesheet(null);
          setApprovalComments("");
        }}
        className="fixed inset-0 flex items-center justify-center p-4 overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={typeof document !== 'undefined' ? document.getElementById('__next') || document.body : undefined}
      >
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto space-y-6">
          {viewingTimesheet && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Timesheet Details</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {viewingTimesheet.employee_detail?.legal_firstname}{" "}
                    {viewingTimesheet.employee_detail?.legal_lastname}
                  </p>
                </div>
                <Badge
                  variant={
                    viewingTimesheet.status === "approved"
                      ? "default"
                      : viewingTimesheet.status === "rejected"
                      ? "destructive"
                      : viewingTimesheet.status === "submitted"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {viewingTimesheet.status.charAt(0).toUpperCase() + viewingTimesheet.status.slice(1)}
                </Badge>
              </div>

              {/* Employee & Period Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Employee</p>
                  <p className="font-medium">
                    {viewingTimesheet.employee_detail?.legal_firstname}{" "}
                    {viewingTimesheet.employee_detail?.legal_lastname}
                  </p>
                  <p className="text-sm text-gray-500">{viewingTimesheet.employee_detail?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Period</p>
                  <p className="font-medium">
                    {format(new Date(viewingTimesheet.start_date), "MMM dd, yyyy")} -{" "}
                    {format(new Date(viewingTimesheet.end_date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="font-medium text-lg">
                    {parseFloat(viewingTimesheet.total_hours as any)?.toFixed(2) || "0.00"} hours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium">
                    {viewingTimesheet.submitted_datetime
                      ? format(new Date(viewingTimesheet.submitted_datetime), "MMM dd, yyyy HH:mm")
                      : "Not submitted"}
                  </p>
                </div>
              </div>

              {/* Entries Table */}
              <div>
                <h4 className="font-semibold mb-3">Timesheet Entries ({viewingTimesheet.entries?.length || 0})</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Project</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Activity</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hours</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {viewingTimesheet.entries?.map((entry, index) => (
                        <tr key={entry.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            {format(new Date(entry.date), "MMM dd, yyyy")}
                          </td>
                          <td className="px-4 py-3 text-sm">{entry.project_name || entry.project}</td>
                          <td className="px-4 py-3 text-sm">
                            {entry.custom_activity || entry.activity_name || entry.activity_plan}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {parseFloat(entry.hours_worked as any)?.toFixed(2)} hrs
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {entry.description || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Debug - show status */}
              {console.log("Viewing timesheet status:", viewingTimesheet.status)}

              {/* Approval/Rejection Section */}
              {viewingTimesheet.status === "submitted" && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold">Approval Actions</h4>

                  {/* Optional Comments */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded p-2 min-h-[80px]"
                      placeholder="Add any comments about this timesheet..."
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setViewingTimesheet(null);
                        setApprovalComments("");
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setIsRejectModalOpen(true);
                      }}
                      disabled={isRejecting}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleApproveFromModal}
                      disabled={isApproving}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                  </div>
                </div>
              )}

              {/* View-Only Mode for Approved/Rejected */}
              {viewingTimesheet.status !== "submitted" && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingTimesheet(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              )}

              {/* Show Rejection Reason if Rejected */}
              {viewingTimesheet.status === "rejected" && viewingTimesheet.rejection_reason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                  <p className="text-sm text-red-700 mt-1">{viewingTimesheet.rejection_reason}</p>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onRequestClose={() => setIsRejectModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
          <h3 className="text-lg font-semibold">Reject Timesheet</h3>
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this timesheet:</p>
          <textarea
            className="w-full border border-gray-300 rounded p-2 min-h-[100px]"
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectFromModal}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Reject Timesheet"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimesheetApprovals;

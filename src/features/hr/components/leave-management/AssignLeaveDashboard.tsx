"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import {
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  UserPlus,
  Filter,
  Download,
  CalendarDays,
  XCircle,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import BackendStatusBanner from "./BackendStatusBanner";
import AssignLeaveForm from "./AssignLeaveForm";
import { useGetLeaveRequests } from "../../controllers/leaveRequestController";
import { useGetEmployeeOnboardings } from "../../controllers/employeeOnboardingController";
import { normalizeLeaveRequestEmployee } from "../../utils/normalizeLeaveData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

type LeaveStatus = "draft" | "pending_approval" | "approved" | "rejected" | "cancelled" | "taken";

const AssignLeaveDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch data
  const { data: leaveRequestsData, isLoading: loadingRequests } = useGetLeaveRequests({
    search: searchTerm,
    status: statusFilter,
  });
  const { data: employeesData, isLoading: loadingEmployees } = useGetEmployeeOnboardings({ size: 100 });

  const rawLeaveRequests = Array.isArray(leaveRequestsData?.data)
    ? leaveRequestsData.data
    : Array.isArray(leaveRequestsData?.data?.results)
    ? leaveRequestsData.data.results
    : [];

  // Normalize leave requests to ensure employee data is properly formatted
  const leaveRequests = rawLeaveRequests.map(normalizeLeaveRequestEmployee);

  const employees = Array.isArray(employeesData?.data)
    ? employeesData.data
    : Array.isArray(employeesData?.data?.results)
    ? employeesData.data.results
    : [];

  // Calculate statistics
  const stats = {
    totalEmployees: employees.length,
    onLeaveToday: leaveRequests.filter((req: any) => {
      if (req.status !== "approved" && req.status !== "taken") return false;
      const today = new Date();
      const fromDate = new Date(req.from_date);
      const toDate = new Date(req.to_date);
      return today >= fromDate && today <= toDate;
    }).length,
    pendingRequests: leaveRequests.filter((req: any) => req.status === "pending_approval").length,
    approvedThisMonth: leaveRequests.filter((req: any) => {
      if (req.status !== "approved") return false;
      const thisMonth = new Date().getMonth();
      const createdMonth = new Date(req.created_at).getMonth();
      return createdMonth === thisMonth;
    }).length,
  };

  // Delete leave request handler
  const handleDeleteLeaveRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave request? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(id);
      await AxiosWithToken.delete(`hr/leave-request/${id}/`);

      // Invalidate queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

      toast.success("Leave request deleted successfully");
    } catch (error: any) {
      console.error("Error deleting leave request:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete leave request";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: LeaveStatus }) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft', icon: AlertCircle, className: '' },
      pending_approval: { variant: 'default' as const, label: 'Pending', icon: Clock, className: 'bg-amber-100 text-amber-800' },
      approved: { variant: 'default' as const, label: 'Approved', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', icon: XCircle, className: '' },
      cancelled: { variant: 'secondary' as const, label: 'Cancelled', icon: XCircle, className: '' },
      taken: { variant: 'default' as const, label: 'Taken', icon: CalendarDays, className: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Leave Requests Table Columns
  const leaveRequestsColumns: ColumnDef<any>[] = [
    {
      header: "Employee",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.employee?.first_name} {row.original.employee?.last_name}
          </div>
          <div className="text-sm text-gray-500">{row.original.employee?.email}</div>
        </div>
      ),
    },
    {
      header: "Leave Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.leave_type?.name || 'N/A'}</span>
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
      cell: ({ row }) => <StatusBadge status={row.original.status || 'pending_approval'} />,
    },
    {
      header: "Applied",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.created_at ? format(new Date(row.original.created_at), 'MMM dd, yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const isDeleting = deletingId === row.original.id;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/hr/leave-management/${row.original.id}/details`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteLeaveRequest(row.original.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  // Employees Table Columns
  const employeesColumns: ColumnDef<any>[] = [
    {
      header: "Employee",
      cell: ({ row }) => {
        const firstName = row.original.first_name || row.original.user?.first_name || '';
        const lastName = row.original.last_name || row.original.user?.last_name || '';
        const email = row.original.email || row.original.user?.email || 'N/A';
        const fullName = `${firstName} ${lastName}`.trim();

        return (
          <div>
            <div className="font-medium">
              {fullName || email}
            </div>
            {fullName && <div className="text-sm text-gray-500">{email}</div>}
          </div>
        );
      },
    },
    {
      header: "Employee ID",
      cell: ({ row }) => {
        return row.original.employee_id || row.original.id || 'N/A';
      },
    },
    {
      header: "Department",
      cell: ({ row }) => {
        const dept = row.original.department;
        const deptText = typeof dept === 'object' ? dept?.name : dept;
        return deptText || 'N/A';
      },
    },
    {
      header: "Position",
      cell: ({ row }) => {
        const pos = row.original.position || row.original.job_title;
        const posText = typeof pos === 'object' ? pos?.name : pos;
        return posText || 'N/A';
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Could pre-fill the form with employee data
              setIsAssignDialogOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Assign Leave
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Backend Status Banner */}
      <BackendStatusBanner />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HR Leave Assignment Dashboard</h1>
          <p className="text-gray-600">Assign and manage employee leave requests</p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Assign Leave
        </Button>
      </div>

      {/* Assign Leave Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="assign-leave-description">
          <DialogHeader>
            <DialogTitle>Assign Leave to Employee</DialogTitle>
            <p id="assign-leave-description" className="text-sm text-gray-600">
              Create a leave request on behalf of an employee
            </p>
          </DialogHeader>
          <AssignLeaveForm onSuccess={() => setIsAssignDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employees</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Leave Today</p>
              <p className="text-2xl font-bold">{stats.onLeaveToday}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-2xl font-bold">{stats.pendingRequests}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved This Month</p>
              <p className="text-2xl font-bold">{stats.approvedThisMonth}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="recent-assignments">Recent Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by employee name, leave type, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Assignment
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>

          {/* All Leave Requests */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Leave Requests</h3>
            <Card>
              <DataTable
                data={leaveRequests}
                columns={leaveRequestsColumns}
                isLoading={loadingRequests}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Employee Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search employees by name, department, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Employees List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Employees</h3>
              <p className="text-sm text-gray-600">{employees.length} total employees</p>
            </div>
            <Card>
              <DataTable
                data={employees.filter((emp: any) => {
                  if (!searchTerm) return true;
                  const search = searchTerm.toLowerCase();
                  return (
                    emp.first_name?.toLowerCase().includes(search) ||
                    emp.last_name?.toLowerCase().includes(search) ||
                    emp.email?.toLowerCase().includes(search) ||
                    emp.employee_id?.toLowerCase().includes(search) ||
                    emp.department?.toLowerCase().includes(search)
                  );
                })}
                columns={employeesColumns}
                isLoading={loadingEmployees}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-assignments" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Leave Assignments</h3>
            <Card>
              <DataTable
                data={leaveRequests.slice(0, 20)}
                columns={leaveRequestsColumns}
                isLoading={loadingRequests}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignLeaveDashboard;

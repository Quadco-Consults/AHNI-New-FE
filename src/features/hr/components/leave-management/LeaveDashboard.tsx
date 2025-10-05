"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import {
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  CalendarDays
} from "lucide-react";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

import LeaveBalanceCard from "./LeaveBalanceCard";
import BackendStatusBanner from "./BackendStatusBanner";
import LeaveForm from "./form";
import { LeaveRequest, LeaveStatus } from "../../types/leave";
import { useGetLeaveDashboard, useGetLeaveRequests, useGetLeaveBalances } from "../../controllers/leaveRequestController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { format } from "date-fns";
import { normalizeLeaveRequestEmployee, normalizeLeaveBalance } from "../../utils/normalizeLeaveData";


const LeaveDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  // API hooks
  const { data: dashboardResponse, isLoading: loading, error } = useGetLeaveDashboard();
  // The response has nested data: {status: true, data: {data: {...}}}
  const rawData = dashboardResponse?.data?.data || dashboardResponse?.data;

  // Fetch employee's own leave requests separately (for My Requests tab)
  const { data: myRequestsResponse, isLoading: loadingRequests } = useGetLeaveRequests({
    search: "",
    page: 1,
    size: 100,
    enabled: true,
  });

  // Fetch leave balances separately
  const { data: leaveBalancesResponse, isLoading: loadingBalances } = useGetLeaveBalances(true);

  // Extract and normalize employee's leave requests
  const myAllRequests = React.useMemo(() => {
    const rawRequests = Array.isArray(myRequestsResponse?.data)
      ? myRequestsResponse.data
      : Array.isArray(myRequestsResponse?.data?.results)
      ? myRequestsResponse.data.results
      : [];

    return rawRequests.map(normalizeLeaveRequestEmployee);
  }, [myRequestsResponse]);

  // Extract leave balances
  const leaveBalances = React.useMemo(() => {
    const balances = Array.isArray(leaveBalancesResponse?.data)
      ? leaveBalancesResponse.data
      : leaveBalancesResponse?.data?.results || [];

    console.log("Leave balances from API (before normalization):", balances);
    if (balances.length > 0) {
      console.log("First balance structure:", JSON.stringify(balances[0], null, 2));
    }

    // Normalize each balance to match expected structure
    const normalized = balances
      .map(normalizeLeaveBalance)
      .filter((balance: any) => balance !== null); // Filter out any that failed normalization

    console.log("Leave balances after normalization:", normalized);
    return normalized;
  }, [leaveBalancesResponse]);

  // Normalize dashboard data - handle both camelCase and snake_case
  const data = React.useMemo(() => {
    if (!rawData) return null;

    const stats = rawData.statistics || rawData.stats || {};

    // Get leave requests and normalize employee data
    const recentRequests = (rawData.myRecentRequests || rawData.my_recent_requests || rawData.recent_requests || [])
      .map(normalizeLeaveRequestEmployee);

    const upcomingLeaves = (rawData.myUpcomingLeaves || rawData.my_upcoming_leaves || rawData.upcoming_leaves || [])
      .map(normalizeLeaveRequestEmployee);

    return {
      statistics: {
        onLeaveToday: stats.onLeaveToday || stats.on_leave_today || 0,
        pendingApprovals: stats.pendingApprovals || stats.pending_approvals || 0,
        upcomingLeaves: stats.upcomingLeaves || stats.upcoming_leaves || 0,
        totalEmployees: stats.totalEmployees || stats.total_employees || 0,
      },
      myLeaveBalance: rawData.myLeaveBalance || rawData.my_leave_balance || rawData.leave_balances || [],
      myRecentRequests: recentRequests,
      myUpcomingLeaves: upcomingLeaves,
    };
  }, [rawData]);

  // Debug logging
  React.useEffect(() => {
    if (rawData) {
      console.log("Raw dashboard data:", rawData);
      console.log("Available keys:", Object.keys(rawData));
      console.log("Statistics:", rawData.statistics || rawData.stats);
      console.log("Balance Summary:", rawData.balanceSummary);
      console.log("My Leave Balance:", rawData.myLeaveBalance);
      console.log("My Recent Requests:", rawData.myRecentRequests);
      console.log("My Upcoming Leaves:", rawData.myUpcomingLeaves);
    }
  }, [rawData]);

  React.useEffect(() => {
    if (data) {
      console.log("Processed dashboard data:", data);
      console.log("Statistics processed:", data.statistics);
      console.log("Recent requests:", data.myRecentRequests);
    }
  }, [data]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error || "An error occurred");

    // If employee profile not found, show helpful message
    if (errorMessage.includes("Employee profile not found")) {
      return (
        <div className="space-y-6">
          <BackendStatusBanner />

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Employee Profile Not Set Up</h2>
              <p className="text-gray-600 mb-4">
                Your user account exists, but you don't have an employee profile in the HR system yet.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please contact your HR administrator to set up your employee profile, or use the
                system with limited functionality.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Failed to load dashboard data</p>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  // Status Badge Component
  const StatusBadge = ({ status }: { status: LeaveStatus }) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft', icon: FileText, className: '' },
      pending_approval: { variant: 'default' as const, label: 'Pending', icon: Clock, className: '' },
      approved: { variant: 'default' as const, label: 'Approved', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', icon: XCircle, className: '' },
      cancelled: { variant: 'secondary' as const, label: 'Cancelled', icon: XCircle, className: '' },
      taken: { variant: 'default' as const, label: 'Taken', icon: CalendarDays, className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Recent Requests Table Columns
  const recentRequestsColumns: ColumnDef<any>[] = [
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
        const deptText = typeof dept === 'object' ? dept?.name : dept;
        return (
          <div className="text-sm">
            {deptText || 'N/A'}
          </div>
        );
      },
    },
    {
      header: "Position",
      cell: ({ row }) => {
        const pos = row.original.employee?.position;
        const posText = typeof pos === 'object' ? pos?.name : pos;
        return (
          <div className="text-sm">
            {posText || 'N/A'}
          </div>
        );
      },
    },
    {
      header: "Location",
      cell: ({ row }) => {
        const loc = row.original.employee?.location;
        const locText = typeof loc === 'object' ? loc?.name : loc;
        return (
          <div className="text-sm">
            {locText || 'N/A'}
          </div>
        );
      },
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
                {format(new Date(row.original.from_date), 'MMM dd')} - {format(new Date(row.original.to_date), 'MMM dd')}
              </>
            ) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">{row.original.number_of_days || 0} days</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status || 'pending'} />,
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
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/hr/leave-management/${row.original.id}/details`)}
        >
          View
        </Button>
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
          <h1 className="text-2xl font-bold">My Leave Dashboard</h1>
          <p className="text-gray-600">View your leave balances, history, and apply for leave</p>
        </div>
        <Button onClick={() => setIsApplyDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Apply for Leave Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="leave-form-description">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <p id="leave-form-description" className="text-sm text-gray-600">
              Fill in the form below to submit your leave request
            </p>
          </DialogHeader>
          <LeaveForm onSuccess={() => setIsApplyDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Leave Today</p>
              <p className="text-2xl font-bold">{data.statistics?.onLeaveToday || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-2xl font-bold">{data.statistics?.pendingApprovals || 0}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Leaves</p>
              <p className="text-2xl font-bold">{data.statistics?.upcomingLeaves || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employees</p>
              <p className="text-2xl font-bold">{data.statistics?.totalEmployees || 0}</p>
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
          <TabsTrigger value="balances">My Balances</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Leave Balances Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Leave Balances</h3>
            {loadingBalances ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                <span className="ml-2">Loading balances...</span>
              </div>
            ) : leaveBalances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaveBalances.map((balance) => (
                  <LeaveBalanceCard
                    key={balance.id}
                    balance={balance}
                    showDetails={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No leave balances available</p>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Leave Requests</h3>
            <Card>
              <DataTable
                data={myAllRequests.slice(0, 5)}
                columns={recentRequestsColumns}
                isLoading={loadingRequests}
              />
            </Card>
          </div>

          {/* Upcoming Leaves */}
          {data.myUpcomingLeaves && data.myUpcomingLeaves.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Leaves</h3>
              <div className="grid gap-4">
                {data.myUpcomingLeaves.map((leave: any) => (
                  <Card key={leave.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/dashboard/hr/leave-management/${leave.id}/details`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{leave.leave_type?.name || 'Unknown Leave Type'}</div>
                          <div className="text-sm text-gray-600">
                            {leave.from_date && leave.to_date ? (
                              <>
                                {format(new Date(leave.from_date), 'MMM dd')} - {format(new Date(leave.to_date), 'MMM dd')}
                                ({leave.number_of_days || 0} days)
                              </>
                            ) : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={leave.status || 'pending'} />
                    </div>
                    {leave.reason && (
                      <p className="text-sm text-gray-600 mt-2">{leave.reason}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="balances" className="space-y-6">
          {loadingBalances ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
              <span className="ml-2">Loading balances...</span>
            </div>
          ) : leaveBalances.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {leaveBalances.map((balance) => (
                <LeaveBalanceCard
                  key={balance.id}
                  balance={balance}
                  showDetails={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No leave balances available</p>
              <p className="text-sm text-gray-400">Contact HR to get leave packages assigned</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All My Requests</h3>
          </div>

          <Card>
            <DataTable
              data={myAllRequests}
              columns={recentRequestsColumns}
              isLoading={loadingRequests}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveDashboard;
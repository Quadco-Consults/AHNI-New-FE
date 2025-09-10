"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
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
import { LeaveRequest, LeaveStatus } from "../../types/leave";
import { useDashboardData } from "../../services/leaveService";
import { format } from "date-fns";


const LeaveDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get current user ID - replace with actual auth logic
  const currentEmployeeId = "emp-001"; // This should come from your auth context
  
  // API hook
  const { data, loading, error } = useDashboardData(currentEmployeeId);
  
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
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Failed to load dashboard data</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
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
  const recentRequestsColumns: ColumnDef<LeaveRequest>[] = [
    {
      header: "Leave Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: row.original.leaveType.color }}
          />
          <span className="font-medium">{row.original.leaveType.name}</span>
        </div>
      ),
    },
    {
      header: "Duration",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {format(new Date(row.original.fromDate), 'MMM dd')} - {format(new Date(row.original.toDate), 'MMM dd')}
          </div>
          <div className="text-sm text-gray-500">{row.original.numberOfDays} days</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: "Applied",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {format(new Date(row.original.appliedDate), 'MMM dd, yyyy')}
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
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-gray-600">Manage your leave requests and balances</p>
        </div>
        <Link href="/dashboard/hr/leave-management/request-leave">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Apply for Leave
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Leave Today</p>
              <p className="text-2xl font-bold">{data.statistics.onLeaveToday}</p>
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
              <p className="text-2xl font-bold">{data.statistics.pendingApprovals}</p>
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
              <p className="text-2xl font-bold">{data.statistics.upcomingLeaves}</p>
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
              <p className="text-2xl font-bold">{data.statistics.totalEmployees}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.myLeaveBalance?.map((balance) => (
                <LeaveBalanceCard 
                  key={balance.id} 
                  balance={balance}
                  showDetails={false}
                />
              )) || (
                <p className="text-gray-500 col-span-full text-center py-8">No leave balances available</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Leave Requests</h3>
            <Card>
              <DataTable
                data={data.myRecentRequests || []}
                columns={recentRequestsColumns}
                isLoading={loading}
              />
            </Card>
          </div>

          {/* Upcoming Leaves */}
          {data.myUpcomingLeaves && data.myUpcomingLeaves.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Leaves</h3>
              <div className="grid gap-4">
                {data.myUpcomingLeaves.map((leave) => (
                  <Card key={leave.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: leave.leaveType?.color || '#gray' }}
                        />
                        <div>
                          <div className="font-medium">{leave.leaveType?.name || 'Unknown Leave Type'}</div>
                          <div className="text-sm text-gray-600">
                            {format(new Date(leave.fromDate), 'MMM dd')} - {format(new Date(leave.toDate), 'MMM dd')} 
                            ({leave.numberOfDays} days)
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={leave.status} />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.myLeaveBalance?.map((balance) => (
              <LeaveBalanceCard 
                key={balance.id} 
                balance={balance}
                showDetails={true}
              />
            )) || (
              <p className="text-gray-500 col-span-full text-center py-8">No leave balances available</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All My Requests</h3>
            <Link href="/dashboard/hr/leave-management/request-leave">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
          
          <Card>
            <DataTable
              data={[...(data.myRecentRequests || []), ...(data.myUpcomingLeaves || [])]}
              columns={recentRequestsColumns}
              isLoading={loading}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveDashboard;
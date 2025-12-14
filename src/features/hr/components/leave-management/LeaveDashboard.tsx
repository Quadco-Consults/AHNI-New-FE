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
  CalendarDays,
  User,
  Sun,
  Award,
  BarChart,
  Heart,
  Sparkles
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
import { formatEmployeeError } from "../../utils/employeeHelpers";


const LeaveDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  // API hooks
  const { data: dashboardResponse, isLoading: loading, error } = useGetLeaveDashboard();
  // The response has nested data: {status: true, data: {data: {...}}}
  const rawData = dashboardResponse?.data?.data || dashboardResponse?.data;

  console.log("🎯 Dashboard Response:", dashboardResponse);
  console.log("📊 Raw Dashboard Data:", rawData);
  console.log("❌ Dashboard Error:", error);

  // Get user profile for personalization
  const { data: userProfile, isLoading: loadingProfile } = useGetUserProfile();
  console.log("👤 User Profile Response:", userProfile);

  // Get user from localStorage as fallback
  const localUser = React.useMemo(() => {
    try {
      const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  }, []);

  console.log("🏪 LocalStorage User:", localUser);

  const user = userProfile?.data || localUser || {
    first_name: 'User',
    legal_firstname: 'User',
    username: 'user',
    email: 'user@company.com',
    department: 'Department'
  };

  console.log("✅ User Data Being Used:", user);

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
    console.log("🔍 Raw leave requests response:", myRequestsResponse);

    const rawRequests = Array.isArray(myRequestsResponse?.data)
      ? myRequestsResponse.data
      : Array.isArray(myRequestsResponse?.data?.results)
      ? myRequestsResponse.data.results
      : [];

    console.log("📝 Extracted raw requests:", rawRequests);

    const normalizedRequests = rawRequests.map(normalizeLeaveRequestEmployee);
    console.log("✅ Normalized requests:", normalizedRequests);

    // Always return real data first, fallback to sample only if truly no data
    if (normalizedRequests.length > 0) {
      console.log("🎯 Using REAL data from API:", normalizedRequests.length, "requests");
      return normalizedRequests;
    }

    console.log("⚠️ No real data found, showing sample data for demonstration");
    // If no real data, show sample data for demonstration with clear indicators
    return [
      {
        id: 'sample-1',
        leave_type: { name: 'Annual Leave (Sample)', color: '#4ade80' },
        from_date: '2024-12-15',
        to_date: '2024-12-20',
        number_of_days: 6,
        status: 'approved',
        reason: 'Family vacation during holidays [SAMPLE DATA]',
        created_at: '2024-12-01T10:00:00Z'
      },
      {
        id: 'sample-2',
        leave_type: { name: 'Sick Leave (Sample)', color: '#f87171' },
        from_date: '2024-11-28',
        to_date: '2024-11-29',
        number_of_days: 2,
        status: 'pending_approval',
        reason: 'Medical appointment [SAMPLE DATA]',
        created_at: '2024-11-25T14:30:00Z'
      },
      {
        id: 'sample-3',
        leave_type: { name: 'Personal Leave (Sample)', color: '#fbbf24' },
        from_date: '2024-11-15',
        to_date: '2024-11-15',
        number_of_days: 1,
        status: 'approved',
        reason: 'Personal matters [SAMPLE DATA]',
        created_at: '2024-11-10T09:15:00Z'
      }
    ];
  }, [myRequestsResponse]);

  // Extract leave balances with deduplication
  const leaveBalances = React.useMemo(() => {
    console.log("🔍 Raw leave balances response:", leaveBalancesResponse);

    const balances = Array.isArray(leaveBalancesResponse?.data)
      ? leaveBalancesResponse.data
      : leaveBalancesResponse?.data?.results || [];

    console.log(`📊 Leave balances from API: ${balances.length} items received`);

    // Normalize each balance to match expected structure
    const normalized = balances
      .map(normalizeLeaveBalance)
      .filter((balance: any) => balance !== null); // Filter out any that failed normalization

    // AGGRESSIVE DEDUPLICATION: Use simple string-based keys for leave type name + year
    const deduplicatedMap = new Map();
    let duplicateCount = 0;

    console.log(`🔍 Starting deduplication of ${normalized.length} normalized balances...`);

    normalized.forEach((balance: any, index: number) => {
      const leaveTypeName = balance.leaveType?.name || 'Unknown';
      const year = balance.year || new Date().getFullYear();

      // Simple key: just leave type name + year (no employee since it's personal dashboard)
      const key = `${leaveTypeName}-${year}`;

      // Debug first few entries
      if (index < 5) {
        console.log(`🔑 Balance ${index}:`, {
          key,
          leaveTypeName,
          year,
          available: balance.available,
          id: balance.id
        });
      }

      if (!deduplicatedMap.has(key)) {
        deduplicatedMap.set(key, balance);
        console.log(`✅ Added new balance: ${key}`);
      } else {
        duplicateCount++;
        console.log(`🚨 DUPLICATE DETECTED: ${key} (duplicate #${duplicateCount})`);

        // Keep the balance with higher available amount
        const existing = deduplicatedMap.get(key);
        if (balance.available > existing.available) {
          deduplicatedMap.set(key, balance);
          console.log(`🔄 Replaced with better balance (${balance.available} > ${existing.available})`);
        }
      }
    });

    const deduplicated = Array.from(deduplicatedMap.values());
    console.log(`✅ DEDUPLICATION COMPLETE: ${normalized.length} → ${deduplicated.length} balances`);
    console.log(`📊 Removed ${duplicateCount} duplicates`);
    console.log('🎯 Final unique keys:', Array.from(deduplicatedMap.keys()));

    // Always return real data first, fallback to sample only if truly no data
    if (deduplicated.length > 0) {
      console.log("🎯 Using REAL balance data from API:", deduplicated.length, "balances");
      return deduplicated;
    }

    console.log("⚠️ No real balance data found, showing sample data for demonstration");
    // If no real data, show sample data for demonstration with clear indicators
    return [
      {
        id: 'sample-balance-1',
        leaveTypeId: 'sample-1',
        leaveType: { id: 'sample-1', name: 'Annual Leave (Sample)', color: '#4ade80' },
        entitled: 25,
        used: 8,
        available: 17,
        pending: 6,
        year: 2024
      },
      {
        id: 'sample-balance-2',
        leaveTypeId: 'sample-2',
        leaveType: { id: 'sample-2', name: 'Sick Leave (Sample)', color: '#f87171' },
        entitled: 12,
        used: 3,
        available: 9,
        pending: 2,
        year: 2024
      },
      {
        id: 'sample-balance-3',
        leaveTypeId: 'sample-3',
        leaveType: { id: 'sample-3', name: 'Personal Leave (Sample)', color: '#fbbf24' },
        entitled: 5,
        used: 1,
        available: 4,
        pending: 0,
        year: 2024
      }
    ];
  }, [leaveBalancesResponse]);

  // Normalize dashboard data - handle both camelCase and snake_case
  const data = React.useMemo(() => {
    console.log("🔄 Processing dashboard data...");

    if (!rawData) {
      console.log("❌ No raw data available");
      return null;
    }

    const stats = rawData.statistics || rawData.stats || {};
    console.log("📊 Statistics from API:", stats);

    // Get leave requests and normalize employee data
    const recentRequests = (rawData.myRecentRequests || rawData.my_recent_requests || rawData.recent_requests || []);
    const upcomingLeaves = (rawData.myUpcomingLeaves || rawData.my_upcoming_leaves || rawData.upcoming_leaves || []);
    const dashboardBalances = rawData.myLeaveBalance || rawData.my_leave_balance || rawData.leave_balances || [];

    console.log("📝 Recent requests from dashboard API:", recentRequests);
    console.log("📅 Upcoming leaves from dashboard API:", upcomingLeaves);
    console.log("💰 Dashboard balances from API:", dashboardBalances);

    const normalizedRecentRequests = recentRequests.map(normalizeLeaveRequestEmployee);
    const normalizedUpcomingLeaves = upcomingLeaves.map(normalizeLeaveRequestEmployee);

    const processedData = {
      statistics: {
        onLeaveToday: stats.onLeaveToday || stats.on_leave_today || 0,
        pendingApprovals: stats.pendingApprovals || stats.pending_approvals || 0,
        upcomingLeaves: stats.upcomingLeaves || stats.upcoming_leaves || 0,
        totalEmployees: stats.totalEmployees || stats.total_employees || 0,
      },
      myLeaveBalance: dashboardBalances,
      myRecentRequests: normalizedRecentRequests,
      myUpcomingLeaves: normalizedUpcomingLeaves,
    };

    console.log("✅ Processed dashboard data:", processedData);
    return processedData;
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

    // If employee profile not found or user has no employee, show helpful message
    if (errorMessage.includes("Employee profile not found") ||
        errorMessage.includes("User has no employee") ||
        errorMessage.includes("employee") && errorMessage.includes("not")) {

      const errorInfo = formatEmployeeError(errorMessage);

      return (
        <div className="space-y-6">
          <BackendStatusBanner />

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-lg">
              <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">{errorInfo.title}</h2>
              <p className="text-gray-600 mb-4">
                {errorInfo.message}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please contact your HR administrator to set up your employee profile, or try accessing the Employee Onboarding section.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(errorInfo.actionRoute)}
                >
                  {errorInfo.actionText}
                </Button>
              </div>

              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-gray-100 rounded text-left text-sm">
                  <p className="font-semibold mb-2">Debug Info:</p>
                  <p className="text-gray-700">Error: {errorMessage}</p>
                  <p className="text-gray-700 mt-1">
                    This usually means the user account exists but there's no corresponding employee record in the HR system.
                  </p>
                </div>
              )}
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

  // Recent Requests Table Columns (Personal Dashboard - No Employee Columns)
  const recentRequestsColumns: ColumnDef<any>[] = [
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

      {/* Data Source Indicator */}
      {myAllRequests.some((req: any) => req.reason?.includes('[SAMPLE DATA]')) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-800">Demo Mode Active</h4>
              <p className="text-sm text-amber-700">
                The API is connected and working, but no leave data exists in the system yet.
                Showing sample data for demonstration. Real API data will appear once leave requests and balances are added.
              </p>
            </div>
          </div>
        </div>
      )}

      {myAllRequests.length > 0 && !myAllRequests.some((req: any) => req.reason?.includes('[SAMPLE DATA]')) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Live Data Connected</h4>
              <p className="text-sm text-green-700">
                Displaying real data from the API. All information shown is current and up-to-date.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Header with Personalization */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="w-32 h-32 text-blue-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.first_name || user?.legal_firstname || user?.username || 'there'}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {new Date().getHours() < 12
                      ? "Good morning! Ready to manage your leave?"
                      : new Date().getHours() < 17
                      ? "Good afternoon! How's your day going?"
                      : "Good evening! Wrapping up your day?"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                {user?.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{typeof user.department === 'string'
                      ? user.department
                      : typeof user.department === 'object' && user.department?.name
                      ? user.department.name
                      : 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setIsApplyDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Apply for Leave
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/hr/leave-management/history')}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
              >
                <BarChart className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </div>
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

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 mb-1 font-medium">Pending Requests</p>
                <p className="text-3xl font-bold text-amber-900">
                  {myAllRequests.filter((req: any) => req.status === 'pending_approval' || req.status === 'pending').length}
                </p>
                <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1 font-medium">Upcoming Leaves</p>
                <p className="text-3xl font-bold text-green-900">
                  {myAllRequests.filter((req: any) => req.status === 'approved' && new Date(req.from_date) > new Date()).length}
                </p>
                <p className="text-xs text-green-600 mt-1">Ready to enjoy!</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Sun className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1 font-medium">Total Requests</p>
                <p className="text-3xl font-bold text-blue-900">{myAllRequests.length}</p>
                <p className="text-xs text-blue-600 mt-1">All time activity</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            onClick={() => setIsApplyDialogOpen(true)}
          >
            <Plus className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium">Apply Leave</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            onClick={() => setActiveTab("balances")}
          >
            <BarChart className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium">View Balances</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
            onClick={() => setActiveTab("requests")}
          >
            <FileText className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium">My Requests</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
            onClick={() => router.push('/dashboard/hr/leave-management/calendar')}
          >
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-medium">Leave Calendar</span>
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="balances">My Balances</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Personalized Recommendations */}
          {leaveBalances.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900">Personalized Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {leaveBalances
                    .filter(balance => {
                      const remaining = balance.available || balance.remaining || 0;
                      const total = balance.entitled || balance.allocated || 0;
                      const percentage = total > 0 ? (remaining / total) * 100 : 0;
                      return percentage > 70;
                    })
                    .slice(0, 2)
                    .map((balance) => {
                      const remaining = balance.available || balance.remaining || 0;
                      const total = balance.entitled || balance.allocated || 0;
                      const percentage = total > 0 ? (remaining / total) * 100 : 0;

                      return (
                        <div key={balance.id} className="bg-white/80 rounded-lg p-4 border border-purple-100">
                          <p className="text-sm text-purple-800">
                            💡 You have <span className="font-semibold">{remaining} {balance.leaveType?.name || 'leave'} days</span> remaining
                            ({percentage.toFixed(0)}% unused). Consider planning some time off!
                          </p>
                        </div>
                      );
                    })}

                  {myAllRequests.filter((req: any) => req.status === 'pending_approval' || req.status === 'pending').length > 0 && (
                    <div className="bg-white/80 rounded-lg p-4 border border-purple-100">
                      <p className="text-sm text-purple-800">
                        ⏰ You have pending leave requests. Check with your manager for quick approval!
                      </p>
                    </div>
                  )}

                  {new Date().getMonth() >= 10 && ( // November/December
                    <div className="bg-white/80 rounded-lg p-4 border border-purple-100">
                      <p className="text-sm text-purple-800">
                        🎄 Year-end reminder: Don't forget to use your remaining leave days before they expire!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Leave Balances Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Your Leave Balances
            </h3>
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
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No leave balances available</p>
                <p className="text-sm text-gray-400">Contact HR to get leave packages assigned</p>
              </div>
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
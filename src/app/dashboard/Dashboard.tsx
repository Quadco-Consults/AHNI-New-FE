"use client";

import { useState, useEffect, useMemo } from "react";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Progress } from "components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Real data hooks - using working endpoints
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetWorkforces } from "@/features/hr/controllers/workforceController";
import { useGetTrialBalance, useGetIncomeStatement } from "@/features/finance/controllers/reportsController";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { formatNumberCurrency } from "@/utils/utls";

// Department features and error handling
import { useDepartmentFeatures } from "@/hooks/useDepartmentFeatures";
import {
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  FileText,
  Settings,
  Eye,
  Download,
  RotateCcw,
  BarChart3
} from "lucide-react";

// Enhanced color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"];

// Role-based permission system
const _USER_ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  REVIEWER: 'reviewer',
  FINANCE: 'finance',
  FIELD_OFFICER: 'field_officer',
  STAFF: 'staff'
};

const _WORKFLOW_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUIRES_REVISION: 'requires_revision'
};



// Sample user notifications
const userNotifications = [
  {
    id: 'notif_001',
    type: 'workflow_assigned',
    title: 'New Budget Approval Request',
    message: 'Dr. Michael Okafor has submitted a budget approval request for your review',
    requestId: 'req_001',
    isRead: false,
    createdAt: '2024-11-18T10:30:00Z',
    priority: 'high'
  },
  {
    id: 'notif_002',
    type: 'workflow_comment',
    title: 'New Comment on Maternal Health Proposal',
    message: 'Dr. Fatima Hassan added a comment to your review',
    requestId: 'req_002',
    isRead: false,
    createdAt: '2024-11-18T09:45:00Z',
    priority: 'medium'
  },
  {
    id: 'notif_003',
    type: 'workflow_approved',
    title: 'Equipment Request Approved',
    message: 'Your medical equipment procurement request has been approved',
    requestId: 'req_003',
    isRead: true,
    createdAt: '2024-11-17T16:20:00Z',
    priority: 'low'
  }
];


// Sample metrics data
const _metricsData = [
  { name: "Jan", projects: 12, budget: 850000, completed: 8 },
  { name: "Feb", projects: 19, budget: 1200000, completed: 15 },
  { name: "Mar", projects: 15, budget: 980000, completed: 12 },
  { name: "Apr", projects: 22, budget: 1450000, completed: 18 },
  { name: "May", projects: 18, budget: 1100000, completed: 16 },
  { name: "Jun", projects: 25, budget: 1680000, completed: 22 }
];

// Project status distribution
const _statusData = [
  { name: "Active", value: 45, color: "#00C49F" },
  { name: "In Progress", value: 30, color: "#0088FE" },
  { name: "Planning", value: 15, color: "#FFBB28" },
  { name: "Completed", value: 10, color: "#82CA9D" }
];

// Dashboard columns for data table
const _dashboardColumns = [
  {
    accessorKey: "ref",
    header: "Project",
    cell: ({ row }: any) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.ref.name}</div>
        <div className="text-xs text-gray-500 max-w-[200px] truncate">
          {row.original.ref.desc}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Budget",
    cell: ({ row }: any) => (
      <div className="font-medium">
        {row.original.currency === "NGN" ? "₦" : "$"}
        {row.original.amount?.toLocaleString() || "0"}
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }: any) => (
      <div className="space-y-2">
        <Progress value={row.original.progress} className="w-[60px]" />
        <span className="text-xs text-gray-500">{row.original.progress}%</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <Badge variant={
        row.original.status === "Active" ? "default" :
        row.original.status === "In Progress" ? "secondary" :
        row.original.status === "Completed" ? "outline" :
        "destructive"
      }>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }: any) => (
      <Badge variant={
        row.original.priority === "High" ? "destructive" :
        row.original.priority === "Medium" ? "default" :
        "secondary"
      }>
        {row.original.priority}
      </Badge>
    ),
  }
];

export default function Dashboard() {

  // Department features for conditional rendering
  const {
    userDepartment: _userDepartment,
    hasEmployeeProfile: _hasEmployeeProfile,
    getDepartmentDashboardWidgets: _getDepartmentDashboardWidgets,
    getDepartmentTheme: _getDepartmentTheme,
    canAccessProgramsFeatures,
    canAccessFinanceFeatures,
    canAccessHRFeatures,
    canAccessProcurementFeatures: _canAccessProcurementFeatures,
  } = useDepartmentFeatures();

  // Client-side check
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Department-based data loading
  const { data: projectsData, isLoading: isLoadingProjects, error: projectsError } = useGetAllProjects({
    page: 1,
    size: 100,
    enabled: isClient && (canAccessProgramsFeatures || canAccessFinanceFeatures),
    retry: false,
    refetchOnWindowFocus: false
  });

  const { data: workforceData, isLoading: isLoadingWorkforce, error: workforceError } = useGetWorkforces({
    page: 1,
    size: 50,
    enabled: isClient && canAccessHRFeatures,
    retry: false,
    refetchOnWindowFocus: false
  });

  const { data: fundRequestsData, isLoading: isLoadingFundRequests, error: fundRequestsError } = useGetAllFundRequests({
    enabled: isClient && canAccessProgramsFeatures,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Financial reports - only load if user has finance access
  const { data: trialBalanceData, isLoading: _isLoadingTrialBalance } = useGetTrialBalance({
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    enabled: isClient && canAccessFinanceFeatures
  });

  const { data: incomeStatementData, isLoading: _isLoadingIncomeStatement } = useGetIncomeStatement({
    date_from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    enabled: isClient && canAccessFinanceFeatures
  });

  // State for interactivity and real-time features
  const [currentTime, setCurrentTime] = useState(new Date());
  const [_selectedTimeRange, _setSelectedTimeRange] = useState('6M');
  const [_searchTerm, _setSearchTerm] = useState('');
  const [_selectedStatus, _setSelectedStatus] = useState('All');
  const [_viewMode, _setViewMode] = useState<'grid' | 'list'>('grid');
  const [_activeNotifications, _setActiveNotifications] = useState(userNotifications);
  const [_selectedWorkflowFilter, _setSelectedWorkflowFilter] = useState('assigned_to_me');

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Process real projects data
  const realProjectsAnalytics = useMemo(() => {
    if (!projectsData?.data?.results) return null;

    const projects = projectsData.data.results;

    // Calculate real metrics
    const totalProjects = projects.length;
    const totalBudget = projects.reduce((sum: number, project: any) =>
      sum + (parseFloat(project.budget) || 0), 0);

    // Group by status
    const statusGroups = projects.reduce((acc: any, project: any) => {
      const status = project.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Group by location
    const locationGroups = projects.reduce((acc: any, project: any) => {
      if (project.location && Array.isArray(project.location)) {
        project.location.forEach((loc: any) => {
          const locationName = loc.name || 'Unknown';
          acc[locationName] = (acc[locationName] || 0) + 1;
        });
      }
      return acc;
    }, {});

    // Group by intervention area
    const interventionGroups = projects.reduce((acc: any, project: any) => {
      const area = project.intervention_area?.code || 'Other';
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});

    // Calculate time-based metrics
    const currentDate = new Date();
    const thisYear = projects.filter((p: any) => {
      const startDate = new Date(p.start_date);
      return startDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const thisMonth = projects.filter((p: any) => {
      const startDate = new Date(p.start_date);
      return startDate.getFullYear() === currentDate.getFullYear() &&
             startDate.getMonth() === currentDate.getMonth();
    }).length;

    // Calculate funding source distribution
    const fundingGroups = projects.reduce((acc: any, project: any) => {
      if (project.funding_sources && Array.isArray(project.funding_sources) && project.funding_sources.length > 0) {
        project.funding_sources.forEach((source: any) => {
          if (source && source.name) {
            const sourceName = source.name.trim();
            if (sourceName) {
              acc[sourceName] = (acc[sourceName] || 0) + 1;
            }
          }
        });
      }
      return acc;
    }, {});

    return {
      totalProjects,
      totalBudget,
      statusGroups,
      locationGroups,
      interventionGroups,
      fundingGroups,
      thisYear,
      thisMonth,
      averageBudget: totalProjects > 0 ? totalBudget / totalProjects : 0
    };
  }, [projectsData]);

  // Process real workforce data
  const realWorkforceAnalytics = useMemo(() => {
    if (!workforceData?.data?.results) {
      // Return empty analytics if no data, but don't return null
      // This allows other parts of the dashboard to render
      return {
        totalEmployees: 0,
        departmentGroups: {},
        positionGroups: {},
        averageTeamSize: 0
      };
    }

    const workforce = workforceData.data.results;

    const totalEmployees = workforce.length;

    // Group by department (assuming a department field exists)
    const departmentGroups = workforce.reduce((acc: any, employee: any) => {
      // Handle department field - could be string, object, or null
      let dept = 'Unknown';
      if (employee.department) {
        if (typeof employee.department === 'string') {
          dept = employee.department;
        } else if (typeof employee.department === 'object' && employee.department.name) {
          dept = employee.department.name;
        } else if (typeof employee.department === 'object' && employee.department.title) {
          dept = employee.department.title;
        } else {
          dept = 'Unknown Department';
        }
      }

      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Group by position/role
    const positionGroups = workforce.reduce((acc: any, employee: any) => {
      const position = employee.position || employee.job_title || 'Unknown';
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEmployees,
      departmentGroups,
      positionGroups,
      averageTeamSize: totalEmployees > 0 ? Math.ceil(totalEmployees / Math.max(Object.keys(departmentGroups).length, 1)) : 0
    };
  }, [workforceData]);

  // Process real fund requests data
  const realFundRequestAnalytics = useMemo(() => {
    if (!fundRequestsData?.data?.results) {
      // Return empty analytics if no data, but don't return null
      // This allows other parts of the dashboard to render
      return {
        totalRequests: 0,
        totalRequestedAmount: 0,
        statusGroups: {},
        projectGroups: {},
        approvalRate: 0,
        rejectionRate: 0
      };
    }

    const requests = fundRequestsData.data.results;

    const totalRequests = requests.length;
    const totalRequestedAmount = requests.reduce((sum: number, request: any) =>
      sum + (parseFloat(request.amount) || 0), 0);

    // Group by status
    const statusGroups = requests.reduce((acc: any, request: any) => {
      const status = request.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Group by project
    const projectGroups = requests.reduce((acc: any, request: any) => {
      const projectName = request.project?.name || request.project_name || 'Unknown';
      acc[projectName] = (acc[projectName] || 0) + 1;
      return acc;
    }, {});

    // Calculate approval rates
    const approvedRequests = requests.filter((r: any) =>
      r.status?.toLowerCase().includes('approved')).length;
    const rejectedRequests = requests.filter((r: any) =>
      r.status?.toLowerCase().includes('rejected')).length;

    return {
      totalRequests,
      totalRequestedAmount,
      statusGroups,
      projectGroups,
      approvalRate: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0,
      rejectionRate: totalRequests > 0 ? (rejectedRequests / totalRequests) * 100 : 0
    };
  }, [fundRequestsData]);

  // Process financial reports data
  const realFinancialAnalytics = useMemo(() => {
    const trialBalance = trialBalanceData?.data || [];
    const incomeStatement = incomeStatementData?.data || null;

    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    let totalRevenue = 0;
    let totalExpenses = 0;

    // Process trial balance for financial position
    if (Array.isArray(trialBalance)) {
      trialBalance.forEach((account: any) => {
        const balance = parseFloat(account.net_balance) || 0;
        const accountType = account.account_type?.toLowerCase() || '';

        if (accountType.includes('asset')) {
          totalAssets += balance;
        } else if (accountType.includes('liability')) {
          totalLiabilities += balance;
        } else if (accountType.includes('equity')) {
          totalEquity += balance;
        }
      });
    }

    // Process income statement
    if (incomeStatement) {
      totalRevenue = incomeStatement.income?.total_income || 0;
      totalExpenses = incomeStatement.expenses?.total_expenses || 0;
    }

    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome,
      profitMargin,
      debtToEquity: totalEquity > 0 ? totalLiabilities / totalEquity : 0
    };
  }, [trialBalanceData, incomeStatementData]);

  // Loading states - include fund requests loading
  const isLoading = !isClient || isLoadingProjects || isLoadingWorkforce || isLoadingFundRequests;
  const hasError = projectsError || workforceError || fundRequestsError;

  // Check if we have any real data to display
  const hasRealData = realProjectsAnalytics || realWorkforceAnalytics || realFundRequestAnalytics || realFinancialAnalytics;

  // Prepare chart data for visualizations
  const chartData = useMemo(() => {
    const data: any = {};

    // Project status distribution for pie chart
    if (realProjectsAnalytics?.statusGroups) {
      data.projectStatusChart = Object.entries(realProjectsAnalytics.statusGroups).map(([status, count]) => ({
        name: status,
        value: count as number,
        percentage: ((count as number) / realProjectsAnalytics.totalProjects * 100).toFixed(1)
      }));
    }

    // Location distribution for bar chart
    if (realProjectsAnalytics?.locationGroups) {
      data.locationChart = Object.entries(realProjectsAnalytics.locationGroups)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 10) // Top 10 locations
        .map(([location, count]) => ({
          name: location,
          projects: count as number
        }));
    }

    // Funding source distribution
    if (realProjectsAnalytics?.fundingGroups) {
      const fundingEntries = Object.entries(realProjectsAnalytics.fundingGroups);
      if (fundingEntries.length > 0) {
        data.fundingChart = fundingEntries
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 12) // Top 12 funding sources (increased from 8)
          .map(([source, count]) => ({
            name: source.length > 25 ? `${source.substring(0, 22)}...` : source,
            fullName: source,
            projects: count as number
          }));
      }
    }

    // Department distribution from workforce
    if (realWorkforceAnalytics?.departmentGroups) {
      data.departmentChart = Object.entries(realWorkforceAnalytics.departmentGroups)
        .map(([department, count]) => ({
          name: department,
          employees: count as number,
          percentage: ((count as number) / realWorkforceAnalytics.totalEmployees * 100).toFixed(1)
        }));
    }

    // Fund request status distribution
    if (realFundRequestAnalytics?.statusGroups) {
      data.fundRequestChart = Object.entries(realFundRequestAnalytics.statusGroups).map(([status, count]) => ({
        name: status,
        value: count as number
      }));
    }

    return data;
  }, [realProjectsAnalytics, realWorkforceAnalytics, realFundRequestAnalytics]);

  // Format currency helper
  const formatCurrency = (amount: number, currency = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency;
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading real dashboard data...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching projects, workforce, and financial data</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
            <p className="text-gray-600 mb-4">There was an error loading your dashboard data.</p>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!hasRealData) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">No real data found from your ERP system endpoints.</p>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Real Data Dashboard Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Real Data Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </div>
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                Live Data
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              AHNI ERP Analytics • Data sourced from live endpoints
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4" />
            Refresh Data
          </Button>

          <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Real Data Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Project Analytics */}
        {realProjectsAnalytics && (
          <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{realProjectsAnalytics.totalProjects}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {realProjectsAnalytics.thisYear} started this year
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg budget: {formatCurrency(realProjectsAnalytics.averageBudget)}
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <FileText className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </Card>
        )}

        {/* Budget Analytics */}
        {realProjectsAnalytics && (
          <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(realProjectsAnalytics.totalBudget)}</p>
                <p className="text-sm text-green-600 mt-1">
                  {realProjectsAnalytics.thisMonth} new this month
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All active projects combined
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </Card>
        )}

        {/* Workforce Analytics */}
        {realWorkforceAnalytics?.totalEmployees > 0 && (
          <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Workforce</p>
                <p className="text-3xl font-bold text-gray-900">{realWorkforceAnalytics.totalEmployees}</p>
                <p className="text-sm text-purple-600 mt-1">
                  {Object.keys(realWorkforceAnalytics.departmentGroups).length} departments
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg team size: {realWorkforceAnalytics.averageTeamSize}
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </Card>
        )}

        {/* Fund Request Analytics */}
        {realFundRequestAnalytics && (
          <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fund Requests</p>
                <p className="text-3xl font-bold text-gray-900">{realFundRequestAnalytics.totalRequests}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {formatCurrency(realFundRequestAnalytics.totalRequestedAmount)} requested
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {realFundRequestAnalytics.approvalRate.toFixed(0)}% approval rate
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-orange-600" />
              </div>
            </div>
          </Card>
        )}

        {/* Financial Analytics */}
        {realFinancialAnalytics && (
          <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500 col-span-full lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(realFinancialAnalytics.totalAssets)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(realFinancialAnalytics.totalRevenue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${realFinancialAnalytics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(realFinancialAnalytics.netIncome)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className={`text-2xl font-bold ${realFinancialAnalytics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {realFinancialAnalytics.profitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Real Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        {chartData.projectStatusChart && chartData.projectStatusChart.length > 0 && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Project Status Distribution</h3>
                <p className="text-sm text-gray-600">Real-time project status breakdown</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                {realProjectsAnalytics?.totalProjects} Projects
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.projectStatusChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.projectStatusChart.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} projects`, name]}
                    labelFormatter={() => 'Project Status'}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {chartData.projectStatusChart.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Geographic Distribution */}
        {chartData.locationChart && chartData.locationChart.length > 0 && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Geographic Distribution</h3>
                <p className="text-sm text-gray-600">Projects by location/state</p>
              </div>
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                {chartData.locationChart.length} Locations
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.locationChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} projects`, 'Projects']}
                    labelFormatter={(label: any) => `Location: ${label}`}
                  />
                  <Bar dataKey="projects" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Funding Source Distribution */}
        {(chartData.fundingChart && chartData.fundingChart.length > 0) ? (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Funding Sources</h3>
                <p className="text-sm text-gray-600">Projects by funding organization</p>
              </div>
              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                {chartData.fundingChart.length} Sources
              </Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.fundingChart} layout="horizontal" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={110}
                    interval={0}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} projects`, 'Projects']}
                    labelFormatter={(label: any, payload: any) => {
                      if (payload && payload.length > 0 && payload[0].payload.fullName) {
                        return `Source: ${payload[0].payload.fullName}`;
                      }
                      return `Source: ${label}`;
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="projects" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Funding Sources</h3>
                <p className="text-sm text-gray-600">Projects by funding organization</p>
              </div>
              <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">
                0 Sources
              </Badge>
            </div>
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-16 h-16 mb-4 text-gray-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">No funding sources found</p>
              <p className="text-xs text-gray-500 text-center max-w-48">
                Projects with funding sources will appear here once you have project data
              </p>
            </div>
          </Card>
        )}

        {/* Workforce Distribution */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Workforce Distribution</h3>
              <p className="text-sm text-gray-600">
                {isLoadingWorkforce ? "Loading workforce data..." :
                 workforceError ? "Error loading workforce data" :
                 !canAccessHRFeatures ? "Requires HR access" :
                 "Employees by department"}
              </p>
            </div>
            {realWorkforceAnalytics?.totalEmployees > 0 && (
              <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                {realWorkforceAnalytics.totalEmployees} Employees
              </Badge>
            )}
          </div>

          {isLoadingWorkforce ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading workforce data...</span>
            </div>
          ) : workforceError ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-12 h-12 mb-3 text-red-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-red-600 mb-1">Failed to load workforce data</p>
              <p className="text-xs text-gray-500 text-center max-w-64">
                {workforceError?.message || "Please check your connection and try refreshing the page"}
              </p>
            </div>
          ) : !canAccessHRFeatures ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-12 h-12 mb-3 text-amber-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-amber-600 mb-1">Access Required</p>
              <p className="text-xs text-gray-500 text-center max-w-64">
                You need HR department access to view workforce distribution
              </p>
            </div>
          ) : !chartData.departmentChart || chartData.departmentChart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-12 h-12 mb-3 text-gray-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">No workforce data found</p>
              <p className="text-xs text-gray-500 text-center max-w-48">
                Employee data will appear here once staff records are added
              </p>
            </div>
          ) : (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.departmentChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#82CA9D"
                      dataKey="employees"
                    >
                      {chartData.departmentChart.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => [`${value} employees`, name]}
                      labelFormatter={() => 'Department'}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {chartData.departmentChart.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.employees} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Real Projects Data Table */}
      {projectsData?.data?.results && projectsData.data.results.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Active Projects</h3>
              <p className="text-sm text-gray-600">Real project data from your ERP system</p>
            </div>
            <Button size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View All Projects
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Project</th>
                  <th className="text-left p-3 font-medium">Budget</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Start Date</th>
                </tr>
              </thead>
              <tbody>
                {projectsData.data.results.slice(0, 10).map((project: any, index: number) => (
                  <tr key={project.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{project.title || project.name || `Project ${index + 1}`}</div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">
                          {project.goal || project.description || 'No description available'}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {project.currency === "USD" ? "$" : "₦"}
                        {parseFloat(project.budget || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={project.status === "ACTIVE" ? "default" : "secondary"}>
                        {project.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {project.location && Array.isArray(project.location)
                        ? project.location.slice(0, 2).map((loc: any) => loc.name).join(', ')
                        : 'Not specified'
                      }
                      {project.location && project.location.length > 2 &&
                        <span className="text-xs text-gray-500"> +{project.location.length - 2} more</span>
                      }
                    </td>
                    <td className="p-3 text-gray-600">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {projectsData.data.results.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing 10 of {projectsData.data.results.length} total projects
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Load More Projects
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Fund Requests Data Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Recent Fund Requests</h3>
            <p className="text-sm text-gray-600">
              {isLoadingFundRequests ? "Loading fund request data..." :
               fundRequestsError ? "Error loading fund requests" :
               !canAccessProgramsFeatures ? "Requires Programs access" :
               "Fund request data from your system"}
            </p>
          </div>
          {fundRequestsData?.data?.results?.length > 0 && (
            <Button size="sm" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              View All Requests
            </Button>
          )}
        </div>

        {isLoadingFundRequests ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading fund requests...</span>
          </div>
        ) : fundRequestsError ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-12 h-12 mb-3 text-red-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-red-600 mb-1">Failed to load fund requests</p>
            <p className="text-xs text-gray-500 text-center max-w-64">
              {fundRequestsError?.message || "Please check your connection and try refreshing the page"}
            </p>
          </div>
        ) : !canAccessProgramsFeatures ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-12 h-12 mb-3 text-amber-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-amber-600 mb-1">Access Required</p>
            <p className="text-xs text-gray-500 text-center max-w-64">
              You need Programs department access to view fund requests
            </p>
          </div>
        ) : !fundRequestsData?.data?.results || fundRequestsData.data.results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-12 h-12 mb-3 text-gray-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No fund requests found</p>
            <p className="text-xs text-gray-500 text-center max-w-48">
              Recent fund requests will appear here once they are created
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Request</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Project</th>
                  <th className="text-left p-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {fundRequestsData.data.results.slice(0, 8).map((request: any, index: number) => {
                  // Debug log in development
                  if (process.env.NODE_ENV === 'development' && index === 0) {
                    console.log('🔍 Fund Request Debug - First item:', {
                      total_amount: request.total_amount,
                      amount: request.amount,
                      available_balance: request.available_balance,
                      budget: request.budget,
                      currency: request.currency,
                      uuid_code: request.uuid_code,
                      location_code: request.location_code,
                      full_object: request
                    });
                  }

                  return (
                  <tr key={request.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">
                          {request.uuid_code || request.location_code || `REQ-${request.id?.slice(-6) || String(index + 1).padStart(3, '0')}`}
                        </div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">
                          {request.location_display || request.location_name ||
                           (typeof request.location === 'object' && request.location?.name) ||
                           request.title || request.name || 'No location specified'}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatNumberCurrency(
                          request.total_amount || request.amount || request.available_balance || request.budget || 0,
                          request.currency || "NGN"
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        request.status?.toLowerCase().includes('approved') ? "default" :
                        request.status?.toLowerCase().includes('pending') ? "secondary" :
                        request.status?.toLowerCase().includes('rejected') ? "destructive" :
                        "outline"
                      }>
                        {request.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-600">
                      {request.project?.name || request.project_name || 'Unassigned'}
                    </td>
                    <td className="p-3 text-gray-600">
                      {request.created_datetime || request.created_at ?
                        new Date(request.created_datetime || request.created_at).toLocaleDateString() :
                        'Unknown'}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Data Sources Information */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-200 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Real Data Dashboard</h3>
            <p className="text-sm text-gray-600 mb-2">
              This dashboard displays live data from your AHNI ERP system endpoints
            </p>
            <div className="flex flex-wrap gap-2">
              {realProjectsAnalytics && (
                <Badge variant="outline" className="bg-white">
                  ✓ Projects API ({realProjectsAnalytics.totalProjects} records)
                </Badge>
              )}
              {realWorkforceAnalytics?.totalEmployees > 0 && (
                <Badge variant="outline" className="bg-white">
                  ✓ Workforce API ({realWorkforceAnalytics.totalEmployees} records)
                </Badge>
              )}
              {realFundRequestAnalytics && (
                <Badge variant="outline" className="bg-white">
                  ✓ Fund Requests API ({realFundRequestAnalytics.totalRequests} records)
                </Badge>
              )}
              {realFinancialAnalytics && (
                <Badge variant="outline" className="bg-white">
                  ✓ Financial Reports API
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        AHNI Real Data Dashboard • Live ERP Analytics • Last refreshed: {new Date().toLocaleString()}
      </div>

    </div>
  );
}

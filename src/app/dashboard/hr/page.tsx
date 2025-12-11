"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  FileText,
  TrendingUp,
  Calendar,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart,
  Briefcase,
  Award,
  DollarSign,
  UserX
} from "lucide-react";
import Link from "next/link";
import { useGetWorkforces } from "@/features/hr/controllers/workforceController";
import { useGetJobAdvertisements } from "@/features/hr/controllers/jobAdvertisementController";
import { useGetLeaveRequests } from "@/features/hr/controllers/leaveRequestController";
import { useGetTimesheets } from "@/features/hr/controllers/timesheetController";
import { useGetPerformanceAssesments } from "@/features/hr/controllers/hrPerformanceAssessmentController";

export default function HROverviewPage() {
  // Fetch data
  const { data: workforceData } = useGetWorkforces({});
  const { data: jobAdvertisementsData } = useGetJobAdvertisements({});
  const { data: leaveRequestsData } = useGetLeaveRequests({});
  const { data: timesheetsData } = useGetTimesheets({});
  const { data: performanceData } = useGetPerformanceAssesments({});

  // Calculate metrics
  const workforce = workforceData?.data?.results || [];
  const jobAdverts = jobAdvertisementsData?.data?.results || [];
  const leaveRequests = leaveRequestsData?.data?.results || [];
  const timesheets = timesheetsData?.data?.results || [];
  const performanceAssessments = performanceData?.data?.results || [];

  const totalEmployees = workforce.length;
  const totalJobAdverts = jobAdverts.length;
  const totalLeaveRequests = leaveRequests.length;
  const totalTimesheets = timesheets.length;

  // Calculate status counts
  const activeJobAdverts = jobAdverts.filter((ad: any) =>
    ad.status?.toLowerCase() === 'active' || ad.status?.toLowerCase() === 'open'
  ).length;

  const pendingLeaveRequests = leaveRequests.filter((req: any) =>
    req.status?.toLowerCase() === 'pending' || req.status?.toLowerCase() === 'submitted'
  ).length;

  const approvedLeaveRequests = leaveRequests.filter((req: any) =>
    req.status?.toLowerCase() === 'approved'
  ).length;

  const pendingTimesheets = timesheets.filter((ts: any) =>
    ts.status?.toLowerCase() === 'pending' || ts.status?.toLowerCase() === 'submitted'
  ).length;

  // Quick stats cards
  const statsCards = [
    {
      title: "Total Workforce",
      value: totalEmployees,
      icon: Users,
      description: "Active employees",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/dashboard/hr/workforce-database"
    },
    {
      title: "Job Advertisements",
      value: totalJobAdverts,
      icon: Briefcase,
      description: `${activeJobAdverts} active openings`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/dashboard/hr/advertisement"
    },
    {
      title: "Leave Requests",
      value: totalLeaveRequests,
      icon: Calendar,
      description: `${pendingLeaveRequests} pending approval`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/dashboard/hr/leave-management"
    },
    {
      title: "Timesheets",
      value: totalTimesheets,
      icon: Clock,
      description: `${pendingTimesheets} pending review`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/dashboard/hr/timesheet-management"
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Employee Management",
      items: [
        { name: "Workforce Database", link: "/dashboard/hr/workforce-database", icon: Users },
        { name: "Workforce Need Analysis", link: "/dashboard/hr/workforce-need-analysis", icon: TrendingUp },
        { name: "Employee Onboarding", link: "/dashboard/hr/onboarding", icon: UserCheck },
        { name: "Separation Management", link: "/dashboard/hr/separation-management", icon: UserX }
      ]
    },
    {
      title: "Recruitment & Performance",
      items: [
        { name: "Job Advertisements", link: "/dashboard/hr/advertisement", icon: Briefcase },
        { name: "Application Selection", link: "/dashboard/hr/selection", icon: ClipboardList },
        { name: "Performance Appraisal", link: "/dashboard/hr/performance-management", icon: Award },
        { name: "Goal Management", link: "/dashboard/hr/goals-management", icon: TrendingUp }
      ]
    },
    {
      title: "Time & Leave Management",
      items: [
        { name: "Leave Management", link: "/dashboard/hr/leave-management", icon: Calendar },
        { name: "Timesheet Management", link: "/dashboard/hr/timesheet-management", icon: Clock },
        { name: "Leave Configuration", link: "/dashboard/hr/leave-management/configuration", icon: ClipboardList },
        { name: "Timesheet Approvals", link: "/dashboard/hr/timesheet-management/approvals", icon: CheckCircle }
      ]
    }
  ];

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Human Resources Overview</h1>
        <p className="text-muted-foreground">
          Monitor and manage employees, recruitment, performance, and workforce operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.link} key={index}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leave Requests</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedLeaveRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently on leave</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leave Approvals</CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingLeaveRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Openings</CardTitle>
            <Briefcase className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeJobAdverts}</div>
            <p className="text-xs text-muted-foreground mt-1">Open positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription>Quick access to common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIndex}
                      href={item.link}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                    >
                      <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity / Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Action Required
            </CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingLeaveRequests > 0 && (
                <Link
                  href="/dashboard/hr/leave-management"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">{pendingLeaveRequests} Pending Leave Requests</p>
                      <p className="text-xs text-muted-foreground">Review and approve</p>
                    </div>
                  </div>
                </Link>
              )}
              {pendingTimesheets > 0 && (
                <Link
                  href="/dashboard/hr/timesheet-management/approvals"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">{pendingTimesheets} Pending Timesheets</p>
                      <p className="text-xs text-muted-foreground">Review and approve</p>
                    </div>
                  </div>
                </Link>
              )}
              {pendingLeaveRequests === 0 && pendingTimesheets === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No pending actions at this time
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              Quick Stats
            </CardTitle>
            <CardDescription>At a glance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Employees</span>
                <span className="text-sm font-semibold">{totalEmployees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Job Adverts</span>
                <span className="text-sm font-semibold">{activeJobAdverts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Leave Requests</span>
                <span className="text-sm font-semibold">{totalLeaveRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Timesheets</span>
                <span className="text-sm font-semibold">{totalTimesheets}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compensation & Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compensation & Benefits</CardTitle>
          <CardDescription>Manage employee compensation and payroll</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/dashboard/hr/employee-benefit/pay-group"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-primary transition-colors">Compensation Management</h4>
                <p className="text-xs text-muted-foreground">Manage pay groups and compensation</p>
              </div>
            </Link>

            <Link
              href="/dashboard/hr/employee-benefit/pay-roll"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-primary transition-colors">Payroll Management</h4>
                <p className="text-xs text-muted-foreground">Process and manage payroll</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Grievance Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employee Relations</CardTitle>
          <CardDescription>Handle grievances and employee concerns</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard/hr/grievance-management"
            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
          >
            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold group-hover:text-primary transition-colors">Grievance Management</h4>
              <p className="text-xs text-muted-foreground">Track and resolve employee grievances</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

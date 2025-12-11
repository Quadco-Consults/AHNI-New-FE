"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import {
  Download,
  FileText,
  BarChart,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Filter,
  RefreshCw,
  PieChart,
  ArrowLeft
} from "lucide-react";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { useGetTimesheets } from "../../../controllers/timesheetController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetEmployeeOnboardings } from "../../../controllers/employeeOnboardingController";

// Report Types
interface ProjectSummaryReport {
  projectName: string;
  projectId: string;
  totalHours: number;
  employeeCount: number;
  avgHoursPerWeek: number;
  status: 'on-track' | 'behind' | 'ahead';
  lastUpdated: string;
}

interface EmployeeUtilizationReport {
  employeeName: string;
  employeeId: string;
  department: string;
  totalHours: number;
  utilization: number;
  overtimeHours: number;
  projectsCount: number;
}

// Mock data
const mockProjectSummary: ProjectSummaryReport[] = [
  {
    projectName: "ACEBAY Platform",
    projectId: "PROJ-001",
    totalHours: 520,
    employeeCount: 8,
    avgHoursPerWeek: 32.5,
    status: 'on-track',
    lastUpdated: '2024-01-15'
  },
  {
    projectName: "ACE Cluster 5",
    projectId: "PROJ-002", 
    totalHours: 280,
    employeeCount: 4,
    avgHoursPerWeek: 17.5,
    status: 'behind',
    lastUpdated: '2024-01-14'
  },
  {
    projectName: "UI/UX Redesign",
    projectId: "PROJ-003",
    totalHours: 360,
    employeeCount: 3,
    avgHoursPerWeek: 30.0,
    status: 'ahead',
    lastUpdated: '2024-01-15'
  }
];

const mockEmployeeUtilization: EmployeeUtilizationReport[] = [
  {
    employeeName: "Sarah Smith",
    employeeId: "EMP-001",
    department: "Engineering",
    totalHours: 160,
    utilization: 100,
    overtimeHours: 0,
    projectsCount: 2
  },
  {
    employeeName: "Mike Johnson", 
    employeeId: "EMP-002",
    department: "Design",
    totalHours: 140,
    utilization: 87.5,
    overtimeHours: 5,
    projectsCount: 1
  },
  {
    employeeName: "Emily Davis",
    employeeId: "EMP-003",
    department: "HR",
    totalHours: 180,
    utilization: 112.5,
    overtimeHours: 20,
    projectsCount: 3
  }
];

const TimesheetReports = () => {
  const router = useRouter();
  const [activeReport, setActiveReport] = useState<'project-summary' | 'employee-utilization' | 'attendance-report' | 'detailed-timesheet'>('project-summary');
  const [dateRange, setDateRange] = useState('current-month');
  const [department, setDepartment] = useState('all');
  const [project, setProject] = useState('all');
  const [employee, setEmployee] = useState('all');
  const [status, setStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  // API hooks for real data
  const { data: timesheetsData, isLoading: timesheetsLoading, refetch } = useGetTimesheets({
    page: 1,
    page_size: 1000,
    status: status === 'all' ? undefined : status,
    start_date: customDateFrom || undefined,
    end_date: customDateTo || undefined,
    enabled: true,
  });

  const { data: projectsData } = useGetAllProjects({ page: 1, size: 1000 });
  const { data: employeesData } = useGetEmployeeOnboardings({ page: 1, size: 1000, enabled: true });

  const timesheets = timesheetsData?.data?.results || [];
  const projects = (projectsData as any)?.data?.results || [];
  const employees = employeesData?.data?.results || [];

  // Project Summary Columns
  const projectColumns: ColumnDef<ProjectSummaryReport>[] = [
    {
      header: "Project",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.projectName}</div>
          <div className="text-sm text-gray-500">{row.original.projectId}</div>
        </div>
      ),
    },
    {
      header: "Total Hours",
      accessorKey: "totalHours",
      cell: ({ row }) => <div className="font-medium">{row.original.totalHours}h</div>,
    },
    {
      header: "Team Size", 
      accessorKey: "employeeCount",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          {row.original.employeeCount}
        </div>
      ),
    },
    {
      header: "Avg Hours/Week",
      accessorKey: "avgHoursPerWeek",
      cell: ({ row }) => <div>{row.original.avgHoursPerWeek}h</div>,
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const statusConfig = {
          'on-track': { variant: 'default' as const, label: 'On Track', className: 'bg-green-100 text-green-800' },
          'behind': { variant: 'destructive' as const, label: 'Behind', className: '' },
          'ahead': { variant: 'default' as const, label: 'Ahead', className: 'bg-blue-100 text-blue-800' },
        };
        const config = statusConfig[row.original.status];
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Last Updated",
      accessorKey: "lastUpdated",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {new Date(row.original.lastUpdated).toLocaleDateString("en-US")}
        </div>
      ),
    }
  ];

  // Employee Utilization Columns
  const employeeColumns: ColumnDef<EmployeeUtilizationReport>[] = [
    {
      header: "Employee",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.employeeName}</div>
          <div className="text-sm text-gray-500">{row.original.department}</div>
        </div>
      ),
    },
    {
      header: "Total Hours",
      accessorKey: "totalHours", 
      cell: ({ row }) => <div className="font-medium">{row.original.totalHours}h</div>,
    },
    {
      header: "Utilization",
      cell: ({ row }) => {
        const util = row.original.utilization;
        const color = util > 100 ? 'text-red-600' : util < 80 ? 'text-amber-600' : 'text-green-600';
        return (
          <div className={`font-medium ${color}`}>
            {util}%
          </div>
        );
      },
    },
    {
      header: "Overtime",
      cell: ({ row }) => {
        const overtime = row.original.overtimeHours;
        return (
          <div className={overtime > 0 ? 'text-amber-600 font-medium' : ''}>
            {overtime}h
          </div>
        );
      },
    },
    {
      header: "Projects",
      accessorKey: "projectsCount",
    }
  ];

  // Process real data for reports
  const getReportData = () => {
    const filteredTimesheets = timesheets.filter(ts => {
      if (project !== 'all') {
        return ts.entries?.some(entry => entry.project === project);
      }
      if (employee !== 'all') {
        return ts.employee === employee;
      }
      return true;
    });

    switch (activeReport) {
      case 'project-summary':
        return getProjectSummaryData(filteredTimesheets);
      case 'employee-utilization':
        return getEmployeeUtilizationData(filteredTimesheets);
      case 'detailed-timesheet':
        return getDetailedTimesheetData(filteredTimesheets);
      case 'attendance-report':
        return getAttendanceReportData(filteredTimesheets);
      default:
        return [];
    }
  };

  const getProjectSummaryData = (timesheets: any[]) => {
    const projectMap = new Map();

    timesheets.forEach(timesheet => {
      timesheet.entries?.forEach((entry: any) => {
        const projectId = entry.project;
        const projectName = entry.project_name || projects.find(p => p.id === projectId)?.title || 'Unknown Project';
        const hours = parseFloat(entry.hours_worked) || 0;

        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, {
            projectName,
            projectId,
            totalHours: 0,
            employeeCount: new Set(),
            entries: []
          });
        }

        const project = projectMap.get(projectId);
        project.totalHours += hours;
        project.employeeCount.add(timesheet.employee);
        project.entries.push(entry);
      });
    });

    return Array.from(projectMap.values()).map(project => ({
      projectName: project.projectName,
      projectId: project.projectId,
      totalHours: project.totalHours,
      employeeCount: project.employeeCount.size,
      avgHoursPerWeek: project.totalHours / Math.max(1, project.employeeCount.size),
      status: project.totalHours > 160 ? 'ahead' : project.totalHours < 80 ? 'behind' : 'on-track',
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const getEmployeeUtilizationData = (timesheets: any[]) => {
    const employeeMap = new Map();

    timesheets.forEach(timesheet => {
      const employeeId = timesheet.employee;
      const employeeDetail = timesheet.employee_detail;
      const totalHours = parseFloat(timesheet.total_hours) || 0;

      if (!employeeMap.has(employeeId)) {
        employeeMap.set(employeeId, {
          employeeName: `${employeeDetail?.legal_firstname || ''} ${employeeDetail?.legal_lastname || ''}`.trim() || 'Unknown',
          employeeId,
          department: employeeDetail?.designation?.name || 'Unknown',
          totalHours: 0,
          projectsCount: new Set(),
          timesheetsCount: 0
        });
      }

      const employee = employeeMap.get(employeeId);
      employee.totalHours += totalHours;
      employee.timesheetsCount += 1;
      timesheet.entries?.forEach((entry: any) => {
        employee.projectsCount.add(entry.project);
      });
    });

    return Array.from(employeeMap.values()).map(employee => ({
      employeeName: employee.employeeName,
      employeeId: employee.employeeId,
      department: employee.department,
      totalHours: employee.totalHours,
      utilization: Math.round((employee.totalHours / 160) * 100), // Assuming 160 hours per month
      overtimeHours: Math.max(0, employee.totalHours - 160),
      projectsCount: employee.projectsCount.size
    }));
  };

  const getDetailedTimesheetData = (timesheets: any[]) => {
    const detailedData: any[] = [];

    timesheets.forEach(timesheet => {
      timesheet.entries?.forEach((entry: any) => {
        detailedData.push({
          employeeName: `${timesheet.employee_detail?.legal_firstname || ''} ${timesheet.employee_detail?.legal_lastname || ''}`.trim(),
          projectName: entry.project_name || 'Unknown Project',
          activityName: entry.custom_activity || entry.activity_name || 'Unknown Activity',
          date: entry.date,
          hours: parseFloat(entry.hours_worked) || 0,
          description: entry.description || '',
          status: timesheet.status,
          period: `${timesheet.start_date} to ${timesheet.end_date}`
        });
      });
    });

    return detailedData;
  };

  const getAttendanceReportData = (timesheets: any[]) => {
    const attendanceMap = new Map();

    timesheets.forEach(timesheet => {
      const employeeId = timesheet.employee;
      const employeeDetail = timesheet.employee_detail;

      if (!attendanceMap.has(employeeId)) {
        attendanceMap.set(employeeId, {
          employeeName: `${employeeDetail?.legal_firstname || ''} ${employeeDetail?.legal_lastname || ''}`.trim(),
          department: employeeDetail?.designation?.name || 'Unknown',
          totalDays: 0,
          totalHours: 0,
          avgHoursPerDay: 0,
          onTimeSubmissions: 0,
          lateSubmissions: 0
        });
      }

      const attendance = attendanceMap.get(employeeId);
      const uniqueDays = new Set(timesheet.entries?.map((e: any) => e.date) || []);
      attendance.totalDays += uniqueDays.size;
      attendance.totalHours += parseFloat(timesheet.total_hours) || 0;

      // Mock submission timing data
      if (timesheet.submitted_datetime) {
        const submittedDate = new Date(timesheet.submitted_datetime);
        const isOnTime = submittedDate.getHours() < 18; // Assuming 6 PM cutoff
        if (isOnTime) {
          attendance.onTimeSubmissions += 1;
        } else {
          attendance.lateSubmissions += 1;
        }
      }
    });

    return Array.from(attendanceMap.values()).map(attendance => ({
      ...attendance,
      avgHoursPerDay: attendance.totalDays > 0 ? (attendance.totalHours / attendance.totalDays).toFixed(2) : '0.00'
    }));
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    setIsExporting(true);

    try {
      const reportData = getReportData();
      const reportType = activeReport;
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
      const filename = `${reportType}-report-${timestamp}.${format}`;

      if (format === 'csv') {
        downloadCSV(reportData, filename, reportType);
      } else if (format === 'excel') {
        downloadExcel(reportData, filename, reportType);
      } else if (format === 'pdf') {
        // For PDF, you'd typically use a library like jsPDF or call a backend service
        toast.info('PDF export will be available soon. Using CSV export instead.');
        downloadCSV(reportData, filename.replace('.pdf', '.csv'), reportType);
      }

      toast.success(`Report exported as ${filename}`);

    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = (data: any[], filename: string, reportType: string) => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = (data: any[], filename: string, reportType: string) => {
    // For Excel export, you'd typically use a library like xlsx
    // For now, we'll use CSV format
    downloadCSV(data, filename.replace('.excel', '.csv'), reportType);
  };

  // Calculate real stats from data
  const calculateStats = () => {
    const uniqueProjects = new Set();
    const uniqueEmployees = new Set();
    let totalHours = 0;
    let totalUtilization = 0;

    timesheets.forEach(timesheet => {
      uniqueEmployees.add(timesheet.employee);
      totalHours += parseFloat(timesheet.total_hours) || 0;

      timesheet.entries?.forEach((entry: any) => {
        uniqueProjects.add(entry.project);
      });
    });

    const avgUtilization = uniqueEmployees.size > 0 ? Math.round((totalHours / (uniqueEmployees.size * 160)) * 100) : 0;

    return {
      totalProjects: uniqueProjects.size,
      activeEmployees: uniqueEmployees.size,
      totalHours: totalHours.toLocaleString(),
      avgUtilization: `${avgUtilization}%`
    };
  };

  const stats = calculateStats();

  const reportStats = [
    {
      title: "Total Projects",
      value: stats.totalProjects.toString(),
      icon: <FileText className="w-5 h-5" />,
      change: projects.length > 0 ? `${projects.length} total in system` : "No change"
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees.toString(),
      icon: <Users className="w-5 h-5" />,
      change: employees.length > 0 ? `${employees.length} total employees` : "No change"
    },
    {
      title: "Total Hours",
      value: stats.totalHours,
      icon: <Clock className="w-5 h-5" />,
      change: `From ${timesheets.length} timesheets`
    },
    {
      title: "Avg Utilization",
      value: stats.avgUtilization,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "Based on 160h/month"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Timesheet Reports</h2>
            <p className="text-gray-600">Analytics and insights for timesheet data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={timesheetsLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${timesheetsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting || timesheetsLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={isExporting || timesheetsLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting || timesheetsLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Report Filters</span>
          </div>

          {/* First Row - Report Type and Date Range */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Report Type:</label>
              <Select value={activeReport} onValueChange={(value: any) => setActiveReport(value)}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project-summary">Project Summary</SelectItem>
                  <SelectItem value="employee-utilization">Employee Utilization</SelectItem>
                  <SelectItem value="detailed-timesheet">Detailed Timesheet</SelectItem>
                  <SelectItem value="attendance-report">Attendance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Date Range:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-week">Current Week</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Project, Employee, and Custom Date Range */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Project:</label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((proj: any) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.project_name || proj.title || `Project ${proj.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Employee:</label>
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp: any) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {`${emp.legal_firstname || ''} ${emp.legal_lastname || ''}`.trim() || emp.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">From:</label>
                  <input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {/* Clear Filters Button */}
          {(project !== 'all' || employee !== 'all' || status !== 'all' || customDateFrom || customDateTo) && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProject('all');
                  setEmployee('all');
                  setStatus('all');
                  setCustomDateFrom('');
                  setCustomDateTo('');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Report Table */}
      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {activeReport === 'project-summary' ? 'Project Summary Report' : 'Employee Utilization Report'}
              </h3>
              <p className="text-sm text-gray-600">
                {activeReport === 'project-summary' 
                  ? 'Hours breakdown by project with team metrics' 
                  : 'Employee productivity and utilization metrics'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {(() => {
          const reportData = getReportData();

          switch (activeReport) {
            case 'project-summary':
              return (
                <DataTable
                  data={reportData}
                  columns={projectColumns}
                  isLoading={timesheetsLoading || isExporting}
                />
              );
            case 'employee-utilization':
              return (
                <DataTable
                  data={reportData}
                  columns={employeeColumns}
                  isLoading={timesheetsLoading || isExporting}
                />
              );
            case 'detailed-timesheet':
              const detailedColumns: ColumnDef<any>[] = [
                { header: "Employee", accessorKey: "employeeName" },
                { header: "Project", accessorKey: "projectName" },
                { header: "Activity", accessorKey: "activityName" },
                {
                  header: "Date",
                  cell: ({ row }) => format(new Date(row.original.date), "MMM dd, yyyy")
                },
                {
                  header: "Hours",
                  cell: ({ row }) => `${row.original.hours.toFixed(2)}h`
                },
                { header: "Description", accessorKey: "description" },
                {
                  header: "Status",
                  cell: ({ row }) => (
                    <Badge variant={
                      row.original.status === 'approved' ? 'default' :
                      row.original.status === 'rejected' ? 'destructive' :
                      row.original.status === 'submitted' ? 'secondary' : 'outline'
                    }>
                      {row.original.status}
                    </Badge>
                  )
                }
              ];
              return (
                <DataTable
                  data={reportData}
                  columns={detailedColumns}
                  isLoading={timesheetsLoading || isExporting}
                />
              );
            case 'attendance-report':
              const attendanceColumns: ColumnDef<any>[] = [
                { header: "Employee", accessorKey: "employeeName" },
                { header: "Department", accessorKey: "department" },
                {
                  header: "Total Days",
                  cell: ({ row }) => `${row.original.totalDays} days`
                },
                {
                  header: "Total Hours",
                  cell: ({ row }) => `${row.original.totalHours.toFixed(2)}h`
                },
                {
                  header: "Avg Hours/Day",
                  cell: ({ row }) => `${row.original.avgHoursPerDay}h`
                },
                {
                  header: "On-Time Submissions",
                  cell: ({ row }) => (
                    <span className="text-green-600">
                      {row.original.onTimeSubmissions}
                    </span>
                  )
                },
                {
                  header: "Late Submissions",
                  cell: ({ row }) => (
                    <span className="text-red-600">
                      {row.original.lateSubmissions}
                    </span>
                  )
                }
              ];
              return (
                <DataTable
                  data={reportData}
                  columns={attendanceColumns}
                  isLoading={timesheetsLoading || isExporting}
                />
              );
            default:
              return (
                <div className="p-8 text-center text-gray-500">
                  Select a report type to view data
                </div>
              );
          }
        })()}
      </Card>
    </div>
  );
};

export default TimesheetReports;
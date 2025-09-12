"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Filter
} from "lucide-react";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

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
  const [activeReport, setActiveReport] = useState<'project-summary' | 'employee-utilization'>('project-summary');
  const [dateRange, setDateRange] = useState('current-month');
  const [department, setDepartment] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, call API endpoint
      const reportType = activeReport === 'project-summary' ? 'project-summary' : 'employee-utilization';
      const filename = `${reportType}-${dateRange}-${Date.now()}.${format}`;
      
      // Mock file download
      console.log(`Exporting ${filename}`);
      alert(`Report exported as ${filename}`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const reportStats = [
    {
      title: "Total Projects",
      value: "12",
      icon: <FileText className="w-5 h-5" />,
      change: "+2 from last month"
    },
    {
      title: "Active Employees",
      value: "45",
      icon: <Users className="w-5 h-5" />,
      change: "+5 from last month"
    },
    {
      title: "Total Hours",
      value: "1,240",
      icon: <Clock className="w-5 h-5" />,
      change: "+8% from last month"
    },
    {
      title: "Avg Utilization",
      value: "92%",
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3% from last month"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timesheet Reports</h2>
          <p className="text-gray-600">Analytics and insights for timesheet data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
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
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Report Type:</label>
            <Select value={activeReport} onValueChange={(value: any) => setActiveReport(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project-summary">Project Summary</SelectItem>
                <SelectItem value="employee-utilization">Employee Utilization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Date Range:</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
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
            <label className="text-sm text-gray-600">Department:</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {activeReport === 'project-summary' ? (
          <DataTable
            data={mockProjectSummary}
            columns={projectColumns}
            isLoading={isExporting}
          />
        ) : (
          <DataTable
            data={mockEmployeeUtilization}
            columns={employeeColumns}
            isLoading={isExporting}
          />
        )}
      </Card>
    </div>
  );
};

export default TimesheetReports;
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { TimesheetSummary, TimesheetResults } from "../../types/timesheet";
import { Badge } from "components/ui/badge";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TimesheetManagement = () => {
  const [timesheets] = useState<TimesheetSummary[]>(mockTimesheetData);
  const [monthlyTimesheets] = useState<MonthlyTimesheetSummary[]>(mockMonthlyData);
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("weekly");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-start gap-2">
          <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-6 border-none bg-none focus:outline-none outline-none"
            />
          </span>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>
        <Link href="/dashboard/hr/timesheet-management/create">
          <Button>
            <AddSquareIcon /> Create Timesheet
          </Button>
        </Link>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          </TabsList>
          
          {/* Month Navigation (only show in monthly view) */}
          {activeTab === "monthly" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium px-4">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="weekly">
          <Card>
            <DataTable data={timesheets} columns={timesheetColumns} isLoading={isLoading} />
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <DataTable data={monthlyTimesheets} columns={monthlyTimesheetColumns} isLoading={isLoading} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimesheetManagement;

// Monthly timesheet data type
type MonthlyTimesheetSummary = {
  id: string;
  employee: {
    id: string;
    name: string;
    department: string;
  };
  month: {
    year: number;
    month: number;
    monthName: string;
  };
  projects: {
    projectName: string;
    totalHours: number;
    weeks: {
      weekNumber: number;
      hours: number;
      status: 'draft' | 'submitted' | 'approved' | 'rejected';
    }[];
  }[];
  totalHours: number;
  submittedWeeks: number;
  approvedWeeks: number;
  pendingWeeks: number;
};

// Mock monthly timesheet data
const mockMonthlyData: MonthlyTimesheetSummary[] = [
  {
    id: "mts-001",
    employee: {
      id: "emp-001",
      name: "Sarah Smith",
      department: "Engineering"
    },
    month: {
      year: 2024,
      month: 1,
      monthName: "January"
    },
    projects: [
      {
        projectName: "ACEBAY Platform",
        totalHours: 128,
        weeks: [
          { weekNumber: 1, hours: 32, status: 'approved' },
          { weekNumber: 2, hours: 35, status: 'approved' },
          { weekNumber: 3, hours: 30, status: 'submitted' },
          { weekNumber: 4, hours: 31, status: 'draft' }
        ]
      },
      {
        projectName: "ACE Cluster 5",
        totalHours: 32,
        weeks: [
          { weekNumber: 1, hours: 8, status: 'approved' },
          { weekNumber: 2, hours: 5, status: 'approved' },
          { weekNumber: 3, hours: 10, status: 'submitted' },
          { weekNumber: 4, hours: 9, status: 'draft' }
        ]
      }
    ],
    totalHours: 160,
    submittedWeeks: 2,
    approvedWeeks: 2,
    pendingWeeks: 0
  },
  {
    id: "mts-002",
    employee: {
      id: "emp-002",
      name: "Mike Johnson",
      department: "Design"
    },
    month: {
      year: 2024,
      month: 1,
      monthName: "January"
    },
    projects: [
      {
        projectName: "UI/UX Redesign",
        totalHours: 140,
        weeks: [
          { weekNumber: 1, hours: 35, status: 'approved' },
          { weekNumber: 2, hours: 37, status: 'approved' },
          { weekNumber: 3, hours: 33, status: 'approved' },
          { weekNumber: 4, hours: 35, status: 'submitted' }
        ]
      }
    ],
    totalHours: 140,
    submittedWeeks: 1,
    approvedWeeks: 3,
    pendingWeeks: 0
  },
  {
    id: "mts-003",
    employee: {
      id: "emp-003",
      name: "Emily Davis",
      department: "HR"
    },
    month: {
      year: 2024,
      month: 1,
      monthName: "January"
    },
    projects: [
      {
        projectName: "Recruitment Drive",
        totalHours: 100,
        weeks: [
          { weekNumber: 1, hours: 25, status: 'approved' },
          { weekNumber: 2, hours: 30, status: 'approved' },
          { weekNumber: 3, hours: 20, status: 'rejected' },
          { weekNumber: 4, hours: 25, status: 'draft' }
        ]
      },
      {
        projectName: "Employee Training",
        totalHours: 60,
        weeks: [
          { weekNumber: 1, hours: 15, status: 'approved' },
          { weekNumber: 2, hours: 10, status: 'approved' },
          { weekNumber: 3, hours: 20, status: 'rejected' },
          { weekNumber: 4, hours: 15, status: 'draft' }
        ]
      }
    ],
    totalHours: 160,
    submittedWeeks: 0,
    approvedWeeks: 2,
    pendingWeeks: 2
  }
];

// Mock data for timesheet summaries
const mockTimesheetData: TimesheetSummary[] = [
  {
    id: "ts-001",
    employee: {
      id: "emp-001",
      name: "Sarah Smith",
      department: "Engineering"
    },
    weekPeriod: {
      startDate: "2024-01-08",
      endDate: "2024-01-14"
    },
    projects: [
      {
        projectName: "ACEBAY Platform",
        totalHours: 32,
        activities: [
          { activityName: "Frontend Development", hours: 20 },
          { activityName: "Code Review", hours: 12 }
        ]
      },
      {
        projectName: "ACE Cluster 5",
        totalHours: 8,
        activities: [
          { activityName: "Bug Fixes", hours: 8 }
        ]
      }
    ],
    totalHours: 40,
    status: "approved",
    submittedDate: "2024-01-15",
    approvedBy: "John Manager",
    approvedDate: "2024-01-16"
  },
  {
    id: "ts-002",
    employee: {
      id: "emp-002",
      name: "Mike Johnson",
      department: "Design"
    },
    weekPeriod: {
      startDate: "2024-01-08",
      endDate: "2024-01-14"
    },
    projects: [
      {
        projectName: "UI/UX Redesign",
        totalHours: 35,
        activities: [
          { activityName: "Wireframing", hours: 15 },
          { activityName: "Prototyping", hours: 20 }
        ]
      }
    ],
    totalHours: 35,
    status: "submitted",
    submittedDate: "2024-01-15"
  },
  {
    id: "ts-003",
    employee: {
      id: "emp-003",
      name: "Emily Davis",
      department: "HR"
    },
    weekPeriod: {
      startDate: "2024-01-08",
      endDate: "2024-01-14"
    },
    projects: [
      {
        projectName: "Recruitment Drive",
        totalHours: 25,
        activities: [
          { activityName: "Interview Coordination", hours: 15 },
          { activityName: "Candidate Screening", hours: 10 }
        ]
      },
      {
        projectName: "Employee Training",
        totalHours: 15,
        activities: [
          { activityName: "Training Material Preparation", hours: 15 }
        ]
      }
    ],
    totalHours: 40,
    status: "draft"
  },
  {
    id: "ts-004",
    employee: {
      id: "emp-004",
      name: "David Wilson",
      department: "Finance"
    },
    weekPeriod: {
      startDate: "2024-01-08",
      endDate: "2024-01-14"
    },
    projects: [
      {
        projectName: "Budget Planning",
        totalHours: 30,
        activities: [
          { activityName: "Financial Analysis", hours: 20 },
          { activityName: "Report Generation", hours: 10 }
        ]
      }
    ],
    totalHours: 30,
    status: "rejected",
    submittedDate: "2024-01-15",
    rejectionReason: "Missing documentation for overtime hours"
  }
];

// New columns for enhanced timesheet summary
const timesheetColumns: ColumnDef<TimesheetSummary>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    header: "Employee",
    accessorKey: "employee.name",
    size: 150,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.employee.name}</div>
        <div className="text-sm text-gray-500">{row.original.employee.department}</div>
      </div>
    ),
  },
  {
    header: "Week Period",
    id: "weekPeriod",
    size: 120,
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.weekPeriod.startDate), 'MMM dd')} - {format(new Date(row.original.weekPeriod.endDate), 'MMM dd, yyyy')}
      </div>
    ),
  },
  {
    header: "Projects & Activities",
    id: "projects",
    size: 350,
    cell: ({ row }) => <ProjectActivityList data={row.original} />,
  },
  {
    header: "Total Hours",
    accessorKey: "totalHours",
    size: 100,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.totalHours}h</div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    cell: ({ row }) => <TimesheetStatusBadge status={row.original.status} />,
  },
  {
    header: "Actions",
    id: "actions",
    size: 80,
    cell: ({ row }) => <TimesheetActionList timesheet={row.original} />,
  },
];

// Monthly timesheet columns
const monthlyTimesheetColumns: ColumnDef<MonthlyTimesheetSummary>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    header: "Employee",
    accessorKey: "employee.name",
    size: 150,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.employee.name}</div>
        <div className="text-sm text-gray-500">{row.original.employee.department}</div>
      </div>
    ),
  },
  {
    header: "Month",
    id: "month",
    size: 100,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.month.monthName} {row.original.month.year}
      </div>
    ),
  },
  {
    header: "Projects & Weekly Hours",
    id: "projects",
    size: 400,
    cell: ({ row }) => <MonthlyProjectList data={row.original} />,
  },
  {
    header: "Total Hours",
    accessorKey: "totalHours",
    size: 100,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.totalHours}h</div>
    ),
  },
  {
    header: "Status Summary",
    id: "statusSummary",
    size: 150,
    cell: ({ row }) => <MonthlyStatusSummary data={row.original} />,
  },
  {
    header: "Actions",
    id: "actions",
    size: 80,
    cell: ({ row }) => <MonthlyActionList data={row.original} />,
  },
];

// Legacy columns for backward compatibility
const columns: ColumnDef<TimesheetResults>[] = [
  {
    id: "select",
    size: 80,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "Employee",
    accessorKey: "employee",
    size: 200,
  },
  {
    header: "Projects",
    id: "position",
    cell: ({ row }) => <ProjectList data={row} />,
    size: 300,
  },
  {
    header: "Total Hours ",
    id: "hours",
    accessorFn: (data) => `${data?.hours} Hours`,
    size: 200,
  },
  {
    header: "Actions",
    id: "actions",
    size: 50,
    cell: () => <ActionList />,
  },
];

// Enhanced project activity list component
const ProjectActivityList = ({ data }: { data: TimesheetSummary }) => {
  return (
    <div className="space-y-2">
      {data.projects.map((project, projectIndex) => (
        <div key={projectIndex} className="border-l-2 border-blue-200 pl-3">
          <div className="font-medium text-sm">{project.projectName}</div>
          <div className="text-xs text-gray-600 mb-1">{project.totalHours}h total</div>
          <div className="flex flex-wrap gap-1">
            {project.activities.map((activity, actIndex) => (
              <Badge variant="secondary" key={actIndex} className="text-xs">
                {activity.activityName}: {activity.hours}h
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Status badge component
const TimesheetStatusBadge = ({ status }: { status: TimesheetSummary['status'] }) => {
  const statusConfig = {
    draft: { variant: 'secondary' as const, label: 'Draft', className: '' },
    submitted: { variant: 'default' as const, label: 'Submitted', className: '' },
    approved: { variant: 'default' as const, label: 'Approved', className: 'bg-green-100 text-green-800' },
    rejected: { variant: 'destructive' as const, label: 'Rejected', className: '' },
  };
  
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

// Monthly project list component
const MonthlyProjectList = ({ data }: { data: MonthlyTimesheetSummary }) => {
  return (
    <div className="space-y-3">
      {data.projects.map((project, projectIndex) => (
        <div key={projectIndex} className="border-l-2 border-blue-200 pl-3">
          <div className="font-medium text-sm">{project.projectName}</div>
          <div className="text-xs text-gray-600 mb-2">{project.totalHours}h total</div>
          <div className="grid grid-cols-4 gap-2">
            {project.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col items-center p-2 bg-gray-50 rounded">
                <div className="text-xs font-medium">W{week.weekNumber}</div>
                <div className="text-sm">{week.hours}h</div>
                <MonthlyWeekStatusBadge status={week.status} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Monthly week status badge
const MonthlyWeekStatusBadge = ({ status }: { status: 'draft' | 'submitted' | 'approved' | 'rejected' }) => {
  const statusConfig = {
    draft: { variant: 'secondary' as const, label: 'D', className: 'text-xs px-1' },
    submitted: { variant: 'default' as const, label: 'S', className: 'text-xs px-1' },
    approved: { variant: 'default' as const, label: 'A', className: 'bg-green-100 text-green-800 text-xs px-1' },
    rejected: { variant: 'destructive' as const, label: 'R', className: 'text-xs px-1' },
  };
  
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

// Monthly status summary component
const MonthlyStatusSummary = ({ data }: { data: MonthlyTimesheetSummary }) => {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Approved:</span>
        <span className="font-medium text-green-600">{data.approvedWeeks}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Submitted:</span>
        <span className="font-medium text-blue-600">{data.submittedWeeks}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Pending:</span>
        <span className="font-medium text-amber-600">{data.pendingWeeks}</span>
      </div>
    </div>
  );
};

// Monthly action list component
const MonthlyActionList = ({ data }: { data: MonthlyTimesheetSummary }) => {
  const handleViewMonth = () => {
    console.log('View monthly details for:', data.id);
    // Navigate to monthly detail view
  };

  const handleExportMonth = () => {
    console.log('Export month data for:', data.id);
    // Export monthly timesheet data
    alert('Monthly timesheet exported!');
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Button 
              className="w-full flex items-center justify-start gap-2" 
              variant="ghost"
              onClick={handleViewMonth}
            >
              <EyeIcon />
              View Month Details
            </Button>
            <Button 
              className="w-full flex items-center justify-start gap-2" 
              variant="ghost"
              onClick={handleExportMonth}
            >
              <EyeIcon />
              Export Month
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Enhanced action list with timesheet-specific actions
const TimesheetActionList = ({ timesheet }: { timesheet: TimesheetSummary }) => {
  const handleApprove = () => {
    // In real app, make API call to approve timesheet
    console.log('Approving timesheet:', timesheet.id);
    alert('Timesheet approved!');
  };

  const handleReject = () => {
    const reason = window.prompt('Please provide rejection reason:');
    if (reason) {
      // In real app, make API call to reject timesheet with reason
      console.log('Rejecting timesheet:', timesheet.id, 'Reason:', reason);
      alert('Timesheet rejected!');
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this timesheet?');
    if (confirmDelete) {
      // In real app, make API call to delete timesheet
      console.log('Deleting timesheet:', timesheet.id);
      alert('Timesheet deleted!');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Link href={`/dashboard/hr/timesheet-management/${timesheet.id}`}>
              <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                <EyeIcon />
                View Details
              </Button>
            </Link>
            
            {/* Edit option - only for draft and rejected timesheets */}
            {(timesheet.status === 'draft' || timesheet.status === 'rejected') && (
              <Link href={`/dashboard/hr/timesheet-management/${timesheet.id}/edit`}>
                <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                  <EyeIcon />
                  Edit
                </Button>
              </Link>
            )}

            {/* Approval actions - only for submitted timesheets */}
            {timesheet.status === 'submitted' && (
              <>
                <Button 
                  className="w-full flex items-center justify-start gap-2" 
                  variant="ghost"
                  onClick={handleApprove}
                >
                  <EyeIcon />
                  Approve
                </Button>
                <Button 
                  className="w-full flex items-center justify-start gap-2" 
                  variant="ghost"
                  onClick={handleReject}
                >
                  <EyeIcon />
                  Reject
                </Button>
              </>
            )}

            {/* Delete option - available for draft and rejected timesheets */}
            {(timesheet.status === 'draft' || timesheet.status === 'rejected') && (
              <Button 
                className="w-full flex items-center justify-start gap-2" 
                variant="ghost"
                onClick={handleDelete}
              >
                <DeleteIcon />
                Delete
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Legacy component
const ProjectList = ({ data }: { data: Row<TimesheetResults> }) => {
  return (
    <div className="flex items-center gap-2">
      {data?.original?.projects?.map((project, index) => (
        <Badge variant="darkYellow" key={index}>
          {project}
        </Badge>
      ))}
    </div>
  );
};

const ActionList = () => {
  return (
    <div className="flex items-center gap-2">
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex gap-2 py-6">
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" w-fit">
            <div className="flex flex-col items-start justify-between gap-1">
              <Link
                href="/dashboard/hr/timesheet-management/1"
              >
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>
              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
                <DeleteIcon />
                delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};

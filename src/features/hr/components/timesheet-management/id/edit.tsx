"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllWorkPlan, useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

type TTimesheetDetail = {
  projectId: string;
  workplanId: string;
  name: string;
  activity: string;
  activityId: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
  total: string;
};

const initialRow: TTimesheetDetail = {
  projectId: "",
  workplanId: "",
  name: "",
  activity: "",
  activityId: "",
  mon: "0",
  tue: "0",
  wed: "0",
  thu: "0",
  fri: "0",
  sat: "0",
  sun: "0",
  total: "0",
};

// Mock timesheet data - in real app, fetch this by ID
const mockTimesheetData = {
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
  status: "draft",
  entries: [
    {
      projectId: "proj-001",
      workplanId: "wp-001",
      name: "ACEBAY Platform",
      activity: "Frontend Development",
      activityId: "act-001",
      mon: "8",
      tue: "8",
      wed: "8",
      thu: "4",
      fri: "0",
      sat: "0",
      sun: "0",
      total: "28",
    },
    {
      projectId: "proj-002", 
      workplanId: "wp-002",
      name: "ACE Cluster 5",
      activity: "Bug Fixes",
      activityId: "act-002",
      mon: "0",
      tue: "0", 
      wed: "0",
      thu: "4",
      fri: "8",
      sat: "0",
      sun: "0",
      total: "12",
    }
  ]
};

const TimesheetEdit = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const timesheetId = params?.id as string;

  const [timesheetData, setTimesheetData] = useState<TTimesheetDetail[]>([initialRow]);
  const [savedTimesheet, setSavedTimesheet] = useState<TTimesheetDetail[]>([initialRow]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load timesheet data on component mount
  useEffect(() => {
    // In a real app, fetch timesheet by ID
    // For now, use mock data
    if (timesheetId && mockTimesheetData.id === timesheetId) {
      setTimesheetData(mockTimesheetData.entries);
      setSavedTimesheet(mockTimesheetData.entries);
    }
    setIsLoading(false);
  }, [timesheetId]);

  // Track changes
  useEffect(() => {
    const hasChangedData = JSON.stringify(timesheetData) !== JSON.stringify(savedTimesheet);
    setHasChanges(hasChangedData);
  }, [timesheetData, savedTimesheet]);

  const addRow = () => setTimesheetData((prev) => [...prev, { ...initialRow }]);

  const removeRow = (index: number) => {
    setTimesheetData((prev) => prev.filter((_, i) => i !== index));
  };

  const copyRow = (index: number) => {
    setTimesheetData((prev) => [...prev, { ...prev[index] }]);
  };

  const resetTimesheet = () => setTimesheetData([{ ...initialRow }]);

  const cancelChanges = () => {
    setTimesheetData(savedTimesheet);
    setHasChanges(false);
  };

  const handleSave = () => {
    console.log("Saving Timesheet:", timesheetData);
    setSavedTimesheet(timesheetData);
    setHasChanges(false);
    // In real app, make API call to save timesheet
    // Then redirect back to view mode or list
    router.push(`/dashboard/hr/timesheet-management/${timesheetId}`);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) return;
    }
    router.push(`/dashboard/hr/timesheet-management/${timesheetId}`);
  };

  const updateCell = (
    index: number,
    key: keyof TTimesheetDetail,
    value: string
  ) => {
    const updated = [...timesheetData];
    updated[index][key] = value;

    // Update total automatically
    if (["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(key)) {
      const totalHours = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        .map((day) =>
          parseFloat(updated[index][day as keyof TTimesheetDetail] || "0")
        )
        .reduce((acc, curr) => acc + curr, 0);
      updated[index].total = totalHours.toFixed(2);
    }

    setTimesheetData(updated);
  };

  const handleOpenDialog = () => {
    dispatch(
      openDialog({
        type: DialogType.COPY_ACTIVITIES,
        dialogProps: {
          header: "Copy Activities from Timesheet",
          data: timesheetId,
          onAddActivities: (activities: any[]) => {
            const newRows = activities.map((a: any) => ({
              ...a,
              mon: "",
              tue: "",
              wed: "",
              thu: "",
              fri: "",
              sat: "",
              sun: "",
              total: "0:00",
            }));
            setTimesheetData((prev) => [...prev, ...newRows]);
          },
        },
      })
    );
  };

  // Project Select Component
  const ProjectSelect = ({ onValueChange, rowIndex }: { value: string; onValueChange: (value: string) => void; rowIndex: number }) => {
    const { data: projectsData, isLoading } = useGetAllProjects({ page: 1, size: 100 });
    const projects = projectsData?.results || [];

    const handleProjectChange = (projectId: string) => {
      const selectedProject = projects.find(p => p.id === projectId);
      onValueChange(selectedProject?.title || projectId);
      updateCell(rowIndex, "projectId", projectId);
      // Clear workplan and activity when project changes
      updateCell(rowIndex, "workplanId", "");
      updateCell(rowIndex, "activity", "");
      updateCell(rowIndex, "activityId", "");
    };

    return (
      <Select value={timesheetData[rowIndex]?.projectId || ""} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading projects...
            </SelectItem>
          ) : projects.length === 0 ? (
            <SelectItem value="no-projects" disabled>
              No projects found
            </SelectItem>
          ) : (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title || project.project_id}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  // Workplan Select Component
  const WorkplanSelect = ({ value, onValueChange, rowIndex }: { value: string; onValueChange: (value: string) => void; rowIndex: number }) => {
    const selectedProjectId = timesheetData[rowIndex]?.projectId;
    const { data: workplansData, isLoading } = useGetAllWorkPlan({
      page: 1,
      size: 100,
      project_title: selectedProjectId ? "" : "",
      enabled: !!selectedProjectId
    });
    const workplans = workplansData?.results || [];
    
    const filteredWorkplans = workplans.filter(wp => wp.project === selectedProjectId);

    const handleWorkplanChange = (workplanId: string) => {
      onValueChange(workplanId);
      updateCell(rowIndex, "workplanId", workplanId);
      updateCell(rowIndex, "activity", "");
      updateCell(rowIndex, "activityId", "");
    };

    return (
      <Select value={value} onValueChange={handleWorkplanChange} disabled={!selectedProjectId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={selectedProjectId ? "Select workplan" : "Select project first"} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading workplans...
            </SelectItem>
          ) : !selectedProjectId ? (
            <SelectItem value="no-project" disabled>
              Please select a project first
            </SelectItem>
          ) : filteredWorkplans.length === 0 ? (
            <SelectItem value="no-workplans" disabled>
              No workplans found for this project
            </SelectItem>
          ) : (
            filteredWorkplans.map((workplan) => (
              <SelectItem key={workplan.id} value={workplan.id}>
                {workplan.financial_year} Workplan
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  // Activity Select Component
  const ActivitySelect = ({ value, onValueChange, rowIndex }: { value: string; onValueChange: (value: string) => void; rowIndex: number }) => {
    const selectedWorkplanId = timesheetData[rowIndex]?.workplanId;
    const { data: workplanData, isLoading } = useGetSingleWorkPlan(selectedWorkplanId || "", !!selectedWorkplanId);
    const activities = workplanData?.data?.activities || [];
    
    const handleActivityChange = (activityValue: string) => {
      const [activityId, activityName] = activityValue.split('|');
      onValueChange(activityName);
      updateCell(rowIndex, "activityId", activityId);
    };

    return (
      <Select 
        value={`${timesheetData[rowIndex]?.activityId || ''}|${value}`} 
        onValueChange={handleActivityChange} 
        disabled={!selectedWorkplanId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={selectedWorkplanId ? "Select activity" : "Select workplan first"} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading activities...
            </SelectItem>
          ) : !selectedWorkplanId ? (
            <SelectItem value="no-workplan" disabled>
              Please select a workplan first
            </SelectItem>
          ) : activities.length === 0 ? (
            <SelectItem value="no-activities" disabled>
              No activities found in this workplan
            </SelectItem>
          ) : (
            activities.map((activity) => (
              <SelectItem key={activity.id} value={`${activity.id}|${activity.activity}`}>
                {activity.activity_number}: {activity.activity}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  const columns: ColumnDef<TTimesheetDetail>[] = [
    { 
      header: "Project Name", 
      accessorKey: "name",
      cell: ({ row }: { row: any }) => (
        <ProjectSelect
          value={row.original.name}
          onValueChange={(value) => updateCell(row.index, "name", value)}
          rowIndex={row.index}
        />
      ),
    },
    { 
      header: "Workplan", 
      accessorKey: "workplanId",
      cell: ({ row }: { row: any }) => (
        <WorkplanSelect
          value={row.original.workplanId}
          onValueChange={(value) => updateCell(row.index, "workplanId", value)}
          rowIndex={row.index}
        />
      ),
    },
    { 
      header: "Activity", 
      accessorKey: "activity",
      cell: ({ row }: { row: any }) => (
        <ActivitySelect
          value={row.original.activity}
          onValueChange={(value) => updateCell(row.index, "activity", value)}
          rowIndex={row.index}
        />
      ),
    },
    ...["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => ({
      header: day.charAt(0).toUpperCase() + day.slice(1),
      accessorKey: day,
      cell: ({ row }: { row: any }) => (
        <input
          type='number'
          value={row.original[day as keyof TTimesheetDetail]}
          className='w-16 px-1 border rounded text-sm focus:border-blue-500 focus:outline-none'
          onChange={(e) =>
            updateCell(row.index, day as keyof TTimesheetDetail, e.target.value)
          }
          min="0"
          max="24"
          step="0.5"
        />
      ),
    })),
    { 
      header: "Total", 
      accessorKey: "total",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.original.total}h</div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => copyRow(row.index)}
          >
            Copy
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => removeRow(row.index)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading timesheet...</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className='text-2xl font-bold'>Edit Timesheet</h2>
            <div className="text-sm text-gray-600">
              Week: Jan 08 - Jan 14, 2024 | Employee: Sarah Smith
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary">
              Unsaved changes
            </Badge>
          )}
          <Badge variant="secondary">Draft</Badge>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex gap-2 flex-wrap'>
        <Button onClick={addRow}>Add Row</Button>
        <Button variant='outline' onClick={resetTimesheet}>
          Reset
        </Button>
        <Button variant='outline' onClick={cancelChanges} disabled={!hasChanges}>
          Cancel Changes
        </Button>
        <Button onClick={handleOpenDialog}>Copy Activities</Button>
        <div className="ml-auto flex gap-2">
          <Button variant='outline' onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Timesheet table */}
      <Card>
        <DataTable columns={columns} data={timesheetData} />
      </Card>

      {/* Status card */}
      <Card className='space-y-2'>
        <h4 className='font-semibold'>Status</h4>
        <div className="flex items-center gap-2">
          <Badge variant='secondary'>Draft</Badge>
          {hasChanges && (
            <span className="text-sm text-amber-600">
              You have unsaved changes
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TimesheetEdit;
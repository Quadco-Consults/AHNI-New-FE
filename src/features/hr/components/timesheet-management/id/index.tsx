"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllWorkPlan, useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import {
  useGetTimesheetById,
  useCreateTimesheet,
  useUpdateTimesheet,
  useSubmitTimesheet,
  useApproveTimesheet,
  useRejectTimesheet,
  useValidateTimesheet,
  useGetBlockedDates,
} from "@/features/hr/controllers/timesheetController";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { toast } from "sonner";
import Modal from "react-modal";
import { CalendarIcon, Trash2, Copy, Plus } from "lucide-react";
import { format } from "date-fns";
import type { TimesheetEntry } from "@/features/hr/types/timesheet";

const TimesheetManagementFull = () => {
  const params = useParams();
  const timesheetId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  console.log("TimesheetManagementFull - params:", params, "timesheetId:", timesheetId);

  // Fetch timesheet data from backend
  const { data: timesheetData, isLoading: isLoadingTimesheet, refetch } = useGetTimesheetById(
    timesheetId,
    !!timesheetId && timesheetId !== "create"
  );
  const timesheet = timesheetData?.data;

  // Local state for entries
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [selectedApprover, setSelectedApprover] = useState<string>("");

  // API hooks - use empty string for "create" mode to avoid invalid UUID errors
  const validTimesheetId = timesheetId === "create" ? "" : timesheetId;
  const { createTimesheet, isLoading: isCreating } = useCreateTimesheet();
  const { updateTimesheet, isLoading: isUpdating } = useUpdateTimesheet(validTimesheetId);
  const { submitTimesheet, isLoading: isSubmitting } = useSubmitTimesheet(validTimesheetId);
  const { validateTimesheet } = useValidateTimesheet(validTimesheetId);

  // Fetch blocked dates
  const { data: blockedDatesData } = useGetBlockedDates(timesheetId, !!timesheetId && timesheetId !== "create");
  const blockedDates = blockedDatesData?.data?.blocked_dates || [];

  // Fetch employees for approver selection
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeeOnboardings({
    page: 1,
    size: 100,
    enabled: true,
  });

  // Initialize entries from backend data
  useEffect(() => {
    if (timesheet?.entries) {
      setEntries(timesheet.entries);
    }
  }, [timesheet]);

  const timesheetStatus = timesheet?.status || "draft";
  const canEdit = timesheetStatus === "draft" || timesheetStatus === "rejected";

  // Check if date is blocked
  const isDateBlocked = useCallback((dateStr: string) => {
    return blockedDates.some((blocked) => blocked.date === dateStr);
  }, [blockedDates]);

  // Get date info for display
  const getDateInfo = useCallback((dateStr: string) => {
    const blocked = blockedDates.find((b) => b.date === dateStr);
    return blocked
      ? {
          type: blocked.type,
          reason: blocked.reason,
          isBlocked: true,
        }
      : null;
  }, [blockedDates]);

  // Add new entry
  const addEntry = useCallback(() => {
    const newEntry: TimesheetEntry = {
      project: "",
      custom_activity: "New Activity", // Default to custom activity with placeholder text
      date: format(new Date(), "yyyy-MM-dd"),
      hours_worked: 0,
      description: "",
    };
    setEntries((prev) => [...prev, newEntry]);
  }, []);

  // Remove entry
  const removeEntry = useCallback((index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Copy entry
  const copyEntry = useCallback((index: number) => {
    setEntries((prev) => {
      const entryToCopy = prev[index];
      return [
        ...prev,
        {
          ...entryToCopy,
          id: undefined, // Remove ID so it creates a new entry
        },
      ];
    });
  }, []);

  // Update entry field
  const updateEntry = useCallback((index: number, field: keyof TimesheetEntry, value: any) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Save timesheet (create or update)
  const handleSave = async () => {
    console.log("handleSave called - timesheetId:", timesheetId, "type:", typeof timesheetId);

    // Validate entries
    if (entries.length === 0) {
      toast.error("Please add at least one timesheet entry");
      return;
    }

    // Validate each entry
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry.project) {
        toast.error(`Entry ${i + 1}: Please select a project`);
        return;
      }
      if (!entry.activity_plan && !entry.custom_activity) {
        toast.error(`Entry ${i + 1}: Please select or enter an activity`);
        return;
      }
      if (!entry.date) {
        toast.error(`Entry ${i + 1}: Please select a date`);
        return;
      }
      if (!entry.hours_worked || entry.hours_worked <= 0) {
        toast.error(`Entry ${i + 1}: Please enter valid hours (greater than 0)`);
        return;
      }
    }

    try {
      console.log("handleSave validation passed - timesheetId:", timesheetId);

      // If timesheetId is undefined or "create", create a new timesheet
      if (!timesheetId || timesheetId === "create") {
        console.log("Creating new timesheet");
        // Create new timesheet
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Monday
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // Sunday

        const result = await createTimesheet({
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          entries: entries.map((entry) => ({
            project: entry.project,
            ...(entry.activity_plan && { activity_plan: entry.activity_plan }),
            ...(entry.custom_activity && { custom_activity: entry.custom_activity }),
            date: entry.date,
            hours_worked: entry.hours_worked,
            description: entry.description || "",
          })),
        });

        // Redirect to the created timesheet's detail page
        const createdId = (result as any)?.data?.id;
        if (createdId) {
          toast.success("Timesheet created successfully");
          window.location.href = `/dashboard/hr/timesheet-management/${createdId}`;
        } else {
          toast.error("Timesheet created but could not retrieve ID. Please refresh the page.");
        }
        return; // Exit early to prevent any further execution
      } else {
        console.log("Updating existing timesheet");
        // Update existing timesheet
        await updateTimesheet({
          entries: entries.map((entry) => ({
            ...(entry.id && { id: entry.id }),
            project: entry.project,
            ...(entry.activity_plan && { activity_plan: entry.activity_plan }),
            ...(entry.custom_activity && { custom_activity: entry.custom_activity }),
            date: entry.date,
            hours_worked: entry.hours_worked,
            description: entry.description || "",
          })),
        });
        toast.success("Timesheet updated successfully");
        refetch();
      }
    } catch (error: any) {
      console.error("Save timesheet error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save timesheet";
      toast.error(errorMessage);
    }
  };

  // Submit for approval with validation
  const handleSubmitForApproval = async () => {
    // Approver selection is optional - backend will handle default approver
    // if (!selectedApprover) {
    //   toast.error("Please select an approver");
    //   return;
    // }

    // For new timesheets (create mode), save first before submitting
    if (timesheetId === "create") {
      toast.error("Please save the timesheet first before submitting");
      return;
    }

    // Validate first (optional - skip if validation endpoint doesn't exist)
    try {
      const validationResult = await validateTimesheet();

      console.log("Validation result:", validationResult);

      if (validationResult && !validationResult?.valid) {
        const errors = validationResult?.errors || [];
        if (errors.length > 0) {
          toast.error("Validation failed: " + errors.join(", "));
          return;
        }
        // If no specific errors but invalid, ask user to proceed
        const proceed = window.confirm("Validation returned no specific errors. Do you want to proceed with submission anyway?");
        if (!proceed) return;
      }

      if (validationResult?.warnings && validationResult.warnings.length > 0) {
        toast.warning("Warnings: " + validationResult.warnings.join(", "));
      }
    } catch (error) {
      console.warn("Validation API call failed, proceeding anyway:", error);
      // Skip validation if endpoint doesn't exist or fails
    }

    // Submit
    try {
      console.log("Submitting timesheet with approver:", selectedApprover);
      await submitTimesheet(selectedApprover || undefined);
      toast.success("Timesheet submitted for approval");
      refetch();
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error?.message || "Failed to submit timesheet";

      // If approver error, suggest submitting without approver
      if (errorMessage.includes("approver")) {
        toast.error(errorMessage + " - Try submitting without selecting an approver.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Project Select Component
  const ProjectSelect = ({ value, onChange, rowIndex }: any) => {
    const { data: projectsData, isLoading } = useGetAllProjects({ page: 1, size: 1000 });
    // Handle API wrapper structure - projects API returns {data: {results: []}}
    const allProjects = (projectsData as any)?.data?.results || [];
    // Filter out empty IDs
    const projects = allProjects.filter((project: any) => project?.id && project.id.trim() !== '');

    return (
      <Select value={value} onValueChange={(val) => onChange(rowIndex, "project", val)}>
        <SelectTrigger className="w-full min-w-[200px]">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : projects.length === 0 ? (
            <SelectItem value="no-projects" disabled>
              No projects found
            </SelectItem>
          ) : (
            projects.map((project: any) => {
              // Use project ID (UUID) as the value for backend
              const projectTitle = project.project_name || project.title || project.project_id;
              return (
                <SelectItem key={project.id} value={project.id}>
                  {projectTitle}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
    );
  };

  // Activity Type Toggle Component (Hybrid: ActivityPlan OR Custom)
  const ActivityTypeSelect = ({ value, onChange, rowIndex, entry }: any) => {
    const activityType = entry?.activity_plan ? "planned" : entry?.custom_activity ? "custom" : "";

    const handleTypeChange = (type: string) => {
      if (type === "planned") {
        // Switch to planned: clear custom_activity
        onChange(rowIndex, "custom_activity", undefined);
        onChange(rowIndex, "activity_plan", "");
      } else {
        // Switch to custom: clear activity_plan and set custom_activity
        onChange(rowIndex, "activity_plan", undefined);
        onChange(rowIndex, "custom_activity", "");
      }
    };

    return (
      <Select value={activityType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Activity type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="planned">From Workplan</SelectItem>
          <SelectItem value="custom">Custom Activity</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  // Activity Selection Component (shows ActivityPlan dropdown OR custom input)
  const ActivityInput = ({ value, onChange, rowIndex, entry }: any) => {
    const selectedProjectId = entry?.project; // This is now the project UUID
    const activityType = entry?.activity_plan ? "planned" : entry?.custom_activity ? "custom" : "";

    // Get project details to find the title
    const { data: projectsData } = useGetAllProjects({ page: 1, size: 1000 });
    const allProjects = (projectsData as any)?.data?.results || [];
    const selectedProject = allProjects.find((p: any) => p.id === selectedProjectId);
    const selectedProjectTitle = selectedProject?.project_name || selectedProject?.title || selectedProject?.project_id;

    // For planned activities: fetch workplan by project title
    const { data: workplansData, isLoading: isLoadingActivities, error: workplanError } = useGetAllWorkPlan({
      project_title: selectedProjectTitle || "",
      page: 1,
      size: 10,
      enabled: !!selectedProjectTitle
    });

    // Extract the first workplan and its activities
    // Response structure: {data: {results: [], pagination: {}}}
    // Type cast needed because controller type annotation doesn't match runtime response
    const workplan = (workplansData as any)?.data?.results?.[0];
    const activities = workplan?.activities || [];

    if (activityType === "custom") {
      // Custom text input
      return (
        <Input
          placeholder="Enter custom activity name"
          value={entry?.custom_activity || ""}
          onChange={(e) => onChange(rowIndex, "custom_activity", e.target.value)}
          className="min-w-[200px]"
          disabled={!canEdit}
        />
      );
    }

    // ActivityPlan dropdown
    return (
      <Select
        value={entry?.activity_plan || ""}
        onValueChange={(val) => onChange(rowIndex, "activity_plan", val)}
        disabled={!selectedProjectId}
      >
        <SelectTrigger className="w-full min-w-[200px]">
          <SelectValue placeholder={selectedProjectId ? "Select activity" : "Select project first"} />
        </SelectTrigger>
        <SelectContent>
          {!selectedProjectId ? (
            <SelectItem value="no-project" disabled>
              Please select a project first
            </SelectItem>
          ) : isLoadingActivities ? (
            <SelectItem value="loading-activities" disabled>
              Loading activities...
            </SelectItem>
          ) : workplanError ? (
            <SelectItem value="no-workplan" disabled>
              No workplan found for this project
            </SelectItem>
          ) : activities.length === 0 ? (
            <SelectItem value="no-activities" disabled>
              No activities found in workplan
            </SelectItem>
          ) : (
            activities.map((activity: any) => (
              <SelectItem key={activity.id} value={activity.id}>
                {activity.activity_number}: {activity.activity}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  // Date Picker with blocked dates
  const DatePicker = ({ value, onChange, rowIndex }: any) => {
    const [open, setOpen] = useState(false);
    const dateStr = value || format(new Date(), "yyyy-MM-dd");
    const dateInfo = getDateInfo(dateStr);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[200px] justify-start text-left font-normal ${
              dateInfo?.isBlocked ? "border-red-500 bg-red-50" : ""
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) {
                const formattedDate = format(date, "yyyy-MM-dd");
                if (isDateBlocked(formattedDate)) {
                  const info = getDateInfo(formattedDate);
                  toast.error(`Cannot select: ${info?.reason}`);
                  return;
                }
                onChange(rowIndex, "date", formattedDate);
                setOpen(false);
              }
            }}
            disabled={(date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return isDateBlocked(dateStr);
            }}
            initialFocus
          />
          {dateInfo?.isBlocked && (
            <div className="p-3 border-t bg-red-50">
              <p className="text-sm text-red-700">{dateInfo.reason}</p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  // Table columns (memoized to prevent re-creation on every render)
  const columns: ColumnDef<TimesheetEntry>[] = useMemo(() => [
    {
      header: "Project",
      cell: ({ row }) => (
        <ProjectSelect value={row.original.project} onChange={updateEntry} rowIndex={row.index} />
      ),
    },
    {
      header: "Activity Type",
      cell: ({ row }) => (
        <ActivityTypeSelect value="" onChange={updateEntry} rowIndex={row.index} entry={row.original} />
      ),
    },
    {
      header: "Activity",
      cell: ({ row }) => (
        <ActivityInput
          value={row.original.activity_plan || row.original.custom_activity}
          onChange={updateEntry}
          rowIndex={row.index}
          entry={row.original}
        />
      ),
    },
    {
      header: "Date",
      cell: ({ row }) => (
        <DatePicker value={row.original.date} onChange={updateEntry} rowIndex={row.index} />
      ),
    },
    {
      header: "Hours",
      cell: ({ row }) => (
        <Input
          type="number"
          min="0.01"
          max="24"
          step="0.5"
          value={row.original.hours_worked || 0}
          onChange={(e) => updateEntry(row.index, "hours_worked", parseFloat(e.target.value) || 0)}
          className="w-24"
          disabled={!canEdit}
        />
      ),
    },
    {
      header: "Description",
      cell: ({ row }) => (
        <Textarea
          placeholder="Enter description"
          value={row.original.description || ""}
          onChange={(e) => updateEntry(row.index, "description", e.target.value)}
          className="min-w-[300px] min-h-[60px] resize-y"
          rows={2}
          disabled={!canEdit}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyEntry(row.index)}
            disabled={timesheetStatus !== "draft" && timesheetStatus !== "rejected"}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeEntry(row.index)}
            disabled={timesheetStatus !== "draft" && timesheetStatus !== "rejected"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [entries, timesheetStatus, blockedDates, updateEntry, copyEntry, removeEntry, getDateInfo, isDateBlocked]);

  if (isLoadingTimesheet && timesheetId !== "create") {
    return <div className="p-8 text-center">Loading timesheet...</div>;
  }

  const totalHours = entries.reduce((sum, entry) => {
    const hours = parseFloat(entry.hours_worked as any) || 0;
    return sum + hours;
  }, 0);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timesheet Management</h2>
          {timesheet && (
            <p className="text-sm text-gray-600">
              Period: {timesheet.start_date} to {timesheet.end_date}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Hours</p>
            <p className="text-2xl font-bold">{totalHours.toFixed(2)}</p>
          </div>
          <Badge
            variant={
              timesheetStatus === "approved"
                ? "default"
                : timesheetStatus === "rejected"
                ? "destructive"
                : timesheetStatus === "submitted"
                ? "secondary"
                : "outline"
            }
          >
            {timesheetStatus.charAt(0).toUpperCase() + timesheetStatus.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={addEntry} disabled={!canEdit} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
        <Button variant="outline" onClick={() => setEntries([])} disabled={!canEdit} size="sm">
          Clear All
        </Button>
        <Button
          variant="default"
          onClick={handleSave}
          disabled={!canEdit || isCreating || isUpdating}
          size="sm"
        >
          {isCreating || isUpdating ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card>
        <DataTable columns={columns} data={entries} />
      </Card>

      {/* Approval Section */}
      <Card className="space-y-4">
        <h3 className="font-semibold text-lg">Approval Workflow</h3>

        {/* Approver Selection (only show in draft status) */}
        {timesheetStatus === "draft" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Approver <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <Select value={selectedApprover} onValueChange={setSelectedApprover}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an approver (optional)" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingEmployees ? (
                  <SelectItem value="loading" disabled>
                    Loading employees...
                  </SelectItem>
                ) : !employeesData?.data?.results || employeesData.data.results.length === 0 ? (
                  <SelectItem value="no-employees" disabled>
                    No employees found
                  </SelectItem>
                ) : (
                  employeesData.data.results.map((employee: any) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.legal_firstname} {employee.legal_lastname}{" "}
                      {employee.position?.name ? `(${employee.position.name})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show approver info if submitted/approved */}
        {(timesheetStatus === "submitted" || timesheetStatus === "approved") && timesheet?.approver && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-semibold text-blue-800">Approver:</p>
            <p className="text-sm text-blue-700">
              {timesheet.approver.name}
              {timesheet.approver.position ? ` (${timesheet.approver.position})` : ""}
            </p>
          </div>
        )}

        {/* Show rejection reason if rejected */}
        {timesheetStatus === "rejected" && timesheet?.rejection_reason && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
            <p className="text-sm text-red-700">{timesheet.rejection_reason}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {/* Draft: Show Submit for Approval */}
          {timesheetStatus === "draft" && (
            <Button onClick={handleSubmitForApproval} disabled={isSubmitting || entries.length === 0}>
              {isSubmitting ? "Submitting..." : "Submit for Approval"}
            </Button>
          )}

          {/* Submitted: Show status message (approval happens on approvals page) */}
          {timesheetStatus === "submitted" && (
            <div className="text-sm text-gray-600 py-2">
              ✓ Submitted for approval - waiting for manager review
            </div>
          )}

          {/* Rejected: Can resubmit after editing */}
          {timesheetStatus === "rejected" && (
            <Button onClick={handleSubmitForApproval} disabled={isSubmitting || entries.length === 0}>
              {isSubmitting ? "Resubmitting..." : "Resubmit for Approval"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TimesheetManagementFull;

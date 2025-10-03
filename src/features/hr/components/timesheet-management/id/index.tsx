"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
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
  const timesheetId = params?.id as string;

  // Fetch timesheet data from backend
  const { data: timesheetData, isLoading: isLoadingTimesheet, refetch } = useGetTimesheetById(
    timesheetId,
    !!timesheetId && timesheetId !== "create"
  );
  const timesheet = timesheetData?.data;

  // Local state for entries
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [selectedApprover, setSelectedApprover] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);

  // API hooks
  const { createTimesheet, isLoading: isCreating } = useCreateTimesheet();
  const { updateTimesheet, isLoading: isUpdating } = useUpdateTimesheet(timesheetId);
  const { submitTimesheet, isLoading: isSubmitting } = useSubmitTimesheet(timesheetId);
  const { approveTimesheet, isLoading: isApproving } = useApproveTimesheet(timesheetId);
  const { rejectTimesheet, isLoading: isRejecting } = useRejectTimesheet(timesheetId);
  const { validateTimesheet } = useValidateTimesheet(timesheetId);

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

  // Check if date is blocked
  const isDateBlocked = (dateStr: string) => {
    return blockedDates.some((blocked) => blocked.date === dateStr);
  };

  // Get date info for display
  const getDateInfo = (dateStr: string) => {
    const blocked = blockedDates.find((b) => b.date === dateStr);
    return blocked
      ? {
          type: blocked.type,
          reason: blocked.reason,
          isBlocked: true,
        }
      : null;
  };

  // Add new entry
  const addEntry = () => {
    const newEntry: TimesheetEntry = {
      project: "",
      custom_activity: "", // Default to custom activity instead of workplan
      date: format(new Date(), "yyyy-MM-dd"),
      hours_worked: 0,
      description: "",
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  // Remove entry
  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  // Copy entry
  const copyEntry = (index: number) => {
    const entryToCopy = entries[index];
    setEntries((prev) => [
      ...prev,
      {
        ...entryToCopy,
        id: undefined, // Remove ID so it creates a new entry
      },
    ]);
  };

  // Update entry field
  const updateEntry = (index: number, field: keyof TimesheetEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Save timesheet (create or update)
  const handleSave = async () => {
    try {
      if (timesheetId === "create") {
        // Create new timesheet
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Monday
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // Sunday

        await createTimesheet({
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          entries: entries.map((entry) => ({
            project: entry.project,
            ...(entry.activity_plan && { activity_plan: entry.activity_plan }),
            ...(entry.custom_activity && { custom_activity: entry.custom_activity }),
            date: entry.date,
            hours_worked: entry.hours_worked,
            description: entry.description,
          })),
        });
        toast.success("Timesheet created successfully");
      } else {
        // Update existing timesheet
        await updateTimesheet({
          entries: entries.map((entry) => ({
            ...(entry.id && { id: entry.id }),
            project: entry.project,
            ...(entry.activity_plan && { activity_plan: entry.activity_plan }),
            ...(entry.custom_activity && { custom_activity: entry.custom_activity }),
            date: entry.date,
            hours_worked: entry.hours_worked,
            description: entry.description,
          })),
        });
        toast.success("Timesheet updated successfully");
      }
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save timesheet");
    }
  };

  // Submit for approval with validation
  const handleSubmitForApproval = async () => {
    // Validate first
    try {
      const validationResult = await validateTimesheet();

      if (!validationResult?.valid) {
        toast.error("Validation failed: " + (validationResult?.errors?.join(", ") || "Unknown errors"));
        return;
      }

      if (validationResult?.warnings && validationResult.warnings.length > 0) {
        toast.warning("Warnings: " + validationResult.warnings.join(", "));
      }
    } catch (error) {
      console.warn("Validation API call failed, proceeding anyway:", error);
    }

    // Check approver selection
    if (!selectedApprover) {
      toast.error("Please select an approver");
      return;
    }

    // Submit
    try {
      await submitTimesheet(selectedApprover);
      toast.success("Timesheet submitted for approval");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit timesheet");
    }
  };

  // Approve timesheet
  const handleApprove = async () => {
    try {
      await approveTimesheet();
      toast.success("Timesheet approved successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve timesheet");
    }
  };

  // Reject timesheet
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectTimesheet(rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason("");
      toast.success("Timesheet rejected");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject timesheet");
    }
  };

  // Project Select Component
  const ProjectSelect = ({ value, onChange, rowIndex }: any) => {
    const { data: projectsData, isLoading } = useGetAllProjects({ page: 1, size: 1000 });
    // Handle API wrapper structure - projects API returns {data: {results: []}}
    const allProjects = (projectsData as any)?.data?.results || [];
    // Filter out empty IDs
    const projects = allProjects.filter((project: any) => project?.id && project.id.trim() !== '');

    console.log("Projects data:", projectsData);
    console.log("Extracted projects:", projects);

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
            projects.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.project_name || project.title || project.project_id}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  // Activity Type Toggle Component (Hybrid: ActivityPlan OR Custom)
  const ActivityTypeSelect = ({ value, onChange, rowIndex }: any) => {
    const entry = entries[rowIndex];
    const activityType = entry?.activity_plan ? "planned" : entry?.custom_activity ? "custom" : "";

    const handleTypeChange = (type: string) => {
      if (type === "planned") {
        onChange(rowIndex, "custom_activity", undefined);
      } else {
        onChange(rowIndex, "activity_plan", undefined);
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
  const ActivityInput = ({ value, onChange, rowIndex }: any) => {
    const entry = entries[rowIndex];
    const selectedProjectId = entry?.project;
    const activityType = entry?.activity_plan ? "planned" : entry?.custom_activity ? "custom" : "";

    // For planned activities: fetch workplan activities
    const { data: workplanData, isLoading: isLoadingActivities } = useGetSingleWorkPlan(selectedProjectId || "", !!selectedProjectId);
    // Handle different possible data structures
    const activities = workplanData?.data?.activities || workplanData?.activities || [];

    console.log("Workplan data for project", selectedProjectId, ":", workplanData);
    console.log("Extracted activities:", activities);

    if (activityType === "custom") {
      // Custom text input
      return (
        <Input
          placeholder="Enter custom activity name"
          value={entry?.custom_activity || ""}
          onChange={(e) => onChange(rowIndex, "custom_activity", e.target.value)}
          className="min-w-[200px]"
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
          ) : activities.length === 0 ? (
            <SelectItem value="no-activities" disabled>
              No activities found
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

  // Table columns
  const columns: ColumnDef<TimesheetEntry>[] = [
    {
      header: "Project",
      cell: ({ row }) => (
        <ProjectSelect value={row.original.project} onChange={updateEntry} rowIndex={row.index} />
      ),
    },
    {
      header: "Activity Type",
      cell: ({ row }) => (
        <ActivityTypeSelect value="" onChange={updateEntry} rowIndex={row.index} />
      ),
    },
    {
      header: "Activity",
      cell: ({ row }) => (
        <ActivityInput
          value={row.original.activity_plan || row.original.custom_activity}
          onChange={updateEntry}
          rowIndex={row.index}
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
        />
      ),
    },
    {
      header: "Description",
      cell: ({ row }) => (
        <Input
          placeholder="Enter description"
          value={row.original.description || ""}
          onChange={(e) => updateEntry(row.index, "description", e.target.value)}
          className="min-w-[200px]"
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
  ];

  if (isLoadingTimesheet && timesheetId !== "create") {
    return <div className="p-8 text-center">Loading timesheet...</div>;
  }

  const totalHours = entries.reduce((sum, entry) => sum + (entry.hours_worked || 0), 0);
  const canEdit = timesheetStatus === "draft" || timesheetStatus === "rejected";

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
            <label className="text-sm font-medium">Select Approver *</label>
            <Select value={selectedApprover} onValueChange={setSelectedApprover}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an approver" />
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

          {/* Submitted: Show Approve and Reject (for managers) */}
          {timesheetStatus === "submitted" && (
            <>
              <Button onClick={handleApprove} disabled={isApproving} variant="default">
                {isApproving ? "Approving..." : "Approve"}
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isRejecting}
                variant="destructive"
              >
                Reject
              </Button>
            </>
          )}

          {/* Rejected: Can resubmit after editing */}
          {timesheetStatus === "rejected" && (
            <Button onClick={handleSubmitForApproval} disabled={isSubmitting || entries.length === 0}>
              {isSubmitting ? "Resubmitting..." : "Resubmit for Approval"}
            </Button>
          )}
        </div>
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onRequestClose={() => setIsRejectModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
          <h3 className="text-lg font-semibold">Reject Timesheet</h3>
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this timesheet:</p>
          <textarea
            className="w-full border border-gray-300 rounded p-2 min-h-[100px]"
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Reject Timesheet"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimesheetManagementFull;

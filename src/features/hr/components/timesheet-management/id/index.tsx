"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  useGetTimesheetById,
  useGetTimesheets,
  useCreateTimesheet,
  useUpdateTimesheet,
  useSubmitTimesheet,
  useApproveTimesheet,
  useRejectTimesheet,
  useValidateTimesheet,
  useGetBlockedDates,
  useGetAvailableProjects,
  useGetAvailableActivities,
} from "@/features/hr/controllers/timesheetController";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { toast } from "sonner";
import Modal from "react-modal";
import { CalendarIcon, Trash2, Copy, Plus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import type { TimesheetEntry } from "@/features/hr/types/timesheet";

const TimesheetManagementFull = () => {
  const params = useParams();
  const router = useRouter();
  const timesheetId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const isCreateMode = !timesheetId || timesheetId === "create";

  // Initialize query client for manual cache invalidation
  const queryClient = useQueryClient();

  console.log("TimesheetManagementFull - params:", params, "timesheetId:", timesheetId);
  console.log("Timesheet page - timesheetId:", timesheetId, "isCreateMode:", isCreateMode);

  // Calculate current week's start date (Monday)
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
  const currentWeekStartStr = format(currentWeekStart, "yyyy-MM-dd");

  // Check for existing timesheet in create mode
  const { data: existingTimesheetsData } = useGetTimesheets({
    start_date: currentWeekStartStr,
    page: 1,
    page_size: 1,
    enabled: isCreateMode,
  });

  // Redirect to existing timesheet if found
  useEffect(() => {
    if (isCreateMode && existingTimesheetsData?.data?.results?.length > 0) {
      const existingTimesheet = existingTimesheetsData.data.results[0];
      toast.info("A timesheet already exists for this week. Redirecting...");
      setTimeout(() => {
        window.location.href = `/dashboard/hr/timesheet-management/${existingTimesheet.id}`;
      }, 1000);
    }
  }, [isCreateMode, existingTimesheetsData]);

  // Fetch timesheet data from backend (only if not in create mode)
  const { data: timesheetData, isLoading: isLoadingTimesheet, refetch } = useGetTimesheetById(
    timesheetId || "create",
    !isCreateMode
  );
  const timesheet = timesheetData?.data;

  // Debug timesheet data loading
  useEffect(() => {
    console.log("Timesheet API response:", {
      timesheetData,
      timesheet,
      entries: timesheet?.entries,
      entriesLength: timesheet?.entries?.length,
      isLoading: isLoadingTimesheet
    });
  }, [timesheetData, timesheet, isLoadingTimesheet]);

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
      console.log("Loading entries from backend:", timesheet.entries);

      // Transform backend data to ensure compatibility with both field names
      const transformedEntries = timesheet.entries.map(entry => {
        const transformed = {
          ...entry,
          // If backend returns workplan_activity, also set activity_plan for frontend compatibility
          ...(entry.workplan_activity && !entry.activity_plan && { activity_plan: entry.workplan_activity }),
        };

        console.log("Transformed entry:", {
          original: entry,
          transformed: transformed,
          hasId: !!entry.id,
          entryId: entry.id
        });

        return transformed;
      });

      console.log("All transformed entries:", transformedEntries);
      setEntries(transformedEntries);
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
      custom_activity: "", // Default to custom activity type but empty value
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
      if (!entry.activity_plan && !entry.workplan_activity && !entry.custom_activity) {
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
            // Use workplan_activity as the new field name for backend
            ...(entry.activity_plan && { workplan_activity: entry.activity_plan }),
            ...(entry.workplan_activity && { workplan_activity: entry.workplan_activity }),
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

        const mappedEntries = entries.map((entry) => {
          const mappedEntry = {
            ...(entry.id && { id: entry.id }),
            project: entry.project,
            // Use workplan_activity as the new field name for backend
            ...(entry.activity_plan && { workplan_activity: entry.activity_plan }),
            ...(entry.workplan_activity && { workplan_activity: entry.workplan_activity }),
            ...(entry.custom_activity && { custom_activity: entry.custom_activity }),
            date: entry.date,
            hours_worked: entry.hours_worked,
            description: entry.description || "",
          };

          console.log("Mapping entry for update:", {
            original: entry,
            mapped: mappedEntry,
            hasId: !!entry.id,
            entryId: entry.id
          });

          return mappedEntry;
        });

        console.log("All mapped entries for update:", mappedEntries);

        // Update existing timesheet
        await updateTimesheet({
          entries: mappedEntries,
        });
        toast.success("Timesheet updated successfully");
        refetch();
      }
    } catch (error: any) {
      console.error("Save timesheet error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save timesheet";

      // Check if it's a duplicate timesheet error
      if (errorMessage.includes("duplicate key value") || errorMessage.includes("employee_start_unique")) {
        toast.error("A timesheet already exists for this week. Redirecting to existing timesheet...");

        // Try to find and redirect to existing timesheet
        setTimeout(() => {
          window.location.href = `/dashboard/hr/timesheet-management`;
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
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
      console.log("Submitting timesheet. Selected approver:", selectedApprover);

      // Since approver is already assigned on the backend, don't send approver_id
      // This prevents the "approver does not exist" error
      await submitTimesheet(undefined);

      toast.success("Timesheet submitted for approval");
      refetch();
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error?.message || "Failed to submit timesheet";

      // If approver error, suggest submitting without approver
      if (errorMessage.includes("approver")) {
        toast.error(errorMessage + " - Using backend assigned approver.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Project Select Component
  const ProjectSelect = ({ value, onChange, rowIndex }: any) => {
    const { data: projectsData, isLoading } = useGetAvailableProjects();
    // Handle API wrapper structure - timesheet API returns {data: [...]}
    const allProjects = projectsData?.data || [];
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
    // Determine activity type based on which field has a value
    // Priority: if activity_plan or workplan_activity has actual value -> planned
    //           if custom_activity has actual value -> custom
    //           default to custom for new entries
    const activityType =
      (entry?.activity_plan || entry?.workplan_activity) ? "planned" :
      entry?.custom_activity ? "custom" :
      "custom"; // default to custom for new entries

    const handleTypeChange = (type: string) => {
      if (type === "planned") {
        // Switch to planned: clear custom_activity and initialize activity_plan
        onChange(rowIndex, "custom_activity", undefined);
        onChange(rowIndex, "activity_plan", "");
      } else {
        // Switch to custom: clear activity_plan and initialize custom_activity
        onChange(rowIndex, "activity_plan", undefined);
        onChange(rowIndex, "custom_activity", "");
      }
    };

    return (
      <Select value={activityType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="z-50">
          <SelectItem value="planned">From Workplan</SelectItem>
          <SelectItem value="custom">Custom Activity</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  // Activity Selection Component (shows ActivityPlan dropdown OR custom input)
  const ActivityInput = ({ value, onChange, rowIndex, entry }: any) => {
    const selectedProjectId = entry?.project; // This is now the project UUID
    // Match the same logic as ActivityTypeSelect
    const activityType =
      (entry?.activity_plan || entry?.workplan_activity) ? "planned" :
      entry?.custom_activity ? "custom" :
      "custom";

    // For planned activities: fetch activities directly by project ID using timesheet-specific endpoint
    const { data: activitiesData, isLoading: isLoadingActivities, refetch: refetchActivities } = useGetAvailableActivities(
      selectedProjectId || undefined,
      !!selectedProjectId && activityType === "planned"
    );

    // Extract activities from response
    // Response structure: {data: [...]} - direct array from timesheet endpoint
    const activities = activitiesData?.data || [];

    // Function to refresh ActivityPlan cache
    const refreshActivityPlans = useCallback(async () => {
      console.log('🔄 REFRESHING ActivityPlan Cache...', {
        project: selectedProjectId,
        context: 'timesheet_activity_refresh'
      });

      try {
        // Method 1: Invalidate all activity-plans queries
        await queryClient.invalidateQueries({
          queryKey: ['activity-plans'],
          exact: false
        });

        // Method 2: Refetch current query
        await refetchActivities();

        toast.success('Activities refreshed successfully');
        console.log('✅ ActivityPlan cache refreshed');
      } catch (error) {
        console.error('❌ Failed to refresh ActivityPlan cache:', error);
        toast.error('Failed to refresh activities');
      }
    }, [selectedProjectId, queryClient, refetchActivities]);

    // Use useEffect for debug logging to avoid side effects during render
    useEffect(() => {
      console.log('🔍 ACTIVITYPLAN DROPDOWN DEBUG:', {
        selectedProjectId,
        activityType,
        isLoadingActivities,
        activitiesCount: activities.length,
        validActivityId: "9096f675-aa94-45c4-a725-00fc6db81679",
        hasValidActivity: activities.some((a: any) => a.id === "9096f675-aa94-45c4-a725-00fc6db81679"),
        staleActivityId: "879d94c8-2f03-4ede-b336-ea51f6ffe9cf",
        hasStaleActivity: activities.some((a: any) => a.id === "879d94c8-2f03-4ede-b336-ea51f6ffe9cf"),
        availableActivities: activities.map((a: any) => ({ id: a.id, code: a.activity_code, name: a.activity_name })),
        context: 'timesheet_activity_dropdown'
      });
    }, [selectedProjectId, activityType, isLoadingActivities, activities]);

    // Use useEffect for auto-refresh logic to avoid side effects during render
    useEffect(() => {
      if (selectedProjectId && activities.length > 0) {
        const hasStaleActivity = activities.some((a: any) => a.id === "879d94c8-2f03-4ede-b336-ea51f6ffe9cf");
        if (hasStaleActivity) {
          console.log('🚨 STALE ACTIVITY DETECTED - Auto-refreshing cache...');
          const timeoutId = setTimeout(() => {
            refreshActivityPlans();
          }, 1000);

          // Cleanup timeout on unmount or dependency change
          return () => clearTimeout(timeoutId);
        }
      }
    }, [selectedProjectId, activities, refreshActivityPlans]);

    if (activityType === "custom") {
      // Custom text input
      return (
        <Input
          placeholder="Enter custom activity name"
          value={entry?.custom_activity || ""}
          onChange={(e) => onChange(rowIndex, "custom_activity", e.target.value)}
          className="min-w-[200px]"
          disabled={false}
        />
      );
    }

    // ActivityPlan dropdown with refresh functionality
    return (
      <div className="flex items-center gap-2">
        <Select
          value={entry?.activity_plan || entry?.workplan_activity || ""}
          onValueChange={(val) => onChange(rowIndex, "workplan_activity", val)}
          disabled={!selectedProjectId}
        >
          <SelectTrigger className="w-full min-w-[200px]">
            <SelectValue placeholder={selectedProjectId ? "Select activity" : "Select project first"} />
          </SelectTrigger>
          <SelectContent className="z-50">
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
                No activities found for this project
              </SelectItem>
            ) : (
              activities.map((activity: any) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.activity_code}: {activity.activity_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Refresh Button for ActivityPlans */}
        {selectedProjectId && activityType === "planned" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refreshActivityPlans}
            disabled={isLoadingActivities}
            title="Refresh activity list"
          >
            {isLoadingActivities ? "⟳" : "↻"}
          </Button>
        )}
      </div>
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

  // Display Components for Read-Only View
  const ProjectDisplay = ({ entry }: { entry: TimesheetEntry }) => {
    const { data: projectsData } = useGetAvailableProjects();
    const allProjects = projectsData?.data || [];
    const project = allProjects.find((p: any) => p.id === entry.project);
    const projectName = project?.title || project?.project_name || project?.project_id || entry.project_name || "Unknown Project";

    return <span className="text-sm">{projectName}</span>;
  };

  const ActivityDisplay = ({ entry }: { entry: TimesheetEntry }) => {
    // Show computed activity_name if available, otherwise construct display name
    if (entry.activity_name) {
      return <span className="text-sm">{entry.activity_name}</span>;
    }

    // For custom activities
    if (entry.custom_activity) {
      return <span className="text-sm text-blue-600">Custom: {entry.custom_activity}</span>;
    }

    // For workplan activities - try to fetch the name
    if (entry.workplan_activity || entry.activity_plan) {
      const activityId = entry.workplan_activity || entry.activity_plan;
      const { data: activitiesData } = useGetAvailableActivities(undefined, !!activityId);
      const activities = activitiesData?.data || [];
      const activity = activities.find((a: any) => a.id === activityId);

      if (activity) {
        return <span className="text-sm text-green-600">{activity.activity_code}: {activity.activity_description || activity.activity_name}</span>;
      }

      return <span className="text-sm text-gray-500">Workplan Activity: {activityId}</span>;
    }

    return <span className="text-sm text-gray-400">No activity selected</span>;
  };

  // Table columns (memoized to prevent re-creation on every render)
  const columns: ColumnDef<TimesheetEntry>[] = useMemo(() => [
    {
      header: "Project",
      cell: ({ row }) => canEdit ? (
        <ProjectSelect value={row.original.project} onChange={updateEntry} rowIndex={row.index} />
      ) : (
        <ProjectDisplay entry={row.original} />
      ),
    },
    {
      header: "Activity Type",
      cell: ({ row }) => {
        if (!canEdit) {
          const activityType = (row.original.activity_plan || row.original.workplan_activity)
            ? "From Workplan"
            : row.original.custom_activity
            ? "Custom Activity"
            : "Not Set";
          return <span className="text-sm text-gray-600">{activityType}</span>;
        }
        return <ActivityTypeSelect value="" onChange={updateEntry} rowIndex={row.index} entry={row.original} />;
      },
    },
    {
      header: "Activity",
      cell: ({ row }) => canEdit ? (
        <ActivityInput
          value={row.original.activity_plan || row.original.workplan_activity || row.original.custom_activity}
          onChange={updateEntry}
          rowIndex={row.index}
          entry={row.original}
        />
      ) : (
        <ActivityDisplay entry={row.original} />
      ),
    },
    {
      header: "Date",
      cell: ({ row }) => canEdit ? (
        <DatePicker value={row.original.date} onChange={updateEntry} rowIndex={row.index} />
      ) : (
        <span className="text-sm">
          {row.original.date ? format(new Date(row.original.date), "MMM dd, yyyy") : "No date"}
        </span>
      ),
    },
    {
      header: "Hours",
      cell: ({ row }) => canEdit ? (
        <Input
          type="number"
          min="0.01"
          max="24"
          step="0.5"
          value={row.original.hours_worked || 0}
          onChange={(e) => updateEntry(row.index, "hours_worked", parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      ) : (
        <span className="text-sm font-medium">
          {(parseFloat(row.original.hours_worked) || 0).toFixed(2)}h
        </span>
      ),
    },
    {
      header: "Description",
      cell: ({ row }) => canEdit ? (
        <Textarea
          placeholder="Enter description"
          value={row.original.description || ""}
          onChange={(e) => updateEntry(row.index, "description", e.target.value)}
          className="min-w-[300px] min-h-[60px] resize-y"
          rows={2}
        />
      ) : (
        <span className="text-sm max-w-[300px] block">
          {row.original.description || "No description"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => canEdit ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyEntry(row.index)}
            title="Copy entry"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeEntry(row.index)}
            title="Delete entry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <span className="text-xs text-gray-400">Read-only</span>
      ),
    },
  ], [timesheetStatus, canEdit, updateEntry, copyEntry, removeEntry]);

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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Timesheet Management</h2>
            {timesheet && (
              <p className="text-sm text-gray-600">
                Period: {timesheet.start_date} to {timesheet.end_date}
              </p>
            )}
          </div>
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
        {/* Global ActivityPlan Refresh Button */}
        <Button
          variant="outline"
          onClick={async () => {
            try {
              console.log('🔄 GLOBAL ActivityPlan Cache Refresh...');
              await queryClient.invalidateQueries({
                queryKey: ['activity-plans'],
                exact: false
              });
              toast.success('All activity data refreshed');
              console.log('✅ Global ActivityPlan cache refreshed');
            } catch (error) {
              console.error('❌ Global refresh failed:', error);
              toast.error('Failed to refresh activity data');
            }
          }}
          size="sm"
          title="Refresh all activity data"
        >
          ↻ Refresh Activities
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

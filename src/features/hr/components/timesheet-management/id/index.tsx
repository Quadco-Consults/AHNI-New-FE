"use client";

import { useState } from "react";
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
import { useSubmitTimesheet, useApproveTimesheet, useRejectTimesheet } from "@/features/hr/controllers/timesheetController";
import { toast } from "sonner";
import Modal from "react-modal";

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

const TimesheetManagementFull = () => {
  const dispatch = useAppDispatch();

  const [timesheetData, setTimesheetData] = useState<TTimesheetDetail[]>([
    initialRow,
  ]);
  const [savedTimesheet, setSavedTimesheet] = useState<TTimesheetDetail[]>([
    initialRow,
  ]);

  // Approval flow state
  const [timesheetStatus, setTimesheetStatus] = useState<"draft" | "submitted" | "approved" | "rejected">("draft");
  const [timesheetId] = useState<string>("ts-001"); // TODO: Get from URL params
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);

  // Approval flow hooks
  const { submitTimesheet, isLoading: isSubmitting } = useSubmitTimesheet(timesheetId);
  const { approveTimesheet, isLoading: isApproving } = useApproveTimesheet(timesheetId);
  const { rejectTimesheet, isLoading: isRejecting } = useRejectTimesheet(timesheetId);

  const addRow = () => setTimesheetData((prev) => [...prev, { ...initialRow }]);

  const removeRow = (index: number) => {
    setTimesheetData((prev) => prev.filter((_, i) => i !== index));
  };

  const copyRow = (index: number) => {
    setTimesheetData((prev) => [...prev, { ...prev[index] }]);
  };

  const resetTimesheet = () => setTimesheetData([{ ...initialRow }]);

  const cancelChanges = () => setTimesheetData(savedTimesheet);

  const handleSubmit = () => {
    console.log("Submitted Timesheet:", timesheetData);
    setSavedTimesheet(timesheetData);
  };

  // Approval flow handlers
  const handleSubmitForApproval = async () => {
    try {
      await submitTimesheet();
      setTimesheetStatus("submitted");
      toast.success("Timesheet submitted for approval");
    } catch (error) {
      toast.error("Failed to submit timesheet");
    }
  };

  const handleApprove = async () => {
    try {
      await approveTimesheet();
      setTimesheetStatus("approved");
      toast.success("Timesheet approved successfully");
    } catch (error) {
      toast.error("Failed to approve timesheet");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      await rejectTimesheet(rejectionReason);
      setTimesheetStatus("rejected");
      setIsRejectModalOpen(false);
      setRejectionReason("");
      toast.success("Timesheet rejected");
    } catch (error) {
      toast.error("Failed to reject timesheet");
    }
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
          data: "1", // the timesheet ID or whatever you need here
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
  console.log({ timesheetData });

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

  // Workplan Select Component (intermediate step)
  const WorkplanSelect = ({ value, onValueChange, rowIndex }: { value: string; onValueChange: (value: string) => void; rowIndex: number }) => {
    const selectedProjectId = timesheetData[rowIndex]?.projectId;
    const { data: workplansData, isLoading } = useGetAllWorkPlan({
      page: 1,
      size: 100,
      project_title: selectedProjectId ? "" : "", // You might want to filter by project
      enabled: !!selectedProjectId
    });
    const workplans = workplansData?.results || [];
    
    // Filter workplans by selected project if needed
    const filteredWorkplans = workplans.filter(wp => wp.project === selectedProjectId);

    const handleWorkplanChange = (workplanId: string) => {
      onValueChange(workplanId);
      updateCell(rowIndex, "workplanId", workplanId);
      // Clear activity when workplan changes
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

  // Activity Select Component (now uses workplan activities)
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
          className='w-16 px-1 border rounded text-sm'
          onChange={(e) =>
            updateCell(row.index, day as keyof TTimesheetDetail, e.target.value)
          }
        />
      ),
    })),
    { header: "Total", accessorKey: "total" },
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

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Timesheet Management</h2>

      <div className='flex gap-2'>
        <Button onClick={addRow} disabled={timesheetStatus !== "draft"}>Add Row</Button>
        <Button variant='outline' onClick={resetTimesheet} disabled={timesheetStatus !== "draft"}>
          Reset
        </Button>
        <Button variant='outline' onClick={cancelChanges} disabled={timesheetStatus !== "draft"}>
          Cancel
        </Button>
        <Button variant='default' onClick={handleSubmit} disabled={timesheetStatus !== "draft"}>
          Save
        </Button>
        <Button onClick={handleOpenDialog} disabled={timesheetStatus !== "draft"}>Copy Activities</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={timesheetData} />
      </Card>

      <Card className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <h4 className='font-semibold'>Status</h4>
            <Badge variant={
              timesheetStatus === "approved" ? "default" :
              timesheetStatus === "rejected" ? "destructive" :
              timesheetStatus === "submitted" ? "secondary" :
              "outline"
            }>
              {timesheetStatus.charAt(0).toUpperCase() + timesheetStatus.slice(1)}
            </Badge>
          </div>

          <div className='flex gap-2'>
            {/* Draft: Show Submit for Approval */}
            {timesheetStatus === "draft" && (
              <Button onClick={handleSubmitForApproval} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            )}

            {/* Submitted: Show Approve and Reject (for managers) */}
            {timesheetStatus === "submitted" && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  variant="default"
                >
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
          </div>
        </div>

        {/* Show rejection reason if rejected */}
        {timesheetStatus === "rejected" && (
          <div className='p-4 bg-red-50 border border-red-200 rounded'>
            <p className='text-sm font-semibold text-red-800'>Rejection Reason:</p>
            <p className='text-sm text-red-700'>{rejectionReason || "No reason provided"}</p>
          </div>
        )}
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

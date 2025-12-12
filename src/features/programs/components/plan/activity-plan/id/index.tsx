"use client";

import Card from "components/Card";
import { useState, useMemo } from "react";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { useDebounce } from "ahooks";
import TableFilters from "components/Table/TableFilters";
import { getActivityPlanDetailsColumns } from "@/features/programs/components/table-columns/plan/activity-plan";
import { useParams } from "next/navigation";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import AddSquareIcon from "components/icons/AddSquareIcon";
import UploadIcon from "components/icons/UploadIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { DownloadIcon } from "lucide-react";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Activity Plan", icon: true },
  { name: "Activity Plan Details", icon: false },
];

export default function ActivityPlanDetail() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  // Fetch work plan with activities
  const { data: workPlan, isLoading: workPlanLoading } = useGetSingleWorkPlan(id ?? skipToken);

  // Fetch activity plans for this work plan (both planned and unplanned)
  const { data: activityPlans, isFetching } = useGetAllActivityPlans({
    page,
    size: 100,
    search: debouncedSearchQuery,
    work_plan: id as string,
  });

  // Merge work plan activities with activity plans AND add unplanned activities
  const mergedData = useMemo(() => {
    if (!activityPlans?.data?.results) {
      return [];
    }

    const plans = activityPlans.data.results;
    const workPlanActivities = workPlan?.data?.activities || [];

    // Separate planned and unplanned activities
    const plannedPlans = plans.filter(plan => plan.work_plan_activity);
    const unplannedPlans = plans.filter(plan => !plan.work_plan_activity);

    // Create a map of planned activity plans by work_plan_activity ID
    const plansByActivityId = new Map(
      plannedPlans.map(plan => [plan.work_plan_activity, plan])
    );

    // Merge each work plan activity with its corresponding activity plan (PLANNED activities)
    const plannedActivities = workPlanActivities.map(activity => {
      const plan = plansByActivityId.get(activity.id);

      return {
        // Work plan activity fields (read-only)
        id: plan?.id || activity.id,
        work_plan_activity_id: activity.id,
        objectives_sub_objectives: activity.objectives_sub_objectives,
        work_plan_activity_identifier: activity.activity_number,
        activity_code: activity.activity_number,
        budget_line: activity.budget_line?.name || activity.budget_line,
        activity_description: activity.activity || activity.activity_justification,
        month: calculateMonthFromDates(plan?.start_date, plan?.end_date),
        responsible_person: activity.lead_person,
        expected_results: activity.expected_result, // From work plan activity

        // Activity plan fields (editable)
        start_date: plan?.start_date || null,
        end_date: plan?.end_date || null,
        resources_required: plan?.resources_required || null,
        memo_approved: plan?.memo_approved || false,
        ea_required: plan?.ea_required || false,
        status: plan?.status || "NOT_DONE",
        achieved_results: plan?.achieved_results || null,
        follow_up_actions: plan?.follow_up_actions || null,
        comments: plan?.comments || null,
        driver_vehicle: plan?.driver_vehicle || null,

        // Metadata
        work_plan: id as string,
        work_plan_activity: activity.id,
        has_plan: !!plan,
        activity_type: "PLANNED",
      };
    });

    // Add unplanned activities (these come directly from activity plans without work plan activities)
    const unplannedActivities = unplannedPlans.map(plan => ({
      // For unplanned activities, the plan IS the activity
      id: plan.id,
      work_plan_activity_id: null,
      objectives_sub_objectives: plan.objectives_sub_objectives || "Unplanned Activity",
      work_plan_activity_identifier: plan.work_plan_activity_identifier || "UNPLANNED",
      activity_code: plan.work_plan_activity_identifier || "UNPLANNED",
      budget_line: plan.budget_line || "N/A",
      activity_description: plan.activity_description,
      month: calculateMonthFromDates(plan.start_date, plan.end_date),
      responsible_person: plan.responsible_person || "N/A",
      expected_results: plan.expected_results || "N/A",

      // Activity plan fields
      start_date: plan.start_date,
      end_date: plan.end_date,
      resources_required: plan.resources_required,
      memo_approved: plan.memo_approved || false,
      ea_required: plan.ea_required || false,
      status: plan.status,
      achieved_results: plan.achieved_results,
      follow_up_actions: plan.follow_up_actions,
      comments: plan.comments,
      driver_vehicle: plan.driver_vehicle,

      // Metadata
      work_plan: id as string,
      work_plan_activity: null,
      has_plan: true,
      activity_type: "UNPLANNED",
    }));

    // Combine planned and unplanned activities
    return [...plannedActivities, ...unplannedActivities];
  }, [workPlan, activityPlans, id]);

  // Download template functionality
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      console.log("Downloading template...");

      const response = await AxiosWithToken.get(
        "/programs/plans/activity/sheet/template/",
        {
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "activity-plan-template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Activity Plan Template downloaded successfully");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setIsDownloading(false);
    }
  };

  if (workPlanLoading) return <LoadingSpinner />;

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button className='flex gap-2 py-6'>
              Add Activities
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                href={{
                  pathname: RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
                  search: `?plan=${id}&type=unplanned`,
                }}
                className="w-full"
              >
                <Button
                  className='flex gap-2 py-6 w-full justify-start'
                  variant='ghost'
                  type='button'
                >
                  <AddSquareIcon fillColor='#ff6b35' />
                  Create Manually
                </Button>
              </Link>

              <Button
                className='flex gap-2 py-6 w-full justify-start'
                variant='ghost'
                type='button'
                onClick={() => {
                  console.log("Opening upload modal with DialogType:", DialogType.ActivityUpload);
                  dispatch(
                    openDialog({
                      type: DialogType.ActivityUpload,
                      dialogProps: {
                        header: "Upload Activities (Smart Detection)",
                        width: "max-w-2xl",
                        workPlanId: id,
                        activityType: "MIXED",
                      },
                    })
                  );
                }}
              >
                <UploadIcon />
                Upload from File
              </Button>

              <Button
                className='flex items-center gap-2 justify-start w-full'
                variant='ghost'
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
              >
                <DownloadIcon className='text-green-500' />
                {isDownloading ? "Downloading..." : "Download Template"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <TableFilters
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        >
          <DataTable
            data={mergedData}
            columns={getActivityPlanDetailsColumns(id as string)}
            isLoading={isFetching || workPlanLoading}
            pagination={{
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}

// Helper function to calculate month range from start and end dates
function calculateMonthFromDates(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) return "";

  const months: string[] = [];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (startDate) {
    const start = new Date(startDate);
    months.push(monthNames[start.getMonth()]);
  }

  if (endDate && endDate !== startDate) {
    const end = new Date(endDate);
    const endMonth = monthNames[end.getMonth()];
    if (!months.includes(endMonth)) {
      months.push(endMonth);
    }
  }

  return months.join(" - ");
}

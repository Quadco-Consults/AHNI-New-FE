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
  { name: "Activity Types", icon: true },
  { name: "Unplanned Activities", icon: false },
];

export default function UnplannedActivities() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  // Fetch work plan for context
  const { data: workPlan, isLoading: workPlanLoading } = useGetSingleWorkPlan(id ?? skipToken);

  // Fetch activity plans for this specific work plan, then filter for unplanned on frontend
  const { data: activityPlans, isFetching } = useGetAllActivityPlans({
    page,
    size: 100,
    search: debouncedSearchQuery,
    work_plan: id as string, // Filter by this specific work plan
    // Note: Removing is_unplanned filter to test if API call triggers
  });

  // Process unplanned activities (filter for is_unplanned: true on frontend)
  const unplannedData = useMemo(() => {
    if (!activityPlans?.data?.results) {
      return [];
    }

    // Filter for only unplanned activities
    const unplannedOnly = activityPlans.data.results.filter((plan: any) => plan.is_unplanned === true);

    // Map unplanned activities
    const unplannedActivities = unplannedOnly.map((plan: any) => ({
      // For unplanned activities, the plan IS the activity
      id: plan.id,
      work_plan_activity_id: null,
      objectives_sub_objectives: plan.objectives_sub_objectives || "Unplanned Activity",
      work_plan_activity_identifier: plan.work_plan_activity_identifier || "UNPLANNED",
      activity_code: plan.work_plan_activity_identifier || "UNPLANNED",
      budget_line: plan.budget_line || "N/A",
      activity_description: plan.activity_description || plan.activity_name || "N/A",
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

    return unplannedActivities;
  }, [activityPlans, id]);

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

      {/* Work Plan Context Info */}
      {workPlan?.data && (
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-semibold">Unplanned Activities for:</h3>
              <div className="flex gap-6 text-sm text-gray-600">
                <span><strong>Project:</strong> {workPlan.data.project?.title}</span>
                <span><strong>Financial Year:</strong> {workPlan.data.financial_year?.year}</span>
              </div>
            </div>
            <Link href={`/dashboard/programs/plan/activity/${id}`}>
              <Button variant="outline">← Back to Activity Types</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Info Banner for Unplanned Activities */}
      <Card className="p-4 bg-orange-50 border-l-4 border-orange-500">
        <div className="space-y-2">
          <h4 className="font-medium text-orange-800">Unplanned Activities</h4>
          <p className="text-sm text-orange-700">
            These activities were added outside of the original work plan and may require additional approval.
            Activities with justification are automatically marked as unplanned during upload.
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button className='flex gap-2 py-6 bg-orange-600 hover:bg-orange-700'>
              Add Unplanned Activities
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
                  console.log("Opening upload modal for unplanned activities");
                  dispatch(
                    openDialog({
                      type: DialogType.ActivityUpload,
                      dialogProps: {
                        header: "Upload Unplanned Activities",
                        width: "max-w-2xl",
                        workPlanId: id,
                        activityType: "UNPLANNED",
                        projectId: workPlan?.data?.project?.id,
                        financialYearId: workPlan?.data?.financial_year?.id,
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
            data={unplannedData}
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
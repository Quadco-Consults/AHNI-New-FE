"use client";

import Card from "@/components/Card";
import { useState, useMemo } from "react";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { useDebounce } from "ahooks";
import TableFilters from "@/components/Table/TableFilters";
import { getActivityPlanDetailsColumns } from "@/features/programs/components/table-columns/plan/activity-plan";
import { useParams, useRouter } from "next/navigation";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { useGetAllActivityTrackers } from "@/features/programs/controllers/activityTrackerController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { DownloadIcon, ArrowLeft } from "lucide-react";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Activity Plan", icon: true },
  { name: "Activity Types", icon: true },
  { name: "Unplanned Activities", icon: false },
];

export default function UnplannedActivities() {
  const router = useRouter();
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

  // Also fetch WorkPlanTracker data to get metadata fields
  const { data: activityTrackers, isFetching: trackersLoading } = useGetAllActivityTrackers({
    page: 1,
    size: 100,
    work_plan: id as string,
  });

  // Process unplanned activities (filter for is_unplanned: true on frontend)
  const unplannedData = useMemo(() => {
    if (!activityPlans?.data?.results) {
      return [];
    }

    // Filter for only unplanned activities
    const unplannedOnly = activityPlans.data.results.filter((plan: any) => plan.is_unplanned === true);

    // Create a lookup map for ActivityTracker data by work_plan_activity_id
    const trackerLookup = new Map();
    if (activityTrackers?.data?.results) {
      activityTrackers.data.results.forEach((tracker: any) => {
        if (tracker.work_plan_activity && tracker.work_plan_activity.id) {
          trackerLookup.set(tracker.work_plan_activity.id, tracker);
        }
      });
    }

    console.log('🔍 ActivityTracker lookup map:', trackerLookup);
    console.log('📊 Available trackers:', activityTrackers?.data?.results?.length || 0);

    // Map unplanned activities with comprehensive field mapping
    const unplannedActivities = unplannedOnly.map((plan: any) => {
      console.log('🔄 Processing unplanned activity:', plan.id);
      console.log('Available fields:', Object.keys(plan));
      console.log('Specific field values:');
      console.log('  - indicator:', plan.indicator);
      console.log('  - performance_indicator:', plan.performance_indicator);
      console.log('  - mov:', plan.mov);
      console.log('  - means_of_verification:', plan.means_of_verification);
      console.log('  - cost_category:', plan.cost_category);
      console.log('  - cost_grouping:', plan.cost_grouping);
      console.log('  - cost_input:', plan.cost_input);
      console.log('  - intervention_area:', plan.intervention_area);

      // Check if there's tracker data for this activity
      const tracker = plan.work_plan_activity ? trackerLookup.get(plan.work_plan_activity) : null;
      console.log('📍 Tracker found for activity:', !!tracker);
      if (tracker) {
        console.log('📋 Tracker metadata fields:');
        console.log('  - indicator:', tracker.indicator);
        console.log('  - mov:', tracker.mov);
        console.log('  - cost_category_name:', tracker.cost_category_name);
        console.log('  - cost_grouping_name:', tracker.cost_grouping_name);
        console.log('  - cost_input_name:', tracker.cost_input_name);
        console.log('  - intervention_area_name:', tracker.intervention_area_name);
      }

      console.log('Full plan data:', plan);

      return {
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
        expected_results: plan.expected_results || plan.expected_output || "N/A",

        // Add the missing fields - prioritize tracker data, then fallback to plan data
        indicator: (tracker && tracker.indicator && tracker.indicator !== null && tracker.indicator !== "") ? tracker.indicator :
                   (plan.indicator && plan.indicator !== null && plan.indicator !== "") ? plan.indicator :
                   (plan.performance_indicator && plan.performance_indicator !== null && plan.performance_indicator !== "") ? plan.performance_indicator :
                   (plan.indicators && plan.indicators !== null && plan.indicators !== "") ? plan.indicators :
                   (plan.key_performance_indicator && plan.key_performance_indicator !== null && plan.key_performance_indicator !== "") ? plan.key_performance_indicator :
                   "Not set",

        mov: (tracker && tracker.mov && tracker.mov !== null && tracker.mov !== "") ? tracker.mov :
             (plan.mov && plan.mov !== null && plan.mov !== "") ? plan.mov :
             (plan.means_of_verification && plan.means_of_verification !== null && plan.means_of_verification !== "") ? plan.means_of_verification :
             (plan.verification_method && plan.verification_method !== null && plan.verification_method !== "") ? plan.verification_method :
             (plan.verification_means && plan.verification_means !== null && plan.verification_means !== "") ? plan.verification_means :
             "Not set",

        cost_category: (tracker && tracker.cost_category_name && tracker.cost_category_name !== null && tracker.cost_category_name !== "") ? tracker.cost_category_name :
                       (plan.cost_category && plan.cost_category !== null && plan.cost_category !== "") ? plan.cost_category :
                       (plan.cost_category_obj && plan.cost_category_obj.name && plan.cost_category_obj.name !== "") ? plan.cost_category_obj.name :
                       (typeof plan.cost_category === 'object' && plan.cost_category && plan.cost_category.name && plan.cost_category.name !== "") ? plan.cost_category.name :
                       "Not set",

        cost_grouping: (tracker && tracker.cost_grouping_name && tracker.cost_grouping_name !== null && tracker.cost_grouping_name !== "") ? tracker.cost_grouping_name :
                       (plan.cost_grouping && plan.cost_grouping !== null && plan.cost_grouping !== "") ? plan.cost_grouping :
                       (plan.cost_grouping_obj && plan.cost_grouping_obj.name && plan.cost_grouping_obj.name !== "") ? plan.cost_grouping_obj.name :
                       (typeof plan.cost_grouping === 'object' && plan.cost_grouping && plan.cost_grouping.name && plan.cost_grouping.name !== "") ? plan.cost_grouping.name :
                       "Not set",

        cost_input: (tracker && tracker.cost_input_name && tracker.cost_input_name !== null && tracker.cost_input_name !== "") ? tracker.cost_input_name :
                    (plan.cost_input && plan.cost_input !== null && plan.cost_input !== "") ? plan.cost_input :
                    (plan.cost_input_obj && plan.cost_input_obj.name && plan.cost_input_obj.name !== "") ? plan.cost_input_obj.name :
                    (typeof plan.cost_input === 'object' && plan.cost_input && plan.cost_input.name && plan.cost_input.name !== "") ? plan.cost_input.name :
                    "Not set",

        intervention_area: (tracker && tracker.intervention_area_name && tracker.intervention_area_name !== null && tracker.intervention_area_name !== "") ? tracker.intervention_area_name :
                           (plan.intervention_area && plan.intervention_area !== null && plan.intervention_area !== "") ? plan.intervention_area :
                           (plan.intervention_area_obj && plan.intervention_area_obj.name && plan.intervention_area_obj.name !== "") ? plan.intervention_area_obj.name :
                           (typeof plan.intervention_area === 'object' && plan.intervention_area && plan.intervention_area.name && plan.intervention_area.name !== "") ? plan.intervention_area.name :
                           "Not set",

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
      };
    });

    return unplannedActivities;
  }, [activityPlans, activityTrackers, id]);

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

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/programs/plan/activity/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Work Plan Context Info */}
      {workPlan?.data && (
        <Card className="p-4">
          <div className="space-y-1">
            <h3 className="font-semibold">Unplanned Activities for:</h3>
            <div className="flex gap-6 text-sm text-gray-600">
              <span><strong>Project:</strong> {workPlan.data.project?.title}</span>
              <span><strong>Financial Year:</strong> {workPlan.data.financial_year?.year}</span>
            </div>
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
            isLoading={isFetching || workPlanLoading || trackersLoading}
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
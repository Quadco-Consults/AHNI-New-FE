"use client";

import Card from "@/components/Card";
import { useState, useMemo } from "react";
import DataTableWithExpansion from "@/components/Table/DataTableWithExpansion";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import CostSheetTrackersExpanded from "@/features/programs/components/plan/work-plan-tracker/CostSheetTrackersExpanded";
import { getActivityPlanDetailsColumns } from "@/features/programs/components/table-columns/plan/activity-plan";
import { useParams, useRouter } from "next/navigation";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Activity Plan", icon: true },
  { name: "Activity Types", icon: true },
  { name: "Planned Activities", icon: false },
];

export default function PlannedActivities() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { id } = useParams();

  // Fetch work plan with activities
  const { data: workPlan, isLoading: workPlanLoading } = useGetSingleWorkPlan(id ?? skipToken);

  // Fetch ONLY planned activity plans for this work plan using API filter
  const { data: activityPlans, isFetching } = useGetAllActivityPlans({
    page,
    size: 100,
    search: "",
    work_plan: id as string,
    is_unplanned: false, // Filter for planned activities at API level
  });

  // Filter and merge ONLY PLANNED activities (those with work_plan_activity)
  const plannedData = useMemo(() => {
    if (!activityPlans?.data?.results || !workPlan?.data?.activities) {
      return [];
    }

    const plans = activityPlans.data.results;
    const workPlanActivities = workPlan.data.activities || [];

    // Only get planned activities (those with work_plan_activity)
    const plannedPlans = plans.filter(plan => plan.work_plan_activity);

    // Create a map of planned activity plans by work_plan_activity ID
    const plansByActivityId = new Map(
      plannedPlans.map(plan => [plan.work_plan_activity, plan])
    );

    // Merge each work plan activity with its corresponding activity plan
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

    return plannedActivities;
  }, [workPlan, activityPlans, id]);

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
            <h3 className="font-semibold">Planned Activities for:</h3>
            <div className="flex gap-6 text-sm text-gray-600">
              <span><strong>Project:</strong> {workPlan.data.project?.title}</span>
              <span><strong>Financial Year:</strong> {workPlan.data.financial_year?.year}</span>
            </div>
          </div>
        </Card>
      )}


      <Card>
        <DataTableWithExpansion
          data={plannedData}
          columns={getActivityPlanDetailsColumns(id as string)}
          isLoading={isFetching || workPlanLoading}
          pagination={{
            onChange: (page: number) => setPage(page),
          }}
          renderExpandedRow={(row: any) => (
            <CostSheetTrackersExpanded
              activityId={row.work_plan_activity}
              activityNumber={row.activity_code || "N/A"}
              isEditable={true}
            />
          )}
          canExpand={(row: any) => {
            // Show expand button for activities with work_plan_activity ID
            return !!row.work_plan_activity;
          }}
        />
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
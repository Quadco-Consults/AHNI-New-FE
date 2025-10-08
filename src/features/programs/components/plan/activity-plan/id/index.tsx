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

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  // Fetch work plan with activities
  const { data: workPlan, isLoading: workPlanLoading } = useGetSingleWorkPlan(id ?? skipToken);

  // Fetch activity plans for this work plan
  const { data: activityPlans, isFetching } = useGetAllActivityPlans({
    page,
    size: 100,
    search: debouncedSearchQuery,
    work_plan: id as string,
  });

  // Merge work plan activities with activity plans
  const mergedData = useMemo(() => {
    if (!workPlan?.data?.activities || !activityPlans?.data?.results) {
      return [];
    }

    const workPlanActivities = workPlan.data.activities;
    const plans = activityPlans.data.results;

    // Create a map of activity plans by work_plan_activity ID
    const plansByActivityId = new Map(
      plans.map(plan => [plan.work_plan_activity, plan])
    );

    // Merge each work plan activity with its corresponding activity plan
    return workPlanActivities.map(activity => {
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
      };
    });
  }, [workPlan, activityPlans, id]);

  if (workPlanLoading) return <LoadingSpinner />;

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
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

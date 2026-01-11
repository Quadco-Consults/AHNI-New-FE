"use client";

import Card from "@/components/Card";
import { useState, useMemo, useEffect } from "react";
import DataTable from "@/components/Table/DataTable";
import {
  useGetAllActivityTrackers,
} from "@/features/programs/controllers/activityTrackerController";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import TableFilters from "@/components/Table/TableFilters";
import { getWorkPlanTrackerDetailsColumns } from "@/features/programs/components/table-columns/plan/work-plan-tracker-details";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { useDebounce } from "ahooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: true },
  { name: "Work Plan Tracker Details", icon: false },
];

export default function ActivityTracker() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchController, setSearchController] = useState("");
  const { id } = useParams();

  const debouncedSearchQuery = useDebounce(searchController, {
    wait: 1000,
  });

  // Fetch all tracker data for this work plan (no pagination since we'll handle it client-side)
  const { data: trackersData, isLoading } = useGetAllActivityTrackers({
    page: 1,
    size: 1000, // Get all trackers to merge with activities
    work_plan__id: id as string, // Filter by work plan ID
    search: debouncedSearchQuery,
    enabled: !!id,
  });

  // Also try the original approach as a fallback to get activity data
  const { data: workPlanData } = useGetSingleWorkPlan(id ?? "", !!id);

  // Fetch activity plans (includes both planned and unplanned activities)
  const { data: activityPlansData } = useGetAllActivityPlans({
    page: 1,
    size: 1000,
    search: debouncedSearchQuery,
    work_plan: id as string,
  });

  // Merge tracker data with activity data to fill missing fields
  const enrichedTrackers = useMemo(() => {
    const trackers = trackersData?.data?.results || [];
    const activities = workPlanData?.data?.activities || [];
    const activityPlans = activityPlansData?.data?.results || [];

    // Get unplanned activities (activity plans without work_plan_activity)
    const unplannedActivityPlans = activityPlans.filter(plan => !plan.work_plan_activity);

    console.log("🔍 Debug tracker merging:");
    console.log("📊 Total trackers from API:", trackers.length);
    console.log("🏗️ Planned activities in this work plan:", activities.length);
    console.log("🟠 Unplanned activity plans:", unplannedActivityPlans.length);
    console.log("🔗 Sample tracker:", trackers[0]);
    console.log("📋 Sample activity:", activities[0]);
    console.log("🟠 Sample unplanned activity:", unplannedActivityPlans[0]);

    // Create a map of activity ID to activity data for faster lookup
    const activitiesMap = new Map();
    const activityIds = new Set<string>();
    activities.forEach(activity => {
      activitiesMap.set(activity.id, activity);
      activityIds.add(activity.id);
    });

    console.log("📋 Activity IDs in this work plan:", Array.from(activityIds));

    // Find trackers that are linked to THIS work plan's activities ONLY
    // Filter trackers to only include those whose work_plan_activity matches an activity in the current work plan
    const trackersForThisWorkPlan = trackers.filter(tracker => {
      const belongsToThisWorkPlan = tracker.work_plan_activity && activityIds.has(tracker.work_plan_activity);
      if (!belongsToThisWorkPlan && tracker.work_plan_activity) {
        console.log(`❌ Tracker ${tracker.id} belongs to different work plan (activity: ${tracker.work_plan_activity})`);
      }
      return belongsToThisWorkPlan;
    });

    console.log("✅ Trackers for this work plan:", trackersForThisWorkPlan.length);

    const linkedTrackers = trackersForThisWorkPlan.map(tracker => {
      const activityData = activitiesMap.get(tracker.work_plan_activity);

      if (activityData) {
        // Create a safe object by converting any potential objects to strings
        const safeTracker = Object.fromEntries(
          Object.entries(tracker).map(([key, value]) => {
            if (value && typeof value === 'object' && value.constructor === Object) {
              // Convert objects to string representation, keeping .name if available
              return [key, value.name || JSON.stringify(value)];
            }
            return [key, value];
          })
        );

        return {
          ...safeTracker,
          // Add activity fields directly to tracker for easier access
          activity_type: activityData.activity_type || tracker.activity_type || "PLANNED",
          activity_number: activityData.activity_number,
          // Handle budget_line as object with .name property
          budget_line: activityData.budget_line?.name || activityData.budget_line || "N/A",
          objectives_sub_objectives: activityData.objectives_sub_objectives,
          activity: activityData.activity,
          location: activityData.location,
          lead_dept: activityData.lead_dept,
          lead_person: activityData.lead_person,
          // Keep gant_chart as object for frequency calculation
          gant_chart: activityData.gant_chart,
          planned_output: activityData.planned_output,
          description_of_output: activityData.description_of_output,
          // Handle cost fields as objects with .name property
          cost_input: activityData.cost_input?.name || activityData.cost_input || "N/A",
          cost_grouping: activityData.cost_grouping?.name || activityData.cost_grouping || "N/A",
          // Use tracker status if available, fallback to activity status or PENDING
          status: tracker.status || activityData.status || "PENDING",
          total_amount_ngn: activityData.total_amount_ngn,
          total_amount_usd: activityData.total_amount_usd,
        };
      }
      // Also make tracker-only data safe
      return Object.fromEntries(
        Object.entries(tracker).map(([key, value]) => {
          if (value && typeof value === 'object' && value.constructor === Object) {
            // Convert objects to string representation, keeping .name if available
            return [key, value.name || JSON.stringify(value)];
          }
          return [key, value];
        })
      );
    });

    // Find activities that don't have trackers and create default trackers for them
    // Use trackersForThisWorkPlan to only consider trackers that belong to this work plan
    const linkedActivityIds = new Set(
      trackersForThisWorkPlan.map(tracker => tracker.work_plan_activity)
    );

    const unlinkedActivities = activities.filter(activity => !linkedActivityIds.has(activity.id));

    console.log("🔗 Linked activities count:", linkedActivityIds.size);
    console.log("📋 Unlinked activities count:", unlinkedActivities.length);
    console.log("📋 Unlinked activities:", unlinkedActivities.map(a => a.activity_number));

    const defaultTrackersForUnlinkedActivities = unlinkedActivities.map(activity => ({
      id: `default-tracker-${activity.id}`, // Temporary ID for display
      work_plan_activity: activity.id,
      activity_type: activity.activity_type || "PLANNED",
      activity_number: activity.activity_number,
      budget_line: activity.budget_line?.name || activity.budget_line || "N/A",
      objectives_sub_objectives: activity.objectives_sub_objectives,
      activity: activity.activity,
      location: activity.location,
      lead_dept: activity.lead_dept,
      lead_person: activity.lead_person,
      gant_chart: activity.gant_chart,
      planned_output: activity.planned_output,
      description_of_output: activity.description_of_output,
      cost_input: activity.cost_input?.name || activity.cost_input || "N/A",
      cost_grouping: activity.cost_grouping?.name || activity.cost_grouping || "N/A",
      status: "NOT_DONE", // Default tracker status
      total_amount_ngn: activity.total_amount_ngn,
      total_amount_usd: activity.total_amount_usd,
      // Default tracker fields (empty/zero values)
      achieved_results: null,
      percentage_achievement: 0,
      amount_expended_ngn: 0,
      amount_expended_usd: 0,
      comments: null,
      // Mark as default tracker for potential different handling
      isDefaultTracker: true,
    }));

    // Create tracker entries for unplanned activities
    const unplannedTrackers = unplannedActivityPlans.map(plan => ({
      id: plan.id,
      work_plan_activity: null,
      activity_type: "UNPLANNED",
      activity_number: plan.work_plan_activity_identifier || "UNPLANNED",
      budget_line: plan.budget_line || "N/A",
      objectives_sub_objectives: plan.objectives_sub_objectives || "Unplanned Activity",
      activity: plan.activity_description,
      location: plan.location || "N/A",
      lead_dept: plan.lead_dept || "N/A",
      lead_person: plan.responsible_person || "N/A",
      gant_chart: null, // Unplanned activities don't have a gantt chart
      planned_output: plan.expected_results || "N/A",
      description_of_output: plan.activity_description,
      cost_input: plan.cost_input || "N/A",
      cost_grouping: plan.cost_grouping || "N/A",
      status: plan.status || "NOT_DONE",
      total_amount_ngn: plan.total_amount_ngn || 0,
      total_amount_usd: plan.total_amount_usd || 0,
      // Tracker fields
      achieved_results: plan.achieved_results || null,
      percentage_achievement: 0,
      amount_expended_ngn: 0,
      amount_expended_usd: 0,
      comments: plan.comments || null,
      // Mark as unplanned
      isUnplanned: true,
    }));

    console.log("🟠 Unplanned trackers created:", unplannedTrackers.length);

    // Combine linked trackers with default trackers for unlinked activities AND unplanned activities
    const allTrackers = [...linkedTrackers, ...defaultTrackersForUnlinkedActivities, ...unplannedTrackers];

    console.log("🎯 Final trackers count:", allTrackers.length);
    console.log("  - Linked trackers:", linkedTrackers.length);
    console.log("  - Default trackers for unlinked:", defaultTrackersForUnlinkedActivities.length);
    console.log("  - Unplanned trackers:", unplannedTrackers.length);
    console.log("🎯 Sample final tracker:", allTrackers[0]);

    return allTrackers;
  }, [trackersData, workPlanData, activityPlansData]);

  // Client-side pagination
  const pageSize = 20;
  const totalItems = enrichedTrackers?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedTrackers = useMemo(() => {
    if (!enrichedTrackers) return [];

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return enrichedTrackers.slice(startIndex, endIndex);
  }, [enrichedTrackers, page, pageSize]);

  if (isLoading) return <LoadingSpinner />;





  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/programs/plan/activity-tracker")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <Card>
        <TableFilters
          onSearchChange={(e) => setSearchController(e.target.value)}
        >
          <DataTable
            data={paginatedTrackers}
            columns={getWorkPlanTrackerDetailsColumns(id as string)}
            isLoading={isLoading}
            pagination={
              // Only show pagination if we have more items than can fit on one page
              totalPages > 1
                ? {
                    total: totalItems,
                    pageSize: pageSize,
                    current: page,
                    onChange: (page: number) => setPage(page),
                  }
                : undefined
            }
          />
        </TableFilters>
      </Card>
    </div>
  );
}

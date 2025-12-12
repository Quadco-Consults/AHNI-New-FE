"use client";

import Card from "components/Card";
import { useState, useMemo, useEffect } from "react";
import DataTable from "components/Table/DataTable";
import {
  useGetAllActivityTrackers,
} from "@/features/programs/controllers/activityTrackerController";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import TableFilters from "components/Table/TableFilters";
import { getWorkPlanTrackerDetailsColumns } from "@/features/programs/components/table-columns/plan/work-plan-tracker-details";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "components/Loading";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: true },
  { name: "Work Plan Tracker Details", icon: false },
];

export default function ActivityTracker() {
  const [page, setPage] = useState(1);
  const [searchController, setSearchController] = useState("");
  const { id } = useParams();

  // Directly fetch tracker data for this work plan (this is the correct approach!)
  const { data: trackersData, isLoading } = useGetAllActivityTrackers({
    page: 1,
    size: 1000, // Get all trackers for this work plan
    work_plan__id: id as string, // Filter by work plan ID
    enabled: !!id,
  });

  // Also try the original approach as a fallback to get activity data
  const { data: workPlanData } = useGetSingleWorkPlan(id ?? "", !!id);


  // Merge tracker data with activity data to fill missing fields
  const enrichedTrackers = useMemo(() => {
    const trackers = trackersData?.data?.results || [];
    const activities = workPlanData?.data?.activities || [];

    if (!trackers.length) return [];

    // Create a map of activity ID to activity data
    const activitiesMap = new Map();
    activities.forEach(activity => {
      activitiesMap.set(activity.id, activity);
    });

    // Enrich each tracker with its corresponding activity data
    return trackers.map(tracker => {
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
  }, [trackersData, workPlanData]);

  if (isLoading) return <LoadingSpinner />;





  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <Card>
        <TableFilters
          onSearchChange={(e) => setSearchController(e.target.value)}
        >
          <DataTable
            data={enrichedTrackers || []}
            columns={getWorkPlanTrackerDetailsColumns(id as string)}
            isLoading={isLoading}
            pagination={{
              total: trackersData?.data?.pagination?.count ?? 0,
              pageSize: trackersData?.data?.pagination?.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}

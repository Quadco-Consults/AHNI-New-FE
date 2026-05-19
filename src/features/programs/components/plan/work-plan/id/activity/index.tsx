import { TActivity, TMonth } from "@/features/programs/types/work-plan";
import { Card } from "@/components/ui/card";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useMemo } from "react";
import ExpandableActivityTable from "./ExpandableActivityTable";

type PropsType = {
  activities: TActivity[];
  workPlanId: string;
};

export default function Activity({ activities, workPlanId }: PropsType) {
  // Fetch unplanned activities for this work plan
  const { data: unplannedActivities } = useGetAllActivityPlans({
    work_plan: workPlanId,
    is_unplanned: true,
    size: 100,
  });

  // Merge planned activities with unplanned activities
  const allActivities = useMemo(() => {
    // Transform planned activities (from work plan)
    const plannedActivitiesWithType = (activities || []).map((activity) => ({
      ...activity,
      activity_type: "PLANNED" as const,
    }));

    // Transform unplanned activities (from activity plans API)
    const unplannedActivitiesTransformed = (unplannedActivities?.data?.results || []).map((activityPlan) => {
      // Convert ActivityPlan to TActivity format
      const transformedActivity: TActivity & { activity_type: "UNPLANNED" } = {
        id: activityPlan.id,
        activity_number: activityPlan.work_plan_activity_identifier || "UNPLANNED",
        budget_line: { name: activityPlan.budget_line || "N/A" },
        objectives_sub_objectives: activityPlan.objectives_sub_objectives || "Unplanned Activity",
        activity: activityPlan.activity_description || activityPlan.activity_name,
        activity_justification: activityPlan.justification || "Unplanned activity added outside work plan",
        lead_dept: "",
        lead_person: activityPlan.responsible_person || "",
        location: "",
        expected_result: activityPlan.expected_results || "",
        indicator: "",
        mov: "",
        unit_cost_ngn: null,
        total_amount_ngn: "0",
        total_amount_usd: "0",
        cost_category: { name: "" },
        cost_grouping: { name: "" },
        cost_input: { name: "" },
        intervention_area: { name: "" },
        module: { name: "" },
        description_of_output: "",
        comments: "",
        gant_chart: {},
        budget_chart: {},
        activity_type: "UNPLANNED" as const,
      };
      return transformedActivity;
    });

    return [...plannedActivitiesWithType, ...unplannedActivitiesTransformed];
  }, [activities, unplannedActivities]);

  return (
    <Card>
      <ExpandableActivityTable data={allActivities} workPlanId={workPlanId} />
    </Card>
  );
}

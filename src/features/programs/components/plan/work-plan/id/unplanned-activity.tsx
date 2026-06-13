import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { Upload } from "lucide-react";
import ExpandableUnplannedActivityTable from "./unplanned-activity/ExpandableUnplannedActivityTable";
import { TMonth } from "@/features/programs/types/work-plan";

type PropsType = {
  workPlanId: string;
  workPlanData: any;
};

// Month array for fiscal year (Oct - Sep)
const months: TMonth[] = [
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep"
];

// Define the structure for unplanned activity table rows
type TUnplannedActivity = {
  id: string;
  activity_number: string;
  budget_line: { name: string } | string;
  objectives_sub_objectives: string;
  activity: string;
  activity_justification: string;
  description_of_output: string;
  lead_dept: string;
  lead_person: string;
  location: string;
  expected_result: string;
  indicator: string;
  mov: string;
  unit_cost_ngn: number | null;
  total_amount_ngn: string;
  total_amount_usd: string;
  cost_category: { name: string };
  cost_grouping: { name: string };
  cost_input: { name: string };
  intervention_area: { name: string };
  module: { name: string };
  comments: string;
  gant_chart: Record<any, number>;
  budget_chart: Record<any, number>;
  activity_type: "UNPLANNED";
  canEdit?: boolean;
  original_data?: any;
};

export default function UnplannedActivity({ workPlanId, workPlanData }: PropsType) {
  const dispatch = useDispatch();

  // Fetch ALL activity plans for this specific work plan, then filter for unplanned on frontend
  const { data: activityPlans, isFetching, refetch } = useGetAllActivityPlans({
    work_plan: workPlanId,
    size: 100,
    // Note: Not using is_unplanned filter to match working implementation
  });

  // Filter and transform unplanned activities
  const unplannedActivities = useMemo(() => {
    // Handle different possible API response structures
    const allActivityPlans = activityPlans?.data?.results || activityPlans?.results || activityPlans || [];

    console.log('UnplannedActivity API Response:', activityPlans);
    console.log('All activity plans:', allActivityPlans);

    // Log the first activity plan structure to see all available fields
    if (allActivityPlans.length > 0) {
      console.log('First activity plan structure:', allActivityPlans[0]);
      console.log('All keys in first activity:', Object.keys(allActivityPlans[0]));
    }

    if (allActivityPlans.length === 0) {
      console.log('No activity plans found');
      return [];
    }

    // Check for different possible unplanned indicators
    console.log('Checking for unplanned indicators...');
    allActivityPlans.forEach((plan: any, index: number) => {
      console.log(`Activity ${index}:`, {
        id: plan.id,
        is_unplanned: plan.is_unplanned,
        activity_type: plan.activity_type,
        type: plan.type,
        planned: plan.planned,
        activity_code: plan.activity_code
      });
    });

    // Try different filtering approaches - only show activities explicitly marked as unplanned
    let unplannedOnly = allActivityPlans.filter((plan: any) => plan.is_unplanned === true);
    console.log('Filter by is_unplanned === true:', unplannedOnly.length);

    if (unplannedOnly.length === 0) {
      // Try alternative filtering
      unplannedOnly = allActivityPlans.filter((plan: any) => plan.activity_type === 'UNPLANNED');
      console.log('Filter by activity_type === "UNPLANNED":', unplannedOnly.length);
    }

    // If no unplanned activities found after all filtering attempts, return empty array
    // DO NOT show all activities as unplanned
    if (unplannedOnly.length === 0) {
      console.log('No unplanned activities found - returning empty array');
      return [];
    }

    console.log('Final filtered unplanned activities:', unplannedOnly.length);

    const transformedActivities: TUnplannedActivity[] = unplannedOnly.map((activityPlan: any) => {
      // Debug each activity transformation - show ALL available fields
      console.log('=== FULL ACTIVITY PLAN DATA ===');
      console.log('Activity ID:', activityPlan.id);
      console.log('All available keys:', Object.keys(activityPlan));
      console.log('Full activity plan:', activityPlan);
      console.log('=== SPECIFIC FIELD VALUES ===');
      console.log('responsible_person:', activityPlan.responsible_person);
      console.log('lead_person:', activityPlan.lead_person);
      console.log('activity_description:', activityPlan.activity_description);
      console.log('expected_results:', activityPlan.expected_results);
      console.log('monthly_costs (RAW):', activityPlan.monthly_costs);
      console.log('monthly_costs type:', typeof activityPlan.monthly_costs);
      console.log('================================');

      // Convert monthly_costs object to gant_chart and budget_chart
      const ganttChart: Record<TMonth, number> = {};
      const budgetChart: Record<TMonth, number> = {};

      console.log('=== GANTT CHART PROCESSING ===');
      console.log('Activity ID:', activityPlan.id);
      console.log('monthly_costs exists?', !!activityPlan.monthly_costs);
      console.log('monthly_costs value:', activityPlan.monthly_costs);

      if (activityPlan.monthly_costs) {
        months.forEach(month => {
          const frequency = activityPlan.monthly_costs[month] || 0;
          console.log(`Processing ${month}: ${frequency}`);
          ganttChart[month as TMonth] = frequency;

          // Calculate budget for each month (frequency * unit_cost)
          const unitCost = activityPlan.unit_cost_ngn || 0;
          budgetChart[month as TMonth] = frequency * unitCost;
        });
      } else {
        console.log('❌ monthly_costs is null/undefined - using empty gantt chart');
      }

      console.log('Final ganttChart:', ganttChart);
      console.log('Final budgetChart:', budgetChart);
      console.log('Gantt chart has values?', Object.values(ganttChart).some(val => val > 0));
      console.log('==============================');

      return {
        id: activityPlan.id,
        // Try multiple possible field names for activity number
        activity_number: activityPlan.work_plan_activity_identifier || activityPlan.activity_identifier || activityPlan.activity_code || activityPlan.linked_workplan_activity || "UNPLANNED",

        // Budget line mapping - try different possible field structures
        budget_line: {
          name: activityPlan.budget_line ||
                (activityPlan.budget_line_item && activityPlan.budget_line_item.name) ||
                (typeof activityPlan.budget_line === 'object' ? activityPlan.budget_line.name : activityPlan.budget_line) ||
                "N/A"
        },

        // Objectives mapping
        objectives_sub_objectives: activityPlan.objectives_sub_objectives ||
                                  activityPlan.objective ||
                                  activityPlan.sub_objective ||
                                  "Unplanned Activity",

        // Activity description - try multiple fields
        activity: activityPlan.activity_description ||
                 activityPlan.activity_name ||
                 activityPlan.activity ||
                 activityPlan.description ||
                 "",

        // Activity justification
        activity_justification: activityPlan.justification ||
                               activityPlan.activity_justification ||
                               "Unplanned activity added outside work plan",

        // Lead department - try multiple fields
        lead_dept: activityPlan.lead_dept ||
                  activityPlan.department ||
                  activityPlan.lead_department ||
                  (activityPlan.department_obj && activityPlan.department_obj.name) ||
                  "",

        // Lead person mapping
        lead_person: activityPlan.responsible_person ||
                    activityPlan.lead_person ||
                    (activityPlan.responsible_person_obj && activityPlan.responsible_person_obj.name) ||
                    "",

        // Location mapping
        location: activityPlan.location ||
                 (activityPlan.location_obj && activityPlan.location_obj.name) ||
                 activityPlan.activity_location ||
                 "",

        // Expected results
        expected_result: activityPlan.expected_results ||
                        activityPlan.expected_result ||
                        activityPlan.expected_outcome ||
                        "",

        // Indicator mapping
        indicator: activityPlan.indicator ||
                  activityPlan.indicators ||
                  activityPlan.performance_indicator ||
                  "",

        // MoV mapping
        mov: activityPlan.mov ||
             activityPlan.means_of_verification ||
             activityPlan.verification_method ||
             "",

        // Financial fields
        unit_cost_ngn: activityPlan.unit_cost_ngn || activityPlan.unit_cost || null,
        total_amount_ngn: (activityPlan.total_cost_ngn || activityPlan.total_amount_ngn || activityPlan.total_cost || 0).toString(),
        total_amount_usd: (activityPlan.total_cost_usd || activityPlan.total_amount_usd || 0).toString(),

        // Cost category - handle both string and object formats with null safety
        cost_category: {
          name: activityPlan.cost_category ||
                (activityPlan.cost_category_obj && activityPlan.cost_category_obj.name) ||
                (typeof activityPlan.cost_category === 'object' && activityPlan.cost_category && activityPlan.cost_category.name) ||
                ""
        },

        // Cost grouping - handle both string and object formats with null safety
        cost_grouping: {
          name: activityPlan.cost_grouping ||
                (activityPlan.cost_grouping_obj && activityPlan.cost_grouping_obj.name) ||
                (typeof activityPlan.cost_grouping === 'object' && activityPlan.cost_grouping && activityPlan.cost_grouping.name) ||
                ""
        },

        // Cost input - handle both string and object formats with null safety
        cost_input: {
          name: activityPlan.cost_input ||
                (activityPlan.cost_input_obj && activityPlan.cost_input_obj.name) ||
                (typeof activityPlan.cost_input === 'object' && activityPlan.cost_input && activityPlan.cost_input.name) ||
                ""
        },

        // Intervention area - handle both string and object formats with null safety
        intervention_area: {
          name: activityPlan.intervention_area ||
                (activityPlan.intervention_area_obj && activityPlan.intervention_area_obj.name) ||
                (typeof activityPlan.intervention_area === 'object' && activityPlan.intervention_area && activityPlan.intervention_area.name) ||
                ""
        },

        // Comments
        comments: activityPlan.comments ||
                 activityPlan.remarks ||
                 activityPlan.notes ||
                 "",

        gant_chart: ganttChart,
        budget_chart: budgetChart,
        activity_type: "UNPLANNED" as const,
        canEdit: true,
        original_data: activityPlan,
      };
    });

    return transformedActivities;
  }, [activityPlans]);

  const handleEditActivity = (activity: TUnplannedActivity) => {
    dispatch(
      openDialog({
        type: DialogType.EDIT_UNPLANNED_ACTIVITY_MODAL,
        dialogProps: {
          header: "Edit Unplanned Activity",
          width: "max-w-4xl",
          activityData: activity.original_data,
          workPlanId,
          onSuccess: () => {
            console.log('=== EDIT SUCCESS CALLBACK ===');
            console.log('Triggering table refetch...');
            refetch();
            console.log('Refetch triggered');
            console.log('==============================');
          },
        },
      })
    );
  };

  const handleUploadActivities = () => {
    dispatch(
      openDialog({
        type: DialogType.ActivityUpload,
        dialogProps: {
          header: "Upload Unplanned Activities",
          width: "max-w-2xl",
          workPlanId,
          activityType: "UNPLANNED",
          projectId: workPlanData?.project?.id,
          financialYearId: workPlanData?.financial_year?.id,
          onSuccess: () => refetch(),
        },
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Unplanned Activities</h3>
          <p className="text-sm text-gray-600 mt-1">
            Activities added outside the original work plan. Click edit to complete missing details.
          </p>
        </div>
        <Button
          onClick={handleUploadActivities}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Activities
        </Button>
      </div>

      {/* Activities Table */}
      <Card>
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading unplanned activities...</div>
          </div>
        ) : unplannedActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Unplanned Activities</h4>
              <p className="text-sm text-gray-500 mb-4">
                Upload Excel files to add unplanned activities to this work plan.
              </p>
              <Button
                onClick={handleUploadActivities}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Add First Activity
              </Button>
            </div>
          </div>
        ) : (
          <ExpandableUnplannedActivityTable
            data={unplannedActivities}
            onEditActivity={handleEditActivity}
          />
        )}
      </Card>
    </div>
  );
}
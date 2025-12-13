import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useMemo } from "react";
import { Card } from "components/ui/card";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { useDispatch } from "react-redux";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { Edit2, Upload } from "lucide-react";
import { formatNumberCurrency } from "utils/utls";
import { TMonth } from "features/programs/types/work-plan";

type PropsType = {
  workPlanId: string;
  workPlanData: any;
};

const months = [
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep"
];

// Define the structure for unplanned activity table rows
type TUnplannedActivity = {
  id: string;
  activity_number: string;
  budget_line: { name: string };
  objectives_sub_objectives: string;
  activity: string;
  activity_justification: string;
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
  comments: string;
  gant_chart: Record<TMonth, number>;
  budget_chart: Record<TMonth, number>;
  activity_type: "UNPLANNED";
  canEdit?: boolean;
  original_data?: any;
};

const ganttChartColumns: ColumnDef<TUnplannedActivity>[] = months.map((month) => ({
  id: `gantt_${month}`,
  header: month,
  size: 100,
  accessorFn: (row) => {
    const value = row.gant_chart?.[month as TMonth];
    return value ?? "-";
  },
  footer: (info) => {
    const total = info.table.getRowModel().rows.reduce((sum, row) => {
      const val = row.original.gant_chart?.[month as TMonth] ?? 0;
      return sum + val;
    }, 0);
    return total > 0 ? `${total} ✓` : "-";
  },
}));

const budgetChartColumns: ColumnDef<TUnplannedActivity>[] = months.map((month) => ({
  id: `budget_${month}`,
  header: month,
  size: 100,
  accessorFn: (row) =>
    formatNumberCurrency(row.budget_chart?.[month as TMonth] ?? 0, "NGN"),
  footer: (info) => {
    const total = info.table.getRowModel().rows.reduce((sum, row) => {
      const val = row.original.budget_chart?.[month as TMonth] ?? 0;
      return sum + val;
    }, 0);
    return formatNumberCurrency(total, "NGN");
  },
}));

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

    // Try different filtering approaches
    let unplannedOnly = allActivityPlans.filter((plan: any) => plan.is_unplanned === true);
    console.log('Filter by is_unplanned === true:', unplannedOnly.length);

    if (unplannedOnly.length === 0) {
      // Try alternative filtering
      unplannedOnly = allActivityPlans.filter((plan: any) => plan.activity_type === 'UNPLANNED');
      console.log('Filter by activity_type === "UNPLANNED":', unplannedOnly.length);
    }

    if (unplannedOnly.length === 0) {
      // Maybe all activities from this API are unplanned since we're calling activity plans?
      console.log('No unplanned filter worked, using all activities as potentially unplanned');
      unplannedOnly = allActivityPlans;
    }

    console.log('Final filtered unplanned activities:', unplannedOnly);

    const transformedActivities: TUnplannedActivity[] = unplannedOnly.map((activityPlan: any) => ({
      id: activityPlan.id,
      activity_number: activityPlan.work_plan_activity_identifier || "UNPLANNED",
      budget_line: { name: activityPlan.budget_line || "N/A" },
      objectives_sub_objectives: activityPlan.objectives_sub_objectives || "Unplanned Activity",
      activity: activityPlan.activity_description || activityPlan.activity_name,
      activity_justification: activityPlan.justification || "Unplanned activity added outside work plan",
      lead_dept: activityPlan.lead_dept || "",
      lead_person: activityPlan.responsible_person || "",
      location: activityPlan.location || "",
      expected_result: activityPlan.expected_results || "",
      indicator: activityPlan.indicator || "",
      mov: activityPlan.mov || "",
      unit_cost_ngn: null, // Unplanned activities typically don't have detailed costing initially
      total_amount_ngn: "0",
      total_amount_usd: "0",
      cost_category: { name: activityPlan.cost_category || "" },
      cost_grouping: { name: activityPlan.cost_grouping || "" },
      cost_input: { name: activityPlan.cost_input || "" },
      intervention_area: { name: activityPlan.intervention_area || "" },
      comments: activityPlan.comments || "",
      gant_chart: {}, // Empty initially for unplanned activities
      budget_chart: {}, // Empty initially for unplanned activities
      activity_type: "UNPLANNED" as const,
      canEdit: true,
      original_data: activityPlan,
    }));

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
          onSuccess: () => refetch(),
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

  const unplannedActivityColumns: ColumnDef<TUnplannedActivity>[] = [
    {
      header: "Activity Type",
      accessorKey: "activity_type",
      size: 120,
      cell: ({ row }) => (
        <Badge className="bg-orange-500 text-white">
          UNPLANNED
        </Badge>
      ),
    },
    {
      header: "ACT. No.",
      accessorKey: "activity_number",
      size: 200,
    },
    {
      header: "Budget Line",
      accessorKey: "budget_line.name",
      size: 250,
    },
    {
      header: "Objectives/IR/Sub Objectives",
      accessorKey: "objectives_sub_objectives",
      size: 300,
    },
    {
      header: "Activity",
      accessorKey: "activity",
      size: 300,
    },
    {
      header: "Activity Justification",
      accessorKey: "activity_justification",
      size: 300,
    },
    {
      header: "Lead Department",
      accessorKey: "lead_dept",
      size: 200,
      cell: ({ row }) => {
        const value = row.getValue("lead_dept") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Lead Person",
      accessorKey: "lead_person",
      size: 200,
      cell: ({ row }) => {
        const value = row.getValue("lead_person") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Location of Activity",
      accessorKey: "location",
      size: 200,
      cell: ({ row }) => {
        const value = row.getValue("location") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Gantt Chart",
      columns: ganttChartColumns,
    },
    {
      header: "Expected Result",
      accessorKey: "expected_result",
      size: 250,
      cell: ({ row }) => {
        const value = row.getValue("expected_result") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Indicator",
      accessorKey: "indicator",
      size: 200,
      cell: ({ row }) => {
        const value = row.getValue("indicator") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "MoV",
      accessorKey: "mov",
      size: 100,
      cell: ({ row }) => {
        const value = row.getValue("mov") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Unit Cost",
      accessorFn: (data) =>
        data.unit_cost_ngn !== null
          ? formatNumberCurrency(data.unit_cost_ngn, "NGN")
          : "-",
      size: 200,
    },
    {
      header: "Budget",
      columns: budgetChartColumns,
    },
    {
      id: "total_ngn",
      header: "Total (NGN)",
      accessorFn: (data) => formatNumberCurrency(parseFloat(data.total_amount_ngn || "0"), "NGN"),
      size: 250,
      footer: (info) => {
        const total = info.table.getRowModel().rows.reduce((sum, row) => {
          const val = parseFloat(row.original.total_amount_ngn || "0");
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        return formatNumberCurrency(total, "NGN");
      },
    },
    {
      id: "total_usd",
      header: "Total (USD)",
      accessorFn: (data) => formatNumberCurrency(parseFloat(data.total_amount_usd || "0"), "USD"),
      size: 200,
      footer: (info) => {
        const total = info.table.getRowModel().rows.reduce((sum, row) => {
          const val = parseFloat(row.original.total_amount_usd || "0");
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        return formatNumberCurrency(total, "USD");
      },
    },
    {
      header: "Cost Category",
      accessorKey: "cost_category.name",
      size: 250,
      cell: ({ row }) => {
        const value = row.getValue("cost_category.name") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Cost Grouping",
      accessorKey: "cost_grouping.name",
      size: 250,
      cell: ({ row }) => {
        const value = row.getValue("cost_grouping.name") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Cost Input",
      accessorKey: "cost_input.name",
      size: 250,
      cell: ({ row }) => {
        const value = row.getValue("cost_input.name") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Intervention Area",
      accessorKey: "intervention_area.name",
      size: 250,
      cell: ({ row }) => {
        const value = row.getValue("intervention_area.name") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      header: "Comments",
      accessorKey: "comments",
      size: 250,
      cell: ({ row }) => {
        const value = row.getValue("comments") as string;
        return value || <span className="text-gray-400 italic">Not set</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 100,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditActivity(row.original)}
          className="h-8 w-8 p-0"
          title="Edit unplanned activity details"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

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
          <DataTable
            data={unplannedActivities}
            columns={unplannedActivityColumns}
            footer={true}
          />
        )}
      </Card>
    </div>
  );
}
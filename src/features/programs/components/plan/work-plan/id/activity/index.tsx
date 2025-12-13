import { TActivity, TMonth } from "features/programs/types/work-plan";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { formatNumberCurrency } from "utils/utls";
import { Card } from "components/ui/card";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useMemo } from "react";
import { Badge } from "components/ui/badge";

type PropsType = {
  activities: TActivity[];
  workPlanId: string;
};

const months = [
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
];

const ganttChartColumns: ColumnDef<TActivity>[] = months.map((month) => ({
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

const budgetChartColumns: ColumnDef<TActivity>[] = months.map((month) => ({
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

const activityPlanColumns: ColumnDef<TActivity>[] = [
  {
    header: "Activity Type",
    accessorKey: "activity_type",
    size: 120,
    cell: ({ row }) => {
      const activityType = row.original.activity_type || "PLANNED";
      return (
        <Badge className={`${
          activityType === "UNPLANNED" ? "bg-orange-500" : "bg-blue-500"
        } text-white`}>
          {activityType}
        </Badge>
      );
    },
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
  },
  {
    header: "Lead Person",
    accessorKey: "lead_person",
    size: 200,
  },
  {
    header: "Location of Activity",
    accessorKey: "location",
    size: 200,
  },
  {
    header: "Gantt Chart",
    columns: ganttChartColumns,
  },
  {
    header: "Expected Result",
    accessorKey: "expected_result",
    size: 250,
  },
  {
    header: "Indicator",
    accessorKey: "indicator",
    size: 200,
  },
  {
    header: "MoV",
    accessorKey: "mov",
    size: 100,
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
    accessorFn: (data) => formatNumberCurrency(data.total_amount_ngn, "NGN"),
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
    accessorFn: (data) => formatNumberCurrency(data.total_amount_usd, "USD"),
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
  },
  {
    header: "Cost Grouping",
    accessorKey: "cost_grouping.name",
    size: 250,
  },
  {
    header: "Cost Input",
    accessorKey: "cost_input.name",
    size: 250,
  },

  {
    header: "Intervention Area",
    accessorKey: "intervention_area.name",
    size: 250,
  },
  {
    header: "Comments",
    accessorKey: "comments",
    size: 250,
  },
];

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
      <DataTable
        data={allActivities}
        columns={activityPlanColumns}
        footer={true}
      />
    </Card>
  );
}

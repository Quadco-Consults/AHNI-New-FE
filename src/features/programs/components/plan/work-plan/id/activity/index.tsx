import { TActivity, TMonth } from "features/programs/types/work-plan";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { formatNumberCurrency } from "utils/utls";
import { Card } from "components/ui/card";

type PropsType = {
  activities: TActivity[];
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

export default function Activity({ activities }: PropsType) {
  return (
    <Card>
      <DataTable
        data={activities || []}
        columns={activityPlanColumns}
        footer={true}
      />
    </Card>
  );
}

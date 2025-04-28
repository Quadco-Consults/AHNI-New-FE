import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import {
    TActivity,
    TWorkPlanSingleResponse,
} from "definations/program-types/work-plan";
import { useMemo } from "react";
import { formatNumberCurrency } from "utils/utls";

type PropsType = {
    data: TWorkPlanSingleResponse;
};

const BudgetTab = ({ data }: PropsType) => {
    const columns = useMemo<ColumnDef<TActivity>[]>(
        () => [
            {
                header: "ACT. No.",
                accessorKey: "activity_number",
                size: 200,
            },

            {
                header: "Activities",
                accessorKey: "activity",
                size: 300,
            },

            {
                header: "Activity Justification",
                accessorKey: "activity_justification",
                size: 300,
            },

            {
                header: "Unit Cost",
                accessorKey: "unit_cost_ngn",
                accessorFn: (data) =>
                    formatNumberCurrency(data.unit_cost_ngn, "NGN"),
                size: 200,
            },

            {
                header: "Oct",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Oct"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Nov",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Nov"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Dec",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Dec"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Jan",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Jan"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Feb",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Feb"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Mar",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Mar"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Apr",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Apr"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "May",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["May"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Jun",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Jun"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Jul",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Jul"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Aug",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Aug"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Sep",
                accessorFn: ({ budget_chart }) =>
                    `${(budget_chart && `₦${budget_chart["Sep"]}`) || "N/A"}`,
                size: 100,
            },

            {
                header: "Total (NGN)",
                accessorKey: "total_amount_ngn",
                accessorFn: (data) =>
                    formatNumberCurrency(data.total_amount_ngn, "NGN"),
                size: 250,
            },

            {
                header: "Total (USD)",
                accessorFn: (data) =>
                    formatNumberCurrency(data.total_amount_ngn, "USD"),
                size: 200,
            },

            {
                header: "Location of Activity",
                accessorKey: "location",
                size: 250,
            },

            {
                header: "Approved WP Ref. No",
                accessorKey: "approved_ref_no",
                size: 250,
            },
            {
                header: "Cost Category",
                accessorKey: "cost_group",
                size: 250,
            },
            {
                header: "Intervention Area",
                accessorKey: "intervention_area",
                size: 250,
            },
            {
                header: "Comments",
                accessorKey: "comments",
                size: 250,
            },
        ],
        []
    );

    return (
        <DataTable
            data={data.activities || []}
            columns={columns}
            isLoading={false}
        />
    );
};

export default BudgetTab;

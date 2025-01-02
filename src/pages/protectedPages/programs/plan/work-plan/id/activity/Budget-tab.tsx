import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import {
    TActivity,
    TWorkPlanSingleResponse,
} from "definations/program-types/work-plan";
import { useMemo } from "react";

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
                accessorFn: (data) => `${data.unit_cost_ngn}`,
                size: 200,
            },

            {
                header: "Oct",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Oct"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Nov",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Nov"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Dec",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Dec"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Jan",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Jan"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Feb",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Feb"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Mar",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Mar"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Apr",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Apr"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "May",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["May"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Jun",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Jun"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Jul",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Jul"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Aug",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Aug"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Sep",
                accessorFn: ({ gant_chart }) =>
                    `${(gant_chart && gant_chart["Sep"]) || "N/A"}`,
                size: 100,
            },

            {
                header: "Total (NGN)",
                accessorKey: "total_amount_ngn",
                accessorFn: (data) => `₦${data.total_amount_ngn}`,
                size: 250,
            },

            {
                header: "Total (USD)",
                accessorFn: (data) => `$${data.total_amount_usd}`,
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

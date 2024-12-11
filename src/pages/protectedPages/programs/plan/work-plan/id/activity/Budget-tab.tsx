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
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Oct"]}`,
                size: 100,
            },

            {
                header: "Nov",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Nov"]}`,
                size: 100,
            },

            {
                header: "Dec",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Dec"]}`,
                size: 100,
            },

            {
                header: "Jan",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Jan"]}`,
                size: 100,
            },

            {
                header: "Feb",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Feb"]}`,
                size: 100,
            },

            {
                header: "Mar",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Mar"]}`,
                size: 100,
            },

            {
                header: "Apr",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Apr"]}`,
                size: 100,
            },

            {
                header: "May",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["May"]}`,
                size: 100,
            },

            {
                header: "Jun",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Jun"]}`,
                size: 100,
            },

            {
                header: "Jul",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Jul"]}`,
                size: 100,
            },

            {
                header: "Aug",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Aug"]}`,
                size: 100,
            },

            {
                header: "Sep",
                accessorKey: "gant_chart",
                accessorFn: (data) => `${data.gant_chart["Sep"]}`,
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

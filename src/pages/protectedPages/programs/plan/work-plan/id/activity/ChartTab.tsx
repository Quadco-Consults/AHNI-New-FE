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

const ChartTab = ({ data }: PropsType) => {
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
                size: 200,
            },

            {
                header: "Oct",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Oct"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Nov",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Nov"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Dec",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Dec"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Jan",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Jan"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Feb",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Feb"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Mar",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Mar"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Apr",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Apr"] : "N/A"}`,
                size: 100,
            },

            {
                header: "May",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["May"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Jun",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Jun"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Jul",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Jul"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Aug",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Aug"] : "N/A"}`,
                size: 100,
            },

            {
                header: "Sep",
                accessorFn: (data) =>
                    `${data.gant_chart ? data?.gant_chart["Sep"] : "N/A"}`,
                size: 100,
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

export default ChartTab;

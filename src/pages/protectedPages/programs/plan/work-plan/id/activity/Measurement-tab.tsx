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

const MeasurementTab = ({ data }: PropsType) => {
    const columns = useMemo<ColumnDef<TActivity>[]>(
        () => [
            {
                header: "ACT. No.",
                accessorKey: "activity_number",
            },
            {
                header: "Activities",
                accessorKey: "activity",
                size: 200,
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

export default MeasurementTab;

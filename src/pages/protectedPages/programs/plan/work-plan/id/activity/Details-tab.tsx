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

const DetailTab = ({ data }: PropsType) => {
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
                header: "Lead Dept",
                accessorKey: "lead_dept",
                size: 150,
            },
            {
                header: "Lead Person",
                accessorKey: "lead_person",
                size: 150,
            },
            {
                header: "Location",
                accessorKey: "location",
                size: 200,
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

export default DetailTab;

import { ICloseOutPlanTask } from "definations/c&g/closeout-plan";
import { ColumnDef } from "@tanstack/react-table";

export const closeOutPlanTaskColumns: ColumnDef<ICloseOutPlanTask>[] = [
    {
        header: "PRE-CLOSEOUT & CLOSE-OUT ACTIVITIES",
        accessorKey: "description",
        size: 300,
    },

    {
        header: "DESIGNATION",
        accessorKey: "designation",
        size: 200,
    },

    {
        header: "TIMELINE",
        columns: [
            {
                header: "START DATE",
                accessorKey: "start_date",
                size: 200,
            },
            {
                header: "END DATE",
                accessorKey: "end_date",
                size: 200,
            },
        ],
    },
    {
        header: "STATUS",
        accessorKey: "status",
        size: 200,
    },
    {
        header: "REMARKS",
        accessorKey: "remarks",
        size: 150,
    },
];

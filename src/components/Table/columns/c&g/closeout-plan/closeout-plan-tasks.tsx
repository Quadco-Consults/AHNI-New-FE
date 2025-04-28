import { ICloseOutPlanTask } from "definations/c&g/closeout-plan";
import { ColumnDef } from "@tanstack/react-table";

export const closeOutPlanTaskColumns: ColumnDef<ICloseOutPlanTask>[] = [
    {
        header: "Designation",
        accessorKey: "designation",
        size: 200,
    },
    {
        header: "Start Date",
        accessorKey: "start_date",
        size: 200,
    },
    {
        header: "End Date",
        accessorKey: "end_date",
        size: 200,
    },
    {
        header: "Status",
        accessorKey: "status",
        size: 200,
    },
    {
        header: "Remarks",
        accessorKey: "remarks",
        size: 150,
    },
];

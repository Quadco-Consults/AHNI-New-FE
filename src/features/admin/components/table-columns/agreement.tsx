import { ColumnDef } from "@tanstack/react-table";

export const agreementColumns: ColumnDef<any>[] = [
    {
        header: "Provider",
        id: "provider",
        accessorKey: "provider",
    },
    {
        header: "Service",
        id: "service",
        accessorKey: "service",
    },

    {
        header: "Type",
        id: "type",
        accessorKey: "type",
    },

    {
        header: "Start Date",
        id: "start_date",
        accessorKey: "start_date",
    },

    {
        header: "End Date",
        id: "end_date",
        accessorKey: "end_date",
    },

    {
        header: "Status",
        id: "status",
        accessorKey: "status",
    },

    {
        header: "",
        id: "action",
    },
];

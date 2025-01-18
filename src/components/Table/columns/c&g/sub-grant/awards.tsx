import { ColumnDef } from "@tanstack/react-table";

export const subGrantAwardColumns: ColumnDef<any>[] = [
    {
        header: "Project Title",
        accessorKey: "project_title",
        size: 200,
        cell: ({ row }) => <p>{row?.original?.project_title}</p>,
    },
    {
        header: "Business Unit",
        accessorKey: "business_unit",
        size: 200,
        cell: ({ row }) => <p>{row?.original?.business_unit}</p>,
    },
    {
        header: "Award Amount",
        accessorKey: "project_value_usd",
        size: 200,
        cell: ({ row }) => <p>${row?.original?.project_value_usd}</p>,
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
        cell: ({ row }) => <p>{row?.original?.status || "-"}</p>,
    },
    {
        header: "Action",
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu data={row.original} />,
    },
];

const TableMenu = ({ data }: any) => {
    return <></>;
};

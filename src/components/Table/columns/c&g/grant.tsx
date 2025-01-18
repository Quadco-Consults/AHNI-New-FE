import { ColumnDef } from "@tanstack/react-table";
import IconButton from "components/shared/IconButton";
import { generatePath, Link } from "react-router-dom";

export const grantColumns: ColumnDef<any>[] = [
    {
        header: "Project Name",
        accessorKey: "project",
        size: 200,
    },
    {
        header: "Location",
        accessorKey: "location",
        size: 200,
    },
    {
        header: "Funding source",
        accessorKey: "grantor",
        size: 200,
    },
    {
        header: "Award Amount",
        accessorKey: "award_amount",
        size: 200,
    },

    {
        header: "Award Date",
        accessorKey: "",
        size: 200,
    },
    {
        header: "Monthly Spend",
        accessorKey: "monthly_spend",
        size: 200,
    },
    {
        header: "Total Obligations",
        accessorKey: "_",
        size: 200,
    },
    {
        header: "Intervention",
        accessorKey: "intervention_area",
        size: 200,
    },
    {
        header: "Status",
        accessorKey: "status",
        size: 200,
    },

    {
        id: "actions",
        header: "",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = () => {
    return <></>;
};

/*  
/* {
            id: "select",
            size: 50,
            header: ({ table }) => {
                return (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => {
                            table.toggleAllPageRowsSelected(!!value);
                        }}
                    />
                );
            },
            cell: ({ row }) => {
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                        }}
                    />
                );
            },
        }, */

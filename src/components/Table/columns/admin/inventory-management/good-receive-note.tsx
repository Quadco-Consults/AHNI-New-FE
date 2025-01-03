import { ColumnDef } from "@tanstack/react-table";
import { IGoodReceiveNotePaginatedData } from "definations/admin/inventory-management/good-receive-note";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { generatePath, Link } from "react-router-dom";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";

export const goodReceiveNoteColumns: ColumnDef<IGoodReceiveNotePaginatedData>[] =
    [
        {
            header: "Vendor Name",
            accessorKey: "name",
        },
        {
            header: "PO Number",
            accessorKey: "item",
        },

        {
            header: "Invoice Number",
            accessorKey: "quantity",
            size: 200,
        },
        {
            header: "Waybill Number",
            accessorKey: "department",
        },

        {
            header: "Date Created",
            accessorKey: "date",
        },
        {
            header: "Remarks",
            accessorKey: "date",
        },
        {
            header: "",
            accessorKey: "actions",
            size: 80,
            cell: ({ row }) => {
                return <TableMenu {...row.original} />;
            },
        },
    ];

const TableMenu = ({ id }: IGoodReceiveNotePaginatedData) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="flex gap-2 py-6">
                    <MoreOptionsHorizontalIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="flex flex-col items-start justify-between gap-1">
                    <Link
                        to={generatePath(AdminRoutes.GRN_DETAIL, {
                            id,
                        })}
                    >
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                        >
                            <EyeIcon />
                            View
                        </Button>
                    </Link>
                    <Button
                        className="w-full flex items-center justify-start gap-2"
                        variant="ghost"
                    >
                        <DeleteIcon />
                        Delete
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

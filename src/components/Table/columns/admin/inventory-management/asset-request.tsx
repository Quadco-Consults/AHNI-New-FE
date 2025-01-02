import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { IAssetRequestPaginatedData } from "definations/admin/inventory-management/asset-request";

export const assestRequestColum: ColumnDef<IAssetRequestPaginatedData>[] = [
    {
        header: "Asset Name",
        id: "name",
        accessorKey: "name",
    },

    {
        header: "Asset Code",
        accessorKey: "remark",
    },

    {
        header: "Asset Type",
        accessorKey: "remark",
    },
    {
        header: "Asset Condition",
        accessorKey: "asset_condition",
    },
    {
        header: "Justification",
        accessorKey: "justification_for_disposal",
    },
    {
        header: "Status",
        accessorKey: "life_span_at_report",
    },
    {
        header: "Request Date",
        accessorKey: "life_span_at_report",
    },
    {
        header: "Remark",
        accessorKey: "remark",
    },
    {
        header: "Recommendation",
        accessorKey: "recommendation",
    },
    {
        header: "",
        accessorKey: "action",
        size: 80,
        cell: ({ row }) => {
            return <TableAction {...row.original} />;
        },
    },
];

const TableAction = ({}: IAssetRequestPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const onDelete = async () => {};

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex gap-2 py-6">
                        <MoreOptionsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" w-fit">
                    <div className="flex flex-col items-start justify-between gap-1">
                        <Link to="">
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View
                            </Button>
                        </Link>
                        <Link to="">
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EditIcon />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                            onClick={() => setDialogOpen(true)}
                        >
                            <DeleteIcon />
                            Delete
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this asset request?"
                loading={false}
                onCancel={() => setDialogOpen(false)}
                onOk={onDelete}
            />
        </div>
    );
};

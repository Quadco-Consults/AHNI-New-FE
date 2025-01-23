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
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { format } from "date-fns";
import { AdminRoutes } from "constants/RouterConstants";
import { useDeleteAssetRequestMutation } from "services/admin/inventory-management/asset-request";
import { toast } from "sonner";

export const assestRequestColum: ColumnDef<IAssetRequestPaginatedData>[] = [
    {
        header: "Asset Name",
        id: "asset",
        accessorKey: "asset",
        size: 200,
    },

    {
        header: "Asset Code",
        accessorKey: "asset_code",
        size: 200,
    },

    {
        header: "Asset Type",
        accessorKey: "asset_type",
        size: 200,
    },

    {
        header: "Request Type",
        accessorKey: "type",
        size: 200,
    },

    {
        header: "Asset Condition",
        accessorKey: "asset_condition",
        size: 200,
    },
    {
        header: "Justification",
        accessorKey: "disposal_justification",
        size: 200,
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "REVIEWED" &&
                            "bg-blue-200 text-blue-500",
                        getValue() === "APPROVED" &&
                            "bg-green-200 text-green-500",
                        getValue() === "PENDING" &&
                            "bg-yellow-200 text-yellow-500",
                        getValue() === "AUTHORIZED" &&
                            "text-green-200 bg-green-500"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },
    {
        header: "Request Date",
        accessorFn: ({ created_datetime }) =>
            created_datetime && format(created_datetime, "MMM dd, yyyy"),
    },

    {
        header: "Description",
        accessorKey: "description",
    },

    {
        header: "Remark",
        accessorKey: "comments",
    },

    {
        header: "Recommendation",
        accessorKey: "recommendation",
        size: 250,
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

const TableAction = ({ id }: IAssetRequestPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [deleteAssetRequest, { isLoading }] = useDeleteAssetRequestMutation();

    const onDelete = async () => {
        try {
            await deleteAssetRequest(id).unwrap();
            toast.success("Asset Request Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

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
                        <Link
                            to={{
                                pathname: AdminRoutes.ASSETS_REQUEST_VIEW,
                                search: `?id=${id}`,
                            }}
                            className="block w-full"
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View
                            </Button>
                        </Link>
                        <Link
                            to={{
                                pathname: AdminRoutes.ASSETS_REQUEST_CREATE,
                                search: `?id=${id}`,
                            }}
                            className="block w-full"
                        >
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
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={onDelete}
            />
        </div>
    );
};

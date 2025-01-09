import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { IAssetMaintenancePaginatedData } from "definations/admin/asset-maintenance";
import { format } from "date-fns";
import { useDeleteAssetMaintenanceMutation } from "services/admin/asset-maintenance";

export const assetMaintenanceColumn: ColumnDef<IAssetMaintenancePaginatedData>[] =
    [
        {
            header: "Asset",
            id: "facility",
            accessorKey: "facility",
        },
        {
            header: "Classification",
            id: "classficiation",
            accessorKey: "classficiation",
        },

        {
            header: "Maintenance Type",
            id: "maintenance_type",
            accessorKey: "maintenance_type",
        },

        {
            header: "Problem Description",
            id: "description",
            accessorKey: "description",
        },

        {
            header: "Status",
            accessorFn: () => "N/A",
        },

        {
            header: "Date Created",
            accessorFn: ({ created_datetime }) =>
                format(created_datetime, "dd-MMM-yyyy"),
        },

        {
            header: "",
            accessorKey: "action",
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IAssetMaintenancePaginatedData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteAssetMaintenance, { isLoading }] =
        useDeleteAssetMaintenanceMutation();

    const handleDelete = async () => {
        try {
            await deleteAssetMaintenance(id).unwrap();
            toast.success("Asset Maintenance Ticket Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex gap-2 py-6">
                            <MoreOptionsHorizontalIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link
                                className="w-full"
                                to={generatePath(
                                    AdminRoutes.VIEW_ASSET_MAINTENANCE,
                                    {
                                        id,
                                    }
                                )}
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
                                onClick={() => setDialogOpen(true)}
                            >
                                <DeleteIcon />
                                Delete
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={dialogOpen}
                title="Are you sure you want to delete this maintenance ticket?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

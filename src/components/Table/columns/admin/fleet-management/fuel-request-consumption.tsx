import { ColumnDef } from "@tanstack/react-table";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import { generatePath, Link } from "react-router-dom";
import { IFuelRequestPaginatedData } from "definations/admin/fleet-management/fuel-request";
import ApproveIcon from "components/icons/ApproveIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { useState } from "react";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { toast } from "sonner";
import { useDeleteFuelRequestMutation } from "services/admin/fleet-management/fuel-request";
import PencilIcon from "components/icons/PencilIcon";

export const fuelRequestConsumptionColumns: ColumnDef<IFuelRequestPaginatedData>[] =
    [
        {
            header: "Date",
            id: "date",
            accessorKey: "date",
        },

        {
            header: "Odometer Reading",
            id: "odometer",
            accessorKey: "odometer",
            size: 200,
        },

        {
            header: "Fuel Coupon Number",
            id: "_",
            accessorKey: "_",
            size: 200,
        },

        {
            header: "Location",
            id: "location",
            accessorKey: "location",
        },

        {
            header: "Vendor",
            id: "vendor",
            accessorKey: "vendor",
        },

        {
            header: "Price Per Litre (₦)",
            id: "price_per_litre",
            accessorKey: "price_per_litre",
            size: 200,
        },

        {
            header: "Litre Quantity",
            id: "quantity",
            accessorKey: "quantity",
        },

        {
            header: "Amount",
            id: "amount",
            accessorKey: "amount",
        },

        {
            header: "",
            accessorKey: "action",
            cell: ({ row }) => {
                return <TableMenu {...row.original} />;
            },
        },
    ];

const TableMenu = ({ id }: IFuelRequestPaginatedData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteFuelRequest, { isLoading }] = useDeleteFuelRequestMutation();

    const handleDelete = async () => {
        try {
            await deleteFuelRequest(id).unwrap();
            toast.success("Fuel Request Deleted");
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
                <PopoverContent className="w-fit">
                    <div className="flex flex-col items-start justify-between gap-1">
                        <Link
                            to={{
                                pathname: generatePath(
                                    AdminRoutes.VIEW_FUEL_CONSUMPTION,
                                    { id }
                                ),
                            }}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <ApproveIcon />
                                Approve
                            </Button>
                        </Link>

                        <Link
                            to={{
                                pathname: AdminRoutes.CREATE_FUEL_CONSUMPTION,
                                search: `?id=${id}`,
                            }}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <PencilIcon />
                                Edit
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-start gap-2"
                            onClick={() => setDialogOpen(true)}
                        >
                            <DeleteIcon />
                            Delete
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            <ConfirmationDialog
                open={dialogOpen}
                title="Are you sure you want to delete this fuel request?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

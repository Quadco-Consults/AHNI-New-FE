import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TItemRequisitionPaginatedData } from "definations/admin/inventory-management/item-requisition";
import ApproveIcon from "components/icons/ApproveIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { generatePath, Link } from "react-router-dom";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { useState } from "react";
import { useDeleteItemRequisitionMutation } from "services/admin/inventory-management/item-requisition";
import { toast } from "sonner";
import PencilIcon from "components/icons/PencilIcon";
import EditIcon from "components/icons/EditIcon";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

export const itemRequisitionColumns: ColumnDef<TItemRequisitionPaginatedData>[] =
    [
        {
            header: "Items Requested",
            accessorFn: ({ consummables }) =>
                consummables.map((item) => item.consummable).join(", "),
        },
        {
            header: "Quantity Requested",
            accessorFn: ({ consummables }) =>
                consummables
                    .map((item) => item.quantity)
                    .reduce((accumulator, value) => {
                        return accumulator + value;
                    }, 0),
            size: 250,
        },
        {
            header: "Department/Unit",
            accessorKey: "department",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ getValue }) => {
                const status = "PENDING";

                return (
                    <Badge
                        variant="default"
                        className={cn(
                            "p-1 rounded-lg bg-yellow-200 text-yellow-500"
                        )}
                    >
                        {status}
                    </Badge>
                );
            },
        },
        {
            header: "Approved by",
            accessorKey: "approval",
        },
        {
            header: "Date Requested",
            id: "created_datetime",
            accessorFn: ({ created_datetime }) =>
                format(created_datetime, "yyyy-dd-MM"),
        },
        {
            header: "",
            accessorKey: "actions",
            size: 80,
            cell: ({ row }) => {
                return <TableAction {...row.original} />;
            },
        },
    ];

const TableAction = ({ id }: TItemRequisitionPaginatedData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteItemRequisition, { isLoading }] =
        useDeleteItemRequisitionMutation();

    const handleDelete = async () => {
        try {
            await deleteItemRequisition(id).unwrap();
            toast.success("Item Requisition Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
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
                            to={generatePath(
                                AdminRoutes.ITEM_REQUISITION_DETAIL,
                                { id }
                            )}
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
                                pathname: AdminRoutes.CREATE_ITEM_REQUISITION,
                                search: `?id=${id}`,
                            }}
                            className="block w-full"
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
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                        >
                            <ApproveIcon />
                            Approve
                        </Button>
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
                open={dialogOpen}
                title="Are you sure you want to delete this item requisition?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </>
    );
};

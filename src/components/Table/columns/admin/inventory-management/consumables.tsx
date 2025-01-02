import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";

import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { AdminRoutes } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";

import { openDialog } from "store/ui";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "components/ui/badge";
import { TConsumablePaginatedData } from "definations/admin/inventory-management/consumable";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link } from "react-router-dom";
import EyeIcon from "components/icons/EyeIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { format } from "date-fns";
import { useState } from "react";
import { useDeleteConsumableMutation } from "services/admin/inventory-management/consumable";

export const consumableColums: ColumnDef<TConsumablePaginatedData>[] = [
    {
        header: "Item",
        id: "item",
        accessorKey: "item",
    },
    {
        header: "Quantity",
        id: "quantity",
        accessorKey: "quantity",
    },
    {
        header: "Expiring Date",
        id: "expiry_date",
        accessorKey: "expiry_date",
    },
    {
        header: "Entry Date",
        size: 200,
        accessorFn: ({ created_datetime }) =>
            format(created_datetime, "yyyy-MM-dd"),
    },
    {
        header: "Vendor",
        accessorKey: "created_by",
    },
    {
        header: "Max Stock",
        accessorKey: "max_stock",
    },
    {
        header: "Category",
        accessorKey: "category",
    },
    {
        header: "",
        accessorKey: "action",
        cell: ({ row }) => <TableAction {...row.original} />,
    },
];

const TableAction = ({ id }: TConsumablePaginatedData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteConsumable, { isLoading }] = useDeleteConsumableMutation();

    const handleDeleteConsumable = async () => {
        try {
            await deleteConsumable(id).unwrap();
            toast.success("Consumable Deleted");
            setDialogOpen(false);
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
                                to={generatePath(AdminRoutes.VIEW_CONSUMABLE, {
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
                            <Link
                                className="w-full"
                                to={{
                                    pathname: AdminRoutes.CREATE_CONSUMABLE,
                                    search: `?id=${id}`,
                                }}
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
            </>

            <ConfirmationDialog
                open={dialogOpen}
                title="Are you sure you want to delete this consumable?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDeleteConsumable}
            />
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
const StockAction = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="flex items-center space-x-2">
            <Popover>
                <PopoverTrigger>
                    <MoreIcon />
                </PopoverTrigger>
                <PopoverContent className="w-32 py-1 space-y-2">
                    <div
                        onClick={() => {
                            dispatch(
                                openDialog({
                                    type: DialogType.AddStock,
                                    dialogProps: {},
                                })
                            );
                        }}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white"
                    >
                        Update
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger className="flex items-center w-full gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
                            Delete
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {
                                        "This action cannot be undone. This will permanently delete this item and remove all associated data from our servers."
                                    }
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export const stockColumns: ColumnDef<{}>[] = [
    {
        header: "Date",
        accessorKey: "date",
    },
    {
        header: "Description",
        accessorKey: "description",
    },
    {
        header: "Unit Cost",
        accessorKey: "unit_cost",
    },
    {
        header: "Quantity Received",
        accessorKey: "quantity",
        size: 200,
    },
    {
        header: "Quantity Issued",
        accessorKey: "quantity",
    },
    {
        header: "Balance",
        accessorKey: "balance",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant={
                        getValue<string>().toLowerCase() === "untreated"
                            ? "secondary"
                            : "success"
                    }
                >
                    {getValue<string>()}
                </Badge>
            );
        },
    },
    {
        header: "Action",
        accessorKey: "id",
        cell: ({ row }) => <StockAction />,
    },
];

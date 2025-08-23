"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IGrantPaginatedData } from "@/features/contracts-grants/types/grants";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { CG_ROUTES } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteGrant } from "@/features/contracts-grants/controllers/grantController";
import { formatNumberCurrency } from "utils/utls";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";

export const subGrantAwardColumns: ColumnDef<ISubGrantPaginatedData>[] = [
    {
        header: "Project",
        id: "name",
        accessorKey: "name",
        size: 200,
    },

    {
        header: "Project ID",
        id: "grant_id",
        accessorKey: "grant_id",
        size: 200,
    },

    {
        header: "Sub-Grant Title",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Donor",
        id: "funding_sources",
        // accessorFn: ({ funding_sources }) => funding_sources?.join(", "),
        size: 200,
    },

    {
        header: "Intervention Area",
        id: "project",
        size: 200,
    },

    {
        header: "Award Type",
        id: "award_type",
        accessorKey: "award_type",
        size: 200,
    },

    {
        header: "Modification",
        id: "modification",
        accessorKey: "modification",
        size: 200,
    },

    {
        header: "Award Amount",
        id: "award_amount",
        accessorKey: "award_amount",
        accessorFn: (data) => formatNumberCurrency(data.award_amount, "USD"),
        size: 200,
    },

    {
        header: "Monthly Spend",
        id: "monthly_spend",
        accessorFn: ({ current_month_expenditure_amount }) =>
            current_month_expenditure_amount
                ? formatNumberCurrency(current_month_expenditure_amount, "USD")
                : "N/A",
        size: 200,
    },
    {
        header: "Total Obligations",
        id: "total_obligation_amount",
        accessorFn: ({ total_obligation_amount }) =>
            total_obligation_amount
                ? formatNumberCurrency(total_obligation_amount, "USD")
                : "N/A",
        size: 200,
    },

    {
        header: "Total Expenditure",
        id: "total_expenditure_amount",
        accessorFn: ({ total_expenditure_amount }) =>
            total_expenditure_amount
                ? formatNumberCurrency(total_expenditure_amount, "USD")
                : "N/A",
        size: 200,
    },

    {
        header: "Status",
        accessorKey: "status",
        size: 200,
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "IN_PROGRESS" &&
                            "bg-green-200 text-green-500",
                        getValue() === "CLOSED" && "bg-red-200 text-red-500",
                        getValue() === "PENDING" &&
                            "bg-yellow-200 text-yellow-500",
                        getValue() === "On Hold" && "text-grey-200 bg-grey-500"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },
    {
        header: "",
        id: "action",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: ISubGrantPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { deleteGrant, isLoading } = useDeleteGrant();

    const handleDelete = async () => {
        try {
            await deleteGrant(id)();
            toast.success("Grant Deleted");
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
                                href={generatePath(CG_ROUTES.GRANT_DETAILS, {
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
                                href={{
                                    pathname: CG_ROUTES.GRANT_CREATE,
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
                open={isDialogOpen}
                title="Are you sure you want to delete this grant?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

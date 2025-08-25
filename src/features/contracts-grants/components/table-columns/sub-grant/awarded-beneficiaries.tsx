"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { useState } from "react";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import { CG_ROUTES } from "constants/RouterConstants";
import { toast } from "sonner";
import { useDeleteSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import ConfirmationDialog from "components/ConfirmationDialog";
import { formatNumberCurrency } from "utils/utls";

export const awardedBeneficiariesColumn: ColumnDef<ISubGrantPaginatedData>[] = [
    {
        header: "Grant Name",
        id: "title",
        accessorKey: "title",
        size: 200,
    },

    {
        header: "Donor",
        id: "project",
        accessorKey: "project",
        size: 200,
    },

    {
        header: "Project",
        id: "business_unit",
        accessorKey: "business_unit",
        size: 200,
    },

    {
        header: "Sub Grantee Name",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Sub Grantee Address",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Sub Grantee Email",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Sub Grantee Phone Number",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Subaward Life of Project Value (USD)",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Subaward Life of Project Value (Local Currency)",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Start Date",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "End Date",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "",
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: ISubGrantPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { deleteSubGrant, isLoading: isDeleteLoading } =
        useDeleteSubGrant();

    const handleDelete = async () => {
        try {
            await deleteSubGrant(id)();
            toast.success("Sub Grant Deleted");
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
                        <Link
                            href={generatePath(CG_ROUTES.SUBGRANT_AWARD_DETAILS, {
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
                            href={{
                                pathname: CG_ROUTES.CREATE_SUBGRANT_AWARD,
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
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this sub grant?"
                loading={isDeleteLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

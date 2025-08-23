"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_ROUTES } from "constants/RouterConstants";
import { IFacilitatorPaginatedData } from "@/features/contracts-grants/types/contract-management/facilitator-management";
import { cn } from "lib/utils";
import { useState } from "react";
import Link from "next/link";
import { useDeleteFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { toast } from "sonner";

export const facilitatorManagementColumns: ColumnDef<IFacilitatorPaginatedData>[] = [
    {
        header: "Title",
        id: "title",
        accessorKey: "title",
        size: 250,
    },
    {
        header: "Grade Level",
        id: "grade_level",
        accessorKey: "grade_level",
        size: 150,
    },
    {
        header: "Duration",
        id: "duration",
        accessorKey: "duration",
        size: 100,
    },
    {
        header: "Number of Facilitators",
        id: "facilitaor_number",
        accessorKey: "facilitaor_number",
        size: 150,
    },
    {
        header: "Status",
        id: "status",
        accessorKey: "status",
        size: 150,
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "ACTIVE" &&
                            "bg-green-200 text-green-500",
                        getValue() === "INACTIVE" && "bg-red-200 text-red-500",
                        getValue() === "PENDING" &&
                            "bg-yellow-200 text-yellow-500",
                        getValue() === "DRAFT" && "bg-gray-200 text-gray-500"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },
    {
        header: "Action",
        id: "actions",
        size: 80,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: IFacilitatorPaginatedData) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { deleteFacilitator, isLoading: isDeleteLoading } =
        useDeleteFacilitator(id);

    const handleDelete = async () => {
        try {
            await deleteFacilitator();
            toast.success("Facilitator Management Deleted");
            setIsDialogOpen(false);
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
                            href={`/dashboard/c-and-g/facilitator-management/${id}`}
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
                            href={`/dashboard/c-and-g/facilitator-management/create/application-details?id=${id}`}
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
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <DeleteIcon />
                            Delete
                        </Button>
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this facilitator management?"
                loading={isDeleteLoading}
                onCancel={() => setIsDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
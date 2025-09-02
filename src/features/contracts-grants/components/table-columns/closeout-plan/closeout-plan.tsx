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
import { DialogType } from "constants/dailogs";
import { CG_ROUTES } from "constants/RouterConstants";
import { ICloseOutPlanPaginatedData } from "@/features/contracts-grants/types/closeout-plan";
import { useAppDispatch } from "hooks/useStore";
import { cn } from "lib/utils";
import { useState } from "react";
import Link from "next/link";
import { useDeleteCloseoutPlan } from "@/features/contracts-grants/controllers/closeoutPlanController";
import { closeoutPlanAPis } from "@/features/contracts-grants/controllers/closeOutPlanController";
import { toast } from "sonner";
import { openDialog } from "store/ui";

export const closeOutPlanColumns: ColumnDef<ICloseOutPlanPaginatedData>[] = [
    {
        header: "Project Name",
        id: "project",
        accessorKey: "project",
        size: 250,
    },

    {
        header: "Donor",
        id: "donor",
        accessorKey: "project",
        size: 250,
        cell: ({ row }) => {
            const project = row.original.project as any;
            if (typeof project === 'object' && project?.funding_sources) {
                return (
                    <div className='flex gap-2 flex-wrap'>
                        {project.funding_sources.map((source: any) => (
                            <Badge key={source.id} className='bg-[#EBE8E1] text-[#1a0000ad]'>
                                {source.name}
                            </Badge>
                        ))}
                    </div>
                );
            }
            return <span>-</span>;
        },
    },

    {
        header: "Location",
        id: "location",
        accessorKey: "location",
        size: 250,
    },

    {
        header: "Status",
        id: "status",
        accessorKey: "status",
        size: 250,
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
        header: "Action",
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: ICloseOutPlanPaginatedData) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const dispatch = useAppDispatch();

    const { deleteCloseoutPlan, isLoading: isDeleteLoading } =
        useDeleteCloseoutPlan(id);

    const handleDelete = async () => {
        try {
            await deleteCloseoutPlan();
            toast.success("Close Out Plan Deleted");
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
                            href={CG_ROUTES.CLOSE_OUT_DETAILS.replace(':id', id)}
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
                                pathname: CG_ROUTES.NEW_CLOSE_OUT_PLAN,
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
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <DeleteIcon />
                            Delete
                        </Button>

                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type: DialogType.ChangeProjectStatusModal,
                                        dialogProps: {
                                            header: "Change Project Status",
                                            status,
                                            id,
                                        },
                                    })
                                );
                            }}
                        >
                            <PencilIcon />
                            Change Status
                        </Button>
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this close out plan?"
                loading={isDeleteLoading}
                onCancel={() => setIsDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

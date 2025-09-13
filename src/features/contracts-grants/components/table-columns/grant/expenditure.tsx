"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IExpenditurePaginatedData } from "@/features/contracts-grants/types/grants";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useParams } from "next/navigation";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useDeleteExpenditure } from "@/features/contracts-grants/controllers/expenditureController";
import { formatNumberCurrency } from "utils/utls";

export const expenditureColumns: ColumnDef<IExpenditurePaginatedData>[] = [
    {
        header: "Date",
        id: "date",
        accessorKey: "created_datetime",
        cell: ({ getValue }) => {
            const date = getValue() as string;
            return date ? new Date(date).toLocaleDateString("en-US") : "N/A";
        },
        size: 200,
    },

    {
        header: "Project",
        id: "project",
        accessorFn: ({ project_details }) => project_details?.title || "N/A",
        size: 200,
    },

    {
        header: "Activity",
        id: "work_plan_activity",
        accessorFn: ({ work_plan_activity_details, work_plan_activity }) => 
            work_plan_activity_details?.activity_name || (work_plan_activity ? `Activity: ${work_plan_activity.slice(0, 8)}...` : "N/A"),
        size: 200,
    },

    {
        header: "Amount Spent",
        id: "amount",
        accessorFn: ({ amount }) => formatNumberCurrency(amount, "USD"),
        size: 200,
    },
    {
        header: "Description",
        id: "description",
        accessorKey: "description",
        size: 200,
    },

    {
        header: "",
        id: "action",
        size: 80,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({
    id: expenditureId,
    ...rest
}: IExpenditurePaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const dispatch = useAppDispatch();

    const { id: grantId } = useParams();
    const processedGrantId = typeof grantId === 'string' ? grantId : Array.isArray(grantId) ? grantId[0] : "";

    const { deleteExpenditure, isLoading } = useDeleteExpenditure(processedGrantId, expenditureId);

    const handleDelete = async () => {
        try {
            await deleteExpenditure();
            toast.success("Expenditure Deleted");
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Something went wrong");
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
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type: DialogType.ExpenditureModal,
                                        dialogProps: {
                                            header: "Update Expenditure",
                                            width: "max-w-lg",
                                            grantId: processedGrantId,
                                            expenditure: {
                                                id: expenditureId,
                                                ...rest,
                                            },
                                        },
                                    })
                                );
                            }}
                        >
                            <PencilIcon />
                            Edit
                        </Button>
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
                title="Are you sure you want to delete this expenditure?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

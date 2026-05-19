import { ColumnDef } from "@tanstack/react-table";
import { TActivityCostSheet } from "@/features/programs/types/activity-cost-sheet";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { useDeleteActivityCostSheet } from "@/features/programs/controllers/activityCostSheetController";
import { toast } from "sonner";
import { useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export const costSheetSubActivitiesColumns = (
    activityId?: string,
    workPlanId?: string,
    activityPlanId?: string
): ColumnDef<TActivityCostSheet>[] => [
    {
        header: "Description",
        accessorKey: "description",
        size: 250,
        cell: ({ row }) => (
            <div className="text-sm">
                {row.original.description}
            </div>
        ),
    },
    {
        header: "Units",
        accessorKey: "units",
        size: 80,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.original.units}
            </div>
        ),
    },
    {
        header: "Days",
        accessorKey: "days",
        size: 80,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.original.days}
            </div>
        ),
    },
    {
        header: "Frequency",
        accessorKey: "frequency",
        size: 100,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.original.frequency}
            </div>
        ),
    },
    {
        header: "Rate (₦)",
        accessorKey: "rate_ngn",
        size: 150,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                ₦{Number(row.original.rate_ngn).toLocaleString()}
            </div>
        ),
    },
    {
        header: "Total Cost (₦)",
        accessorKey: "total_cost_ngn",
        size: 180,
        cell: ({ row }) => (
            <div className="text-right font-bold text-green-700">
                ₦{Number(row.original.total_cost_ngn).toLocaleString()}
            </div>
        ),
        footer: ({ table }) => {
            const total = table.getFilteredRowModel().rows.reduce(
                (sum, row) => sum + Number(row.original.total_cost_ngn || 0),
                0
            );
            return (
                <div className="text-right font-bold text-lg text-green-800">
                    ₦{total.toLocaleString()}
                </div>
            );
        },
    },
    {
        header: "Comments",
        accessorKey: "comments",
        size: 150,
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 line-clamp-2">
                {row.original.comments || "-"}
            </div>
        ),
    },
    {
        header: "",
        size: 100,
        id: "actions",
        cell: ({ row }) => <TableActions data={row.original} activityId={activityId} workPlanId={workPlanId} activityPlanId={activityPlanId} />,
    },
];

const TableActions = ({
    data,
    activityId,
    workPlanId,
    activityPlanId
}: {
    data: TActivityCostSheet;
    activityId?: string;
    workPlanId?: string;
    activityPlanId?: string;
}) => {
    const dispatch = useAppDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);
    const { deleteCostSheet, isLoading } = useDeleteActivityCostSheet(data.id);

    const handleEdit = () => {
        dispatch(
            openDialog({
                type: DialogType.ACTIVITY_COST_SHEET_MODAL,
                dialogProps: {
                    header: "Edit Sub-Activity",
                    width: "max-w-2xl",
                    costSheet: data,
                    activityId,
                    workPlanId,
                    activityPlanId,
                    isUnplanned: !!activityPlanId,
                    mode: "edit",
                },
            })
        );
    };

    const handleDelete = async () => {
        try {
            await deleteCostSheet();
            toast.success("Sub-activity deleted successfully");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete sub-activity");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="flex gap-1"
            >
                <Edit className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="flex gap-1 text-red-600 hover:text-red-700"
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <ConfirmationDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                title="Delete Sub-Activity"
                description="Are you sure you want to delete this sub-activity? This action cannot be undone."
                onConfirm={handleDelete}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isLoading}
            />
        </div>
    );
};

import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TWorkPlanPaginatedResponse } from "definations/program-types/work-plan";
import { useDeleteWorkPlan } from "@/features/programs/controllers/workPlanController";
import { RouteEnum } from "constants/RouterConstants";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import { formatNumberCurrency } from "utils/utls";

export const workPlanColumns: ColumnDef<TWorkPlanPaginatedResponse>[] = [
    {
        header: "Project Name",
        accessorKey: "project",
        size: 200,
    },
    {
        header: "Project Partners",
        accessorKey: "project_partners",
        accessorFn: (data) => `${data?.project_partners.join(", ")}`,
        size: 200,
    },
    {
        header: "Financial Year",
        accessorKey: "financial_year",
        size: 200,
    },
    {
        header: "Budget",
        accessorFn: ({ budget, currency }) =>
            formatNumberCurrency(budget, currency),
        size: 200,
    },
    {
        header: "",
        size: 80,
        id: "actions",
        cell: ({ row }) => <TableAction data={row.original} />,
    },
];

const TableAction = ({ data }: { data: TWorkPlanPaginatedResponse }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    // TanStack Query pattern - destructure from object, pass ID to hook
    const { deleteWorkPlan, isLoading } = useDeleteWorkPlan(data.id);

    const handleDeleteWorkPlan = async () => {
        try {
            await deleteWorkPlan();
            toast.success("Work Plan Deleted");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
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
                    <PopoverContent className=" w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link
                                className="w-full"
                                href={`/dashboard/programs/plan/work-plan/${data?.id}`}
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
                title="Are you sure you want to delete this work plan?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDeleteWorkPlan}
            />
        </div>
    );
};

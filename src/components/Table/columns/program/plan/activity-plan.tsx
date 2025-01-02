import { ColumnDef } from "@tanstack/react-table";
import { useDeleteActivityPlanMutation } from "services/programsApi/activity-plan";
import { format } from "date-fns";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { TActivityPlanData } from "definations/program-types/activity-plan";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import { useState } from "react";
import { toast } from "sonner";

export const activityPlanColumns: ColumnDef<TActivityPlanData>[] = [
    {
        header: "Project",
        accessorKey: "project",
        size: 150,
    },
    {
        header: "IR",
        accessorKey: "ir",
        size: 150,
    },
    {
        header: "Activity Code",
        accessorKey: "activity_code",
        size: 150,
    },
    {
        header: "Activity Description",
        accessorKey: "activity_description",
        size: 400,
    },
    {
        header: "Start Date",
        accessorKey: "start_date",
        accessorFn: (data) =>
            `${format(new Date(data.start_date), "dd MMM yyyy")}`,
        size: 150,
    },
    {
        header: "End Date",
        accessorKey: "end_date",
        accessorFn: (data) =>
            `${format(new Date(data.end_date), "dd MMM yyyy")}`,
        size: 150,
    },
    {
        header: "Responsible Person",
        accessorKey: "responsible_person",
        size: 200,
    },
    {
        header: "Resources/Vehicle Required",
        accessorFn: (data) => ` ${data?.is_resources_requied ? "YES" : "NO"}`,
        size: 200,
    },
    {
        header: "Memo Required",
        accessorFn: (data) => ` ${data?.is_memo_required ? "YES" : "NO"}`,
        size: 150,
    },
    {
        header: "EA Required",
        accessorFn: (data) => ` ${data?.is_ea_required ? "YES" : "NO"}`,
        size: 150,
    },
    {
        header: "Results Achieved",
        accessorKey: "is_results_achieved",
        accessorFn: (data) => ` ${data?.is_results_achieved ? "YES" : "NO"}`,
        size: 300,
    },
    {
        header: "Follow Up Action",
        accessorKey: "follow_up_action",
        size: 200,
    },
    {
        header: "Comments",
        accessorKey: "comments",
        size: 300,
    },

    {
        header: "",
        id: "actions",
        size: 300,
        cell: ({ row }) => <TableAction {...row.original} />,
    },
];

const TableAction = ({ id }: TActivityPlanData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteActivityPlan, { isLoading }] = useDeleteActivityPlanMutation();

    const handleDelete = async () => {
        try {
            await deleteActivityPlan(id).unwrap();
            toast.success("Activity Plan Deleted");
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
                    <PopoverContent className=" w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link
                                to={{
                                    pathname:
                                        RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
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
                open={dialogOpen}
                title="Are you sure you want to delete this activity plan?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

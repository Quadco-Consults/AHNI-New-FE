import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_ROUTES } from "constants/RouterConstants";
import { ICloseOutPlanPaginatedData } from "definations/c&g/closeout-plan";
import { useState } from "react";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { useDeleteCloseOutPlanMutation } from "services/c&g/closeout-plan";
import { closeoutPlanAPis } from "services/cAndGApi/closeOutPlan";
import { toast } from "sonner";

export const closeOutPlanColumns: ColumnDef<ICloseOutPlanPaginatedData>[] = [
    {
        header: "Project Name",
        id: "project",
        accessorKey: "project",
        size: 250,
    },
    {
        header: "Department",
        id: "department",
        accessorKey: "department",
        size: 250,
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
        cell: ({ row }) => row.original.status,
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

    const [deleteCloseOutPlan, { isLoading: isDeleteLoading }] =
        useDeleteCloseOutPlanMutation();

    const handleDelete = async () => {
        try {
            await deleteCloseOutPlan(id).unwrap();
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
                            to={generatePath(CG_ROUTES.CLOSE_OUT_DETAILS, {
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
                            to={{
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

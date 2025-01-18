import { Link, generatePath } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { toast } from "sonner";
import EditIcon from "components/icons/EditIcon";
import { useDeleteProjectMutation } from "services/project";
import PencilIcon from "components/icons/PencilIcon";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { useState } from "react";
import { TProjectData } from "definations/project";

export const projectColumns: ColumnDef<TProjectData>[] = [
    {
        header: "Title",
        accessorKey: "title",
        size: 250,
    },
    {
        header: "Project ID",
        accessorKey: "project_id",
        size: 200,
    },
    {
        header: "Start Date",
        accessorKey: "start_date",
        size: 130,
    },
    {
        header: "End Date",
        accessorKey: "end_date",
        size: 130,
    },
    {
        header: "Status",
        accessorKey: "status",
        size: 100,
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
        header: "Budget",
        accessorFn: (data) => {
            const currency = data.currency === "NGN" ? "₦" : "$";
            return `${currency}${data.budget}`;
        },
        size: 120,
    },
    {
        header: "Funding Source",
        accessorKey: "funding_sources",
        cell: ({ row }) => (
            <ProjectFundingSource data={row.original.funding_sources} />
        ),
        size: 300,
    },
    {
        header: "Project Manager",
        accessorKey: "project_manager",
        size: 200,
        cell: ({ row }) =>
            row.original.project_managers
                .map((el) => `${el.first_name} ${el.last_name}`)
                .join(", "),
    },
    {
        header: "Outcome/Impact",
        accessorKey: "goal",
        size: 250,
    },
    {
        header: "Budget Performance",
        accessorKey: "budget_performance",
        size: 250,
    },
    {
        header: "Achievement Against Target",
        accessorKey: "achievement_against_target",
        size: 250,
    },
    {
        header: "Beneficiaries",
        cell: ({ row }) => (
            <ProjectBeneficiaries data={row.original.beneficiaries} />
        ),
        size: 300,
    },
    {
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const ProjectBeneficiaries = ({ data }: any) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {data?.map((el: any) => (
                <Badge key={el.id} className="bg-[#EBE8E1] text-[#1a0000ad]">
                    {el.name}
                </Badge>
            ))}
        </div>
    );
};

const ProjectFundingSource = ({ data }: any) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {data?.map((el: any) => (
                <Badge key={el.id} className="bg-[#EBE8E1] text-[#1a0000ad]">
                    {el.name}
                </Badge>
            ))}
        </div>
    );
};

const TableMenu = ({ id, status }: TProjectData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteProject, { isLoading }] = useDeleteProjectMutation();
    const dispatch = useAppDispatch();

    const handleDeleteProject = async () => {
        try {
            await deleteProject({
                path: { id },
            }).unwrap();
            toast.success("Project deleted.");
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
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
                                to={generatePath(RouteEnum.PROJECTS_DETAILS, {
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
                                    pathname: RouteEnum.PROJECTS_CREATE_SUMMARY,
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
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        openDialog({
                                            type: DialogType.ChangeProjectStatusModal,
                                            dialogProps: {
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
                title="Are you sure you want to delete this project?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDeleteProject}
            />
        </div>
    );
};

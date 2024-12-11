import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import DataTable from "components/Table/DataTable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { TActivityPlanResponse } from "definations/program-types/activity-plan";
import {
    useDeleteActivityPlanMutation,
    useGetAllActivityPlansQuery,
    useLazyDownloadActivityPlanTemplateQuery,
} from "services/programsApi/activity-plan";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import UploadIcon from "components/icons/UploadIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { toast } from "sonner";
import { format } from "date-fns";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConsultancyShortlisMetric from "pages/protectedPages/candg/consultancy/ConsultancyShortlisMetric";
import ConsultancyScopeOfWorkDetails from "pages/protectedPages/candg/consultancy/ConsultancyScopeOfWorkDetails";
import { DownloadIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";

const ActivityPlan = () => {
    const { data, isLoading } = useGetAllActivityPlansQuery({
        no_paginate: false,
    });

    const [downloadTemplate] = useLazyDownloadActivityPlanTemplateQuery();

    const handleDownloadTemplate = async () => {
        try {
            const response = await downloadTemplate(null).unwrap();

            const blob = new Blob([response], {
                type: "application/vnd.ms-excel",
            });

            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "activity_plan_template.xlsx";

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error: any) {
            console.log(error);
            toast.error(error.data.message || "Something went wrong");
        }
    };

    const dispatch = useAppDispatch();

    const columns = useMemo<ColumnDef<TActivityPlanResponse>[]>(
        () => [
            {
                header: "Project",
                accessorKey: "project",
                size: 150,
            },
            {
                header: "Objectives",
                accessorKey: "objectives",
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
                accessorKey: "is_resources_requied",
                accessorFn: (data) =>
                    `${String(data.is_resources_requied).toUpperCase()}`,
                size: 200,
            },
            {
                header: "Memo Required",
                accessorKey: "is_memo_required",
                accessorFn: (data) =>
                    `${String(data.is_memo_required).toUpperCase()}`,
                size: 150,
            },
            {
                header: "EA Required",
                accessorFn: (data) =>
                    `${String(data.is_ea_required).toUpperCase()}`,
                size: 150,
            },
            {
                header: "Results Achieved",
                accessorKey: "is_results_achieved",
                accessorFn: (data) =>
                    `${String(data.is_results_achieved).toUpperCase()}`,
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
                cell: ({ cell }) => <TableAction data={cell.row.original} />,
            },
        ],
        []
    );

    const TableAction = ({ data }: { data: TActivityPlanResponse }) => {
        const [dialogOpen, setDialogOpen] = useState(false);

        const [deleteActivityPlan, { isLoading }] =
            useDeleteActivityPlanMutation();

        const handleDelete = async () => {
            try {
                await deleteActivityPlan(data.id).unwrap();
                toast.success("Activity Plan Deleted");
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
                        <PopoverContent className=" w-fit">
                            <div className="flex flex-col items-start justify-between gap-1">
                                <Link
                                    to={{
                                        pathname:
                                            RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
                                        search: `?id=${data.id}`,
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

    return (
        <div className="space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Programs</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Plans</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Activity Plan</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex gap-2 py-6 w-40">
                            Actions
                            <ArrowDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link to={RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN}>
                                <Button
                                    className="flex gap-2 py-6"
                                    variant="ghost"
                                    type="button"
                                >
                                    <AddSquareIcon fillColor="#FF0000" />
                                    Create Manually
                                </Button>
                            </Link>

                            <Button
                                className="flex gap-2 py-6"
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        openDialog({
                                            type: DialogType.ActivityUpload,
                                            dialogProps: {
                                                header: "Upload An Activity",
                                                width: "max-w-lg",
                                            },
                                        })
                                    );
                                }}
                            >
                                <UploadIcon />
                                Upload Activity Plan
                            </Button>

                            <Button
                                className="flex items-center gap-2 justify-start"
                                variant="ghost"
                                onClick={handleDownloadTemplate}
                            >
                                <DownloadIcon className="text-green-500" />
                                Download Template
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Card className="space-y-5">
                <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 border-none w-[350px] bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={data?.data.results || []}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Card>
        </div>
    );
};

export default ActivityPlan;

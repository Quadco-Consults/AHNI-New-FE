import { generatePath, Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import {
    useDeleteWorkPlanMutation,
    useGetAllWorkPlanQuery,
    useLazyDownloadWorkPlanTemplateQuery,
} from "services/programsApi/work-plan";
import { TWorkPlanPaginatedResponse } from "definations/program-types/work-plan";
import DataTable from "components/Table/DataTable";
import { RouteEnum } from "constants/RouterConstants";
import { toast } from "sonner";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { DownloadIcon } from "lucide-react";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Work Plan", icon: false },
];

export default function WorkPlan() {
    const [page, setPage] = useState(1);

    const dispatch = useAppDispatch();
    const [downloadTemplate] = useLazyDownloadWorkPlanTemplateQuery();

    const { data: workPlan, isLoading } = useGetAllWorkPlanQuery({
        page,
        size: 10,
    });

    const handleDownloadTemplate = async () => {
        try {
            const response = await downloadTemplate(null).unwrap();

            const blob = new Blob([response], {
                type: "application/vnd.ms-excel",
            });

            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "work_plan_template.xlsx";

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

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
                            <Button
                                variant="ghost"
                                className="flex gap-2 py-6"
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        openDialog({
                                            type: DialogType.WorkPlanUpload,
                                            dialogProps: {
                                                header: "Upload New Work plan",
                                                width: "max-w-lg",
                                            },
                                        })
                                    );
                                }}
                            >
                                <AddSquareIcon />
                                Upload New Work Plan
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
                            className="ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={workPlan?.data.results || []}
                    columns={columns}
                    isLoading={isLoading}
                    pagination={{
                        total: workPlan?.data.pagination.count ?? 0,
                        pageSize: workPlan?.data.pagination.page_size ?? 0,
                        onChange: (page: number) => setPage(page),
                    }}
                />
            </Card>
        </div>
    );
}

const columns: ColumnDef<TWorkPlanPaginatedResponse>[] = [
    {
        header: "Project Name",
        accessorKey: "project",
        size: 300,
    },
    {
        header: "Project Partners",
        accessorKey: "project_partners",
        accessorFn: (data) => `${data?.project_partners.join(", ")}`,
        size: 300,
    },
    {
        header: "Financial Year",
        accessorKey: "financial_year",
        // accessorFn: (data) => `${data?.}`,
        size: 200,
    },
    {
        header: "Budget ($)",
        accessorKey: "budget_unit_cost_ngn",
        accessorFn: (data) => `$${data.budget_unit_cost_ngn}`,
        size: 150,
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

    const [deleteWorkPlan, { isLoading }] = useDeleteWorkPlanMutation();

    const handleDeleteWorkPlan = async () => {
        try {
            await deleteWorkPlan(data.id).unwrap();
            toast.success("Work Plan Deleted");
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
                                className="w-full"
                                to={generatePath(
                                    RouteEnum.PROGRAM_WORK_PLAN_DETAILS,
                                    { id: data?.id }
                                )}
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

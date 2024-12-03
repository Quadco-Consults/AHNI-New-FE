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
import { useMemo } from "react";
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
} from "services/programsApi/work-plan";
import { TWorkPlanPaginatedResponse } from "definations/program-types/work-plan";
import DataTable from "components/Table/DataTable";
import { RouteEnum } from "constants/RouterConstants";
import { toast } from "sonner";

const WorkPlan = () => {
    const dispatch = useAppDispatch();

    const { data, isLoading } = useGetAllWorkPlanQuery({ no_paginate: false });

    const columns = useMemo<ColumnDef<TWorkPlanPaginatedResponse>[]>(
        () => [
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
                cell: ({ row }) => <ActionListAction data={row.original} />,
            },
        ],
        []
    );

    const ActionListAction = ({
        data,
    }: {
        data: TWorkPlanPaginatedResponse;
    }) => {
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
                                    onClick={handleDeleteWorkPlan}
                                >
                                    <DeleteIcon />
                                    Delete
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
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
                        <BreadcrumbPage>Work Plan</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-end">
                <Button
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
                    data={data?.data.results || []}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Card>
        </div>
    );
};

export default WorkPlan;

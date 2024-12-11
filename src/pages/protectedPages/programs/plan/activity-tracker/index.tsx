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
import { useMemo, useState } from "react";
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
import { RouteEnum } from "constants/RouterConstants";

import {
    useDeleteActivityTrackerMutation,
    useGetAllActivityTrackerQuery,
} from "services/programsApi/activity-tracker";

import { TActivityTrackerResult } from "definations/program-types/activity-tracker";
import { Badge } from "components/ui/badge";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { useDeleteActivityPlanMutation } from "services/programsApi/activity-plan";
import { toast } from "sonner";

export default function ActivityTracker() {
    const { data, isLoading } = useGetAllActivityTrackerQuery({
        no_paginate: false,
    });

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
                        <BreadcrumbPage>Activity Tracker</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

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
}

const columns: ColumnDef<TActivityTrackerResult>[] = [
    {
        header: "Activity Name",
        accessorKey: "activity_name",
        size: 300,
    },
    {
        header: "Activity Reference Number (As in WP)",
        accessorKey: "activity_reference_number",
        size: 200,
    },

    {
        header: "Month",
        accessorKey: "month",
        size: 200,
    },

    {
        header: "Activities Plans for the Month",
        accessorKey: "activity_plans",
        size: 300,
    },

    {
        header: "Location",
        accessorKey: "location",
        size: 150,
    },

    {
        header: "Lead Dept",
        accessorKey: "lead_dept",
        size: 150,
    },

    {
        header: "Lead Partner",
        accessorKey: "lead_partner",
        size: 150,
    },

    {
        header: "Frq. of Activity",
        accessorKey: "",
        size: 150,
    },

    {
        header: "Planned Output",
        accessorKey: "planned_output",
        size: 300,
    },

    {
        header: "Description of Output",
        accessorKey: "output_description",
        size: 300,
    },

    {
        header: "Achieved Output",
        accessorKey: "achieved_output",
        size: 300,
    },

    {
        header: "% Achievement",
        accessorFn: (data) => `${data.achievement_percentage ?? 0}%`,
        size: 150,
    },

    {
        header: "Status",
        accessorKey: "status",
        size: 150,
        cell: ({ getValue }) => {
            const status = getValue();

            return (
                <Badge
                    className={`${
                        status === "PENDING" ? "bg-yellow-500" : "bg-green-500"
                    }`}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },

    {
        header: "Total NGN",
        accessorKey: "total_amount_ngn",
        size: 150,
    },

    {
        header: "Total USD",
        accessorKey: "total_amount_usd",
        size: 150,
    },

    {
        header: "Amount Expended (NGN)",
        accessorKey: "amount_expended_ngn",
        size: 150,
    },

    {
        header: "Amount Expended (USD)",
        accessorKey: "amount_expended_usd",
        size: 150,
    },

    {
        header: "Implementation USD Rate",
        accessorKey: "implementation_usd_rate",
        size: 150,
    },

    {
        header: "Expenditure Rate (NGN)",
        accessorKey: "expenditure_ngn_rate",
        size: 150,
    },

    {
        header: "Expenditure Rate (USD)",
        accessorKey: "expenditure_usd_rate",
        size: 150,
    },

    {
        header: "Variance (NGN)",
        accessorKey: "variance_ngn",
        size: 150,
    },

    {
        header: "Variance (USD)",
        accessorKey: "variance_usd",
        size: 150,
    },

    {
        header: "% of Variance (NGN)",
        accessorFn: (data) => `${data.percentage_variance_ngn ?? 0}%`,
        size: 150,
    },

    {
        header: "% ofVariance (USD)",
        accessorFn: (data) => `${data.percentage_variance_usd ?? 0}%`,
        size: 150,
    },

    {
        header: "Efficiency Output vs Expenditure (Ratio)",
        accessorKey: "efficiency_output_expenditure_ratio",
        size: 150,
    },

    {
        header: "Efficiency Output vs Expenditure (Level)",
        accessorKey: "efficiency_output_expenditure_level",
        size: 150,
    },

    {
        header: "Comments (e.g Provide reasons for non completion, variance)",
        accessorKey: "comments",
        size: 300,
    },

    {
        header: "",
        size: 80,
        id: "actions",
        cell: ({ row }) => <ActionListAction data={row.original} />,
    },
];

const ActionListAction = ({ data }: { data: TActivityTrackerResult }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteWorkPlanTracker, { isLoading }] =
        useDeleteActivityTrackerMutation();

    const handleDeleteWorkPlanTracker = async () => {
        try {
            await deleteWorkPlanTracker(data.id).unwrap();
            toast.success("Work Plan Tracker Deleted");
            setDialogOpen(false);
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
                                to={{
                                    pathname:
                                        RouteEnum.PROGRAM_ACTIVITY_TRACKER_CREATE,
                                    search: `?id=${data?.id}`,
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
                title="Are you sure you want to delete this work plan tracker?"
                onCancel={() => setDialogOpen(false)}
                onOk={handleDeleteWorkPlanTracker}
                loading={isLoading}
            />
        </div>
    );
};

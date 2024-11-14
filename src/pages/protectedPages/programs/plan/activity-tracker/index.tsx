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
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import DataTable from "components/Table/DataTable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { WorkPlanList } from "definations/program-types/program-workplan";
import WorkPlanAPi from "services/programsApi/work-plan";
import { RouteEnum } from "constants/RouterConstants";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import UploadIcon from "components/icons/UploadIcon";

export default function ActivityTracker() {
    const dispatch = useAppDispatch();

    const workPlanQueryResult = WorkPlanAPi.useGetWorkPlansListQuery();

    const data = workPlanQueryResult?.data?.results;

    const columns = useMemo<ColumnDef<WorkPlanList>[]>(
        () => [
            {
                header: "Activity Name",
                accessorKey: "activity_name",
                size: 300,
            },
            {
                header: "Activity Reference Number (As in WP)",
                accessorKey: "activity_number",
                size: 200,
            },
            {
                header: "Month",
                accessorKey: "month",
                // accessorFn: (data) => `${data?.financial_year?.year}`,
                size: 200,
            },
            {
                header: "Activities Plan for the Month",
                accessorKey: "activities_plan",
                size: 150,
            },
            {
                header: "Objectives",
                accessorKey: "objectivies",
                size: 150,
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
                header: "Sub-Objective",
                accessorKey: "subobjectives",
                size: 150,
            },
            {
                header: "Frq. of Activity",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Planned Output",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Description of Output",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Achieved Output",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "% Achievement",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Status",
                accessorKey: "status",
                size: 150,
            },
            {
                header: "Total NGN",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Total USD",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Amount Expected (NGN)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Implementation USD Rate",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Amount Expended (USD)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Expenditure Rate (USD)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Variance (NGN)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Variance (USD)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "% of Variance (NGN)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "% ofVariance (USD)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Efficiency Output vs Expenditure (Ratio)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Efficiency Output vs Expenditure (Level)",
                accessorKey: "objectivies",
                size: 150,
            },
            {
                header: "Comments (e.g Provide reasons for non completion, variance)",
                accessorKey: "objectivies",
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

    const ActionListAction = ({ data }: any) => {
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
                                    to={`/program/plan/work-plan/${
                                        data.partner_id
                                    }/${data.project_id}/${encodeURIComponent(
                                        data.financial_year.id
                                    )}`}
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
                        <BreadcrumbPage>Activity Tracker</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex gap-2 py-6">
                            <AddSquareIcon />
                            New Activity Tracker
                            <ArrowDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Button
                                className="w-full flex items-center gap-2 justify-start"
                                variant="ghost"
                                onClick={() =>
                                    dispatch(
                                        openDialog({
                                            type: DialogType.ActivityTrackerModal,
                                            dialogProps: {
                                                header: "Upload An Activity Tracker",
                                                ...mediumDailogScreen,
                                            },
                                        })
                                    )
                                }
                            >
                                <UploadIcon /> Upload
                            </Button>
                            <Link
                                className="w-full"
                                to={generatePath(
                                    RouteEnum.PROGRAM_ACTIVITY_TRACKER_CREATE
                                )}
                            >
                                <Button
                                    className="w-full flex items-center gap-2 justify-start"
                                    variant="ghost"
                                >
                                    <AddSquareIcon fillColor="#FF0000" /> Create
                                    manually
                                </Button>
                            </Link>
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
                            className="ml-2 h-6 border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={data || []}
                    columns={columns}
                    isLoading={workPlanQueryResult?.isLoading}
                />
            </Card>
        </div>
    );
}

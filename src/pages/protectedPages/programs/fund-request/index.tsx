import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import ApproveIcon from "components/icons/ApproveIcon";
import DataTable from "components/Table/DataTable";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import FundRequestAPI from "services/programsApi/fund-request";
import { FundRequestResultsData } from "definations/program-types/fund-request";
import BreadcrumbCard from "components/shared/Breadcrumb";

const data = [
    {
        project__title: "Test Project Title",
        state: "Abuja",
        project_id: "123456",
        month_year: "Jan 2025",
        project__start_date: "12th Jan 2025",
        project__end_date: "12th Jan 2025",
        project__status: "PENDING",
    },
];

const FundRequest = () => {
    const dispatch = useAppDispatch();

    const { data: dataaa, isLoading } =
        FundRequestAPI.useGetFundRequestByProjectQuery();

    const columns = useMemo<ColumnDef<FundRequestResultsData>[]>(
        () => [
            {
                header: "Project Title",
                accessorKey: "project__title",
                size: 150,
            },
            {
                header: "State",
                accessorKey: "state",
                size: 100,
            },
            {
                header: "PROJECT ID",
                accessorKey: "project_id",
                size: 200,
            },
            {
                header: "Month/Year",
                accessorKey: "month_year",
                size: 150,
            },
            {
                header: "Project Start Date",
                accessorKey: "project__start_date",
                size: 200,
            },
            {
                header: "Project End Date",
                accessorKey: "project__end_date",
                size: 200,
            },
            {
                header: "Approval Stage",
                accessorKey: "project__status",
                size: 200,
                cell: ({ getValue }) => {
                    return (
                        <Badge
                            variant="default"
                            className={cn(
                                "p-1 rounded-lg",
                                getValue() === "APPROVED" &&
                                    "bg-green-50 text-green-500",
                                getValue() === "REJECT" &&
                                    "bg-red-50 text-red-500",
                                getValue() === "PENDING" &&
                                    "bg-yellow-50 text-yellow-500",
                                getValue() === "ON_HOLD" &&
                                    "text-grey-50 bg-grey-500"
                            )}
                        >
                            {getValue() as string}
                        </Badge>
                    );
                },
            },
            {
                header: "",
                id: "actions",
                size: 80,
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
                                    to={`/program/fund-request/${
                                        data?.project_id
                                    }/${encodeURIComponent(data?.project_id)}`}
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
                                    onClick={() => {
                                        dispatch(
                                            openDialog({
                                                type: DialogType.SspApproveModal,
                                                dialogProps: {
                                                    header: "Request Approval",
                                                    width: "max-w-2xl",
                                                },
                                            })
                                        );
                                    }}
                                >
                                    <ApproveIcon />
                                    Approve
                                </Button>
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <DeleteIcon />
                                    delete
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            </div>
        );
    };

    const breadcrumbs = [
        { name: "Procurement", icon: true },
        { name: "Fund Request", icon: false },
    ];

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Link to={RouteEnum.PROGRAM_FUND_REQUEST_CREATE}>
                    <Button className="flex gap-2 py-6">
                        <AddSquareIcon />
                        New Fund Request
                    </Button>
                </Link>
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
                    // data={data?.results || []}
                    data={data}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Card>
        </div>
    );
};

export default FundRequest;

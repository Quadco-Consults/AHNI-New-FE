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
import { TWorkPlanPaginatedResponse } from "definations/program-types/work-plan";
import DataTable from "components/Table/DataTable";
import { RouteEnum } from "constants/RouterConstants";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import UploadIcon from "components/icons/UploadIcon";
import BreadcrumbCard from "components/shared/Breadcrumb";

const breadcrumbs = [
    { name: "Admin", icon: true },
    { name: "Travel Expenses Report", icon: false },
];

export default function TravelExpensesReportHomePage() {
    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Button className="flex gap-2 py-6 w-40">
                    <AddSquareIcon />
                    Add TER
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

                <DataTable data={[]} columns={columns} isLoading={false} />
            </Card>
        </div>
    );
}

const columns: ColumnDef<TWorkPlanPaginatedResponse>[] = [
    {
        header: "Name",
        size: 200,
    },

    {
        header: "Staff ID No",
        size: 200,
    },

    {
        header: "Date Submitted",
        size: 200,
    },

    {
        header: "Purpose of Travel",
        size: 200,
    },

    {
        header: "Status",
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
                                <UploadIcon />
                                Download
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
                title="Are you sure you want to delete this work plan?"
                loading={false}
                onCancel={() => setDialogOpen(false)}
                onOk={() => {}}
            />
        </div>
    );
};

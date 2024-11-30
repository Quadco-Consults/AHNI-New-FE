import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";

import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";

import EyeIcon from "components/icons/EyeIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { ChevronDown } from "lucide-react";

type projectData = {
    date: string;
    description: string;
    user: string;
    time: string;
};

const data: projectData[] = Array(10).fill({
    date: "10/04/2023",
    description: "Project is being suspended",
    user: "Admin",
    time: "12:00 AM",
});

const Activity = () => {
    const columns: ColumnDef<projectData>[] = [
        {
            header: "Date",
            accessorKey: "date",
            size: 150,
        },
        {
            header: "Description",
            accessorKey: "description",
            size: 200,
        },
        {
            header: "User",
            accessorKey: "user",
            size: 200,
        },
        {
            header: "Time",
            accessorKey: "time",
            size: 200,
        },
        {
            header: "",
            id: "actions",
            cell: ({ row }) => <ActionListAction data={row.original} />,
        },
    ];

    const ActionListAction = ({ data }: any) => {
        console.log(data);
        return (
            <div className="flex items-center gap-2">
                <>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="flex gap-2 py-6">
                                <ChevronDown />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className=" w-fit">
                            <div className="flex flex-col items-start justify-between gap-1">
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <EyeIcon />
                                    View
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            </div>
        );
    };

    return (
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

            <DataTable data={data} columns={columns} isLoading={false} />
        </Card>
    );
};

export default Activity;

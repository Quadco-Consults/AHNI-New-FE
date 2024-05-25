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

type WorkPlanData = {
  projectTitle: string;
  state: string;
  projectID: string;
  year: string;
  projectStartDate: string;
  projectEndDate: string;
  status: string;
};

const data: WorkPlanData[] = Array(10).fill({
  projectTitle: "ACEBAY",
  state: "Lagos",
  projectID: "1111.0004-ACE",
  year: "02/2024",
  projectStartDate: "10/04/2023",
  projectEndDate: "10/04/2023",
  status: "Pending",
});

const FundRequest = () => {
  const columns = useMemo<ColumnDef<WorkPlanData>[]>(
    () => [
      {
        header: "Project Title",
        accessorKey: "projectTitle",
        size: 150,
      },
      {
        header: "State",
        accessorKey: "state",
        size: 150,
      },
      {
        header: "PROJECT ID",
        accessorKey: "projectID",
        size: 200,
      },
      {
        header: "Month/Year",
        accessorKey: "year",
        size: 150,
      },
      {
        header: "Project Start Date",
        accessorKey: "projectStartDate",
        size: 200,
      },
      {
        header: "Project End Date",
        accessorKey: "projectEndDate",
        size: 200,
      },
      {
        header: "Status",
        accessorKey: "status",
        size: 150,
        cell: ({ getValue }) => {
          return (
            <Badge
              variant="default"
              className={cn(
                "p-1 rounded-lg",
                getValue() === "Approved" && "bg-green-50 text-green-500",
                getValue() === "Reject" && "bg-red-50 text-red-500",
                getValue() === "Pending" &&
                  "bg-yellow-200 text-yellow-800 text-yellow-500",
                getValue() === "On Hold" && "text-grey-50 bg-grey-500"
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
        cell: ({ row }) => <ActionListAction data={row.original} />,
      },
    ],
    []
  );

  const ActionListAction = ({ data }: any) => {
    console.log(data);
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
                  to={generatePath(RouteEnum.PROGRAM_FUND_REQUEST_DETAILS, {
                    id: "1",
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
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
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

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button className="flex gap-2 py-6">
          <AddSquareIcon />
          New Fund Request
        </Button>
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

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default FundRequest;

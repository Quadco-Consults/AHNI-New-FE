import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import useTable from "hooks/useTables";
import Table from "lib/react-table/Table";
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

type WorkPlanData = {
  facility: string;
  state: string;
  lga: string;
  year: string;
  status: string;
};

const data: WorkPlanData[] = Array(10).fill({
  facility: "ACEBAY",
  state: "Lagos",
  lga: "Surulere",
  year: "02/2024",
  status: "Pending",
});

const SupportiveSupervisionPlan = () => {
  const columns = useMemo<ColumnDef<WorkPlanData>[]>(
    () => [
      {
        header: "Facility",
        accessorKey: "facility",
        size: 200,
      },
      {
        header: "State",
        accessorKey: "state",
        size: 200,
      },
      {
        header: "LGA",
        accessorKey: "lga",
        size: 200,
      },
      {
        header: "Month/Year",
        accessorKey: "year",
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
                getValue() === "Approved" && "bg-green-light text-green-dark",
                getValue() === "Reject" && "bg-red-light text-red-dark",
                getValue() === "Pending" && "bg-yellow-200 text-yellow-dark",
                getValue() === "On Hold" && "text-grey-light bg-grey-dark"
              )}
            >
              {getValue()}
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
                  to={generatePath(
                    RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAIL,
                    {
                      id: "1",
                    }
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

  const tableInstance = useTable({
    columns,
    data,
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button className="flex gap-2 py-6">
          <AddSquareIcon />
          New Supervision plan
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
        <Table
          instance={tableInstance}
          // loading={customersQueryResult.isFetching}
          // error={customersQueryResult.isError}
          // onReload={customersQueryResult.refetch}
        />
      </Card>
    </div>
  );
};

export default SupportiveSupervisionPlan;

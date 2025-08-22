import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { TimesheetResults } from "definations/hr-types/timesheet";
import { Badge } from "components/ui/badge";

const TimesheetManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-start gap-2">
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
        <Link href={HrRoutes.TIMESHEET_MANAGEMENT_CREATE}>
          <Button>
            <AddSquareIcon /> Create Timesheet
          </Button>
        </Link>
      </div>
      <div>
        <Button variant="outline" className="border-yellow-500">
          Weekly
        </Button>
      </div>
      <Card>
        <DataTable data={data} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default TimesheetManagement;

const data = Array(5).fill({
  employee: "Sarah Smith",
  projects: [
    "ACEBAY - (11:12 hrs)",
    "ACE Cluster 5 - (16:00 hrs)",
    "Plane - (0:30 hrs)",
  ],
  hours: "40",
});

const columns: ColumnDef<TimesheetResults>[] = [
  {
    id: "select",
    size: 80,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "Employee",
    accessorKey: "employee",
    size: 200,
  },
  {
    header: "Projects",
    id: "position",
    cell: ({ row }) => <ProjectList data={row} />,
    size: 300,
  },
  {
    header: "Total Hours ",
    id: "hours",
    accessorFn: (data) => `${data?.hours} Hours`,
    size: 200,
  },
  {
    header: "Actions",
    id: "actions",
    size: 50,
    cell: () => <ActionList />,
  },
];

const ProjectList = ({ data }: { data: Row<TimesheetResults> }) => {
  return (
    <div className="flex items-center gap-2">
      {data?.original?.projects?.map((project, index) => (
        <Badge variant="darkYellow" key={index}>
          {project}
        </Badge>
      ))}
    </div>
  );
};

const ActionList = () => {
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
                href={generatePath(HrRoutes.TIMESHEET_MANAGEMENT_DETAIL, {
                  id: 1,
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

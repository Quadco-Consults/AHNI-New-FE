import { ColumnDef } from "@tanstack/react-table";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ApproveIcon from "components/icons/ApproveIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import SearchIcon from "components/icons/SearchIcon";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { HrRoutes } from "constants/RouterConstants";
import { TOnboarding } from "definations/hr-types/hr";
import { generatePath, Link } from "react-router-dom";

const WorkforceDatabase = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link to={HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO}>
          <Button>
            <AddSquareIcon /> Add New Employee
          </Button>
        </Link>
      </div>
      <Card className="space-y-4">
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

        <DataTable data={data} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default WorkforceDatabase;

const data: TOnboarding[] = Array(5).fill({
  staff_name: "James Septimus",
  position: "Technical Associate",
  employment_type: "Technical Associate",
  email: "Technical Associate",
});

const columns: ColumnDef<TOnboarding>[] = [
  {
    header: "Staff_name",
    accessorKey: "staff_name",
    size: 150,
  },
  {
    header: "Position",
    accessorKey: "position",
    size: 100,
  },
  {
    header: "Employment Type",
    accessorKey: "employment_type",
    size: 130,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 130,
  },
  {
    header: "Action",
    id: "actions",
    size: 50,
    cell: () => <ActionList />,
  },
];

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
                to={generatePath(HrRoutes.WORKFORCE_DATABASE_DETAIL, { id: 1 })}
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
                Approval
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

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { AdvertisementResults } from "definations/hr-types/advertisement";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import ScanIcon from "components/icons/ScanIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";

const ApplicationsTable = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ApplicationsTable;

const data = [
  {
    name: "James Septimus",
    position: "Technical Associate",
    type: "Technical Associate",
    status: "Applied",
    email: "jamesseptimus@gmail.com",
  },
  {
    name: "James Septimus",
    position: "Technical Associate",
    type: "Technical Associate",
    status: "Shortlisted",
    email: "jamesseptimus@gmail.com",
  },
];

const columns: ColumnDef<AdvertisementResults>[] = [
  {
    id: "select",
    size: 50,
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
    header: "Application Name",
    accessorKey: "name",
    size: 250,
  },
  {
    header: "Position Applied",
    accessorKey: "position",
    size: 200,
  },
  {
    header: "Employment type",
    accessorKey: "type",
    size: 250,
  },
  {
    header: "Applicant Email",
    accessorKey: "email",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Applied"
              ? "bg-green-50 text-green-500"
              : "bg-yellow-50 text-yellow-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 100,
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
                to={generatePath(HrRoutes.ADVERTISEMENT_DETAIL_SUB_APP, {
                  id: 1,
                  appID: 2,
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
                <ScanIcon />
                Interview
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

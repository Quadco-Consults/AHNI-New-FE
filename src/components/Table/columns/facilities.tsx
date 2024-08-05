import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";
import { Badge } from "components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";

export interface MaintenanceData {
  facility: string;
  maintenance_type: string;
  description_of_problem: string;
  status: string;
  // Add a property for the checkbox state
  action: boolean;
  id: string;
}

// eslint-disable-next-line react-refresh/only-export-components
const Action = ({ row }: { row: MaintenanceData }) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger>
          <MoreIcon />
        </PopoverTrigger>
        <PopoverContent className="w-32 py-1 space-y-2">
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
            <Link to={`${AdminRoutes.FacilitiesView}?to=${row.id}`}>View</Link>
          </div>
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
            <AlertDialog>
              <AlertDialogTrigger>Delete</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const maintenanceColumns: ColumnDef<MaintenanceData>[] = [
  {
    header: "Facility",
    accessorKey: "facility",
  },
  {
    header: "Description",
    accessorKey: "description_of_problem",
  },

  {
    header: "Maintenance Type",
    accessorKey: "maintenance_type",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          variant={
            getValue<string>().toLowerCase() === "pending"
              ? "secondary"
              : "success"
          }
        >
          {getValue<string>()}
        </Badge>
      );
    },
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => <Action row={row.original} />,
  },
];

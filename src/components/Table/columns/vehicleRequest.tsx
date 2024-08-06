import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { AdminRoutes } from "constants/RouterConstants";
import { useNavigate } from "react-router-dom";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  gender: string;
  designation: string | null;
}

interface Location {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  city: string | null;
  state: string;
  email: string | null;
  phone: string | null;
}

export interface IVehicleRequest {
  id: string;
  approved_vehicles: any[];
  created_at: string;
  updated_at: string;
  supervisor: string;
  point_of_departure: string;
  destination: string;
  request_date: string;
  departure_date: string;
  return_date: string;
  status: string;
  recommendations: string;
  approved_by: string | null;
  requesting_staff: TeamMember;
  location: Location;
  team_members: TeamMember[];
}
// eslint-disable-next-line react-refresh/only-export-components
const MoreAction = ({ row }: { row: IVehicleRequest }) => {
  const navigate = useNavigate();
  const onSelecteion = () => {
    navigate(AdminRoutes.ViewVehicleRequest);
    sessionStorage.setItem("vehicle_request", row.id);
  };
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuItem
            className="cursor-pointer "
            onClick={() => onSelecteion()}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer ">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export const vehicleRequestColumns: ColumnDef<IVehicleRequest>[] = [
  {
    header: "Requesting Staff",
    accessorKey: "requesting_staff",
    cell: ({ row }) => {
      const staff = row.original.requesting_staff;
      return `${staff.first_name} ${staff.last_name}`;
    },
  },
  {
    header: "Location",
    accessorKey: "location.name",
  },
  {
    header: "Request Date",
    accessorKey: "request_date",
  },
  {
    header: "Departure Date",
    accessorKey: "departure_date",
  },
  {
    header: "Return Date",
    accessorKey: "return_date",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge variant={getValue() === "Approved" ? "success" : "destructive"}>
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "No. of Personnel",
    accessorKey: "team_members",
    cell: ({ row }) => {
      return row.original.team_members.length;
    },
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => <MoreAction row={row.original} />,
  },
];

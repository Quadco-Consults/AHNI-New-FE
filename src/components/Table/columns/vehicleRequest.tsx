import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";
import { Badge } from "components/ui/badge";
import { AdminRoutes } from "constants/RouterConstants";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { IVehicleRequestPaginatedData } from "definations/admin/fleet-management/vehicle-request";

const MoreAction = ({ row }: { row: IVehicleRequestPaginatedData }) => {
    const navigate = useNavigate();
    const onSelecteion = () => {
        navigate(AdminRoutes.ViewVehicleRequest);
        sessionStorage.setItem("vehicle_request", row.id);
    };

    const onDelete = async () => {
        try {
            toast.success("Vehicle deleted successfully");
        } catch (error) {
            toast.error("Error deleting vehicle");
        }
    };
    return (
        <div className="flex items-center space-x-2">
            <Popover>
                <PopoverTrigger>
                    <MoreIcon />
                </PopoverTrigger>
                <PopoverContent className="w-32 py-1 space-y-2">
                    <div
                        onClick={() => onSelecteion()}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white"
                    >
                        View
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger className="flex items-center w-full gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
                            Delete
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {
                                        "This action cannot be undone. This will permanently delete this item and remove all associated data from our servers."
                                    }
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete()}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </PopoverContent>
            </Popover>
        </div>
    );
};
export const vehicleRequestColumns: ColumnDef<IVehicleRequestPaginatedData>[] =
    [
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
            header: "Point of departure",
            accessorKey: "df",
        },
        {
            header: "Point of Return",
            accessorKey: "df",
        },
        {
            header: "Purpose of Travel",
            accessorKey: "df",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ getValue }) => {
                return (
                    <Badge
                        variant={
                            getValue() === "Approved"
                                ? "success"
                                : "destructive"
                        }
                    >
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

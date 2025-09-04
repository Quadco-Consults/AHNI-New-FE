import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { toast } from "sonner";
import { IVehicleRequestPaginatedData } from "definations/admin/fleet-management/vehicle-request";
import { formatDate } from "date-fns";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import Link from "next/link";
import { Button } from "components/ui/button";
import EyeIcon from "components/icons/EyeIcon";
import { AdminRoutes } from "constants/RouterConstants";
import DeleteIcon from "components/icons/DeleteIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { useDeleteVehicleRequestMutation } from "@/features/admin/controllers/vehicleRequestController";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";
import PencilIcon from "components/icons/PencilIcon";

export const vehicleRequestColumns: ColumnDef<IVehicleRequestPaginatedData>[] =
  [
    {
      header: "Requesting Staff",
      id: "requesting_staff",
      accessorKey: "created_by",
    },

    {
      header: "Location",
      id: "location",
      accessorKey: "location",
    },

    {
      header: "Request Date",
      id: "created_datetime",
      accessorFn: ({ created_datetime }) =>
        formatDate(created_datetime, "dd-MMM-yyyy"),
    },

    {
      header: "Departure Date",
      id: "departure_datetime",
      accessorFn: ({ departure_datetime }) =>
        formatDate(departure_datetime, "dd-MMM-yyyy"),
    },

    {
      header: "Return Date",
      id: "return_datetime",
      accessorFn: ({ return_datetime }) =>
        formatDate(return_datetime, "dd-MMM-yyyy"),
    },

    {
      header: "Point of Departure",
      id: "departure_point",
      accessorKey: "departure_point",
      size: 200,
    },

    {
      header: "Point of Return",
      id: "return_point",
      accessorKey: "return_point",
    },

    {
      header: "Purpose of Travel",
      accessorKey: "purpose_of_travel",
      size: 200,
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "IN_PROGRESS" && "bg-green-200 text-green-500",
              getValue() === "APPROVED" && "bg-blue-200 text-blue-500",
              getValue() === "CLOSED" && "bg-red-200 text-red-500",
              getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
              getValue() === "On Hold" && "text-grey-200 bg-grey-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },

    {
      header: "No. of Personnel",
      id: "travel_team_members_names",
      accessorFn: ({ travel_team_members_names }) =>
        travel_team_members_names.length,
    },

    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IVehicleRequestPaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteVehicleRequest, isLoading } =
    useDeleteVehicleRequestMutation(id);

  const handleDelete = async () => {
    try {
      await deleteVehicleRequest();
      toast.success("Vehicle Request Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link href={AdminRoutes.VIEW_VEHICLE_REQUEST.replace(":id", id)}>
              <Button variant='ghost' className='w-full'>
                <EyeIcon />
                View
              </Button>
            </Link>

            <Link
              href={{
                pathname: AdminRoutes.CREATE_VEHICLE_REQUEST,
                search: `?id=${id}`,
              }}
            >
              <Button variant='ghost' className='w-full'>
                <PencilIcon />
                Edit
              </Button>
            </Link>

            <Button
              variant='ghost'
              className='w-full'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this vehicle request?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

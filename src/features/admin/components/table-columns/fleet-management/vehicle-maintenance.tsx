import { ColumnDef } from "@tanstack/react-table";
import { IVehicleMaintenancePaginatedData } from "definations/admin/fleet-management/vehicle-maintenance";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import PencilIcon from "components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteVehicleMaintenance } from "@/features/admin/controllers/vehicleMaintenanceController";
import { formatNumberCurrency } from "utils/utls";

export const vehicleMaintenanceColumns: ColumnDef<IVehicleMaintenancePaginatedData>[] =
  [
    {
      header: "Asset",
      id: "asset",
      accessorKey: "asset",
    },

    {
      header: "Maintenance Type",
      id: "maintenance_type",
      accessorKey: "maintenance_type",
      size: 200,
    },

    {
      header: "FCO",
      id: "fco",
      accessorKey: "fco",
    },

    {
      header: "Cost Estimate",
      id: "cost_estimate",

      accessorFn: ({ cost_estimate }) =>
        formatNumberCurrency(cost_estimate, "USD"),
    },

    {
      header: "Description",
      id: "description",
      accessorKey: "description",
      size: 250,
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
    },
    {
      header: "Date Created",
      id: "created_datetime",
      accessorFn: ({ created_datetime }) =>
        format(created_datetime, "dd-MM-yyyy"),
    },

    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => {
        return <TableMenu {...row.original} />;
      },
    },
  ];

const TableMenu = ({ id }: IVehicleMaintenancePaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteVehicleMaintenance, isLoading } =
    useDeleteVehicleMaintenance();

  const onDelete = async () => {
    try {
      await deleteVehicleMaintenance(id);
      toast.success("Vehicle Maintenance Request Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Link
              href={`/dashboard/admin/fleet-management/vehicle-maintenance/${id}`}
            >
              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
                <EyeIcon />
                View
              </Button>
            </Link>
            <Link
              href={{
                pathname: AdminRoutes.CREATE_VEHICLE_MAINTENANCE,
                search: `?id=${id}`,
              }}
            >
              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>
            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
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
        title="Are you sure you want to delete this request?"
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
      />
    </div>
  );
};

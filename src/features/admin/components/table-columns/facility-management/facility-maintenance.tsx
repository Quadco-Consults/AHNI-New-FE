import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
// import { IFacilityMaintenancePaginatedData } from "definations/admin/facility-management/facility-maintenance";
import { useDeleteFacilityMaintenanceMutation } from "@/features/admin/controllers/facilityMaintenanceController";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { AdminRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import PencilIcon from "components/icons/PencilIcon";
import { cn } from "lib/utils";
import { IFacilityMaintenancePaginatedData } from "@/features/admin/types/facility-management/facility-maintenance";

export const facilityMaintenanceColumns: ColumnDef<IFacilityMaintenancePaginatedData>[] =
  [
    {
      header: "Facility",
      id: "facility",
      accessorKey: "facility",
    },
    {
      header: "Description",
      id: "description",
      accessorKey: "description",
    },

    {
      header: "Maintenance Type",
      id: "maintenance_type",
      accessorKey: "maintenance_type",
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg font-medium",
              status === "PENDING" &&
                "bg-yellow-100 text-yellow-800 border-yellow-200",
              status === "REVIEWED" &&
                "bg-blue-100 text-blue-800 border-blue-200",
              status === "AUTHORIZED" &&
                "bg-purple-100 text-purple-800 border-purple-200",
              status === "APPROVED" &&
                "bg-green-100 text-green-800 border-green-200",
              status === "IN_PROGRESS" && "bg-green-200 text-green-700",
              status === "CLOSED" && "bg-red-100 text-red-800 border-red-200",
              status === "ON_HOLD" &&
                "bg-gray-100 text-gray-700 border-gray-200"
            )}
          >
            {status}
          </Badge>
        );
      },
    },

    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IFacilityMaintenancePaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteFacilityMaintenance, isLoading } =
    useDeleteFacilityMaintenanceMutation(id);

  const handleDelete = async () => {
    try {
      await deleteFacilityMaintenance();
      toast.success("Facility Maintenance Ticket Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                className='w-full'
                href={AdminRoutes.VIEW_FACILITY_MAINTENANCE.replace(":id", id)}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              <Link
                href={{
                  pathname: AdminRoutes.CREATE_FACILITY_MAINTENANCE,
                  search: `?id=${id}`,
                }}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <PencilIcon />
                  Edit
                </Button>
              </Link>

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => setDialogOpen(true)}
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this maintenance ticket?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

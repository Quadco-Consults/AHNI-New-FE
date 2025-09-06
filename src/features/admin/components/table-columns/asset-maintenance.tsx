import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { AdminRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { IAssetMaintenancePaginatedData } from "definations/admin/asset-maintenance";
import { format } from "date-fns";
import { useDeleteAssetMaintenanceMutation } from "@/features/admin/controllers/assetMaintenanceController";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const assetMaintenanceColumn: ColumnDef<IAssetMaintenancePaginatedData>[] =
  [
    {
      header: "Asset",
      id: "asset",
      accessorKey: "asset",
    },
    {
      header: "Classification",
      id: "asset_classification",
      accessorKey: "asset_classification",
    },

    {
      header: "Maintenance Type",
      id: "maintenance_type",
      accessorKey: "maintenance_type",
    },

    {
      header: "Problem Description",
      id: "description",
      accessorKey: "description",
      size: 250,
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
      header: "Date Created",
      accessorFn: ({ created_datetime }) =>
        format(created_datetime, "dd-MMM-yyyy"),
    },

    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IAssetMaintenancePaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteAssetMaintenance, isLoading } =
    useDeleteAssetMaintenanceMutation(id);

  const handleDelete = async () => {
    try {
      await deleteAssetMaintenance();
      toast.success("Asset Maintenance Ticket Deleted");
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
                href={AdminRoutes.VIEW_ASSET_MAINTENANCE.replace(":id", id)}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
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

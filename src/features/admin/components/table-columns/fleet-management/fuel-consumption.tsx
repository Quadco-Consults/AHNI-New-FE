import { ColumnDef } from "@tanstack/react-table";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import PencilIcon from "components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteFuelConsumption } from "@/features/admin/controllers/fuelConsumptionController";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const fuelConsumptionColumns: ColumnDef<IFuelRequestPaginatedData>[] = [
  {
    header: "Asset",
    id: "asset",
    accessorKey: "asset",
    size: 150,
  },
  {
    header: "Driver",
    id: "assigned_driver",
    accessorKey: "assigned_driver",
    size: 150,
  },
  {
    header: "Location",
    id: "location",
    accessorKey: "location",
    size: 120,
  },
  {
    header: "Vendor",
    id: "vendor",
    accessorKey: "vendor.name",
    size: 120,
  },
  {
    header: "Date",
    id: "date",
    accessorFn: ({ date }) => format(new Date(date), "dd-MMM-yyyy"),
    size: 100,
  },
  {
    header: "Quantity (L)",
    id: "quantity",
    accessorKey: "quantity",
    size: 100,
  },
  {
    header: "Price/L",
    id: "price_per_litre",
    accessorFn: ({ price_per_litre }) => `₦${price_per_litre}`,
    size: 100,
  },
  {
    header: "Total Amount",
    id: "amount",
    accessorFn: ({ amount }) => `₦${amount}`,
    size: 120,
  },
  {
    header: "Odometer",
    id: "odometer",
    accessorFn: ({ odometer }) => `${odometer} km`,
    size: 100,
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
            status === "APPROVED" &&
              "bg-green-100 text-green-800 border-green-200",
            status === "REJECTED" && "bg-red-100 text-red-800 border-red-200"
          )}
        >
          {status}
        </Badge>
      );
    },
    size: 100,
  },
  {
    header: "Created",
    id: "created_datetime",
    accessorFn: ({ created_datetime }) =>
      format(new Date(created_datetime), "dd-MMM-yyyy"),
    size: 120,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      return <TableMenu {...row.original} />;
    },
    size: 80,
  },
];

const TableMenu = ({ id }: IFuelRequestPaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteFuelConsumption, isLoading } = useDeleteFuelConsumption(id);

  const onDelete = async () => {
    try {
      await deleteFuelConsumption();
      toast.success("Fuel consumption record deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
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
            <Link
              href={`/dashboard/admin/fleet-management/fuel-request/${id}?type=vehicle`}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Details
              </Button>
            </Link>
            <Link
              href={`/dashboard/admin/fleet-management/fuel-request/create?id=${id}`}
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

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this fuel consumption record?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
      />
    </div>
  );
};

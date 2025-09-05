import { ColumnDef } from "@tanstack/react-table";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import Link from "next/link";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";
import ApproveIcon from "components/icons/ApproveIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { useState } from "react";
import ConfirmationDialog from "components/ConfirmationDialog";
import { toast } from "sonner";
import { useDeleteFuelConsumption } from "@/features/admin/controllers/fuelConsumptionController";
import PencilIcon from "components/icons/PencilIcon";
import { formatNumberCurrency } from "utils/utls";

export const fuelRequestConsumptionColumns: ColumnDef<IFuelRequestPaginatedData>[] =
  [
    {
      header: "Date",
      id: "date",
      accessorKey: "date",
    },

    {
      header: "Plate Number",
      id: "odometer",
      accessorKey: "odometer",
      size: 200,
    },

    {
      header: "Driver Name",
      id: "_",
      accessorKey: "_",
      size: 200,
    },

    {
      header: "Coupon Number",
      id: "_",
      accessorKey: "_",
    },

    {
      header: "Last Odometer Reading (KM)",
      id: "_",
      accessorKey: "_",
    },

    {
      header: "Present Odometer Reading (KM)",
      id: "_",
      accessorKey: "_",
      size: 200,
    },

    {
      header: "Distance Covered",
      id: "_",
      accessorKey: "_",
      size: 200,
    },

    {
      header: "Litre Quantity",
      id: "quantity",
      accessorKey: "quantity",
    },

    {
      header: "Price Per Litre (₦)",
      id: "_",
      accessorFn: (data) => formatNumberCurrency(data.price_per_litre, "NGN"),
      size: 200,
    },

    {
      header: "Total Amount",
      id: "amount",
      accessorFn: (data) => formatNumberCurrency(data.amount, "NGN"),
      accessorKey: "amount",
    },

    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => {
        return <TableMenu {...row.original} />;
      },
    },
  ];

const TableMenu = ({ id }: IFuelRequestPaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteFuelConsumption, isLoading } = useDeleteFuelConsumption(id);

  const handleDelete = async () => {
    try {
      await deleteFuelConsumption();
      toast.success("Fuel consumption deleted successfully");
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
            <Link href={`/dashboard/admin/fleet-management/fuel-request/${id}`}>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <ApproveIcon />
                Approve
              </Button>
            </Link>

            <Link href={`/dashboard/admin/fleet-management/fuel-request/create?id=${id}`}>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>

            <Button
              variant='ghost'
              className='w-full flex items-center justify-start gap-2'
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
        title='Are you sure you want to delete this fuel request?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

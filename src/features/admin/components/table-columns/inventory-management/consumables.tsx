import { ColumnDef } from "@tanstack/react-table";

import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

import { toast } from "sonner";
import { Badge } from "components/ui/badge";
// import { TConsumablePaginatedData } from "definations/admin/inventory-management/consumable";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { formatDate } from "date-fns";
import { useState } from "react";
import { DeleteItemManager } from "@/features/modules/controllers";
import { TConsumablePaginatedData } from "@/features/admin/types/inventory-management/consumable";

export const consumableColums: ColumnDef<TConsumablePaginatedData>[] = [
  {
    header: "Name",
    id: "name",
    accessorKey: `name`,
  },
  {
    header: "Quantity",
    id: "quantity",
    accessorKey: "quantity",
    cell: ({ row }) => {
      return row.original.quantity || "N/A";
    },
  },
  {
    header: "Expiring Date",
    id: "expiry_date",
    accessorKey: "expiry_date",

    cell: ({ row }) => {
      return row.original.expiry_date || "N/A";
    },
  },
  // {
  //   header: "Entry Date",
  //   size: 200,
  //   accessorFn: ({ created_datetime }) =>
  //     format(created_datetime, "yyyy-MM-dd"),
  // },
  {
    header: "Vendor",
    accessorKey: "most_recent_vendor",
    cell: ({ row }) => {
      return row.original.created_by || "N/A";
    },
  },
  {
    header: "Max Stock",
    accessorKey: "max_stock",
    cell: ({ row }) => {
      return row.original.max_stock || "N/A";
    },
  },
  {
    header: "Category",
    accessorKey: "category.name",
    size: 200,
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const TableAction = ({ id }: TConsumablePaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteItem, isLoading } = DeleteItemManager();

  const handleDeleteConsumable = async () => {
    try {
      await deleteItem(id);
      toast.success("Consumable Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
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
                href={`/dashboard/admin/inventory-management/consumable/${id}`}
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
                className='w-full'
                href={`/dashboard/admin/inventory-management/consumable/create?id=${id}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EditIcon />
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
        title='Are you sure you want to delete this consumable?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDeleteConsumable}
      />
    </div>
  );
};

export const stockColumns: ColumnDef<{}>[] = [
  {
    header: "Date",
    accessorKey: "updated_datetime",
    // @ts-ignore
    accessorFn: ({ updated_datetime }) =>
      formatDate(updated_datetime, "dd-MMM-yyyy"),
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Unit Cost",
    accessorKey: "item_detail.uom",
  },
  {
    header: "Quantity Received",
    accessorKey: "quantity_received",
    size: 200,
  },
  {
    header: "Quantity Issued",
    accessorKey: "qty_issued",
  },
  {
    header: "Balance",
    accessorKey: "balance",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          variant={
            getValue<string>()?.toLowerCase() === "untreated"
              ? "secondary"
              : "success"
          }
        >
          {getValue<string>()}
        </Badge>
      );
    },
  },
];

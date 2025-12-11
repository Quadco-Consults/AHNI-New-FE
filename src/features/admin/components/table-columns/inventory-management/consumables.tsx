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
import { Store } from "lucide-react";
import ViewStoreStockDialog from "@/features/admin/components/inventory-management/consumable/ViewStoreStockDialog";

export const consumableColums: ColumnDef<TConsumablePaginatedData>[] = [
  {
    header: "Name",
    id: "name",
    accessorKey: `name`,
  },
  {
    header: "Total Quantity",
    id: "total_quantity",
    accessorKey: "total_quantity",
    cell: ({ row }) => {
      const totalQuantity = row.original.total_quantity || row.original.quantity || 0;
      const storesCount = row.original.stores_count || 0;

      if (storesCount === 0) {
        return <span className="text-gray-400">Not distributed</span>;
      }

      return (
        <div className="text-sm">
          <div className="font-medium">{totalQuantity}</div>
          <div className="text-xs text-gray-500">across {storesCount} store{storesCount !== 1 ? 's' : ''}</div>
        </div>
      );
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
    header: "Stores",
    accessorKey: "store_stocks",
    size: 200,
    cell: ({ row }) => {
      const storeStocks = row.original.store_stocks || [];

      // Display stores where this consumable is available
      if (storeStocks.length > 0) {
        // Show first store name and count if multiple
        const firstStore = storeStocks[0].store_detail?.name || "Unknown Store";
        const totalStores = storeStocks.length;
        const totalQuantity = storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0);

        if (totalStores === 1) {
          return (
            <div className="text-sm">
              <div className="font-medium">{firstStore}</div>
              <div className="text-xs text-gray-500">Qty: {totalQuantity}</div>
            </div>
          );
        } else {
          return (
            <div className="text-sm">
              <div className="font-medium">{firstStore}</div>
              <div className="text-xs text-gray-500">+{totalStores - 1} more stores</div>
            </div>
          );
        }
      }

      return (
        <span className="text-sm text-gray-400">
          Not assigned to any store
        </span>
      );
    },
  },
  {
    header: "Consumable Type",
    accessorKey: "category.name",
    size: 200,
    cell: ({ row }) => {
      const category = row.original.category;

      // Display the category name (subcategory like "Medical Consumables", "IT Consumables", etc.)
      if (category && typeof category === 'object' && category.name) {
        return (
          <span className="text-sm">
            {category.name}
          </span>
        );
      }

      return "N/A";
    },
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const TableAction = ({ id, name }: TConsumablePaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [storeStockDialogOpen, setStoreStockDialogOpen] = useState(false);

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
                onClick={() => setStoreStockDialogOpen(true)}
              >
                <Store className='h-4 w-4' />
                View Store Stock
              </Button>

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

      <ViewStoreStockDialog
        open={storeStockDialogOpen}
        onOpenChange={setStoreStockDialogOpen}
        itemId={id}
        itemName={name}
      />
    </div>
  );
};

// Stock Movement Columns (Transaction History)
export const stockMovementColumns: ColumnDef<any>[] = [
  {
    header: "Date",
    accessorKey: "created_datetime",
    size: 120,
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {formatDate(row.original.created_datetime || row.original.movement_date, "dd-MMM-yyyy")}
        </div>
      );
    },
  },
  {
    header: "Store",
    accessorKey: "store_detail",
    size: 150,
    cell: ({ row }) => {
      const storeDetail = row.original.store_detail;
      const storeName = storeDetail?.name || row.original.store_name || 'Store Not Specified';
      const storeCode = storeDetail?.code || row.original.store_code;
      return (
        <div className="text-sm">
          <div className="font-medium">{storeName}</div>
          {storeCode && <div className="text-xs text-gray-500">{storeCode}</div>}
        </div>
      );
    },
  },
  {
    header: "Description",
    accessorKey: "movementTypeDisplay",
    size: 200,
    cell: ({ row }) => {
      const description = row.original.movementTypeDisplay || row.original.movement_type || 'Stock Movement';
      return <span className="text-sm">{description}</span>;
    },
  },
  {
    header: "In",
    accessorKey: "quantity",
    size: 80,
    cell: ({ row }) => {
      const quantity = row.original.quantity || 0;
      const movementType = row.original.movement_type;
      const isInflow = movementType === 'RECEIVE' || movementType === 'ADJUSTMENT_ADD' || quantity > 0;
      const quantityIn = isInflow ? Math.abs(quantity) : 0;

      return (
        <span className={`text-sm font-medium ${quantityIn > 0 ? 'text-green-600' : 'text-gray-400'}`}>
          {quantityIn > 0 ? quantityIn : '-'}
        </span>
      );
    },
  },
  {
    header: "Out",
    accessorKey: "quantity",
    size: 80,
    cell: ({ row }) => {
      const quantity = row.original.quantity || 0;
      const movementType = row.original.movement_type;
      const isOutflow = movementType === 'ISSUE' || movementType === 'ADJUSTMENT_SUBTRACT' || quantity < 0;
      const quantityOut = isOutflow ? Math.abs(quantity) : 0;

      return (
        <span className={`text-sm font-medium ${quantityOut > 0 ? 'text-red-600' : 'text-gray-400'}`}>
          {quantityOut > 0 ? quantityOut : '-'}
        </span>
      );
    },
  },
  {
    header: "Balance",
    accessorKey: "balance_after",
    size: 100,
    cell: ({ row }) => {
      const balance = row.original.balance_after || row.original.running_balance || row.original.balance_before || 0;
      return (
        <span className="text-sm font-semibold text-blue-600">
          {balance}
        </span>
      );
    },
  },
  {
    header: "Reference",
    accessorKey: "reference_number",
    size: 120,
    cell: ({ row }) => {
      const reference = row.original.reference_number || row.original.reference || row.original.transaction_id || '-';
      return <span className="text-sm font-mono text-gray-600">{reference}</span>;
    },
  },
];

// Stock Level Columns (Current Stock when no movements exist)
export const stockLevelColumns: ColumnDef<any>[] = [
  {
    header: "Store",
    accessorKey: "storeName",
    size: 150,
    cell: ({ row }) => {
      const storeName = row.original.storeName;
      const storeCode = row.original.storeCode;
      return (
        <div className="text-sm">
          <div className="font-medium">{storeName}</div>
          <div className="text-xs text-gray-500">{storeCode}</div>
        </div>
      );
    },
  },
  {
    header: "Total Quantity",
    accessorKey: "quantity",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.quantity || 0}</span>;
    },
  },
  {
    header: "Available",
    accessorKey: "available_quantity",
    cell: ({ row }) => {
      return <span className="text-green-600">{row.original.available_quantity || 0}</span>;
    },
  },
  {
    header: "Reserved",
    accessorKey: "reserved_quantity",
    cell: ({ row }) => {
      return <span className="text-orange-600">{row.original.reserved_quantity || 0}</span>;
    },
  },
  {
    header: "Reorder Level",
    accessorKey: "re_order_level",
    cell: ({ row }) => {
      return <span>{row.original.re_order_level || 0}</span>;
    },
  },
  {
    header: "Stock Status",
    accessorKey: "stockStatus",
    cell: ({ row }) => {
      const status = row.original.stockStatus;
      const color = row.original.stockStatusColor;
      return (
        <Badge
          variant={status === "OK" ? "success" : status === "LOW" ? "warning" : "destructive"}
          className={`bg-${color}-100 text-${color}-800`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Last Updated",
    accessorKey: "updated_datetime",
    cell: ({ row }) => {
      return formatDate(row.original.updated_datetime, "dd-MMM-yyyy");
    },
  },
];

// Dynamic export based on data type
export const stockColumns = stockMovementColumns; // Default export for backward compatibility

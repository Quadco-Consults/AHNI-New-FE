import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";

import { DialogType } from "constants/dailogs";
import { AdminRoutes } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";

import { TConsumables, TStockCard, useDeleteConsumablesMutation, useDeleteStockCardMutation,  } from "services/adminApi/consumables";
import { openDialog } from "store/ui";
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
import TableAction from "atoms/TableAction";

// eslint-disable-next-line react-refresh/only-export-components
const MoreAction = ({ row }: { row: TConsumables }) => {
  const [deleteConsumables] = useDeleteConsumablesMutation()

  const onDelete = async () => {
    try {
      await deleteConsumables({
        id: row.id as string
      }).unwrap()
      toast.success("Consumables deleted successfully")
    } catch (error) {
      
      toast.error("Error deleting consumables")
    }
  }
  return (
    <div className="flex items-center space-x-2">
      <TableAction action={onDelete} row={row} route={`${AdminRoutes.CONSUMABLES_VIEW}?id=${row.id}`} />
      
    </div>
  );
};

export const consumableColums: ColumnDef<TConsumables>[] = [
  {
    header: "Item",
    accessorKey: "item",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Expiring Date",
    accessorKey: "expiry_date",
  },
  {
    header: "Stock Level",
    accessorKey: "minimum_stock_level",
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => <MoreAction row={row.original} />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const StockAction = ({ row }: { row: Partial<TStockCard> }) => {
  const dispatch = useAppDispatch();

  const [deleteStock] = useDeleteStockCardMutation()

  const onDelete = async () => {
try {
  await deleteStock({
    id: row.id as string
  }).unwrap()
  toast.success("Stock deleted successfully")
} catch (error) {
  toast.error("Error deleteing stock")
}
  }
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger>
          <MoreIcon />
        </PopoverTrigger>
        <PopoverContent className="w-32 py-1 space-y-2">
   
            <div onClick={() => {
               dispatch(
                openDialog({
                  type: DialogType.AddStock,
                  dialogProps: {
                    data: {
                      ...row,
                    } as unknown as string,
                  },
                })
              );
            } } className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
              Update
            </div>


          <AlertDialog>
            <AlertDialogTrigger className="flex items-center w-full gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {
                    "This action cannot be undone. This will permanently delete this item and remove all associated data from our servers."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  onDelete()
                }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PopoverContent>
      </Popover>
      
    </div>
  );
};

export const stockColumns: ColumnDef<TStockCard>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Particular",
    accessorKey: "particular",
  },
  {
    header: "Stock",
    accessorKey: "stock",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Stock Left",
    accessorKey: "stock_left",
  },
  {
    header: "Action",
    accessorKey: "stock_left",
    cell: ({ row }) => <StockAction row={row.original} />,
  },
];

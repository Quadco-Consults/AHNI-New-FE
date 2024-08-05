import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { DialogType } from "constants/dailogs";
import { AdminRoutes } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { Link } from "react-router-dom";
import { TConsumables, TStockCard } from "services/adminApi/consumables";
import { openDialog } from "store/ui";

// eslint-disable-next-line react-refresh/only-export-components
const MoreAction = ({ row }: { row: TConsumables }) => {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuItem className="cursor-pointer ">
            <Link to={`${AdminRoutes.CONSUMABLES_VIEW}?id=${row.id}`}>
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer ">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuItem
            onClick={() => {
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
            }}
            className="cursor-pointer "
          >
            Update
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer ">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

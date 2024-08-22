import { ColumnDef, Row } from "@tanstack/react-table";
import TableAction from "atoms/TableAction";

import { AdminRoutes } from "constants/RouterConstants";
import { formatCurrency } from "lib/utils";

import {
  FuelRecord,
  useDeleteFuelRecordMutation,
} from "services/adminApi/VehicleRequestApi";
import { toast } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
const FuelDelete = ({ row }: { row: Row<FuelRecord> }) => {
  const [deleteFuel] = useDeleteFuelRecordMutation();

  const onFuelDelete = async () => {
    try {
      await deleteFuel(row.original.id).unwrap();
      toast.success("Fuel Record Deleted");
    } catch (error) {
      toast.error("Failed to delete fuel record");
    }
  };

  return (
    <TableAction
      action={() => onFuelDelete()}
      route={AdminRoutes.FuelView}
      row={row.original}
    />
  );
};

export const fuelConsumptionColumns: ColumnDef<FuelRecord>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Odometer",
    accessorKey: "odometer",
  },
  {
    header: "Distance Covered",
    accessorKey: "distance_covered",
  },
  {
    header: "Price Per Liter (₦)",
    accessorKey: "price_per_liter",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center justify-center">
          {formatCurrency(getValue<number>())}
        </div>
      );
    },
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => <FuelDelete row={row} />,
  },
];

export const fuelConsumptionColumnsOne: ColumnDef<FuelRecord>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Odometer",
    accessorKey: "odometer",
  },
  {
    header: "Distance Covered",
    accessorKey: "distance_covered",
  },
  {
    header: "Price Per Liter (₦)",
    accessorKey: "price_per_liter",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center justify-center">
          {formatCurrency(getValue<number>())}
        </div>
      );
    },
  },
];

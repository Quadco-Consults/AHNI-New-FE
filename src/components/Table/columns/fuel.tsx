import { ColumnDef, Row } from "@tanstack/react-table";
import TableAction from "atoms/TableAction";

import { AdminRoutes } from "constants/RouterConstants";
import { formatCurrency } from "lib/utils";

import {
  FuelRecord,
  useDeleteFuelRecordMutation,
} from "services/adminApi/VehicleRequestApi";
import { toast } from "sonner";

export type IFuelVehicle = {
  condition: string;
  name: string;
  manufacturer: string;
  model: string;
  implementer: string;
  id: string;
};

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

export const fuelConsumption: ColumnDef<IFuelVehicle>[] = [
  {
    header: "vehicle",
    accessorKey: "name",
  },

  {
    header: "Model",
    accessorKey: "model",
  },
  {
    header: "Manufacturer",
    accessorKey: "manufacturer",
  },
  {
    header: "Implementer",
    accessorKey: "implementer",
  },
  {
    header: "condition",
    accessorKey: "condition",
  },
  {
    header: "",
    accessorKey: "actions",
    cell: ({ row }) => {
      return <TableAction row={row.original} route={AdminRoutes.FuelView} />;
    },
  },
];

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
    header: "Driver",
    accessorKey: "driver",
  },
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

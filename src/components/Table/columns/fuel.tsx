import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";

interface FuelConsumption {
  date: string;
  odometer: number;
  distanceCovered: number;
  pricePerLiter: number;
  quantity: number;
  amount: number;
  isSelected: boolean;
}

export const fuelConsumptionData: FuelConsumption[] = [
  {
    date: "20-Feb-24",
    odometer: 125258,
    distanceCovered: 315,
    pricePerLiter: 700,
    quantity: 60.6,
    amount: 42420,
    isSelected: false,
  },
  {
    date: "FHI 360",
    odometer: 125550,
    distanceCovered: 292,
    pricePerLiter: 700,
    quantity: 63,
    amount: 44100,
    isSelected: false,
  },
  {
    date: "FHI 360",
    odometer: 125737,
    distanceCovered: 187,
    pricePerLiter: 700,
    quantity: 27.53,
    amount: 19271,
    isSelected: false,
  },
  {
    date: "FHI 360",
    odometer: 125258,
    distanceCovered: 315,
    pricePerLiter: 700,
    quantity: 60.6,
    amount: 42420,
    isSelected: false,
  },
  {
    date: "FHI 360",
    odometer: 125550,
    distanceCovered: 187,
    pricePerLiter: 700,
    quantity: 63,
    amount: 44100,
    isSelected: false,
  },
  {
    date: "FHI 360",
    odometer: 125737,
    distanceCovered: 292,
    pricePerLiter: 700,
    quantity: 27.53,
    amount: 19271,
    isSelected: false,
  },
];

export const fuelConsumptionColumns: ColumnDef<FuelConsumption>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    accessorKey: "isSelected",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
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
    accessorKey: "distanceCovered",
  },
  {
    header: "Price Per Liter",
    accessorKey: "pricePerLiter",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
];

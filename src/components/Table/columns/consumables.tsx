import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";
import { Badge } from "components/ui/badge";

import { Checkbox } from "components/ui/checkbox";

type Data = {
  products: string;
  quantity: string;
  expiringDate: string;
  availability: string;
  category: string;
};

export const consumablesData: Data[] = [
  {
    products: "Paper",
    quantity: "10 Rims",
    expiringDate: "N/A",
    availability: "Available",
    category: "Stationary",
  },
  {
    products: "Envelope",
    quantity: "5 Packets",
    expiringDate: "N/A",
    availability: "Low Stock",
    category: "Stationary",
  },
  {
    products: "Pen",
    quantity: "20 Packets",
    expiringDate: "N/A",
    availability: "Available",
    category: "Stationary",
  },
  {
    products: "Diesel",
    quantity: "20 Litres",
    expiringDate: "N/A",
    availability: "Low Stock",
    category: "Fuel & Diesel",
  },
  {
    products: "Tap",
    quantity: "5",
    expiringDate: "N/A",
    availability: "Available",
    category: "M&E Tools",
  },
  {
    products: "Fuel",
    quantity: "200 Litres",
    expiringDate: "N/A",
    availability: "Available",
    category: "Fuel & Diesel",
  },
  {
    products: "Water",
    quantity: "25 Packet",
    expiringDate: "24/10/24",
    availability: "Available",
    category: "",
  },
  {
    products: "Toner",
    quantity: "20 Toners",
    expiringDate: "N/A",
    availability: "Available",
    category: "Stationary",
  },
  {
    products: "Nose Mask",
    quantity: "25 Packets",
    expiringDate: "N/A",
    availability: "Low Stock",
    category: "PPEs",
  },
  {
    products: "Eye Goggle",
    quantity: "30 Safety Goggle",
    expiringDate: "N/A",
    availability: "Available",
    category: "PPEs",
  },
  {
    products: "Safety Boot",
    quantity: "20 Boots",
    expiringDate: "N/A",
    availability: "Available",
    category: "PPEs",
  },
  {
    products: "Medical Gloves",
    quantity: "20 Packets",
    expiringDate: "N/A",
    availability: "Low Stock",
    category: "PPEs",
  },
];

export const consumableColums: ColumnDef<Data>[] = [
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
    header: "Products",
    accessorKey: "products",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Expiring Date",
    accessorKey: "expiringDate",
  },
  {
    header: "Availability",
    accessorKey: "availability",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === "Available" ? "success" : "destructive"}>
        {getValue() as string}
      </Badge>
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "",
    accessorKey: "action",
    cell: () => {
      return <MoreIcon />;
    },
  },
];

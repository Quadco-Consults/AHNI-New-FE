import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";

type PaymentData = {
  paymentTo: string;
  amount: string;
  requestedBy: string;
  approval: string;
  date: string;
};

export const paymentData: PaymentData[] = [
  {
    paymentTo: "Courier Plus Services",
    amount: "456,000",
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: "456,000",
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: "456,000",
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: "456,000",
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: "456,000",
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
];

export const paymentColumns: ColumnDef<PaymentData>[] = [
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
    header: "Payment To",
    accessorKey: "paymentTo",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Requested By",
    accessorKey: "requestedBy",
  },
  {
    header: "Approval",
    accessorKey: "approval",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === "Approved" ? "success" : "destructive"}>
        {getValue() as string}
      </Badge>
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
  },
];

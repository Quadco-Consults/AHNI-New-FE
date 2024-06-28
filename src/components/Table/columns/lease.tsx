import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";

interface PaymentData {
  paymentTo: string;
  amount: number;
  requestedBy: string;
  approval: string;
  date: string;
}

export const dataLease: PaymentData[] = [
  {
    paymentTo: "Courier Plus Services",
    amount: 456000,
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: 456000,
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: 456000,
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: 456000,
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: 456000,
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
  {
    paymentTo: "Courier Plus Services",
    amount: 456000,
    requestedBy: "Jennifer Onubi",
    approval: "Approved",
    date: "25/10/24",
  },
];

export const columnsLease: ColumnDef<PaymentData>[] = [
  {
    id: "selection",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "paymentTo",
    header: "Payment To",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
  },
  {
    accessorKey: "approval",
    header: "Approval",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

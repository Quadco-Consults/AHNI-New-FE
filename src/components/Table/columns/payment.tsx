import { ColumnDef } from "@tanstack/react-table";

export interface TPaymentRequest {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  payment_to: string;
  tax_identification_number: string;
  amount_in_figures: string;
  amount_in_words: string;
  account_number: string;
  bank: string;
  requested_by: string;
}

export const paymentColumns: ColumnDef<PaymentRequest>[] = [
  {
    header: "Payment To",
    accessorKey: "payment_to",
  },
  {
    header: "Amount",
    accessorKey: "amount_in_figures",
    cell: ({ getValue }) => `₦${getValue<number>().toLocaleString()}`,
  },
  {
    header: "Requested By",
    accessorKey: "requested_by",
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Bank",
    accessorKey: "bank",
  },
  {
    header: "Account Number",
    accessorKey: "account_number",
  },
];

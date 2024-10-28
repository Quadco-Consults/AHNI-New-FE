import { ColumnDef } from "@tanstack/react-table";
import TableAction from "atoms/TableAction";
import { AdminRoutes } from "constants/RouterConstants";
import { useDeletePaymentRequestMutation } from "services/adminApi/paymentRequest";
import { toast } from "sonner";

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

// eslint-disable-next-line react-refresh/only-export-components
const Action = ({ row }: { row: PaymentRequest }) => {
  const [deletePayment] = useDeletePaymentRequestMutation();
  const onDelete = () => {
    deletePayment({ id: row.id })
      .unwrap()
      .then(() => {
        toast.success("Payment request deleted successfully");
      })
      .catch(() => {
        toast.error("Error deleting payment request");
      });
  };
  return (
    <TableAction
      row={row}
      route={AdminRoutes.PaymentRequestView}
      action={onDelete}
    />
  );
};

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
  {
    header: "Reason",
    accessorKey: "d",
  },
  {
    header: "Approval Levels",
    accessorKey: "f",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => <Action row={row.original} />,
  },
];

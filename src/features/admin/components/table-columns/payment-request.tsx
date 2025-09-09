import { ColumnDef } from "@tanstack/react-table";
// import { IPaymentRequestPaginatedData } from "definations/admin/payment-request";
import { useState } from "react";
import { useDeletePaymentRequest } from "@/features/admin/controllers/paymentRequestController";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { AdminRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import DeleteIcon from "components/icons/DeleteIcon";
import { format } from "date-fns";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import PencilIcon from "components/icons/PencilIcon";
import { formatNumberCurrency } from "utils/utls";
import { IPaymentRequestPaginatedData } from "../../types/payment-request";

export const paymentRequestColumns: ColumnDef<IPaymentRequestPaginatedData>[] =
  [
    {
      header: "Payment To",
      id: "payment_to",
      accessorKey: "payment_to",
      size: 150,
    },

    {
      header: "Amount in Figures",
      id: "amount_in_figures",
      accessorFn: ({ amount_in_figures }) =>
        formatNumberCurrency(amount_in_figures, "NGN"),
      size: 200,
    },

    {
      header: "Requested By",
      id: "requested_by",
      accessorKey: "requested_by",
    },

    {
      header: "Payment Date",
      id: "payment_date",
      accessorFn: ({ payment_date }) => format(payment_date, "dd-MMM-yyyy"),
    },

    {
      header: "Bank",
      id: "bank_name",
      accessorKey: "bank_name",
    },

    {
      header: "Account Number",
      id: "account_number",
      accessorKey: "account_number",
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg font-medium",
              status === "PENDING" && "bg-yellow-100 text-yellow-700 border-yellow-200",
              status === "REVIEWED" && "bg-blue-100 text-blue-700 border-blue-200",
              status === "AUTHORIZED" && "bg-purple-100 text-purple-700 border-purple-200",
              status === "APPROVED" && "bg-green-100 text-green-700 border-green-200",
              status === "REJECTED" && "bg-red-100 text-red-700 border-red-200",
              // Legacy statuses (fallback)
              status === "IN_PROGRESS" && "bg-green-200 text-green-500",
              status === "CLOSED" && "bg-red-200 text-red-500",
              status === "On Hold" && "bg-gray-200 text-gray-500"
            )}
          >
            {status}
          </Badge>
        );
      },
    },

    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IPaymentRequestPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deletePaymentRequest, isLoading } = useDeletePaymentRequest(id);

  const handleDelete = async () => {
    try {
      await deletePaymentRequest();
      () => setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                className='w-full'
                href={AdminRoutes.VIEW_PAYMENT_REQUEST.replace(":id", id)}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              <Link
                className='w-full'
                href={{
                  pathname: AdminRoutes.CREATE_PAYMENT_REQUEST_SUMMARY,
                  search: `?id=${id}`,
                }}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <PencilIcon />
                  Edit
                </Button>
              </Link>

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => setDialogOpen(true)}
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this payment request?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

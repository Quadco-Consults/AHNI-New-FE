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
      accessorFn: ({ payment_items }) => {
        // Display the first payment recipient or handle multiple items
        if (payment_items && payment_items.length > 0) {
          const firstItem = payment_items[0];
          if (payment_items.length === 1) {
            return firstItem.payment_to;
          } else {
            return `${firstItem.payment_to} (+${payment_items.length - 1} more)`;
          }
        }
        return "N/A";
      },
      size: 150,
    },

    {
      header: "Amount in Figures",
      id: "amount_in_figures",
      accessorFn: ({ total_amount, payment_items }) => {
        // Use total_amount if available, otherwise sum payment_items
        if (total_amount) {
          return formatNumberCurrency(parseFloat(total_amount), "NGN");
        }

        if (payment_items && payment_items.length > 0) {
          const total = payment_items.reduce((sum, item) => {
            return sum + parseFloat(item.amount_in_figures || "0");
          }, 0);
          return formatNumberCurrency(total, "NGN");
        }

        return formatNumberCurrency(0, "NGN");
      },
      size: 200,
    },

    {
      header: "Requested By",
      id: "requested_by",
      accessorFn: ({ requested_by }) => {
        // Handle both string and object formats
        if (typeof requested_by === 'string') {
          return requested_by;
        }
        if (requested_by && typeof requested_by === 'object') {
          return requested_by.full_name || requested_by.email || "N/A";
        }
        return "N/A";
      },
    },

    {
      header: "Payment Date",
      id: "payment_date",
      accessorFn: ({ payment_date }) => {
        try {
          if (!payment_date) return "N/A";
          return format(new Date(payment_date), "dd-MMM-yyyy");
        } catch (error) {
          console.warn("Invalid payment date:", payment_date);
          return "Invalid Date";
        }
      },
    },

    {
      header: "Bank",
      id: "bank_name",
      accessorFn: ({ payment_items }) => {
        if (payment_items && payment_items.length > 0) {
          const firstItem = payment_items[0];
          if (payment_items.length === 1) {
            return firstItem.bank_name || "N/A";
          } else {
            return `${firstItem.bank_name || "N/A"} (+${payment_items.length - 1} more)`;
          }
        }
        return "N/A";
      },
    },

    {
      header: "Account Number",
      id: "account_number",
      accessorFn: ({ payment_items }) => {
        if (payment_items && payment_items.length > 0) {
          const firstItem = payment_items[0];
          if (payment_items.length === 1) {
            return firstItem.account_number || "N/A";
          } else {
            return `${firstItem.account_number || "N/A"} (+${payment_items.length - 1} more)`;
          }
        }
        return "N/A";
      },
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

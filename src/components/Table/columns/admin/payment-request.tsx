import { ColumnDef } from "@tanstack/react-table";
import { IPaymentRequestPaginatedData } from "definations/admin/payment-request";
import { useState } from "react";
import { useDeletePaymentRequestMutation } from "services/admin/payment-request";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import { format } from "date-fns";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

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
            accessorFn: ({ amount_in_figures }) => `₦${amount_in_figures}`,
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
            accessorFn: ({ payment_date }) =>
                format(payment_date, "dd-MMM-yyyy"),
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
                return (
                    <Badge
                        variant="default"
                        className={cn(
                            "p-1 rounded-lg",
                            getValue() === "IN_PROGRESS" &&
                                "bg-green-200 text-green-500",
                            getValue() === "CLOSED" &&
                                "bg-red-200 text-red-500",
                            getValue() === "PENDING" &&
                                "bg-yellow-200 text-yellow-500",
                            getValue() === "On Hold" &&
                                "text-grey-200 bg-grey-500"
                        )}
                    >
                        {getValue() as string}
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

const TableMenu = ({ id, status }: IPaymentRequestPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [deletePaymentRequest, { isLoading }] =
        useDeletePaymentRequestMutation();

    const handleDelete = async () => {
        try {
            await deletePaymentRequest(id).unwrap();
            toast.success("Payment Request Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex gap-2 py-6">
                            <MoreOptionsHorizontalIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link
                                className="w-full"
                                to={generatePath(
                                    AdminRoutes.VIEW_PAYMENT_REQUEST,
                                    {
                                        id,
                                    }
                                )}
                            >
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <EyeIcon />
                                    View
                                </Button>
                            </Link>

                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
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
                title="Are you sure you want to delete this payment request?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

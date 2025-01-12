import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import { IExpenseAuthorizationPaginatedData } from "definations/admin/expense-authorization";
import { cn } from "lib/utils";
import { useState } from "react";
import { generatePath, Link } from "react-router-dom";
import { useDeleteExpenseAuthorizationMutation } from "services/admin/expense-authorization";
import { toast } from "sonner";

export const expenseAuthorizationColumns: ColumnDef<IExpenseAuthorizationPaginatedData>[] =
    [
        {
            header: "Project Number",
            accessorKey: "project_number",
        },

        {
            header: "Full Name",
            id: "full_name",
            accessorFn: ({ created_by: { first_name, last_name } }) =>
                `${first_name} ${last_name}`,
        },

        {
            header: "Email",
            id: "email",
            accessorFn: ({ created_by: { email } }) => email,
        },

        {
            header: "Phone Number",
            id: "mobile_number",
            accessorFn: ({ created_by: { mobile_number } }) => mobile_number,
            size: 250,
        },

        {
            header: "Address",
            id: "address",
            accessorKey: "address",
        },

        {
            header: "TA Number",
            id: "ta_number",
            accessorKey: "ta_number",
        },

        {
            header: "Department",
            id: "department",
            accessorKey: "department",
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
            accessorKey: "actions",
            size: 80,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IExpenseAuthorizationPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [deleteExpenseAuthorization, { isLoading }] =
        useDeleteExpenseAuthorizationMutation();

    const handleDelete = async () => {
        try {
            await deleteExpenseAuthorization(id).unwrap();
            toast.success("Expense Authorization Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="flex gap-2 py-6">
                    <MoreOptionsHorizontalIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="flex flex-col items-start justify-between gap-1">
                    <Link
                        to={generatePath(
                            AdminRoutes.EXPENSE_AUTHORIZATION_DETAIL,
                            { id }
                        )}
                        className="w-full"
                    >
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                        >
                            <EyeIcon />
                            View
                        </Button>
                    </Link>

                    <Link
                        to={{
                            pathname: AdminRoutes.EXPENSE_AUTHORIZATION_CREATE,
                            search: `?id=${id}`,
                        }}
                        className="w-full"
                    >
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                        >
                            <PencilIcon />
                            Edit
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

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this expense authorization?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </Popover>
    );
};

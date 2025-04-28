import { ColumnDef } from "@tanstack/react-table";
import { ISubGrantPaginatedData } from "definations/c&g/contract-management/sub-grant/sub-grant";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { useState } from "react";
import { generatePath, Link } from "react-router-dom";
import EyeIcon from "components/icons/EyeIcon";
import { CG_ROUTES } from "constants/RouterConstants";
import { toast } from "sonner";
import { useDeleteSubGrantMutation } from "services/c&g/subgrant/sub-grant";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { formatNumberCurrency } from "utils/utls";

export const subGrantAwardColumns: ColumnDef<ISubGrantPaginatedData>[] = [
    {
        header: "Title",
        id: "title",
        accessorKey: "title",
        size: 200,
    },

    {
        header: "Project",
        id: "project",
        accessorKey: "project",
        size: 200,
    },

    {
        header: "Business Unit",
        id: "business_unit",
        accessorKey: "business_unit",
        size: 200,
    },

    {
        header: "Award Amount (USD)",
        id: "amount_usd",
        accessorFn: (data) => formatNumberCurrency(data.amount_usd, "USD"),
        accessorKey: "amount_usd",
        size: 200,
    },

    {
        header: "Award Amount (NGN)",
        id: "amount_ngn",
        accessorKey: "amount_ngn",
        accessorFn: (data) => formatNumberCurrency(data.amount_ngn, "NGN"),

        size: 200,
    },

    {
        header: "Start Date",
        accessorKey: "start_date",
        size: 200,
    },
    {
        header: "End Date",
        accessorKey: "end_date",
        size: 200,
    },
    {
        header: "Status",
        accessorKey: "status",
        size: 200,
    },
    {
        header: "",
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: ISubGrantPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [deleteSubGrant, { isLoading: isDeleteLoading }] =
        useDeleteSubGrantMutation();

    const handleDelete = async () => {
        try {
            await deleteSubGrant(id).unwrap();
            toast.success("Sub Grant Deleted");
            setDialogOpen(false);
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
                        <Link
                            to={generatePath(CG_ROUTES.SUBGRANT_AWARD_DETAILS, {
                                id,
                            })}
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
                                pathname: CG_ROUTES.CREATE_SUBGRANT_AWARD,
                                search: `?id=${id}`,
                            }}
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
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this sub grant?"
                loading={isDeleteLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

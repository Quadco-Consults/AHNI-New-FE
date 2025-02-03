import { ColumnDef } from "@tanstack/react-table";
import { ISubGrantPaginatedData } from "definations/c&g/sub-grant";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { useAppDispatch } from "hooks/useStore";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { useState } from "react";
import { generatePath, Link } from "react-router-dom";
import EyeIcon from "components/icons/EyeIcon";
import { CG_GROUTES } from "constants/RouterConstants";

export const subGrantAwardColumns: ColumnDef<ISubGrantPaginatedData>[] = [
    {
        header: "Project Title",
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
        accessorKey: "amount_usd",
        size: 200,
    },

    {
        header: "Award Amount (NGN)",
        id: "amount_ngn",
        accessorKey: "amount_ngn",
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

    const dispatch = useAppDispatch();

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
                            to={generatePath(
                                CG_GROUTES.SUBGRANT_AWARD_DETAILS,
                                { id }
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
                        >
                            <PencilIcon />
                            Edit
                        </Button>
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

            {/* <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this expenditure?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            /> */}
        </div>
    );
};

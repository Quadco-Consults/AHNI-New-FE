import { ColumnDef } from "@tanstack/react-table";
import { IExpenditurePaginatedData } from "definations/c&g/grants";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";

export const expenditureHistoryColumns: ColumnDef<IExpenditurePaginatedData>[] =
    [
        {
            header: "Amount Spent",
            id: "amount",
            accessorFn: ({ amount }) => `$${amount}`,
            size: 200,
        },
        {
            header: "Description",
            id: "description",
            accessorKey: "description",
            size: 200,
        },

        // {
        //     header: "",
        //     id: "action",
        //     size: 80,
        //     cell: ({ row }) => <TableMenu {...row.original} />,
        // },
    ];

const TableMenu = ({ id }: IExpenditurePaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            // handle delete
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
                title="Are you sure you want to delete this expenditure?"
                loading={false}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

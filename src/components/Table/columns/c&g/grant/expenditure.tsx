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
import { useParams } from "react-router-dom";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useDeleteExpenditureMutation } from "services/c&g/expenditure";

export const expenditureColumns: ColumnDef<IExpenditurePaginatedData>[] = [
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

    {
        header: "",
        id: "action",
        size: 80,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({
    id: expenditureId,
    ...rest
}: IExpenditurePaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const dispatch = useAppDispatch();

    const { id: grantId } = useParams();

    const [deleteExpenditure, { isLoading }] = useDeleteExpenditureMutation();

    const handleDelete = async () => {
        try {
            await deleteExpenditure({ grantId: grantId ?? "", expenditureId });
            toast.success("Expenditure Deleted");
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
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type: DialogType.ExpenditureModal,
                                        dialogProps: {
                                            header: "Update Expenditure",
                                            width: "max-w-lg",
                                            grantId,
                                            expenditure: {
                                                id: expenditureId,
                                                ...rest,
                                            },
                                        },
                                    })
                                );
                            }}
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

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this expenditure?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

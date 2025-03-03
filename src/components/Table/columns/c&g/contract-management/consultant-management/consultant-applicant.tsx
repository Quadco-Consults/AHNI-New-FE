import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { Link, useLocation } from "react-router-dom";
import { IAgreementPaginatedData } from "definations/c&g/contract-management/agreement";
import { useDeleteAgreementMutation } from "services/c&g/contract-management/agreement";
import { CG_ROUTES } from "constants/RouterConstants";

export const consultantApplicantColumns: ColumnDef<any>[] = [
    {
        header: "Applicant Name",
        id: "provider",
        accessorKey: "provider",
        size: 200,
    },

    {
        header: "Employment Type",
        id: "service",
        accessorKey: "service",
        size: 200,
    },

    {
        header: "Application Email",
        id: "type",
        accessorKey: "type",
        size: 200,
    },

    {
        header: "",
        id: "action",
        size: 80,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: IAgreementPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { pathname } = useLocation();

    console.log({ pathname });

    const [deleteAgreement, { isLoading }] = useDeleteAgreementMutation();

    const handleDelete = async () => {
        try {
            await deleteAgreement(id).unwrap();
            toast.success("Agreement Deleted");
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
                            to={{
                                pathname: CG_ROUTES.CREATE_AGREEMENT,
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
                title="Are you sure you want to delete this expenditure?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_GROUTES } from "constants/RouterConstants";
import { ISubGrantSubmissionPaginatedData } from "definations/c&g/contract-management/sub-grant/sub-grant";
import { generatePath, Link, useParams } from "react-router-dom";
import PencilIcon from "components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteSubGrantManualSubMutation } from "services/c&g/subgrant/submission";
import { useState } from "react";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";

export const partnerSubmissionColumns: ColumnDef<ISubGrantSubmissionPaginatedData>[] =
    [
        {
            header: "Legal Name of the Organization",
            id: "organisation_name",
            accessorKey: "organisation_name",
            size: 200,
        },
        {
            header: "Address",
            id: "address",
            accessorKey: "address",
            size: 200,
        },
        {
            header: "Email",
            id: "email",
            accessorKey: "email",
            size: 200,
        },
        {
            header: "Telephone",
            id: "phone_number",
            accessorKey: "phone_number",
            size: 200,
        },

        {
            header: "",
            id: "actions",
            size: 50,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id: partnerSubId }: ISubGrantSubmissionPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { id: subGrantId } = useParams();

    const [deletePartnerSubmission, { isLoading: isDeleteLoading }] =
        useDeleteSubGrantManualSubMutation();

    const handleDelete = async () => {
        try {
            await deletePartnerSubmission(partnerSubId).unwrap();
            toast.success("Submission Deleted");
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
                            className="w-full"
                            to={generatePath(
                                CG_GROUTES.SUBGRANT_SUBMISSION_DETAILS,
                                { subGrantId, partnerSubId }
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

                        <Link
                            to={{
                                pathname: generatePath(
                                    CG_GROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS,
                                    { id: subGrantId }
                                ),
                                search: `?partnerSubId=${partnerSubId}`,
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
                title="Are you sure you want to delete this submission?"
                loading={isDeleteLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};

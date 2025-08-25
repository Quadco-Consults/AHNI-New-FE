"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_ROUTES } from "constants/RouterConstants";
import { ISubGrantSubmissionPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import PencilIcon from "components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import { useState } from "react";
import ConfirmationDialog from "components/ConfirmationDialog";

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

const TableMenu = ({
    id: partnerSubId,
    sub_grant_id,
}: ISubGrantSubmissionPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { id: subGrantId = "" } = useParams();

    const pathname = usePathname();

    const isPreawardPath = pathname.includes("/preaward-assessment");

    const { deletePartnerSubmission, isLoading: isDeleteLoading } =
        useDeleteSubGrantManualSub();

    const handleDelete = async () => {
        try {
            await deletePartnerSubmission(partnerSubId)();
            toast.success("Submission Deleted");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const path = isPreawardPath
        ? `/dashboard/c-and-g/sub-grant/awards/submission/${partnerSubId}`
        : `/dashboard/c-and-g/sub-grant/awards/submission/${partnerSubId}`;

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
                        <Link className="w-full" href={path}>
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View
                            </Button>
                        </Link>

                        {!isPreawardPath && (
                            <>
                                <Link
                                    href={`/dashboard/c-and-g/sub-grant/awards/submission/create?partnerSubId=${partnerSubId}`}
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
                            </>
                        )}
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

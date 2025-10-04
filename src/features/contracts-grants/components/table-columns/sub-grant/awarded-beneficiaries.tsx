"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { useState } from "react";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import { toast } from "sonner";
import { useDeleteSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import ConfirmationDialog from "components/ConfirmationDialog";
import { ISubGrantSubmissionPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/submission";

export const awardedBeneficiariesColumn: ColumnDef<ISubGrantSubmissionPaginatedData>[] = [
    {
        header: "Grant Name",
        id: "sub_grant",
        accessorKey: "sub_grant",
        size: 200,
    },

    {
        header: "Donor",
        id: "partner",
        accessorKey: "partner",
        size: 200,
    },

    {
        header: "Project",
        id: "project",
        accessorFn: () => "N/A", // Not available in submission data
        size: 200,
    },

    {
        header: "Sub Grantee Name",
        id: "organisation_name",
        accessorKey: "organisation_name",
        size: 200,
    },

    {
        header: "Sub Grantee Address",
        id: "address",
        accessorKey: "address",
        size: 200,
    },

    {
        header: "Sub Grantee Email",
        id: "email",
        accessorKey: "email",
        size: 200,
    },

    {
        header: "Sub Grantee Phone Number",
        id: "phone_number",
        accessorKey: "phone_number",
        size: 200,
    },

    {
        header: "Subaward Life of Project Value (USD)",
        id: "award_usd",
        accessorFn: () => "N/A", // Award amounts not in submission, need to fetch from awards table
        size: 200,
    },

    {
        header: "Subaward Life of Project Value (Local Currency)",
        id: "award_ngn",
        accessorFn: () => "N/A", // Award amounts not in submission, need to fetch from awards table
        size: 200,
    },

    {
        header: "Start Date",
        id: "start_date",
        accessorFn: () => "N/A", // Award dates not in submission, need to fetch from awards table
        size: 200,
    },

    {
        header: "End Date",
        id: "end_date",
        accessorFn: () => "N/A", // Award dates not in submission, need to fetch from awards table
        size: 200,
    },

    {
        header: "",
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id, sub_grant_id }: ISubGrantSubmissionPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { deleteSubGrantSubmission, isLoading: isDeleteLoading } = useDeleteSubGrantManualSub(id);

    const handleDelete = async () => {
        try {
            await deleteSubGrantSubmission();
            toast.success("Submission Deleted");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.message ?? "Something went wrong");
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
                            href={`/dashboard/c-and-g/sub-grant/awards/${sub_grant_id || ''}`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View Sub-Grant
                            </Button>
                        </Link>

                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                            onClick={() => setDialogOpen(true)}
                        >
                            <DeleteIcon />
                            Delete Submission
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

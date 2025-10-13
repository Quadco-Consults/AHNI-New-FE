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
import { useDeleteSubGrantSubmission } from "@/features/contracts-grants/controllers/submissionController";
import { useState } from "react";
import ConfirmationDialog from "components/ConfirmationDialog";

export const preAwardAssessmentColumns: ColumnDef<ISubGrantSubmissionPaginatedData>[] =
    [
        {
            header: "Sub Grant Title",
            id: "sub_grant",
            accessorKey: "sub_grant",
            size: 200,
            cell: ({ getValue }) => {
                const subGrant = getValue();
                // Handle both string and object types
                if (typeof subGrant === 'string') {
                    return subGrant;
                }
                if (typeof subGrant === 'object' && subGrant !== null) {
                    return (subGrant as any).title || 'N/A';
                }
                return 'N/A';
            },
        },
        {
            header: "Organisation",
            id: "organisation_name",
            accessorKey: "organisation_name",
            size: 200,
        },
        {
            header: "Status",
            id: "status",
            accessorKey: "status",
            size: 200,
            cell: ({ getValue }) => {
                const status = getValue() as string || 'PENDING';
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        status === 'AWARDED' ? 'bg-green-100 text-green-800' :
                        status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-800' :
                        status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {status}
                    </span>
                );
            },
        },
        {
            header: "Assessment Status",
            id: "has_assessment",
            accessorKey: "has_assessment",
            size: 150,
            cell: ({ row }) => {
                const hasAssessment = row.original.has_assessment;
                const assessmentScore = row.original.assessment_score;
                const status = row.original.status;

                // Check if awarded OR has assessment
                const isAssessed = hasAssessment || status === "AWARDED";

                if (isAssessed) {
                    return (
                        <div className="flex flex-col">
                            <span className="text-green-600 font-medium">Assessed</span>
                            {assessmentScore !== undefined && (
                                <span className="text-xs text-gray-500">Score: {assessmentScore}</span>
                            )}
                        </div>
                    );
                }
                return <span className="text-gray-500">Not Assessed</span>;
            },
        },
        {
            header: "Submission Date",
            id: "created_datetime",
            accessorKey: "created_datetime",
            size: 150,
            cell: ({ getValue }) => {
                const date = getValue() as string;
                if (!date) return 'N/A';
                return new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            },
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

    const { deleteSubGrantSubmission, isLoading: isDeleteLoading } =
        useDeleteSubGrantSubmission(partnerSubId);

    const handleDelete = async () => {
        try {
            await deleteSubGrantSubmission();
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

                        <Link
                            href={`/dashboard/c-and-g/sub-grant/awards/submission/${partnerSubId}/preaward-assessment`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <PencilIcon />
                                Conduct Assessment
                            </Button>
                        </Link>

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

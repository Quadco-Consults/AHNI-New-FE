"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ISubGrantSubmissionPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import Link from "next/link";
import { FileCheck, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

export const shortlistedSubmissionColumns: ColumnDef<ISubGrantSubmissionPaginatedData>[] =
    [
        {
            header: "Organization Name",
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
            header: "Phone",
            id: "phone_number",
            accessorKey: "phone_number",
            size: 150,
        },
        {
            header: "Status",
            id: "status",
            size: 150,
            cell: ({ row }) => {
                const hasAssessment = row.original?.has_assessment || false;
                return (
                    <Badge
                        variant={hasAssessment ? "default" : "secondary"}
                        className={hasAssessment ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}
                    >
                        {hasAssessment ? "Assessed" : "Shortlisted"}
                    </Badge>
                );
            },
        },
        {
            header: "Score",
            id: "assessment_score",
            accessorKey: "assessment_score",
            size: 100,
            cell: ({ getValue }) => {
                const score = getValue() as number;
                return score ? `${score}/100` : "N/A";
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
    id: submissionId,
    sub_grant_id,
}: ISubGrantSubmissionPaginatedData) => {
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex gap-2 py-6">
                        <MoreOptionsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                    <div className="flex flex-col items-start justify-between gap-1">
                        <Link
                            className="w-full"
                            href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View Details
                            </Button>
                        </Link>

                        <Link
                            className="w-full"
                            href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/preaward-assessment`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <FileCheck size={16} />
                                Conduct Assessment
                            </Button>
                        </Link>

                        <Link
                            className="w-full"
                            href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/assessment`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <FileCheck size={16} />
                                View Assessment
                            </Button>
                        </Link>

                        <Link
                            className="w-full"
                            href={`/dashboard/c-and-g/sub-grant/awards/${sub_grant_id}/award-selection/${submissionId}`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2 text-green-600 hover:text-green-700"
                                variant="ghost"
                            >
                                <Award size={16} />
                                Award Sub-Grant
                            </Button>
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import { Edit } from "lucide-react";
import { formatNumberCurrency } from "@/utils/utls";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useGetAwardsBySubGrant } from "@/features/contracts-grants/controllers/subGrantAwardController";
import { Badge } from "@/components/ui/badge";

export const subGrantAwardColumns: ColumnDef<ISubGrantPaginatedData>[] = [
    {
        header: "Project ID",
        id: "project_id",
        accessorFn: (row) => {
            // Check parent_project first (real API), then project (mock data)
            if (typeof row.parent_project === 'object') {
                return row.parent_project?.grant_id || "N/A";
            }
            return typeof row.project === 'object' ? row.project?.project_id : "N/A";
        },
        size: 150,
    },

    {
        header: "Project Name",
        id: "project",
        accessorFn: (row) => {
            // Check parent_project first (real API), then project (mock data)
            if (typeof row.parent_project === 'object') {
                return row.parent_project?.name || "N/A";
            }
            return typeof row.project === 'object' ? row.project?.title : "N/A";
        },
        size: 200,
    },

    {
        header: "Sub-Grant Name",
        id: "title",
        accessorKey: "title",
        size: 200,
    },

    {
        header: "Donor",
        id: "donor",
        accessorFn: (row) => {
            // Check parent_project first (real API), then project (mock data)
            if (typeof row.parent_project === 'object') {
                return row.parent_project?.funding_source || "N/A";
            }
            return typeof row.project === 'object' ? row.project?.funding_sources?.[0]?.name : "N/A";
        },
        size: 200,
    },

    {
        header: "Award Type",
        id: "award_type",
        accessorKey: "award_type",
        size: 150,
    },

    {
        header: "Intervention Area",
        id: "intervention_area",
        accessorFn: (row) => {
            // For real API data, intervention area might not be available in parent_project
            // Check parent_project first, then project (mock data)
            if (typeof row.parent_project === 'object') {
                return row.parent_project?.intervention_area?.code || "Healthcare"; // Temporary fallback
            }
            return typeof row.project === 'object' ? row.project?.intervention_area?.code : "N/A";
        },
        size: 150,
    },

    {
        header: "Amount (USD)",
        id: "amount_usd",
        accessorFn: (row) => formatNumberCurrency(row.amount_usd, "USD"),
        size: 150,
    },

    {
        header: "Amount (NGN)",
        id: "amount_ngn",
        accessorFn: (row) => formatNumberCurrency(row.amount_ngn, "NGN"),
        size: 150,
    },

    {
        header: "Modification",
        id: "modification",
        accessorFn: () => "N/A", // TODO: Add modification data
        size: 120,
    },

    {
        header: "Monthly Spend",
        id: "monthly_spend",
        accessorFn: () => "N/A", // TODO: Calculate monthly spend
        size: 150,
    },

    {
        header: "Total Obligation",
        id: "total_obligation",
        accessorFn: () => "N/A", // TODO: Add obligation data
        size: 150,
    },

    {
        header: "Total Expenditure",
        id: "total_expenditure",
        accessorFn: () => "N/A", // TODO: Add expenditure data
        size: 150,
    },

    {
        header: "Start Date",
        id: "start_date",
        accessorKey: "start_date",
        size: 120,
    },

    {
        header: "End Date",
        id: "end_date",
        accessorKey: "end_date",
        size: 120,
    },

    {
        header: "Status",
        id: "status",
        cell: ({ row }) => {
            const status = row.original.status;
            const getStatusVariant = (status: string) => {
                switch(status) {
                    case "AWARDED":
                        return "bg-green-100 text-green-800 border-green-200";
                    case "DRAFT":
                        return "bg-gray-100 text-gray-800 border-gray-200";
                    case "SUBMISSION_OPEN":
                        return "bg-blue-100 text-blue-800 border-blue-200";
                    case "EVALUATION":
                        return "bg-yellow-100 text-yellow-800 border-yellow-200";
                    case "SUBMITTED":
                        return "bg-purple-100 text-purple-800 border-purple-200";
                    case "REJECTED":
                        return "bg-red-100 text-red-800 border-red-200";
                    default:
                        return "bg-gray-100 text-gray-800 border-gray-200";
                }
            };
            return (
                <Badge className={`${getStatusVariant(status)} border`} variant="outline">
                    {status}
                </Badge>
            );
        },
        size: 120,
    },

    {
        header: "",
        id: "action",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: ISubGrantPaginatedData) => {
    // For the awards page, the ID is the SubGrant ID
    // We link directly to award details using the same ID
    // The backend should handle showing award info for this subgrant
    const detailsLink = `/dashboard/c-and-g/sub-grant/${id}/details`;

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
                            href={detailsLink}
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
                            className="w-full"
                            href={`/dashboard/c-and-g/sub-grant/create-sub-grant?editId=${id}`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <PencilIcon />
                                Edit
                            </Button>
                        </Link>

                        <Link
                            className="w-full"
                            href={`/dashboard/c-and-g/sub-grant/awards/${id}/modify`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <Edit size={16} />
                                Modify Sub-Grant
                            </Button>
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

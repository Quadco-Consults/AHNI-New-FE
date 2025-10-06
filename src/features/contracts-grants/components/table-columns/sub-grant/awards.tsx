"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import PencilIcon from "components/icons/PencilIcon";
import { Edit } from "lucide-react";
import { formatNumberCurrency } from "utils/utls";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useGetAwardsBySubGrant } from "@/features/contracts-grants/controllers/subGrantAwardController";

export const subGrantAwardColumns: ColumnDef<ISubGrantPaginatedData>[] = [
    {
        header: "Project ID",
        id: "project_id",
        accessorFn: (row) => row.project?.project_id || "N/A",
        size: 150,
    },

    {
        header: "Project Name",
        id: "project",
        accessorFn: (row) => row.project?.title || "N/A",
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
        accessorFn: (row) => row.project?.funding_sources?.[0]?.name || "N/A",
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
        accessorFn: (row) => row.project?.intervention_area || "N/A",
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
        accessorKey: "status",
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

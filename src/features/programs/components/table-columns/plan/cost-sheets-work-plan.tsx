import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TWorkPlanPaginatedResponse } from "definations/program-types/work-plan";
import { Button } from "@/components/ui/button";
import { formatNumberCurrency } from "@/utils/utls";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const costSheetsWorkPlanColumns: ColumnDef<TWorkPlanPaginatedResponse>[] = [
    {
        header: "Project Name",
        accessorKey: "project",
        size: 250,
    },
    {
        header: "Project Partners",
        accessorKey: "project_partners",
        accessorFn: (data) => `${data?.project_partners.join(", ")}`,
        size: 200,
    },
    {
        header: "Financial Year",
        accessorKey: "financial_year",
        size: 150,
        cell: ({ row }) => (
            <div className="text-center">
                <Badge variant="outline">{row.original.financial_year}</Badge>
            </div>
        ),
    },
    {
        header: "Budget",
        accessorFn: ({ budget, currency }) =>
            formatNumberCurrency(budget, currency),
        size: 150,
    },
    {
        header: "Activities Count",
        accessorKey: "activities_count",
        size: 150,
        cell: ({ row }) => {
            const count = row.original.activities_count || 0;
            return (
                <div className="text-center">
                    <Badge variant="secondary">{count} {count === 1 ? 'activity' : 'activities'}</Badge>
                </div>
            );
        },
    },
    {
        header: "",
        size: 120,
        id: "actions",
        cell: ({ row }) => (
            <div className="flex items-center justify-end">
                <Link href={`/dashboard/programs/plan/cost-sheets/${row.original.id}`}>
                    <Button variant="ghost" className="flex gap-2">
                        View Activities
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        ),
    },
];

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TActivity } from "@/features/programs/types/work-plan";
import { Button } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const costSheetsActivitiesColumns = (workPlanId: string): ColumnDef<TActivity>[] => [
    {
        header: "Activity #",
        accessorKey: "activity_number",
        size: 120,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.activity_number || "N/A"}
            </div>
        ),
    },
    {
        header: "Budget Line",
        accessorKey: "budget_line",
        size: 120,
    },
    {
        header: "Activity Description",
        accessorKey: "activity",
        size: 300,
        cell: ({ row }) => (
            <div className="text-sm line-clamp-2" title={row.original.activity}>
                {row.original.activity}
            </div>
        ),
    },
    {
        header: "Lead Department",
        accessorKey: "lead_dept",
        size: 150,
    },
    {
        header: "Lead Person",
        accessorKey: "lead_person",
        size: 150,
    },
    {
        header: "Unit Cost (₦)",
        accessorKey: "unit_cost_ngn",
        size: 150,
        cell: ({ row }) => {
            const unitCost = row.original.unit_cost_ngn;
            return (
                <div className="text-right font-medium">
                    {unitCost ? `₦${Number(unitCost).toLocaleString()}` : "N/A"}
                </div>
            );
        },
    },
    {
        header: "Total Amount (₦)",
        accessorKey: "total_amount_ngn",
        size: 180,
        cell: ({ row }) => {
            const total = row.original.total_amount_ngn;
            return (
                <div className="text-right font-semibold text-green-700">
                    ₦{Number(total).toLocaleString()}
                </div>
            );
        },
    },
    {
        header: "Cost Sheet Status",
        id: "cost_sheet_status",
        size: 150,
        cell: () => {
            // TODO: This will be updated once we fetch cost sheet data
            // For now, show as "Missing" for all activities
            return (
                <div className="text-center">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        No Cost Sheet
                    </Badge>
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
                <Link href={`/dashboard/programs/plan/cost-sheets/${workPlanId}/${row.original.id}`}>
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                        Manage Cost Sheet
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        ),
    },
];

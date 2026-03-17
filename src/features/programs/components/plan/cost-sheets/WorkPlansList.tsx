"use client";
import Card from "@/components/Card";
import { useState } from "react";
import { useGetAllWorkPlanQuery } from "@/features/programs/controllers/workPlanController";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { costSheetsWorkPlanColumns } from "@/features/programs/components/table-columns/plan/cost-sheets-work-plan";
import TableFilters from "@/components/Table/TableFilters";
import { useDebounce } from "ahooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Cost Sheets", icon: false },
];

export default function CostSheetsWorkPlansList() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [financialYear, setFinancialYear] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 1000,
    });

    // Generate financial year options (last 5 years + next 2 years)
    const generateFinancialYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 2; i++) {
            years.push(`${i}/${i + 1}`);
        }
        return years.reverse(); // Most recent first
    };

    const financialYears = generateFinancialYears();

    const { data: workPlan, isFetching } = useGetAllWorkPlanQuery({
        page,
        size: 10,
        project_title: debouncedSearchQuery,
        financial_year: financialYear,
    });

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <Card>
                {/* Header */}
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Activity Cost Sheets
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Select a work plan to view and manage activity cost sheets
                    </p>
                </div>

                {/* Financial Year Filter */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="financial-year">Financial Year:</Label>
                            <Select value={financialYear || "all"} onValueChange={(value) => setFinancialYear(value === "all" ? "" : value)}>
                                <SelectTrigger id="financial-year" className="w-48">
                                    <SelectValue placeholder="Select financial year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {financialYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {financialYear && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFinancialYear("")}
                            >
                                Clear Filter
                            </Button>
                        )}
                    </div>
                </div>

                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        data={workPlan?.data.results || []}
                        columns={costSheetsWorkPlanColumns}
                        isLoading={isFetching}
                        pagination={{
                            total: workPlan?.data.pagination.count ?? 0,
                            pageSize: workPlan?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}

"use client";
import Card from "@/components/Card";
import { useState } from "react";
import { useGetAllWorkPlanQuery } from "@/features/programs/controllers/workPlanController";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { costSheetsWorkPlanColumns } from "@/features/programs/components/table-columns/plan/cost-sheets-work-plan";
import { useDebounce } from "ahooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

    const hasActiveFilters = searchQuery || financialYear;

    const clearAllFilters = () => {
        setSearchQuery("");
        setFinancialYear("");
    };

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            {/* Header Section */}
            <Card className="p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Cost Sheets</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        View and manage detailed cost sheets for work plan activities. Select a work plan to explore activity-level budgets and expenses.
                    </p>
                </div>
            </Card>

            {/* Filters and Table Section */}
            <Card>
                {/* Unified Filters Section */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Filters
                            </h3>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="text-xs"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="search" className="text-xs font-medium text-gray-700">
                                    Search Projects
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by project name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Financial Year Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="financial-year" className="text-xs font-medium text-gray-700">
                                    Financial Year
                                </Label>
                                <Select
                                    value={financialYear || "all"}
                                    onValueChange={(value) => setFinancialYear(value === "all" ? "" : value)}
                                >
                                    <SelectTrigger id="financial-year">
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
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="p-6">
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
                </div>
            </Card>
        </div>
    );
}

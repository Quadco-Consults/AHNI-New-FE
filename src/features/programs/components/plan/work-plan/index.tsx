"use client";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import {
    useGetAllWorkPlanQuery,
    useLazyDownloadWorkPlanTemplateQuery,
} from "@/features/programs/controllers/workPlanController";
import DataTable from "@/components/Table/DataTable";
import { toast } from "sonner";
import { DownloadIcon, Search } from "lucide-react";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { workPlanColumns } from "@/features/programs/components/table-columns/plan/work-plan";
import { useDebounce } from "ahooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Work Plan", icon: false },
];

export default function WorkPlan() {
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

    const dispatch = useAppDispatch();

    // TanStack Query hook for template download (disabled by default)
    const { refetch: downloadTemplate, isFetching: isDownloading } = useLazyDownloadWorkPlanTemplateQuery(false);

    const { data: workPlan, isFetching } = useGetAllWorkPlanQuery({
        page,
        size: 10,
        project_title: debouncedSearchQuery,
        financial_year: financialYear,
    });

    const handleDownloadTemplate = async () => {
        try {
            // TanStack Query refetch will trigger the download automatically
            await downloadTemplate();
        } catch (error: any) {
            toast.error(error?.message ?? "Something went wrong");
        }
    };

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
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Work Plans</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage annual work plans for projects and programs. Upload, view, and track work plan activities and budgets.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            type="button"
                            onClick={handleDownloadTemplate}
                            disabled={isDownloading}
                        >
                            <DownloadIcon className="w-4 h-4" />
                            {isDownloading ? "Downloading..." : "Download Template"}
                        </Button>

                        <Button
                            className="flex items-center gap-2"
                            type="button"
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type: DialogType.WorkPlanUpload,
                                        dialogProps: {
                                            header: "Upload New Work plan",
                                            width: "max-w-lg",
                                        },
                                    })
                                );
                            }}
                        >
                            <AddSquareIcon />
                            Upload New Work Plan
                        </Button>
                    </div>
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
                        columns={workPlanColumns}
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

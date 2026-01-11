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
import { DownloadIcon } from "lucide-react";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { workPlanColumns } from "@/features/programs/components/table-columns/plan/work-plan";
import TableFilters from "@/components/Table/TableFilters";
import { useDebounce } from "ahooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    className="flex gap-2 py-6"
                    type="button"
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading}
                >
                    <DownloadIcon className="w-4 h-4" />
                    {isDownloading ? "Downloading..." : "Download Template"}
                </Button>

                <Button
                    className="flex gap-2 py-6"
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

            <Card>
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
                        columns={workPlanColumns}
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

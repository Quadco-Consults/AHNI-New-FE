"use client";
import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useState } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import {
    useGetAllWorkPlanQuery,
    useLazyDownloadWorkPlanTemplateQuery,
} from "@/features/programs/controllers/workPlanController";
import DataTable from "components/Table/DataTable";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { workPlanColumns } from "@/features/programs/components/table-columns/plan/work-plan";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Work Plan", icon: false },
];

export default function WorkPlan() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 1000,
    });

    const dispatch = useAppDispatch();
    
    // TanStack Query hook for template download (disabled by default)
    const { refetch: downloadTemplate, isFetching: isDownloading } = useLazyDownloadWorkPlanTemplateQuery(false);

    const { data: workPlan, isFetching } = useGetAllWorkPlanQuery({
        page,
        size: 10,
        project_title: debouncedSearchQuery,
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

            <div className="flex justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex gap-2 py-6 w-40">
                            Actions
                            <ArrowDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Button
                                variant="ghost"
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

                            <Button
                                className="flex items-center gap-2 justify-start"
                                variant="ghost"
                                onClick={handleDownloadTemplate}
                            >
                                <DownloadIcon className="text-green-500" />
                                Download Template
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Card>
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

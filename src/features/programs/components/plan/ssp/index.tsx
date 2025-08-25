"use client";
import Link from "next/link";
import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { RouteEnum } from "constants/RouterConstants";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import { openDialog } from "store/ui";
import UploadIcon from "components/icons/UploadIcon";
import DataTable from "components/Table/DataTable";
import { useGetAllSupervisionPlan } from "@/features/programs/controllers/supervisionPlanController";
import BreadcrumbCard from "components/Breadcrumb";
import { useState } from "react";
import { supportiveSupervisionPlanColumns } from "@/features/programs/components/table-columns/plan/supportive-supervision-plan";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";

const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supportive Supervision Plan", icon: false },
];

export default function SupportiveSupervisionPlan() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 1000,
    });

    const { data: supervisionPlan, isFetching } = useGetAllSupervisionPlan(
        { page, size: 10, search: debouncedSearchQuery }
    );

    const dispatch = useAppDispatch();

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex gap-2 py-6">
                            <AddSquareIcon />
                            New Supervision plan
                            <ArrowDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Button
                                className="w-full flex gap-2 items-center justify-start"
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        openDialog({
                                            type: DialogType.SspUpload,
                                            dialogProps: {
                                                header: "Upload New Document",
                                                width: "max-w-md",
                                            },
                                        })
                                    );
                                }}
                            >
                                <UploadIcon />
                                Upload
                            </Button>

                            <Link
                                href={
                                    RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION
                                }
                            >
                                <Button
                                    className="w-full flex gap-2 items-center justify-start"
                                    variant="ghost"
                                >
                                    <AddSquareIcon fillColor="#FF0000" />
                                    Create Manually
                                </Button>
                            </Link>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        data={supervisionPlan?.data.results || []}
                        columns={supportiveSupervisionPlanColumns}
                        isLoading={isFetching}
                        pagination={{
                            total: supervisionPlan?.data.pagination.count ?? 0,
                            pageSize:
                                supervisionPlan?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}

import { Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { RouteEnum } from "constants/RouterConstants";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import { openDialog } from "store/ui";
import UploadIcon from "components/icons/UploadIcon";
import DataTable from "components/Table/DataTable";
import { useGetAllSupervisionPlanQuery } from "services/program/plan/supervision-plan";
import BreadcrumbCard from "components/shared/Breadcrumb";
import { useState } from "react";
import { supportiveSupervisionPlanColumns } from "components/Table/columns/program/plan/supportive-supervision-plan";

const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supportive Supervision Plan", icon: false },
];

export default function SupportiveSupervisionPlan() {
    const [page, setPage] = useState(1);

    const { data: supervisionPlan, isFetching } = useGetAllSupervisionPlanQuery(
        { page, size: 10 }
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
                                to={
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

            <Card className="space-y-5">
                <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

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
            </Card>
        </div>
    );
}

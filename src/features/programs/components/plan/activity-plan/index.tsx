"use client";
import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useState } from "react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import DataTable from "components/Table/DataTable";
import {
  useGetAllActivityPlans,
  useDownloadActivityPlanTemplate,
} from "@/features/programs/controllers/activityPlanController";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import UploadIcon from "components/icons/UploadIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { activityPlanColumns } from "@/features/programs/components/table-columns/plan/activity-plan";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Activity Plan", icon: false },
];

export default function ActivityPlan() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  const { data: activityPlan, isFetching } = useGetAllActivityPlans({
    page,
    size: 10,
    search: debouncedSearchQuery,
  });

  const { refetch: downloadTemplate, isFetching: isDownloading } = useDownloadActivityPlanTemplate(false);

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const dispatch = useAppDispatch();

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex justify-end'>
        <Popover>
          <PopoverTrigger asChild>
            <Button className='flex gap-2 py-6 w-40'>
              Actions
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link href={RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN}>
                <Button
                  className='flex gap-2 py-6'
                  variant='ghost'
                  type='button'
                >
                  <AddSquareIcon fillColor='#FF0000' />
                  Create Manually
                </Button>
              </Link>

              <Button
                className='flex gap-2 py-6'
                variant='ghost'
                type='button'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ActivityUpload,
                      dialogProps: {
                        header: "Upload An Activity",
                        width: "max-w-lg",
                      },
                    })
                  );
                }}
              >
                <UploadIcon />
                Upload Activity Plan
              </Button>

              <Button
                className='flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
              >
                <DownloadIcon className='text-green-500' />
                Download Template
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
          <DataTable
            columns={activityPlanColumns}
            data={activityPlan?.data.results || []}
            isLoading={isFetching}
            pagination={{
              total: activityPlan?.data.pagination.count ?? 0,
              pageSize: activityPlan?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}

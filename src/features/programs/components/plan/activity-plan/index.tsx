"use client";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { activityPlanListColumns } from "@/features/programs/components/table-columns/plan/activity-plan-list";
import { useDebounce } from "ahooks";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllWorkPlan } from "@/features/programs/controllers/workPlanController";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UploadIcon from "@/components/icons/UploadIcon";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { toast } from "sonner";
import {
  useDownloadActivityPlanTemplate,
} from "@/features/programs/controllers/activityPlanController";

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

  const dispatch = useAppDispatch();

  const { data: workPlan, isFetching } = useGetAllWorkPlan({
    page,
    size: 10,
    project_title: debouncedSearchQuery,
  });

  const { refetch: downloadTemplate, isFetching: isDownloading } =
    useDownloadActivityPlanTemplate(false);

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex justify-end gap-2'>
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
            columns={activityPlanListColumns}
            data={workPlan?.data?.results || []}
            isLoading={isFetching}
            pagination={{
              total: workPlan?.data?.pagination?.count ?? 0,
              pageSize: workPlan?.data?.pagination?.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}

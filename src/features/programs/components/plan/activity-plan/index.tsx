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
  useDownloadActivityPlansMutation,
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
import { FilterForm } from "@/components/FilterForm";

import { FilterField } from "src";
import { useGetAllFinancialYears } from "@/features/modules/controllers";
import { useGetAllProjects } from "@/features/projects/controllers";
import { useGetAllWorkPlanQuery } from "@/features/programs/controllers/workPlanController";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Activity Plan", icon: false },
];

export default function ActivityPlan() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  const { downloadActivityPlans, isLoading: downloading } =
    useDownloadActivityPlansMutation();

  const { data: activityPlan, isFetching } = useGetAllActivityPlans({
    page,
    size: 10,
    search: debouncedSearchQuery,
    ...filters,
  });

  const { data: financialYear } = useGetAllFinancialYears({
    page: 1,
    size: 1000000,
  });
  const { data: project } = useGetAllProjects({
    page: 1,
    size: 1000000,
  });

  const { data: workPlan } = useGetAllWorkPlanQuery({
    page,
    size: 10,
    project_title: debouncedSearchQuery,
  });

  // @ts-ignore
  const financialYearOptions = financialYear?.data.results.map(
    // @ts-ignore
    ({ year, id }) => ({
      label: year,
      value: id,
    })
  );

  // @ts-ignore
  const projectOptions = project?.data.results.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  // @ts-ignore
  const workPlanOptions = workPlan?.data.results.map(
    // @ts-ignore
    ({ financial_year, project, id }) => ({
      label: `${project}-${financial_year}`,
      value: id,
    })
  );

  const activityPlanFilters: FilterField[] = [
    {
      name: "approval_status",
      label: "Approval Status",
      type: "enum",
      enumValues: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
      ],
    },
    {
      name: "status",
      label: "Activity Status",
      type: "enum",
      enumValues: [
        { label: "Done", value: "DONE" },
        { label: "Ongoing", value: "ONGOING" },
        {
          label: "Started but not Finished",
          value: "STARTED_BUT_NOT_FINISHED",
        },
        { label: "Not Done", value: "NOT_DONE" },
        { label: "No Longer Applicable", value: "NO_LONGER_APPLICABLE" },
      ],
    },
    {
      name: "urgency_level",
      label: "Urgency Level",
      type: "enum",
      enumValues: [
        { label: "Low", value: "LOW" },
        { label: "Medium", value: "MEDIUM" },
        { label: "High", value: "HIGH" },
        { label: "Emergency", value: "EMERGENCY" },
      ],
    },
    {
      name: "is_unplanned",
      label: "Activity Type",
      type: "enum",
      enumValues: [
        { label: "Planned", value: "false" },
        { label: "Unplanned", value: "true" },
      ],
    },
    {
      name: "month",
      label: "Month",
      type: "enum",
      enumValues: [
        { label: "January", value: "January" },
        { label: "February", value: "February" },
        { label: "March", value: "March" },
        { label: "April", value: "April" },
        { label: "May", value: "May" },
        { label: "June", value: "June" },
        { label: "July", value: "July" },
        { label: "August", value: "August" },
        { label: "September", value: "September" },
        { label: "October", value: "October" },
        { label: "November", value: "November" },
        { label: "December", value: "December" },
      ],
    },
    {
      name: "financial_year",
      label: "Financial Year",
      type: "enum",
      enumValues: financialYearOptions || [],
    },
    {
      name: "project",
      label: "Project",
      type: "enum",
      enumValues: projectOptions || [],
    },
    {
      name: "work_plan",
      label: "Work Plan",
      type: "enum",
      enumValues: workPlanOptions || [],
    },
  ];

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

  const dispatch = useAppDispatch();

  const handleDownload = async () => {
    try {
      const blob = await downloadActivityPlans({
        search: debouncedSearchQuery,
        ...filters,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "activityPlans.csv"; // Or correct extension
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex justify-end gap-2'>
        <div className=''>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className='flex gap-2 py-6'
          >
            {downloading ? "Downloading..." : "Download ActivityPlans"}
          </Button>
        </div>
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
        <TableFilters
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          filterAction={() => setFilterDrawerOpen(true)}
        >
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
          {isFilterDrawerOpen && (
            <FilterForm
              filters={activityPlanFilters}
              values={filters}
              onChange={setFilters}
              onClose={() => setFilterDrawerOpen(false)}
            />
          )}
        </TableFilters>
      </Card>
    </div>
  );
}

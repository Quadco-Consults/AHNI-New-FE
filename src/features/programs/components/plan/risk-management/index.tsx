"use client";
import Link from "next/link";
import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import { useGetAllRiskManagementPlans, useDownloadRiskManagementPlanTemplate } from "@/features/programs/controllers/riskPlansController";
import { useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { riskManagementPlanColumns } from "@/features/programs/components/table-columns/plan/risk-management-plan";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import UploadIcon from "components/icons/UploadIcon";
import { DownloadIcon } from "lucide-react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { toast } from "sonner";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Risk Management Plan", icon: false },
];

export default function RiskManagementPage() {
  const [page, setPage] = useState(1);
  const [searchController, setSearchController] = useState("");
  const [shouldDownload, setShouldDownload] = useState(false);
  const dispatch = useAppDispatch();

  const debouncedSearchController = useDebounce(searchController, {
    wait: 1000,
  });

  const { data: riskManagementPlan, isFetching } = useGetAllRiskManagementPlans(
    {
      page,
      size: 10,
      search: debouncedSearchController,
    }
  );

  // Download template hook
  const { isLoading: isDownloading, isSuccess: downloadSuccess, isError: downloadError } =
    useDownloadRiskManagementPlanTemplate(shouldDownload);

  // Reset download state after completion
  if (shouldDownload && (downloadSuccess || downloadError)) {
    setShouldDownload(false);
    if (downloadSuccess) {
      toast.success("Template downloaded successfully");
    }
    if (downloadError) {
      toast.error("Failed to download template");
    }
  }

  const handleDownloadTemplate = () => {
    toast.info("Downloading template...");
    setShouldDownload(true);
  };

  const handleUploadClick = () => {
    dispatch(
      openDialog({
        type: DialogType.RiskManagementPlanUpload,
        dialogProps: {
          ...mediumDailogScreen,
        },
      })
    );
  };

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
              <Link
                href='/dashboard/programs/plan/risk-management-plan/create'
                className='block w-full'
              >
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
                onClick={handleUploadClick}
              >
                <UploadIcon />
                Upload
              </Button>

              <Button
                className='flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={handleDownloadTemplate}
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
          onSearchChange={(e) => setSearchController(e.target.value)}
        >
          <DataTable
            data={riskManagementPlan?.data.results || []}
            columns={riskManagementPlanColumns}
            isLoading={isFetching}
            pagination={{
              total: riskManagementPlan?.data.pagination.count ?? 0,
              pageSize: riskManagementPlan?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}

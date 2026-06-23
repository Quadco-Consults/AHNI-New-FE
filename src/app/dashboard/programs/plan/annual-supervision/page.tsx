"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCard from "@/components/Breadcrumb";
import AnnualPlanUpload from "@/features/programs/components/plan/annual-supervision/AnnualPlanUpload";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "ahooks";
import { annualSupervisionColumns } from "@/features/programs/components/table-columns/plan/annual-supervision";
import { useGetAllAnnualPlans } from "@/features/programs/controllers/annualSupervisionPlanController";
import Link from "next/link";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Annual Supervision Plan", icon: false },
];

const AnnualSupervisionPlanPage = () => {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  const { data: annualPlans, isLoading } = useGetAllAnnualPlans({
    page,
    page_size: 10,
    search: debouncedSearchQuery,
  });

  const handleCreateNew = () => {
    router.push("/dashboard/programs/plan/annual-supervision/create");
  };

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex gap-2 py-6">
              <AddSquareIcon />
              New Annual Plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="flex flex-col items-start justify-between gap-1">
              <Button
                className="w-full flex gap-2 items-center justify-start"
                variant="ghost"
                type="button"
                onClick={() => setUploadDialogOpen(true)}
              >
                <UploadIcon />
                Upload
              </Button>

              <Link href="/dashboard/programs/plan/annual-supervision/create">
                <Button
                  className="w-full flex gap-2 items-center justify-start"
                  variant="ghost"
                >
                  <AddSquareIcon fillColor="hsl(var(--primary))" />
                  Create Manually
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Annual Supervision Plan</DialogTitle>
            <DialogDescription>
              Upload an Excel file containing your annual supervision plan data
            </DialogDescription>
          </DialogHeader>
          <AnnualPlanUpload onSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>

      <Card>
        <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
          <DataTable
            data={annualPlans?.data?.results || []}
            columns={annualSupervisionColumns}
            isLoading={isLoading}
            pagination={{
              total: annualPlans?.data?.pagination?.count ?? 0,
              pageSize: annualPlans?.data?.pagination?.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
};

export default AnnualSupervisionPlanPage;
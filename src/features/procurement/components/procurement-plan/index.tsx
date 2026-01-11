"use client";

"use client";

import Card from "@/components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard from "@/components/Breadcrumb";
import UploadIcon from "@/components/icons/UploadIcon";
import { useState } from "react";
import ProcurementPlanUploadModal from "./components/ProcurementPlanUploadModal";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import IconButton from "@/components/IconButton";
import { Icon } from "@iconify/react";
import { useLazyDownloadProcurementPlanTemplateQuery, useGetAllProcurementPlans, useDeleteProcurementPlan } from "../../controllers/procurementPlanController";
import { toast } from "sonner";
import { DownloadIcon, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllFinancialYears } from "../../../modules/controllers/config/financialYearController";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProcurementPlan() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch financial years
  const { data: financialYearsData } = useGetAllFinancialYears({
    page: 1,
    size: 100, // Get all financial years
    search: "",
    enabled: true
  });

  // TanStack Query hook for template download (disabled by default)
  const { refetch: downloadTemplate, isFetching: isDownloading } = useLazyDownloadProcurementPlanTemplateQuery(false);

  // Check if user is authenticated (simplified)
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for now

  // Fetch procurement plans data only if authenticated
  const { data: procurementData, isLoading, error, isError } = useGetAllProcurementPlans({
    page,
    size: 20,
    search: searchQuery,
    year: selectedYear,
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  // Debug logging to understand procurement plan data structure
  if (procurementData?.data?.results?.length > 0) {
    console.log("=== PROCUREMENT PLAN LIST DEBUG ===");
    console.log("First procurement plan data:", procurementData.data.results[0]);
    console.log("Available fields:", Object.keys(procurementData.data.results[0]));
    console.log("Project field:", procurementData.data.results[0].project);
    console.log("Financial Year field:", procurementData.data.results[0].financial_year);
    console.log("Description field:", procurementData.data.results[0].description);
    console.log("Name field:", procurementData.data.results[0].name);
    console.log("Title field:", procurementData.data.results[0].title);
    console.log("Plan name field:", procurementData.data.results[0].plan_name);
    console.log("Plan number field:", procurementData.data.results[0].plan_number);
    console.log("====================================");
  }

  const handleDownloadTemplate = async () => {
    try {
      // TanStack Query refetch will trigger the download automatically
      await downloadTemplate();
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year === "all" ? "" : year);
    setPage(1); // Reset to first page when filtering
  };


  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Plan", icon: false },
  ];

  return (
    <section className='min-h-screen space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex items-center justify-end gap-4'>
        <Popover>
          <PopoverTrigger asChild>
            <Button className='flex gap-2 py-6'>
              <AddSquareIcon />
              New Procurement Plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Button
                className='w-full flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={() => setModalOpen(true)}
              >
                <UploadIcon /> Upload Procurement plan
              </Button>
              <Button
                className='w-full flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
              >
                <DownloadIcon className="text-green-500" />
                {isDownloading ? "Downloading..." : "Download Template"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Card className='space-y-5'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {/* Search Input */}
            <div className='flex items-center w-80 px-2 py-2 border rounded-lg'>
              <SearchIcon />
              <input
                placeholder='Search procurement plans...'
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                className='ml-2 h-full w-full border-none bg-none focus:outline-none outline-none'
              />
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Financial Year:</span>
              <Select value={selectedYear === "" ? "all" : selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Financial Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Financial Years</SelectItem>
                  {financialYearsData?.results?.map((financialYear) => (
                    <SelectItem key={financialYear.id} value={financialYear.id}>
                      {financialYear.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedYear) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("");
                setPage(1);
              }}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Clear Filters
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-600">
              Please log in to view procurement plans.
            </p>
          </div>
        )}

        {isAuthenticated && isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">
              Error loading procurement plans: {error?.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Results Summary */}
        {isAuthenticated && !isError && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Showing {procurementData?.data?.results?.length || 0} of{" "}
                  {procurementData?.data?.pagination?.total || 0} procurement plans
                  {selectedYear && (
                    <span className="text-blue-600 font-medium"> for {selectedYear}</span>
                  )}
                  {searchQuery && (
                    <span className="text-green-600 font-medium"> matching "{searchQuery}"</span>
                  )}
                </>
              )}
            </div>

            {/* Active Filters Indicator */}
            {(searchQuery || selectedYear) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>
                {selectedYear && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Year: {selectedYear}
                  </span>
                )}
                {searchQuery && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Search: {searchQuery}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <DataTable
          data={procurementData?.data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />

        {/* Pagination Controls */}
        {procurementData?.data?.pagination && procurementData.data.pagination.total > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Page {page} of {procurementData.data.pagination.pages || 1}
              <span className="ml-2 text-gray-500">
                ({procurementData.data.pagination.total} total items)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= (procurementData.data.pagination.pages || 1) || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <ProcurementPlanUploadModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          // @ts-ignore
          // onOk={(data: any) => formatRawData(data)}
          onOK={() => {}}
        />
      </Card>
    </section>
  );
}

const columns: ColumnDef<any>[] = [
  {
    header: "S/N",
    accessorKey: "id",
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Procurement Plan",
    accessorKey: "plan_name",
    cell: ({ row }) => {
      const data = row.original;
      // Try multiple possible field names for procurement plan title/name
      const planName = data?.plan_name || data?.name || data?.title ||
                       data?.plan_title || data?.procurement_plan_name ||
                       data?.plan_number || data?.description;

      if (typeof planName === 'object' && planName !== null) {
        return planName.name || planName.title || planName.id || "Unknown Plan";
      }

      // If still no name found, create a descriptive name from project and year
      if (!planName || planName === "N/A") {
        const project = data?.project;
        const year = data?.financial_year;

        let projectName = "Unknown Project";
        if (typeof project === 'object' && project !== null) {
          projectName = project.title || project.name || project.project_name || "Unknown Project";
        } else if (typeof project === 'string') {
          projectName = project;
        }

        let yearName = "Unknown Year";
        if (typeof year === 'object' && year !== null) {
          yearName = year.year || year.name || "Unknown Year";
        } else if (typeof year === 'string') {
          yearName = year;
        }

        return `${projectName} - ${yearName} Procurement Plan`;
      }

      return String(planName || "Procurement Plan");
    },
  },
  {
    header: "Project",
    accessorKey: "project",
    size: 200,
    cell: ({ row }) => {
      const data = row.original;
      // Try to get project title/name from multiple possible fields
      const project = data?.project;
      const projectDetail = data?.project_detail;
      const projectName = data?.project_name;
      const projectTitle = data?.project_title;

      // First check if there's a project_detail object (common pattern in API responses)
      if (typeof projectDetail === 'object' && projectDetail !== null) {
        return projectDetail.title || projectDetail.name || projectDetail.project_name ||
               projectDetail.project_title || "Unknown Project";
      }

      // Check for direct project name/title fields
      if (projectName && projectName !== "N/A") {
        return String(projectName);
      }
      if (projectTitle && projectTitle !== "N/A") {
        return String(projectTitle);
      }

      // Then check the project field itself
      if (typeof project === 'object' && project !== null) {
        return project.title || project.name || project.project_name ||
               project.project_title || project.id || "Unknown Project";
      }

      // Fallback to string value if it's not empty
      if (project && project !== "N/A") {
        return String(project);
      }

      return "Unknown Project";
    },
  },
  {
    header: "Financial Year",
    accessorKey: "financial_year",
    size: 100,
    cell: ({ row }) => {
      const data = row.original;
      // Try to get financial year from multiple possible fields
      const financialYear = data?.financial_year;
      const fyName = data?.financial_year_name;
      const year = data?.year;

      // Check for direct financial year name field
      if (fyName && fyName !== "N/A") {
        return String(fyName);
      }

      // Check if financial_year is an object
      if (typeof financialYear === 'object' && financialYear !== null) {
        return financialYear.year || financialYear.name || financialYear.financial_year ||
               financialYear.id || "Unknown Year";
      }

      // Check for direct year field
      if (year && year !== "N/A") {
        return String(year);
      }

      // Fallback to string value if it's not empty
      if (financialYear && financialYear !== "N/A") {
        return String(financialYear);
      }

      return "Unknown Year";
    },
  },
  {
    header: "Project Budget",
    accessorKey: "project.budget",
    size: 100,
    cell: ({ row }) => {
      // Access project budget from the project object
      const project = row.original?.project;
      let budget = null;

      if (typeof project === 'object' && project !== null) {
        budget = project.budget || project.approved_budget || project.total_budget;
      }

      if (budget && budget > 0) {
        return `$${budget.toLocaleString()}`;
      }
      return "N/A";
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 50,
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

// eslint-disable-next-line no-unused-vars
const ActionListAction = ({ data }: any) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteProcurementPlan, isLoading: isDeleting } = useDeleteProcurementPlan(data?.id);

  const handleDelete = async () => {
    try {
      await deleteProcurementPlan();
      toast.success("Procurement plan deleted successfully!");
      setShowDeleteDialog(false);
      // Refresh the page or refetch data
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete procurement plan");
    }
  };

  return (
    <>
      <div className='flex gap-2 items-center justify-center'>
        <Link
          href={`/dashboard/procurement/procurement-plan/${data?.id || 1}`}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary border'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>

        <button
          className='bg-red-50 hover:bg-red-100 hover:text-red-600 border border-red-200 rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          <Trash2 size={15} className="text-red-500" />
        </button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Procurement Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this procurement plan? This action cannot be undone.
              {data?.description && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <strong>Plan:</strong> {data.description}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

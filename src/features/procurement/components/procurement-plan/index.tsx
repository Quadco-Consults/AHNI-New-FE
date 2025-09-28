"use client";

"use client";

import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import SearchIcon from "components/icons/SearchIcon";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/Breadcrumb";
import UploadIcon from "components/icons/UploadIcon";
import { useState } from "react";
import ProcurementPlanUploadModal from "./components/ProcurementPlanUploadModal";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import { useLazyDownloadProcurementPlanTemplateQuery, useGetAllProcurementPlans } from "../../controllers/procurementPlanController";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { useGetAllFinancialYears } from "../../../modules/controllers/config/financialYearController";

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
              <Icon icon="ph:x" />
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
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original?.description;
      if (typeof description === 'object' && description !== null) {
        return description.name || description.title || description.id || "Unknown";
      }
      return String(description || "N/A");
    },
  },
  {
    header: "Project",
    accessorKey: "project",
    cell: ({ row }) => {
      // Try to get project name from project object or fallback to ID
      const project = row.original?.project;
      if (typeof project === 'object' && project !== null) {
        return project.name || project.title || project.id || "Unknown Project";
      }
      return String(project || "N/A");
    },
  },
  {
    header: "Financial Year",
    accessorKey: "financial_year",
    size: 100,
    cell: ({ row }) => {
      // Try to get financial year name from object or fallback to ID
      const financialYear = row.original?.financial_year;
      if (typeof financialYear === 'object' && financialYear !== null) {
        return financialYear.year || financialYear.name || financialYear.id || "Unknown Year";
      }
      return String(financialYear || "N/A");
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
  return (
    <div className='flex gap-2 items-center justify-center'>
      <Link
        href={`/dashboard/procurement/procurement-plan/${data?.id || 1}`}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary border'>
          <Icon icon='ph:eye-duotone' fontSize={15} />
        </IconButton>
      </Link>
    </div>
  );
};

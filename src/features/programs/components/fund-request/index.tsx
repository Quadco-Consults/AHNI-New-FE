"use client";
import Link from "next/link";
import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useMemo } from "react";
import { FundRequestPaginatedData } from "@/features/programs/types/fund-request";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Fund Request", icon: false },
];

export default function FundRequest() {
  const { data: fundRequests, isLoading: isFetching } = useGetAllFundRequests({
    page: 1,
    size: 1000, // Get all to group by project
    enabled: true,
  });

  // Group fund requests by project
  const projectsWithFundRequests = useMemo(() => {
    const fundRequestsList = fundRequests?.data?.results || [];
    const projectMap = new Map();

    fundRequestsList.forEach((request: FundRequestPaginatedData) => {
      // Extract project data - handle both object and string cases
      let projectId: string;
      let projectTitle: string;
      let projectStartDate: string;
      let projectEndDate: string;

      if (typeof request.project === 'object' && request.project !== null) {
        projectId = request.project.id || request.project.project_id || '';
        projectTitle = request.project.title || 'N/A';
        projectStartDate = request.project.start_date || 'N/A';
        projectEndDate = request.project.end_date || 'N/A';
      } else {
        // If project is a string, it's likely the project ID (UUID)
        projectId = request.project || '';
        projectTitle = request.project || 'N/A';
        projectStartDate = 'N/A';
        projectEndDate = 'N/A';
      }

      // Skip if no valid project ID
      if (!projectId) return;

      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          projectId,
          projectTitle,
          state: typeof request.location === 'object' ? request.location.state : 'N/A',
          month: request.month,
          year: request.year,
          projectStartDate,
          projectEndDate,
          approvalStage: request.status,
          fundRequests: [],
        });
      }

      projectMap.get(projectId).fundRequests.push(request);
    });

    return Array.from(projectMap.values());
  }, [fundRequests]);

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex justify-end gap-3'>
        <Link href={RouteEnum.PROGRAM_FUND_REQUEST_CREATE}>
          <Button className='flex gap-2 py-6'>
            <AddSquareIcon />
            New Fund Request
          </Button>
        </Link>
      </div>

      <Card className='space-y-5'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={projectsWithFundRequests}
          columns={projectColumns}
          isLoading={isFetching}
        />
      </Card>
    </div>
  );
}

// Project columns for the main list (matching screenshot 1)
const projectColumns: ColumnDef<any>[] = [
  {
    header: "Project Title",
    accessorKey: "projectTitle",
    size: 200,
  },
  {
    header: "State",
    accessorKey: "state",
    size: 150,
  },
  {
    header: "Project ID",
    accessorKey: "projectId",
    size: 150,
  },
  {
    header: "Month/Year",
    id: "monthYear",
    accessorFn: (data) => `${data.month}/${data.year}`,
    size: 150,
  },
  {
    header: "Project Start Date",
    accessorKey: "projectStartDate",
    size: 150,
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },
  {
    header: "Project End Date",
    accessorKey: "projectEndDate",
    size: 150,
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },
  {
    header: "Approval Stage",
    accessorKey: "approvalStage",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
            getValue() === "REVIEWED" && "bg-blue-200 text-blue-500",
            getValue() === "LOCATION_REVIEWED" && "bg-blue-300 text-blue-600",
            getValue() === "LOCATION_AUTHORIZED" && "bg-blue-400 text-blue-700",
            getValue() === "HQ_REVIEWED" && "bg-purple-200 text-purple-500",
            getValue() === "HQ_AUTHORIZED" && "bg-purple-300 text-purple-600",
            getValue() === "HQ_APPROVED" && "bg-green-200 text-green-500",
            getValue() === "REJECTED" && "bg-red-200 text-red-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "",
    id: "actions",
    size: 80,
    cell: ({ row }) => (
      <Link href={RouteEnum.PROGRAM_FUND_REQUEST_DETAILS.replace(":id", row.original.projectId)}>
        <Button variant="ghost" size="sm" className="text-[#DEA004] hover:text-[#DEA004]">
          View
        </Button>
      </Link>
    ),
  },
];


"use client";
import Link from "next/link";
import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import ApproveIcon from "components/icons/ApproveIcon";
import DataTable from "components/Table/DataTable";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useState } from "react";
import { IProjectSingleData } from "@/features/projects/types/project";
// import { IProjectSingleData } from "definations/project";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Fund Request", icon: false },
];

export default function FundRequest() {
  const [page, setPage] = useState(1);

  const { data: project, isFetching } = useGetAllProjects({
    page,
    size: 10,
    has_fund_requests: true,
  });

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex justify-end'>
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
          data={project?.data.results || []}
          columns={columns}
          isLoading={isFetching}
          pagination={{
            total: project?.data.pagination.count ?? 0,
            pageSize: project?.data.pagination.page_size ?? 0,
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
}

const columns: ColumnDef<IProjectSingleData>[] = [
  {
    header: "Project Title",
    accessorKey: "title",
    size: 150,
  },

  {
    header: "PROJECT ID",
    accessorKey: "project_id",
    size: 200,
  },

  {
    header: "Project Start Date",
    accessorKey: "start_date",
    size: 200,
  },
  {
    header: "Project End Date",
    accessorKey: "end_date",
    size: 200,
  },
  {
    header: "Project Status",
    accessorKey: "status",
    size: 200,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "IN_PROGRESS" && "bg-green-200 text-green-500",
            getValue() === "CLOSED" && "bg-red-200 text-red-500",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
            getValue() === "On Hold" && "text-grey-200 bg-grey-500"
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
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: { data: IProjectSingleData }) => {
  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                className='w-full'
                href={`/dashboard/programs/fund-request/${data?.id}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.SspApproveModal,
                      dialogProps: {
                        header: "Request Approval",
                        width: "max-w-2xl",
                      },
                    })
                  );
                }}
              >
                <ApproveIcon />
                Approve
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};

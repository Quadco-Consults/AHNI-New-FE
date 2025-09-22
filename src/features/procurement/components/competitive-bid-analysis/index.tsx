"use client";

"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { useGetAllCbas } from "@/features/procurement/controllers/cbaController";
import { CbaResultsData } from "@/features/procurement/types/cba";
import PrinterIcon from "components/icons/PrinterIcon";
import SendIcon from "components/icons/SendIcon";
import { useState } from "react";
import { Loading } from "components/Loading";
import { Plus } from "lucide-react";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

const CompetitiveAnalysis = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllCbas({
    page,
    size: 10,
  });

  if (isLoading) {
    return <Loading />;
  }
  // return;
  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Competitive Bid Analysis</h4>
        <h6>
          Procurement -{" "}
          <span className='text-black font-medium dark:text-grey-dark'>
            Competitive Bid Analysis
          </span>
        </h6>
      </div>

      <Card className='space-y-10'>
        <div className='flex items-center justify-end'>
          <Link href={RouteEnum.RFQ_CREATE_CBA}>
            <Button>
              <span>
                <Plus size={15} />
              </span>
              Create New
            </Button>
          </Link>
        </div>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 border-none bg-none focus:outline-none outline-none w-full rounded-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          // @ts-ignore

          data={data?.data?.results || []}
          // @ts-ignore
          columns={columns}
          isLoading={isLoading}
          pagination={{
            // @ts-ignore
            total: data?.data.pagination.count ?? 0,
            // @ts-ignore
            // pageSize: 10 ?? 0,
            pageSize: data?.data.pagination.page_size ?? 0,
            // @ts-ignore
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
};

export default CompetitiveAnalysis;

const columns: ColumnDef<CbaResultsData>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "RFQ nO",
    accessorKey: "title",
    size: 300,
    cell: ({ row }) => {
      return (
        <p className='text-center'>
          {/* @ts-ignore */}
          {row?.original?.solicitation?.rfq_id || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "cba_type",
    size: 300,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "APPROVED" && "bg-green-200 text-green-500",
            getValue() === "REJECTED" && "bg-red-200 text-red-500",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
            getValue() === "COMPLETED" && "bg-blue-200 text-blue-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "CBA Date",
    accessorKey: "cba_date",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row?.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
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
              {/* View CBA Details */}
              <Link
                className='w-full'
                href={generatePath(RouteEnum.PROCUREMENT_CBA_DETAILS, {
                  id: data?.id,
                })}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              {/* Edit CBA - Using RFQ Create CBA route for editing */}
              <Link
                className='w-full'
                href={`/dashboard/procurement/solicitation-management/rfq/create/create-cba?id=${data?.id}&edit=true`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EditIcon />
                  Edit
                </Button>
              </Link>

              {/* Check CBA / Perform Analysis */}
              <Link
                className='w-full'
                href={`/dashboard/procurement/competitive-bid-analysis/${data?.id}/vendor-analysis?id=${data?.solicitation?.id}&cba=${data?.id}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <SendIcon />
                  Check CBA
                </Button>
              </Link>

              {/* Get Purchase Order */}
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PrinterIcon />
                Get Purchase Order
              </Button>

              {/* Delete CBA */}
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};

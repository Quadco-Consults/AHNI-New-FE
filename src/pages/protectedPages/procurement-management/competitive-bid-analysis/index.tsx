/* eslint-disable react/prop-types */
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import CbaAPI from "services/procurementApi/cba";
import { CbaResultsData } from "definations/procurement-types/cba";
import PrinterIcon from "components/icons/PrinterIcon";
import SendIcon from "components/icons/SendIcon";
import { useState } from "react";
import { Loading } from "components/shared/Loading";

const CompetitiveAnalysis = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = CbaAPI.useGetCbaListQuery({
    page,
    size: 10,
  });
  console.log({ page, data });

  if (isLoading) {
    return <Loading />;
  }

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
      console.log({ row });

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
            getValue() === "Reject" && "bg-red-200 text-red-500",
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
              <Link
                className='w-full'
                to={generatePath(RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS, {
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
              <Link
                className='w-full'
                to={generatePath(
                  RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_START,
                  {
                    id: data?.id,
                  }
                )}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <SendIcon />
                  Start CBA
                </Button>
              </Link>
              <Link
                className='w-full'
                to={generatePath(
                  RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK,
                  {
                    id: data?.id,
                  }
                )}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <SendIcon />
                  Check Approval
                </Button>
              </Link>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PrinterIcon />
                Get Purchase Order
              </Button>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <DeleteIcon />
                delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};

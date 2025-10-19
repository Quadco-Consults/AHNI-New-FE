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
import EditIcon from "components/icons/EditIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import ApproveIcon from "components/icons/ApproveIcon";
import DataTable from "components/Table/DataTable";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllFundRequests, useDeleteFundRequest } from "@/features/programs/controllers/fundRequestController";
import { useState } from "react";
import { FundRequestPaginatedData } from "@/features/programs/types/fund-request";
import { formatNumberCurrency } from "utils/utls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "components/ui/alert-dialog";
import { toast } from "sonner";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Fund Request", icon: false },
];

export default function FundRequest() {
  const [page, setPage] = useState(1);

  const { data: fundRequests, isLoading: isFetching } = useGetAllFundRequests({
    page,
    size: 10,
    enabled: true,
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
          data={fundRequests?.data?.results || []}
          columns={columns}
          isLoading={isFetching}
          pagination={{
            total: fundRequests?.data?.pagination?.count ?? 0,
            pageSize: fundRequests?.data?.pagination?.page_size ?? 10,
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
}

const columns: ColumnDef<FundRequestPaginatedData>[] = [
  {
    header: "Project Name",
    accessorKey: "project",
    size: 200,
  },

  {
    header: "Financial Year",
    accessorKey: "financial_year",
    size: 150,
  },

  {
    header: "Amount",
    id: "amount",
    accessorFn: (data) => {
      const currencySymbol = data.currency === "NGN" ? "₦" : "$";
      return `${formatNumberCurrency(data.total_amount, currencySymbol)}`;
    },
    size: 200,
  },

  {
    header: "Month/Year",
    id: "period",
    accessorFn: (data) => `${data.month}/${data.year}`,
    size: 150,
  },

  {
    header: "Status",
    accessorKey: "status",
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
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: { data: FundRequestPaginatedData }) => {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { deleteFundRequest, isLoading } = useDeleteFundRequest(data?.id);

  const handleDeleteFundRequest = async () => {
    try {
      await deleteFundRequest();
      toast.success("Fund Request Deleted Successfully");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Failed to delete fund request");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              className='w-full'
              href={{
                pathname: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(
                  ":id",
                  data?.project
                ),
                search: `?fundRequestId=${data?.id}`,
              }}
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
            <Link
              className='w-full'
              href={RouteEnum.PROGRAM_FUND_REQUEST_EDIT.replace(":id", data?.id)}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EditIcon />
                Edit
              </Button>
            </Link>
            <Button
              className='w-full flex items-center justify-start gap-2 text-red-600 hover:text-red-800'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the fund request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFundRequest}
              disabled={isLoading}
              className='bg-red-600 hover:bg-red-700'
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

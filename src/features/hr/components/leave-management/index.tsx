"use client";

/* eslint-disable no-unused-vars */
import React from "react";
import { cn, truncateStringLength } from "lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import ApproveIcon from "components/icons/ApproveIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

import FormButton from "components/atoms/FormButton";

const LeaveManagement: React.FC = () => {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
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
      header: "Employee",
      accessorKey: "employee",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.employee}</p>,
    },
    {
      header: "Reason",
      accessorKey: "total",
      size: 200,
      cell: ({ row }) => (
        <p>{truncateStringLength(row?.original?.reason, 85)}</p>
      ),
    },
    {
      header: "Leave Type",
      accessorKey: "leave_type",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.leave_type}</p>,
    },
    {
      header: "From",
      accessorKey: "from",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.from}</p>,
    },
    {
      header: "To",
      accessorKey: "to",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.to}</p>,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 200,
      cell: ({ getValue }) => {
        return (
          <Badge
            className={cn(
              "p-1 rounded-lg",
              getValue() === "Approved" && "bg-green-200 text-green-500",
              getValue() === "Rejected" && "bg-red-200 text-red-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionList data={row} />,
    },
  ];

  const ActionList = ({ data }: { data: Row<any> }) => {
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
                  href={`/dashboard/hr/leave-management/leave-list/${data.original.id}`}
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
                >
                  <ApproveIcon />
                  Approve
                </Button>

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

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      {/* <div className='flex w-full gap-6 justify-between mb-6'>
        {" "}
        <div className='flex w-full p-6 justify-between bg-[#3E3574] rounded-md items-center  text-white'>
          <div className='border border-white h-[30px] w-[35px] rounded-sm flex justify-center items-center p-2'>
            <CalendarHeart />
          </div>
          <div className='text-xs leading-5'>
            <p>Total Leave</p>
            <p>
              <span className='text-xl font-medium'>86</span> Days
            </p>
          </div>
        </div>
        <div className='flex w-full p-6 justify-between bg-[#B14F05] rounded-md items-center  text-white'>
          <div className='border border-white h-[30px] w-[35px] rounded-sm flex justify-center items-center p-2'>
            <CalendarMinus />
          </div>
          <div className='text-xs leading-5'>
            <p>Used Leave</p>
            <p>
              <span className='text-xl font-medium'>20</span> Days
            </p>
          </div>
        </div>{" "}
        <div className='flex w-full p-6 justify-between bg-[#077373] rounded-md items-center  text-white'>
          <div className='border border-white h-[30px] w-[35px] rounded-sm flex justify-center items-center p-2'>
            <CalendarPlus />
          </div>
          <div className='text-xs leading-5'>
            <p>Unused Leave</p>
            <p>
              <span className='text-xl font-medium'>46</span> Days
            </p>
          </div>
        </div>{" "}
      </div> */}
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center'>
          <SearchBar onchange={() => ""} />

          <Button variant='ghost' className=''>
            <FilterIcon2 />
          </Button>
        </div>
        {/* <div className='flex items-center'>
          <FormButton
            onClick={() => {
              router.push("/dashboard/hr/leave-management");
            }}
          >
            <AddSquareIcon />
            <p>Add New</p>
          </FormButton>
        </div> */}
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          //   onRowClick={(row) => {
          //     router.push("/c-and-g/grant-details/" + row?.original?.id);
          //   }}
          data={dummyData}
          // isLoading={true}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
      </div>
    </div>
  );
};

export default LeaveManagement;

const dummyData = [
  {
    id: 1,
    employee: "John Doe",
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Medical Leave",
    from: "14-03-2025",
    to: "14-04-2025",
    status: "Approved",
  },
  {
    id: 2,
    employee: "Jane Smith",
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Medical Leave",
    from: "14-03-2025",
    to: "14-04-2025",
    status: "Approved",
  },
  {
    id: 3,
    employee: "Alice Johnson",
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Medical Leave",
    from: "14-03-2025",
    to: "14-04-2025",
    status: "Approved",
  },
  {
    id: 4,
    employee: "Bob Brown",
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Medical Leave",
    from: "14-03-2025",
    to: "14-04-2025",
    status: "Approved",
  },
];

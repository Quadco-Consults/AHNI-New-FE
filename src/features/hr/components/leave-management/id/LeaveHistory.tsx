"use client";

import React from "react";
import {
  CalendarHeart,
  CalendarMinus,
  CalendarPlus,
  Clock,
} from "lucide-react";
import { Icon } from "@iconify/react";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn, truncateStringLength } from "lib/utils";
import { Checkbox } from "components/ui/checkbox";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import IconButton from "components/IconButton";

const LeaveHistory: React.FC = () => {
  const router = useRouter();

  const ActionListAction = ({ data }: any) => {
    console.log(data);

    return (
      <div className='flex gap-2'>
        <Link
          href={HrRoutes.LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL.replace(":id", "1")}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
      </div>
    );
  };

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
      header: "Reason",
      accessorKey: "reason",
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
      header: "from",
      accessorKey: "from",
      size: 120,
      cell: ({ row }) => <p>{row?.original?.from}</p>,
    },
    {
      header: "to",
      accessorKey: "to",
      size: 120,
      cell: ({ row }) => <p>{row?.original?.to}</p>,
    },
    {
      header: "No of Days",
      accessorKey: "days",
      size: 120,
      cell: ({ row }) => <p>{row?.original?.days}</p>,
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "Approved" && "bg-green-200 text-green-500",
              getValue() === "Rejected" && "bg-red-200 text-red-500",
              getValue() === "Pending" && "bg-yellow-200 text-yellow-500",
              getValue() === "On Hold" && "text-grey-200 bg-grey-500"
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
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  return (
    <>
      <div className='flex w-full gap-4 justify-between mb-6'>
        <div className='flex w-full max-w-[255px] p-6 justify-between bg-[#3E3574] rounded-md items-center  text-white'>
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
        <div className='flex w-full max-w-[255px] p-6 justify-between bg-[#B14F05] rounded-md items-center  text-white'>
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
        <div className='flex w-full max-w-[255px] p-6 justify-between bg-[#077373] rounded-md items-center  text-white'>
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
        <div className='flex w-full max-w-[255px] p-6 justify-between bg-[#252F4A] rounded-md items-center  text-white'>
          <div className='border border-white h-[30px] w-[35px] rounded-sm flex justify-center items-center p-2'>
            <Clock />
          </div>
          <div className='text-xs leading-5'>
            <p>Next Leave In</p>
            <p>
              <span className='text-xl font-medium'>86</span> Days
            </p>
          </div>
        </div>
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
    </>
  );
};

export default LeaveHistory;

const dummyData = [
  {
    id: 1,
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Vacation",
    from: "2025-01-01",
    to: "2025-01-15",
    days: 15,
    status: "Approved",
    employee: "John Doe",
  },
  {
    id: 2,
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Sick Leave",
    from: "2025-01-10",
    to: "2025-01-12",
    days: 3,
    status: "Pending",
    employee: "Jane Smith",
  },
  {
    id: 3,
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Parental Leave",
    from: "2025-02-01",
    to: "2025-03-15",
    days: 43,
    status: "Approved",
    employee: "Alice Johnson",
  },
  {
    id: 4,
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Casual Leave",
    from: "2025-01-20",
    to: "2025-01-22",
    days: 3,
    status: "Rejected",
    employee: "Bob Brown",
  },
  {
    id: 5,
    reason:
      "I am writing to report a serious issue that I believe requires immediate attention. Over the past six months, I have observed what appears to be a misuse of company funds by a senior manager in our department. Specifically, this individual has been submitting fraudulent expense reports for personal expenses, which are then reimbursed by the company as business expenses.",
    leave_type: "Educational Leave",
    from: "2025-03-01",
    to: "2025-03-31",
    days: 31,
    status: "Pending",
    employee: "Mary Green",
  },
];

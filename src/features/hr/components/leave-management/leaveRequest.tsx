/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

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
      accessorKey: "reason",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.reason}</p>,
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
      header: "No of Days",
      accessorKey: "days",
      size: 200,
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

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
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
              router.push(HrRoutes.LEAVE_MANAGEMENT_DETAIL);
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
    reason: "Medical Leave",
    leave_type: "Sick Leave",
    from: "2025-01-10",
    to: "2025-01-15",
    days: 5,
    status: "Approved",
  },
  {
    id: 2,
    employee: "Jane Smith",
    reason: "Family Emergency",
    leave_type: "Casual Leave",
    from: "2025-02-01",
    to: "2025-02-03",
    days: 2,
    status: "Pending",
  },
  {
    id: 3,
    employee: "Alice Johnson",
    reason: "Vacation",
    leave_type: "Annual Leave",
    from: "2025-03-05",
    to: "2025-03-12",
    days: 7,
    status: "Rejected",
  },
  {
    id: 4,
    employee: "Bob Brown",
    reason: "Maternity/Paternity Leave",
    leave_type: "Special Leave",
    from: "2025-04-01",
    to: "2025-04-15",
    days: 14,
    status: "On Hold",
  },
];

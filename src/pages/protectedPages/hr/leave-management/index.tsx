/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "atoms/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { CalendarHeart, CalendarMinus, CalendarPlus } from "lucide-react";

const LeaveManagement: React.FC = () => {
  const navigate = useNavigate();

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
      header: "Total",
      accessorKey: "total",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.total}</p>,
    },
    {
      header: "Used",
      accessorKey: "used",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.used}</p>,
    },
    {
      header: "Unused",
      accessorKey: "un_used",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.un_used}</p>,
    },
    {
      header: "Expired",
      accessorKey: "expired",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.expired}</p>,
    },
    {
      header: "Unplanned",
      accessorKey: "unplanned",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.unplanned}</p>,
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
        <Link to={generatePath(HrRoutes.LEAVE_MANAGEMENT_DETAIL, { id: "1" })}>
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
      <div className='flex w-full gap-6 justify-between mb-6'>
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
      </div>
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
              navigate(HrRoutes.LEAVE_MANAGEMENT_DETAIL);
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
          //     navigate("/c-and-g/grant-details/" + row?.original?.id);
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
    total: "20 Days",
    used: "15 Days",
    un_used: "5 Days",
    expired: "2 Days",
    unplanned: "1 Days",
    project: { title: "Project A" },
    location: { name: "Head Office" },
    grantor: { name: "HR Department" },
  },
  {
    id: 2,
    employee: "Jane Smith",
    total: 25,
    used: 10,
    un_used: 15,
    expired: 5,
    unplanned: 3,
    project: { title: "Project B" },
    location: { name: "Branch Office" },
    grantor: { name: "Finance Department" },
  },
  {
    id: 3,
    employee: "Alice Johnson",
    total: 30,
    used: 20,
    un_used: 10,
    expired: 4,
    unplanned: 2,
    project: { title: "Project C" },
    location: { name: "Regional Office" },
    grantor: { name: "Admin Department" },
  },
  {
    id: 4,
    employee: "Bob Brown",
    total: 18,
    used: 12,
    un_used: 6,
    expired: 1,
    unplanned: 0,
    project: { title: "Project D" },
    location: { name: "Remote" },
    grantor: { name: "Operations Department" },
  },
];

/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";

const BreakDown: React.FC = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = React.useState(false);

  const columns: ColumnDef<any>[] = [
    {
      header: "S/N",
      accessorKey: "serial_number",
      size: 50,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Employee Number",
      accessorKey: "employee_number",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Full name",
      accessorKey: "full_name",
      size: 300,
      cell: ({ row }) => <p>{row?.original?.location?.name}</p>,
    },
    {
      header: "Position ",
      accessorKey: "position",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.location?.name}</p>,
    },
    {
      header: "Pay Group",
      accessorKey: "pay_group",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },

    {
      header: "Earnings",
      accessorKey: "earnings",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Deductions",
      accessorKey: "deductions",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },

    {
      header: "Total Allowance",
      accessorKey: "total_allowance",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Total Deductions",
      accessorKey: "total_deductions",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Gross Pay",
      accessorKey: "gross_pay",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
  ];

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem] '>
      <div className='w-full mt-6'>
        <DataTable
          columns={columns}
          //   onRowClick={(row) => {
          //     router.push("/c-and-g/grant-details/" + row?.original?.id);
          //   }}
          data={[]}
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

export default BreakDown;

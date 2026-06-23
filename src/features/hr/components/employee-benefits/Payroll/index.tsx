/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import DataTable from "@/components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "@/components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "@/constants/RouterConstants";
import SearchBar from "@/components/SearchBar";
import { Checkbox } from "@/components/ui/checkbox";
import IconButton from "@/components/IconButton";
import { Trash2 } from 'lucide-react';
import { Icon } from "@iconify/react";
import PayGroupModal from "../components/PayGroupModal";
import { useGetPayRolls } from "@/features/hr/controllers/hrPayRollController";

const Payroll: React.FC = () => {
  const router = useRouter();

  const { data: payRollsData, isLoading: isLoadingPayGroups } =
    useGetPayRolls();

  console.log({ payRollsData, isLoadingPayGroups });

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [payrolls, setPayrolls] = React.useState<any[]>([]);

  // Load payrolls from localStorage
  React.useEffect(() => {
    const savedPayrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
    setPayrolls(savedPayrolls);
  }, []);

  const handleDeletePayroll = (id: string) => {
    const updatedPayrolls = payrolls.filter((p) => p.payroll_id !== id);
    setPayrolls(updatedPayrolls);
    localStorage.setItem("payrolls", JSON.stringify(updatedPayrolls));
  };

  const formatMonth = (month: string) => {
    const date = new Date(month + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
      header: "Month",
      accessorKey: "month",
      size: 200,
      cell: ({ row }) => <p>{formatMonth(row?.original?.month)}</p>,
    },
    {
      header: "Total Employees",
      accessorKey: "total_employees",
      size: 150,
      cell: ({ row }) => <p>{row?.original?.total_employees || 0}</p>,
    },
    {
      header: "Gross Payment",
      accessorKey: "total_gross_payment",
      size: 200,
      cell: ({ row }) => <p>₦{row?.original?.total_gross_payment?.toLocaleString() || '0.00'}</p>,
    },
    {
      header: "Total Deduction",
      accessorKey: "total_deductions",
      size: 200,
      cell: ({ row }) => <p>₦{row?.original?.total_deductions?.toLocaleString() || '0.00'}</p>,
    },
    {
      header: "Net Payment",
      accessorKey: "total_net_payment",
      size: 200,
      cell: ({ row }) => <p>₦{row?.original?.total_net_payment?.toLocaleString() || '0.00'}</p>,
    },
    {
      header: "",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    const payrollId = data?.original?.payroll_id;

    return (
      <div className='flex gap-2'>
        <Link href={`/dashboard/hr/employee-benefit/pay-roll/${payrollId}`}>
          <IconButton className='bg-alternate-light hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton
          className='bg-alternate-light hover:text-primary'
          onClick={() => {
            if (confirm('Are you sure you want to delete this payroll?')) {
              handleDeletePayroll(payrollId);
            }
          }}
        >
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
        <div className='flex items-center'>
          <Link
            className='w-full'
            href="/dashboard/hr/employee-benefit/pay-roll/create"
          >
            <Button>
              <AddSquareIcon />
              <p>Generate Payroll</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          data={payrolls}
          isLoading={false}
          pagination={{
            total: payrolls.length,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
        <PayGroupModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => {}}
        />
      </div>
    </div>
  );
};

export default Payroll;

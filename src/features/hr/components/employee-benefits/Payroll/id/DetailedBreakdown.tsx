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
import SearchBar from "components/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { FileText } from 'lucide-react';import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { toast } from "sonner";

interface BreakDownProps {
  employees?: any[];
}

interface BreakDownPropsWithPayroll extends BreakDownProps {
  payrollId?: string;
}

const BreakDown: React.FC<BreakDownPropsWithPayroll> = ({ employees = [], payrollId }) => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any>(null);

  // Handle view employee breakdown
  const handleViewBreakdown = (employee: any) => {
    if (payrollId) {
      // Navigate to employee breakdown page using the correct route structure
      router.push(`/dashboard/hr/employee-benefit/pay-roll/${payrollId}/employee/${employee.employee_id}`);
    } else {
      toast.error("Payroll ID not found");
    }
  };

  // Handle generate payslip
  const handleGeneratePayslip = (employee: any) => {
    if (payrollId) {
      // Navigate to employee breakdown page and trigger print
      const url = `/dashboard/hr/employee-benefit/pay-roll/${payrollId}/employee/${employee.employee_id}`;
      router.push(url);
      // Print will be triggered on the breakdown page
      toast.success(`Opening payslip for ${employee.employee_name}`);
    } else {
      toast.error("Payroll ID not found");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "S/N",
      accessorKey: "serial_number",
      size: 50,
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
      header: "Employee Number",
      accessorKey: "employee_number",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.employee_number || 'N/A'}</p>,
    },
    {
      header: "Full name",
      accessorKey: "employee_name",
      size: 300,
      cell: ({ row }) => <p>{row?.original?.employee_name || 'N/A'}</p>,
    },
    {
      header: "Position",
      accessorKey: "position",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.position || 'N/A'}</p>,
    },
    {
      header: "Basic Salary",
      accessorKey: "basic_salary",
      size: 200,
      cell: ({ row }) => <p>₦{row?.original?.basic_salary?.toLocaleString() || 0}</p>,
    },

    {
      header: "Total Allowances",
      accessorKey: "total_allowance",
      size: 200,
      cell: ({ row }) => {
        const allowances = row?.original?.allowances || {};
        const total = (allowances.housing || 0) + (allowances.transport || 0) + (allowances.meal || 0) + (allowances.miscellaneous || 0);
        return <p>₦{total.toLocaleString()}</p>;
      },
    },
    {
      header: "Total Deductions",
      accessorKey: "total_deductions",
      size: 200,
      cell: ({ row }) => <p>₦{row?.original?.total_deductions?.toLocaleString() || 0}</p>,
    },

    {
      header: "Gross Pay",
      accessorKey: "gross_salary",
      size: 200,
      cell: ({ row }) => <p>₦{row?.original?.gross_salary?.toLocaleString() || 0}</p>,
    },
    {
      header: "Net Pay",
      accessorKey: "net_salary",
      size: 200,
      cell: ({ row }) => <p className="font-semibold">₦{row?.original?.net_salary?.toLocaleString() || 0}</p>,
    },
    {
      header: "Actions",
      id: "actions",
      size: 120,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleViewBreakdown(row.original)}
              className="cursor-pointer"
            >
              <Eye size={16} />
              View Breakdown
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleGeneratePayslip(row.original)}
              className="cursor-pointer"
            >
              <FileText size={16} />
              Generate Payslip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem] '>
      <div className='w-full mt-6'>
        <DataTable
          columns={columns}
          data={employees}
          pagination={{
            total: employees.length,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
      </div>
    </div>
  );
};

export default BreakDown;

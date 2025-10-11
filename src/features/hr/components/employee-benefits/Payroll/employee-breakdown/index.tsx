"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Icon } from "@iconify/react";
import GoBack from "components/GoBack";

const EmployeePayrollBreakdown = () => {
  const params = useParams();
  const router = useRouter();
  const payrollId = params?.id as string; // Changed from payrollId to id
  const employeeId = params?.employeeId as string;

  // Load payroll data from localStorage
  const [payrollData, setPayrollData] = React.useState<any>(null);
  const [employeeData, setEmployeeData] = React.useState<any>(null);

  React.useEffect(() => {
    const savedPayrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
    const payroll = savedPayrolls.find((p: any) => p.payroll_id === payrollId);

    if (payroll) {
      setPayrollData(payroll);
      const employee = payroll.employees?.find((emp: any) => emp.employee_id === employeeId);
      setEmployeeData(employee);
    }
  }, [payrollId, employeeId]);

  if (!payrollData || !employeeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading employee payroll data...</p>
      </div>
    );
  }

  const formatMonthYear = () => {
    if (payrollData.month) {
      const date = new Date(`${payrollData.month}-01`);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Payroll Breakdown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GoBack />
          <div>
            <h1 className="text-2xl font-bold">Employee Payroll Breakdown</h1>
            <p className="text-sm text-gray-600">{formatMonthYear()}</p>
          </div>
        </div>
        <Button
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <Icon icon="ph:printer-duotone" className="h-5 w-5" />
          Print Breakdown
        </Button>
      </div>

      {/* Employee Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Employee Name</p>
            <p className="font-semibold">{employeeData.employee_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employee Number</p>
            <p className="font-semibold">{employeeData.employee_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Position</p>
            <p className="font-semibold">{employeeData.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Period</p>
            <p className="font-semibold">{formatMonthYear()}</p>
          </div>
        </div>
      </Card>

      {/* Earnings Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-green-700">Earnings Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Basic Salary</span>
            <span className="font-semibold">₦{employeeData.basic_salary?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Housing Allowance</span>
            <span className="font-semibold">₦{employeeData.allowances?.housing?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Transport Allowance</span>
            <span className="font-semibold">₦{employeeData.allowances?.transport?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Meal Allowance</span>
            <span className="font-semibold">₦{employeeData.allowances?.meal?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Miscellaneous Allowance</span>
            <span className="font-semibold">₦{employeeData.allowances?.miscellaneous?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg mt-2">
            <span className="font-bold text-green-900">Total Gross Salary</span>
            <span className="font-bold text-xl text-green-700">₦{employeeData.gross_salary?.toLocaleString() || 0}</span>
          </div>
        </div>
      </Card>

      {/* Deductions Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-700">Deductions Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Tax Deduction</span>
            <span className="font-semibold text-red-600">₦{employeeData.deductions?.tax?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Pension Contribution</span>
            <span className="font-semibold text-red-600">₦{employeeData.deductions?.pension?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">NHIS Contribution</span>
            <span className="font-semibold text-red-600">₦{employeeData.deductions?.nhis?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Loan Deduction</span>
            <span className="font-semibold text-red-600">₦{employeeData.deductions?.loan?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-red-50 px-4 rounded-lg mt-2">
            <span className="font-bold text-red-900">Total Deductions</span>
            <span className="font-bold text-xl text-red-700">₦{employeeData.total_deductions?.toLocaleString() || 0}</span>
          </div>
        </div>
      </Card>

      {/* Net Pay Summary */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Net Pay</h2>
            <p className="text-sm text-blue-700">Amount to be paid to employee</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-900">₦{employeeData.net_salary?.toLocaleString() || 0}</p>
            <p className="text-sm text-blue-700 mt-1">
              Gross: ₦{employeeData.gross_salary?.toLocaleString()} - Deductions: ₦{employeeData.total_deductions?.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Back to Payroll
        </Button>
        <Button
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <Icon icon="ph:printer-duotone" className="h-5 w-5" />
          Print Payslip
        </Button>
      </div>
    </div>
  );
};

export default EmployeePayrollBreakdown;

"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';import { Icon } from "@iconify/react";
import GoBack from "@/components/GoBack";
import Image from "next/image";

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

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #payslip-content,
          #payslip-content * {
            visibility: visible;
          }

          #payslip-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20mm;
          }

          .no-print {
            display: none !important;
          }

          .print-page-break {
            page-break-after: always;
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Screen View Controls */}
      <div className="space-y-6 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoBack />
            <div>
              <h1 className="text-2xl font-bold">Employee Payroll Slip</h1>
              <p className="text-sm text-gray-600">{formatMonthYear()}</p>
            </div>
          </div>
          <div className="flex gap-3">
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
              <FileText size={16} />
              Print Payslip
            </Button>
          </div>
        </div>
      </div>

      {/* Payslip Content - Professional Design */}
      <div id="payslip-content" className="bg-white">
        {/* Company Header */}
        <div className="border-b-4 border-red-600 pb-6 mb-6">
          <div className="flex flex-col items-center text-center mb-4">
            {/* AHNI Logo */}
            <div className="w-20 h-20 relative flex items-center justify-center mb-3">
              <Image
                src="/imgs/logo.png"
                alt="AHNI Logo"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Achieving Health Nigeria Initiative (AHNi)</h1>
              <p className="text-xs text-gray-600 mt-1">30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
              <p className="text-xs text-gray-600 mt-0.5">Tel: +234.94615555 | Email: AHNiOperations@ahnigeria.org</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
              <p className="text-xs font-medium">PAYSLIP</p>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p>Date: {getCurrentDate()}</p>
              <p>Period: {formatMonthYear()}</p>
            </div>
          </div>
        </div>

        {/* Employee Information Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-900 p-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Employee Information</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Employee Name</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{employeeData.employee_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Employee Number</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{employeeData.employee_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Position</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{typeof employeeData.position === 'string'
                  ? employeeData.position
                  : typeof employeeData.position === 'object' && employeeData.position?.name
                  ? employeeData.position.name
                  : typeof employeeData.position === 'object' && employeeData.position?.title
                  ? employeeData.position.title
                  : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Payroll ID</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{payrollId.substring(0, 15)}...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions Side by Side */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Earnings Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase tracking-wide">Earnings</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Basic Salary</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.basic_salary?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Housing Allowance</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.allowances?.housing?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Transport Allowance</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.allowances?.transport?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Meal Allowance</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.allowances?.meal?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Miscellaneous</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.allowances?.miscellaneous?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-gray-900">
                <span className="text-sm font-bold text-gray-900">Total Earnings</span>
                <span className="text-base font-bold text-gray-900">₦{employeeData.gross_salary?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-red-600 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase tracking-wide">Deductions</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Tax Deduction</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.deductions?.tax?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Pension Contribution</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.deductions?.pension?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">NHIS Contribution</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.deductions?.nhis?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Loan Deduction</span>
                <span className="text-sm font-semibold text-gray-900">₦{employeeData.deductions?.loan?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Other Deductions</span>
                <span className="text-sm font-semibold text-gray-900">₦0</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-red-600">
                <span className="text-sm font-bold text-red-900">Total Deductions</span>
                <span className="text-base font-bold text-red-700">₦{employeeData.total_deductions?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay Section */}
        <div className="bg-gradient-to-r from-red-600 to-gray-900 text-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium opacity-90 uppercase tracking-wide">Net Pay (Take Home)</p>
              <p className="text-xs opacity-75 mt-1">Amount to be paid to employee</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">₦{employeeData.net_salary?.toLocaleString() || 0}</p>
              <p className="text-xs opacity-90 mt-2">
                Gross: ₦{employeeData.gross_salary?.toLocaleString()} - Deductions: ₦{employeeData.total_deductions?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-4 mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-600 mb-4">
                <strong>Note:</strong> This is a computer-generated payslip and does not require a signature.
                Please verify all details carefully.
              </p>
              <div className="text-xs text-gray-500">
                <p>For queries, contact HR Department</p>
                <p className="mt-1">Email: AHNiOperations@ahnigeria.org | Tel: +234.94615555</p>
              </div>
            </div>
            <div className="text-right">
              <div className="border-t border-gray-400 pt-2 mt-8 inline-block min-w-[200px]">
                <p className="text-xs text-gray-600">Authorized Signature</p>
              </div>
              <p className="text-xs text-gray-500 mt-4">Generated by Achieving Health Nigeria Initiative (AHNi)</p>
            </div>
          </div>
        </div>

        {/* Confidentiality Notice */}
        <div className="mt-6 bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>CONFIDENTIAL:</strong> This payslip contains confidential information and is intended solely for the named employee.
            Unauthorized disclosure or distribution is prohibited.
          </p>
        </div>
      </div>
    </>
  );
};

export default EmployeePayrollBreakdown;

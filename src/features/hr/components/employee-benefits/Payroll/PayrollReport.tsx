"use client";

import React from "react";
import { Button } from "components/ui/button";

interface PayrollReportData {
  payroll_id: string;
  month: string;
  year: number;
  total_employees: number;
  total_gross_payment: number;
  total_deductions: number;
  total_net_payment: number;
  employees: Array<{
    employee_id: string;
    employee_name: string;
    employee_number: string;
    position: string;
    basic_salary: number;
    allowances: {
      housing?: number;
      transport?: number;
      meal?: number;
      miscellaneous?: number;
    };
    deductions: {
      tax?: number;
      pension?: number;
      nhis?: number;
      loan?: number;
    };
    gross_salary: number;
    total_deductions: number;
    net_salary: number;
  }>;
}

interface PayrollReportProps {
  data: PayrollReportData;
  onSave: () => void;
  onCancel: () => void;
}

const PayrollReport: React.FC<PayrollReportProps> = ({ data, onSave, onCancel }) => {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonth = (month: string) => {
    const date = new Date(month + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold text-center">PAYROLL REPORT</h1>
        <p className="text-center text-lg mt-2">AHNI ERP System</p>
        <p className="text-center mt-1">Pay Period: {formatMonth(data.month)}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-semibold">Total Employees</p>
          <p className="text-2xl font-bold text-blue-900">{data.total_employees}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-semibold">Gross Payment</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(data.total_gross_payment)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-semibold">Total Deductions</p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(data.total_deductions)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-semibold">Net Payment</p>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(data.total_net_payment)}</p>
        </div>
      </div>

      {/* Employee Breakdown Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold">Employee Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">S/N</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Employee ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Position</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Basic Salary</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Allowances</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Gross Pay</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Deductions</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.employees.map((employee, index) => {
                const totalAllowances =
                  (employee.allowances.housing || 0) +
                  (employee.allowances.transport || 0) +
                  (employee.allowances.meal || 0) +
                  (employee.allowances.miscellaneous || 0);

                return (
                  <tr key={employee.employee_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{employee.employee_number}</td>
                    <td className="px-4 py-3 text-sm">{employee.employee_name}</td>
                    <td className="px-4 py-3 text-sm">{typeof employee.position === 'string'
                      ? employee.position
                      : typeof employee.position === 'object' && employee.position?.name
                      ? employee.position.name
                      : typeof employee.position === 'object' && employee.position?.title
                      ? employee.position.title
                      : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(employee.basic_salary)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalAllowances)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">{formatCurrency(employee.gross_salary)}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(employee.total_deductions)}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-700">{formatCurrency(employee.net_salary)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
              <tr className="font-bold">
                <td colSpan={6} className="px-4 py-3 text-right text-sm uppercase">TOTAL:</td>
                <td className="px-4 py-3 text-sm text-right text-green-700">{formatCurrency(data.total_gross_payment)}</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(data.total_deductions)}</td>
                <td className="px-4 py-3 text-sm text-right text-blue-700">{formatCurrency(data.total_net_payment)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Detailed Allowances & Deductions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allowances Breakdown */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 bg-green-50 border-b">
            <h3 className="font-bold text-green-800">Allowances Breakdown</h3>
          </div>
          <div className="p-4 space-y-2">
            {data.employees.map((employee) => (
              <div key={employee.employee_id} className="border-b pb-2">
                <p className="font-semibold text-sm">{employee.employee_name}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                  {employee.allowances.housing && employee.allowances.housing > 0 && (
                    <div className="flex justify-between">
                      <span>Housing:</span>
                      <span>{formatCurrency(employee.allowances.housing)}</span>
                    </div>
                  )}
                  {employee.allowances.transport && employee.allowances.transport > 0 && (
                    <div className="flex justify-between">
                      <span>Transport:</span>
                      <span>{formatCurrency(employee.allowances.transport)}</span>
                    </div>
                  )}
                  {employee.allowances.meal && employee.allowances.meal > 0 && (
                    <div className="flex justify-between">
                      <span>Meal:</span>
                      <span>{formatCurrency(employee.allowances.meal)}</span>
                    </div>
                  )}
                  {employee.allowances.miscellaneous && employee.allowances.miscellaneous > 0 && (
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span>{formatCurrency(employee.allowances.miscellaneous)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 bg-red-50 border-b">
            <h3 className="font-bold text-red-800">Deductions Breakdown</h3>
          </div>
          <div className="p-4 space-y-2">
            {data.employees.map((employee) => (
              <div key={employee.employee_id} className="border-b pb-2">
                <p className="font-semibold text-sm">{employee.employee_name}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                  {employee.deductions.tax && employee.deductions.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(employee.deductions.tax)}</span>
                    </div>
                  )}
                  {employee.deductions.pension && employee.deductions.pension > 0 && (
                    <div className="flex justify-between">
                      <span>Pension:</span>
                      <span>{formatCurrency(employee.deductions.pension)}</span>
                    </div>
                  )}
                  {employee.deductions.nhis && employee.deductions.nhis > 0 && (
                    <div className="flex justify-between">
                      <span>NHIS:</span>
                      <span>{formatCurrency(employee.deductions.nhis)}</span>
                    </div>
                  )}
                  {employee.deductions.loan && employee.deductions.loan > 0 && (
                    <div className="flex justify-between">
                      <span>Loan:</span>
                      <span>{formatCurrency(employee.deductions.loan)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">This is a system-generated payroll report and does not require a signature.</p>
        <p className="text-sm text-gray-600 mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        <p className="text-sm font-semibold text-gray-700 mt-2">AHNI ERP System - Payroll Management</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} className="bg-blue-700 hover:bg-blue-800">
          Save Payroll
        </Button>
      </div>
    </div>
  );
};

export default PayrollReport;

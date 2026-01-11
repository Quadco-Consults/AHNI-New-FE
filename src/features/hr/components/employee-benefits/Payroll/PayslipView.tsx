"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PayslipData {
  employee_id: string;
  employee_name: string;
  employee_number: string;
  position: string;
  department?: string;
  month: string;
  year: number;
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
}

interface PayslipViewProps {
  payslip: PayslipData;
  onClose?: () => void;
}

const PayslipView: React.FC<PayslipViewProps> = ({ payslip, onClose }) => {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonth = (month: string) => {
    const date = new Date(month + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-800 max-w-4xl mx-auto bg-white shadow-lg">
          {/* Header */}
          <div className="header bg-blue-700 text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">PAYSLIP</h1>
            <p className="text-sm">AHNI ERP System</p>
            <p className="text-sm mt-1">For the month of {formatMonth(payslip.month)}</p>
          </div>

          {/* Employee Information */}
          <div className="info-section p-6 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Employee Name:</span>
                  <span>{String(payslip.employee_name || 'N/A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Employee ID:</span>
                  <span>{String(payslip.employee_number || 'N/A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Position:</span>
                  <span>{String(payslip.position || 'N/A')}</span>
                </div>
              </div>
              <div className="space-y-2">
                {payslip.department && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Department:</span>
                    <span>{typeof payslip.department === 'object' && payslip.department !== null ? (payslip.department as any).name || 'N/A' : String(payslip.department)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold">Pay Period:</span>
                  <span>{formatMonth(payslip.month)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Payment Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Section */}
          <div className="earnings-section p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-700">EARNINGS</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Basic Salary</span>
                <span className="font-semibold">{formatCurrency(payslip.basic_salary)}</span>
              </div>
              {payslip.allowances.housing && payslip.allowances.housing > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Housing Allowance</span>
                  <span className="font-semibold">{formatCurrency(payslip.allowances.housing)}</span>
                </div>
              )}
              {payslip.allowances.transport && payslip.allowances.transport > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Transport Allowance</span>
                  <span className="font-semibold">{formatCurrency(payslip.allowances.transport)}</span>
                </div>
              )}
              {payslip.allowances.meal && payslip.allowances.meal > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Meal Allowance</span>
                  <span className="font-semibold">{formatCurrency(payslip.allowances.meal)}</span>
                </div>
              )}
              {payslip.allowances.miscellaneous && payslip.allowances.miscellaneous > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Other Allowances</span>
                  <span className="font-semibold">{formatCurrency(payslip.allowances.miscellaneous)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between p-3 bg-gray-100 font-bold mt-4">
              <span>Total Earnings (Gross)</span>
              <span>{formatCurrency(payslip.gross_salary)}</span>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="deductions-section p-6 border-t">
            <h3 className="text-lg font-bold mb-4 text-blue-700">DEDUCTIONS</h3>
            <div className="space-y-2">
              {payslip.deductions.tax && payslip.deductions.tax > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>PAYE Tax</span>
                  <span className="font-semibold">{formatCurrency(payslip.deductions.tax)}</span>
                </div>
              )}
              {payslip.deductions.pension && payslip.deductions.pension > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Pension (8%)</span>
                  <span className="font-semibold">{formatCurrency(payslip.deductions.pension)}</span>
                </div>
              )}
              {payslip.deductions.nhis && payslip.deductions.nhis > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>NHIS</span>
                  <span className="font-semibold">{formatCurrency(payslip.deductions.nhis)}</span>
                </div>
              )}
              {payslip.deductions.loan && payslip.deductions.loan > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Loan Repayment</span>
                  <span className="font-semibold">{formatCurrency(payslip.deductions.loan)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between p-3 bg-gray-100 font-bold mt-4">
              <span>Total Deductions</span>
              <span>{formatCurrency(payslip.total_deductions)}</span>
            </div>
          </div>

          {/* Net Pay */}
          <div className="p-6">
            <div className="flex justify-between p-4 bg-blue-700 text-white text-xl font-bold">
              <span>NET PAY</span>
              <span>{formatCurrency(payslip.net_salary)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center text-sm text-gray-600 border-t">
            <p>This is a system-generated payslip and does not require a signature.</p>
            <p className="mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            <p className="mt-2 font-semibold">AHNI ERP System - Payroll Management</p>
          </div>
      </div>
    </div>
  );
};

export default PayslipView;

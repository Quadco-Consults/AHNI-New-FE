"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Download, AlertCircle } from "lucide-react";
import {
  useGetPayslip,
  formatCurrency,
  PayslipData,
} from "@/features/hr/controllers/payslipController";
import { toast } from "sonner";

interface PayslipViewerProps {
  open: boolean;
  onClose: () => void;
  payrollRecordId: string;
}

export default function PayslipViewer({
  open,
  onClose,
  payrollRecordId,
}: PayslipViewerProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: payslipResponse, isLoading, error } = useGetPayslip(payrollRecordId, open);
  const payslip: PayslipData | undefined = payslipResponse?.data;

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Payslip - ${payslip?.employee_name || ""}</title>
              <style>
                * {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                }
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 8px 12px;
                  font-size: 8px;
                  line-height: 1.1;
                }
                .border-b-2 {
                  border-bottom: 2px solid #000;
                  padding-bottom: 4px;
                  margin-bottom: 4px;
                }
                .mb-1 {
                  margin-bottom: 2px;
                }
                .mb-2 {
                  margin-bottom: 3px;
                }
                .mb-3 {
                  margin-bottom: 4px;
                }
                .mb-4 {
                  margin-bottom: 5px;
                }
                .mt-1, .mt-2, .mt-3 {
                  margin-top: 2px;
                }
                .mt-6 {
                  margin-top: 5px;
                }
                .pt-4 {
                  padding-top: 4px;
                }
                .p-1 {
                  padding: 1px;
                }
                .p-2 {
                  padding: 2px;
                }
                .p-3 {
                  padding: 3px;
                }
                .p-4 {
                  padding: 4px;
                }
                .space-y-0 > * + * {
                  margin-top: 1px;
                }
                .space-y-1 > * + * {
                  margin-top: 2px;
                }
                .space-y-2 > * + * {
                  margin-top: 2px;
                }
                .space-y-4 > * + * {
                  margin-top: 4px;
                }
                .gap-1 {
                  gap: 2px;
                }
                .gap-2 {
                  gap: 3px;
                }
                .gap-4 {
                  gap: 4px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 4px;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 1px 3px;
                  text-align: left;
                  font-size: 7px;
                }
                th {
                  background-color: #f5f5f5;
                  font-weight: bold;
                }
                .text-right {
                  text-align: right;
                }
                .text-center {
                  text-align: center;
                }
                .font-bold, .font-semibold {
                  font-weight: bold;
                }
                .flex {
                  display: flex;
                }
                .flex-col {
                  flex-direction: column;
                }
                .items-center {
                  align-items: center;
                }
                .grid {
                  display: grid;
                }
                .grid-cols-2 {
                  grid-template-columns: 1fr 1fr;
                }
                .grid-cols-3 {
                  grid-template-columns: 1fr 1fr 1fr;
                }
                .grid-cols-4 {
                  grid-template-columns: 1fr 1fr 1fr 1fr;
                }
                .w-40 {
                  width: 100px;
                }
                img {
                  height: 35px;
                  width: 35px;
                  object-fit: contain;
                }
                .text-2xl {
                  font-size: 10px;
                  font-weight: bold;
                }
                .text-lg {
                  font-size: 9px;
                  font-weight: 600;
                }
                .text-xl {
                  font-size: 9px;
                  font-weight: bold;
                }
                .text-sm {
                  font-size: 7px;
                }
                .text-xs {
                  font-size: 6px;
                }
                .bg-gray-50, .bg-gray-100, .bg-gray-200 {
                  background-color: #f5f5f5;
                }
                .bg-green-50 {
                  background-color: #f0fdf4;
                }
                .border {
                  border: 1px solid #d1d5db;
                }
                .border-t {
                  border-top: 1px solid #d1d5db;
                }
                .border-2 {
                  border-width: 2px;
                }
                .border-green-600 {
                  border-color: #16a34a;
                }
                .rounded {
                  border-radius: 3px;
                }
                .text-gray-600, .text-gray-900 {
                  color: #000;
                }
                .text-green-700 {
                  color: #15803d;
                }
                @media print {
                  body {
                    padding: 6px 10px;
                  }
                  @page {
                    size: A4;
                    margin: 8mm;
                  }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleDownloadPDF = () => {
    handlePrint();
    toast.success("Opening print dialog - Save as PDF to download");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Employee Payslip</DialogTitle>
            {payslip && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-semibold">Failed to load payslip</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        ) : payslip ? (
          <div ref={printRef} className="space-y-1 p-1 bg-white text-xs">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-1 mb-1">
              <div className="flex flex-col items-center">
                {/* Logo */}
                <div className="mb-1">
                  <img
                    src="/imgs/logo.png"
                    alt="AHNI Logo"
                    className="h-12 w-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Company Details */}
                <div className="text-center">
                  <h1 className="text-sm font-bold text-gray-900">{payslip.company_name}</h1>
                  <p className="text-xs text-gray-600">
                    No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria
                  </p>
                  <p className="text-xs text-gray-600">
                    Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng
                  </p>
                  <p className="text-xs font-semibold text-gray-900">EMPLOYEE PAYSLIP</p>
                  <p className="text-xs text-gray-600">Period: {payslip.payroll_period}</p>
                </div>
              </div>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-1 mb-1 text-xs">
              <div className="space-y-0">
                <div className="flex">
                  <span className="font-semibold w-40">Employee Name:</span>
                  <span>{payslip.employee_name}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">Employee Number:</span>
                  <span>{payslip.employee_number}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">Position:</span>
                  <span>{payslip.position}</span>
                </div>
              </div>
              <div className="space-y-0">
                <div className="flex">
                  <span className="font-semibold w-40">Pay Group:</span>
                  <span>{payslip.paygroup}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">Grade:</span>
                  <span>{payslip.job_grade}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">Period:</span>
                  <span>{payslip.period_display}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            {payslip.bank_details && (
              <div className="bg-gray-50 p-1 rounded border">
                <h3 className="font-bold text-xs mb-1">BANK ACCOUNT DETAILS</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="font-semibold">Bank: </span>
                    {payslip.bank_details.bank_name}
                  </div>
                  <div>
                    <span className="font-semibold">Account Number: </span>
                    {payslip.bank_details.account_number}
                  </div>
                  <div>
                    <span className="font-semibold">Account Name: </span>
                    {payslip.bank_details.account_name}
                  </div>
                </div>
              </div>
            )}

            {/* Pension Details */}
            {payslip.pension_details && (
              <div className="bg-gray-50 p-1 rounded border">
                <h3 className="font-bold text-xs mb-1">PENSION FUND DETAILS</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="font-semibold">PFA: </span>
                    {payslip.pension_details.pfa_name}
                  </div>
                  <div>
                    <span className="font-semibold">RSA Number: </span>
                    {payslip.pension_details.rsa_number}
                  </div>
                  <div>
                    <span className="font-semibold">PFC Account: </span>
                    {payslip.pension_details.pfc_account_number}
                  </div>
                </div>
              </div>
            )}

            {/* Pay Items */}
            <div>
              <h3 className="font-bold text-xs bg-gray-200 p-1 mb-1">PAY ITEMS</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">S/N</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-right">Total Amount</th>
                    <th className="border border-gray-300 p-2 text-right">Arrears</th>
                    <th className="border border-gray-300 p-2 text-right">Current</th>
                    <th className="border border-gray-300 p-2 text-right">Year to Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payslip.pay_items.map((item) => (
                    <tr key={item.s_n}>
                      <td className="border border-gray-300 p-2">{item.s_n}</td>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.total_amount)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.arrears)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.current)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.year_to_date)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={2} className="border border-gray-300 p-2">
                      GROSS PAY
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.gross_pay.total_amount)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.gross_pay.arrears)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.gross_pay.current)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.gross_pay.year_to_date)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-bold text-xs bg-gray-200 p-1 mb-1">DEDUCTIONS</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">S/N</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-right">Total Amount</th>
                    <th className="border border-gray-300 p-2 text-right">Arrears</th>
                    <th className="border border-gray-300 p-2 text-right">Current</th>
                    <th className="border border-gray-300 p-2 text-right">Year to Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payslip.deduction_items.map((item) => (
                    <tr key={item.s_n}>
                      <td className="border border-gray-300 p-2">{item.s_n}</td>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.total_amount)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.arrears)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.current)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.year_to_date)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={2} className="border border-gray-300 p-2">
                      TOTAL DEDUCTIONS
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_deductions.total_amount)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_deductions.arrears)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_deductions.current)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_deductions.year_to_date)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Pay */}
            <div className="bg-green-50 border-2 border-green-600 p-2 rounded">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Arrears</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.arrears)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Current</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.current)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Year to Date</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.year_to_date)}
                  </p>
                </div>
              </div>
              <p className="text-center mt-1 font-bold text-sm">NET PAY</p>
            </div>

            {/* Employer and Statutory Remittances */}
            <div>
              <h3 className="font-bold text-xs bg-gray-200 p-1 mb-1">
                EMPLOYER AND STATUTORY REMITTANCES
              </h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">S/N</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-right">
                      Employer Remittance
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      Employee Remittance
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      Total Remittance
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      Employer YTD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payslip.employer_remittances.map((item) => (
                    <tr key={item.s_n}>
                      <td className="border border-gray-300 p-2">{item.s_n}</td>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.employer_remittance)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.employee_remittance)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.total_remittance)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(item.employer_year_to_date)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={2} className="border border-gray-300 p-2">
                      TOTAL REMITTANCES
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_remittances.employer_remittance)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_remittances.employee_remittance)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_remittances.total_remittance)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(payslip.total_remittances.employer_year_to_date)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 mt-2 pt-2 border-t">
              <p>
                This is a computer-generated payslip and does not require a signature
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

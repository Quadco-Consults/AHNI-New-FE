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
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  font-size: 12px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 6px;
                  text-align: left;
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
                .font-bold {
                  font-weight: bold;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .company-name {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .section-title {
                  font-weight: bold;
                  background-color: #e5e7eb;
                  padding: 8px;
                  margin-top: 15px;
                  margin-bottom: 10px;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 10px;
                  margin-bottom: 15px;
                }
                .info-item {
                  display: flex;
                  gap: 10px;
                }
                .info-label {
                  font-weight: bold;
                  min-width: 150px;
                }
                @media print {
                  body {
                    padding: 0;
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
          <div ref={printRef} className="space-y-4 p-4 bg-white">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
              <h1 className="text-2xl font-bold">{payslip.company_name}</h1>
              <p className="text-lg font-semibold mt-2">PAYSLIP</p>
              <p className="text-sm text-gray-600">Period: {payslip.payroll_period}</p>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
              <div className="bg-gray-50 p-3 rounded border">
                <h3 className="font-bold text-sm mb-2">BANK ACCOUNT DETAILS</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
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
              <div className="bg-gray-50 p-3 rounded border">
                <h3 className="font-bold text-sm mb-2">PENSION FUND DETAILS</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
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
              <h3 className="font-bold text-sm bg-gray-200 p-2 mb-2">PAY ITEMS</h3>
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
              <h3 className="font-bold text-sm bg-gray-200 p-2 mb-2">DEDUCTIONS</h3>
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
            <div className="bg-green-50 border-2 border-green-600 p-4 rounded">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Arrears</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.arrears)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.current)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Year to Date</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(payslip.net_pay.year_to_date)}
                  </p>
                </div>
              </div>
              <p className="text-center mt-2 font-bold text-lg">NET PAY</p>
            </div>

            {/* Employer and Statutory Remittances */}
            <div>
              <h3 className="font-bold text-sm bg-gray-200 p-2 mb-2">
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
            <div className="text-center text-xs text-gray-600 mt-6 pt-4 border-t">
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

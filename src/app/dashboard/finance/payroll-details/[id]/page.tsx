"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  DollarSign,
  Loader2,
  AlertCircle,
  FileText,
  ArrowLeft,
  Printer,
  Download
} from "lucide-react";
import {
  useGetPayrollDetails,
  formatPayrollMonth,
  formatCurrency,
} from "@/features/finance/controllers/payrollPaymentController";
import PayslipViewer from "@/features/hr/components/payslip/PayslipViewer";

export default function PayrollDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payrollId = params.id as string;

  const [selectedPayrollRecordId, setSelectedPayrollRecordId] = useState<string>("");
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);

  const { data: payrollData, isLoading, error } = useGetPayrollDetails(payrollId, !!payrollId);
  const payroll = payrollData?.data;

  const handleViewPayslip = (recordId: string) => {
    setSelectedPayrollRecordId(recordId);
    setShowPayslipDialog(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll Details</h1>
            <p className="text-muted-foreground">
              {payroll ? `${formatPayrollMonth(payroll.month)} - ${payroll.total_employees} Employees` : "Loading payroll details..."}
            </p>
          </div>
        </div>

        {payroll && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading payroll details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold">Failed to load payroll details</p>
            <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </div>
      ) : payroll ? (
        <div className="space-y-6">
          {/* Payroll Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Period</p>
                    <p className="font-semibold">{formatPayrollMonth(payroll.month)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="font-semibold">{payroll.total_employees}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="warning">{payroll.status}</Badge>
                  </div>
                </div>
                {payroll.project && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Project</p>
                      <p className="font-semibold text-sm">{payroll.project.project_id}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gross Payment:</span>
                  <span className="font-semibold text-lg">{formatCurrency(payroll.total_gross_payment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Deductions:</span>
                  <span className="font-semibold text-lg text-red-600">
                    -{formatCurrency(payroll.total_deductions)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-semibold text-lg">Net Payment:</span>
                  <span className="font-bold text-2xl text-green-600">
                    {formatCurrency(payroll.total_net_payment)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Records */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Records</CardTitle>
                  {payroll.total_records > (payroll.records_sample?.length || 0) && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Showing first {payroll.records_sample?.length || 0} of {payroll.total_records} records
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {payroll.records_sample && payroll.records_sample.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Number</TableHead>
                        <TableHead>Employee Name</TableHead>
                        <TableHead className="text-right">Gross Salary</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Net Salary</TableHead>
                        <TableHead>Project Allocations</TableHead>
                        <TableHead className="print:hidden">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payroll.records_sample.map((record: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <span className="font-medium text-sm">
                              {record.employee_number || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {record.employee_name || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(record.gross_salary)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {formatCurrency(record.total_deductions)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {formatCurrency(record.net_salary)}
                          </TableCell>
                          <TableCell>
                            {record.project_allocations &&
                             Array.isArray(record.project_allocations) &&
                             record.project_allocations.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {record.project_allocations.map(
                                  (allocation: any) => (
                                    <Badge key={allocation.project_id} variant="secondary" className="text-xs">
                                      {allocation.project_code}: {allocation.percentage}%
                                    </Badge>
                                  )
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No allocation
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="print:hidden">
                            {record.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewPayslip(record.id)}
                                className="whitespace-nowrap"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Payslip
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No employee records found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information (if paid) */}
          {payroll.payment_date && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Date:</span>
                  <span className="font-medium">
                    {new Date(payroll.payment_date).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {payroll.paid_by && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paid By:</span>
                    <span className="font-medium">{payroll.paid_by}</span>
                  </div>
                )}
                {payroll.payment_reference && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reference:</span>
                    <span className="font-medium">{payroll.payment_reference}</span>
                  </div>
                )}
                {payroll.bank_account && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bank Account:</span>
                    <span className="font-medium">
                      {payroll.bank_account.bank_name} - {payroll.bank_account.account_number}
                    </span>
                  </div>
                )}
                {payroll.disbursement && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Disbursement:</span>
                    <span className="font-medium">
                      {payroll.disbursement.disbursement_number}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}

      {/* Payslip Viewer Dialog */}
      {selectedPayrollRecordId && (
        <PayslipViewer
          open={showPayslipDialog}
          onClose={() => {
            setShowPayslipDialog(false);
            setSelectedPayrollRecordId("");
          }}
          payrollRecordId={selectedPayrollRecordId}
        />
      )}
    </div>
  );
}

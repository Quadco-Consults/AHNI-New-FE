"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, Loader2, AlertCircle, FileText } from "lucide-react";
import {
  useGetPayrollDetails,
  formatPayrollMonth,
  formatCurrency,
} from "@/features/finance/controllers/payrollPaymentController";
import PayslipViewer from "@/features/hr/components/payslip/PayslipViewer";

interface ViewPayrollDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  payrollId: string;
}

export default function ViewPayrollDetailsDialog({
  open,
  onClose,
  payrollId,
}: ViewPayrollDetailsDialogProps) {
  const [selectedPayrollRecordId, setSelectedPayrollRecordId] = useState<string>("");
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);

  const { data: payrollData, isLoading, error } = useGetPayrollDetails(payrollId, open);
  const payroll = payrollData?.data;

  const handleViewPayslip = (recordId: string) => {
    setSelectedPayrollRecordId(recordId);
    setShowPayslipDialog(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payroll Details</DialogTitle>
          <DialogDescription>
            {payroll ? `${formatPayrollMonth(payroll.month)} - ${payroll.total_employees} Employees` : "Loading payroll details..."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-semibold">Failed to load payroll details</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        ) : payroll ? (
          <div className="space-y-6">
            {/* Payroll Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payroll Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Period</p>
                      <p className="font-medium">{formatPayrollMonth(payroll.month)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="font-medium">{payroll.total_employees}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">{payroll.status}</Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Payment:</span>
                    <span className="font-medium">{formatCurrency(payroll.total_gross_payment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Deductions:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(payroll.total_deductions)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Net Payment:</span>
                    <span className="text-green-600">
                      {formatCurrency(payroll.total_net_payment)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Allocations */}
            {payroll.project_breakdown && payroll.project_breakdown.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Allocations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payroll.project_breakdown.map((allocation: any) => (
                        <TableRow key={allocation.project_id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{allocation.project_code}</p>
                              <p className="text-xs text-muted-foreground">
                                {allocation.project_name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(allocation.allocated_amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {allocation.percentage.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Employee Records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Employee Records
                  {payroll.total_records > (payroll.records_sample?.length || 0) && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Showing first {payroll.records_sample?.length || 0} of {payroll.total_records})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payroll.records_sample && payroll.records_sample.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead className="text-right">Gross Salary</TableHead>
                          <TableHead className="text-right">Deductions</TableHead>
                          <TableHead className="text-right">Net Salary</TableHead>
                          <TableHead>Projects</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payroll.records_sample.map((record: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{record.employee_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {record.employee_number}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(record.gross_salary)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatCurrency(record.total_deductions)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(record.net_salary)}
                            </TableCell>
                            <TableCell>
                              {record.project_allocations &&
                               typeof record.project_allocations === 'object' &&
                               Object.keys(record.project_allocations).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(record.project_allocations).map(
                                    ([projectId, percentage]: [string, any]) => (
                                      <Badge key={projectId} variant="secondary" className="text-xs">
                                        {percentage}%
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
                            <TableCell>
                              {record.id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewPayslip(record.id)}
                                  className="flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  Payslip
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No employee records found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information (if paid) */}
            {payroll.payment_date && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Date:</span>
                    <span className="font-medium">
                      {new Date(payroll.payment_date).toLocaleDateString()}
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
      </DialogContent>

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
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileText, User, DollarSign, AlertCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

import { formatCurrencyAmount } from "@/features/finance/controllers/paymentDisbursementController";
import { useCreatePaymentVoucher } from "@/features/finance/controllers/paymentVoucherController";
import { useGetBankAccounts } from "@/features/finance/controllers/accountingController";
import { useGetChartOfAccounts } from "@/features/finance/controllers/accountingController";
import type { PendingPaymentRequest } from "@/features/finance/types/payment-disbursement.types";

const formSchema = z.object({
  bank_account_id: z.string().min(1, "Bank account is required"),
  chart_account_id: z.string().min(1, "Chart of account is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessPaymentRequestDialogProps {
  open: boolean;
  onClose: () => void;
  paymentRequest: PendingPaymentRequest;
  onSuccess?: () => void;
}

export default function ProcessPaymentRequestDialog({
  open,
  onClose,
  paymentRequest,
  onSuccess,
}: ProcessPaymentRequestDialogProps) {
  const { createPaymentVoucher, isLoading, isSuccess } = useCreatePaymentVoucher();

  // Fetch real bank accounts
  const { data: bankAccountsData } = useGetBankAccounts({ is_active: true });
  const bankAccounts = Array.isArray(bankAccountsData?.data) ? bankAccountsData.data : [];

  // Fetch chart of accounts (active expense accounts)
  const { data: chartAccountsData } = useGetChartOfAccounts({
    is_active: true,
    account_type: 'EXPENSE'
  });
  const chartAccounts = Array.isArray(chartAccountsData?.data) ? chartAccountsData.data : [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank_account_id: "",
      chart_account_id: "",
      notes: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        bank_account_id: "",
        chart_account_id: "",
        notes: "",
      });
    }
  }, [open, form]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
      onClose();
    }
  }, [isSuccess, onSuccess, onClose]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Use net_amount if available (after tax deductions), otherwise use total_amount
      const grossAmount = paymentRequest.gross_amount || paymentRequest.total_amount;
      const netAmount = paymentRequest.net_amount || paymentRequest.total_amount;

      // Create Payment Voucher (status = ISSUED by default)
      await createPaymentVoucher({
        payment_request_id: paymentRequest.id,
        bank_account_id: data.bank_account_id,
        chart_account_id: data.chart_account_id,

        // Amounts
        gross_amount: grossAmount,
        total_wht: paymentRequest.total_wht || 0,
        total_vat: paymentRequest.total_vat || 0,
        total_paye: paymentRequest.total_paye || 0,
        total_pension: paymentRequest.total_pension || 0,
        total_nhis: paymentRequest.total_nhis || 0,
        net_amount: netAmount,

        // Payee information
        payee_name: paymentRequest.requested_by || "Unknown",
        payee_bank: paymentRequest.beneficiary_bank_name,
        payee_account_number: paymentRequest.beneficiary_account_number,
        payment_description: paymentRequest.payment_reason,

        // Optional fields
        project_id: paymentRequest.project?.id,
        budget_line_id: paymentRequest.budget_line?.id,
        notes: data.notes || '',
      });

      toast.success("Payment Voucher created successfully! You can now print it and make payment externally.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create Payment Voucher");
    }
  };

  // Get selected bank account
  const selectedBankAccount = bankAccounts.find(
    (acc) => acc.id === form.watch("bank_account_id")
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Payment Voucher</DialogTitle>
          <DialogDescription>
            Create a payment voucher for {paymentRequest.payment_reason}. The voucher will be issued and ready for printing/external payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <Badge variant="outline">{paymentRequest.payment_type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requested By</p>
                    <p className="font-medium">{paymentRequest.requested_by || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">
                      {new Date(paymentRequest.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Items Count</p>
                    <p className="font-medium">{paymentRequest.items_count}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Payment Reason</p>
                    <p className="font-medium">{paymentRequest.payment_reason}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total Amount:</span>
                <span className="text-green-600">
                  ₦{paymentRequest.total_amount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tax Calculation Summary */}
          {(paymentRequest.gross_amount || paymentRequest.total_wht || paymentRequest.total_vat || paymentRequest.total_paye) && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Tax Calculation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Amount (Before Tax):</span>
                    <span className="font-medium">
                      ₦{(paymentRequest.gross_amount || 0).toLocaleString()}
                    </span>
                  </div>

                  {paymentRequest.total_wht > 0 && (
                    <div className="flex justify-between text-sm pl-4 border-l-2 border-orange-300">
                      <span className="text-muted-foreground">Less: Withholding Tax (WHT)</span>
                      <span className="font-medium text-orange-600">
                        -₦{(paymentRequest.total_wht || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {paymentRequest.total_vat > 0 && (
                    <div className="flex justify-between text-sm pl-4 border-l-2 border-orange-300">
                      <span className="text-muted-foreground">Less: VAT</span>
                      <span className="font-medium text-orange-600">
                        -₦{(paymentRequest.total_vat || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {paymentRequest.total_paye > 0 && (
                    <div className="flex justify-between text-sm pl-4 border-l-2 border-orange-300">
                      <span className="text-muted-foreground">Less: PAYE</span>
                      <span className="font-medium text-orange-600">
                        -₦{(paymentRequest.total_paye || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold text-base pt-2 border-t-2 border-blue-300">
                    <span className="text-blue-700">Net Amount to Pay:</span>
                    <span className="text-blue-700">
                      ₦{(paymentRequest.net_amount || paymentRequest.total_amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-blue-100 p-2 rounded-md">
                  Tax withholdings will be automatically recorded and included in the next tax remittance cycle.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project & Fund Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project & Fund Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project</p>
                  {paymentRequest.project ? (
                    <div>
                      <p className="font-medium">{paymentRequest.project.project_id}</p>
                      <p className="text-xs text-muted-foreground">{paymentRequest.project.title}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-orange-600">⚠ Not assigned</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fund Source</p>
                  {paymentRequest.fund_source ? (
                    <Badge variant="secondary">{paymentRequest.fund_source}</Badge>
                  ) : (
                    <p className="text-sm text-orange-600">⚠ Not assigned</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget Line</p>
                {paymentRequest.budget_line ? (
                  <div>
                    <p className="font-medium text-sm">{paymentRequest.budget_line.code}</p>
                    <p className="text-xs text-muted-foreground">{paymentRequest.budget_line.name}</p>
                  </div>
                ) : (
                  <p className="text-sm text-orange-600">⚠ Not assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Items */}
          {paymentRequest.items && paymentRequest.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRequest.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.description}</p>
                            {item.recipient && (
                              <p className="text-xs text-muted-foreground">
                                To: {item.recipient}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₦{item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Payment Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will create a Payment Voucher (PV) with status "ISSUED".
                  After creating the PV, you can print it and make the payment through your external banking platform.
                  Once payment is completed, return here to mark the PV as PAID.
                </p>
              </div>

              <FormField
                control={form.control}
                name="bank_account_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank account to pay from" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bankAccounts.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No bank accounts available
                          </SelectItem>
                        ) : (
                          bankAccounts.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.bank_name} - {account.account_number} (₦{(account.current_balance || 0).toLocaleString()})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the bank account to debit for this payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chart_account_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chart of Account (Expense Type) *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expense account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chartAccounts.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No expense accounts available
                          </SelectItem>
                        ) : (
                          chartAccounts.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_code} - {account.account_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the expense account to allocate this payment to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any additional notes about this payment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating PV..." : "Create Payment Voucher"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

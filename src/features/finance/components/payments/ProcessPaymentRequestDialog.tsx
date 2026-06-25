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

import {
  useCreatePaymentDisbursement,
  formatCurrencyAmount,
} from "@/features/finance/controllers/paymentDisbursementController";
import { useGetBankAccounts } from "@/features/finance/controllers/accountingController";
import { useGetChartOfAccounts } from "@/features/finance/controllers/accountingController";
import type { PendingPaymentRequest } from "@/features/finance/types/payment-disbursement.types";

const formSchema = z.object({
  payment_date: z.string().min(1, "Payment date is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  bank_account_id: z.string().min(1, "Bank account is required"),
  chart_account_id: z.string().min(1, "Chart of account is required"),
  payment_reference: z.string().min(1, "Payment reference is required"),
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
  const { createDisbursement, isLoading, isSuccess } = useCreatePaymentDisbursement();

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
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "BANK_TRANSFER",
      bank_account_id: "",
      chart_account_id: "",
      payment_reference: "",
      notes: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "BANK_TRANSFER",
        bank_account_id: "",
        chart_account_id: "",
        payment_reference: "",
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
    // Validate payment date is not in the future
    const paymentDate = new Date(data.payment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (paymentDate > today) {
      toast.error("Payment date cannot be in the future");
      return;
    }

    try {
      // Use net_amount if available (after tax deductions), otherwise use total_amount
      const paymentAmount = paymentRequest.net_amount || paymentRequest.total_amount;

      await createDisbursement({
        payment_request_id: paymentRequest.id,
        payment_date: data.payment_date,
        payment_method: data.payment_method as any,
        bank_account_id: data.bank_account_id,
        chart_account_id: data.chart_account_id,
        payment_reference: data.payment_reference,
        total_amount: paymentAmount,
        notes: data.notes || '',
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
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
          <DialogTitle>Process Payment Request</DialogTitle>
          <DialogDescription>
            Process payment for {paymentRequest.payment_reason}
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
              <FormField
                control={form.control}
                name="payment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date when the payment will be made
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Method used to make the payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {selectedBankAccount && selectedBankAccount.current_balance < (paymentRequest.net_amount || paymentRequest.total_amount) && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      Insufficient Balance
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Account balance (₦{selectedBankAccount.current_balance.toLocaleString()}) is less than the payment amount (₦{(paymentRequest.net_amount || paymentRequest.total_amount).toLocaleString()})
                    </p>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="payment_reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Reference *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., TRX123456, CHQ001, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Bank transaction reference or cheque number
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
                  disabled={
                    isLoading ||
                    (selectedBankAccount &&
                      selectedBankAccount.current_balance < (paymentRequest.net_amount || paymentRequest.total_amount))
                  }
                >
                  {isLoading ? "Processing..." : "Process Payment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

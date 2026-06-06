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
import { Calendar, Building2, Users, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  useProcessPayrollPayment,
  formatPayrollMonth,
  formatCurrency,
  validatePaymentData,
} from "@/features/finance/controllers/payrollPaymentController";
import type { PendingPayroll, ProcessPayrollPaymentRequest } from "@/features/finance/types/payroll-payment.types";

// TODO: Replace with actual bank accounts fetch
const mockBankAccounts = [
  { id: "1", bank_name: "GTBank", account_number: "0123456789", current_balance: 5000000 },
  { id: "2", bank_name: "Access Bank", account_number: "9876543210", current_balance: 3000000 },
  { id: "3", bank_name: "Zenith Bank", account_number: "1122334455", current_balance: 10000000 },
];

const formSchema = z.object({
  payment_date: z.string().min(1, "Payment date is required"),
  bank_account_id: z.string().min(1, "Bank account is required"),
  payment_reference: z.string().min(1, "Payment reference is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessPayrollPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  payroll: PendingPayroll;
  onSuccess?: () => void;
}

export default function ProcessPayrollPaymentDialog({
  open,
  onClose,
  payroll,
  onSuccess,
}: ProcessPayrollPaymentDialogProps) {
  const { processPayment, isLoading, isSuccess } = useProcessPayrollPayment();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0],
      bank_account_id: "",
      payment_reference: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        payment_date: new Date().toISOString().split("T")[0],
        bank_account_id: "",
        payment_reference: "",
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
    // Validate
    const errors = validatePaymentData(data);
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      await processPayment(payroll.id, data);
    } catch (error: any) {
      toast.error(error.message || "Failed to process payroll payment");
    }
  };

  // Get selected bank account
  const selectedBankAccount = mockBankAccounts.find(
    (acc) => acc.id === form.watch("bank_account_id")
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Payroll Payment</DialogTitle>
          <DialogDescription>
            Process payment for {formatPayrollMonth(payroll.month)} payroll
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payroll Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    {payroll.project_breakdown.map((allocation) => (
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
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockBankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {account.bank_name} - {account.account_number}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Balance: {formatCurrency(account.current_balance)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the bank account to debit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedBankAccount && selectedBankAccount.current_balance < payroll.total_net_payment && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      Insufficient Balance
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Account balance ({formatCurrency(selectedBankAccount.current_balance)}) is less than the payment amount ({formatCurrency(payroll.total_net_payment)})
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
                      selectedBankAccount.current_balance < payroll.total_net_payment)
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

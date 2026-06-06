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
import type { PendingPaymentRequest } from "@/features/finance/types/payment-disbursement.types";

// TODO: Replace with actual bank accounts fetch
const mockBankAccounts = [
  { id: "1", bank_name: "GTBank", account_number: "0123456789", current_balance: 5000000 },
  { id: "2", bank_name: "Access Bank", account_number: "9876543210", current_balance: 3000000 },
  { id: "3", bank_name: "Zenith Bank", account_number: "1122334455", current_balance: 10000000 },
];

const formSchema = z.object({
  payment_date: z.string().min(1, "Payment date is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  bank_account_id: z.string().min(1, "Bank account is required"),
  payment_reference: z.string().min(1, "Payment reference is required"),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "BANK_TRANSFER",
      bank_account_id: "",
      payment_reference: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "BANK_TRANSFER",
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
    // Validate payment date is not in the future
    const paymentDate = new Date(data.payment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (paymentDate > today) {
      toast.error("Payment date cannot be in the future");
      return;
    }

    try {
      await createDisbursement({
        payment_request_id: paymentRequest.id,
        payment_date: data.payment_date,
        payment_method: data.payment_method as any,
        bank_account_id: data.bank_account_id,
        payment_reference: data.payment_reference,
        total_amount: paymentRequest.total_amount,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
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
                                Balance: ₦{account.current_balance.toLocaleString()}
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

              {selectedBankAccount && selectedBankAccount.current_balance < paymentRequest.total_amount && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      Insufficient Balance
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Account balance (₦{selectedBankAccount.current_balance.toLocaleString()}) is less than the payment amount (₦{paymentRequest.total_amount.toLocaleString()})
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
                      selectedBankAccount.current_balance < paymentRequest.total_amount)
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

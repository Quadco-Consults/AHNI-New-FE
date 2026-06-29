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
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, DollarSign, AlertCircle, Calendar, Building2 } from "lucide-react";
import { toast } from "sonner";

import { formatCurrencyAmount } from "@/features/finance/controllers/paymentDisbursementController";
import { useCreatePaymentVoucher } from "@/features/finance/controllers/paymentVoucherController";
import { useGetBankAccounts } from "@/features/finance/controllers/accountingController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { formatCurrency } from "@/lib/utils";

const formSchema = z.object({
  bank_account_id: z.string().min(1, "Bank account is required"),
  reviewer_id: z.string().optional(),
  authorizer_id: z.string().optional(),
  approver_id: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessFundRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fundRequest: any;
  onSuccess?: () => void;
}

export default function ProcessFundRequestDialog({
  open,
  onOpenChange,
  fundRequest,
  onSuccess,
}: ProcessFundRequestDialogProps) {
  const { createPaymentVoucher, isLoading, isSuccess } = useCreatePaymentVoucher();

  // Fetch real bank accounts
  const { data: bankAccountsData } = useGetBankAccounts({ is_active: true });
  const bankAccounts = Array.isArray(bankAccountsData?.data) ? bankAccountsData.data : [];

  // Fetch users for approval workflow
  const { data: usersData } = useGetAllUsers({ page: 1, size: 100 });
  const users = Array.isArray(usersData?.data?.results) ? usersData.data.results : [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank_account_id: "",
      reviewer_id: "",
      authorizer_id: "",
      approver_id: "",
      notes: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        bank_account_id: "",
        reviewer_id: "",
        authorizer_id: "",
        approver_id: "",
        notes: `Fund transfer for ${fundRequest?.project?.title || 'project'} - ${fundRequest?.location?.name || 'location'} (${fundRequest?.month} ${fundRequest?.year})`,
      });
    }
  }, [open, form, fundRequest]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment Voucher created successfully!");
      onSuccess?.();
      onOpenChange(false);
    }
  }, [isSuccess, onSuccess, onOpenChange]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Get fund request details
      const totalAmount = parseFloat(fundRequest.total_amount || "0");
      const locationName = typeof fundRequest.location === 'string'
        ? fundRequest.location
        : fundRequest.location?.name || "Unknown Location";
      const projectName = typeof fundRequest.project === 'string'
        ? fundRequest.project
        : fundRequest.project?.title || fundRequest.project?.project_id || "Unknown Project";

      // Create Payment Voucher for fund transfer (no tax deductions on internal transfers)
      await createPaymentVoucher({
        fund_request_id: fundRequest.id,
        bank_account_id: data.bank_account_id,
        payment_date: new Date().toISOString().split('T')[0], // Today's date
        payment_method: "BANK_TRANSFER" as const,
        payment_description: `Fund transfer to ${locationName} for ${projectName} - ${fundRequest.month} ${fundRequest.year}`,

        // Amounts (no deductions for fund transfers)
        gross_amount: totalAmount,
        total_wht: 0,
        total_vat: 0,
        total_paye: 0,
        total_pension: 0,
        total_nhis: 0,
        net_amount: totalAmount, // Same as gross for fund transfers

        // Payee information (State/Location account)
        payee_name: `${locationName} - ${projectName}`,
        payee_bank: undefined,
        payee_account_number: undefined,

        // Approval workflow - selected approvers
        reviewer_id: data.reviewer_id || undefined,
        authorizer_id: data.authorizer_id || undefined,
        approver_id: data.approver_id || undefined,

        // Additional details
        notes: data.notes || `Fund Request: FR-${fundRequest.uuid_code}`,
      });

      toast.success("Payment Voucher created successfully!");
    } catch (error: any) {
      console.error("Failed to create payment voucher:", error);
      toast.error(error?.message || "Failed to create payment voucher");
    }
  };

  // Extract fund request details
  const locationName = typeof fundRequest?.location === 'string'
    ? fundRequest.location
    : fundRequest?.location?.name || "N/A";
  const projectName = typeof fundRequest?.project === 'string'
    ? fundRequest.project
    : fundRequest?.project?.title || fundRequest?.project?.project_id || "N/A";
  const totalAmount = parseFloat(fundRequest?.total_amount || "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Payment Voucher - Fund Transfer
          </DialogTitle>
          <DialogDescription>
            Generate payment voucher to transfer funds to {locationName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Fund Request Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fund Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">FR Code</p>
                    <Badge variant="outline" className="font-mono">
                      FR-{fundRequest?.uuid_code}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Period</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{fundRequest?.month} {fundRequest?.year}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Project</p>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{projectName}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location/State</p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{locationName}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Total Amount to Transfer</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    No tax deductions applied (internal fund transfer)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bank Account Selection */}
            <FormField
              control={form.control}
              name="bank_account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiving Bank Account *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank account for this location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bankAccounts.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No bank accounts found
                        </div>
                      ) : (
                        bankAccounts.map((account: any) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} - {account.bank_name} ({account.account_number})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Approval Workflow */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Approval Workflow</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Reviewer */}
                <FormField
                  control={form.control}
                  name="reviewer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer (Finance Manager)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || user.name} {user.designation ? `- ${user.designation}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Authorizer */}
                <FormField
                  control={form.control}
                  name="authorizer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorizer (Director of Finance)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select authorizer (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || user.name} {user.designation ? `- ${user.designation}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Approver */}
                <FormField
                  control={form.control}
                  name="approver_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approver (Managing Director)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select approver (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || user.name} {user.designation ? `- ${user.designation}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Additional notes..."
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info Alert */}
            <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Fund Transfer</p>
                <p className="mt-1">
                  This will create a Payment Voucher to transfer{" "}
                  <span className="font-semibold">{formatCurrency(totalAmount)}</span> to{" "}
                  <span className="font-semibold">{locationName}</span> for project implementation.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Payment Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

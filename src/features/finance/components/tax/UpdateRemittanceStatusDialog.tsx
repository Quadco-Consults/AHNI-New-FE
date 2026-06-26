"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUpdateRemittanceStatus } from "../../controllers/taxController";
import { useGetBankAccounts, useGetChartOfAccounts } from "../../controllers/accountingController";
import { TaxRemittance, UpdateRemittanceStatusRequest } from "../../types/tax.types";
import { Send, Upload } from "lucide-react";

const updateStatusSchema = z.object({
  status: z.enum(["SUBMITTED", "PAID"], {
    required_error: "Status is required",
  }),
  remittance_date: z.string().optional(),
  payment_reference: z.string().optional(),
  receipt_file: z.any().optional(),
  bank_account_id: z.string().optional(),
  chart_account_id: z.string().optional(),
}).refine(
  (data) => {
    // If status is PAID, all fields are required
    if (data.status === "PAID") {
      return !!data.remittance_date && !!data.payment_reference && !!data.bank_account_id && !!data.chart_account_id;
    }
    return true;
  },
  {
    message: "Remittance date, payment reference, bank account, and chart of account are required when marking as PAID",
    path: ["payment_reference"],
  }
);

type FormValues = z.infer<typeof updateStatusSchema>;

interface UpdateRemittanceStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remittance: TaxRemittance;
}

export default function UpdateRemittanceStatusDialog({
  open,
  onOpenChange,
  remittance,
}: UpdateRemittanceStatusDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutateAsync: updateStatus } = useUpdateRemittanceStatus(remittance.id);

  // Fetch bank accounts and chart of accounts
  const { data: bankAccountsData } = useGetBankAccounts({ is_active: true });
  const { data: chartAccountsData } = useGetChartOfAccounts({ is_active: true });

  const form = useForm<FormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: "SUBMITTED",
      remittance_date: "",
      payment_reference: "",
      bank_account_id: "",
      chart_account_id: "",
    },
  });

  const selectedStatus = form.watch("status");

  // Reset form when dialog opens or remittance changes
  useEffect(() => {
    if (open && remittance) {
      form.reset({
        status: remittance.status === "PREPARED" ? "SUBMITTED" : "PAID",
        remittance_date: remittance.remittance_date || new Date().toISOString().split("T")[0],
        payment_reference: remittance.payment_reference || "",
        bank_account_id: "",
        chart_account_id: "",
      });
      setSelectedFile(null);
    }
  }, [open, remittance, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: UpdateRemittanceStatusRequest = {
        status: data.status,
        remittance_date: data.remittance_date,
        payment_reference: data.payment_reference,
        receipt_file: selectedFile || undefined,
        bank_account_id: data.bank_account_id,
        chart_account_id: data.chart_account_id,
      };

      await updateStatus(payload);

      toast.success(`Remittance status updated to ${data.status}`, {
        description: `Remittance ${remittance.remittance_number} has been updated successfully.`,
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Status update is temporarily unavailable. Please try again later.");
      } else {
        toast.error(error?.message || "Failed to update remittance status");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Update Remittance Status
          </DialogTitle>
          <DialogDescription>
            Update the status of remittance {remittance.remittance_number}
          </DialogDescription>
        </DialogHeader>

        {/* Remittance Summary */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm">Remittance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax Authority:</span>
              <span className="font-medium">{remittance.tax_authority_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax Type:</span>
              <span className="font-medium">{remittance.tax_type_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">
                {new Date(remittance.period_from).toLocaleDateString()} -
                {new Date(remittance.period_to).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Withholding Count:</span>
              <Badge variant="secondary">{remittance.withholding_count} items</Badge>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-semibold text-green-600">
                ₦{Number(remittance.total_amount).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Status *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SUBMITTED">
                        <div className="flex flex-col">
                          <span className="font-medium">Submitted</span>
                          <span className="text-xs text-gray-500">
                            Submitted to tax authority, awaiting payment
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PAID">
                        <div className="flex flex-col">
                          <span className="font-medium">Paid</span>
                          <span className="text-xs text-gray-500">
                            Payment completed to tax authority
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedStatus === "PAID" && (
              <>
                <FormField
                  control={form.control}
                  name="remittance_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remittance Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Date when payment was made
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Reference *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., TRX123456, CHQ001"
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
                          {bankAccountsData?.data?.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_name} - {account.account_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Bank account used to pay this tax
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
                      <FormLabel>Chart of Account *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select chart of account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chartAccountsData?.data?.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_code} - {account.account_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Expense account for tax payment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Receipt/Proof of Payment (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <Badge variant="secondary" className="gap-1">
                          <Upload className="h-3 w-3" />
                          {selectedFile.name}
                        </Badge>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload payment receipt or confirmation (PDF, JPG, PNG)
                  </FormDescription>
                </FormItem>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

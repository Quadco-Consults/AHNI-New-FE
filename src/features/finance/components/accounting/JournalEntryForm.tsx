"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Calculator } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { useGetChartOfAccounts } from "../../controllers/accountingController";
import { JournalEntryFormData } from "../../types/accounting.types";

const journalEntryLineSchema = z.object({
  account: z.string().min(1, "Account is required"),
  description: z.string().optional(),
  debit_amount: z.number().min(0, "Debit amount must be positive"),
  credit_amount: z.number().min(0, "Credit amount must be positive"),
  project: z.string().optional(),
  department: z.string().optional(),
});

const journalEntrySchema = z.object({
  entry_date: z.string().min(1, "Entry date is required"),
  description: z.string().min(1, "Description is required"),
  reference_number: z.string().optional(),
  line_items: z.array(journalEntryLineSchema).min(2, "At least 2 line items required"),
}).refine((data) => {
  const totalDebits = data.line_items.reduce((sum, item) => sum + item.debit_amount, 0);
  const totalCredits = data.line_items.reduce((sum, item) => sum + item.credit_amount, 0);
  return Math.abs(totalDebits - totalCredits) < 0.01;
}, {
  message: "Total debits must equal total credits",
  path: ["line_items"],
});

interface JournalEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: JournalEntryFormData) => Promise<void>;
  loading?: boolean;
  initialData?: JournalEntryFormData;
}

export default function JournalEntryForm({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  initialData,
}: JournalEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: accountsData } = useGetChartOfAccounts();
  const accounts = Array.isArray(accountsData?.data) ? accountsData.data : [];

  const form = useForm<JournalEntryFormData>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: initialData || {
      entry_date: new Date().toISOString().split('T')[0],
      description: "",
      reference_number: "",
      line_items: [
        { account: "", description: "", debit_amount: 0, credit_amount: 0 },
        { account: "", description: "", debit_amount: 0, credit_amount: 0 },
      ],
    },
  });

  // Reset form when initialData changes (for editing)
  useEffect(() => {
    const defaultValues = {
      entry_date: new Date().toISOString().split('T')[0],
      description: "",
      reference_number: "",
      line_items: [
        { account: "", description: "", debit_amount: 0, credit_amount: 0 },
        { account: "", description: "", debit_amount: 0, credit_amount: 0 },
      ],
    };

    form.reset(initialData || defaultValues);
  }, [initialData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
  });

  const watchedLineItems = form.watch("line_items");

  // Calculate totals
  const totalDebits = watchedLineItems.reduce((sum, item) => sum + (item.debit_amount || 0), 0);
  const totalCredits = watchedLineItems.reduce((sum, item) => sum + (item.credit_amount || 0), 0);
  const difference = totalDebits - totalCredits;
  const isBalanced = Math.abs(difference) < 0.01;

  const handleSubmit = async (data: JournalEntryFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
      toast.success("Journal entry created successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLineItem = () => {
    append({ account: "", description: "", debit_amount: 0, credit_amount: 0 });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? `${account.account_code} - ${account.account_name}` : "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
          <DialogDescription>
            Create a new journal entry with multiple line items. Debits must equal credits.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="entry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isSubmitting || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter reference number"
                        {...field}
                        disabled={isSubmitting || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <div className="w-full">
                  <label className="text-sm font-medium">Balance Check</label>
                  <div className="mt-2">
                    <Badge
                      variant={isBalanced ? "default" : "destructive"}
                      className="w-full justify-center"
                    >
                      {isBalanced ? "Balanced ✓" : `Out of Balance: $${Math.abs(difference).toFixed(2)}`}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter journal entry description"
                      {...field}
                      disabled={isSubmitting || loading}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Line Items */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Line Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLineItem}
                    disabled={isSubmitting || loading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line
                  </Button>
                </div>

                {/* Headers */}
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
                  <div className="col-span-4">Account</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2">Debit</div>
                  <div className="col-span-2">Credit</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={`${field.id}-${index}`} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.account`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isSubmitting || loading}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select account" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accounts && Array.isArray(accounts) ? accounts.filter(account => account.id).map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                      {account.account_code} - {account.account_name}
                                    </SelectItem>
                                  )) : (
                                    <SelectItem value="no-accounts" disabled>
                                      No accounts available
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Line description"
                                  {...field}
                                  disabled={isSubmitting || loading}
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.debit_amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  disabled={isSubmitting || loading}
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.credit_amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  disabled={isSubmitting || loading}
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                          disabled={fields.length <= 2 || isSubmitting || loading}
                          className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                    <div className="col-span-7 text-right">Totals:</div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Calculator className="w-4 h-4" />
                        <span>${totalDebits.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Calculator className="w-4 h-4" />
                        <span>${totalCredits.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isBalanced || isSubmitting || loading}
              >
                {isSubmitting || loading ? "Creating..." : "Create Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
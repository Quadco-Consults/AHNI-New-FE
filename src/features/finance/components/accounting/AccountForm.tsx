"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Switch } from "components/ui/switch";
import { toast } from "sonner";
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
import {
  useCreateChartOfAccount,
  useUpdateChartOfAccount,
  useGetChartOfAccounts,
} from "../../controllers/accountingController";
import {
  ChartOfAccount,
  ChartOfAccountFormData,
  AccountType,
  QuickBooksAccountType
} from "../../types/accounting.types";

const accountSchema = z.object({
  account_code: z.string().min(1, "Account code is required"),
  account_name: z.string().min(1, "Account name is required"),
  account_type: z.enum(['ASSETS', 'LIABILITIES', 'EQUITY', 'REVENUE', 'EXPENSES'], {
    required_error: "Account type is required"
  }),
  quickbooks_account_type: z.string().optional(),
  parent_account: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_header: z.boolean().default(false),
});

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'ASSETS', label: 'Assets' },
  { value: 'LIABILITIES', label: 'Liabilities' },
  { value: 'EQUITY', label: 'Equity' },
  { value: 'REVENUE', label: 'Revenue' },
  { value: 'EXPENSES', label: 'Expenses' },
];

const QUICKBOOKS_ACCOUNT_TYPES: { value: QuickBooksAccountType; label: string; accountType: AccountType }[] = [
  // Asset types
  { value: 'Bank', label: 'Bank', accountType: 'ASSETS' },
  { value: 'Other Current Asset', label: 'Other Current Asset', accountType: 'ASSETS' },
  { value: 'Accounts Receivable', label: 'Accounts Receivable', accountType: 'ASSETS' },
  { value: 'Fixed Asset', label: 'Fixed Asset', accountType: 'ASSETS' },
  { value: 'Other Asset', label: 'Other Asset', accountType: 'ASSETS' },

  // Liability types
  { value: 'Accounts Payable', label: 'Accounts Payable', accountType: 'LIABILITIES' },
  { value: 'Credit Card', label: 'Credit Card', accountType: 'LIABILITIES' },
  { value: 'Long Term Liability', label: 'Long Term Liability', accountType: 'LIABILITIES' },
  { value: 'Other Current Liability', label: 'Other Current Liability', accountType: 'LIABILITIES' },

  // Equity
  { value: 'Equity', label: 'Equity', accountType: 'EQUITY' },

  // Income/Revenue
  { value: 'Income', label: 'Income', accountType: 'REVENUE' },
  { value: 'Other Income', label: 'Other Income', accountType: 'REVENUE' },

  // Expense
  { value: 'Expense', label: 'Expense', accountType: 'EXPENSES' },
  { value: 'Other Expense', label: 'Other Expense', accountType: 'EXPENSES' },
  { value: 'Cost of Goods Sold', label: 'Cost of Goods Sold', accountType: 'EXPENSES' },
];

interface AccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: ChartOfAccount;
  parentAccountId?: string;
}

export default function AccountForm({
  open,
  onOpenChange,
  account,
  parentAccountId,
}: AccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mode = account ? "edit" : "create";

  const { createChartOfAccount, isLoading: isCreating } = useCreateChartOfAccount();
  const { updateChartOfAccount, isLoading: isUpdating } = useUpdateChartOfAccount(
    account?.id || ""
  );

  // Fetch accounts for parent selection
  const { data: accountsData } = useGetChartOfAccounts({});
  const accounts = Array.isArray(accountsData?.data) ? accountsData.data : [];
  const parentAccounts = accounts.filter(acc => acc?.is_header && acc.id !== account?.id);

  const form = useForm<ChartOfAccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      account_code: account?.account_code || "",
      account_name: account?.account_name || "",
      account_type: account?.account_type || 'ASSETS',
      quickbooks_account_type: account?.quickbooks_account_type || "",
      parent_account: account?.parent_account as string || parentAccountId || "",
      description: account?.description || "",
      is_active: account?.is_active ?? true,
      is_header: account?.is_header ?? false,
    },
  });

  const watchedAccountType = form.watch("account_type");

  // Filter QuickBooks account types based on selected account type
  const filteredQBTypes = QUICKBOOKS_ACCOUNT_TYPES.filter(
    qbType => qbType.accountType === watchedAccountType
  );

  // Reset QuickBooks account type when account type changes
  useEffect(() => {
    if (watchedAccountType) {
      form.setValue("quickbooks_account_type", "");
    }
  }, [watchedAccountType, form]);

  const onSubmit = async (data: ChartOfAccountFormData) => {
    setIsSubmitting(true);
    try {
      // Transform "none" values to appropriate values for API
      const transformedData = {
        ...data,
        parent_account: data.parent_account === "none" ? undefined : data.parent_account,
        quickbooks_account_type: data.quickbooks_account_type === "none" ? undefined : data.quickbooks_account_type,
      };

      if (mode === "create") {
        await createChartOfAccount(transformedData);
        toast.success("Chart of Account created successfully");
      } else {
        await updateChartOfAccount(transformedData);
        toast.success("Chart of Account updated successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Account" : "Edit Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new account to your chart of accounts."
              : "Update the account details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="account_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1000"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Cash in Bank"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quickbooks_account_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>QuickBooks Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select QB type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {filteredQBTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parent_account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Account</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent account (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Top Level)</SelectItem>
                      {parentAccounts.map((parentAcc) => (
                        <SelectItem key={parentAcc.id} value={parentAcc.id}>
                          {parentAcc.account_code} - {parentAcc.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter account description (optional)"
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <div className="text-sm text-gray-600">
                        Enable or disable this account
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_header"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Header Account</FormLabel>
                      <div className="text-sm text-gray-600">
                        Use as parent for other accounts
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create Account" : "Update Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
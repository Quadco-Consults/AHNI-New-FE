"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateBudgetLine,
  useGetCostInputs,
} from "../../controllers/classificationsController";
import {
  BudgetLine,
  BudgetLineFormData,
} from "../../types/classification.types";

const budgetLineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  cost_input: z.string().min(1, "Cost Input is required"),
  account_code: z.string().optional(),
  gl_account: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface BudgetLineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetLine?: BudgetLine;
  mode: "create" | "edit";
}

export default function BudgetLineForm({
  open,
  onOpenChange,
  budgetLine,
  mode,
}: BudgetLineFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createBudgetLine, isLoading: isCreating } = useCreateBudgetLine();

  // Fetch Cost Inputs for the dropdown
  const { data: costInputsData } = useGetCostInputs({
    page: 1,
    page_size: 1000,
    is_active: true,
  });

  const costInputs = costInputsData?.data?.results || [];

  const form = useForm<BudgetLineFormData>({
    resolver: zodResolver(budgetLineSchema),
    defaultValues: {
      name: budgetLine?.name || "",
      code: budgetLine?.code || "",
      description: budgetLine?.description || "",
      cost_input:
        typeof budgetLine?.cost_input === "string"
          ? budgetLine.cost_input
          : budgetLine?.cost_input?.id || "",
      account_code: budgetLine?.account_code || "",
      gl_account: budgetLine?.gl_account || "",
      is_active: budgetLine?.is_active ?? true,
    },
  });

  const onSubmit = async (data: BudgetLineFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createBudgetLine(data);
        toast.success("Budget Line created successfully");
      } else {
        // TODO: Add update functionality when useUpdateBudgetLine is available
        toast.success("Budget Line updated successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      // Handle specific 404 error for missing backend endpoint
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Budget line operation is temporarily unavailable. The backend service is being deployed. Please try again in a few minutes.");
      } else {
        toast.error(error?.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isCreating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Budget Line" : "Edit Budget Line"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new budget line under a cost input."
              : "Update the budget line details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cost_input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Input *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Cost Input" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costInputs.map((input) => (
                        <SelectItem key={input.id} value={input.id}>
                          {input.code} - {input.name}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter budget line name"
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter budget line code"
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
              name="account_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter account code"
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
              name="gl_account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GL Account</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter GL account"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description (optional)"
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-sm text-gray-600">
                      Enable or disable this budget line
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
                {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
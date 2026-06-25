"use client";

import { useState, useEffect } from "react";
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
import {
  useCreateTaxType,
  useUpdateTaxType,
} from "../../controllers/taxController";
import {
  TaxType,
  TaxTypeFormData,
  TAX_CATEGORIES,
} from "../../types/tax.types";

const taxTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  tax_category: z.enum(['WHT', 'VAT', 'PAYE', 'OTHER'], {
    required_error: "Tax category is required",
  }),
  rate: z.string().min(1, "Rate is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
    "Rate must be between 0 and 100"
  ),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface TaxTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxType?: TaxType;
  mode: "create" | "edit";
}

export default function TaxTypeForm({
  open,
  onOpenChange,
  taxType,
  mode,
}: TaxTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createTaxType, isLoading: isCreating } = useCreateTaxType();
  const { updateTaxType, isLoading: isUpdating } = useUpdateTaxType(taxType?.id || "");

  const form = useForm<TaxTypeFormData>({
    resolver: zodResolver(taxTypeSchema),
    defaultValues: {
      name: taxType?.name || "",
      code: taxType?.code || "",
      tax_category: taxType?.tax_category || 'WHT',
      rate: taxType?.rate || "",
      description: taxType?.description || "",
      is_active: taxType?.is_active ?? true,
    },
  });

  // Reset form when taxType changes
  useEffect(() => {
    if (taxType && mode === "edit") {
      form.reset({
        name: taxType.name,
        code: taxType.code,
        tax_category: taxType.tax_category,
        rate: taxType.rate,
        description: taxType.description || "",
        is_active: taxType.is_active,
      });
    } else if (mode === "create") {
      form.reset({
        name: "",
        code: "",
        tax_category: 'WHT',
        rate: "",
        description: "",
        is_active: true,
      });
    }
  }, [taxType, mode, form]);

  const onSubmit = async (data: TaxTypeFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createTaxType(data);
        toast.success("Tax type created successfully");
      } else {
        await updateTaxType(data);
        toast.success("Tax type updated successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Tax type operation is temporarily unavailable. Please try again later.");
      } else {
        toast.error(error?.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Tax Type" : "Edit Tax Type"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new tax type (WHT, VAT, PAYE) with rate configuration."
              : "Update the tax type details and rate."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., WHT - Professional Services"
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
                        placeholder="e.g., WHT-PROF"
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
                name="tax_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TAX_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="e.g., 5.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Between 0 and 100
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="When this tax applies..."
                      className="resize-none"
                      rows={3}
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
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription className="text-xs">
                      Inactive tax types won't be available for selection
                    </FormDescription>
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

            <div className="flex justify-end gap-3 pt-4">
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

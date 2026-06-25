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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateTaxAuthority,
  useUpdateTaxAuthority,
} from "../../controllers/taxController";
import {
  TaxAuthority,
  TaxAuthorityFormData,
} from "../../types/tax.types";

const taxAuthoritySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  account_name: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface TaxAuthorityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxAuthority?: TaxAuthority;
  mode: "create" | "edit";
}

export default function TaxAuthorityForm({
  open,
  onOpenChange,
  taxAuthority,
  mode,
}: TaxAuthorityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createTaxAuthority, isLoading: isCreating } = useCreateTaxAuthority();
  const { updateTaxAuthority, isLoading: isUpdating } = useUpdateTaxAuthority(taxAuthority?.id || "");

  const form = useForm<TaxAuthorityFormData>({
    resolver: zodResolver(taxAuthoritySchema),
    defaultValues: {
      name: taxAuthority?.name || "",
      code: taxAuthority?.code || "",
      address: taxAuthority?.address || "",
      contact_email: taxAuthority?.contact_email || "",
      contact_phone: taxAuthority?.contact_phone || "",
      bank_name: taxAuthority?.bank_name || "",
      account_number: taxAuthority?.account_number || "",
      account_name: taxAuthority?.account_name || "",
      is_active: taxAuthority?.is_active ?? true,
    },
  });

  // Reset form when taxAuthority changes
  useEffect(() => {
    if (taxAuthority && mode === "edit") {
      form.reset({
        name: taxAuthority.name,
        code: taxAuthority.code,
        address: taxAuthority.address || "",
        contact_email: taxAuthority.contact_email || "",
        contact_phone: taxAuthority.contact_phone || "",
        bank_name: taxAuthority.bank_name || "",
        account_number: taxAuthority.account_number || "",
        account_name: taxAuthority.account_name || "",
        is_active: taxAuthority.is_active,
      });
    } else if (mode === "create") {
      form.reset({
        name: "",
        code: "",
        address: "",
        contact_email: "",
        contact_phone: "",
        bank_name: "",
        account_number: "",
        account_name: "",
        is_active: true,
      });
    }
  }, [taxAuthority, mode, form]);

  const onSubmit = async (data: TaxAuthorityFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createTaxAuthority(data);
        toast.success("Tax authority created successfully");
      } else {
        await updateTaxAuthority(data);
        toast.success("Tax authority updated successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Tax authority operation is temporarily unavailable. Please try again later.");
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Tax Authority" : "Edit Tax Authority"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new tax authority (FIRS, State Revenue Service, etc.)."
              : "Update the tax authority details and bank information."}
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
                        placeholder="e.g., Federal Inland Revenue Service"
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
                        placeholder="e.g., FIRS"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Physical address..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
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
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+234-XXX-XXX-XXXX"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Bank Details for Remittance</h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Central Bank of Nigeria"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234567890"
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
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Account title"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription className="text-xs">
                      Inactive authorities won't be available for selection
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

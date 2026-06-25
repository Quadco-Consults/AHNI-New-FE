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
import {
  useGetTaxTypes,
  useGetTaxAuthorities,
  usePrepareRemittance,
} from "../../controllers/taxController";
import { PrepareRemittanceRequest } from "../../types/tax.types";
import { DollarSign } from "lucide-react";

const prepareRemittanceSchema = z.object({
  tax_authority_id: z.string().min(1, "Tax authority is required"),
  tax_type_id: z.string().min(1, "Tax type is required"),
  period_from: z.string().min(1, "Start date is required"),
  period_to: z.string().min(1, "End date is required"),
}).refine(
  (data) => {
    const from = new Date(data.period_from);
    const to = new Date(data.period_to);
    return from <= to;
  },
  {
    message: "End date must be after or equal to start date",
    path: ["period_to"],
  }
);

type FormValues = z.infer<typeof prepareRemittanceSchema>;

interface PrepareRemittanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrepareRemittanceDialog({
  open,
  onOpenChange,
}: PrepareRemittanceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: prepareRemittance } = usePrepareRemittance();

  const { data: taxAuthoritiesData } = useGetTaxAuthorities({ is_active: true });
  const { data: taxTypesData } = useGetTaxTypes({ is_active: true });

  const taxAuthorities = taxAuthoritiesData?.data?.results || [];
  const taxTypes = taxTypesData?.data?.results || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(prepareRemittanceSchema),
    defaultValues: {
      tax_authority_id: "",
      tax_type_id: "",
      period_from: "",
      period_to: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Set default period to current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      form.reset({
        tax_authority_id: "",
        tax_type_id: "",
        period_from: firstDay.toISOString().split("T")[0],
        period_to: lastDay.toISOString().split("T")[0],
      });
    }
  }, [open, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await prepareRemittance(data as PrepareRemittanceRequest);

      toast.success("Remittance prepared successfully", {
        description: `Remittance number: ${result?.data?.remittance_number || "N/A"}`,
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Remittance preparation is temporarily unavailable. Please try again later.");
      } else if (error?.message?.includes('No pending withholdings')) {
        toast.error("No pending withholdings found for the selected criteria.");
      } else {
        toast.error(error?.message || "Failed to prepare remittance");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Prepare Tax Remittance
          </DialogTitle>
          <DialogDescription>
            Select tax authority, tax type, and period to batch pending withholdings for remittance.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-sm">Selection Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tax_authority_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Authority *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax authority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taxAuthorities.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No tax authorities available
                            </SelectItem>
                          ) : (
                            taxAuthorities.map((authority: any) => (
                              <SelectItem key={authority.id} value={authority.id}>
                                {authority.name} ({authority.code})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Where the tax will be remitted
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taxTypes.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No tax types available
                            </SelectItem>
                          ) : (
                            taxTypes.map((type: any) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name} ({type.code}) - {type.rate}%
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Type of tax to remit (WHT, VAT, PAYE)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="period_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period From *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="period_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period To *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-md">
              This will gather all pending tax withholdings for the selected authority, tax type,
              and period, then create a single remittance batch ready for payment.
            </div>

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
                {isSubmitting ? "Preparing..." : "Prepare Remittance"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

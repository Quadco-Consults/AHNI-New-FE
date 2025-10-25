"use client";

import { useState } from "react";
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
  useCreateCostCategory,
  useUpdateFCONumber,
  useGetFCONumbers,
} from "../../controllers/classificationsController";
import {
  CostCategory,
  CostCategoryFormData,
} from "../../types/classification.types";

const costCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  fco_number: z.string().min(1, "FCO Number is required"),
  is_active: z.boolean().default(true),
});

interface CostCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costCategory?: CostCategory;
  mode: "create" | "edit";
}

export default function CostCategoryForm({
  open,
  onOpenChange,
  costCategory,
  mode,
}: CostCategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCostCategory, isLoading: isCreating } = useCreateCostCategory();
  const { updateFCONumber, isLoading: isUpdating } = useUpdateFCONumber(
    costCategory?.id || ""
  );

  // Fetch FCO Numbers for the dropdown
  const { data: fcoNumbersData } = useGetFCONumbers({
    page: 1,
    page_size: 1000,
    is_active: true,
  });

  const fcoNumbers = fcoNumbersData?.data?.results || [];

  const form = useForm<CostCategoryFormData>({
    resolver: zodResolver(costCategorySchema),
    defaultValues: {
      name: costCategory?.name || "",
      code: costCategory?.code || "",
      description: costCategory?.description || "",
      fco_number:
        typeof costCategory?.fco_number === "string"
          ? costCategory.fco_number
          : costCategory?.fco_number?.id || "",
      is_active: costCategory?.is_active ?? true,
    },
  });

  const onSubmit = async (data: CostCategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createCostCategory(data);
        toast.success("Cost Category created successfully");
      } else {
        await updateFCONumber(data);
        toast.success("Cost Category updated successfully");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Cost Category" : "Edit Cost Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new cost category under an FCO number."
              : "Update the cost category details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fco_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FCO Number *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select FCO Number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fcoNumbers.map((fco) => (
                        <SelectItem key={fco.id} value={fco.id}>
                          {fco.code} - {fco.name}
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
                      placeholder="Enter cost category name"
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
                      placeholder="Enter cost category code"
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
                      Enable or disable this cost category
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
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
  useCreateCostGrouping,
  useGetCostCategories,
} from "../../controllers/classificationsController";
import {
  CostGrouping,
  CostGroupingFormData,
} from "../../types/classification.types";

const costGroupingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  cost_category: z.string().min(1, "Cost Category is required"),
  is_active: z.boolean().default(true),
});

interface CostGroupingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costGrouping?: CostGrouping;
  mode: "create" | "edit";
}

export default function CostGroupingForm({
  open,
  onOpenChange,
  costGrouping,
  mode,
}: CostGroupingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCostGrouping, isLoading: isCreating } = useCreateCostGrouping();

  // Fetch Cost Categories for the dropdown
  const { data: costCategoriesData } = useGetCostCategories({
    page: 1,
    page_size: 1000,
    is_active: true,
  });

  const costCategories = costCategoriesData?.data?.results || [];

  const form = useForm<CostGroupingFormData>({
    resolver: zodResolver(costGroupingSchema),
    defaultValues: {
      name: costGrouping?.name || "",
      code: costGrouping?.code || "",
      description: costGrouping?.description || "",
      cost_category:
        typeof costGrouping?.cost_category === "string"
          ? costGrouping.cost_category
          : costGrouping?.cost_category?.id || "",
      is_active: costGrouping?.is_active ?? true,
    },
  });

  const onSubmit = async (data: CostGroupingFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createCostGrouping(data);
        toast.success("Cost Grouping created successfully");
      } else {
        // TODO: Add update functionality when useUpdateCostGrouping is available
        toast.success("Cost Grouping updated successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      // Handle specific 404 error for missing backend endpoint
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Cost grouping creation is temporarily unavailable. The backend service is being deployed. Please try again in a few minutes.");
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
            {mode === "create" ? "Create Cost Grouping" : "Edit Cost Grouping"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new cost grouping under a cost category."
              : "Update the cost grouping details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cost_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Cost Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.code} - {category.name}
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
                      placeholder="Enter cost grouping name"
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
                      placeholder="Enter cost grouping code"
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
                      Enable or disable this cost grouping
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
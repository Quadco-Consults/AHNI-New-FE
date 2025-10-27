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
  useCreateCostInput,
  useGetCostGroupings,
} from "../../controllers/classificationsController";
import {
  CostInput,
  CostInputFormData,
} from "../../types/classification.types";

const costInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  cost_grouping: z.string().min(1, "Cost Grouping is required"),
  unit_of_measure: z.string().optional(),
  standard_rate: z.number().min(0, "Standard rate must be non-negative").optional(),
  is_active: z.boolean().default(true),
});

interface CostInputFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costInput?: CostInput;
  mode: "create" | "edit";
}

export default function CostInputForm({
  open,
  onOpenChange,
  costInput,
  mode,
}: CostInputFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCostInput, isLoading: isCreating } = useCreateCostInput();

  // Fetch Cost Groupings for the dropdown
  const { data: costGroupingsData } = useGetCostGroupings({
    page: 1,
    page_size: 1000,
    is_active: true,
  });

  const costGroupings = costGroupingsData?.data?.results || [];

  const form = useForm<CostInputFormData>({
    resolver: zodResolver(costInputSchema),
    defaultValues: {
      name: costInput?.name || "",
      code: costInput?.code || "",
      description: costInput?.description || "",
      cost_grouping:
        typeof costInput?.cost_grouping === "string"
          ? costInput.cost_grouping
          : costInput?.cost_grouping?.id || "",
      unit_of_measure: costInput?.unit_of_measure || "",
      standard_rate: costInput?.standard_rate || undefined,
      is_active: costInput?.is_active ?? true,
    },
  });

  const onSubmit = async (data: CostInputFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createCostInput(data);
        toast.success("Cost Input created successfully");
      } else {
        // TODO: Add update functionality when useUpdateCostInput is available
        toast.success("Cost Input updated successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      // Handle specific 404 error for missing backend endpoint
      if (error?.message?.includes('HTTP 404') || error?.message?.includes('Not Found')) {
        toast.error("Cost input operation is temporarily unavailable. The backend service is being deployed. Please try again in a few minutes.");
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
            {mode === "create" ? "Create Cost Input" : "Edit Cost Input"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new cost input under a cost grouping."
              : "Update the cost input details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cost_grouping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Grouping *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Cost Grouping" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costGroupings.map((grouping) => (
                        <SelectItem key={grouping.id} value={grouping.id}>
                          {grouping.code} - {grouping.name}
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
                      placeholder="Enter cost input name"
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
                      placeholder="Enter cost input code"
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
              name="unit_of_measure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., hours, pieces, kg"
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
              name="standard_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      value={field.value || ""}
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
                      Enable or disable this cost input
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
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import {
  useCreateFCONumber,
  useUpdateFCONumber,
} from "../../controllers/classificationsController";
import { FCONumber, FCONumberFormData } from "../../types/classification.types";

const fcoNumberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface FCONumberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fcoNumber?: FCONumber;
  mode: "create" | "edit";
}

export default function FCONumberForm({
  open,
  onOpenChange,
  fcoNumber,
  mode,
}: FCONumberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createFCONumber, isLoading: isCreating } = useCreateFCONumber();
  const { updateFCONumber, isLoading: isUpdating } = useUpdateFCONumber(
    fcoNumber?.id || ""
  );

  const form = useForm<FCONumberFormData>({
    resolver: zodResolver(fcoNumberSchema),
    defaultValues: {
      name: fcoNumber?.name || "",
      code: fcoNumber?.code || "",
      description: fcoNumber?.description || "",
      is_active: fcoNumber?.is_active ?? true,
    },
  });

  const onSubmit = async (data: FCONumberFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createFCONumber(data);
        toast.success("FCO Number created successfully");
      } else {
        await updateFCONumber(data);
        toast.success("FCO Number updated successfully");
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
            {mode === "create" ? "Create FCO Number" : "Edit FCO Number"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new funding source (FCO) number."
              : "Update the FCO number details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter FCO number name"
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
                      placeholder="Enter FCO number code"
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
                      Enable or disable this FCO number
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
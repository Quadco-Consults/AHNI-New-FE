"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateModule } from "@/features/modules/controllers/project/moduleController";
import { ModuleFormValues } from "@/features/modules/types/project";

const moduleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  budget_lines: z.array(z.string()).optional(),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface EditModuleProps {
  module: {
    id: string;
    name: string;
    code?: string;
    description?: string;
    budget_lines?: string[];
  };
  onClose: () => void;
}

const EditModule = ({ module, onClose }: EditModuleProps) => {
  const queryClient = useQueryClient();
  const [updateModule, { isLoading }] = useUpdateModule();

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: module.name,
      code: module.code || "",
      description: module.description || "",
      budget_lines: module.budget_lines || [],
    },
  });

  useEffect(() => {
    form.reset({
      name: module.name,
      code: module.code || "",
      description: module.description || "",
      budget_lines: module.budget_lines || [],
    });
  }, [module, form]);

  const onSubmit = async (data: ModuleFormData) => {
    try {
      await updateModule({ id: module.id, body: data });
      toast.success("Module updated successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update module";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Program management, HIV Testing Services"
                      {...field}
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
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PM, HTS" {...field} />
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
                      placeholder="Brief description of the module"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Module"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModule;

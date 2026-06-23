"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";
import {
  ActivityHeadingSchema,
  TActivityHeadingFormData,
} from "@/features/contracts-grants/types/activity-heading";
import {
  useCreateActivityHeading,
  useUpdateActivityHeading,
  useGetSingleActivityHeading,
} from "@/features/contracts-grants/controllers/activityHeadingController";

interface CreateEditModalProps {
  open: boolean;
  onClose: () => void;
  editId?: string | null;
}

export default function CreateEditModal({ open, onClose, editId }: CreateEditModalProps) {
  const form = useForm<TActivityHeadingFormData>({
    resolver: zodResolver(ActivityHeadingSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch existing data if editing
  const { data: existingData } = useGetSingleActivityHeading(
    editId || "",
    !!editId && open
  );

  // Create and Update hooks
  const { createActivityHeading, isLoading: isCreateLoading } = useCreateActivityHeading();
  const { updateActivityHeading, isLoading: isUpdateLoading } = useUpdateActivityHeading(
    editId || ""
  );

  // Populate form when editing
  useEffect(() => {
    if (existingData?.data && editId) {
      form.reset({
        name: existingData.data.name,
        description: existingData.data.description || "",
      });
    } else if (!editId) {
      // Reset form when creating new heading
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [existingData, editId, form]);

  const onSubmit = async (data: TActivityHeadingFormData) => {
    try {
      if (editId) {
        await updateActivityHeading(data);
        toast.success("Activity Heading Updated Successfully");
      } else {
        await createActivityHeading(data);
        toast.success("Activity Heading Created Successfully");
      }
      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = isCreateLoading || isUpdateLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editId ? "Edit Activity Heading" : "Create New Activity Heading"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Heading Name"
              name="name"
              placeholder="e.g., FILES, DATA AND RECORDS"
              required
            />

            <FormInput
              label="Description"
              name="description"
              placeholder="Optional description for this heading"
              type="textarea"
            />

            <div className="flex justify-end gap-3 pt-4">
              <FormButton
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </FormButton>
              <FormButton type="submit" loading={isLoading}>
                {editId ? "Update" : "Create"}
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

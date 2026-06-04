"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormSelect from "@/components/FormSelect";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateDeliverable,
  useGetMyConsultants,
} from "../../controllers/deliverableController";
import { useEffect } from "react";

const DeliverableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  consultant: z.string().min(1, "Consultant is required"),
  deadline: z.string().min(1, "Deadline is required"),
  comments: z.string().optional(),
});

type TDeliverableFormData = z.infer<typeof DeliverableSchema>;

interface CreateDeliverableModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateDeliverableModal({
  open,
  onClose,
}: CreateDeliverableModalProps) {
  const form = useForm<TDeliverableFormData>({
    resolver: zodResolver(DeliverableSchema),
    defaultValues: {
      title: "",
      description: "",
      consultant: "",
      deadline: "",
      comments: "",
    },
  });

  // Fetch consultants
  const { data: consultantsData } = useGetMyConsultants(open);

  const { createDeliverable, isLoading, isSuccess } = useCreateDeliverable();

  const onSubmit: SubmitHandler<TDeliverableFormData> = async (data) => {
    try {
      await createDeliverable(data);
      toast.success("Deliverable assigned successfully");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to assign deliverable");
      console.error(error);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  // Prepare consultant options
  const consultantOptions = consultantsData?.data?.map((consultant) => ({
    label: `${consultant.name} (${consultant.email})`,
    value: String(consultant.id),
  })) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign New Deliverable</DialogTitle>
          <DialogDescription>
            Assign a deliverable to a consultant and set the deadline.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              form={form}
              name="title"
              label="Deliverable Title"
              placeholder="e.g., Monthly Progress Report"
              required
            />

            <FormTextArea
              form={form}
              name="description"
              label="Description"
              placeholder="Describe what needs to be delivered..."
              required
              rows={4}
            />

            <FormSelect
              form={form}
              name="consultant"
              label="Assign to Consultant"
              placeholder="Select a consultant"
              options={consultantOptions}
              required
            />

            <FormInput
              form={form}
              name="deadline"
              label="Deadline"
              type="date"
              required
            />

            <FormTextArea
              form={form}
              name="comments"
              label="Additional Comments (Optional)"
              placeholder="Any additional instructions or notes..."
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4">
              <FormButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </FormButton>
              <FormButton type="submit" isLoading={isLoading}>
                Assign Deliverable
              </FormButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

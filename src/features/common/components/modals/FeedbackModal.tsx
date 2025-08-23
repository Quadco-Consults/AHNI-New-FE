"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface FeedbackModalProps {
  onSubmit?: (data: { feedback: string }) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

const FeedbackModal = ({ onSubmit, onClose, isLoading }: FeedbackModalProps) => {
  const form = useForm();
  const { handleSubmit } = form;

  const handleFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="space-y-8">
      <DialogTitle>Feedback Form</DialogTitle>

      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormTextArea
            name="feedback"
            label="Write your Feedback"
            rows={8}
            required
          />

          <div className="flex gap-x-6 justify-end">
            <Button
              onClick={onClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <FormButton
              loading={isLoading}
              disabled={isLoading}
            >
              Create
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackModal;
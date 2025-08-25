"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface PreferredConsultantModalProps {
  onSubmit?: (data: { comments: string }) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function PreferredConsultantModal({ 
  onSubmit, 
  onClose, 
  isLoading 
}: PreferredConsultantModalProps) {
  const form = useForm();
  const { handleSubmit } = form;

  const handleFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Label className="text-[#DEA004] font-semibold">
          Justification for Selection/Other Comments (narrative)
        </Label>

        <FormTextArea label="Comments" name="comments" />

        <div className="flex items-center justify-end gap-x-5">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <FormButton type="submit" loading={isLoading}>
            Submit
          </FormButton>
        </div>
      </form>
    </Form>
  );
}